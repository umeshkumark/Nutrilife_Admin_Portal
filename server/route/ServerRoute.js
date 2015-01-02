/**
 * Created by Umesh on 23-12-2014.
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - ServerRoute.js
 * desc - routes the REST api calls to their corresponding End Points
 */

var path = require('path');

module.exports = function(app,currentDir,mongoDBURI){
    console.log('ServerRoute Current DIR - ' + currentDir + ' , MongoDB URI - ' + mongoDBURI);

    // Add all Route Files

    var consultationRoute = require('./ConsultationRoute.js');
    consultationRoute.initRoute(currentDir,mongoDBURI,'ConsultationDAO.js');

    var adminRoute = require('./AdminRoute.js');
    var emailUtilityPath = path.join(currentDir,'server','util','EmailUtility.js');
    var emailUtility = require(emailUtilityPath);
    var passwordUtilityPath = path.join(currentDir,'server','util','PasswordUtility.js');
    var passwordUtility = require(passwordUtilityPath);
    adminRoute.initRoute(currentDir,mongoDBURI,'AdminDAO.js',emailUtility,passwordUtility);

    var planRoute = require('./PlanRoute.js');
    planRoute.initRoute(currentDir,mongoDBURI,'DietPlanDAO.js');

    var customerRoute = require('./CustomerRoute.js');
    customerRoute.initRoute(currentDir,mongoDBURI,'CustomerDAO.js',emailUtility);

    // Default Route . Return index.html file
    app.get('/',function(request,response){
        console.log('ServerRoute#Default Route');
        var indexHTMLPath = path.join(currentDir,'client','index.html');
        console.log('index.html path - ' + indexHTMLPath);
        response.sendFile(indexHTMLPath);
    });

    // Consultation Route
    app.get('/rest/api/consultation/list',consultationRoute.listDocuments);
    app.post('/rest/api/consultation/saveDocument',consultationRoute.saveDocument);
    app.post('/rest/api/consultation/updateDocument/:ID?',consultationRoute.updateDocument);
    app.delete('/rest/api/consultation/deleteDocument/:ID?',consultationRoute.deleteDocument);

    // Diet Plan Route
    app.get('/rest/api/dietplan/list',planRoute.listDocuments);
    app.post('/rest/api/dietplan/saveDocument',planRoute.saveDocument);
    app.post('/rest/api/dietplan/updateDocument/:ID?',planRoute.updateDocument);
    app.delete('/rest/api/dietplan/deleteDocument/:ID?',planRoute.deleteDocument);

    // Admin Route
    app.get('/rest/api/admin/list',adminRoute.listDocuments);
    app.post('/rest/api/admin/saveDocument',adminRoute.saveDocument);
    app.post('/rest/api/admin/updateDocument/:ID?',adminRoute.updateDocument);
    app.delete('/rest/api/admin/deleteDocument/:ID?',adminRoute.deleteDocument);
    app.post('/rest/api/admin/modifyPassword',adminRoute.modifyPassword);
    app.post('/rest/api/admin/authenticate',adminRoute.authenticate);
    app.post('/rest/api/admin/checkIfUserExists',adminRoute.checkIfUserExist);
    app.post('/rest/api/admin/forgotPassword',adminRoute.forgotPassword);
    app.get('/rest/api/admin/email/list',adminRoute.listEmailDocuments);
    app.post('/rest/api/admin/email/saveDocument',adminRoute.saveEmailDocument);
    app.post('/rest/api/admin/email/updateDocument/:ID?',adminRoute.updateEmailDocument);
    app.get('/rest/api/admin/sitemgmt/list',adminRoute.listSiteMgmtDocuments);
    app.post('/rest/api/admin/sitemgmt/saveDocument',adminRoute.saveSiteMgmtDocument);
    app.post('/rest/api/admin/sitemgmt/updateDocument/:ID?',adminRoute.updateSiteMgmtDocument);
    app.post('/rest/api/admin/email/emailCustomerReport',adminRoute.emailCustomerReport);


    // Customer Route
    app.get('/rest/api/customer/list',customerRoute.listDocuments);
    app.post('/rest/api/customer/saveDocument',customerRoute.saveDocument);
    app.post('/rest/api/customer/updateDocument/:ID?',customerRoute.updateDocument);
    app.delete('/rest/api/customer/deleteDocument/:ID?',customerRoute.deleteDocument);
    app.post('/rest/api/customer/filteredList',customerRoute.filterDocuments);

    // For Sending Email
};
