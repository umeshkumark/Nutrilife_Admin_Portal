/**
 * Created by Umesh on 23-12-2014
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - ConsultationDAO.js
 * desc - used for CRUD operations for Consultation Collection
 *
 */

// MongoJS driver
var mongoJS = require('mongojs');
// Mongo DB connection URI
var mongoDBConnURI = null;
// Connection String for Consultation Collection
var collection = null;


// Initialize
exports.initDAO = function(dbConnURI) {
    console.log('ConsultationDAO#initDAO');
    mongoDBConnURI = dbConnURI;
    collection = mongoJS.connect(mongoDBConnURI,['Consultation']);
};

// Save Consultation Document
exports.saveDocument = function(documentJSON,successCB,errorCB) {
    console.log('ConsultationDAO#saveDocument');
    console.dir(documentJSON);
    collection.Consultation.save(documentJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving document ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Consultation Document
exports.updateDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('ConsultationDAO#updateDocument ID - ' + documentID);
    console.dir(documentJSON);
    collection.Consultation.update(
        {_id:mongoJS.ObjectId(documentID)},
        {$set:{name:documentJSON.name,desc:documentJSON.desc,updatedTime:documentJSON.updatedTime,updatedBy:documentJSON.updatedBy}},
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

// Delete Consultation Document
exports.deleteDocument = function(documentID,successCB,errorCB) {
    console.log('ConsultationDAO#deleteDocument ID - ' + documentID);
    collection.Consultation.remove({_id:mongoJS.ObjectId(documentID)},function(error){
        if(error) {
            console.log('Error while deleting document ' + error);
            errorCB(error);
        }
        else {
            successCB();
        }
    });
};

// List Consultation Documents
exports.listDocuments = function(successCB,errorCB) {
    console.log('ConsultationDAO#listDocuments');
    collection.Consultation.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents');
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};