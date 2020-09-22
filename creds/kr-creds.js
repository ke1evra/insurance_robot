

class Credentials {
    constructor() {
        this.domain = "http://vamkreslo.ru";
        this.username = "kodoist@yandex.ru";
        this.password = "MalayaIstra197";
        this.loginPageUrl = `${this.domain}/admin`;
        this.newPageUrl =  `${this.domain}/admin/site_page_add`;

    }
    editGoodsInfo(itemId){
        return `${this.domain}/admin/store_goods_edit/${itemId}/`;
    }
}


module.exports = new Credentials();
