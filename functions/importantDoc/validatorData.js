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


    if (!isEmpty(data.gender.trim())) {
        infoData.gender = data.gender
    }

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

    if (!isEmpty(data.profileEmail.trim())) {
        infoData.profileEmail = data.profileEmail
    }

    if (!isEmpty(data.phoneNumber.trim())) {
        infoData.phoneNumber = data.phoneNumber
    }

    if (!isEmpty(data.profilDescription.trim())) {
        infoData.profilDescription = data.profilDescription
    }
    if (!isEmpty(data.publicName.trim())) {
        infoData.publicName = data.publicName
    }
    if (!isEmpty(data.publicSurName.trim())) {
        infoData.publicSurName = data.publicSurName
    }
    if (!isEmpty(data.profileAdres.trim())) {
        infoData.profileAdres = data.profileAdres
    }

    if (!isEmpty(data.profileCompany.trim())) {
        infoData.profileCompany = data.profileCompany
    }
    if (!isEmpty(data.profileTag.trim())) {
        infoData.profileTag = data.profileTag
    }
    if (!isEmpty(data.telNumber.trim())) {
        infoData.telNumber = data.telNumber
    }

    if (!isEmpty(data.position.trim())) {
        infoData.position = data.position
    }

    return infoData;

}