/**
 * Created by Umesh on 24-12-2014.
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - CustomerRoute.js
 * desc - used to handle Customer Routes
 */

var mongoDBConnURI = null;
var currentDir = null;
var dao = null;
var path = require('path');
var emailUtility = null;
var tmp = null;

// Initialize
exports.initRoute = function(curDir,dbConnURI,daoFileName,emailUtil) {
    console.log('CustomerRoute#initRoute , Current DIR - ' + curDir);
    mongoDBConnURI = dbConnURI;
    currentDir = curDir;
    var daoPath = path.join(currentDir,'server','dao',daoFileName);
    console.log('CustomerRoute#initRoute.Path - ' + daoPath);
    dao = require(daoPath);
    dao.initDAO(mongoDBConnURI);
    emailUtility = emailUtil;
};

// REST End Point for getting list of Documents
exports.listDocuments = function(request,response) {
    console.log('CustomerRoute#listDocuments');
    dao.listDocuments(function(documentList){
        response.json({
            status:true,
            list:documentList,
            message:''
        });
    },function(error){
        console.log('Sending empty Document List');
        response.json({
            status:false,
            message:'Could not get the list of Customers'
        });
    });
};

// REST End Point for getting the filtered list of Documents
exports.filterDocuments = function(request,response) {
    console.log('CustomerRoute#filterDocuments');
    var filterCriteria = request.body;
    dao.filterDocuments(filterCriteria,function(documentList){
        response.json({
            status:true,
            list:documentList,
            message:''
        });
    },function(error){
        console.log('Sending empty Document List');
        response.json({
            status:false,
            message:'Could not get the list of Customers'
        });
    });
};

// REST End Point for saving the Document
exports.saveDocument = function(request,response) {
    console.log('CustomerRoute#saveDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var newDocument = {
        createdTime:new Date(),
        updatedTime:new Date(),
        createdBy:documentJSON.createdBy,
        updatedBy:documentJSON.updatedBy,
        first_name:documentJSON.first_name,
        last_name:documentJSON.last_name,
        age:documentJSON.age,
        sex:documentJSON.sex,
        height:documentJSON.height,
        weight:documentJSON.weight,
        plan_id:documentJSON.plan_id,
        start_date:documentJSON.start_date,
        price:documentJSON.price,
        plan_duration:documentJSON.plan_duration,
        consultation_id:documentJSON.consultation_id,
        amount_paid:documentJSON.amount_paid,
        amount_paid_comments:documentJSON.amount_paid_comments,
        amount_balance:documentJSON.amount_balance,
        amount_balance_comments:documentJSON.amount_balance_comments,
        misc_comments:documentJSON.misc_comments,
        medical_condition:documentJSON.medical_condition,
        goal:documentJSON.goal,
        mobileNo:documentJSON.mobileNo,
        emailID:documentJSON.emailID,
        status:documentJSON.status,
        completed_comments:documentJSON.completed_comments
    };
    dao.saveDocument(newDocument,function(savedDocument){
        // Get the list of Documents (Collection)
        console.log('Successfully Saved the Document.Now getting the list of Documents');
        // Send an Email
        emailUtility.onAddNewCustomer(savedDocument,function(result){
            console.log('Successfully sent Email')
        },function(error){
            console.log('Could not send Email . Details - ' + error);
            response.json({
                status:false,
                message:'Customer Details saved, but could not send email'
            });
        });
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully saved the Customer Details'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not get the list of Customers'
            });
        });
    },function(error){
        console.log('Could not save the Document');
        response.json({
            status:false,
            message:'Could not save Customer Details'
        });
    });
};

// REST End Point for updating the Document
exports.updateDocument = function(request,response){
    console.log('CustomerRoute#updateDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        first_name:documentJSON.first_name,
        last_name:documentJSON.last_name,
        age:documentJSON.age,
        sex:documentJSON.sex,
        height:documentJSON.height,
        weight:documentJSON.weight,
        plan_id:documentJSON.plan_id,
        start_date:documentJSON.start_date,
        price:documentJSON.price,
        plan_duration:documentJSON.plan_duration,
        consultation_id:documentJSON.consultation_id,
        amount_paid:documentJSON.amount_paid,
        amount_paid_comments:documentJSON.amount_paid_comments,
        amount_balance:documentJSON.amount_balance,
        amount_balance_comments:documentJSON.amount_balance_comments,
        misc_comments:documentJSON.misc_comments,
        medical_condition:documentJSON.medical_condition,
        goal:documentJSON.goal,
        mobileNo:documentJSON.mobileNo,
        emailID:documentJSON.emailID,
        status:documentJSON.status,
        completed_comments:documentJSON.completed_comments
    };
    // Get the Details of existing Customer
    dao.getByID(documentID,function(originalCustomer){
        dao.updateDocument(updatedDocument,documentID,function(updatedCustomer){
            console.log('Successfully Updated the Document');
            // Send Email
            emailUtility.onUpdateCustomer(originalCustomer,updatedDocument,function(result){
                console.log('Successfully sent Email');
            },function(error){
                console.log('Could not send Email . Details - ' + error);
                response.json({
                    status:false,
                    message:'Customer Details updated, but could not send email'
                });
            });
            dao.listDocuments(function(documentList){
                response.json({
                    status:true,
                    list:documentList,
                    message:'Successfully Updated the Customer Details'
                });
            },function(error){
                console.log('Sending empty Document List');
                response.json({
                    status:false,
                    message:'Could not get the list of Customers'
                });
            });
        },function(error){
            console.log('Could not update the Document');
            response.json({
                status:false,
                message:'Could not update Customer Details'
            });
        });
    },function(error){
        console.log('Error while getting the details of the Customer');
        response.json({
            status:false,
            message:'Could not update Customer Details'
        });
    });

};

// REST End Point for deleting the Document
exports.deleteDocument = function(request,response){
    console.log('CustomerRoute#deleteDocument');
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Get the Details of Existing Customer
    dao.getByID(documentID,function(document){
        dao.deleteDocument(documentID,function(){
            console.log('Successfully Deleted the Document.Now getting the list of Documents');
            // Send Email
            emailUtility.onDeleteCustomer(document,function(result){
                console.log('Successfully sent Email')
            },function(error){
                console.log('Could not send Email . Details - ' + error);
                response.json({
                    status:false,
                    message:'Customer deleted , but could not send email'
                });
            });
            dao.listDocuments(function(documentList){
                response.json({
                    status:true,
                    list:documentList,
                    message:'Successfully Deleted the Customer'
                });
            },function(error){
                console.log('Sending empty Document List');
                response.json({
                    status:false,
                    message:'Could not delete the Customer'
                });
            });
        },function(error){
            console.log('Could not delete the Document');
            response.json({
                status:false,
                message:'Could not delete the Customer'
            });
        });
    },function(error){
        console.log('Error while getting the details of the Customer');
        response.json({
            status:false,
            message:'Could not delete the Customer'
        });
    });
};
