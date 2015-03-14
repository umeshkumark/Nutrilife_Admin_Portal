/**
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - EmailUtility.js
 * desc - Used to send emails with / without attachments
 */

var dao = null;
var nodemailer = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');
exports.init = function(emailDAO){
    dao = emailDAO;
};

exports.sendSimpleMail = function(subject,message,successCB,errorCB) {
    console.log('EmailUtility#sendSimpleMail');
};

exports.sendUserAddHTMLMail = function(subject,userJSON,successCB,errorCB) {
    console.log('EmailUtility#sendSimpleHTMLMail');
    this.getEmailDetails(function(emailDocument){
        if(emailDocument.length > 0) {
            var emailConfiguration = emailDocument[0];
            console.log('Trying to send mail with User - ' + emailConfiguration.user + ' , Password - ' + emailConfiguration.password + ', Params : ');
            var sendGrid = require('sendgrid')(emailConfiguration.user,emailConfiguration.password);
            var htmlPrefix = '<html><head><title>Customer Report</title></head>' +
                ' <body><p>Login to <a href="'+emailConfiguration.site_url+'">Nutrilife</a> with the below credentials. ' +
                'It is recommended that you change the Password after login</p>' +
                ' <p><table border="1">';
            var tableHeader='<tr>' +
                '<th>Login ID</th>' +
                '<th>Password</th>' ;
            var tableBody = '<tr> ' +
                '<td>'+userJSON['login_id']+'</td>' +
                '<td>'+userJSON['password']+'</td>';
            var htmlSuffix = '</table></p><p><span><b>This is an Auto-Generated email.Do not reply</b></span></span></p></body></html>';
            var htmlContents = htmlPrefix+tableHeader+tableBody+htmlSuffix;
            var sendGridParams = {
                to:userJSON.login_id,
                toname:userJSON.name,
                from:emailConfiguration.from_email,
                fromname:emailConfiguration.from_name,
                subject:subject,
                text:subject,
                html:htmlContents
            };
            console.dir(sendGridParams);
            var email = new sendGrid.Email(sendGridParams);
            sendGrid.send(email,function(error,success){
                if(error) {
                    console.log(error);
                    errorCB(error);
                }
                else if(success) {
                    console.log('Mail sent successfully');
                    console.dir(success);
                    successCB(success);
                }
                else{
                    errorCB('Status not Known');
                }
            });
        }
    },function(error){
        console.log('Unable to get Email Configuration.');
        errorCB(error);
    });
};

exports.sendAsAttachment = function(attachments,subject,message) {
    console.log('EmailUtility#sendAsAttachment');
};

exports.onAddNewCustomer = function(customer,successCB,errorCB){
    console.log('EmailUtility#onAddNewCustomer');
    var subject = 'Customer added to Nutrilife';
    var message = 'A new customer has been added to nutrilife';
    this.getEmailDetails(function(emailDocument){
        if(emailDocument.length > 0) {
            var emailConfiguration = emailDocument[0];
            console.log('Trying to send mail with User - ' + emailConfiguration.user + ' , Password - ' + emailConfiguration.password + ', Params : ');
            var sendGrid = require('sendgrid')(emailConfiguration.user,emailConfiguration.password);
            var htmlPrefix = '<html><head><title>Customer Report</title></head>' +
                ' <body><p>New Customer Details:</p>' +
                ' <p><table border="1">';
            var tableHeader='<tr>' +
                '<th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>Email</th>' +
                '<th>Contact No</th>' +
                '<th>Age</th>' +
                '<th>Diet Plan</th>' +
                '<th>Plan Duration</th>' +
                '<th>Start Date</th>' +
                '<th>Consultation Type</th>' +
                '</tr>';
            var tableBody = '<tr> ' +
            '<td>'+customer['first_name']+'</td>' +
            '<td>'+customer['last_name']+'</td>' +
            '<td>'+customer['emailID']+'</td>' +
            '<td>'+customer['mobileNo']+'</td>' +
            '<td>'+customer['age']+'</td>' +
            '<td>'+customer['plan_id']+'</td>' +
            '<td>'+customer['plan_duration']+' months </td>' +
            '<td>'+customer['start_date']+'</td>' +
            '<td>'+customer['consultation_id']+'</td>' +
            '</tr>';
            var htmlSuffix = '</table></p><p><span><b>This is an Auto-Generated email.Do not reply</b></span></span></p></body></html>';
            var htmlContents = htmlPrefix+tableHeader+tableBody+htmlSuffix;
            var sendGridParams = {
                to:emailConfiguration.to_email,
                toname:emailConfiguration.to_name,
                from:emailConfiguration.from_email,
                fromname:emailConfiguration.from_name,
                subject:subject,
                text:message,
                html:htmlContents
            };
            console.dir(sendGridParams);
            var email = new sendGrid.Email(sendGridParams);
            sendGrid.send(email,function(error,success){
                if(error) {
                    console.log(error);
                    errorCB(error);
                }
                else if(success) {
                    console.log('Mail sent successfully');
                    console.dir(success);
                    successCB(success);
                }
                else{
                    errorCB('Status not Known');
                }
            });
        }
    },function(error){
        console.log('Unable to get Email Configuration.');
        errorCB(error);
    });

    console.log('EmailUtility#onAddNewCustomer');
};

exports.onUpdateCustomer = function(originalDocument,updatedDocument,successCB,errorCB){
    console.log('EmailUtility#onUpdateCustomer');
    var originalCustomer = originalDocument[0];
    console.dir(originalCustomer);
    var updatedCustomer = updatedDocument;
    console.dir(updatedCustomer);
    var subject = 'Exising Nutrilife Customer updated';
    var message = 'An existing nutrilife customer has been updated';
    this.getEmailDetails(function(emailDocument){
        if(emailDocument.length > 0) {
            var emailConfiguration = emailDocument[0];
            console.log('Trying to send mail with User - ' + emailConfiguration.user + ' , Password - ' + emailConfiguration.password + ', Params : ');
            var sendGrid = require('sendgrid')(emailConfiguration.user,emailConfiguration.password);
            var htmlPrefix = '<html><head><title>Customer Report</title></head>' +
                ' <body><p>Updated Customer Details(Original Values are in the 2nd Row):</p>' +
                ' <p><table border="1">';
            var tableHeader='<tr>' +
                '<th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>Email</th>' +
                '<th>Contact No</th>' +
                '<th>Age</th>' +
                '<th>Diet Plan</th>' +
                '<th>Plan Duration</th>' +
                '<th>Start Date</th>' +
                '<th>Consultation Type</th>' +
                '</tr>';
            var tableBody = '<tr> ' +
                '<td>'+updatedCustomer['first_name']+'</td>' +
                '<td>'+updatedCustomer['last_name']+'</td>' +
                '<td>'+updatedCustomer['emailID']+'</td>' +
                '<td>'+updatedCustomer['mobileNo']+'</td>' +   
                '<td>'+updatedCustomer['age']+'</td>' +
                '<td>'+updatedCustomer['plan_id']+'</td>' +
                '<td>'+updatedCustomer['plan_duration']+' months</td>' +
                '<td>'+updatedCustomer['start_date']+'</td>' +
                '<td>'+updatedCustomer['consultation_id']+'</td>' +
                '</tr>';
            tableBody = tableBody + '<tr> ' +
                '<td>'+originalCustomer['first_name']+'</td>' +
                '<td>'+originalCustomer['last_name']+'</td>' +
                '<td>'+originalCustomer['emailID']+'</td>' +
                '<td>'+originalCustomer['mobileNo']+'</td>' + 
                '<td>'+originalCustomer['age']+'</td>' +
                '<td>'+originalCustomer['plan_id']+'</td>' +
                '<td>'+originalCustomer['plan_duration']+' months</td>' +
                '<td>'+originalCustomer['start_date']+'</td>' +
                '<td>'+originalCustomer['consultation_id']+'</td>' +
                '</tr>';
            var htmlSuffix = '</table></p><p><span><b>This is an Auto-Generated email.Do not reply</b></span></span></p></body></html>';
            var htmlContents = htmlPrefix+tableHeader+tableBody+htmlSuffix;
            var sendGridParams = {
                to:emailConfiguration.to_email,
                toname:emailConfiguration.to_name,
                from:emailConfiguration.from_email,
                fromname:emailConfiguration.from_name,
                subject:subject,
                text:message,
                html:htmlContents
            };
            console.dir(sendGridParams);
            var email = new sendGrid.Email(sendGridParams);
            sendGrid.send(email,function(error,success){
                if(error) {
                    console.log(error);
                    errorCB(error);
                }
                else if(success) {
                    console.log('Mail sent successfully');
                    console.dir(success);
                    successCB(success);
                }
                else{
                    errorCB('Status not Known');
                }
            });
        }
    },function(error){
        console.log('Unable to get Email Configuration.');
        errorCB(error);
    });
};

exports.onDeleteCustomer = function(deletedCustomer,successCB,errorCB){
    console.log('EmailUtility#onDeleteCustomer');
    var subject = 'Customer deleted from Nutrilife';
    var message = 'A customer has been deleted from nutrilife';
    this.getEmailDetails(function(emailDocument){
        if(emailDocument.length > 0) {
            var emailConfiguration = emailDocument[0];
            var customer = deletedCustomer[0];
            console.log('Trying to send mail with User - ' + emailConfiguration.user + ' , Password - ' + emailConfiguration.password + ', Params : ');
            var sendGrid = require('sendgrid')(emailConfiguration.user,emailConfiguration.password);
            var htmlPrefix = '<html><head><title>Customer Report</title></head>' +
                ' <body><p>Deleted Customer Details:</p>' +
                ' <p><table border="1">';
            var tableHeader='<tr>' +
                '<th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>Email</th>' +
                '<th>Contact No</th>' +
                '<th>Age</th>' +
                '<th>Diet Plan</th>' +
                '<th>Plan Duration</th>' +
                '<th>Start Date</th>' +
                '<th>Consultation Type</th>' +
                '</tr>';
            var tableBody = '<tr> ' +
                '<td>'+customer['first_name']+'</td>' +
                '<td>'+customer['last_name']+'</td>' +
                '<td>'+customer['emailID']+'</td>' +
                '<td>'+customer['mobileNo']+'</td>' +
                '<td>'+customer['age']+'</td>' +
                '<td>'+customer['plan_id']+'</td>' +
                '<td>'+customer['plan_duration']+' months</td>' +
                '<td>'+customer['start_date']+'</td>' +
                '<td>'+customer['consultation_id']+'</td>' +
                '</tr>';
            var htmlSuffix = '</table></p><p><span><b>This is an Auto-Generated email.Do not reply</b></span></span></p></body></html>';
            var htmlContents = htmlPrefix+tableHeader+tableBody+htmlSuffix;
            var sendGridParams = {
                to:emailConfiguration.to_email,
                toname:emailConfiguration.to_name,
                from:emailConfiguration.from_email,
                fromname:emailConfiguration.from_name,
                subject:subject,
                text:message,
                html:htmlContents
            };
            console.dir(sendGridParams);
            var email = new sendGrid.Email(sendGridParams);
            sendGrid.send(email,function(error,success){
                if(error) {
                    console.log(error);
                    errorCB(error);
                }
                else if(success) {
                    console.log('Mail sent successfully');
                    console.dir(success);
                    successCB(success);
                }
                else{
                    errorCB('Status not Known');
                }
            });
        }
    },function(error){
        console.log('Unable to get Email Configuration.');
        errorCB(error);
    });

};

exports.sendCustomerReportInBody = function(data,subject,message,successCB,errorCB) {
    console.log('EmailUtility#sendInBody');
    this.getEmailDetails(function(emailDocument){
        if(emailDocument.length > 0) {
            var emailConfiguration = emailDocument[0];
            console.dir(emailConfiguration);
            console.log('Trying to send mail with User - ' + emailConfiguration.user + ' , Password - ' + emailConfiguration.password + ', Params : ');
            var sendGrid = require('sendgrid')(emailConfiguration.user,emailConfiguration.password);
            // Create html of the Data that will be sent
            var htmlPrefix = '<html><head><title>Customer Report</title></head>' +
                ' <body><p>Customer Report</p>' +
                ' <p><table border="1">';
            var tableHeader='<tr>' +
                '<th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>Email</th>' +
                '<th>Contact No</th>' +
                '<th>Age</th>' +
                '<th>Diet Plan</th>' +
                '<th>Plan Duration</th>' +
                '<th>Start Date</th>' +
                '<th>Consultation Type</th>' +
                '<th>Cost</th>' +
                '<th>Paid</th>' +
                '<th>Balance</th>' +
                '</tr>';
            var tableBody = '';
            for(var counter = 0;counter < data.length;counter++) {
                var customer = data[counter];
                tableBody = tableBody + '<tr> ' +
                '<td>'+customer['first_name']+'</td>' +
                '<td>'+customer['last_name']+'</td>' +
                '<td>'+customer['emailID']+'</td>' +
                '<td>'+customer['mobileNo']+'</td>' +
                '<td>'+customer['age']+'</td>' +
                '<td>'+customer['plan_id']+'</td>' +
                '<td>'+customer['plan_duration']+' months </td>' +
                '<td>'+customer['start_date']+'</td>' +
                '<td>'+customer['consultation_id']+'</td>' +
                '<td>'+customer['price']+'</td>' +
                '<td>'+customer['amount_paid']+'</td>' +
                '<td>'+customer['amount_balance']+'</td>' +
                '</tr>';
            }
            var htmlSuffix = '</table></p><p><span><b>This is an Auto-Generated email.Do not reply</b></span></span></p></body></html>';
            var htmlContents = htmlPrefix+tableHeader+tableBody+htmlSuffix;
            var sendGridParams = {
                to:emailConfiguration.to_email,
                toname:emailConfiguration.to_name,
                from:emailConfiguration.from_email,
                fromname:emailConfiguration.from_name,
                subject:subject,
                text:message,
                html:htmlContents
            };
            console.dir(sendGridParams);
            var email = new sendGrid.Email(sendGridParams);
            sendGrid.send(email,function(error,success){
                if(error) {
                    console.log(error);
                    errorCB(error);
                }
                else if(success) {
                    console.log('Mail sent successfully');
                    console.dir(success);
                    successCB(success);
                }
                else{
                    errorCB('Status not Known');
                }
            });
        }
    },function(error){
        console.log('Unable to get Email Configuration');
        errorCB(error);
    });
};

exports.getEmailDetails = function(successCB,errorCB){
    console.log('EmailUtility#getEmailDetails');
    var emailConfiguration = null;
    dao.listEmailDocuments(function(documentList){
        console.dir(documentList);
        successCB(documentList);
    },function(error){
        console.log('Error while fetching Email Configuration Document List');
        errorCB('Error while fetching Email Configuration Document List');
    });
    return emailConfiguration;
};