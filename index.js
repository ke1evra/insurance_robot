const c = require('./common.js');
const robot = require('./robot.js');
const moment = require('moment');
const DataManager = require('./data-manager/compare-companies-data-manager.js');
const dataManager = new DataManager(); // установить dataManager который генерирует данные для добавления страниц


//console.log(dataManager.data);


// Опции для разделения на несолько компов, чтобы добавлять одновременно
//dataManager.filterEntryList(49, 49); // опция для выбора начального и конечного элемента для добавления
//dataManager.setRobotId(2); // Id робота - на каждой машине должен быть уникальным

(async ()=>{
    try{
        const lastIndex = await robot.checkState(dataManager.pageType);
        dataManager.filterEntryList(lastIndex + 1);

        await robot.openPage();
        await robot.login();
        for(let key in dataManager.entryList){
            console.log(key);
            const data = dataManager.setPageData(key);
            // console.log(data);
            await robot.fillPage(data);
            break;
        }

        //await robot.fillPages(dataManager);

    }catch (e) {
        console.log('Ошибка выполнения скрипта', e)
    }
})();

