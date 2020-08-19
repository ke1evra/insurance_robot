const robot = require('./robot.js');
const moment = require('moment');

const testData = {
    entry: 'Alabama',
    title: 'Test title',
    keyPhrase: 'test key phrase',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    seoTitle: 'Test seo title',
    seoDescription: 'Test seo description',
};

(async ()=>{
    try{

        await robot.openPage();
        await robot.login();
        await robot.checkState(testData.entry);
        await robot.fillPage(testData);

    }catch (e) {
        console.log('Ошибка выполнения скрипта', e)
    }
})();
