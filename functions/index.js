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
    socialUrlAddNew,
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
    postFaturaBillInfopanel,
    postUrlLinkiInfopanel,
    postBanInfopanel,
    uploadFilePdf,
    getpanelInfFromHere,
    backgorundImageChange,
    darkThemeOrLight,
    positionOfSocialMedia,
    updateBankInfo,
    updateStattuModeBank,
    updateStattuModeProfileUrl,
    updateStattuModeContact,
    updateStattuModeFaturaBu,
    updateStattuModeDocumentToChange,
    postDocumentInfopanel,
    updateDocumentFormInfo,
    updateContactInfo,
    updateFaturaBillInfo,
    updateContactInfoArrayPhoneOnly,
    updateBankInfoArrayDataOnly,
    updateContactInfoEmailOnly,
    updateURLpanelLinki,
    uploadFilePdfChange,
    BillInfoData,
    parolaChangeOfUser,
    updateOrderOfBank,
    updateStattuModeFileUploadToView,
    passwordForget,
    updateOrderOfContact,
    updateOrderOfFaturaBill,
    updateOrderOfDocument,
    updateOrderOfFileUploaded,
    getTherandomUrInfo,
    bankPanelDelete,
    contactPanelDelete,
    FaturaBillPanelDelete,
    profileUrlPanelDelete,
    singleUserInfoWithgeneraluserIdPreviewPageToken,
    DocumentFormPanelDelete,
    fileUploadedPanelDelete,
    updateConatctPanelTitle,
    updateFaturaBillPanelTitle,
    updatePanelUrlLinkPanelTitle,
    updateBankPanelTitle,
    updateDocumentPanelTitle,
    updateFileUploadPanelTitle,
    postFirstPlaceWhereToPutUploadFilepanel,
    updateOrderOfPanelProfileUrl,
    updateProfileUrlLinksDataOnly,

    deleteArrayInsidePhone,
    deleteArrayInsideEmail,
    updateSocialMediaOfPanelChanges

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

app.post("/newSocialUrlAddArray/:profileId", FBAuth, socialUrlAddNew)


app.post("/facebookUrlAdd", FBAuth, facebookUrlAdd) //facebook url add here

//reset password forget
app.post("/resetPasswordForget", passwordForget) //password forget mail sent

app.post("/themeChange/:profileId", FBAuth, darkThemeOrLight); //dark or Light theme

app.post("/ChangesocialPosition/:profileId", FBAuth, positionOfSocialMedia)

app.post("/uploadProfile/:profileId", FBAuth, uploadProfile); //upload profile from dashboard
app.post("/uploadFileDoucment/:profileId", FBAuth, uploadFilePdf) //UPLOAD FİLE DOCUMENT        postFirstPlaceWhereToPutUploadFilepanel

app.post("/uploadFileDoucmentFirstTime/:profileId", FBAuth, postFirstPlaceWhereToPutUploadFilepanel) //post Data from upload

app.put("/changeUploadImage/:fileUploadDocumentId", FBAuth, uploadFilePdfChange);


app.post("/uploadBackgroundImage/:profileId", FBAuth, backgorundImageChange) //change the background ImagebackgorundImageChange
app.post("/AddBillInfoData/:profileId", FBAuth, BillInfoData); //fatura Info Data

app.put("/user/updateUser", FBAuth, updateGeneralUserData); //update genral user Info
app.put("/updateProfile/:profilId", FBAuth, updateSingleUserData); //single profile update

app.put("/updateSocialMediaUrl/:socialMediaId", FBAuth, socialUrlUpdate) //updated social   

app.put("/updateSocialFromPanel", FBAuth, updateSocialMediaOfPanelChanges)

app.put("/bankdataUpdate/:bankDataId", FBAuth, updateBankInfo); //update bank Info  updateContactInfo
app.put("/changeStatusModeOfBank/:bankDataId", FBAuth, updateStattuModeBank) //update status bank here 
app.put("/changeStatusModeOfContact/:contactDataId", FBAuth, updateStattuModeContact) //update contact Mode statatue    updateStattuModeProfileUrl
app.put("/changeStatusModeOfProfileUrl/:panelProfileUrlDataId", FBAuth, updateStattuModeProfileUrl) //sttaue Mode of Profile Url  

app.put("/changeStatusModeOfFaturaBill/:faturaDataId", FBAuth, updateStattuModeFaturaBu)




app.put("/changeStatusModeOfDocument/:documentDataFormId", FBAuth, updateStattuModeDocumentToChange) //update document statusMode   
app.put("/changeStatusModeOfFileUpload/:belgeDocumentId", FBAuth, updateStattuModeFileUploadToView) //update File Upload here  

app.put("/changeOrdreIdOfBank/:bankDataId", FBAuth, updateOrderOfBank) //update order of Id Bank   
app.put("/changeOrdreIdOfContact/:contactDataId", FBAuth, updateOrderOfContact) //updated order of Contact
app.put("/changeOrdreIdOfdocument/:documentDataFormId", FBAuth, updateOrderOfDocument) //updaed order of Document 
app.put("/changeOrdreIdOfFileUploaded/:belgeDocumentId", FBAuth, updateOrderOfFileUploaded) //uploaded order of File Uploaded 
app.put("/changeOrdreIdOfprofileUrlPanel/:panelProfileUrlDataId", FBAuth, updateOrderOfPanelProfileUrl)

app.put("/changeOrdreIdOfFaturaBill/:faturaDataId", FBAuth, updateOrderOfFaturaBill)


//panel Title update here
app.put("/changepanelTitle/:contactDataId", FBAuth, updateConatctPanelTitle);
app.put("/changepanelProfileUrlPanelTitle/:panelProfileUrlDataId", FBAuth, updatePanelUrlLinkPanelTitle);
app.put("/changepanelTitleBank/:bankDataId", FBAuth, updateBankPanelTitle)
app.put("/changepanelTitleDocument/:documentDataFormId", FBAuth, updateDocumentPanelTitle)
app.put("/changepanelTitleFileUpload/:belgeDocumentId", FBAuth, updateFileUploadPanelTitle)

app.put("/changepanelTitleOfFatura/:faturaDataId", FBAuth, updateFaturaBillPanelTitle);


app.put("/contactdataUpdate/:conatctDataId", FBAuth, updateContactInfo); //update contact data 

app.put("/faturaBilldataUpdate/:faturaDataId", FBAuth, updateFaturaBillInfo);


app.put("/documentdataUpdate/:documentDatId", FBAuth, updateDocumentFormInfo) //update document form from here   
app.put("/updatePanelProfileUrl/:panelProfileUrlDataId", FBAuth, updateURLpanelLinki)

app.put("/updatePhoneNumbersHere/:conatctDataId", FBAuth, updateContactInfoArrayPhoneOnly);

app.put("/updateBankDataOnly/:BankDataId", FBAuth, updateBankInfoArrayDataOnly);

app.put("/updateProfileUrlLinksDataOnly/:panelProfileUrlDataId", FBAuth, updateProfileUrlLinksDataOnly);


app.put("/updateEmailPostasHere/:conatctDataId", FBAuth, updateContactInfoEmailOnly);




//create contact data of profile
app.post("/conatctAddData/:profileId", FBAuth, postContactInfopanel)

app.post("/faturaBillAddData/:profileId", FBAuth, postFaturaBillInfopanel)


app.post("/bankAddData/:profileId", FBAuth, postBanInfopanel)
app.post("/documentData/:profileId", FBAuth, postDocumentInfopanel) //POST DOCUMENT
app.post("/changegePassword", FBAuth, parolaChangeOfUser) //change Passworrd   postUrlLinkiInfopanel
app.post("/panelUrlLinkAddData/:profileId", FBAuth, postUrlLinkiInfopanel) //profile Url Link






app.get("/user/:userHandleName", singleUserInfo); //get all data with  Name.
app.get("/userid/:userId", singleUserInfoWithgeneraluserId); //kullancici bilgiler getir bana with GENRALUSERıD 
app.get("/userPreviewPage/:userId", FBAuth, singleUserInfoWithgeneraluserIdPreviewPageToken);



app.get("/panelData/:profileId", FBAuth, getpanelInfFromHere); //get data of panel
app.get("/geturlcardRandom/:urlRandomId", getTherandomUrInfo) ///get url card form Link card Read

//user Info get with authenticated
app.get("/userAuthData", FBAuth, getAuthenticatedUser);




// delete array  from here
app.delete("/deleteArrayPhone/:conatctDataId", FBAuth, deleteArrayInsidePhone);

app.delete("/deleteArrayEmail/:conatctDataId", FBAuth, deleteArrayInsideEmail);


// delete user
app.delete("/deleteUser", FBAuth, deleteUser);
app.delete("/deleteProfile/:profilId", FBAuth, deleteSingleProfile);
app.delete("/deleteSocialMediaofProfile/:socialMediaId", FBAuth, deleteSocialMediaOfProfile);


//**********Panel delete */
app.delete("/bankPanelDelete/:bankDataId", FBAuth, bankPanelDelete);

app.delete("/contactPanelDelete/:contactDataId", FBAuth, contactPanelDelete);

app.delete("/documentPanelDelete/:documenttDataId", FBAuth, DocumentFormPanelDelete);
app.delete("/fileUploadPanelDelete/:fileuploadedDataId", FBAuth, fileUploadedPanelDelete);

//fatura delete From HERE   
app.delete("/faturaPanelDelete/:faturaDataId", FBAuth, FaturaBillPanelDelete);


app.delete("/profileUrlPanelDelete/:panelProfileUrlDataId", FBAuth, profileUrlPanelDelete); //delete profile Url from here





//All userbring
app.get("/allUser", getAllUser);

app.post("/clickUrlDate/:cardlinkid/add", ClickUrlCardLink);
app.post("/clickProfile/:profileId/add", ClickProfileLink);

//when click to download


app.get("/getallDateofClick", FBAuth, getAllDateOfAuser);
app.get("/getAllDateofProfileClick/:profileId", FBAuth, getAllProfileClickDate);

//subprofile
app.get("/getAllProfile", FBAuth, getAllSubprofileOfGeneralUser)

// get all social media of user
app.get("/getAllSocialMedia/:profileId", FBAuth, getallSocialMediaofSingleprofile);

// The api to send to fireabase
exports.api = functions.https.onRequest(app);


// firebase trigger
// get the notifications when the click on the link