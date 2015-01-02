/**
 * Created by Umesh on 23-12-2014.
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - ConsultationRoute.js
 * desc - used to handle Consultation Routes ie REST api end points
 */

var mongoDBConnURI = null;
var currentDir = null;
var dao = null;
var path = require('path');


// Initialize
exports.initRoute = function(curDir,dbConnURI,daoFileName) {
    console.log('ConsultationRoute#initRoute , Current DIR - ' + currentDir );
    mongoDBConnURI = dbConnURI;
    currentDir = curDir;
    var daoPath = path.join(currentDir,'server','dao',daoFileName);
    console.log('ConsultationRoute#initRoute.Path - ' + daoPath);
    dao = require(daoPath);
    dao.initDAO(mongoDBConnURI);
};

// REST End Point for getting list of Documents
exports.listDocuments = function(request,response) {
    console.log('ConsultationRoute#listDocuments');
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
            message:'Could not get the list of Consultation Types'
        });
    });
};

// REST End Point for saving the Document
exports.saveDocument = function(request,response) {
    console.log('ConsultationRoute#saveDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var newDocument = {
        createdTime:new Date(),
        updatedTime:new Date(),
        createdBy:documentJSON.createdBy,
        updatedBy:documentJSON.updatedBy,
        name:documentJSON.name,
        desc:documentJSON.desc
    };
    dao.saveDocument(newDocument,function(savedDocument){
        // Get the list of Documents (Collection)
        console.log('Successfully Saved the Document.Now getting the list of Documents');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully saved the Consultation Type'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not save the Consultation Type'
            });
        });
    },function(error){
        console.log('Could not save the Document');
        response.json({
            status:false,
            message:'Could not save the Consultation Type'
        });
    });
};

// REST End Point for updating the Document
exports.updateDocument = function(request,response){
    console.log('ConsultationRoute#updateDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        name:documentJSON.name,
        desc:documentJSON.desc
    };
    dao.updateDocument(updatedDocument,documentID,function(updatedDocument){
        console.log('Successfully Updated the Document');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully updated the Consultation Type'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not delete the Consultation Type'
            });
        });
    },function(error){
        console.log('Could not update the Document');
        response.json({
            status:false,
            message:'Could not update the Consultation Type'
        });
    });
};

// REST End Point for deleting the Document
exports.deleteDocument = function(request,response){
    console.log('ConsultationRoute#deleteDocument');
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    dao.deleteDocument(documentID,function(){
        console.log('Successfully Deleted the Document.Now getting the list of Documents');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully deleted the Consultation Type'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not delete the Consultation Type'
            });
        });
    },function(error){
        console.log('Could not delete the Document');
        response.json({
            status:false,
            message:'Could not delete the Consultation Type'
        });
    });
};