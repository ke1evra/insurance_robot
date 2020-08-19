const fs = require('fs');

module.exports = {
    async sleep(ms) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res();
            }, ms);
        });
    },
    rfSync(path){
        return JSON.parse(fs.readFileSync(path, "utf8"));
    },
    wfSync(data, path){
        try {
            let json = JSON.stringify(data, null, 4);
            fs.writeFileSync(path, json, 'utf8');
        } catch (e) {
            console.log('Ошибка при записи файла');
            console.log(e);
        } finally {

        }
    }
};
