const c = require('./common.js');

class PageBuilder {
    constructor(props) {
        this.data = {};
    }

    addData(data, name){
        try{
            this.data[name] = data;
            return this;
        }catch (e) {
            console.log(`Ошибка во время добавления данных ${name}`, e)
        }
    }

    addDataFromFile(dataFile, name){
        this.addData(c.rfSync(dataFile), name);
        return this;
    }
}

module.exports = PageBuilder;
