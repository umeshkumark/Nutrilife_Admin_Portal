/**
 * Created by Umesh on 24-12-2014
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - CustomerDAO.js
 * desc - used for CRUD operations for Customer Collection
 *
 */

// MongoJS driver
var mongoJS = require('mongojs');
// Mongo DB connection URI
var mongoDBConnURI = null;
// Connection String for Customer Collection
var collection = null;


// Initialize
exports.initDAO = function(dbConnURI) {
    console.log('CustomerDAO#initDAO');
    mongoDBConnURI = dbConnURI;
    collection = mongoJS.connect(mongoDBConnURI,['Customer']);
};

// Save Customer Document
exports.saveDocument = function(documentJSON,successCB,errorCB) {
    console.log('CustomerDAO#saveDocument');
    console.dir(documentJSON);
    collection.Customer.save(documentJSON,function(error,savedDocument){
        if(error) {
            console.log('Error while saving document ' + error);
            errorCB(error);
        }
        else {
            successCB(savedDocument);
        }
    });
};

// Update Customer Document
exports.updateDocument = function(documentJSON,documentID,successCB,errorCB) {
    console.log('CustomerDAO#updateDocument ID - ' + documentID);
    console.dir(documentJSON);
    collection.Customer.update(
        {_id:mongoJS.ObjectId(documentID)},
        {$set:{first_name:documentJSON.first_name,age:documentJSON.age,
            sex:documentJSON.sex,height:documentJSON.height,
            weight:documentJSON.weight,consultation_id:documentJSON.consultation_id,
            plan_id:documentJSON.plan_id,plan_duration:documentJSON.plan_duration,
            start_date:documentJSON.start_date,price:documentJSON.price,
            amount_paid:documentJSON.amount_paid,amount_paid_comments:documentJSON.amount_paid_comments,
            amount_balance:documentJSON.amount_balance,amount_balance_comments:documentJSON.amount_balance_comments,
            medical_condition:documentJSON.medical_condition,goal:documentJSON.goal,
            misc_comments:documentJSON.misc_comments,last_name:documentJSON.last_name,
            updatedTime:documentJSON.updatedTime,updatedBy:documentJSON.updatedBy,mobileNo:documentJSON.mobileNo,
            emailID:documentJSON.emailID,status:documentJSON.status,completed_comments:documentJSON.completed_comments}},
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

// Delete Customer Document
exports.deleteDocument = function(documentID,successCB,errorCB) {
    console.log('CustomerDAO#deleteDocument ID - ' + documentID);
    collection.Customer.remove({_id:mongoJS.ObjectId(documentID)},function(error){
        if(error) {
            console.log('Error while deleting document ' + error);
            errorCB(error);
        }
        else {
            successCB();
        }
    });
};

// List Customer Documents
exports.listDocuments = function(successCB,errorCB) {
    console.log('CustomerDAO#listDocuments');
    collection.Customer.find(function(error,documentList){
        if(error){
            console.log('Error while getting the list of Documents');
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};

// Filter Customer Documents
exports.filterDocuments = function(filterCriteriaJSON,successCB,errorCB) {
    console.log('CustomerDAO#filterDocuments');
    console.dir(filterCriteriaJSON);
    collection.Customer.find(filterCriteriaJSON,function(error,documentList){
        if(error) {
            console.log('Error while getting the filtered list of Documents');
            errorCB(error);
        }
        else {
            successCB(documentList);
        }
    });
};

// Get the Document By ID
exports.getByID = function(ID,successCB,errorCB){
    console.log('CustomerDAO#getByID  ID - ' + ID);
    collection.Customer.find({_id:mongoJS.ObjectId(ID)},function(error,documentJSON){
        if(error){
            console.log('CustomerDAO#CustomerDAO.Error - ' + error);
            errorCB(error);
        }
        else if(!documentJSON){
            console.log('CustomerDAO#CustomerDAO.Could not get Document');
            successCB([]);
        }
        else {
            successCB(documentJSON);
        }
    });
};