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

module.exports = {
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
        console.log(`${'Переходим на страницу'.cyan} ${url.cyan}`);
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
                await this.gotoUrl(creds.newPageUrl);
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
    async fillPage(page = this.page){
        try{
            const builder = new PageBuilder();
            const testData = {
                title: 'Test title',
                keyPhrase: 'test key phrase',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                seoTitle: 'Test seo title',
                seoDescription: 'Test seo description',
            };
            builder.addData(testData, 'current');
            await page.evaluate((data) => {
                document.querySelector(data.selectors.addNewPage.descriptionTextarea).value = data.testData.description;
                document.querySelector(data.selectors.addNewPage.seo.metaTitle).value = data.testData.seoTitle;
                document.querySelector(data.selectors.addNewPage.seo.metaDescription).value = data.testData.seoDescription;
                document.querySelector(data.selectors.addNewPage.titleInput).value = data.testData.title;
            }, {testData, selectors});
            await c.sleep(500);
            await page.select(selectors.addNewPage.parent.select, selectors.addNewPage.parent.values.autoInsurance);
            await c.sleep(500);
            await page.click(selectors.addNewPage.publishBtn);
            await page.waitForNavigation(timeoutSetting);
            const page_url = page.url();
            const page_id = parsePostId(page_url);
            // await gApi.getEntries();
            await gApi.addRow({
                page_id,
                page_url,
                page_title: testData.title,
                time: moment().format('DD.MM.YYYY HH:mm:ss'),
            });
            console.log(`Страница сохранена, post id = ${page_id}`.green);
        }catch (e) {
            console.log('Ошибка при заполнении страницы', e)
        }finally {
            // shell.exec('pkill chrome');
            await this.browser.close();
        }


    }
};

