const DataManager = require('./new-data-manager.js');
const c = require('../common.js');
const pug = require('pug');

const companies=c.rfSync('./data/json/companies_zebra_full.json');
var companies_compare={};
class CompanyCompareDataManager extends DataManager {
    constructor() {
        super();
        for(let i=0;i<companies.length;i++)
        {
            for(let j=i+1;j<companies.length;j++)
            {
                var company1=companies[i];
                var company2=companies[j];
                if (company1["title"]<company2["title"])
                {
                    let a=company1;
                    company1=company2;
                    company2=a;
                }
                let pageData={};
                pageData["company1"]={};
                pageData["company2"]={};
                pageData["company1"]["name"]=company1.title;
                pageData["company2"]["name"]=company2.title;

                pageData["company1"]["found"]={};
                pageData["company2"]["found"]={};

                pageData["company1"]["found"]["year"]=company1["founded_year"];
                pageData["company2"]["found"]["year"]=company2["founded_year"];

                pageData["company1"]["found"]["place"]=company1["founded"];
                pageData["company2"]["found"]["place"]=company2["founded"];

                pageData["company1"]["found"]["parent"]=company1["parent_company"];
                pageData["company2"]["found"]["parent"]=company2["parent_company"];

                pageData["company1"]["type"]=company1["insurance_type"];
                pageData["company2"]["type"]=company2["insurance_type"];

                pageData["company1"]["number_of_employees"]=company1["number_of_employees"];
                pageData["company2"]["number_of_employees"]=company2["number_of_employees"];

                pageData["company1"]["head_quoters"]=company1["head_quoters"];
                pageData["company2"]["head_quoters"]=company2["head_quoters"];

                pageData["company1"]["link"]=company1["website"];
                pageData["company2"]["link"]=company2["website"];
                //discounts
                if(company1.hasOwnProperty("discounts") && company1["discounts"])
                    if(!Array.isArray(company1["discounts"]))
                    company1["discounts"]=company1["discounts"].split("; ");
                if(company2.hasOwnProperty("discounts") && company2["discounts"])
                    if(!Array.isArray(company2["discounts"]))
                        company2["discounts"]=company2["discounts"].split("; ");
                pageData["discounts"]=[];
                if(company1["discounts"])
                    for(let i=0;i<company1["discounts"].length;i++)
                        pageData["discounts"].push([company1["discounts"][i],true,false])
                if(company2["discounts"])
                    for(let i=0;i<company2["discounts"].length;i++)
                    {
                        let found=false;
                        for(let j=0;j<pageData["discounts"].length;j++)
                        {
                            if(pageData["discounts"][0]===company2["discounts"][i])
                            {
                                pageData["discounts"][2]=true;
                                found=true;
                            }
                        }
                        if(!found)
                            pageData["discounts"].push([company2["discounts"][i],false,true])
                    }
                //products
                if(company1.hasOwnProperty("products") && company1["products"])
                    if(!Array.isArray(company1["products"]))
                        company1["products"]=company1["products"].split(", ");
                if(company2.hasOwnProperty("products") && company2["products"])
                    if(!Array.isArray(company2["products"]))
                        company2["products"]=company2["products"].split(", ");
                pageData["products"]=[];
                if(company1["products"])
                    for(let i=0;i<company1["products"].length;i++)
                        pageData["products"].push([company1["products"][i],true,false])
                if(company2["products"])
                    for(let i=0;i<company2["products"].length;i++)
                    {
                        let found=false;
                        for(let j=0;j<pageData["products"].length;j++)
                        {
                            if(pageData["products"][0]===company2["products"][i])
                            {
                                pageData["products"][2]=true;
                                found=true;
                            }
                        }
                        if(!found)
                            pageData["products"].push([company2["products"][i],false,true])
                    }
                let page_name=company1.title.split(" ").join("")+"_"+company2.title.split(" ").join("")
                pageData["page_name"]=page_name;
                    pageData["index"]=i*companies.length+j;
                //console.log(pageData);
                companies_compare[page_name]=pageData;
            }
        }
        this.data = companies_compare;
        this.pageData = {};
        this.pageFields = {};
        this.pageType = 'company_compare';
        this.entryList = companies_compare;
        //console.log(this.data);
    }

    setPageData(companies){
        this.pageData=this.data[companies]
        this.setPageType('compare-companies');
        this.pageData.company = companies;
        this.pageData.entry = companies;
        this.pageData.robotId = 1;
        this.pageData.type = 'compare-companies';

        this.pageData.entry_index = this.pageData.index;
        this.pageData.parent = 'compare-companies';
        console.log(this.pageData);
        return this.pageData;
    }

    renderDescription(){
        this.pageData.description = pug.renderFile('./templates/demo.pug', this.pageData);
    }

    renderTitle(){
        this.pageData.pageTitle = `${this.pageData["page_name"]}`;
    }

    renderMetaTitle(){
        this.pageData.metaTitle = `${this.pageData["company1"].title} and ${this.pageData["company2"].title} insurance company compare`
    }

    renderMetaDescription(){
        this.pageData.metaDescription = `Find out more about ${this.pageData.company}. Average rates, ratings, presence in states, reviews and more.`;
    }


}


// const dataManager = new CompanyDataManager();
//
// dataManager.setPageData('Allstate');
// console.log(dataManager.pageData);
// console.log(dataManager.pageFields);

module.exports = CompanyCompareDataManager;
