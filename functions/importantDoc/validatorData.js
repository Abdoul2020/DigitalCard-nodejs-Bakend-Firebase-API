// check if the email is validate

const isEmail = (email) => {
    const regEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEX)) {
        return true;
    } else {
        return false;
    }
}

// is the string enter is empty
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true
    } else {
        return false
    }
}



// signUp Information from here

exports.validateSignUpData = (data) => {

    // check if the data is Empty

    let allErrors = {} //hataların objesi

    if (isEmpty(data.eMail)) {

        allErrors.eMail = "E-mail can't be Empty, Please recheck";

    } else if (!isEmail(data.eMail)) {
        allErrors.eMailFormat = "Please Enter a valid Email!"
    }

    if (isEmpty(data.publicName)) {
        allErrors.publicName = "Enter Your Name"
    }

    if (isEmpty(data.publicSurname)) {
        allErrors.publicSurname = "Enter Your SurName"
    }

    if (isEmpty(data.password)) {
        allErrors.password = "Can't be Empty"
    }



    // if (minLength(data.password)) {
    //     hatalar.password = "Şifre en az 6 karakterden oluşmalıdır."

    // }


    if (data.password !== data.confirmPassword) {
        allErrors.confirmPassword = "Passwords dont match!"
    }
    if (isEmpty(data.userHandleName)) {
        allErrors.userHandleName = "Can't be Empty!"
    }

    return {
        allErrors,
        valid: Object.keys(allErrors).length === 0 ? true : false
    }

}

//signUp card validation part
exports.validateRegisterCardRefer = (data) => {

    // check if the data is Empty

    let erreorReferRegister = {} //hataların objesi

    if (isEmpty(data.eMail)) {

        erreorReferRegister.eMail = "E-mail can't be Empty, Please recheck";

    } else if (!isEmail(data.eMail)) {
        erreorReferRegister.eMail = "Please Enter a valid Email!"
    }

    if (isEmpty(data.publicName)) {
        erreorReferRegister.publicName = "Enter Your Name"
    }

    if (isEmpty(data.publicSurname)) {
        erreorReferRegister.publicSurname = "Enter Your SurName"
    }

    if (isEmpty(data.password)) {
        erreorReferRegister.password = "Can't be Empty"
    }



    // if (minLength(data.password)) {
    //     hatalar.password = "Şifre en az 6 karakterden oluşmalıdır."

    // }


    if (data.password !== data.confirmPassword) {
        erreorReferRegister.confirmPassword = "Passwords dont match!"
    }
    if (isEmpty(data.userHandleName)) {
        erreorReferRegister.userHandleName = "Can't be Empty!"
    }

    if (isEmpty(data.secretkod)) {
        erreorReferRegister.secretkod = "cant't be Empty!!"
    }

    return {
        erreorReferRegister,
        valid: Object.keys(erreorReferRegister).length === 0 ? true : false
    }


}

//valid login Data
exports.validateLoginData = ((data) => {
    let errorLogin = {}
        //kontrol eğer gönderilen verilen boşsa kontrol yap
    if (isEmpty(data.eMail)) {
        errorLogin.eMail = "This Field can't be Empty!!"
    }
    if (isEmpty(data.password)) {
        errorLogin.password = "This field can't be Empty!!"
    }
    return {
        errorLogin,
        valid: Object.keys(errorLogin).length === 0 ? true : false
    }

})

// validation with the card url login

exports.validateLoginWithCardUrl = ((data) => {
    let errorLoginCard = {}
        //kontrol eğer gönderilen verilen boşsa kontrol yap
        // if (isEmpty(data.eMail)) {
        //     errorLoginCard.eMail = "This Field can't be Empty!!"
        // }
        // if (isEmpty(data.password)) {
        //     errorLoginCard.password = "This field can't be Empty!!"
        //}
    if (isEmpty(data.secretkod)) {
        errorLoginCard.secretkod = "This field can't be Empty!!"
    }
    if (isEmpty(data.verificationCode)) {
        errorLoginCard.verificationCode = "This field can't be Empty!!"
    }

    return {
        errorLoginCard,
        valid: Object.keys(errorLoginCard).length === 0 ? true : false
    }

})


// kontrol and change genral user data
exports.reduceGeneralUserInfo = (data) => {
    let infoData = {}

    if (!isEmpty(data.birthDate.trim())) {
        infoData.birthDate = data.birthDate
    }
    //infoData.birthDate = data.birthDate

    //website linki
    // if (!isEmpty(data.website.trim())) {
    //     //https:website.com
    //     if (data.website.trim().substring(0, 4) !== "http") {
    //         kuldtails.website = `http://${data.website.trim()}`;

    //     } else {
    //         kuldtails.website = data.website
    //     }

    // }


    // if (!isEmpty(data.gender.trim())) {
    //     infoData.gender = data.gender
    // }

    infoData.gender = data.gender

    //infoData.gender = data.gender

    if (!isEmpty(data.phoneNumber.trim())) {
        infoData.phoneNumber = data.phoneNumber
    }
    //infoData.phoneNumber = data.phoneNumber

    if (!isEmpty(data.publicName.trim())) {
        infoData.publicName = data.publicName
    }
    if (!isEmpty(data.publicSurname.trim())) {
        infoData.publicSurname = data.publicSurname
    }
    if (!isEmpty(data.userHandleName.trim())) {
        infoData.userHandleName = data.userHandleName
    }

    return infoData;

}

// kontrol and change single user data
exports.reduceSingleUserInfo = (data) => {
    let infoData = {}


    infoData.profileEmail = data.profileEmail

    infoData.phoneNumber = data.phoneNumber


    infoData.profilDescription = data.profilDescription


    infoData.publicName = data.publicName


    infoData.publicSurName = data.publicSurName


    infoData.profileAdres = data.profileAdres



    infoData.profileCompany = data.profileCompany


    infoData.profileTag = data.profileTag


    infoData.telNumber = data.telNumber



    infoData.position = data.position



    infoData.websiteUrlLink = data.websiteUrlLink


    infoData.orderOfProfile = data.orderOfProfile

    return infoData;

}

//dark theme change
exports.reduceDarkMokAktif = (data) => {
    let darkOrLight = {}
        //gece Modu
    if (!isEmpty(data.profileTheme.trim())) {
        darkOrLight.profileTheme = data.profileTheme
    }

    return darkOrLight;

}

exports.reducePositionOfSocail = (data) => {
    let socialPositionMedia = {}
        //gece Modu
    if (!isEmpty(data.placeOfSocialMediaPosition.trim())) {
        socialPositionMedia.placeOfSocialMediaPosition = data.placeOfSocialMediaPosition
    }

    return socialPositionMedia;

}


//bank Info
exports.reduceBankInfo = (data) => {
    let bankDatadtails = {}
        //accountOwner

    bankDatadtails.accountOwner = data.accountOwner


    //bankIban

    bankDatadtails.bankIban = data.bankIban

    //bankName

    bankDatadtails.bankName = data.bankName

    //bank station

    bankDatadtails.bankStation = data.bankStation


    return bankDatadtails;

}

//bank StatusMode
exports.reduceBankStatusMode = (data) => {

    let bankDatadtails = {}
        //bank station
    bankDatadtails.statueMode = data.statueMode

    return bankDatadtails;
}

//profile Url statusMode  
exports.reduceProfileUrlStatusMode = (data) => {

    let bankDatadtails = {}
        //bank station
    bankDatadtails.statueMode = data.statueMode

    return bankDatadtails;
}

// contact statuMode contact
exports.reduceContactStatusMode = (data) => {

    let contactDatadtails = {}
        //bank station
    contactDatadtails.statueMode = data.statueMode

    return contactDatadtails;

}

//fatura StatueMODE from here
exports.reduceFaturaBillStatusMode = (data) => {

    let contactDatadtails = {}
        //bank station
    contactDatadtails.statueMode = data.statueMode

    return contactDatadtails;

}


//Document to Change  reduceDocumentStatusMode
exports.reduceDocumentStatusMode = (data) => {
    let documentDatadtails = {}
        //bank station
    documentDatadtails.statueMode = data.statueMode

    return documentDatadtails;

}

//statusMode of FileUpload here 

exports.reduceFileUploadToStatusMode = (data) => {
    let fileUploadDatadtails = {}
        //bank station
    fileUploadDatadtails.statueMode = data.statueMode
    return fileUploadDatadtails;

}

//orderOfBank Id reduceOrderIdofBank
exports.reduceOrderIdofBank = (data) => {
    let orderOfBankDatadtails = {}
        //bank station
    orderOfBankDatadtails.OrderId = data.OrderId
    return orderOfBankDatadtails;

}

exports.reduceOrderIdofprofileUrl = (data) => {
    let orderOfBankDatadtails = {}
        //bank station
    orderOfBankDatadtails.OrderId = data.OrderId
    return orderOfBankDatadtails;

}

//order of Contact Here  reduceOrderIdofContact
exports.reduceOrderIdofContact = (data) => {
    let orderOfContactDatadtails = {}
        //bank station
    orderOfContactDatadtails.OrderId = data.OrderId
    return orderOfContactDatadtails;

}

// order of Document uploaded
exports.reduceOrderIdofDocument = (data) => {
    let orderOfDocumentDatadtails = {}
        //bank station
    orderOfDocumentDatadtails.OrderId = data.OrderId
    return orderOfDocumentDatadtails;

}

//order of File Uploaded
exports.reduceOrderIdofFileUploaded = (data) => {
    let orderOfFileUploadedDatadtails = {}
        //bank station
    orderOfFileUploadedDatadtails.OrderId = data.OrderId
    return orderOfFileUploadedDatadtails;

}


//updated contact panel Title from here
exports.reduceTitleUpdatePanel = (data) => {
    let titleContactUpdate = {}
        //contact station
    titleContactUpdate.panelTitle = data.panelTitle
    return titleContactUpdate;

}

//update profile Url panel title from here   

exports.reduceTitleUpdatePanelProfileUrl = (data) => {
    let titleContactUpdate = {}
        //contact station
    titleContactUpdate.panelTitle = data.panelTitle
    return titleContactUpdate;

}


//bvank panel Title   
exports.reduceTitleUpdatePanelBank = (data) => {
    let titleContactUpdate = {}
        //contact station
    titleContactUpdate.panelTitle = data.panelTitle
    return titleContactUpdate;

}

///panel Title Document   
exports.reduceTitleUpdatePanelDocument = (data) => {
    let titleContactUpdate = {}
        //contact station
    titleContactUpdate.panelTitle = data.panelTitle
    return titleContactUpdate;

}

//panle Title FileUpload   

exports.reduceTitleUpdatePanelFileUpload = (data) => {
    let titleContactUpdate = {}
        //contact station
    titleContactUpdate.panelTitle = data.panelTitle
    return titleContactUpdate;

}




//contyactData Info  reduceContactInfo

exports.reduceContactInfo = (data) => {
    let contactDatadtails = {}

    contactDatadtails.publicName = data.publicName
    contactDatadtails.publicsurname = data.publicsurname
    contactDatadtails.publicOrganization = data.publicOrganization
    contactDatadtails.profilePosition = data.profilePosition
    contactDatadtails.streetAdress = data.streetAdress
    contactDatadtails.profileCountry = data.profileCountry
    contactDatadtails.profileCity = data.profileCity
    contactDatadtails.profileNot = data.profileNot


    return contactDatadtails;

}


//update Url Panel from here    reduceUrlPanelInfo

exports.reduceUrlPanelInfo = (data) => {
    let contactDatadtails = {}
    contactDatadtails.panelUrlLink = data.panelUrlLink
    return contactDatadtails;

}

// reduce document reduceDocumentInfo
exports.reduceDocumentInfo = (data) => {
    let documentDatadtails = {}


    documentDatadtails.emailToSend = data.emailToSend



    documentDatadtails.statusNameSurname = data.statusNameSurname

    documentDatadtails.statusEmail = data.statusEmail

    documentDatadtails.statusTelefon = data.statusTelefon

    documentDatadtails.statusMessage = data.statusMessage


    documentDatadtails.publicstreetAdress = data.publicstreetAdress


    documentDatadtails.publicDropNot = data.publicDropNot

    return documentDatadtails;

}

exports.reducekulBill = (data) => {
    let userProfileBilltails = {}

    //vergi Number

    userProfileBilltails.taxNumber = data.taxNumber

    //vergi dairesi Administration

    userProfileBilltails.taxAdministration = data.taxAdministration

    //Fırma Status

    userProfileBilltails.companyStatus = data.companyStatus

    //ofis mail

    userProfileBilltails.officeEmail = data.officeEmail

    //Ofis PhoneNumber

    userProfileBilltails.officePhoneNumber = data.officePhoneNumber

    //Location

    userProfileBilltails.location = data.location



    return userProfileBilltails;

}

//fatura StatueMode from heere




//reset Password here
//validator Reset password
exports.validateResetPassordForget = ((data) => {
    let errorPersonEnter = {}
        //kontrol eğer gönderilen verilen boşsa kontrol yap
    if (isEmpty(data.eMail)) {
        errorPersonEnter.eMail = "Can't be Empty!!"
    }
    return {
        errorPersonEnter,
        valid: Object.keys(errorPersonEnter).length === 0 ? true : false
    }
})