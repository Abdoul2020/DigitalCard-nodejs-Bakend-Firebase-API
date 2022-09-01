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





// get all the date of special user
exports.getAllDateOfAuser = (req, res) => {
    const dateodUserClick = db.collection("cardUrlDate").where("genralUserId", "==", req.user.generalUserId);

    dateodUserClick.get().then((data) => {
        let allUser = [];
        data.forEach((doc) => {
            allUser.push({
                generalUserId: doc.data().genralUserId,
                dateofClick: doc.data().clickDate
            })
        });
        return res.json({ allClcickCount: allUser })
    }).catch(err => {
        console.error(err)
    })
}

//get all profile date click
exports.getAllProfileClickDate = (req, res) => {

    const dateodUserClick = db.doc(`/cartProfileDate/${req.params.profileId}`);

    dateodUserClick.get().then((doc) => {

        const allUser = doc.data()

        console.log("data:", doc.data())

        return res.json({ allUser })
    }).catch(err => {
        console.error(err)
    })

}