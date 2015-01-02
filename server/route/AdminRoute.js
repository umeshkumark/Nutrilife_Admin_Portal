/**
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - AdminRoute.js
 * desc - used to handle Admin Routes ie REST api end points
 */

var mongoDBConnURI = null;
var currentDir = null;
var dao = null;
var path = require('path');
var emailUtility = null;
var passwordUtility = null;

// Initialize
exports.initRoute = function(curDir,dbConnURI,daoFileName,emailUtil,passwordUtil) {
    console.log('AdminRoute#initRoute , Current DIR - ' + curDir );
    mongoDBConnURI = dbConnURI;
    currentDir = curDir;
    var daoPath = path.join(currentDir,'server','dao',daoFileName);
    console.log('AdminRoute#initRoute.Path - ' + daoPath);
    dao = require(daoPath);
    dao.initDAO(mongoDBConnURI);
    emailUtility = emailUtil;
    emailUtility.init(dao);
    passwordUtility = passwordUtil;
};

// REST End Point for authentication
exports.authenticate = function(request,response) {
    console.log('AdminRoute#authenticate');
    console.dir(request.body);
    var userJSON = request.body;
    var passwordHash = passwordUtility.generateHash(userJSON.password);
    userJSON.password = passwordHash;
    console.dir(userJSON);
    dao.authenticate(userJSON,function(adminUser){
        if(adminUser.length >0){
            console.log('Authenticated');
            console.dir(adminUser);
            response.json({
                status:true,
                list:adminUser,
                message:''
            });
        }
        else {
            response.json({
                status:false,
                list:[],
                message:'Invalid Credentials, Try again'
            });
        }

    },function(error){
        console.log('Could not authenticate');
        response.json({
            status:false,
            message:'Could not authenticate User.Contact Ranjani Raman'
        });
    });
};

// REST End Point to check if the user exists in the System
exports.checkIfUserExist = function(request,response) {
    console.log('AdminRoute#checkIfUserExists');
    console.dir(request.body);
    var userJSON = request.body;
    dao.checkIfUserExists(userJSON,function(adminUser){
        if(adminUser.length == 0) {
            console.log('User does not exist');
            response.json({
                status:false,
                message:'User is not configured.Contact Ranjani Raman',
                list:[]
            });
        }
        else {
            response.json({
                status:true,
                message:'User is configured',
                list:adminUser
            });
        }
    },function(error){
        console.log('Could not authenticate');
        response.json({
            status:false,
            message:'Could not validate User login'
        });
    });
};

// REST End Point for getting list of Documents
exports.listDocuments = function(request,response) {
    console.log('AdminRoute#listDocuments');
    dao.listDocuments(function(documentList){
        response.json({
            status:true,
            message:'',
            list:documentList
        });
    },function(error){
        console.log('Sending empty Document List');
        response.json({
            status:false,
            message:'Could not get the User Details list'
        });
    });
};

// REST End Point for saving the Document
exports.saveDocument = function(request,response) {
    console.log('AdminRoute#saveDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var newDocument = {
        createdTime:new Date(),
        updatedTime:new Date(),
        createdBy:documentJSON.createdBy,
        updatedBy:documentJSON.updatedBy,
        name:documentJSON.name,
        login_id:documentJSON.login_id,
        is_suspended:documentJSON.is_suspended,
        role:documentJSON.role,
        password:documentJSON.password
    };
    var regularPassword = newDocument.password;
    var hashedPassword = passwordUtility.generateHash(regularPassword);
    var userEmailID = newDocument.login_id;
    newDocument.password = hashedPassword;
    dao.saveDocument(newDocument,function(savedDocument) {
        // Get the list of Documents (Collection)
        console.log('Successfully Saved the Document.Now getting the list of Documents');
        // Send a mail to the newly added user
        var userJSON = {
            login_id:userEmailID,
            password:regularPassword
        };
        emailUtility.sendUserAddHTMLMail('You have been added to Nutrilife as an Admin',userJSON,function(result){
            console.log('Successfully sent email');
        },function(error){
            console.log('Error while sending email ' + error);
        });

        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                message:'Successfully Saved the User Details',
                list:documentList
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not save the User Details'
            });
        });
    },function(error){
        console.log('Could not save the Document');
        response.json({
            status:false,
            message:'Could not save the User Details'
        });
    });
};

// REST End Point for updating the User's Password
exports.modifyPassword = function(request,response) {
    console.log('AdminRoute#updateDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        login_id:documentJSON.login_id,
        password:documentJSON.password
    };
    var regularPassword = updatedDocument.password;
    var hashedPassword = passwordUtility.generateHash(regularPassword);
    updatedDocument.password = hashedPassword;
    console.dir(updatedDocument);
    dao.modifyPassword(updatedDocument,function(updatedDocument){
        console.log('Successfully Updated the Document');
        response.json({
            status:true,
            message:'Successfully changed the Password'
        });
    },function(error){
        console.log('Could not update the Document');
        response.json({
            status:false,
            message:'Could not change the Password'
        });
    });
};

// REST End Point for forgot password
exports.forgotPassword = function(request,response) {
    console.log('AdminRoute#forgotPassword');
    var userJSON = request.body;
    console.dir(userJSON);
    dao.checkIfUserExists(userJSON,function(result){
        // If user exists create a new password & send email
        console.dir(result);
        var user = result[0];
        var newPassword = 'nutrilifeadmin';
        var hashedPassword = passwordUtility.generateHash(newPassword);
        user.password = hashedPassword;
        // Update the user with the new Password
        dao.modifyPassword(user,function(updatedDocument){
            user.password = newPassword;
            console.log('Successfully Updated the Document');
            emailUtility.sendUserAddHTMLMail('Your Nutrilife login credentials have been modified',user,function(result){
                console.log('Successfully sent email');
                response.json({
                    status:true,
                    message:'Your new password has been emailed.Check your Inbox'
                });
            },function(error){
                console.log('Error while sending email ' + error);
                response.json({
                    status:false,
                    message:'Could not email the new password.Contact Ranjani Raman'
                });
            });
        },function(error){
            console.log('Could not update the Document');
            response.json({
                status:false,
                message:'Unable to reset the password.Contact Ranjani Raman'
            });
        });
    },function(error){
        console.log('Could not authenticate');
        response.json({
            status:false,
            message:'User is not configured.Contact Ranjani Raman'
        });
    });
};


// REST End Point for updating the Document
exports.updateDocument = function(request,response) {
    console.log('AdminRoute#updateDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        name:documentJSON.name,
        login_id:documentJSON.login_id,
        is_suspended:documentJSON.is_suspended,
        role:documentJSON.role,
        password:documentJSON.password
    };
    var regularPassword = newDocument.password;
    var hashedPassword = passwordUtility.generateHash(regularPassword);
    updatedDocument.password = hashedPassword;
    dao.updateDocument(updatedDocument,documentID,function(updatedDocument){
        console.log('Successfully Updated the Document');
        response.json({
            status:true,
            message:'Successfully updated the User Details'
        });
    },function(error){
        console.log('Could not update the Document');
        response.json({
            status:false,
            message:'Could not update the User Details'
        });
    });
};

// REST End Point for deleting the Document
exports.deleteDocument = function(request,response) {
    console.log('AdminRoute#deleteDocument');
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    dao.deleteDocument(documentID,function(){
        console.log('Successfully Deleted the Document.Now getting the list of Documents');
        dao.listDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully deleted the user'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not delete the User'
            });
        });
    },function(error){
        console.log('Could not delete the Document');
        response.json({
            status:false,
            message:'Could not delete the User'
        });
    });
};

// REST End Point for saving the Email Document
exports.saveEmailDocument = function(request,response) {
    console.log('AdminRoute#saveEmailDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var newDocument = {
        createdTime:new Date(),
        updatedTime:new Date(),
        createdBy:documentJSON.createdBy,
        updatedBy:documentJSON.updatedBy,
        user:documentJSON.user,
        password:documentJSON.password,
        host:documentJSON.host,
        ssl:documentJSON.ssl,
        from_email:documentJSON.from_email,
        from_name:documentJSON.from_name,
        to_email:documentJSON.to_email,
        to_name:documentJSON.to_name,
        site_url:documentJSON.site_url
    };
    dao.saveEmailDocument(newDocument,function(savedDocument) {
        // Get the list of Documents (Collection)
        console.log('Successfully Saved the Document.Now getting the list of Documents');
        dao.listEmailDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Could not save the Email Settings'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not save the Email Settings'
            });
        });
    },function(error){
        console.log('Could not save the Document');
        response.json({
            status:false,
            message:'Could not save the Email Settings'
        });
    });
};

// REST End Point for updating the Email Document
exports.updateEmailDocument = function(request,response) {
    console.log('AdminRoute#updateEmailDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        user:documentJSON.user,
        password:documentJSON.password,
        host:documentJSON.host,
        ssl:documentJSON.ssl,
        from_email:documentJSON.from_email,
        from_name:documentJSON.from_name,
        to_email:documentJSON.to_email,
        to_name:documentJSON.to_name,
        site_url:documentJSON.site_url
    };
    dao.updateEmailDocument(updatedDocument,documentID,function(updatedDocument){
        console.log('Successfully Updated the Document');
        response.json({
            status:true,
            message:'Successfully updated the Email Settings'
        });
    },function(error){
        console.log('Could not update the Document');
        response.json({
            status:false,
            message:'Could not update the Email Settings'
        });
    });
};

// REST End Point for getting the list of Email Document
exports.listEmailDocuments = function(request,response) {
    console.log('AdminRoute#listEmailDocuments');
    dao.listEmailDocuments(function(documentList){
        response.json({
            status:true,
            list:documentList,
            message:''
        });
    },function(error){
        console.log('Sending empty Document List');
        response.json({
            status:false,
            message:'Could not get the Email Settings'
        });
    });
};

// REST End Point for getting the list of Site Mgmt Document
exports.listSiteMgmtDocuments = function(request,response) {
    console.log('AdminRoute#listSiteMgmtDocuments');
    dao.listSiteMgmtDocuments(function(documentList){
        response.json({
            status:true,
            list:documentList,
            message:''
        });
    },function(error){
        console.log('Sending empty Document List');
        response.json({
            status:false,
            message:'Could not get the Site Management Settings'
        });
    });
};

// REST End Point for updating the Site Mgmt Document
exports.updateSiteMgmtDocument = function(request,response) {
    console.log('AdminRoute#updateSiteMgmtDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var documentID = request.params.ID;
    console.log('Document ID - ' + documentID);
    // Add only fields that needs to be updated
    var updatedDocument = {
        updatedTime:new Date(),
        updatedBy:documentJSON.updatedBy,
        site_header:documentJSON.site_header,
        site_footer:documentJSON.site_footer,
        login_header:documentJSON.login_header,
        login_footer:documentJSON.login_footer
    };
    dao.updateSiteMgmtDocument(updatedDocument,documentID,function(updatedDocument){
        console.log('Successfully Updated the Document');
        response.json({
            status:true,
            message:'Successfully updated the Site Management Settings'
        });
    },function(error){
        console.log('Could not update the Document');
        response.json({
            status:false,
            message:'Could not update the Site Management Settings'
        });
    });
};

// REST End Point for saving the Site Mgmt Document
exports.saveSiteMgmtDocument = function(request,response) {
    console.log('AdminRoute#saveSiteMgmtDocument');
    var documentJSON = request.body;
    console.dir(documentJSON);
    var newDocument = {
        createdTime:new Date(),
        updatedTime:new Date(),
        createdBy:documentJSON.createdBy,
        updatedBy:documentJSON.updatedBy,
        site_header:documentJSON.site_header,
        site_footer:documentJSON.site_footer,
        login_header:documentJSON.login_header,
        login_footer:documentJSON.login_footer
    };
    dao.saveSiteMgmtDocument(newDocument,function(savedDocument) {
        // Get the list of Documents (Collection)
        console.log('Successfully Saved the Document.Now getting the list of Documents');
        dao.listSiteMgmtDocuments(function(documentList){
            response.json({
                status:true,
                list:documentList,
                message:'Successfully saved the Site Management Settings'
            });
        },function(error){
            console.log('Sending empty Document List');
            response.json({
                status:false,
                message:'Could not save the Site Management Settings'
            });
        });
    },function(error){
        console.log('Could not save the Document');
        response.json({
            status:false,
            message:'Could not save the Site Management Settings'
        });
    });
};

exports.emailCustomerReport = function(request,response) {
    console.log('AdminRoute#sendCustoemrReportEmail');
    var reportJSON = request.body;
    emailUtility.sendCustomerReportInBody(reportJSON,'Customer Report','Customer List',function(result){
        console.log('Successfully sent email');
        response.json({
            status:true,
            message:'Successfully emailed the Customer Report'
        });
    },function(error){
        console.log('Error while sending email ' + error);
        response.json({
            status:false,
            message:'Could not email the Customer Report'
        });
    });
};
