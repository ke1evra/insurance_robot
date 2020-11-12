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

                pageData["company1"]["link"]="https://www.usainsurancerate.com/companies/"+company1["url-slug"];
                pageData["company2"]["link"]="https://www.usainsurancerate.com/companies/"+company2["url-slug"];
                //discounts
                if(company1["discounts"])
                {
                    if(!Array.isArray(company1["discounts"]))
                    {
                        company1["discounts"]=company1["discounts"].split("; ");
                    }
                    pageData.company1.discounts_count=company1.discounts.length;
                }
                if(company2["discounts"])
                {
                    if(!Array.isArray(company2["discounts"]))
                    {
                        company2["discounts"]=company2["discounts"].split("; ");
                    }
                    pageData.company2.discounts_count=company2.discounts.length;
                }

                pageData["discounts"]=[];
                if(company1["discounts"])
                    for(let k=0;k<company1["discounts"].length;k++)
                        pageData["discounts"].push([company1["discounts"][k],true,false])
                if(company2["discounts"])
                    for(let k=0;k<company2["discounts"].length;k++)
                    {
                        let found=false;
                        for(let l=0;l<pageData["discounts"].length;l++)
                        {
                            if(pageData["discounts"][l][0]===company2["discounts"][k])
                            {
                                pageData["discounts"][l][2]=true;
                                found=true;
                            }
                        }
                        if(!found)
                            pageData["discounts"].push([company2["discounts"][k],false,true])
                    }
                //products
                if(company1["products"])
                {
                    if(!Array.isArray(company1["products"]))
                    {
                        company1["products"]=company1["products"].split(", ");
                    }
                    pageData.company1.products_count=company1.products.length;
                }
                if(company2["products"])
                {
                    if(!Array.isArray(company2["products"]))
                    {
                        company2["products"]=company2["products"].split(", ");
                    }
                    pageData.company2.products_count=company2.products.length;
                }
                pageData["products"]=[];
                if(company1["products"])
                    for(let k=0;k<company1["products"].length;k++)
                        pageData["products"].push([company1["products"][k],true,false])
                if(company2["products"])
                    for(let k=0;k<company2["products"].length;k++)
                    {
                        let found=false;
                        for(let l=0;l<pageData["products"].length;l++)
                        {
                            if(pageData["products"][l][0]===company2["products"][k])
                            {
                                pageData["products"][l][2]=true;
                                found=true;
                            }
                        }
                        if(!found)
                            pageData["products"].push([company2["products"][k],false,true])
                    }
                //states appereance
                pageData["states"]=[];
                pageData["states"].push(["al".toUpperCase(),company1["al"] ? (company2["al"] ? 3 : 1) : (company2["al"]? 2 : 0)]);
                pageData["states"].push(["ak".toUpperCase(),company1["ak"] ? (company2["ak"] ? 3 : 1) : (company2["ak"]? 2 : 0)]);
                pageData["states"].push(["az".toUpperCase(),company1["az"] ? (company2["az"] ? 3 : 1) : (company2["az"]? 2 : 0)]);
                pageData["states"].push(["ar".toUpperCase(),company1["ar"] ? (company2["ar"] ? 3 : 1) : (company2["ar"]? 2 : 0)]);
                pageData["states"].push(["ca".toUpperCase(),company1["ca"] ? (company2["ca"] ? 3 : 1) : (company2["ca"]? 2 : 0)]);
                pageData["states"].push(["co".toUpperCase(),company1["co"] ? (company2["co"] ? 3 : 1) : (company2["co"]? 2 : 0)]);
                pageData["states"].push(["ct".toUpperCase(),company1["ct"] ? (company2["ct"] ? 3 : 1) : (company2["ct"]? 2 : 0)]);
                pageData["states"].push(["de".toUpperCase(),company1["de"] ? (company2["de"] ? 3 : 1) : (company2["de"]? 2 : 0)]);
                pageData["states"].push(["fl".toUpperCase(),company1["fl"] ? (company2["fl"] ? 3 : 1) : (company2["fl"]? 2 : 0)]);
                pageData["states"].push(["ga".toUpperCase(),company1["ga"] ? (company2["ga"] ? 3 : 1) : (company2["ga"]? 2 : 0)]);
                pageData["states"].push(["hi".toUpperCase(),company1["hi"] ? (company2["hi"] ? 3 : 1) : (company2["hi"]? 2 : 0)]);
                pageData["states"].push(["id".toUpperCase(),company1["id"] ? (company2["id"] ? 3 : 1) : (company2["id"]? 2 : 0)]);
                pageData["states"].push(["il".toUpperCase(),company1["il"] ? (company2["il"] ? 3 : 1) : (company2["il"]? 2 : 0)]);
                pageData["states"].push(["IN".toUpperCase(),company1["IN"] ? (company2["IN"] ? 3 : 1) : (company2["IN"]? 2 : 0)]);
                pageData["states"].push(["ia".toUpperCase(),company1["ia"] ? (company2["ia"] ? 3 : 1) : (company2["ia"]? 2 : 0)]);
                pageData["states"].push(["ks".toUpperCase(),company1["ks"] ? (company2["ks"] ? 3 : 1) : (company2["ks"]? 2 : 0)]);
                pageData["states"].push(["ky".toUpperCase(),company1["ky"] ? (company2["ky"] ? 3 : 1) : (company2["ky"]? 2 : 0)]);
                pageData["states"].push(["la".toUpperCase(),company1["la"] ? (company2["la"] ? 3 : 1) : (company2["la"]? 2 : 0)]);
                pageData["states"].push(["me".toUpperCase(),company1["me"] ? (company2["me"] ? 3 : 1) : (company2["me"]? 2 : 0)]);
                pageData["states"].push(["md".toUpperCase(),company1["md"] ? (company2["md"] ? 3 : 1) : (company2["md"]? 2 : 0)]);
                pageData["states"].push(["ma".toUpperCase(),company1["ma"] ? (company2["ma"] ? 3 : 1) : (company2["ma"]? 2 : 0)]);
                pageData["states"].push(["mi".toUpperCase(),company1["mi"] ? (company2["mi"] ? 3 : 1) : (company2["mi"]? 2 : 0)]);
                pageData["states"].push(["mn".toUpperCase(),company1["mn"] ? (company2["mn"] ? 3 : 1) : (company2["mn"]? 2 : 0)]);
                pageData["states"].push(["ms".toUpperCase(),company1["ms"] ? (company2["ms"] ? 3 : 1) : (company2["ms"]? 2 : 0)]);
                pageData["states"].push(["mo".toUpperCase(),company1["mo"] ? (company2["mo"] ? 3 : 1) : (company2["mo"]? 2 : 0)]);
                pageData["states"].push(["mt".toUpperCase(),company1["mt"] ? (company2["mt"] ? 3 : 1) : (company2["mt"]? 2 : 0)]);
                pageData["states"].push(["ne".toUpperCase(),company1["ne"] ? (company2["ne"] ? 3 : 1) : (company2["ne"]? 2 : 0)]);
                pageData["states"].push(["nv".toUpperCase(),company1["nv"] ? (company2["nv"] ? 3 : 1) : (company2["nv"]? 2 : 0)]);
                pageData["states"].push(["nh".toUpperCase(),company1["nh"] ? (company2["nh"] ? 3 : 1) : (company2["nh"]? 2 : 0)]);
                pageData["states"].push(["nj".toUpperCase(),company1["nj"] ? (company2["nj"] ? 3 : 1) : (company2["nj"]? 2 : 0)]);
                pageData["states"].push(["nm".toUpperCase(),company1["nm"] ? (company2["nm"] ? 3 : 1) : (company2["nm"]? 2 : 0)]);
                pageData["states"].push(["ny".toUpperCase(),company1["ny"] ? (company2["ny"] ? 3 : 1) : (company2["ny"]? 2 : 0)]);
                pageData["states"].push(["nc".toUpperCase(),company1["nc"] ? (company2["nc"] ? 3 : 1) : (company2["nc"]? 2 : 0)]);
                pageData["states"].push(["nd".toUpperCase(),company1["nd"] ? (company2["nd"] ? 3 : 1) : (company2["nd"]? 2 : 0)]);
                pageData["states"].push(["oh".toUpperCase(),company1["oh"] ? (company2["oh"] ? 3 : 1) : (company2["oh"]? 2 : 0)]);
                pageData["states"].push(["ok".toUpperCase(),company1["ok"] ? (company2["ok"] ? 3 : 1) : (company2["ok"]? 2 : 0)]);
                pageData["states"].push(["OR".toUpperCase(),company1["OR"] ? (company2["OR"] ? 3 : 1) : (company2["OR"]? 2 : 0)]);
                pageData["states"].push(["pa".toUpperCase(),company1["pa"] ? (company2["pa"] ? 3 : 1) : (company2["pa"]? 2 : 0)]);
                pageData["states"].push(["ri".toUpperCase(),company1["ri"] ? (company2["ri"] ? 3 : 1) : (company2["ri"]? 2 : 0)]);
                pageData["states"].push(["sc".toUpperCase(),company1["sc"] ? (company2["sc"] ? 3 : 1) : (company2["sc"]? 2 : 0)]);
                pageData["states"].push(["sd".toUpperCase(),company1["sd"] ? (company2["sd"] ? 3 : 1) : (company2["sd"]? 2 : 0)]);
                pageData["states"].push(["tn".toUpperCase(),company1["tn"] ? (company2["tn"] ? 3 : 1) : (company2["tn"]? 2 : 0)]);
                pageData["states"].push(["tx".toUpperCase(),company1["tx"] ? (company2["tx"] ? 3 : 1) : (company2["tx"]? 2 : 0)]);
                pageData["states"].push(["ut".toUpperCase(),company1["ut"] ? (company2["ut"] ? 3 : 1) : (company2["ut"]? 2 : 0)]);
                pageData["states"].push(["vt".toUpperCase(),company1["vt"] ? (company2["vt"] ? 3 : 1) : (company2["vt"]? 2 : 0)]);
                pageData["states"].push(["va".toUpperCase(),company1["va"] ? (company2["va"] ? 3 : 1) : (company2["va"]? 2 : 0)]);
                pageData["states"].push(["wa".toUpperCase(),company1["wa"] ? (company2["wa"] ? 3 : 1) : (company2["wa"]? 2 : 0)]);
                pageData["states"].push(["wv".toUpperCase(),company1["wv"] ? (company2["wv"] ? 3 : 1) : (company2["wv"]? 2 : 0)]);
                pageData["states"].push(["wi".toUpperCase(),company1["wi"] ? (company2["wi"] ? 3 : 1) : (company2["wi"]? 2 : 0)]);
                pageData["states"].push(["wy".toUpperCase(),company1["wy"] ? (company2["wy"] ? 3 : 1) : (company2["wy"]? 2 : 0)]);

                pageData.company1["statesCount"]=0;
                pageData.company2["statesCount"]=0;
                for(let k=0;k<pageData.states.length;k++)
                {
                    if(pageData.states[k][1]===1)
                        pageData.company1["statesCount"]++;
                    if(pageData.states[k][1]===2)
                        pageData.company2["statesCount"]++;
                    if(pageData.states[k][1]===3)
                    {
                        pageData.company1["statesCount"]++;
                        pageData.company2["statesCount"]++;
                    }
                }
                //rates
                if(company1.rates && !Array.isArray(company1.rates))
                {
                    company1.rates=company1.rates.split(";");
                    company1.maxRate=0;
                    company1.maxRateState="";
                    company1.minRate=10000000;
                    company1.minRateState="";
                    company1.avgRate=0;
                    for(let k=0;k<company1.rates.length;k++)
                    {
                        company1.rates[k]=company1.rates[k].split(": ");
                        company1.avgRate+=parseInt(company1.rates[k][1]);
                        if(parseInt(company1.minRate)>parseInt(company1.rates[k][1]))
                        {
                            company1.minRate=parseInt(company1.rates[k][1]);
                            company1.minRateState=company1.rates[k][0];
                        }
                        if(parseInt(company1.maxRate)<parseInt(company1.rates[k][1]))
                        {
                            company1.maxRate=parseInt(company1.rates[k][1]);
                            company1.maxRateState=company1.rates[k][0];
                        }
                    }
                    company1.avgRate=Math.round(company1.avgRate/company1.rates.length);
                }
                pageData.company1.maxQuote=company1.maxRate;
                pageData.company1.maxQuoteState=company1.maxRateState;
                pageData.company1.minQuote=company1.minRate;
                pageData.company1.minQuoteState=company1.minRateState;
                pageData.company1.avgQuote=company1.avgRate;
                if(company2.rates && !Array.isArray(company2.rates))
                {
                    company2.rates=company2.rates.split(";");
                    company2.maxRate=0;
                    company2.maxRateState="";
                    company2.minRate=10000000;
                    company2.minRateState="";
                    company2.avgRate=0;
                    for(let k=0;k<company2.rates.length;k++)
                    {
                        company2.rates[k]=company2.rates[k].split(": ");
                        company2.avgRate+=parseInt(company2.rates[k][1]);
                        if(parseInt(company2.minRate)>parseInt(company2.rates[k][1]))
                        {
                            company2.minRate=parseInt(company2.rates[k][1]);
                            company2.minRateState=company2.rates[k][0];
                        }
                        if(parseInt(company2.maxRate)<parseInt(company2.rates[k][1]))
                        {
                            company2.maxRate=parseInt(company2.rates[k][1]);
                            company2.maxRateState=company2.rates[k][0];
                        }
                    }
                    company2.avgRate=Math.round(company2.avgRate/company2.rates.length);
                }
                pageData.company2.maxQuote=company2.maxRate;
                pageData.company2.maxQuoteState=company2.maxRateState;
                pageData.company2.minQuote=company2.minRate;
                pageData.company2.minQuoteState=company2.minRateState;
                pageData.company2.avgQuote=company2.avgRate;

                //array-quotes(rates)
                pageData["quotes"]=[];
                if(company1.rates)
                    for(let k=0;k<company1.rates.length;k++)
                        pageData.quotes.push([company1.rates[k][0],company1.rates[k][1],null]);
                if(company2.rates)
                {
                    for(let k=0;k<company2.rates.length;k++)
                    {
                        let found=false;
                        for(let l=0;l<pageData.quotes.length;l++)
                        {
                            if(pageData.quotes[l][0]===company2.rates[k][0])
                            {
                                found=true;
                                pageData.quotes[l][2]=company2.rates[k][1];
                                break;
                            }
                        }
                        if(!found)
                            pageData.quotes.push([company2.rates[k][0],null,company2.rates[k][1]]);
                    }
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

    setPageData(company){
        this.pageData=this.data[company]
        this.setPageType('compare-companies');
        this.pageData.company = company;
        this.pageData.entry = company;
        this.pageData.robotId = 1;
        this.pageData.type = 'compare-companies';

        this.pageData.entry_index = this.pageData.index;
        this.pageData.parent = 'compare';
        this.renderPageFields(company);
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
        this.pageData.metaTitle = `${this.pageData.company1.name} and ${this.pageData["company2"].name} insurance company compare`
    }

    renderMetaDescription(){
        this.pageData.metaDescription = `Find out more about ${this.pageData.company1.name} and ${this.pageData.company2.name}. Average rates, ratings, presence in states, reviews and more.`;
    }


}


// const dataManager = new CompanyDataManager();
//
// dataManager.setPageData('Allstate');
// console.log(dataManager.pageData);
// console.log(dataManager.pageFields);

module.exports = CompanyCompareDataManager;
