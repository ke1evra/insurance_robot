const c = require('../common.js');



class DataManager {
    constructor() {
        this.data = null;
        this.pageData = {};
        this.robotId = 1;
        // this.renderPageFields();

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

    setPageData(){

    }


    renderDescription(){
        // console.log(html);

    }

    renderTitle(){

    }

    renderMetaTitle(){

    }

    renderMetaDescription(){

    }

    renderPageFields(){
        this.renderDescription();
        this.renderTitle();
        this.renderMetaTitle();
        this.renderMetaDescription();

    }
}

module.exports = DataManager;
