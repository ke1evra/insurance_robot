const DataManager = require('./new-data-manager.js');
const c = require('../common.js');
const pug = require('pug');
const companies=c.rfSync('./data/json/Zebra_after_research.json');

const productsList = c.rfSync('./data/json/ProductsRatings.json')
const discountsList = c.rfSync('./data/json/DiscountsRatings.json')

const discountsAndProductsEntry = 5

const USAStates = ["al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","IN","ia","ks","ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc","nd","oh","ok","OR","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","dc","wv","wi","wy"]

const state22chars = {
	"Alabama" : "AL",
	"Alaska" : "AK",
	"Arizona" : "AZ",
	"Arkansas" : "AR",
	"California" : "CA",
	"Colorado" : "CO",
	"Connecticut" : "CT",
	"Delaware" : "DE",
	"Florida" : "FL",
	"Georgia" : "GA",
	"Hawaii" : "HI",
	"Idaho" : "ID",
	"Illinois" : "IL",
	"Indiana" : "IN",
	"Iowa" : "IA",
	"Kansas" : "KS",
	"Kentucky" : "KY",
	"Louisiana" : "LA",
	"Maine" : "ME",
	"Maryland" : "MD",
	"Massachusetts" : "MA",
	"Michigan" : "MI",
	"Minnesota" : "MN",
	"Mississippi" : "MS",
	"Missouri" : "MO",
	"Montana" : "MT",
	"Nebraska" : "NE",
	"Nevada" : "NV",
	"New Hampshire" : "NH",
	"New Jersey" : "NJ",
	"New Mexico" : "NM",
	"New York" : "NY",
	"North Carolina" : "NC",
	"North Dakota" : "ND",
	"Ohio" : "OH",
	"Oklahoma" : "OK",
	"Oregon" : "OR",
	"Pennsylvania" : "PA",
	"Rhode Island" : "RI",
	"South Carolina" : "SC",
	"South Dakota" : "SD",
	"Tennessee" : "TN",
	"Texas" : "TX",
	"Utah" : "UT",
	"Vermont" : "VT",
	"Virginia" : "VA",
	"Washington" : "WA",
	"Washington D.C." : "DC",
	"West Virginia" : "WV",
	"Wisconsin" : "WI",
	"Wyoming" : "WY",
}

var companies_compare={};
class CompanyCompareDataManager extends DataManager {
    sortArray(arr)
    {
        if(!arr.length)return arr;
        if(arr[0].length===3)
        {
            for(let i=0;i<arr.length;i++)
            {
                for(let j=i+1;j<arr.length;j++)
                {
                    if ((arr[i][1]? 1:0)  + (arr[i][2]? 1:0)<(arr[j][1]? 1:0)+(arr[j][2]? 1:0))
                    {
                        let a=arr[i];
                        arr[i]=arr[j];
                        arr[j]=a;
                    }
                }
            }
            //Сортировка в общих и частных
            for(var index=0;index<arr.length;index++)//индекс где кончается общая часть
            {
                if(arr[index][1]&&arr[index][2])
                {
                    continue
                }
                else
                    break;
            }
            for (let i=0;i<index;i++)
            {
                for(let j=i+1;j<index;j++)
                {
                    if(arr[i][0]>arr[j][0])
                    {
                        let a=arr[i];
                        arr[i]=arr[j];
                        arr[j]=a;
                    }
                }
            }
            for (let i=index;i<arr.length;i++)
            {
                for(let j=i+1;j<arr.length;j++)
                {
                    if(arr[i][0]>arr[j][0])
                    {
                        let a=arr[i];
                        arr[i]=arr[j];
                        arr[j]=a;
                    }
                }
            }
        }
        if(arr[0].length===2)
        {
            for(let i=0;i<arr.length;i++)
            {
                for(let j=i+1;j<arr.length;j++)
                {
                    if (arr[i][1]? 1:0<arr[j][1]? 1:0)
                    {
                        let a=arr[i];
                        arr[i]=arr[j];
                        arr[j]=a;
                    }
                }
            }
        }
        return arr;
    }

	checkStateAppearance(state,statesArray){
    	let result=null;
		state=state22chars[state];
		for (let item of statesArray){
			if (item[0] === state){
				result = item[1]
				break;
			}
		}
		return result
	}

	///Определяет, какую легенду добавлять на страницу:
	///0: никакой... (0);
	///1: только первая компания; (1);
	///2: только вторая компания; (2);
	///3: первая и вторая компании; (12);
	///4: только обе (3);
	///5: обе и только первая компания; (13);
	///6: обе и только вторая компания; (23);
	///7: обе и первая и вторая (123).
	checkCompaniesOnWidget(statesArray){
    	let buffResult="";
		for (let item of statesArray){
			buffResult.includes(item[1])
				? null
				: buffResult+=item[1]
		}
		((buffResult.length>1) && (buffResult.includes('0')))
			? buffResult = buffResult.replace("0","")
			: null;
		buffResult = buffResult.split('').sort().join('');
		let result;
		switch (buffResult) {
			case "0":result = 0; break;
			case "1": result = 1; break;
			case "2": result = 2; break;
			case "12": result = 3; break;
			case "3": result = 4; break;
			case "13": result = 5; break;
			case "23": result = 6; break;
			case "123": result = 7; break;
			default: result = 7; break;
		}
		return result
	}

    ///добавляет описание компании
    addDesc(company){
    	let desc = '';
		if (company["founded_year"] || company["parent_company"] || company["founded"]){
			desc+=`${company.title} was founded`
			company["founded"] ? desc += ` in ${company["founded"]}` : null
			company["founded_year"] ? desc += ` in ${company["founded_year"]}` : null
			company["parent_company"] ? desc += ` by ${company["parent_company"]}` : null
			desc+='. '
		}
        if(company["insurance_type"]===null)company["insurance_type"] = "insurance";
		desc+=`${company.title} works as `
        'aeoiyu'.includes(String(company["insurance_type"])[0].toLowerCase())
            ? desc+= 'an '
            : desc+= 'a '

            desc+=`${company["insurance_type"]} company`.toLowerCase()
		if (company["head_quoters"] || company["number_of_employees"]){
			company["number_of_employees"] ? desc+=` with a staff of ${company["number_of_employees"]} employees` : null
			company["head_quoters"] ? desc+=` with the headquarters located in  ${company["head_quoters"]}` : null
			desc+='.'
		}
		desc+='. '
		desc=desc.replace(/(\.+)/g,".").trim()
		return desc
	}

	///добавляет абзац для скидок
	addDiscDesc(company1,company2){
    	let discDesc=null;
    	if (company1["discounts"] && company2["discounts"]){
			discDesc = `${company1.title} and ${company2.title} provide various discount programs. Offers related to both companies are presented at the top of the table. Compare the available discounts and choose the best deal for you.`
    	} else if (company1["discounts"] || company2["discounts"]){
			discDesc = `${company1["discounts"]? company1.title: company2.title} provides various discounts. The table below will help you to find the most beneficial offer.`
		}
		return discDesc
    }

	///добавляет абзац для продуктов
	addProdDesc(company1,company2){
    	let prodDesc=null;
		if (company1["products"] && company2["products"]){
			prodDesc = `In addition to car insurance ${company1.title} and ${company2.title} can offer you a variety of other packages. The types of insurance related to both companies are presented at the top of the table. Compare all available offers to choose the most suitable company for you. In some cases, you can get a discount by purchasing several insurance packages in the same company.`
		} else if (company1["products"] || company2["products"]){
			prodDesc =  `In addition to car insurance ${company1["products"]? company1.title: company2.title} can offer you a variety of other packages. Look through all available offers to get if ${company1["products"]? company1.title: company2.title} is convenient for you. In some cases, you can get a discount by purchasing several insurance packages in the same company.`
		}

		return prodDesc
	}

	///добавляет абзадц для квот
    addQuoteDesc(company1,company2){
        let desc="";

        if(company1.maxRate!==null&&typeof company1.maxRate!=="undefined")
        {
            if(company2.maxRate!==null&&typeof company2.maxRate!=="undefined")
            {
                desc+=`The average price of auto insurance in ${company1.title} is about ${company1.avgRate} $, while ${company2.title} charges approximately ${company2.avgRate} $. Usually rates vary by state.`;
                if(company1.maxRate!==company1.minRate&&company2.maxRate!==company2.minRate)
                    desc+=` You can find the cheapest ${company1.title} offers in ${company1.minRateState} where monthly average rate is ${company1.minRate} $. The most expensive state average is ${company1.maxRate} $ in ${company1.maxRateState}. As for ${company2.title},the lowest rates are in ${company2.minRateState} with ${company2.minRate} $ and the most expensive state average is ${company2.maxRate} $ in ${company2.maxRateState}.`
                else if(company1.maxRate===company1.minRate&&company2.maxRate!==company2.minRate)
                    desc+=` You can find the cheapest ${company2.title} offers in ${company2.minRateState} where monthly average rate is ${company2.minRate} $. The most expensive state average is ${company2.maxRate} $ in ${company2.maxRateState}. At the moment the ${company1.title} provides services only in ${company1.minRateState}.`;
                else if(company1.maxRate!==company1.minRate&&company2.maxRate===company2.minRate)
                    desc+=` You can find the cheapest ${company1.title} offers in ${company1.minRateState} where monthly average rate is ${company1.minRate} $. The most expensive state average is ${company1.maxRate} $ in ${company1.maxRateState}. At the moment the ${company2.title} provides services only in ${company2.minRateState}.`;
                else
                    desc=`At the moment the ${company1.title} provides services only in ${company1.minRateState}. As for ${company2.title}, you can find them in ${company2.minRateState}.`;

            }
            else
            {
                if(company1.maxRate!==company1.minRate)
                    desc = `The average price of auto insurance in ${company1.title} is about ${company1.avgRate} $. Usually rates vary by state. You can find the cheapest ${company1.title} offers in ${company1.minRateState} where monthly average rate is ${company1.minRate} $. The most expensive state average is ${company1.maxRate} $ in ${company1.maxRateState}.`;
                else
                    desc = `The average price of auto insurance in ${company1.title} is about ${company1.avgRate} $. Usually rates vary by state. At the moment the ${company1.title} provides services only in ${company1.minRateState}.`;
            }
        }
        else
        {
            if(company2.maxRate!==null&&typeof company2.maxRate!=="undefined")
            {
                if(company1.maxRate!==company1.minRate)
                    desc = `The average price of auto insurance in ${company2.title} is about ${company2.avgRate} $. Usually rates vary by state. You can find the cheapest ${company2.title} offers in ${company2.minRateState} where monthly average rate is ${company2.minRate} $. The most expensive state average is ${company2.maxRate} $ in ${company2.maxRateState}.`;
                else
                    desc = `The average price of auto insurance in ${company2.title} is about ${company2.avgRate} $. Usually rates vary by state. At the moment the ${company2.title} provides services only in ${company2.minRateState}.`;
            }
            else
                return null;
        }
        return desc;
    }

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

                pageData["company1"]["short_desc"] = this.addDesc(company1);
				pageData["company2"]["short_desc"] = this.addDesc(company2);

				pageData["disc_desc"] = this.addDiscDesc(company1,company2);

				pageData["prod_desc"] = this.addProdDesc(company1,company2);

                pageData["company1"]["link"]="https://www.usainsurancerate.com/companies/"+company1["url-slug"];
                pageData["company2"]["link"]="https://www.usainsurancerate.com/companies/"+company2["url-slug"];
                //contacts
				pageData["company1"]["contacts"]={};
				pageData["company2"]["contacts"]={};

                pageData["company1"]["contacts"]["phone"]=company1["phone"];
                pageData["company2"]["contacts"]["phone"]=company2["phone"];

                pageData["company1"]["contacts"]["address"]=company1["address"];
                pageData["company2"]["contacts"]["address"]=company2["address"];

                pageData["company1"]["contacts"]["website"]=company1["website"];
                pageData["company2"]["contacts"]["website"]=company2["website"];

                if(!(company1["phone"]||company1["address"]||company1["website"]))pageData["company1"]["contacts"]=null;
                if(!(company2["phone"]||company2["address"]||company2["website"]))pageData["company2"]["contacts"]=null;
                //ratings
				pageData["company1"]["ratings"]=[];
				pageData["company2"]["ratings"]=[];
                if(company1["claims_raiting"]&&company1["claims_raiting"].toUpperCase()!=="NULL")
                    pageData["company1"]["ratings"].push(["Claims Rating",company1["claims_raiting"]]);
                if(company2["claims_raiting"]&&company2["claims_raiting"].toUpperCase()!=="NULL")
                    pageData["company2"]["ratings"].push(["Claims Rating",company2["claims_raiting"]]);

                if(company1["user_satisfaction"]&&company1["user_satisfaction"].toUpperCase()!=="NULL")
                    pageData["company1"]["ratings"].push(["User satisfaction",company1["user_satisfaction"]]);
                if(company2["user_satisfaction"]&&company2["user_satisfaction"].toUpperCase()!=="NULL")
                    pageData["company2"]["ratings"].push(["User satisfaction",company2["user_satisfaction"]]);
                if(company1["moodies"])
                    pageData["company1"]["ratings"].push(["Moodies",company1["moodies"]]);
                if(company2["moodies"])
                    pageData["company2"]["ratings"].push(["Moodies",company2["moodies"]]);

                if(company1["am_best_financial_strength"])
                    pageData["company1"]["ratings"].push(["Financial strength",company1["am_best_financial_strength"]]);
                if(company2["am_best_financial_strength"])
                    pageData["company2"]["ratings"].push(["Financial strength",company2["am_best_financial_strength"]]);

                if(company1["am_best_long_time"])
                    pageData["company1"]["ratings"].push(["Long Time ICR",company1["am_best_long_time"]]);
                if(company2["am_best_long_time"])
                    pageData["company2"]["ratings"].push(["Long Time ICR",company2["am_best_long_time"]]);

                if(company1["bbb"])
                    pageData["company1"]["ratings"].push(["BBB",company1["bbb"]]);
                if(company2["bbb"])
                    pageData["company2"]["ratings"].push(["BBB",company2["bbb"]]);
                if(pageData["company1"]["ratings"].length===0)pageData["company1"]["ratings"]=null;
                if(pageData["company2"]["ratings"].length===0)pageData["company2"]["ratings"]=null;
                //discounts
                if(company1["discounts"]||company2["discounts"])
                {
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
                            if (discountsList[company1["discounts"][k]]["value"]>=discountsAndProductsEntry)
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
                                if (discountsList[company2["discounts"][k]]["value"]>=discountsAndProductsEntry)
                                    pageData["discounts"].push([company2["discounts"][k], false, true])
                        }
                }
                else
                    pageData["discounts"]=null;
                //products
                if(company1["products"]||company2["products"])
                {
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
                            if (productsList[company1["products"][k]]["value"]>=discountsAndProductsEntry)
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
                                if (productsList[company2["products"][k]]["value"]>=discountsAndProductsEntry)
                                    pageData["products"].push([company2["products"][k],false,true])
                        }
                }
                else
                    pageData["products"]=null;
                //states appereance

                pageData["states"]=[];
                for (let item of USAStates){
					pageData["states"].push([item.toUpperCase(),company1[item] ? (company2[item] ? 3 : 1) : (company2[item]? 2 : 0)]);
				}

                pageData.CompaniesOnWidget=this.checkCompaniesOnWidget(pageData["states"]);

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
                if(company1.rates||company2.rates)
                {
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
                    if(company1.rates)
                    {
                        pageData.company1.maxQuote=company1.rates.length===0?null:company1.maxRate;
                        pageData.company1.maxQuoteState=company1.rates.length===0?null:company1.maxRateState;
                        pageData.company1.minQuote=company1.rates.length===0?null:company1.minRate;
                        pageData.company1.minQuoteState=company1.rates.length===0?null:company1.minRateState;
                        pageData.company1.avgQuote=company1.rates.length===0?null:company1.avgRate;
                    }
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
                    if(company2.rates)
                    {
                        pageData.company2.maxQuote=company2.rates.length===0?null:company2.maxRate;
                        pageData.company2.maxQuoteState=company2.rates.length===0?null:company2.maxRateState;
                        pageData.company2.minQuote=company2.rates.length===0?null:company2.minRate;
                        pageData.company2.minQuoteState=company2.rates.length===0?null:company2.minRateState;
                        pageData.company2.avgQuote=company2.rates.length===0?null:company2.avgRate;
                    }
                    pageData.quot_desc=this.addQuoteDesc(company1,company2);
                    //array-quotes(rates)
                    pageData["quotes"]=[];
                    if(company1.rates)
                        for(let k=0;k<company1.rates.length;k++)
                            pageData.quotes.push([company1.rates[k][0],company1.rates[k][1],null,this.checkStateAppearance(company1.rates[k][0],pageData["states"])]);
                    if(company2.rates)
                    {
                        for(let k=0;k<company2.rates.length;k++)
                        {
                            let found=false;
                            for(let l=0;l<pageData.quotes.length;l++)
                            {
                                if(pageData["quotes"][l][0]===company2.rates[k][0])
                                {
                                    found=true;
                                    pageData["quotes"][l][2]=company2.rates[k][1];
									pageData["quotes"][l][3]=this.checkStateAppearance(company2.rates[k][0],pageData["states"]);
                                    break;
                                }
                            }
                            if(!found)
                                pageData.quotes.push([company2.rates[k][0],null,company2.rates[k][1],this.checkStateAppearance(company2.rates[k][0],pageData["states"])]);
                        }
                    }

                }
                else
                    pageData.quotes=null;
                if(pageData.products)
                    pageData.products=this.sortArray(pageData.products);
                if(pageData.discounts)
                    pageData.discounts=this.sortArray(pageData.discounts);
                if(pageData.quotes)
                    pageData.quotes=this.sortArray(pageData.quotes);

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
        this.pageType = 'compare-companies';
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
