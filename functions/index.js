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
    uploadProfile,
    ClickUrlCardLink,
    ClickProfileLink,
    deleteUser,
    singleUserInfo,
    singleUserInfoWithgeneraluserId,
    getAuthenticatedUser,
    deleteSingleProfile,
    getAllSubprofileOfGeneralUser,
    updateGeneralUserData,
    updateSingleUserData,
    getallSocialMediaofSingleprofile,
    socialUrlUpdate,
    deleteSocialMediaOfProfile,
    postContactInfopanel,
    postBanInfopanel,
    uploadFilePdf,
    getpanelInfFromHere,
    backgorundImageChange,
    darkThemeOrLight,
    positionOfSocialMedia,
    updateBankInfo,
    updateStattuModeBank,
    updateStattuModeContact,
    updateStattuModeDocumentToChange,
    postDocumentInfopanel,
    updateDocumentFormInfo,
    updateContactInfo,
    uploadFilePdfChange,
    BillInfoData,
    parolaChangeOfUser,
    updateOrderOfBank,
    updateStattuModeFileUploadToView,
    passwordForget
} = require("./handlers/userActions")

const {
    getAllUser,
    getAllProfileClickDate,

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
app.post("/addProfile", FBAuth, addSubProfile);
app.post("/cardLinkAdd", FBAuth, cardLinkRandomAdd); //create card Link Url
app.post("/newSocialUrlAdd/:profileId", FBAuth, socialUrlAdd) //add social url link
app.post("/facebookUrlAdd", FBAuth, facebookUrlAdd) //facebook url add here

//reset password forget
app.post("/resetPasswordForget", passwordForget) //password forget mail sent

app.post("/themeChange/:profileId", FBAuth, darkThemeOrLight); //dark or Light theme
app.post("/ChangesocialPosition/:profileId", FBAuth, positionOfSocialMedia)

app.post("/uploadProfile/:profileId", FBAuth, uploadProfile); //upload profile from dashboard
app.post("/uploadFileDoucment/:profileId", FBAuth, uploadFilePdf) //UPLOAD FİLE DOCUMENT
app.put("/changeUploadImage/:fileUploadDocumentId", FBAuth, uploadFilePdfChange)
app.post("/uploadBackgroundImage/:profileId", FBAuth, backgorundImageChange) //change the background ImagebackgorundImageChange
app.post("/AddBillInfoData/:profileId", FBAuth, BillInfoData); //fatura Info Data

app.put("/user/updateUser", FBAuth, updateGeneralUserData); //update genral user Info
app.put("/updateProfile/:profilId", FBAuth, updateSingleUserData); //single profile update
app.put("/updateSocialMediaUrl/:socialMediaId", FBAuth, socialUrlUpdate) //updated social   media data
app.put("/bankdataUpdate/:bankDataId", FBAuth, updateBankInfo); //update bank Info  updateContactInfo
app.put("/changeStatusModeOfBank/:bankDataId", FBAuth, updateStattuModeBank) //update status bank here 
app.put("/changeStatusModeOfContact/:contactDataId", FBAuth, updateStattuModeContact) //update contact Mode statatue   

app.put("/changeStatusModeOfDocument/:documentDataFormId", FBAuth, updateStattuModeDocumentToChange) //update document statusMode   
app.put("/changeStatusModeOfFileUpload/:belgeDocumentId", FBAuth, updateStattuModeFileUploadToView) //update File Upload here  

app.put("/changeOrdreIdOfBank/:bankDataId", FBAuth, updateOrderOfBank) //update order of Id Bank


app.put("/contactdataUpdate/:conatctDataId", FBAuth, updateContactInfo); //update contact data   updateDocumentFormInfo
app.put("/documentdataUpdate/:documentDatId", FBAuth, updateDocumentFormInfo) //update document form from here





//create contact data of profile
app.post("/conatctAddData/:profileId", FBAuth, postContactInfopanel)
app.post("/bankAddData/:profileId", FBAuth, postBanInfopanel)
app.post("/documentData/:profileId", FBAuth, postDocumentInfopanel) //POST DOCUMENT
app.post("/changegePassword", FBAuth, parolaChangeOfUser) //change Passworrd






app.get("/user/:userHandleName", singleUserInfo); //get all data with  Name.
app.get("/userid/:userId", singleUserInfoWithgeneraluserId); //kullancici bilgiler getir bana with GENRALUSERıD

app.get("/panelData/:profileId", FBAuth, getpanelInfFromHere); //get data of panel

//user Info get with authenticated
app.get("/userAuthData", FBAuth, getAuthenticatedUser);

// delete user
app.delete("/deleteUser", FBAuth, deleteUser);
app.delete("/deleteProfile/:profilId", FBAuth, deleteSingleProfile);
app.delete("/deleteSocialMediaofProfile/:socialMediaId", FBAuth, deleteSocialMediaOfProfile);


//All userbring
app.get("/allUser", getAllUser);

app.post("/clickUrlDate/:cardlinkid/add", ClickUrlCardLink);
app.post("/clickProfile/:profileId/add", ClickProfileLink);

app.get("/getallDateofClick", FBAuth, getAllDateOfAuser);
app.get("/getAllDateofProfileClick/:profileId", FBAuth, getAllProfileClickDate);

//subprofile
app.get("/getAllProfile", FBAuth, getAllSubprofileOfGeneralUser)
    // get all social media of user
app.get("/getAllSocialMedia/:profileId", FBAuth, getallSocialMediaofSingleprofile)


// The api to send to fireabase
exports.api = functions.https.onRequest(app);


// firebase trigger
// get the notifications when the click on the link