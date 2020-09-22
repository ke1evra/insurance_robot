const c = require('./common.js');


class DataManager {
    constructor() {
        this.data = null;
        this.pageData = {};
    }

    setPageDataSetter(dataSetter){
        this.setPageData = dataSetter;
    }

    setPageType(type){
        this.pageType = type;
    }

    setRobotId(id = 1){
        this.robotId = id;
    }

    setEntryList(entryList){
        this.entryList = entryList;
    }

    filterEntryList(startIndex, endIndex = Object.keys(this.entryList).length - 1){
        const filteredList = this.entryList;
        Object.keys(filteredList).map((key)=>{
            if(filteredList[key].index < startIndex || filteredList[key].index > endIndex){
                delete filteredList[key];
            }
        });
        // console.log(filteredList);
        this.entryList = filteredList;
    }
}

module.exports = DataManager;
