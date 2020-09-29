const DataManager = require('./new-data-manager.js');
const c = require('../common.js');
const pug = require('pug');

const companies = {
    products_and_rates: c.rfSync('../data/json/companies_products_and_rates_new.json'),
    ratings_and_contacts: c.rfSync('../data/json/companies_raitings_and_contacts.json'),
    logos: c.rfSync('../data/json/companies_logos.json'),
    states: c.rfSync('../data/json/companies_states_apearance__.json'),
    reviews: c.rfSync('../data/json/companies_reviews_new.json'),
    zebra: c.rfSync('../data/json/companies_zebra.json'),
    // basic: c.rfSync('../data/json/companies_basic.json'),
};

class CompanyDataManager extends DataManager {
    constructor() {
        super();
        this.data = companies;
        this.pageData = {};
        this.pageFields = {};
    }

    setPageData(company){
        const data = {};
        for(let key in this.data){
            if(this.data[key][company]){
                data[key] = this.data[key][company]
            }
        }
        this.setPageType('companies');
        this.pageData = data;
        this.pageData.company = company;
        this.pageData.entry = company;

        this.pageData.index = this.pageData.zebra.index;
        this.parent = 'companies';
        this.pageData.ratings = [];



        const z = this.pageData.zebra || null;
        const r = this.pageData.ratings_and_contacts || null;
        const p = this.pageData.products_and_rates || null;
        const s = this.pageData.states || null;

        if(p){
            if(p.products){
                this.pageData.products = p.products;
            }

            if(p.rates){
                this.pageData.rates = p.rates;
                this.pageData.avgRate = Math.round(Object.keys(p.rates).reduce((acc, key)=>{
                    acc+= parseFloat(p.rates[key]);
                    return acc;
                }, 0) / Object.keys(p.rates).length);
                if(Object.keys(p.rates).length > 1){
                    this.pageData.minRate = {rate: 0, state: null};
                    this.pageData.maxRate = {rate: 0, state: null};
                    for(let key in p.rates){
                        const rate = Math.round(parseFloat(p.rates[key]));
                        if(this.pageData.maxRate.rate < rate){
                            this.pageData.maxRate.rate = rate;
                            this.pageData.maxRate.state = key;
                        }
                        if(this.pageData.minRate.rate === 0 || this.pageData.minRate.rate > rate){
                            this.pageData.minRate.rate = rate;
                            this.pageData.minRate.state = key;
                        }
                    }
                }
            }
        }

        this.pageData.shortDesc = `Below you can find important information about ${company} such as US state presence, ratings, contacts, rates and mush more. `;

        if(z.founded){
            this.pageData.shortDesc += `${company} was founded in ${z.founded}. `;
            this.pageData.ratings.push({name: 'year founded', val: z.founded});
        }
        if(z.headquater){
            this.pageData.shortDesc += `The headquarters is located in ${z.headquater}. `;
        }
        if(z.claims_raiting){
            this.pageData.shortDesc += `The claims raiting of ${company} is ${z.claims_raiting} `;
            this.pageData.ratings.push({name: 'Claims Rating', val: z.claims_raiting});
        }
        if(z.user_satisfaction){
            this.pageData.shortDesc += `User satisfaction score is ${z.user_satisfaction}. `;
            this.pageData.ratings.push({name: 'User satisfaction', val: z.user_satisfaction});
        }


        if(r.moodies){
            this.pageData.ratings.push({name: 'Moodies', val: r.moodies});
        }
        if(r.am_best_financial_strength){
            this.pageData.ratings.push({name: 'Financial strength', val: r.am_best_financial_strength});
        }
        if(r.am_best_long_time){
            this.pageData.ratings.push({name: 'Long Time ICR', val: r.am_best_long_time});
        }
        if(r.bbb){
            this.pageData.ratings.push({name: 'BBB', val: r.bbb});
        }


        if(z.discounts){
            this.pageData.discounts = z.discounts;
        }

        if(s){
            this.pageData.statesCount = Object.keys(s).reduce((acc, key)=> {
                s[key] === true ? acc++ : null;
                return acc;
            }, 0)
        }

        this.renderPageFields(company);
    }

    renderDescription(){
        this.pageFields.description = pug.renderFile('../templates/companies.pug', this.pageData);
    }

    renderTitle(){
        this.pageFields.pageTitle = `${this.pageData.company}`;
    }

    renderMetaTitle(){
        this.pageFields.metaTitle = `${this.pageData.company} insurance company`
    }

    renderMetaDescription(){
        this.pageFields.metaDescription = `Find out more about ${this.pageData.company}. Average rates, ratings, presence in states, reviews and more.`;
    }


}


const dataManager = new CompanyDataManager();

dataManager.setPageData('SECURA');
console.log(dataManager.pageData);
console.log(dataManager.pageFields);
