const { db, admin } = require("../importantDoc/admin");


// initialize App here
const firebaseConfig = require("../importantDoc/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);


const {
    validateSignUpData,
    validateLoginData,
    validateRegisterCardRefer,
    reduceGeneralUserInfo,
    reduceSingleUserInfo,
    reduceContactStatusMode,
    reduceFaturaBillStatusMode,
    reducekulBill,
    reduceDarkMokAktif,
    reduceBankStatusMode,
    reduceProfileUrlStatusMode,
    reducePositionOfSocail,
    reduceDocumentStatusMode,
    reduceFileUploadToStatusMode,
    reduceOrderIdofBank,
    reduceOrderIdofprofileUrl,
    reduceDocumentInfo,
    reduceBankInfo,
    reduceContactInfo,
    validateResetPassordForget,
    reduceOrderIdofContact,
    reduceOrderIdofDocument,
    reduceOrderIdofFileUploaded,
    reduceTitleUpdatePanel,
    reduceTitleUpdatePanelBank,
    reduceTitleUpdatePanelDocument,
    reduceTitleUpdatePanelFileUpload,
    reduceTitleUpdatePanelProfileUrl,
    reduceUrlPanelInfo


} = require("../importantDoc/validatorData");
const { user } = require("firebase-functions/v1/auth");


exports.registerClass = (req, res) => {

    const newPersonInfo = {
        eMail: req.body.eMail,
        publicName: req.body.publicName,
        publicSurname: req.body.publicSurname,
        userHandleName: req.body.userHandleName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    const { valid, allErrors } = validateSignUpData(newPersonInfo);

    if (!valid) {
        return res.status(400).json({ allErrors });
    }

    // the Image will bbe in hold for some second
    //const defaultImage = "no-img.png"
    //const backImag = "back-img.jpg"
    //const checkUserHandleName = db.collection("userGeneral").where("userHandleName", "==", req.body.userHandleName)

    let generalToken
    let generalUserId

    singleUserData = {}
    db.collection("userGeneral").where("userHandleName", "==", newPersonInfo.userHandleName).get().then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push(
                doc.data())
        })

    }).then(() => {


        if (singleUserData.dataInfo.length > 0 && singleUserData.dataInfo[0].userHandleName == newPersonInfo.userHandleName) {
            return res.status(400).json({ userHabdleExist: "This userHandle has already registered" });

        }
        console.log("isism kontrtolu:", singleUserData.dataInfo)

    }).then(() => {

        console.log("hata girmiyor")

        db.doc(`/userGeneral/${newPersonInfo.eMail}`).get().then((doc) => {

            if (doc.exists) {
                return res.status(400).json({ eMailAccountExist: "This Email has already registered" });
            } else {

                return firebase.auth().createUserWithEmailAndPassword(newPersonInfo.eMail, newPersonInfo.password);

            }

        }).then((data) => {
            generalUserId = data.user.uid;
            return data.user.getIdToken();

        }).then((tokenReceived) => {
            generalToken = tokenReceived


            const userCredentials = {
                eMail: newPersonInfo.eMail,
                publicName: newPersonInfo.publicName,
                publicSurname: newPersonInfo.publicSurname,
                generalUserId,
                userHandleName: newPersonInfo.userHandleName,
                startDateCount: new Date().toISOString(),
                birthDate: "",
                phoneNumber: "",
                gender: 0,
                cardPairing: ""
            }

            return db.doc(`/userGeneral/${newPersonInfo.eMail}`).set(userCredentials);

        }).then(() => {
            res.status(201).json({ generalToken });
        }).catch((err) => {
            console.error(err);
            if (err.code == "auth/email-already-in-use") {
                return res.status(400).json({ Error: "This Email is already in use...!" })
            } else if (err.code == "auth/weak-password") {
                return res.status(400).json({ Error: "password must be at least 6 charachter!" })
            } else {
                return res.status(500).json({ GeneralError: "Something went wrong with the backend, please try again!!" })
            }
        })

    }).catch((err) => {
        res.status(400).json({ errorHere: "error here" })
    })

}

// card refer to another url not workinkg anymore
exports.registerClassUrlReference = (req, res) => {

    const newPersonUrlRefer = {
        eMail: req.body.eMail,
        publicName: req.body.publicName,
        publicSurName: req.body.publicSurName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandleName: req.body.userHandleName,
        secretkod: req.body.secretkod
    }

    const { valid, erreorReferRegister } = validateRegisterCardRefer(newPersonUrlRefer);

    if (!valid) {
        return res.status(400).json({ erreorReferRegister });
    }

    //const noImg="no-image.png"
    //const backImg="baha2.jpg"
    let generalToken
    let generalUserId
    db.doc(`/userGeneral/${newPersonInfo.eMail}`).get().then(doc => {
        if (doc.exists) {
            return res.status(400).json({ eMail: "This Email has already registred." });
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newPersonInfo.eMail, newPersonInfo.password);
        }

    }).then((data) => {
        generalUserId = data.user.uid;
        return data.user.getIdToken();
    }).then((tokenReceived) => {
        generalToken = tokenReceived

        const userCredentials = {
            eMail: newPersonInfo.eMail,
            publicName: newPersonInfo.publicName,
            publicSurname: newPersonInfo.publicSurname,
            generalUserId,
            userHandleName: newPersonInfo.userHandleName,
            birthDate: "",
            phoneNumber: "",
            gender: "",
            cardPairing: "",
            verificationkod: "",
            secretkod: newPersonUrlRefer.secretkod
        }
        return (
            db.doc(`/userGeneral/${newPersonInfo.eMail}`).set(userCredentials),
            db.doc(`/cardUrlLinks/${newPersonUrlRefer.secretkod}`).set(userCredentials)
        )

    }).then(() => {
        res.status(201).json({ generalToken });
    }).catch((err) => {
        console.error(err);
        if (err.code == "auth/email-already-in-use") {
            return res.status(400).json({ Error: "This Email is already in use...!" })
        } else if (err.code == "auth/weak-password") {
            return res.status(400).json({ Error: "password must be at least 6 charachter!" })
        } else {
            return res.status(500).json({ GeneralError: "Something went wrong with the backend, please try again!!" })
        }
    })

}


exports.loginClass = (req, res) => {

    const loginPerson = {
        eMail: req.body.eMail,
        password: req.body.password
    }

    const { valid, errorLogin } = validateLoginData(loginPerson);
    if (!valid) {
        return res.status(400).json({ errorLogin });
    } else {

        firebase.auth().signInWithEmailAndPassword(loginPerson.eMail, loginPerson.password).then((data) => {
            return data.user.getIdToken()
        }).then((givenToken) => {
            return res.status(201).json({ LoginToken: givenToken })
        }).catch(err => {
            console.error(err)
                //auth/wrong-password
                //auth/user-not-user
            if (err.code == "auth/wrong-password") {
                return res.status(400).json({ error: "Email or Password is wrong" });
            } else if (err.code == "auth/user-not-found") {
                return res.status(400).json({ error: "please Try again, Wrong Informations!!" })
            } else if (err.code == "auth/too-many-requests") {
                return res.status(400).json({ error: "Please try later!!" })
            } else {
                return res.status(500).json({ err: err.code })
            }
        })
    }
}

//this is my activate card link function form now
exports.loginClassWithUrlCard = (req, res) => {

    if (req.body.secretKod.trim() === "") {
        return res.status(400).json({ Body: " This field should be fill !!" })
    }
    if (req.body.verificationCode.trim() === "") {
        return res.status(400).json({ Body: " This field should be fill !!" })
    }

    const loginPerson = {
        secretKod: req.body.secretKod,
        verificationCode: req.body.verificationCode
    }

    //const noImg = "no-image.png"; 
    //const { valid, errorLoginCard } = validateLoginWithCardUrl(loginPerson);

    //let givenToken, generalUserId;
    const userCredentials = {
            eMail: req.user.eMail,
            secretkod: loginPerson.secretKod,
            generalUserId: req.user.generalUserId
        }
        // const userCredentials2 = {
        //     secretkod: loginPerson.secretKod,
        //     verificationCode: loginPerson.verificationCode
        // }

    db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).get().then((doc) => {
        if (doc.data().verificationCode === loginPerson.verificationCode) {

            db.doc(`/userGeneral/${req.user.eMail}`).update(loginPerson).then(() => {

                db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).set(userCredentials)

            }).then(() => {
                let loginCardData = {}
                db.doc(`/userGeneral/${req.user.eMail}`).get().then(doc => {
                    loginCardData = doc.data()
                    loginCardData.cardUrlLinksId = doc.id
                    return db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).update(loginCardData)
                }).catch((err) => {
                    res.status(400).json({ error: "hata var burada" })
                })
            }).then(() => {
                return res.status(201).json({ Succesful: "card url succesfully added" })
            }).catch(err => {
                console.error(err)
                    //auth/wrong-password
                    //auth/user-not-user
                return res.status(500).json({ err: err.code });
            })

        } else {
            res.status(500).json({ verificationCodeError: "Verification Code is not matching" });
        }
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({ err: err.code });
    })
}

//uploafd Profile from here
exports.uploadProfile = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")



    const busboy = BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
            return res.status(400).json({ err: "Foto??raf  png yada jpeg format?? olmak zorunda!!" })
        }




        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);
        console.log("fle size uzunluk:", file.length)

        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;

        const filePath = path.join(os.tmpdir(), imageFileName);
        console.log("filePath:", filePath);

        imageToBeUploaded = { filePath, mimetype }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));


    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            // if (req.user.secretKod) {
            //     db.doc(`/cardUrlLinks/${req.user.secretKod}`).update({ profileUrl: imageUrlUploaded })
            // }

            return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ profileUrl: imageUrlUploaded }));
        }).then(() => {
            return res.json({ mesaj: "Image Successfully Updated" });
        }).catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })

    });

    busboy.end(req.rawBody);

}


//upload Background Images
exports.backgorundImageChange = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")

    const busboy = BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
            return res.status(400).json({ err: "The Image Format should be  png or jpeg!!" })
        }


        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        //transform the image took here to another format: example,83475834895.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = { filePath, mimetype }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {

            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;


            let userProfile = {}
            const allpanelProfile = db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId)
            allpanelProfile.get().then((data) => {
                userProfile.profileInfo = []
                data.forEach((doc) => {
                    userProfile.profileInfo.push({
                        generalUserId: doc.data().generalUserId,
                        profileId: doc.id
                    });
                })
            }).then(() => {
                if (userProfile.profileInfo[0].generalUserId == req.user.generalUserId) {
                    return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ backgorundImage: imageUrlUploaded }));
                } else {
                    return res.status(400).json({ Error: "No permission" })
                }
            }).then(() => {
                return res.json({ mesaj: "Backgorund successfully changed" });
            }).catch((err) => {
                return res.json(err)
            })
        }).catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
    });

    busboy.end(req.rawBody);

}


// add the subProfile 
exports.addSubProfile = (req, res) => {

    defaultImage = "no-img.png",
        backImag = "back-img.jpg"


    if (req.body.profileTag.trim() === "") {
        return res.status(400).json({ Error: "This field can't be empty!!" });
    }

    const newProfileAdd = {
        profileTag: req.body.profileTag,
        generalUserId: req.user.uid,
        eMail: req.user.eMail,
        customUrl: "",
        dateofCreation: new Date().toISOString(),
        orderOfProfile: req.body.orderOfProfile,
        phoneNumber: "",
        profileAdres: "",
        profileCompany: "",
        profilDescription: "",
        profileEmail: "",
        profileTheme: "light",
        publicName: "",
        publicSurName: "",
        statusMode: true,
        statusOfUrl: true,
        placeOfSocialMediaPosition: "top",
        telNumber: "",
        taxNumber: "",
        taxAdministration: "",
        companyStatus: "",
        officeEmail: "",
        websiteUrlLink: "",
        officePhoneNumber: "",
        location: "",
        position: "",
        profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/profileMages%2F${defaultImage}?alt=media`,
        backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/backgroundMages%2F${backImag}?alt=media`,
    }

    let allgenraluserIdCount = [];
    db.doc(`/userGeneral/${req.user.eMail}`).get().then(doc => {
        if (!doc.exists) {

            return res.status(404).json({
                Error: "This  general profile doesn't exist!!"
            })

        } else {
            // check length of generalUserId
            db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId).get().then((data) => {
                    data.forEach((doc) => {
                        allgenraluserIdCount.push({
                            profileId: doc.id,
                            generalUserId: doc.data().generalUserId,
                            eMail: doc.data().eMail,
                        })
                    });
                    //     return res.json(allgenraluserIdCount)
                }).then(() => {
                    if (allgenraluserIdCount.length >= 6) {
                        ///return db.doc(`/profilesOfGeneralUser/${req.user.generalUserId}`).set(newProfileAdd);
                        console.log("Sorry you account has reach the limit of profile")
                        return res.json({ fullAccount: "Sorry you account has reach the limit of profile" })

                    } else {
                        return db.collection("profilesOfGeneralUser").add(newProfileAdd);
                    }

                }).then((doc) => {
                    newProfileAdd.newProfileId = doc.id

                    return res.json(newProfileAdd)
                })
                .catch(err => {
                    console.error(err)
                        //return res.status(500).json({ fullAccount: "Sorry you account has reach the limit of profile" })
                })
                // return db.collection("profilesOfGeneralUser").add(newProfileAdd);
                //res.json(allgenraluserIdCount.length)
        }
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })
}

//get the the Info of Url random add
exports.getTherandomUrInfo = (req, res) => {

    let randomUrlData = {}
    db.doc(`/cardUrlLinks/${req.params.urlRandomId}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "This link doesn't exist!!!" })

        } else {
            randomUrlData = doc.data()
            randomUrlData.urlRandomId = doc.id
        }


    }).then(() => {
        return res.json(randomUrlData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })
    })

}


//random Link id funct??on for the card
exports.cardLinkRandomAdd = (req, res) => {

    if (req.body.randomurlText.trim() == "") {

        return res.status(400).json({ Body: "Please write something !!" })
    }

    var verificationCode = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++) {
        verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    const createIkon = {
        randomurlText: req.body.randomurlText,
        admingeneralUserIdOnly: req.user.generalUserId,
        eMail: req.user.eMail,
        verificationCode
    }

    db.collection("cardUrlLinks").add(createIkon).then((data) => {
        if (req.user.generalUserId === "wp4hZ0SVO0biRb1Bcp55PTxSIE82") {
            const resScream = createIkon
            resScream.cardUrlLinksId = data.id
            res.json({ resScream });
        }
    }).catch((err) => {

        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })

}


//Add Socaial Url from here general social that need url
exports.socialUrlAdd = (req, res) => {

    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({ Error: "This Url can't be Empty!!" });
    }

    if (req.body.socialtype.trim() === "") {
        return res.status(400).json({ Error: "This Url can't be Empty!!" });
    }

    const newComments = {

        socialUrlLink: req.body.socialUrlLink,
        socialtype: req.body.socialtype,
        eMail: req.user.eMail,
        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statuMode: true,
        socialOrder: req.body.socialOrder,


    }

    db.collection("userSocialMediaUrl").add(newComments).then(() => {
        res.json(newComments)

    }).catch(err => {
        console.log(err)
        return res.status(500).json({ Error: err.code })
    })



}


//update social from panel Changes
exports.updateSocialMediaOfPanelChanges = (req, res) => {

    //let infoToChange = reduceSingleUserInfo(req.body);
    let profilId = req.body.profileId
    let socialMediaId = req.body.socialMediaId
    let socialMediaType = req.body.socialMediaType
    let socialUrlLink = req.body.socialUrlLink


    let allSocialMedia = []


    db.collection("userSocialMediaUrl").where("profileId", "==", profilId).get().then((doc) => {

        allSocialMedia.push({
            eMail: doc.data().eMail,
            profileId: doc.data().profileId,
            socialUrlLink: doc.data().socialUrlLink,
            socialtype: doc.data().socialtype,
            socialMediaId: doc.id
        })

    }).then(() => {

        if (allSocialMedia.socialtype === socialMediaType) {

            db.doc(`/userSocialMediaUrl/${socialMediaId}`).update({

                socialUrlLink

            })

        }



    })

}

//update only social Url Link to social




//Add New social Media Url from here
exports.socialUrlAddNew = (req, res) => {


    let socialUrlLinkvariable = req.body.socialUrlLink
    let socialTypeVariable = req.body.socialtype
    let socialOrder = req.body.socialOrder



    const newComments = {

        AllUserSocials: [{

            "socialUrlLink": socialUrlLinkvariable,
            "socialtype": socialTypeVariable,
            "eMail": req.user.eMail,
            "generalUserId": req.user.generalUserId,
            "profileId": req.params.profileId,
            "statuMode": true,
            "socialOrder": socialOrder

        }],

        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "urlLinkPanel"
    }


    db.doc(`/userSocialMediaUrl/${req.params.profileId}`).get().then(async(doc) => {

        if (doc.exists) {

            await db.doc(`/userSocialMediaUrl/${req.params.profileId}`).update({
                AllUserSocials: admin.firestore.FieldValue.arrayUnion({
                    "socialUrlLink": socialUrlLinkvariable,
                    "socialtype": socialTypeVariable,
                    "eMail": req.user.eMail,
                    "generalUserId": req.user.generalUserId,
                    "profileId": req.params.profileId,
                    "statuMode": true,
                    "socialOrder": socialOrder
                })
            });

            res.json({ Message: "social Exist, that's why array updated" });

        } else {

            await db.doc(`/userSocialMediaUrl/${req.params.profileId}`).set(newComments);
            res.json({ "First Push Social": newComments });

        }

    }).catch(err => {
        console.log(err)
        return res.status(500).json({ Error: err.code })
    })
}








//add facebook from here url
//facebook
exports.facebookUrlAdd = (req, res) => {
    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({ Error: "Url alan?? bo?? ge??ilemez!!" });
    }
    const newComments = {
        socialUrlLink: `facebook.com/${req.body.socialUrlLink}`,
        eMail: req.user.eMail,
        generalUserId: req.user.generalUserId,
        socialMediaName: req.body.socialMediaName,
        statuMode: true
    }
    return db.collection("userSocialMediaUrl").add(newComments).then(() => {
        res.json(newComments)
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ Error: err.code })
    })

}


// count when click link here on Date from general User
exports.ClickUrlCardLink = (req, res) => {

    const cardUrlidDocument = db.doc(`/cardUrlLinks/${req.params.cardlinkid}`);
    cardUrlClcikDate = db.collection("cardUrlDate")


    let cardLinkData
    cardUrlidDocument.get().then(doc => {
        if (doc.exists) {
            cardLinkData = doc.data()
            cardLinkData.urlcardId = doc.id
                //return cardUrlClcikDate.get()
            return db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).get()
        } else {
            return res.status(400).json({ Error: "card url not found !!" })
        }
    }).then((doc) => {

        const neCredentials = {
            cardlinkid: req.params.cardlinkid,
            clickDate: [new Date().toISOString()],
            genralUserId: cardLinkData.generalUserId,
            eMail: cardLinkData.eMail
        }
        if (doc.exists) {
            console.log("buaraya girdi")
            db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
                clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
            }).then(() => {
                return res.json({ Ok: "succesfully added" })
            })
        } else {
            console.log("buraya girmeedi")
            db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).set(neCredentials).then(() => {
                return res.json({ Ok: "succesfully added" })
            })


        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}


/// click  rehbere kaydetme


//count when click profile from here
exports.ClickProfileLink = (req, res) => {

    const cardUrlidDocument = db.doc(`/profilesOfGeneralUser/${req.params.profileId}`);

    cardUrlClcikDate = db.collection("cartProfileDate")


    let cardLinkData
    cardUrlidDocument.get().then(doc => {
        if (doc.exists) {
            cardLinkData = doc.data()
            cardLinkData.urlProfilecardId = doc.id
                //return cardUrlClcikDate.get()
            return db.doc(`/cartProfileDate/${cardLinkData.urlProfilecardId}`).get()
        } else {
            return res.status(400).json({ Error: "card url not found !!" })
        }
    }).then((doc) => {

        const neCredentials = {
            cardlinkid: req.params.profileId,
            clickDate: [new Date().toISOString()],
            genralUserId: cardLinkData.generalUserId,
            eMail: cardLinkData.eMail,
            profileId: cardLinkData.urlProfilecardId
        }
        if (doc.exists) {
            console.log("buaraya girdi")
            db.doc(`/cartProfileDate/${cardLinkData.urlProfilecardId}`).update({
                clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
            }).then(() => {
                return res.json({ Ok: "succesfully added" })
            })
        } else {
            console.log("buraya girmeedi")
            db.doc(`/cartProfileDate/${cardLinkData.urlProfilecardId}`).set(neCredentials).then(() => {
                return res.json({ Ok: "succesfully added" })
            })


        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}




exports.deleteSingleProfile = (req, res) => {
    const subProfilDocument = db.doc(`/profilesOfGeneralUser/${req.params.profilId}`);
    subProfilDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ Error: "Profile Not Found!!" });
        }
        if (doc.data().genralUserId !== req.user.genralUserId) {
            return res.status(403).json({ Error: "don't have permission to delete Account  !!" })
        } else {
            return subProfilDocument.delete();
        }

    }).then(() => {
        return res.json({ Mesaj: "Profile Successfully deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })

}


//delete user from system
//delete user
exports.deleteUser = (req, res) => {

    const generalUserDocument = db.doc(`/userGeneral/${req.user.eMail}`);
    const cardUrlfield = db.doc(`/cardUrlLinks/${req.user.secretKod}`);
    // get the reference to the doc
    //let docRef=this.db.doc(`ProfileUser/${userId}/followersCount/FollowersCount`);
    //firebase.auth().currentUser.delete() All Account
    admin.auth().deleteUser(req.user.uid).then(() => {
            console.log('Successfully deleted user');
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
        });

    generalUserDocument.get().then((doc) => {
        generalUserDocument.delete();

    }).then(() => {
        console.log("user deleted")
        if (req.user.secretKod) {
            // remove the {currentUserId} field from the document
            cardUrlfield.update({
                [currentUserId]: firebase.firestore.FieldValue.delete()
            })
        }

    }).then(() => {
        return res.json({ Mesaj: "user succesfully deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })


}


//single user data Info with userName, userView
exports.singleUserInfo = (req, res) => {
    let singleUserData = {}

    // db.doc(`/userabd/${req.params.eMail}`).get()
    db.collection("userGeneral").where("userHandleName", "==", req.params.userHandleName).get().then((doc) => {
        if (!doc.empty) {
            return db.collection("cardUrlLinks").where("userHandleName", "==", req.params.userHandleName).get();
        } else {
            return res.status(404).json({ Error: "we dont't have such user" });
        }

    }).then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push({
                publicName: doc.data().publicName,
                publicSurname: doc.data().publicSurname,
                userHandleName: doc.data().userHandleName,
                eMail: doc.data().eMail,
                generalUserId: doc.data().generalUserId,
                generalProfilId: doc.id
            })
        })

        console.log("genraluserId:", singleUserData.dataInfo[0].generalUserId)

        return db.collection("profilesOfGeneralUser").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).get()

        //return res.json(singleUserData);
    }).then((data) => {
        singleUserData.allSubProfileInfo = [];
        data.forEach(doc => {
            singleUserData.allSubProfileInfo.push({
                publicName: doc.data().publicName,
                publicSurName: doc.data().publicSurname,
                generalUserId: doc.data().generalUserId,
                profileTag: doc.data().profileTag,
                eMail: doc.data().eMail,
                backgorundImage: doc.data().backgorundImage,
                profileUrl: doc.data().profileUrl,
                statusMode: doc.data().statusMode,
                dateofCreation: doc.data().dateofCreation,
                phoneNumber: doc.data().phoneNumber,
                profilDescription: doc.data().profilDescription,
                profileAdres: doc.data().profileAdres,
                profileBanner: doc.data().profileBanner,
                profileCompany: doc.data().profileCompany,
                profileEmail: doc.data().profileEmail,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                position: doc.data().position,
                statusOfUrl: doc.data().statusOfUrl
            })
        })

        return db.collection("userSocialMediaUrl").where("generalUserId", "==", singleUserData.allSubProfileInfo[0].generalUserId).get()

    }).then((data) => {

        singleUserData.allsocial = []
        data.forEach((doc) => {
            singleUserData.allsocial.push(doc.data());
        })
    })

    .then(() => {
        return res.json(singleUserData);
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Error: err.code })
    })

}

//single user data Info with generaluserId from userView
exports.singleUserInfoWithgeneraluserId = (req, res) => {
    let singleUserData = {}
        // db.doc(`/userabd/${req.params.eMail}`).get()
    db.collection("userGeneral").where("generalUserId", "==", req.params.userId).get().then((doc) => {
        if (!doc.empty) {
            return db.collection("cardUrlLinks").where("generalUserId", "==", req.params.userId).get();
        } else {
            return res.status(404).json({ Error: "we dont't have such user" });

        }

    }).then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push({
                publicName: doc.data().publicName,
                publicSurname: doc.data().publicSurname,
                userHandleName: doc.data().userHandleName,
                eMail: doc.data().eMail,
                generalUserId: doc.data().generalUserId
            })
        })
        return db.collection("profilesOfGeneralUser").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).get()

    }).then((data) => {
        singleUserData.allSubProfileInfo = [];
        data.forEach(doc => {
            singleUserData.allSubProfileInfo.push({
                publicName: doc.data().publicName,
                publicSurName: doc.data().publicSurName,
                profileTag: doc.data().profileTag,
                generalUserId: doc.data().generalUserId,
                eMail: doc.data().eMail,
                backgorundImage: doc.data().backgorundImage,
                profileUrl: doc.data().profileUrl,
                statusMode: doc.data().statusMode,
                dateofCreation: doc.data().dateofCreation,
                phoneNumber: doc.data().phoneNumber,
                profilDescription: doc.data().profilDescription,
                orderOfProfile: doc.data().orderOfProfile,
                profileAdres: doc.data().profileAdres,
                profileBanner: doc.data().profileBanner,
                profileCompany: doc.data().profileCompany,
                profileEmail: doc.data().profileEmail,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                position: doc.data().position,
                statusOfUrl: doc.data().statusOfUrl,
                profileId: doc.id,
                taxNumber: doc.data().taxNumber,
                telNumber: doc.data().telNumber,
                websiteUrlLink: doc.data().websiteUrlLink,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location
            })
        })

        return db.collection("userSocialMediaUrl").where("generalUserId", "==", singleUserData.allSubProfileInfo[0].generalUserId).where("statuMode", "==", true).get()

    }).then((data) => {
        singleUserData.allsocial = []
        data.forEach((doc) => {
            singleUserData.allsocial.push(doc.data());
        })

        return db.collection("bankData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get()

    }).then((data) => {

        singleUserData.allPanelInfo = []

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                accountOwner: doc.data().accountOwner,
                bankIban: doc.data().bankIban,
                bankName: doc.data().bankName,
                bankStation: doc.data().bankStation,
                profileId: doc.data().profileId,
                BankDataId: doc.id,
                statueMode: doc.data().statueMode,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
            });
        })

        return db.collection("contactData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();


    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                panelEmailPostas: doc.data().panelEmailPostas,
                panelPhoneNumbers: doc.data().panelPhoneNumbers,
                profilId: doc.data().profilId,
                profileCity: doc.data().profileCity,
                profileCountry: doc.data().profileCountry,
                profileNot: doc.data().profileNot,
                profilePosition: doc.data().profilePosition,
                publicName: doc.data().publicName,
                publicOrganization: doc.data().publicOrganization,
                publicsurname: doc.data().publicsurname,
                streetAdress: doc.data().streetAdress,
                statueMode: doc.data().statueMode,
                contactDataId: doc.id,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,


            });
        })

        return db.collection("documentDataForm").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                statusNameSurname: doc.data().statusNameSurname,
                statusEmail: doc.data().statusEmail,
                statusTelefon: doc.data().statusTelefon,
                statusMessage: doc.data().statusMessage,
                emailToSend: doc.data().emailToSend,
                publicstreetAdress: doc.data().publicstreetAdress,
                publicDropNot: doc.data().publicDropNot,
                OrderId: doc.data().OrderId,
                type: doc.data().type,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                documentDataFormId: doc.id,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
            });
        })

        return db.collection("fileUploadDocument").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({


                belgeDocument: doc.data().belgeDocument,
                belgeDocumentId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                profileId: doc.data().profileId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,


            });
        })

        return db.collection("panelUrlLinkOfUser").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();
        // db.collection("panelUrlLinkOfUser").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId)

    }).then((data) => {
        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                panelUrlLink: doc.data().panelUrlLink,
                panelProfileUrlDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                profileId: doc.data().profileId,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle

            });
        })


    }).then(() => {
        return res.json(singleUserData);
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ Error: err })
    })
}

//single user data Info with generalUserId from preview page Auth
exports.singleUserInfoWithgeneraluserIdPreviewPageToken = (req, res) => {
    let singleUserData = {}
        // db.doc(`/userabd/${req.params.eMail}`).get()
    db.collection("userGeneral").where("generalUserId", "==", req.params.userId).get().then((doc) => {
        if (!doc.empty) {
            return db.collection("cardUrlLinks").where("generalUserId", "==", req.params.userId).get();
        } else {
            return res.status(404).json({ Error: "we dont't have such user" });

        }

    }).then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push({
                publicName: doc.data().publicName,
                publicSurname: doc.data().publicSurname,
                userHandleName: doc.data().userHandleName,
                eMail: doc.data().eMail,
                generalUserId: doc.data().generalUserId
            })
        })
        return db.collection("profilesOfGeneralUser").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).get()

    }).then((data) => {
        singleUserData.allSubProfileInfo = [];
        data.forEach(doc => {
            singleUserData.allSubProfileInfo.push({
                publicName: doc.data().publicName,
                publicSurName: doc.data().publicSurName,
                profileTag: doc.data().profileTag,
                generalUserId: doc.data().generalUserId,
                eMail: doc.data().eMail,
                backgorundImage: doc.data().backgorundImage,
                profileUrl: doc.data().profileUrl,
                statusMode: doc.data().statusMode,
                dateofCreation: doc.data().dateofCreation,
                phoneNumber: doc.data().phoneNumber,
                profilDescription: doc.data().profilDescription,
                orderOfProfile: doc.data().orderOfProfile,
                profileAdres: doc.data().profileAdres,
                profileBanner: doc.data().profileBanner,
                profileCompany: doc.data().profileCompany,
                profileEmail: doc.data().profileEmail,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                position: doc.data().position,
                statusOfUrl: doc.data().statusOfUrl,
                profileId: doc.id,
                taxNumber: doc.data().taxNumber,
                telNumber: doc.data().telNumber,
                websiteUrlLink: doc.data().websiteUrlLink,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location
            })
        })

        return db.collection("userSocialMediaUrl").where("generalUserId", "==", singleUserData.allSubProfileInfo[0].generalUserId).where("statuMode", "==", true).get()

    }).then((data) => {
        singleUserData.allsocial = []
        data.forEach((doc) => {
            singleUserData.allsocial.push(doc.data());
        })

        return db.collection("bankData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get()

    }).then((data) => {

        singleUserData.allPanelInfo = []

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                accountOwner: doc.data().accountOwner,
                bankIban: doc.data().bankIban,
                bankName: doc.data().bankName,
                bankStation: doc.data().bankStation,
                profileId: doc.data().profileId,
                BankDataId: doc.id,
                statueMode: doc.data().statueMode,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId
            });
        })

        return db.collection("contactData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();


    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                kisiselEmail: doc.data().kisiselEmail,
                kisiselTelefon: doc.data().kisiselTelefon,
                kurumsalEmail: doc.data().kurumsalEmail,

                profilId: doc.data().profilId,
                profileCity: doc.data().profileCity,
                profileCountry: doc.data().profileCountry,
                profileNot: doc.data().profileNot,
                profilePosition: doc.data().profilePosition,
                publicName: doc.data().publicName,
                publicOrganization: doc.data().publicOrganization,
                publicsurname: doc.data().publicsurname,
                streetAdress: doc.data().streetAdress,
                statueMode: doc.data().statueMode,
                profileId: doc.data().profileId,
                contactDataId: doc.id,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId


            });
        })

        return db.collection("documentDataForm").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                statusNameSurname: doc.data().statusNameSurname,
                statusEmail: doc.data().statusEmail,
                statusTelefon: doc.data().statusTelefon,
                statusMessage: doc.data().statusMessage,
                emailToSend: doc.data().emailToSend,
                publicstreetAdress: doc.data().publicstreetAdress,
                publicDropNot: doc.data().publicDropNot,
                OrderId: doc.data().OrderId,
                profileId: doc.data().profileId,
                type: doc.data().type,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                documentDataFormId: doc.id,
                statueMode: doc.data().statueMode
            });
        })

        return db.collection("fileUploadDocument").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                belgeDocument: doc.data().belgeDocument,
                belgeDocumentId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode
            });
        })


    }).then(() => {
        return res.json(singleUserData);
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ Error: err })
    })
}



//kay??tl?? olan  kullan??c?? bilgileri Getir
exports.getAuthenticatedUser = ((req, res) => {
    let userDataInfo = {}

    db.doc(`/userGeneral/${req.user.eMail}`).get().then((doc) => {

        if (doc.exists) {
            userDataInfo.credentials = doc.data(); //userCredentials olabilir

            return db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId).get()

        }
    }).then((data) => {
        userDataInfo.profileofGeneralUser = []

        data.forEach((doc) => {
            userDataInfo.profileofGeneralUser.push({

                publicSurName: doc.data().publicSurName,
                profileUrl: doc.data().profileUrl,
                profilDescription: doc.data().profilDescription,
                customUrl: doc.data().customUrl,
                phoneNumber: doc.data().phoneNumber,
                backgorundImage: doc.data().backgorundImage,
                profileTag: doc.data().profileTag,
                eMail: doc.data().eMail,
                profileAdres: doc.data().profileAdres,
                profileCompany: doc.data().profileCompany,
                telNumber: doc.data().telNumber,
                profileEmail: doc.data().profileEmail,
                statusOfUrl: doc.data().statusOfUrl,
                orderOfProfile: doc.data().orderOfProfile,
                dateofCreation: doc.data().dateofCreation,
                generalUserId: doc.data().generalUserId,
                publicName: doc.data().publicName,
                position: doc.data().position,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                profileId: doc.id,
                taxNumber: doc.data().taxNumber,
                websiteUrlLink: doc.data().websiteUrlLink,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location

            });
        })

    }).then(() => {
        return res.json(userDataInfo)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

})





//all SubAccount get
exports.getAllSubprofileOfGeneralUser = ((req, res) => {
        let subUserDataInfo = {}

        const allSubprofile = db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId)

        allSubprofile.get().then((data) => {
            subUserDataInfo.personalInfo = []
            console.log("hatalar ehere")
            data.forEach((doc) => {
                subUserDataInfo.personalInfo.push({
                    eMail: doc.data().eMail,
                    profileTag: doc.data().profileTag,
                    customUrl: doc.data().customUrl,
                    dateofCreation: doc.data().dateofCreation,
                    publicSurName: doc.data().publicSurName,
                    profilDescription: doc.data().profilDescription,
                    profileAdres: doc.data().profileAdres,
                    profileEmail: doc.data().profileEmail,
                    backgorundImage: doc.data().backgorundImage,
                    profileCompany: doc.data().profileCompany,
                    generalUserId: doc.data().generalUserId,
                    profileTheme: doc.data().profileTheme,
                    statusOfUrl: doc.data().statusOfUrl,
                    publicName: doc.data().publicName,
                    orderOfProfile: doc.data().orderOfProfile,
                    phoneNumber: doc.data().phoneNumber,
                    telNumber: doc.data().telNumber,
                    statusMode: doc.data().statusMode,
                    websiteUrlLink: doc.data().websiteUrlLink,
                    profileUrl: doc.data().profileUrl,
                    SubprofileId: doc.id
                });
            })
        }).then(() => {
            console.log("veiler:", subUserDataInfo)
            return res.json(subUserDataInfo)
        }).catch(() => {
            return res.status(400).json({ errorgetSuprofile: "error wihle..." })
        })

    })
    ///check all handleName



// userUpdate Info DATA
exports.updateGeneralUserData = (req, res) => {
    let infoToChange = reduceGeneralUserInfo(req.body);
    db.doc(`/userGeneral/${req.user.eMail}`).update(infoToChange).then(() => {

        return res.json({ success: "Successfully updated!" })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

    if (req.user.secretKod) {
        db.doc(`/cardUrlLinks/${req.user.secretKod}`).update(infoToChange).then(() => {
            return res.json({ Mesaj: "Successfully updated!!" })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({ err: err.code })
        })
    }
}

// update of single profile
exports.updateSingleUserData = (req, res) => {

    let infoToChange = reduceSingleUserInfo(req.body);
    const subProfilDocument = db.doc(`/profilesOfGeneralUser/${req.params.profilId}`);
    subProfilDocument.update(infoToChange).then(() => {

        return res.json({ success: "Succvessfully updated!" })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

// all social media of a single user with Auth
exports.getallSocialMediaofSingleprofile = ((req, res) => {
    let socialMedia = {}

    const allsocialMedia = db.collection("userSocialMediaUrl").where("profileId", "==", req.params.profileId)

    allsocialMedia.get().then((data) => {
        socialMedia.allsocial = []

        data.forEach((doc) => {
            socialMedia.allsocial.push({
                eMail: doc.data().eMail,
                socialtype: doc.data().socialtype,
                socialUrlLink: doc.data().socialUrlLink,
                profileId: doc.data().profileId,
                statuMode: doc.data().statuMode,
                generalUserId: doc.data().generalUserId,
                socialMediaUrlId: doc.id,
                socialOrder: doc.data().socialOrder
            });
        })
    }).then(() => {
        return res.json(socialMedia)
    }).catch(() => {
        return res.status(400).json({ errorgetSuprofile: "error wihle..." })
    })

})

//get All Social Media from there

// exports.getallSocialMediaofSingleprofileFromUrlPanel = ((req, res) => {


//     let socialMedia = {}

//     const allsocialMedia = db.collection("panelUrlLinkOfUser").where("profileId", "==", req.params.profileId)

//     allsocialMedia.get().then((data) => {


//         socialMedia.allsocial = []

//         data.forEach((doc) => {
//             socialMedia.allsocial.push({

//                 profileUrlPanel: doc.data().profileUrlPanel,
//                 OrderId: doc.data().OrderId,
//                 type: doc.data().type,
//                 profileId: doc.data().profileId,
//                 statueMode: doc.data().statueMode

//                 // eMail: doc.data().eMail,
//                 // socialtype: doc.data().socialtype,
//                 // socialUrlLink: doc.data().socialUrlLink,
//                 // profileId: doc.data().profileId,
//                 // statuMode: doc.data().statuMode,
//                 // generalUserId: doc.data().generalUserId,
//                 // socialMediaUrlId: doc.id,
//                 // socialOrder: doc.data().socialOrder


//             });
//         })
//     }).then(() => {
//         return res.json(socialMedia)
//     }).catch(() => {
//         return res.status(400).json({ errorgetSuprofile: "error wihle..." })
//     })

// })


// sosyal Media gucelleme
exports.socialUrlUpdate = (req, res) => {

    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({ Error: "This Url can't be Empty!!" });
    }

    if (req.body.socialtype.trim() === "") {
        return res.status(400).json({ Error: "This Url can't be Empty!!" });
    }

    const newComments = {
        socialUrlLink: req.body.socialUrlLink,
        socialtype: req.body.socialtype,
        statuMode: req.body.statuMode,
        socialOrder: req.body.socialOrder
    }

    db.doc(`/userSocialMediaUrl/${req.params.socialMediaId}`).update(newComments).then(() => {
        return res.json({ success: "Succvessfully updated!" })
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ Error: err.code })
    })
}

// delete social media of a profile
exports.deleteSocialMediaOfProfile = (req, res) => {
    const subProfilDocument = db.doc(`/userSocialMediaUrl/${req.params.socialMediaId}`);
    subProfilDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ Error: "Social Media Not Found!!" });
        }
        if (doc.data().genralUserId !== req.user.genralUserId) {
            return res.status(403).json({ Error: "don't have permission to delete socialMedia  !!" })
        } else {
            return subProfilDocument.delete();
        }

    }).then(() => {
        return res.json({ Mesaj: "Profile Successfully deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}

//panel contact Info register
exports.postContactInfopanel = (req, res) => {

    let takenPhoneNumber = req.body.takenPhoneNumber
    let takenEmailEposta = req.body.takenEmailEposta

    // let takenDefaultNumber = req.body.takenDefaultNumber
    //let takenDefaultEmail = req.body.takenDefaultEmail

    const createContact = {
        publicName: req.body.publicName,
        publicsurname: req.body.publicsurname,
        publicOrganization: req.body.publicOrganization,
        profilePosition: req.body.profilePosition,
        panelPhoneNumbers: [{ "phoneNumber": takenPhoneNumber != "" ? takenPhoneNumber : "", "defaultNumber": true }],
        panelEmailPostas: [{ "emailPosta": takenEmailEposta != "" ? takenEmailEposta : "", "defaultEmaill": true }],
        streetAdress: req.body.streetAdress,
        profileCountry: req.body.profileCountry,
        profileCity: req.body.profileCity,
        profileNot: req.body.profileNot,
        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "conatctAddForm"

    }



    // db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
    //     clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
    // }).then(()

    db.collection("contactData").add(createContact).then((data) => {
        const resScream = createContact
        resScream.contactDataId = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })
}

// post Fatura Panel from here
exports.postFaturaBillInfopanel = (req, res) => {


    const createBillData = {

        taxNumber: req.body.taxNumber,
        taxAdministration: req.body.taxAdministration,
        companyStatus: req.body.companyStatus,
        officeEmail: req.body.officeEmail,
        officePhoneNumber: req.body.officePhoneNumber,
        location: req.body.location,

        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "faturaData"

    }

    // db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
    //     clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
    // }).then(()

    db.collection("BillFaturaData").add(createBillData).then((data) => {
        const resScream = createContact
        resScream.faturaDataId = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })
}

// panel Bank Info register

exports.postBanInfopanel = (req, res) => {

    let accountOwner = req.body.accountOwner;
    let bankName = req.body.bankName;
    let bankStation = req.body.bankStation;
    let bankIban = req.body.bankIban;
    let bankAccountNumber = req.body.bankAccountNumber


    const createBank = {

        bankDataAll: [{ "accountOwner": accountOwner, "bankName": bankName, "bankStation": bankStation, "bankIban": bankIban, "bankAccountNumber": bankAccountNumber }],
        profileId: req.params.profileId,
        generalUserId: req.user.generalUserId,
        isOpen: false,
        panelTitle: "",
        isDeleteOpen: false,
        isEditTitle: false,
        statueMode: true,
        OrderId: req.body.OrderId,
        type: "bankform",

    }


    db.collection("bankData").add(createBank).then((data) => {

        const resScream = createBank
        resScream.bankId = data.id
        res.json({ resScream });


    }).catch((err) => {

        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })
}


//post document to data where to send

exports.postDocumentInfopanel = (req, res) => {

    const createDocument = {
        statusNameSurname: req.body.statusNameSurname,
        statusEmail: req.body.statusEmail,
        statusTelefon: req.body.statusTelefon,
        statusMessage: req.body.statusMessage,
        profileId: req.params.profileId,
        emailToSend: req.body.emailToSend,
        publicstreetAdress: req.body.publicstreetAdress,
        generalUserId: req.user.generalUserId,
        publicDropNot: req.body.publicDropNot,
        OrderId: req.body.OrderId,
        panelTitle: "",
        statueMode: true,
        isEditTitle: false,
        isOpen: false,
        isDeleteOpen: false,
        type: "documentForm"
    }
    db.collection("documentDataForm").add(createDocument).then((data) => {

        const resScream = createDocument
        resScream.doncumentDataId = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })
}

//post Panel Linki URL
exports.postUrlLinkiInfopanel = (req, res) => {

    //let panelUrlLinkadd = req.body.panelUrlLink


    let socialUrlLinkvariable = req.body.socialUrlLink
    let socialTypeVariable = req.body.socialtype
    let socialOrder = req.body.socialOrder


    const createSocialInfo = {

        socialUrlLink: socialUrlLinkvariable,
        socialtype: "web",
        profileId: req.params.profileId,
        eMail: req.user.eMail,
        statuMode: true,
        socialOrder: socialOrder

    }

    const createContact = {

        profileUrlPanel: [{

            "socialUrlLink": socialUrlLinkvariable,
            "socialtype": socialTypeVariable,
            "eMail": req.user.eMail,
            "generalUserId": req.user.generalUserId,
            "profileId": req.params.profileId,
            "statuMode": true,
            "socialOrder": socialOrder,
            "socialUrlHead": "https://",
            "placeholder": ""

        }],
        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "urlLinkPanel"
    }
    db.collection("panelUrlLinkOfUser").add(createContact).then((data) => {

        //db.collection("userSocialMediaUrl").add(createSocialInfo)

    }).then((data) => {

        const resScream = createContact
            // resScream.contactDataId = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })

}


//updatae  Url Linki always from here
exports.updateURLpanelLinki = (req, res) => {

    let contactbilgi = reduceUrlPanelInfo(req.body);
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru girilmi??tir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}

//update Url Linki Array from heree
exports.updateProfileUrlLinksDataOnly = (req, res) => {

    let ArrayIndexTochange = req.body.arrayIndexthis
    let socialOrder = req.body.socialOrder
    let socialUrlHead = req.body.socialUrlHead
    let socialUrlLink = req.body.socialUrlLink
    let socialtype = req.body.socialtype
    let statuMode = req.body.statuMode
    let placeholder = req.body.placeholder
    let profileId = req.body.profileId


    // const createSocialInfo = {

    //     socialUrlLink: socialUrlLink,
    //     socialtype: socialtype,
    //     profileId: profileId,
    //     eMail: req.user.eMail,
    //     statuMode: true,
    //     socialOrder: socialOrder

    // }


    let profilUrlArraysOfpanel = []
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).get().then((doc) => {

        profilUrlArraysOfpanel = doc.data().profileUrlPanel

    }).then(() => {

        if (profilUrlArraysOfpanel[ArrayIndexTochange] == undefined) {

            profilUrlArraysOfpanel.push({
                "eMail": req.user.eMail,
                "generalUserId": req.user.generalUserId,
                "socialOrder": socialOrder,
                "socialUrlHead": socialUrlHead,
                "socialUrlLink": socialUrlLink,
                "socialtype": socialtype,
                "statuMode": statuMode,
                "placeholder": placeholder
            })


            return db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

                profileUrlPanel: profilUrlArraysOfpanel



            }).then(() => {


                return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld?? pUSH!!" })


                // db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

                //     profileUrlPanel: admin.firestore.FieldValue.arrayUnion({

                //         "eMail": req.user.eMail,
                //         "generalUserId": req.user.generalUserId,
                //         "socialOrder": socialOrder,
                //         "socialUrlHead": socialUrlHead,
                //         "socialUrlLink": socialUrlLink,
                //         "socialtype": socialtype,
                //         "statuMode": statuMode,
                //         "placeholder": placeholder,

                //     })
                // }).then(() => {

                //     return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld??!!" })
                // }).catch((eror) => {
                //     return res.json({ Mesaj: "Union yaparken hata var!!" })
                // })


            }).catch((err) => {
                console.log("index fazla hata olu??tu")
            })
        } else {

            profilUrlArraysOfpanel[ArrayIndexTochange].socialOrder = socialOrder;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialUrlHead = socialUrlHead;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialUrlLink = socialUrlLink;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialtype = socialtype;
            profilUrlArraysOfpanel[ArrayIndexTochange].statuMode = statuMode;
            profilUrlArraysOfpanel[ArrayIndexTochange].placeholder = placeholder;


        }

    }).then(() => {

        return db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({
            profileUrlPanel: profilUrlArraysOfpanel
        }).then(() => {


            // db.doc(`/userSocialMediaUrl/${req.params.socialMediaId}`).update({
            //     eMail:req.user.eMail,
            //     generalUserId: req.user.generalUserId,
            //     socialOrder:socialOrder,
            //     socialtype: socialtype,
            //     statuMode:statuMode
            // })
            // socialUrlLink: socialUrlLink,
            //     socialtype: socialtype,
            //     profileId: profileId,
            //     eMail: req.user.eMail,
            //     statuMode: true,
            //     socialOrder: socialOrder

            // return db.collection("userSocialMediaUrl").add({

            //     socialUrlLink: "socialUrlLink",
            //     socialtype: "socialtype",
            //     profileId: "profileId",
            //     eMail: req.user.eMail,
            //     statuMode: true,
            //     socialOrder: "socialOrder"

            // })


        }).then(() => {

            return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru g??celendi index var!!" })

        }).catch((err) => {
            console.error(err)
            return res.status(500).json({ err: err.code })

        })
    })



}


//belge y??kle register Panel
exports.uploadFilePdf = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")


    const busboy = BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
        //     return res.status(400).json({ err: "Foto??raf  png yada jpeg format?? olmak zorunda!!" })
        // }

        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        console.log("filePath:", filePath)

        imageToBeUploaded = { filePath, mimetype }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));



    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            // if (req.user.secretKod){
            //     db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded })
            // }
            console.log("hee bak:", imageUrlUploaded)

            const fileUploadInfo = {
                belgeDocument: imageUrlUploaded,
                isOpen: false,
                isDeleteOpen: false,
                statueMode: true,
                isEditTitle: false,
                panelTitle: "",
                generalUserId: req.user.generalUserId,
                OrderId: 0,
                profileId: req.params.profileId,
                type: "uploadFileDocument"


            }
            return db.collection("fileUploadDocument").add(fileUploadInfo)

            //return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded }));


        }).then(() => {
            return res.json({ mesaj: "File Successfully Updated" });
        }).catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })

    });

    busboy.end(req.rawBody);

}

//create first Where to upload file from here
exports.postFirstPlaceWhereToPutUploadFilepanel = (req, res) => {


    let belgeDocumentTo = req.body.belgeDocument



    const fileUploadInfo = {

        belgeDocumentUploads: [{ "belgeDocument": belgeDocumentTo, "fileIndex": 0 }],
        isOpen: false,
        isDeleteOpen: false,
        statueMode: true,
        isEditTitle: false,
        panelTitle: "",
        generalUserId: req.user.generalUserId,
        OrderId: req.body.OrderId,
        profileId: req.params.profileId,
        type: "uploadFileDocument"

    }

    db.collection("fileUploadDocument").add(fileUploadInfo).then((data) => {

        const resScream = fileUploadInfo
        resScream.belgeDocumentId = data.id

        res.json({ resScream });


    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })
}




//belgeyi yenle
exports.uploadFilePdfChange = (req, res) => {




    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")


    const busboy = BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
        //     return res.status(400).json({ err: "Foto??raf  png yada jpeg format?? olmak zorunda!!" })
        // }

        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        console.log("filePath:", filePath)

        imageToBeUploaded = { filePath, mimetype }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));


    });

    busboy.on("finish", () => {

        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }


        }).then(() => {

            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;







            // if (req.user.secretKod){
            //     db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded })
            // }

            // const fileUploadInfo = {
            //     belgeDocument: imageUrlUploaded,
            //     isOpen: false,
            //     isDeleteOpen: false,
            //     statueMode: true,
            //     OrderId: 0,
            //     profileId: req.params.profileId,
            //     type: "uploadFileDocument"


            // }
            //return db.collection("fileUploadDocument").add(fileUploadInfo)

            //update ONLy Bank Info Array




            // let accountOwner = req.body.accountOwner;
            // let bankName = req.body.bankName;
            // let bankStation = req.body.bankStation;
            // let bankIban = req.body.bankIban;
            // let bankAccountNumber = req.body.bankAccountNumber





            let uploadofArraysOfpanel = []
                // let ArrayIndexTochange = req.body.arrayLentghToChange

            let arraySayac = 0;

            return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).get().then((doc) => {


                uploadofArraysOfpanel = doc.data().belgeDocumentUploads

                //console.log("uploadaData::", doc.data().belgeDocumentUploads)


            }).then(() => {


                uploadofArraysOfpanel.push({
                    "belgeDocument": imageUrlUploaded
                })

                return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).update({

                    belgeDocumentUploads: uploadofArraysOfpanel

                })



                // for (let index = 0; index <= 3; index++){

                //     console.log("arrayburada", uploadofArraysOfpanel)

                //     console.log("arrayburada", index)

                //     if (uploadofArraysOfpanel[index] == undefined) {

                //         uploadofArraysOfpanel.push({
                //             "belgeDocument": imageUrlUploaded
                //         })


                //         return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).update({

                //             belgeDocumentUploads: uploadofArraysOfpanel

                //         })

                //     } else {

                //         uploadofArraysOfpanel[index].belgeDocument = uploadofArraysOfpanel[arraySayac].belgeDocument;

                //         console.log("allFile", uploadofArraysOfpanel);

                //         return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).update({

                //             belgeDocumentUploads: uploadofArraysOfpanel


                //         }).then(() => {
                //             console.log("bauaraya girddi index var ")
                //         })
                //     }

                // }

            })

        }).then(() => {

            return res.json({ mesaj: "File Successfully Updated" });


        }).catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })

    });

    busboy.end(req.rawBody);

}

//exports get Bank Info
exports.getpanelInfFromHere = (req, res) => {

    let panelDataInfo = {}

    const allpanelProfile = db.collection("bankData").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId)

    let countId = 0

    console.log("ilk hata girdi")

    allpanelProfile.get().then((data) => {
        panelDataInfo.bankDataInfo = []
        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({

                bankDataAll: doc.data().bankDataAll,
                profileId: doc.data().profileId,
                BankDataId: doc.id,
                statueMode: doc.data().statueMode,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle


            });
        })

        console.log("second hata girdi")
        return db.collection("contactData").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {
        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({
                panelEmailPostas: doc.data().panelEmailPostas,
                panelPhoneNumbers: doc.data().panelPhoneNumbers,
                profilId: doc.data().profilId,
                profileCity: doc.data().profileCity,
                profileCountry: doc.data().profileCountry,
                profileNot: doc.data().profileNot,
                profilePosition: doc.data().profilePosition,
                publicName: doc.data().publicName,
                publicOrganization: doc.data().publicOrganization,
                publicsurname: doc.data().publicsurname,
                streetAdress: doc.data().streetAdress,
                statueMode: doc.data().statueMode,
                contactDataId: doc.id,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
            });
        })

        return db.collection("documentDataForm").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {

        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({

                statusNameSurname: doc.data().statusNameSurname,
                statusEmail: doc.data().statusEmail,
                statusTelefon: doc.data().statusTelefon,
                statusMessage: doc.data().statusMessage,
                emailToSend: doc.data().emailToSend,
                publicstreetAdress: doc.data().publicstreetAdress,
                publicDropNot: doc.data().publicDropNot,
                OrderId: doc.data().OrderId,
                type: doc.data().type,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                documentDataFormId: doc.id,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,

            });
        })
        return db.collection("fileUploadDocument").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();
    }).then((data) => {

        data.forEach((doc) => {

            panelDataInfo.bankDataInfo.push({
                belgeDocumentUploads: doc.data().belgeDocumentUploads,
                belgeDocumentId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle




            });
        })

        return db.collection("panelUrlLinkOfUser").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {

        data.forEach((doc) => {

            panelDataInfo.bankDataInfo.push({
                profileUrlPanel: doc.data().profileUrlPanel,
                panelProfileUrlDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle

            });
        })

        return db.collection("BillFaturaData").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {

        data.forEach((doc) => {

            panelDataInfo.bankDataInfo.push({

                taxNumber: doc.data().taxNumber,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location,
                faturaDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle

            });
        })

    }).then(() => {
        return res.json(panelDataInfo)
    }).catch((err) => {
        console.log("hata burada:", err)
        return res.status(400).json({ errorgetPanel: err })
    })
}

// update bank Info
exports.updateBankInfo = (req, res) => {

    let bankbilgi = reduceBankInfo(req.body);
    db.doc(`/bankData/${req.params.bankDataId}`).update(bankbilgi).then(() => {

        return res.json({ Mesaj: "Succesfully updated!!" })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}

//update ONLy Bank Info Array
exports.updateBankInfoArrayDataOnly = (req, res) => {

    let accountOwner = req.body.accountOwner;
    let bankName = req.body.bankName;
    let bankStation = req.body.bankStation;
    let bankIban = req.body.bankIban;
    let bankAccountNumber = req.body.bankAccountNumber

    let ArrayIndexTochange = req.body.arrayLentghToChange



    let bankInfoArraysOfpanel = []
    db.doc(`/bankData/${req.params.BankDataId}`).get().then((doc) => {

        console.log("veri geldi::", doc.data().bankDataAll)

        bankInfoArraysOfpanel = doc.data().bankDataAll

    }).then(() => {

        if (bankInfoArraysOfpanel[ArrayIndexTochange] == undefined) {

            console.log("fazla geldii array::")

            return db.doc(`/bankData/${req.params.BankDataId}`).update({

                bankDataAll: bankInfoArraysOfpanel
            }).then(() => {

                db.doc(`/bankData/${req.params.BankDataId}`).update({
                    bankDataAll: admin.firestore.FieldValue.arrayUnion({ "accountOwner": accountOwner, "bankAccountNumber": bankAccountNumber, "bankIban": bankIban, "bankName": bankName, "bankStation": bankStation }),
                }).then(() => {
                    console.log("union yap??ld?? burada")
                    return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld??!!" })
                }).catch((eror) => {
                    return res.json({ Mesaj: "Union yaparken hata var!!" })
                })
            }).catch((err) => {
                console.log("index fazla hata olu??tu")
            })
        } else {
            bankInfoArraysOfpanel[ArrayIndexTochange].accountOwner = accountOwner;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankAccountNumber = bankAccountNumber;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankIban = bankIban;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankName = bankName;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankStation = bankStation;
        }
    }).then(() => {
        db.doc(`/bankData/${req.params.BankDataId}`).update({
            bankDataAll: bankInfoArraysOfpanel
        })
    }).then(() => {
        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru g??celendi!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })


}






// update ContactData Info
exports.updateContactInfo = (req, res) => {
    let contactbilgi = reduceContactInfo(req.body);
    db.doc(`/contactData/${req.params.conatctDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru girilmi??tir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })


    // .then(() => {
    //     db.doc(`/contactData/${req.params.conatctDataId}`).update({
    //         panelPhoneNumbers: admin.firestore.FieldValue.arrayUnion({ "phoneNumber": contactbilgi.takenPhoneNumber }),
    //         panelEmailPostas: admin.firestore.FieldValue.arrayUnion({ "emailPosta": contactbilgi.takenEmailEposta })
    //     })
    // })

}

//udate Faturea Bill

exports.updateFaturaBillInfo = (req, res) => {
    let contactbilgi = reducekulBill(req.body);
    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru girilmi??tir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}





//update ONLY pHONE nUMBER aRRAY
exports.updateContactInfoArrayPhoneOnly = (req, res) => {

    // let oldphoneInputValue = req.body.alreadyPhoneNumber
    let newPhoneInputValue = req.body.newEnterPhoneInput

    let newDefaultPhonenumber = req.body.newDefaultPhonenumber

    let ArrayIndexTochange = req.body.arrayLentghToChange

    let phoneNumbersOfpanel = []
    db.doc(`/contactData/${req.params.conatctDataId}`).get().then((doc) => {

        console.log("veri geldi::", doc.data().panelPhoneNumbers)

        phoneNumbersOfpanel = doc.data().panelPhoneNumbers
    }).then(() => {

        if (phoneNumbersOfpanel[ArrayIndexTochange] == undefined) {

            console.log("fazla geldii array::")

            return db.doc(`/contactData/${req.params.conatctDataId}`).update({

                panelPhoneNumbers: phoneNumbersOfpanel
            }).then(() => {

                db.doc(`/contactData/${req.params.conatctDataId}`).update({
                    panelPhoneNumbers: admin.firestore.FieldValue.arrayUnion({ "phoneNumber": newPhoneInputValue, "defaultNumber": newDefaultPhonenumber }),
                }).then(() => {
                    console.log("union yap??ld?? burada")
                    return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld??!!" })
                }).catch((eror) => {
                    return res.json({ Mesaj: "Union yaparken hata var!!" })
                })


            }).catch((err) => {
                console.log("index fazla hata olu??tu")
            })
        } else {
            phoneNumbersOfpanel[ArrayIndexTochange].phoneNumber = newPhoneInputValue;
            phoneNumbersOfpanel[ArrayIndexTochange].defaultNumber = newDefaultPhonenumber;
            console.log("indexoyaa:", phoneNumbersOfpanel[ArrayIndexTochange])
        }
    }).then(() => {
        db.doc(`/contactData/${req.params.conatctDataId}`).update({
            panelPhoneNumbers: phoneNumbersOfpanel
        })
    }).then(() => {
        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru g??celendi!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}



// update only Email Array from here
exports.updateContactInfoEmailOnly = (req, res) => {


    let newEmailInputValue = req.body.newEmailPosta
    let newDefautEmail = req.body.newDefaultEmail
    let ArrayIndexTochange = req.body.arrayLentghToChange

    let emailPostaOfpanel = []
    db.doc(`/contactData/${req.params.conatctDataId}`).get().then((doc) => {

        console.log("veri geldi::", doc.data().panelEmailPostas)

        emailPostaOfpanel = doc.data().panelEmailPostas
    }).then(() => {


        if (emailPostaOfpanel[ArrayIndexTochange] == undefined) {

            console.log("fazla geldii array::")

            return db.doc(`/contactData/${req.params.conatctDataId}`).update({

                panelEmailPostas: emailPostaOfpanel
            }).then(() => {

                db.doc(`/contactData/${req.params.conatctDataId}`).update({
                    panelEmailPostas: admin.firestore.FieldValue.arrayUnion({ "emailPosta": newEmailInputValue, "defaultEmaill": newDefautEmail }),

                }).then(() => {
                    console.log("union yap??ld?? burada")
                    return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld??!!" })
                }).catch((eror) => {
                    return res.json({ Mesaj: "Union yaparken hata var!!" })
                })
            }).catch((err) => {
                console.log("index fazla hata olu??tu")
            })
        } else {

            emailPostaOfpanel[ArrayIndexTochange].emailPosta = newEmailInputValue;
            emailPostaOfpanel[ArrayIndexTochange].defaultEmaill = newDefautEmail;

        }



        // for (let index = 0; index < ArrayLenght; index++) {

        //     if (emailPostaOfpanel[index] == undefined) {
        //         return res.json({ Mesaj: "Nope index too long!!" })
        //     } else {

        //         emailPostaOfpanel[index].emailPosta = newEmailInputValue;
        //     }

        // }

    }).then(() => {
        db.doc(`/contactData/${req.params.conatctDataId}`).update({
            panelEmailPostas: emailPostaOfpanel
        })
    }).then(() => {
        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru g??celendi!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err })
    })
}

//Delete Phone Only from here

exports.deleteArrayInsidePhone = (req, res) => {

    // let currentId = req.body.currentIdd

    let existPhone = req.body.existPhoneNumber
    let existDefaultPhoneNumber = req.body.existDefaultPhone

    db.doc(`/contactData/${req.params.conatctDataId}`).update({

        panelPhoneNumbers: admin.firestore.FieldValue.arrayRemove({ "phoneNumber": existPhone, "defaultNumber": existDefaultPhoneNumber })


    }).then(() => {
        console.log("union yap??ld?? burada")

        return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld??!!" })

    }).catch((eror) => {

        return res.json({ Mesaj: "Union yaparken hata var!!" })

    })

}


// Delete Email Array inside Contact Here

exports.deleteArrayInsideEmail = (req, res) => {

    // let currentId = req.body.currentIdd
    let existEmail = req.body.existEmail
    let existDefaultEmail = req.body.existDefaultEmail

    db.doc(`/contactData/${req.params.conatctDataId}`).update({

        panelEmailPostas: admin.firestore.FieldValue.arrayRemove({ "emailPosta": existEmail, "defaultEmaill": existDefaultEmail })

    }).then(() => {
        console.log("union yap??ld?? burada")
        return res.json({ Mesaj: "Array fazla, o y??zden Union Yap??ld??!!" })
    }).catch((eror) => {
        return res.json({ Mesaj: "Union yaparken hata var!!" })
    })

}






///UPDATE Document from here
exports.updateDocumentFormInfo = (req, res) => {

    let documentFormbilgi = reduceDocumentInfo(req.body);
    db.doc(`/documentDataForm/${req.params.documentDatId}`).update(documentFormbilgi).then(() => {

        return res.json({ Mesaj: "Kullan??c?? bilgileri do??ru girilmi??tir!!" })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}



//dark theme or Light
//geceModu
exports.darkThemeOrLight = (req, res) => {

    let darkModu = reduceDarkMokAktif(req.body);
    db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update(darkModu).then(() => {
        return res.json({ Mesaj: "template theme changed!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

// position of social media on view
exports.positionOfSocialMedia = (req, res) => {
    let positionSocial = reducePositionOfSocail(req.body);
    db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update(positionSocial).then(() => {
        return res.json({ Mesaj: "position of social media changed!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}


// update StauMode Bank
exports.updateStattuModeBank = (req, res) => {
    let bankbilgi = reduceBankStatusMode(req.body);

    db.doc(`/bankData/${req.params.bankDataId}`).update(bankbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}


//update StatuMode of Profile url here
exports.updateStattuModeProfileUrl = (req, res) => {
    let bankbilgi = reduceProfileUrlStatusMode(req.body);

    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(bankbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}


//update statusMode contactData
exports.updateStattuModeContact = (req, res) => {

    let contactbilgi = reduceContactStatusMode(req.body);

    db.doc(`/contactData/${req.params.contactDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}

// Fatura StatueMode

exports.updateStattuModeFaturaBu = (req, res) => {

    let contactbilgi = reduceFaturaBillStatusMode(req.body);

    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}


//update statueMode Document BELGE
exports.updateStattuModeDocumentToChange = (req, res) => {

    let documentbilgi = reduceDocumentStatusMode(req.body);

    db.doc(`/documentDataForm/${req.params.documentDataFormId}`).update(documentbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}

//update statueMode of File Upload
exports.updateStattuModeFileUploadToView = (req, res) => {

    let fileUploadbilgi = reduceFileUploadToStatusMode(req.body);
    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update(fileUploadbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}

//update Orderof Bank data
exports.updateOrderOfBank = (req, res) => {
    let bankbilgi = reduceOrderIdofBank(req.body);
    db.doc(`/bankData/${req.params.bankDataId}`).update(bankbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//update order of Profile Url Panel
exports.updateOrderOfPanelProfileUrl = (req, res) => {
    let bankbilgi = reduceOrderIdofprofileUrl(req.body);
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(bankbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//update Orderof contact
exports.updateOrderOfContact = (req, res) => {
    let contactbilgi = reduceOrderIdofContact(req.body);
    db.doc(`/contactData/${req.params.contactDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//update order of Fatura
exports.updateOrderOfFaturaBill = (req, res) => {
    let contactbilgi = reduceOrderIdofContact(req.body);
    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(contactbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}



//order of Document Form
exports.updateOrderOfDocument = (req, res) => {
    let Documentbilgi = reduceOrderIdofDocument(req.body);
    db.doc(`/documentDataForm/${req.params.documentDataFormId}`).update(Documentbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//order of File Uploaded
exports.updateOrderOfFileUploaded = (req, res) => {
    let FileUploadedbilgi = reduceOrderIdofFileUploaded(req.body);
    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update(FileUploadedbilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully added!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

///panel updated ***************************************************


//******* panel Title//
//update panel Title from here Conatct panel title
exports.updateConatctPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanel(req.body);
    db.doc(`/contactData/${req.params.contactDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully updated!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

// update Panel Title fatura
exports.updateFaturaBillPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanel(req.body);
    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully updated!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}


//upadte Panel title of Panel Url from here
exports.updatePanelUrlLinkPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanelProfileUrl(req.body);
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully updated!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//bank Title panel
exports.updateBankPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanelBank(req.body);
    db.doc(`/bankData/${req.params.bankDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully updated!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//Document panel Title
exports.updateDocumentPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanelDocument(req.body);
    db.doc(`/documentDataForm/${req.params.documentDataFormId}`).update(updateTitlebilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully updated!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//File Upload Title Panel
exports.updateFileUploadPanelTitle = (req, res) => {

    let updateTitlebilgi = reduceTitleUpdatePanelFileUpload(req.body);
    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update(updateTitlebilgi).then(() => {
        return res.json({ Mesaj: "SuccessFully updated!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

}

//****************en of panel Title */



//delete Bank Panel from here
exports.bankPanelDelete = (req, res) => {

    const bankDataId = db.doc(`/bankData/${req.params.bankDataId}`);
    bankDataId.get().then((doc) => {
        bankDataId.delete();
    }).then(() => {
        return res.json({ Message: "SuccessFully Deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}

// delete Contact Form here
exports.contactPanelDelete = (req, res) => {

    const contactDataId = db.doc(`/contactData/${req.params.contactDataId}`);
    contactDataId.get().then((doc) => {
        contactDataId.delete();
    }).then(() => {
        return res.json({ Message: "SuccessFully Deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}

//delete Fatura Bill Time 
exports.FaturaBillPanelDelete = (req, res) => {

    const contactDataId = db.doc(`/BillFaturaData/${req.params.faturaDataId}`);
    contactDataId.get().then((doc) => {
        contactDataId.delete();
    }).then(() => {
        return res.json({ Message: "SuccessFully Deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })


}

//delete Profile Url from heer   
exports.profileUrlPanelDelete = (req, res) => {

    const contactDataId = db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`);
    contactDataId.get().then((doc) => {
        contactDataId.delete();
    }).then(() => {
        return res.json({ Message: "SuccessFully Deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}

// delete Document form heer
exports.DocumentFormPanelDelete = (req, res) => {
    const documentDataId = db.doc(`/documentDataForm/${req.params.documenttDataId}`);
    documentDataId.get().then((doc) => {
        documentDataId.delete();
    }).then(() => {
        return res.json({ Message: "SuccessFully Deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}

// delete File Uploaded

exports.fileUploadedPanelDelete = (req, res) => {
    const fileuploadedDataId = db.doc(`/fileUploadDocument/${req.params.fileuploadedDataId}`);
    fileuploadedDataId.get().then((doc) => {
        fileuploadedDataId.delete();
    }).then(() => {
        return res.json({ Message: "SuccessFully Deleted !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}


// I forget password
exports.passwordForget = (req, res) => {
    const personEnterForgetPassword = {
        eMail: req.body.eMail
    }
    const { valid, errorPersonEnter } = validateResetPassordForget(personEnterForgetPassword);
    if (!valid) {
        return res.status(400).json({ errorPersonEnter });
    }

    firebase.auth().sendPasswordResetEmail(personEnterForgetPassword.eMail).then((data) => {
        return res.status(200).json({ emailSent: "successfully sent" })
    }).catch(err => {
        console.error(err)
            //auth/wrong-password
            //auth/user-not-user
        return res.status(500).json({ err: err })

    })

}




//Fatura Information

exports.BillInfoData = (req, res) => {
    let userProfileData = reducekulBill(req.body);
    db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update(userProfileData).then(() => {

        return res.json({ Mesaj: "Successfully added!" })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}



//change Password from 
exports.parolaChangeOfUser = (req, res) => {

    const userInfoProfile = {
        oldpassword: req.body.oldpassword,
        newPassword: req.body.newPassword,
        confirmNewpassword: req.body.confirmNewpassword,
        eMail: req.user.eMail
    }

    console.log("data here:", req.user)

    if (userInfoProfile.newPassword != userInfoProfile.confirmNewpassword) {

        return res.status(400).json({ Mesaj: "Password are not conformed!!" })

    } else {

        firebase.auth().signInWithEmailAndPassword(req.user.eMail, userInfoProfile.oldpassword).then((data) => {

            admin.auth().updateUser(req.user.uid, {
                    emailVerified: true,
                    password: userInfoProfile.newPassword

                }).then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    // console.log('Successfully updated user', userRecord.toJSON());
                    return res.status(200).json({ Success: "SuccesFully Change Password!!" })

                })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    return res.status(500).json({ Fail: error })
                });

        }).catch(() => {

            return res.status(201).json({ Mesaj: "This password does'nt exist!!" })

        })


    }
}


//upoad data from here
///************************************************************ independant from heer */
exports.postUserDatafromheer = (req, res) => {



    const newPersonInfo = {
        eMail: req.body.eMail,
        publicName: req.body.publicName,
        publicSurname: req.body.publicSurname,
        userHandleName: req.body.userHandleName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }



    const userCredentials = {
        eMail: newPersonInfo.eMail,
        publicName: newPersonInfo.publicName,
        publicSurname: newPersonInfo.publicSurname,
        generalUserId,
        userHandleName: newPersonInfo.userHandleName,
        startDateCount: new Date().toISOString(),
        birthDate: "",
        phoneNumber: "",
        gender: 0,
        cardPairing: ""
    }


    const newProfileAdd = {
        profileTag: req.body.profileTag,
        generalUserId: req.user.uid,
        eMail: req.user.eMail,
        customUrl: "",
        dateofCreation: new Date().toISOString(),
        orderOfProfile: req.body.orderOfProfile,
        phoneNumber: "",
        profileAdres: "",
        profileCompany: "",
        profilDescription: "",
        profileEmail: "",
        profileTheme: "light",
        publicName: "",
        publicSurName: "",
        statusMode: true,
        statusOfUrl: true,
        placeOfSocialMediaPosition: "top",
        telNumber: "",
        taxNumber: "",
        taxAdministration: "",
        companyStatus: "",
        officeEmail: "",
        websiteUrlLink: "",
        officePhoneNumber: "",
        location: "",
        position: "",
        profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/profileMages%2F${defaultImage}?alt=media`,
        backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/backgroundMages%2F${backImag}?alt=media`,
    }


    const createBank = {
        accountOwner: req.body.accountOwner,
        bankName: req.body.bankName,
        bankStation: req.body.bankStation,
        bankIban: req.body.bankIban,
        profileId: req.params.profileId,
        generalUserId: req.user.generalUserId,
        isOpen: false,
        panelTitle: "",
        isDeleteOpen: false,
        isEditTitle: false,
        statueMode: true,
        OrderId: req.body.OrderId,
        type: "bankform",
        OrderId: req.body.OrderId
    }


    const createContact = {
        publicName: req.body.publicName,
        publicsurname: req.body.publicsurname,
        publicOrganization: req.body.publicOrganization,
        profilePosition: req.body.profilePosition,
        panelPhoneNumbers: [{ "phoneNumber": takenPhoneNumber != "" ? takenPhoneNumber : "" }],
        panelEmailPostas: [{ "emailPosta": takenEmailEposta != "" ? takenEmailEposta : "" }],
        streetAdress: req.body.streetAdress,
        profileCountry: req.body.profileCountry,
        profileCity: req.body.profileCity,
        profileNot: req.body.profileNot,
        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "conatctAddForm"

    }

    db.doc(`/userGeneral/${newPersonInfo.eMail}`).set(userCredentials).then(() => {
        db.collection("profilesOfGeneralUser").add(newProfileAdd);

    })




    //       .then(()=>{
    //         db.collection("bankData").add(createBank).then((data) => {
    //             const resScream = createBank
    //             resScream.bankId = data.id
    //            // res.json({ resScream });

    //       })
    //     }).then(()=>{


    //         db.collection("contactData").add(createContact).then((data) => {
    //             const resScream = createContact
    //             resScream.contactDataId = data.id
    //             res.json({ resScream });
    //     })

    // })

}