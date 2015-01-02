nutrilifePortal.controller('PasswordCtrl',function($scope,$rootScope,baseService,$location) {
    console.log('nutrilifePortal#PasswordCtrl');

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

    $scope.user={
        password:'',
        conf_password:''
    };

    $scope.onSave = function(){
        console.log('PasswordCtrl#onSave');
        resetStatusMessages();
        if($scope.user.password != $scope.user.conf_password) {
            setStatusMessages(false,'Password does not match');
        }
        else {
            var userPassword = {
                password:$scope.user.password,
                login_id:$rootScope.userDetails.login_id
            };
            var isPasswordUpdated = baseService.modifyPassword(userPassword,'/rest/api/admin/modifyPassword');
            isPasswordUpdated.then(function(data){
                console.log('Password Updated');
                if(data.status === true) {
                    $location.path('dashboard');
                }
                else {
                    setStatusMessages(false,data.message);
                }
            });
        }
    };


});