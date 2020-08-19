const robot = require('./robot.js');
const moment = require('moment');


(async ()=>{
    try{
        const startTime = moment();
        await robot.openPage();
        await robot.login();
        await robot.fillPage();
        const consumedTime = moment().diff(startTime, 'seconds');
        console.log(`Скрипт выполнен успешно. Затрачено времени: ${consumedTime} сек.`.green);
    }catch (e) {
        console.log('Ошибка выполнения скрипта', e)
    }
})();
