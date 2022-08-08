const { app } = require("firebase-admin");
const { json } = require("stream/consumers");
const { db } = require("../importantDoc/admin")


//get all icons from there
exports.getAllUser = (req, res) => {
    db.collection("userGeneral").get().then((data) => {
        let allUser = [];
        data.forEach((doc) => {
            allUser.push({
                eMail: doc.data().eMail,
                userHandleName: doc.data().userHandleName,
                generalUserId: doc.data().generalUserId
            })
        });
        return res.json(allUser)
    }).catch(err => {
        console.error(err)
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
            return res.status(400).json({ Hata: "card url not found !!" })
        }
    }).then((data) => {
        db.collection("cardUrlDate").add({
            cardlinkid: req.params.cardlinkid,
            clickDate: new Date().toISOString(),
            genralUserId: cardLinkData.generalUserId,
            eMail: cardLinkData.eMail

        }).then(() => {
            return res.json({ Ok: "succesfully added" })
        })
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

// get all the date of special user
exports.getAllDateOfAuser = (req, res) => {
    const dateodUserClick = db.collection("cardUrlDate").where("genralUserId", "==", req.user.generalUserId);

    dateodUserClick.get().then((data) => {
        let allUser = [];
        data.forEach((doc) => {
            allUser.push({
                eMail: doc.data().eMail,
                generalUserId: doc.data().genralUserId,
                dateofClick: doc.data().clickDate
            })
        });
        return res.json({ allClcickCount: allUser.length })
    }).catch(err => {
        console.error(err)
    })
}