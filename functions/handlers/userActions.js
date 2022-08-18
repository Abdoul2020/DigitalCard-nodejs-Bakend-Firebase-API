const { db, admin } = require("../importantDoc/admin");


// initialize App here
const firebaseConfig = require("../importantDoc/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);


const { validateSignUpData, validateLoginData, validateRegisterCardRefer, reduceGeneralUserInfo, reduceSingleUserInfo, reduceDarkMokAktif, reducePositionOfSocail } = require("../importantDoc/validatorData");


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

// card refer to another url
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
            res.status(500).json({ verificationCodeHata: "verification kodu aynı değil" })
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
            return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
        }

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

    let orderOfProfile = 0;
    if (req.body.profileTag.trim() === "") {
        return res.status(400).json({ Error: "This field can't be empty!!" });
    }


    const newProfileAdd = {
        profileTag: req.body.profileTag,
        generalUserId: req.user.uid,
        eMail: req.user.eMail,
        customUrl: "",
        dateofCreation: new Date().toISOString(),
        orderOfProfile,
        phoneNumber: "",
        profileAdres: "",
        profileCompany: "",
        profilDescription: "",
        profileEmail: "",
        profileTheme: false,
        publicName: "",
        publicSurName: "",
        statusMode: true,
        statusOfUrl: true,
        placeOfSocialMediaPosition: "top",
        telNumber: "",
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

                }).then(() => {
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


//random Link id functşon for the card
exports.cardLinkRandomAdd = (req, res) => {

    if (req.body.randomurlText.trim() == "") {

        return res.status(400).json({ Body: "Please write something !!" })
    }

    var verificationCode = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    const createIkon = {
        randomurlText: req.body.randomurlText,
        generalUserId: req.user.generalUserId,
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
        statuMode: true
    }

    db.collection("userSocialMediaUrl").add(newComments).then(() => {
        res.json(newComments)

    }).catch(err => {
        console.log(err)
        return res.status(500).json({ Error: err.code })
    })
}

//add facebook from here url
//facebook
exports.facebookUrlAdd = (req, res) => {
    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({ Error: "Url alanı boş geçilemez!!" });
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


// count when click link here on Date
exports.ClickUrlCardLink = (req, res) => {

    const cardUrlidDocument = db.doc(`/cardUrlLinks/${req.params.cardlinkid}`);
    cardUrlClcikDate = db.collection("cardUrlDate")


    let cardLinkData
    cardUrlidDocument.get().then(doc => {
        if (doc.exists) {
            cardLinkData = doc.data()
            cardLinkData.urlcardId = doc.id
            return cardUrlClcikDate.get()
        } else {
            return res.status(400).json({ Error: "card url not found !!" })
        }
    }).then((data) => {

        const neCredentials = {
            cardlinkid: req.params.cardlinkid,
            clickDate: [new Date().toISOString()],
            genralUserId: cardLinkData.generalUserId,
            eMail: cardLinkData.eMail
        }
        if (db.collection(`${cardLinkData.generalUserId}`)) {
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
            return db.collection("cardUrlLinks").where("generalUserId", "==", req.params.generalUserId).get();
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
                publicSurName: doc.data().publicSurname,
                profileTag: doc.data().profileTag,
                generalUserId: doc.data().generalUserId,
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
    }).then(() => {
        return res.json(singleUserData);
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Error: err.code })
    })

}


//kayıtlı olan  kullanıcı bilgileri Getir
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
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                profileId: doc.id
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

        return res.json({ success: "Succvessfully updated!" })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

    if (req.user.secretKod) {
        db.doc(`/cardUrlLinks/${req.user.secretKod}`).update(infoToChange).then(() => {
            return res.json({ Mesaj: "Succvessfully updated!!" })
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
            socialMedia.allsocial.push(doc.data());
        })
    }).then(() => {
        return res.json(socialMedia)
    }).catch(() => {
        return res.status(400).json({ errorgetSuprofile: "error wihle..." })
    })

})

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
        socialtype: req.body.socialtype
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
    const subProfilDocument = db.doc(`/userSocialMediaUrl/${req.params.profilId}`);
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


    if (req.body.profileCountry.trim() == "") {
        return res.status(400).json({ Body: "you need to choose a country !!" })
    }
    if (req.body.profileCity.trim() == "") {
        return res.status(400).json({ Body: "you need to choose a city !!" })
    }

    const createContact = {
        publicName: req.body.publicName,
        publicsurname: req.body.publicsurname,
        publicOrganization: req.body.publicOrganization,
        profilePosition: req.body.profilePosition,
        kurumsalTelefon: req.body.kurumsalTelefon,
        kisiselTelefon: req.body.kisiselTelefon,
        kurumsalEmail: req.body.kurumsalEmail,
        bireyselEmail: req.body.bireyselEmail,
        streetAdress: req.body.streetAdress,
        profileCountry: req.body.profileCountry,
        profileCity: req.body.profileCity,
        profileNot: req.body.profileNot,
        profileId: req.params.profileId
    }
    db.collection("contactData").add(createContact).then((data) => {
        const resScream = createContact
        resScream.contactDataId = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });

        console.error(err)
    })
}

// panel Bank Info register

exports.postBanInfopanel = (req, res) => {

    if (req.body.bankName.trim() == "") {
        return res.status(400).json({ Body: "you need to write a bank Name !!" })
    }
    if (req.body.bankIban.trim() == "") {
        return res.status(400).json({ Body: "you need to write bank Iban !!" })
    }

    const createBank = {
        accountOwner: req.body.accountOwner,
        bankName: req.body.bankName,
        bankStation: req.body.bankStation,
        bankIban: req.body.bankIban,
        profileId: req.params.profileId
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

//belge yükle register
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
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
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
            return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded }));

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

    const allpanelProfile = db.collection("bankData").where("profileId", "==", req.params.profileId)

    allpanelProfile.get().then((data) => {
        panelDataInfo.bankDataInfo = []
        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({
                accountOwner: doc.data().accountOwner,
                bankIban: doc.data().bankIban,
                bankName: doc.data().bankName,
                bankStation: doc.data().bankStation,
                profileId: doc.data().profileId,
                BankDataId: doc.id
            });
        })

        return db.collection("contactData").where("profilId", "==", req.params.profileId).get();

    }).then((data) => {
        panelDataInfo.contactDataInfo = []

        data.forEach((doc) => {
            panelDataInfo.contactDataInfo.push({
                bireyselEmail: doc.data().bireyselEmail,
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
                contactDataId: doc.id

            });
        })

    }).then(() => {
        console.log("veiler:", panelDataInfo)
        return res.json(panelDataInfo)
    }).catch(() => {
        return res.status(400).json({ errorgetPanel: "error wihle getting panel" })
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