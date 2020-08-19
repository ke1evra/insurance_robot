const c = require('./common.js');
const statesList = {};
const states = {
    cheapest: c.rfSync('./data/json/states_cheapest_rates__.json'),
    goodDriver: c.rfSync('./data/json/states_good_drivers_discount__.json'),
    minReqs: c.rfSync('./data/json/states_mimimum_requirements.json'),
    regsAndDUI: c.rfSync('./data/json/states_registrations_and_dui__.json'),
    cities: c.rfSync('./data/json/states_cities_rates__.json'),
    tickets: c.rfSync('./data/json/states_tickets_affection__.json'),
    tops: c.rfSync('./data/json/states_top_fifteen_companies__.json'),
    young: c.rfSync('./data/json/states_young_drivers_rates__.json'),
};
