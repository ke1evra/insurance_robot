const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1HPNjomVBNH5obgsjnbE2KFnTK686AzNIl1wrUI9VAgk');

const API = {
    async login(){
        return await doc.useServiceAccountAuth(require('./dolgovapi-955301a7af9e.json'));
    },
    async addRow(fields){
        await this.login();
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        // console.log(fields);
        await sheet.addRow(fields);
    },
    async getEntries(){
        await this.login();
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        return await sheet.getRows();
    }
};

module.exports = API;
