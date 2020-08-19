module.exports = {
    loginPage: {
        usernameInput: "#user_login",
        passwordInput: "#user_pass",
        rememberMeCheckbox: "#rememberme",
        submitBtn: "#wp-submit",
    },
    addNewPage:{
        titleInput: '#title',
        permalink:{
            editBtn: '#edit-slug-buttons > button.edit-slug.button',
            input: '#new-post-slug',
            saveBtn: '#edit-slug-buttons > button.save.button',
        },
        descriptionTextarea: '#content',
        boldGridMeta:{
            metaTabBtn: "#butterbean-manager-boldgrid_seo > ul > li:nth-child(2) > a",
            seoKeyPhraseInput: '#bgseo-custom-keyword',
            seoTitleInput: '#boldgrid-seo-field-meta_title',
            seoDescriptionInput: '#boldgrid-seo-field-meta_description',
        },
        seo: {
            metaTitle: '#autodescription_title',
            metaDescription: '#autodescription_description',
        },
        parent: {
            select: '#parent_id',
            values: {
                autoInsurance: '62',
            }
        },
        publishBtn: '#publish',
    }
};
