const c = require('./common.js');
const pug = require('pug');
const statesList = c.rfSync('./data/json/states_list.json');
const companiesLogos = c.rfSync('./data/json/companies_logos.json');
const states = {
    cheapest: c.rfSync('./data/json/states_cheapest_rates__.json'),
    goodDriver: c.rfSync('./data/json/states_good_drivers_discount__.json'),
    minReqs: c.rfSync('./data/json/states_mimimum_requirements.json'),
    regsAndDUI: c.rfSync('./data/json/states_registrations_and_dui__.json'),
    cities: c.rfSync('./data/json/states_cities_rates__.json'),
    tickets: c.rfSync('./data/json/states_tickets_affection__.json'),
    tops: c.rfSync('./data/json/states_top_fifteen_companies__.json'),
    young: c.rfSync('./data/json/states_young_drivers_rates__.json'),
    images: c.rfSync('./data/json/states_images.json'),
    insurify: c.rfSync('./data/json/states_insurify__.json'),

};

class StateDataManager {
    constructor() {
        this.data = null;
        this.pageData = {};
    }

    getStateData(state) {
        const data = {};
        data.stateTitle = statesList[state].title;
        data.stateAbbr = statesList[state].abbr;
        data.stateIndex = statesList[state].index;
        data.bgClass = statesList[state]['bg-class'];
        data.sealUrl = states.images[data.stateAbbr]['seal_url'];
        if(states.cities[state]){
            data.cities = {
                avgRate: (() => {
                    const cityData = states.cities[state];
                    let summ = 0;
                    if (cityData.length > 0) {
                        for (let i = 0; i < cityData.length; i++)
                            summ += parseInt(cityData[i]["AvgPremium"]);
                        summ = summ / cityData.length;
                    }
                    return (summ / 12).toFixed();
                })(),
                minRate: (parseInt(states.cities[state][states.cities[state].length - 1]["AvgPremium"]) / 12).toFixed(),
                maxRate: (parseInt(states.cities[state][0]["AvgPremium"]) / 12).toFixed(),
                //'три города с минимальной суммой (строка через запятую)'
                threeCheapest: (() => {
                    const cityData = states.cities[state];
                    let first_part = cityData[cityData.length - 1]["City"];
                    let second_part = cityData[cityData.length - 2]["City"];
                    let third_part = cityData[cityData.length - 3]["City"];
                    return first_part + ", " + second_part + " and " + third_part;
                })(),
                cityData: (() => {
                    let result = states.cities[state];
                    for (let i = 0; i < result.length; i++) {

                        result[i]["AvgPremium"] = (parseInt(result[i]["AvgPremium"]) / 12).toFixed();
                    }
                    return result;
                })(),
            };
        }

        data.cheapest = {
            avgRate: (() => {
                let summ = 0;
                if (states.cheapest[state].length > 0) {
                    for (let i = 0; i < states.cheapest[state].length; i++)
                        summ += parseInt(states.cheapest[state][i]["avg_annual_premium"]);
                    summ = summ / states.cheapest[state].length;
                }
                return (summ / 12).toFixed();
            })(),
            threeCheapest: (() => {
                let first_part = states.cheapest[state][0]["company_name"];
                let second_part = states.cheapest[state][1]["company_name"];
                let third_part = states.cheapest[state][2]["company_name"];
                return first_part + ", " + second_part + "and " + third_part;
            })(),
            companies: (() => {
                let result = states.cheapest[state];
                for (let i = 0; i < result.length; i++) {
                    const company = result[i].company_name;
                    result[i].logo = companiesLogos[company] !== undefined ? `${companiesLogos[company].img_url_small}` : null ;
                    result[i]["avg_annual_premium"] = (parseInt(result[i]["avg_annual_premium"]) / 12).toFixed();
                }
                return result;
            })(),
        };
        data.mostReliable = (()=>{
            const companies = states.tops[state];
            const data = [];
            companies.companies.map((item)=>{
               data.push({
                   company: item,
                   logo: companiesLogos[item] !== undefined ? `${companiesLogos[item].img_url}` : null,
               });
            });
            return data;
        })();
        // console.log(data.mostReliable);
        data.goodDrivers = {
            two_vehicles: 25,
            no_trafic_tickets: Math.round(parseFloat(states.goodDriver[state]["no_trafic_tickets"]) * 100),
            no_accidents: Math.round(parseFloat(states.goodDriver[state]["no_accidents"]) * 100),
            good_credit: Math.round(parseFloat(states.goodDriver[state]["good_credit"]) * 100),
        };
        data.youngDrivers = {
            chartData: `${(parseInt(states.young[state]["16"]) / 12).toFixed()},${(parseInt(states.young[state]["17"]) / 12).toFixed()},${(parseInt(states.young[state]["18"]) / 12).toFixed()},${(parseInt(states.young[state]["19"]) / 12).toFixed()}`,
            age16: (parseInt(states.young[state]["16"]) / 12).toFixed(),
            age17: (parseInt(states.young[state]["17"]) / 12).toFixed(),
            age18: (parseInt(states.young[state]["18"]) / 12).toFixed(),
            age19: (parseInt(states.young[state]["19"]) / 12).toFixed(),
        };
        data.ticketAffection = (() => {
                const data = [];
                let duiRateIncreasePercent = {};
                let hitAndRunRateIncreasePercent = {};
                const tickets = states.tickets[state];
                tickets.map((item)=>{
                    if(item['Violation'] === 'Hit and Run'){
                        hitAndRunRateIncreasePercent = (parseFloat(item["insurance_rate_increase_percent"]) * 100).toFixed()
                    }
                    if(item['Violation'] === 'DUI'){
                        duiRateIncreasePercent = (parseFloat(item["insurance_rate_increase_percent"]) * 100).toFixed();
                    }
                    data.push({
                        violation: item['Violation'],
                        avgRate: (parseInt(item["avg_annual_auto_insurance_rate"]) / 12).toFixed(),
                        rateIncreasePercent: (parseFloat(item["insurance_rate_increase_percent"]) * 100).toFixed(),
                        rateIncrease: (parseInt(item["insurance_rate_increase"]) / 12).toFixed(),
                    });
                });
                return {
                    data,
                    hitAndRunRateIncreasePercent,
                    duiRateIncreasePercent,
                    cheapest : `${data[data.length-1].violation}, ${data[data.length-2].violation} and ${data[data.length-3].violation}`,
                };
            })();
        data.minReqs = {
            requirements: states.minReqs[state],
            text: states.minReqs.text,
        };
        data.regsAndDUI = states.regsAndDUI[statesList[state].abbr];
        //data.insurify = states.insurify[state];
        this.data = data;
        // console.log(JSON.stringify(data,0,4));
    }

    renderStateDescription(pageData = this.data){
        const html = pug.renderFile('./templates/state.pug', pageData);
        // console.log(html);
        this.pageData.description = html;
    }

    renderStateTitle(pageData = this.data){
        this.pageData.pageTitle = `Car Insurance in ${pageData.stateTitle}`;
    }

    renderStateMetaTitle(pageData = this.data){
        this.pageData.metaTitle = `Auto Insurance Guide in ${pageData.stateTitle}`;
    }

    renderStateMetaDescription(pageData = this.data){
        this.pageData.metaDescription = `Choosing insurance companies in ${pageData.stateTitle}. Choose your state and find an insurance company fast and for free.`;
    }

    setStatePageData(state, robotId = 1){
        this.getStateData(state);
        this.pageData.type = 'state';
        this.pageData.robotId = robotId;
        this.pageData.entry = this.data.stateTitle;
        this.pageData.entry_index = this.data.stateIndex;

        this.renderStateDescription();
        this.renderStateTitle();
        this.renderStateMetaTitle();
        this.renderStateMetaDescription();
        // console.log(this.pageData);
        return this.pageData;
    }
}


const dataManager = new StateDataManager();

// dataManager.getStateData('Michigan');
// dataManager.setStatePageData('Michigan');
//super change
//dataManager.getPageData('New York'); = ПРОВЕРИТЬ
// console.log(JSON.stringify(dataManager.data,0,4));

module.exports = StateDataManager;
