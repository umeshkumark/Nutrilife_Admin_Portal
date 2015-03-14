/**
 * Created by Umesh on 07-03-2015.
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - EventRoute.js
 * desc - used to handle Event Routes
 */

var mongoDBConnURI = null;
var currentDir = null;
var dao = null;
var path = require('path');


// Initialize
exports.initRoute = function(curDir,dbConnURI,daoFileName) {
    console.log('EventRoute#initRoute , Current DIR - ' + curDir );
    mongoDBConnURI = dbConnURI;
    currentDir = curDir;
    var daoPath = path.join(currentDir,'server','dao',daoFileName);
    console.log('EventRoute#initRoute.Path - ' + daoPath);
    dao = require(daoPath);
    dao.initDAO(mongoDBConnURI);
};

// REST End Point for getting list of Documents
exports.listDocuments = function(request,response) {
    console.log('EventRoute#listDocuments');
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
            list:documentList,
            message:'Could not get the list of Events'
        });
    });
};

// REST End Point for saving the Document
exports.saveDocument = function(request,response) {
    console.log('EventRoute#saveDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var newDocument = {
        createdTime:new Date(),
        updatedTime:new Date(),
        createdBy:documentJSON.createdBy,
        updatedBy:documentJSON.updatedBy,
        event_type:documentJSON.event_type,
        when:documentJSON.when,
        duration_hr:documentJSON.duration_hr,
        duration_min:documentJSON.duration_min,
        duration_days:documentJSON.duration_days,
        charges:documentJSON.charges,
        participants:documentJSON.participants,
        venue:documentJSON.venue,
        comments:documentJSON.comments
    };
    dao.saveDocument(newDocument,function(savedDocument){
        // Get the list of Documents (Collection)
        console.log('Successfully Saved the Document.Now getting the list of Documents');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully saved the Event'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not save the Event'
            });
        });
    },function(error){
        console.log('Could not save the Document');
        response.json({
            status:false,
            message:'Could not save the Event'
        });
    });
};

// REST End Point for updating the Document
exports.updateDocument = function(request,response){
    console.log('EventRoute#updateDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        event_type:documentJSON.event_type,
        when:documentJSON.when,
        duration_hr:documentJSON.duration_hr,
        duration_min:documentJSON.duration_min,
        duration_days:documentJSON.duration_days,
        charges:documentJSON.charges,
        participants:documentJSON.participants,
        venue:documentJSON.venue,
        comments:documentJSON.comments
    };
    dao.updateDocument(updatedDocument,documentID,function(updatedDocument){
        console.log('Successfully Updated the Document');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully updated the Event'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not save the Event'
            });
        });
    },function(error){
        console.log('Could not update the Document');
        response.json({
            status:false,
            message:'Could not save the Event'
        });
    });
};

// REST End Point for deleting the Document
exports.deleteDocument = function(request,response){
    console.log('EventRoute#deleteDocument');
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    dao.deleteDocument(documentID,function(){
        console.log('Successfully Deleted the Document.Now getting the list of Documents');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully deleted the Event'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not delete the Event'
            });
        });
    },function(error){
        console.log('Could not delete the Document');
        response.json({
            status:false,
            message:'Could not delete the Event'
        });
    });
};
