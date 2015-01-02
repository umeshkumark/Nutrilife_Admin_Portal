/**
 * Created by Umesh on 25-12-2014.
 */
nutrilifePortal.controller('EmailCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#EmailCtrl');

    // Status Message
    function resetStatusMessages(){
        console.log('AdminCtrl#resetStatusMessages');
        $scope.isError = false;
        $scope.isSuccess = false;
        $scope.statusMessage = '';
    }
    resetStatusMessages();

    function setStatusMessages(status,message){
        $scope.statusMessage = message;
        if(status === true) {
            $scope.isError = false;
            $scope.isSuccess = true;
        }
        else if (status === false) {
            $scope.isError = true;
            $scope.isSuccess = false;
        }
        scrollToStatusMessage();
    }

    function scrollToStatusMessage(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    $scope.email = {
        user:'',
        password:'',
        confPassword:'',
        host:'',
        ssl:false,
        from_email:'',
        from_name:'',
        to_email:'',
        to_name:'',
        site_url:''
    };

    $scope.isDataExists = false;

    $scope.sslOptions = [
        {name:true},
        {name:false}
    ];

    $scope.isSave = true;
    $scope.isUpdate = false;
    $scope.selectedDocumentID = '';
    var emailDetails = baseService.getList('/rest/api/admin/email/list');
    emailDetails.then(function(data){
        if(data.status === true) {
            setStatusMessages(true,data.message);
            $scope.isDataExists = true;
            $scope.onEdit(data.list[0]);
        }
        else {
            setStatusMessages(false,data.message);
        }
    });

    $scope.onReset = function(){
        console.log('EmailCtrl#onReset');
        $scope.email = {
            user:'',
            password:'',
            confPassword:'',
            host:'',
            ssl:false,
            from_email:'',
            from_name:'',
            to_email:'',
            to_name:'',
            site_url:''
        };
        if($scope.isDataExists == false) {
            $scope.isSave = true;
            $scope.isUpdate = false;
        }
        else {
            $scope.isSave = false;
            $scope.isUpdate = true;
        }
        resetStatusMessages();

    };

    $scope.onSave = function(){
        console.log('EmailCtrl#onSave');
        var emailJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            user:$scope.email.user,
            password:$scope.email.password,
            host:$scope.email.host,
            ssl:$scope.email.ssl,
            from_email:$scope.email.from_email,
            from_name:$scope.email.from_name,
            to_email:$scope.email.to_email,
            to_name:$scope.email.to_name,
            site_url:$scope.email.site_url
        };
        if(validate($scope.email)) {
            var isSaved =  baseService.save(emailJSON,'/rest/api/admin/email/saveDocument');
            isSaved.then(function(data){
                if(data.status === true) {
                    setStatusMessages(true,data.message);
                    $scope.isDataExists = true;
                }
                else {
                    setStatusMessages(false,data.message);
                }
            });
        }

    };

    $scope.onEdit = function(selectedElementJSON){
        $scope.email.user = selectedElementJSON.user;
        $scope.email.password = selectedElementJSON.password;
        $scope.email.confPassword = selectedElementJSON.password;
        $scope.email.host = selectedElementJSON.host;
        $scope.email.ssl = selectedElementJSON.ssl;
        $scope.email.from_email=selectedElementJSON.from_email;
        $scope.email.from_name=selectedElementJSON.from_name;
        $scope.email.to_email=selectedElementJSON.to_email;
        $scope.email.to_name=selectedElementJSON.to_name;
        $scope.selectedDocumentID = selectedElementJSON._id;
        $scope.email.site_url = selectedElementJSON.site_url;
        $scope.isSave = false;
        $scope.isUpdate = true;
    };

    $scope.onUpdate = function(){
        console.log('EmailCtrl#onUpdate');
        var emailJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            user:$scope.email.user,
            password:$scope.email.password,
            host:$scope.email.host,
            ssl:$scope.email.ssl,
            from_email:$scope.email.from_email,
            from_name:$scope.email.from_name,
            to_email:$scope.email.to_email,
            to_name:$scope.email.to_name,
            site_url:$scope.email.site_url
        };
        if(validate($scope.email)) {
            var ID = $scope.selectedDocumentID;
            var isUpdated =  baseService.update(emailJSON,ID,'/rest/api/admin/email/updateDocument');
            isUpdated.then(function(data){
                if(data.status === true) {
                    setStatusMessages(true, data.message);
                }
                else {
                    setStatusMessages(false,data.message);
                }
            });
        }
    };

    $scope.onDelete = function(){
        var ID = $scope.selectedDocumentID;
        console.log('EmailCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'');
        isDeleted.then(function(data) {
            if(data.status == true) {
                setStatusMessages(true,data.message);
                $scope.isDataExists = false;
                $scope.onReset();
            }
            else {
                setStatusMessages(false,data.message);
            }

        });
    };

    function validate(documentJSON){
        // check if its the same value in password & confirm password fields
        console.log('EmailCtrl#validate');
        console.dir(documentJSON);
        if(documentJSON.password != documentJSON.confPassword) {
            console.log('Password & Confirm Password should be the same!!');
            setStatusMessages(false,'Password must match Confirm Password');
            return false;
        }
        return true;
    }
});
