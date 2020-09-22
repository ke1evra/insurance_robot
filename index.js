const c = require('./common.js');
const robot = require('./robot.js');
const moment = require('moment');
const DataManager = require('./kr-data-manager.js');
const dataManager = new DataManager(); // установить dataManager который генерирует данные для добавления страниц
const entryList = c.rfSync('./data/kr/kr-goods.json'); // установить файл со списком для добавления страниц

dataManager.setPageType('tovar'); // устанавливаем тип страниц
dataManager.setPageDataSetter(dataManager.setItemPageData);
dataManager.setEntryList(entryList);

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
