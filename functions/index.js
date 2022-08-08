const functions = require("firebase-functions");

const app = require("express")();

const {

} = require("./handlers/dataBack")

const {
    registerClass,
    loginClass,
    addSubProfile,
    registerClassUrlReference,
    loginClassWithUrlCard,
    cardLinkRandomAdd, //carde url Link urteiyor
    socialUrlAdd,
    facebookUrlAdd,
    uploadProfile
} = require("./handlers/userActions")

const {
    getAllUser,
    ClickUrlCardLink,
    getAllDateOfAuser
} = require("./handlers/dataBack")




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { db } = require("./importantDoc/admin"); //

const FBAuth = require("./importantDoc/fbAuth"); //need to bring authentication

const cors = require("cors");

//swagger integerations
var swaggerUI = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
app.use("/swaggerHibritcard", swaggerUI.setup(swaggerDocument))
    //end of swagger

const fbAuth = require("./importantDoc/fbAuth");

app.use(cors());

//all the request made from here.
app.post("/register", registerClass); //register function
app.post("/registerWithUrlCard", registerClassUrlReference) //register with card url
app.post("/login", loginClass); //login into system from here.
app.post("/loginWithCardUrl", FBAuth, loginClassWithUrlCard); //login into system from here.
app.post("/addSubProfile/newProfil", FBAuth, addSubProfile);
app.post("/cardLinkAdd", FBAuth, cardLinkRandomAdd); //create card Link Url
app.post("/newSocialUrlAdd", FBAuth, socialUrlAdd) //add social url link
app.post("/facebookUrlAdd", FBAuth, facebookUrlAdd) //facebook url add here
app.post("/uploadProfile", FBAuth, uploadProfile); //upload profile from dashboard

//All userbring

app.get("/allUser", getAllUser);
app.get("/clickUrlDate/:cardlinkid/add", ClickUrlCardLink);
app.get("/getallDateofClcick", FBAuth, getAllDateOfAuser)


// The api to send to fireabase
exports.api = functions.https.onRequest(app);


// firebase trigger
// get the notifications when the click on the link