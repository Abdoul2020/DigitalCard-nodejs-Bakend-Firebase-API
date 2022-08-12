const { admin, db } = require("./admin")
    //authoraization ve gönderdiğimiz token ver bize.Call authentication middleware;
module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("Token Not Found...!")

        return res.status(403).json({ Hata: "No Permission" })

    }


    //verifier et return which token is that
    admin.auth().verifyIdToken(idToken).then(tokenac => {
        req.user = tokenac;
        console.log(tokenac);
        return db.collection("userGeneral").where("generalUserId", "==", req.user.uid)
            .limit(1) //alacağımız dokümanı 1 tane olarak limitle
            .get().then(data => {
                req.user.generalUserId = data.docs[0].data().generalUserId;
                req.user.eMail = data.docs[0].data().eMail;
                req.user.secretKod = data.docs[0].data().secretKod;
                return next()
            }).catch(err => {
                console.error("Error while checking token", err);
                res.status(403).json({ err })
            })

    })


}