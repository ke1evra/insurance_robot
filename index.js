const c = require('./common.js');
const robot = require('./robot.js');
const moment = require('moment');
const DataManager = require('./data-manager/compare-companies-data-manager.js');
const dataManager = new DataManager(); // установить dataManager который генерирует данные для добавления страниц

const pageIndexMax={
	"state": 50,
	"company":143,
	"compare-companies":10294
}

const firstPageIndex=1
const lastPageIndex=5

//console.log(dataManager.data);


// Опции для разделения на несолько компов, чтобы добавлять одновременно
dataManager.filterEntryList(firstPageIndex, lastPageIndex); // опция для выбора начального и конечного элемента для добавления
dataManager.setRobotId(1); // Id робота - на каждой машине должен быть уникальным

(async ()=>{
    try{
        const lastIndex = await robot.checkState(dataManager.pageType, dataManager.robotId);
        dataManager.filterEntryList(lastIndex + 1,lastPageIndex);
		var i = 0;
		for (let item in dataManager.entryList) {
				i++;
		}
		console.log(`Будет добавлено страниц: ${i}`.green)
        await robot.openPage();
        await robot.login();
        for(let key in dataManager.entryList){
		//let key="Erie_Auto-Owners";
            console.log(key);
            const data = dataManager.setPageData(key);
            // console.log(data);
            await robot.fillPage(data);
            //break;
        }

        //await robot.fillPages(dataManager);

    }catch (e) {
        console.log('Ошибка выполнения скрипта', e)
    }
})();

