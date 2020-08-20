const c = require('./common.js');
const pug = require('pug');
const statesList = c.rfSync('./data/json/states_list.json');
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

class DataManager {
    constructor() {
        this.data = null;
        this.pageData = {};
    }

    getPageData(state) {
        const data = {};
        data.stateTitle = statesList[state].title;
        data.stateAbbr = statesList[state].abbr;
        data.bgClass = statesList[state]['bg-class'];
        data.cities = {
            avgRate: (() => {
                const cityData = states.cities[state];
                let summ = 0;
                if (cityData !== 'undefined' && cityData.length > 0) {
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
                return first_part + "," + second_part + "," + third_part;
            })(),
            companies: (() => {
                let result = states.cheapest[state];
                for (let i = 0; i < result.length; i++) {
                    result[i]["avg_annual_premium"] = (parseInt(result[i]["avg_annual_premium"]) / 12).toFixed();
                }
                return result;
            })(),
        };
        data.mostReliable = {
            companies: states.tops[state],
        };
        data.goodDrivers = {
            no_trafic_tickets: (parseFloat(states.goodDriver[state]["no_trafic_tickets"]) * 100).toFixed(2),
            no_accidents: (parseFloat(states.goodDriver[state]["no_accidents"]) * 100).toFixed(2),
            good_credit: (parseFloat(states.goodDriver[state]["good_credit"]) * 100).toFixed(2),
        };
        data.youngDrivers = {
            age16: (parseInt(states.young[state]["16"]) / 12).toFixed(),
            age17: (parseInt(states.young[state]["17"]) / 12).toFixed(),
            age18: (parseInt(states.young[state]["18"]) / 12).toFixed(),
            age19: (parseInt(states.young[state]["19"]) / 12).toFixed(),
        };
        data.violations = {
            hitAndRun: (() => {
                for (let i = 0; i < states.tickets[state].length; i++) {
                    if (states.tickets[state][i]["Violation"] === "Hit and Run")
                        return (parseFloat(states.tickets[state][i]["insurance_rate_increase_percent"]) * 100).toFixed();
                }
            })(),
            DUI: (() => {
                for (let i = 0; i < states.tickets[state].length; i++) {
                    if (states.tickets[state][i]["Violation"] === "DUI")
                        return (parseFloat(states.tickets[state][i]["insurance_rate_increase_percent"]) * 100).toFixed();
                }
            })(),
            ticket: (() => {
                let result = states.tickets[state];
                for (let i = 0; i < result.length; i++) {
                    result[i]["avg_annual_auto_insurance_rate"] = (parseInt(result[i]["avg_annual_auto_insurance_rate"]) / 12).toFixed();
                    result[i]["insurance_rate_increase_percent"] = (parseFloat(result[i]["insurance_rate_increase_percent"]) * 100).toFixed();
                    result[i]["insurance_rate_increase"] = (parseInt(result[i]["insurance_rate_increase"]) / 12).toFixed();
                }
            })(),
        };
        data.minReqs = {
            requirements: states.minReqs[state],
        };
        data.regsAndDUI = states.regsAndDUI[statesList[state].abbr];
        //data.insurify = states.insurify[state];
        this.data = data;
        // console.log(JSON.stringify(data,0,4));
    }

    renderDescription(pageData = this.data){
        const html = pug.renderFile('./templates/state.pug', pageData);
        console.log(html);
        this.pageData.description = html;
    }
}


const dataManager = new DataManager();

dataManager.getPageData('Iowa');
dataManager.renderDescription();
//dataManager.getPageData('New York'); = ПРОВЕРИТЬ
// console.log(JSON.stringify(dataManager.data,0,4));
