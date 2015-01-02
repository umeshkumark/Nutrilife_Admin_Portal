/**
 * Created by Umesh on 24-12-2014
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - PlanDAO.js
 * desc - used for CRUD operations for Diet Plan Collection
 *
 */

// MongoJS driver
var mongoJS = require('mongojs');
// Mongo DB connection URI
var mongoDBConnURI = null;
// Connection String for Diet_Plan Collection
var collection = null;


// Initialize
exports.initDAO = function(dbConnURI) {
    console.log('Diet_PlanDAO#initDAO');
    mongoDBConnURI = dbConnURI;
    collection = mongoJS.connect(mongoDBConnURI,['Diet_Plan']);
};

// Save Diet_Plan Document
exports.saveDocument = function(documentJSON,successCB,errorCB) {
    console.log('Diet_PlanDAO#saveDocument');
    console.dir(documentJSON);
    collection.Diet_Plan.save(documentJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving document ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Diet_Plan Document
exports.updateDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('Diet_PlanDAO#updateDocument ID - ' + documentID);
    console.dir(documentJSON);
    collection.Diet_Plan.update(
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

// Delete Diet_Plan Document
exports.deleteDocument = function(documentID,successCB,errorCB) {
    console.log('Diet_PlanDAO#deleteDocument ID - ' + documentID);
    collection.Diet_Plan.remove({_id:mongoJS.ObjectId(documentID)},function(error){
        if(error) {
            console.log('Error while deleting document ' + error);
            errorCB(error);
        }
        else {
            successCB();
        }
    });
};

// List Diet_Plan Documents
exports.listDocuments = function(successCB,errorCB) {
    console.log('Diet_PlanDAO#listDocuments');
    collection.Diet_Plan.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents');
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};