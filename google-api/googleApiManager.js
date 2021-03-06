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
    },
    async getLastRow(){
        const row = await this.getEntries();
        const lastRow = row[row.length - 1];
        const data = {};
        lastRow._sheet.headerValues.map((val, index, arr)=>{
            data[val] = lastRow._rawData[index];
        });
        return data;
    },
    async getLastRowByType(type){
        const rows = await this.getEntries();
        const headers = rows[0]._sheet.headerValues;
        const rowsWithType = [];
        rows.map((row)=>{
            if (row._rawData.includes(type)){
                rowsWithType.push(row._rawData);
            }
        });
        if(rowsWithType.length){
            const lastRow = rowsWithType[rowsWithType.length - 1];
            console.log(`Записей найдено: ${rowsWithType.length}`.green);
            const data = {};
            headers.map((val, index, arr)=>{
                data[val] = lastRow[index];
            });
            return data;
        }
        console.log(`Записей не найдено`.red);
        return null;
    },
};

module.exports = API;
