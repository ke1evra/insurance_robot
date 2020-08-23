const robot = require('./robot.js');
const moment = require('moment');
const StateDataManager = require('./data-manager.js');
const dataManager = new StateDataManager();

const pageData = dataManager.setStatePageData('Michigan');

(async ()=>{
    try{

        await robot.openPage();
        await robot.login();
        await robot.checkState(pageData.entry);
        await robot.fillPage(pageData);

    }catch (e) {
        console.log('Ошибка выполнения скрипта', e)
    }
})();
