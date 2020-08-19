const c = require('./common.js');
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
};

const statesPageData = (state)=>{
    const data = {};
    data.stateTitle = statesList[state].title;
    data.stateAbbr = statesList[state].abbr;
    data.bgClass = statesList[state]['bg-class'];
    data.cities = {
        avgRate : (()=>{
            const cityData = states.cities[state];
            return 'среднее значение по городам';
        })(),
        minRate: 'мин значение по городам',
        maxRate: 'макс значение по города',
        threeCheapest: 'три города с минимальной суммой (строка через запятую)'
    };
    data.cheapest = {

    };
    data.mostReliable = {

    };
    data.goodDrivers = {

    };
    data.youngDrivers = {

    };
    return data;
};

const testData = statesPageData('New York');
console.log(testData);
