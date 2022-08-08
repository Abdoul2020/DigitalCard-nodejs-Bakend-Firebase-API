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