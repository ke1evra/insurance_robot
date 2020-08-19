

class Creds {
    constructor() {
        this.domain = "https://www.usainsurancerate.com";
        this.username = "ko";
        this.password = "97136842qQ";
        this.loginPageUrl = `${this.domain}/wp-login.php`;
        this.newPageUrl =  `${this.domain}/wp-admin/post-new.php?post_type=page`;
    }
}


module.exports = new Creds();
