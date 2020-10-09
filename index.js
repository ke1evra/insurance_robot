const c = require('./common.js');
const robot = require('./robot.js');
const moment = require('moment');
const DataManager = require('./data-manager/company-data-manager.js');
const dataManager = new DataManager(); // установить dataManager который генерирует данные для добавления страниц





// Опции для разделения на несолько компов, чтобы добавлять одновременно
// dataManager.filterEntryList(5, 9); // опция для выбора начального и конечного элемента для добавления
// dataManager.setRobotId(1); // Id робота - на каждой машине должен быть уникальным

(async ()=>{
    try{
        const lastIndex = await robot.checkState(dataManager.pageType);
        dataManager.filterEntryList(lastIndex + 1);
        // await robot.openPage();
        // await robot.login();

        await robot.fillPages(dataManager);

    }catch (e) {
        console.log('Ошибка выполнения скрипта', e)
    }
})();
