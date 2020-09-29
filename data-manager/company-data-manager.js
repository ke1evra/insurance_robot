const DataManager = require('./new-data-manager.js');
const c = require('../common.js');
const pug = require('pug');

const companies = {
    products_and_rates: c.rfSync('../data/json/companies_products_and_rates_.json'),
    ratings_and_contacts: c.rfSync('../data/json/companies_raitings_and_contacts.json'),
    logos: c.rfSync('../data/json/companies_logos.json'),
    states: c.rfSync('../data/json/companies_states_apearance__.json'),
    reviews: c.rfSync('../data/json/companies_reviews.json'),
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

dataManager.setPageData('Amica Insurance');
console.log(dataManager.pageData);
console.log(dataManager.pageFields);
