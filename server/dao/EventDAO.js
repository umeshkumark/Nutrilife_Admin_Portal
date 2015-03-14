/**
 * Created by Umesh on 07-03-2015
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - EventDAO.js
 * desc - used for CRUD operations for Events Collection
 *
 */

// MongoJS driver
var mongoJS = require('mongojs');
// Mongo DB connection URI
var mongoDBConnURI = null;
// Connection String for Event Collection
var collection = null;


// Initialize
exports.initDAO = function(dbConnURI) {
    console.log('EventDAO#initDAO');
    mongoDBConnURI = dbConnURI;
    collection = mongoJS.connect(mongoDBConnURI,['Event']);
};

// Save Event Document
exports.saveDocument = function(documentJSON,successCB,errorCB) {
    console.log('EventDAO#saveDocument');
    console.dir(documentJSON);
    collection.Event.save(documentJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving document ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Event Document
exports.updateDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('EventDAO#updateDocument ID - ' + documentID);
    console.dir(documentJSON);
    collection.Event.update(
        {_id:mongoJS.ObjectId(documentID)},
        {$set:{event_type:documentJSON.event_type,when:documentJSON.when,
            duration_days:documentJSON.duration_days,duration_hr:documentJSON.duration_hr,duration_min:documentJSON.duration_min,
            charges:documentJSON.charges,participants:documentJSON.participants,venue:documentJSON.venue,comments:documentJSON.comments,
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

// Delete Event Document
exports.deleteDocument = function(documentID,successCB,errorCB) {
    console.log('EventDAO#deleteDocument ID - ' + documentID);
    collection.Event.remove({_id:mongoJS.ObjectId(documentID)},function(error){
        if(error) {
            console.log('Error while deleting document ' + error);
            errorCB(error);
        }
        else {
            successCB();
        }
    });
};

// List Event Documents
exports.listDocuments = function(successCB,errorCB) {
    console.log('EventDAO#listDocuments');
    collection.Event.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents');
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};