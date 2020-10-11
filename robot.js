const puppeteer = require('puppeteer');
const fs = require('fs');
const colors = require('colors');
const c = require('./common.js');
const creds = require('./creds/CREDS.js');
// const creds = require('./creds/kr-creds.js');
const selectors = require('./creds/selectors.js');
const PageBuilder = require('./page-builder');
const gApi = require('./google-api/googleApiManager.js');
const moment = require('moment');
moment.locale('ru');


const timeoutSetting = {
    waitUntil: 'networkidle2',
    timeout: 180 * 1000
};


const robot = {
    page: null,
    async openPage(){
        try{
            this.browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            console.log('Новая страница открыта'.green);
            return this.page;
        }catch (e) {
            console.error('Ошибка при открытии новой страницы', e);
        }
    },
    async gotoUrl(url, page = this.page){
        // console.log(`${'Переходим на страницу'.cyan} ${url.cyan}`);
        await page.goto(url, timeoutSetting);
    },
    async loginStoreLand(page = this.page){
        await this.gotoUrl(creds.loginPageUrl);
        await page.waitForSelector('#user_mail');
        await page.type('#user_mail',creds.username);
        await page.type('#user_pass', creds.password);
        await c.sleep(500);
        await page.click("body > div.wrapper > div > div > li:nth-child(1) > div > div > div > div > form > div:nth-child(9) > div > input");
        await page.waitForNavigation();
        console.log("  Логин .. ОК\n");
        console.log(`----------------------------------------------------------------------------------------------\n`);
        return 'success'
    },

    async loginWordPress(page){
        await this.gotoUrl(creds.loginPageUrl);
        await page.waitForSelector(selectors.loginPage.usernameInput);
        await page.type(selectors.loginPage.usernameInput, creds.username);
        await page.type(selectors.loginPage.passwordInput, creds.password);
        await c.sleep(500);
        await page.click(selectors.loginPage.rememberMeCheckbox);
        await c.sleep(500);
        await page.click(selectors.loginPage.submitBtn);
        await page.waitForNavigation(timeoutSetting);
        return 'success'
    },

    async login(page = this.page, logger, cookieName = 'cookie'){
        try {
            let cookiePath = `./cookies/${cookieName}.json`;
            if (fs.existsSync(cookiePath)) {
                console.log('найдена кука'.green);
                let cookies = c.rfSync(cookiePath);
                for(let cookie of cookies){
                    await page.setCookie(cookie)
                }

            } else {
                console.log('кука не найдена, логинимся'.yellow);
                const status = await this.loginWordPress(page);
                if(status === 'success'){
                    console.log("Логин .. ОК".green);
                    c.wfSync(await page.cookies(), `./cookies/${cookieName}.json`);
                    console.log('кука записана'.green);
                }
            }
            return this.page;
        } catch (e) {
            console.error('Ошибка во время логина: ', e)
            throw new Error(e);
        }
    },
    async checkState(type){
        const row = await gApi.getLastRowByType(type);
        if(row){
            console.log(`Последняя добавленная страница id: ${row.page_id}, entry: ${row.entry}, entry_index: ${row.entry_index}, время: ${row.time}`.green);
            return parseInt(row.entry_index);
        }else {
            console.log('Добавленных страниц не найдено'.red);
            return null;
        }

    },

    async fillPageStoreLand(page, pageData){
        const pageUrl = creds.editGoodsInfo(pageData.itemId);
        console.log(pageUrl);
        await this.gotoUrl(pageUrl);
        await page.waitForSelector('#cke_65');
        await c.sleep(500);
        await page.click('#cke_65');
        await page.evaluate((pageData) => {
            document.querySelector('#cke_1_contents > textarea').value = pageData.description;
        }, pageData);
        await c.sleep(500);
        await page.click('#contentmain > form > div > table > tfoot > tr:nth-child(2) > td > div > input');
        await page.waitForNavigation(timeoutSetting);

        await gApi.addRow({
            entry_id: pageData.itemId,
            entry: pageData.entry,
            type: pageData.type,
            robot_id: pageData.robotId,
            entry_index: pageData.entry_index,
            time: moment().format('DD.MM.YYYY HH:mm:ss'),
        });
    },

    async fillPageWordPress(page, pageData){
        const parsePostId = (url) => {
            return url.replace('https://www.usainsurancerate.com/wp-admin/post.php?post=', '').replace('&action=edit', '');
        };
        await this.gotoUrl(creds.newPageUrl);
        await page.evaluate((data) => {
            document.querySelector(data.selectors.addNewPage.descriptionTextarea).value = data.pageData.description;
            document.querySelector(data.selectors.addNewPage.seo.metaTitle).value = data.pageData.metaTitle;
            document.querySelector(data.selectors.addNewPage.seo.metaDescription).value = data.pageData.metaDescription;
            document.querySelector(data.selectors.addNewPage.titleInput).value = data.pageData.pageTitle;
        }, {pageData, selectors});
        await c.sleep(500);
        await page.select(selectors.addNewPage.parent.select, selectors.addNewPage.parent.values[pageData.parent]);
        await c.sleep(500);
        await page.click(selectors.addNewPage.publishBtn);
        await page.waitForNavigation(timeoutSetting);
        const page_edit_url = page.url();
        const page_url = await page.evaluate((selectors)=>{
            return document.querySelector(selectors.addNewPage.permalink.link).getAttribute('href');
        }, selectors);
        const page_id = parsePostId(page_edit_url);
        await gApi.addRow({
            page_id,
            page_edit_url,
            page_url,
            type: pageData.type,
            page_title: pageData.title,
            entry: pageData.entry,
            robot_id: pageData.robotId,
            entry_index: pageData.entry_index,
            time: moment().format('DD.MM.YYYY HH:mm:ss'),
        });
    },
    async fillPage(pageData, page = this.page){
        if(!pageData.entry || !pageData.type || !pageData.robotId || !pageData.entry_index){
            console.log(pageData);
            throw new Error('Не заданы обязательны параметры entry, type, robotId, entry_index');
        }
        try{

            const startTime = moment();
            console.log(`------------\nДобавляем страницу, entry: ${pageData.entry}`.green);
            await this.fillPageWordPress(page, pageData);
            const consumedTime = moment().diff(startTime, 'seconds');
            console.log(`Страница сохранена. Затрачено времени: ${consumedTime} сек.`.green);
        }catch (e) {
            console.log('Ошибка при заполнении страницы', e)
        }finally {
            // await this.browser.close();
        }
    },

    async fillPages(dataManager, options = null){
        try{
            await robot.openPage();
            await robot.login();
            // Object.keys(dataManager.entryList).map(async function(key){
            //     const data = dataManager.setPageData(key);
            //     await this.fillPage(data);
            // });
            for(let key in dataManager.entryList){
                const data = dataManager.setPageData(key);
                // console.log(data);
                await this.fillPage(data);
            }
        }catch (e) {
            console.log('Ошибка при заполнении страницы', e)
        }finally {
            // await this.browser.close();
        }
    }


};


module.exports = robot;
