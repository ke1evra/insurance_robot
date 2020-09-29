const DataManager = require('./data-manager/new-data-manager.js');
const c = require('./common.js');
const krData = c.rfSync('./data/kr/kr.json');
const krGoodsData = c.rfSync('./data/kr/kr-goods.json');

class KrDataManager extends DataManager{
    constructor() {
        super();
        this.groupData();
    }

    groupData(){
        const filteredData = [];
        krData.map((item)=>{
            const name = item.prop_name.toLowerCase();
            const val = item.prop_value.toLowerCase();
            if(!filteredData[name]){
                filteredData[name] = {};
            }
            if(!filteredData[name][val]){
                filteredData[name][val] = {
                    prop_title: item.prop_title,
                    prop_text: item.prop_text,
                    prop_image: item.prop_image,
                };
            }
        });
        this.data = filteredData;
        // console.log(this.data);
    }

    getItemData(itemId){
        this.itemData = krGoodsData[itemId];
        // console.log(this.itemData);
    }
    renderDescription(itemData = this.itemData){
        const renderHtml = (innerHtml)=>{
            return `<div class="desc">
                        ${innerHtml}
                    </div>`;
        };
        let innerHtml = '';
        let reversed = true;
        let data = this.data;
        Object.keys(itemData).map(function (item){
            // console.log(item);
            const name = item.toString().toLowerCase();
            const val = itemData[item] ? itemData[item].toString().toLowerCase() : null;
            if(data[name]){
                if(data[name][val]){
                    const descData = data[name][val];

                    if(reversed){
                        innerHtml+= `<div class="desc__item" title="${descData.prop_title}">
                            <div class="desc__pic"><img src="${descData.prop_image}" alt="${descData.prop_title}"></div>
                            <div class="desc__def">
                                <div class="desc__title">${descData.prop_title}</div>
                                <div class="desc__text">${descData.prop_text}</div>
                            </div>
                        </div>`
                    }else{
                        innerHtml+= `<div class="desc__item reverse" title="${descData.prop_title}">
                            <div class="desc__def">
                                <div class="desc__title">${descData.prop_title}</div>
                                <div class="desc__text">${descData.prop_text}</div>
                            </div>
                            <div class="desc__pic"><img src="${descData.prop_image}" alt="${descData.prop_title}"></div>
                        </div>`
                    }
                    reversed = !reversed;
                    // console.log(data[name][val]);
                }
            }
        });
        this.pageData.description = renderHtml(innerHtml);
        // console.log(this.pageData.description);
    }

    setItemPageData(itemId, robotId = 1){
        this.getItemData(itemId);
        this.pageData.itemId = itemId;
        this.pageData.type = 'tovar';
        this.pageData.robotId = robotId;
        this.pageData.entry = this.itemData.model;
        this.pageData.entry_index = this.itemData.index;

        this.renderDescription();
        // console.log(this.pageData);
        return this.pageData;
    }
}

const dm = new KrDataManager();



// dm.setItemPageData(9530543);

module.exports = KrDataManager;
