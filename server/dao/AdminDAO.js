/**
 * Created by Umesh on 24-12-2014.
 *
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - AdminDAO.js
 * desc - used for CRUD operations for Admin_Users Collection & other Admin functions
 */

// MongoJS driver
var mongoJS = require('mongojs');
// Mongo DB connection URI
var mongoDBConnURI = null;
// Connection String for Admin_Users Collection
var collection = null;
// Connection String for Admin_Email Collection
var emailCollection = null;
// Connection String for Admin_Site_Mgmt Collection
var siteMgmtCollection = null;


// Initialize
exports.initDAO = function(dbConnURI) {
    console.log('AdminDAO#initDAO');
    mongoDBConnURI = dbConnURI;
    collection = mongoJS.connect(mongoDBConnURI,['Admin_Users']);
    emailCollection = mongoJS.connect(mongoDBConnURI,['Admin_Email']);
    siteMgmtCollection = mongoJS.connect(mongoDBConnURI,['Admin_Site_Mgmt']);
};

// Authenticate
exports.authenticate = function(userJSON,successCB,errorCB) {
    console.log('AdminDAO#authenticate');
    console.dir(userJSON);
    collection.Admin_Users.find({login_id:userJSON.login_id,password:userJSON.password},function(error,document){
        if(error) {
            console.log('Error while authenticating user ' + error);
            errorCB({});
        }
        else if (!document) {
            console.log('Unable to Login');
            errorCB({});
        }
        else {
            successCB(document);
        }
    });
};

exports.checkIfUserExists = function(userJSON,successCB,errorCB) {
    console.log('AdminDAO#checkIfUserExists');
    console.dir(userJSON);
    collection.Admin_Users.find({login_id:userJSON.login_id},function(error,document){
        if(error) {
            console.log('Error while getting login details ' + error);
            errorCB({});
        }
        else if (!document) {
            console.log('No user exists with the login id');
            errorCB({});
        }
        else {
            successCB(document);
        }
    });
};

// Save Admin_Users Document
exports.saveDocument = function(documentJSON,successCB,errorCB) {
    console.log('AdminDAO#saveDocument');
    console.dir(documentJSON);
    collection.Admin_Users.save(documentJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving document ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Admin_Users Document
exports.updateDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('AdminDAO#updateDocument ID - ' + documentID);
    console.dir(documentJSON);
    collection.Admin_Users.update(
        {_id:mongoJS.ObjectId(documentID)},
        {$set:{name:documentJSON.name,login_id:documentJSON.login_id,
            is_suspended:documentJSON.is_suspended,role:documentJSON.role,
            password:documentJSON.password,
            updatedTime:documentJSON.updatedTime,updatedBy:documentJSON.updatedBy}},
        function(error,updatedDocument){
            if(error){
                console.log('Error while updating document ' + error);
                errorCB(error);
            }
            else {
                successCB(updatedDocument);
            }
        }
    );
};

// Update Admin users password
exports.modifyPassword = function(documentJSON,successCB,errorCB) {
    console.log('AdminDAO#modifyPassword');
    console.dir(documentJSON);
    collection.Admin_Users.update(
        {login_id:documentJSON.login_id},
        {$set:{password:documentJSON.password,
            updatedTime:documentJSON.updatedTime,updatedBy:documentJSON.updatedBy}},
        function(error,updatedDocument){
            if(error){
                console.log('Error while updating document ' + error);
                errorCB(error);
            }
            else {
                successCB(updatedDocument);
            }
        }
    );
};

// Delete Admin_Users Document
exports.deleteDocument = function(documentID,successCB,errorCB) {
    console.log('AdminDAO#deleteDocument ID - ' + documentID);
    collection.Admin_Users.remove({_id:mongoJS.ObjectId(documentID)},function(error){
        if(error) {
            console.log('Error while deleting document ' + error);
            errorCB(error);
        }
        else {
            successCB();
        }
    });
};

// List Admin_Users Documents
exports.listDocuments = function(successCB,errorCB) {
    console.log('AdminDAO#listDocuments');
    collection.Admin_Users.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents ' + error);
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};

// Save Email Details
exports.saveEmailDocument = function(emailJSON,successCB,errorCB){
    console.log('AdminDAO#saveEmailDetails');
    emailCollection.Admin_Email.save(emailJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving the Email details ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Email Details
exports.updateEmailDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('AdminDAO#updateEmailDocument ID - ' + documentID);
    console.dir(documentJSON);
    emailCollection.Admin_Email.update(
        {_id:mongoJS.ObjectId(documentID)},
        {$set:{user:documentJSON.user,password:documentJSON.password,
            host:documentJSON.host,ssl:documentJSON.ssl,
            to_email:documentJSON.to_email,from_email:documentJSON.from_email,
            to_name:documentJSON.to_name,from_name:documentJSON.from_name,
            site_url:documentJSON.site_url,
            updatedTime:documentJSON.updatedTime,updatedBy:documentJSON.updatedBy}},
        function(error,updatedDocument){
            if(error){
                console.log('Error while updating document ' + error);
                errorCB(error);
            }
            else {
                successCB(updatedDocument);
            }
        }
    );
};

// Get Email Details
exports.listEmailDocuments = function(successCB,errorCB) {
    console.log('AdminDAO#listEmailDocuments');
    emailCollection.Admin_Email.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents ' + error);
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};

// Get Site Mgmt Details
exports.listSiteMgmtDocuments = function(successCB,errorCB) {
    console.log('AdminDAO#listSiteMgmtDocuments');
    siteMgmtCollection.Admin_Site_Mgmt.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents ' + error);
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};


// Save Site Mgmt Details
exports.saveSiteMgmtDocument = function(siteMgmtJSON,successCB,errorCB){
    console.log('AdminDAO#saveSiteMgmtDocument');
    siteMgmtCollection.Admin_Site_Mgmt.save(siteMgmtJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving the Site Mgmt details ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Site Mgmt Details
exports.updateSiteMgmtDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('AdminDAO#updateSiteMgmtDocument ID - ' + documentID);
    console.dir(documentJSON);
    siteMgmtCollection.Admin_Site_Mgmt.update(
        {_id:mongoJS.ObjectId(documentID)},
        {$set:{site_header:documentJSON.site_header,site_footer:documentJSON.site_footer,
            login_header:documentJSON.login_header,login_footer:documentJSON.login_footer,
            updatedTime:documentJSON.updatedTime,updatedBy:documentJSON.updatedBy}},
        function(error,updatedDocument){
            if(error){
                console.log('Error while updating document ' + error);
                errorCB(error);
            }
            else {
                successCB(updatedDocument);
            }
        }
    );
};