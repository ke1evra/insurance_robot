const puppeteer = require('puppeteer');
const fs = require('fs');
const colors = require('colors');
const c = require('./common.js');
const creds = require('./creds/CREDS.js');
const selectors = require('./creds/selectors.js');
const PageBuilder = require('./page-builder');
const gApi = require('./google-api/googleApiManager.js');
const moment = require('moment');
moment.locale('ru');


const timeoutSetting = {
    waitUntil: 'networkidle2',
    timeout: 180 * 1000
};

const parsePostId = (url) => {
    return url.replace('https://www.usainsurancerate.com/wp-admin/post.php?post=', '').replace('&action=edit', '');
};

const robot = {
    page: null,
    async openPage(){
        try{
            this.browser = await puppeteer.launch({
                headless: true,
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
    async login(page = this.page){
        try {
            let cookiePath = './cookies/cookie.json';
            if (fs.existsSync(cookiePath)) {
                console.log('найдена кука'.green);
                let cookies = c.rfSync(cookiePath);
                for(let cookie of cookies){
                    await page.setCookie(cookie)
                }

            }else {
                console.log('кука не найдена, логинимся'.yellow);
                await this.gotoUrl(creds.loginPageUrl);
                await page.waitForSelector(selectors.loginPage.usernameInput);
                await page.type(selectors.loginPage.usernameInput, creds.username);
                await page.type(selectors.loginPage.passwordInput, creds.password);
                await c.sleep(500);
                await page.click(selectors.loginPage.rememberMeCheckbox);
                await c.sleep(500);
                await page.click(selectors.loginPage.submitBtn);
                await page.waitForNavigation(timeoutSetting);
                console.log("Логин .. ОК".green);
                c.wfSync(await page.cookies(), './cookies/cookie.json');
                console.log('кука записана'.green);
            }
            return this.page;
        } catch (e) {
            console.error('Ошибка во время логина: ', e)
        }
    },
    async checkState(type){
        const row = await gApi.getLastRowByType(type);
        if(row){
            console.log(`Последняя добавленная страница id: ${row.page_id}, entry: ${row.entry}, время: ${row.time}`.green);
            return row.entry;
        }else {
            console.log('Добавленных страниц не найдено'.red);
            return null;
        }

    },
    async fillPage(pageData, page = this.page){
        if(!pageData.entry || !pageData.type || !pageData.robotId || !pageData.entry_index){
            throw new Error('Не заданы обязательны параметры entry, type, robotId');
        }
        try{
            const startTime = moment();
            console.log(`------------\nДобавляем страницу, entry: ${pageData.entry}`.green);
            await this.gotoUrl(creds.newPageUrl);
            await page.evaluate((data) => {
                document.querySelector(data.selectors.addNewPage.descriptionTextarea).value = data.pageData.description;
                document.querySelector(data.selectors.addNewPage.seo.metaTitle).value = data.pageData.metaTitle;
                document.querySelector(data.selectors.addNewPage.seo.metaDescription).value = data.pageData.metaDescription;
                document.querySelector(data.selectors.addNewPage.titleInput).value = data.pageData.pageTitle;
            }, {pageData, selectors});
            await c.sleep(500);
            await page.select(selectors.addNewPage.parent.select, selectors.addNewPage.parent.values.autoInsurance);
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
                entry_index: pageData.entry_index,
                time: moment().format('DD.MM.YYYY HH:mm:ss'),
            });
            const consumedTime = moment().diff(startTime, 'seconds');
            console.log(`Страница сохранена, post id = ${page_id}, страница редактирования: ${page_edit_url}, адрес страницы: ${page_url}. Затрачено времени: ${consumedTime} сек.`.green);
        }catch (e) {
            console.log('Ошибка при заполнении страницы', e)
        }finally {
            await this.browser.close();
        }
    },
    async fillPages(pagesData, page = this.page){
        for(let pageData of pagesData){
            await this.fillPage(pageData);
        }

    }
};


module.exports = robot;
