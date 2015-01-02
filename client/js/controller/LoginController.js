/**
 * Created by Umesh on 27-12-2014.
 * email - umeshkumar.kumar@gmail.com
 * github - https://github.com/ukbokamalla
 *
 * file - LoginController.js
 * desc - social login
 */

nutrilifePortal.controller('LoginCtrl',function($scope,$rootScope,$http,baseService,$location) {
    console.log('nutrilifePortal#LoginCtrl');

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

    $scope.isShowLoginButton = false;

    $scope.login = {
        login_id:'',
        password:''
    };

    $rootScope.$on("logout",function(){
        console.log('Logout Event fired...');
        $rootScope.userDetails = {
            login_id:'',
            name:'',
            role:''
        };
        $rootScope.isUserLoggedIn = false;
        $location.path('login');
    });

    var userDetails = {
        login_id: '',
        name: '',
        role: '',
        password:''
    };


    $scope.onProceed = function() {
        console.log('LoginCtrl#onProceed');
        // Check if the user is configured in System
        console.dir($scope.login);
        var isConfigured = baseService.checkIfUserExists($scope.login, '/rest/api/admin/checkIfUserExists');
        isConfigured.then(function (data) {
            console.dir(data);
            if(data.status === true) {
                $scope.isShowLoginButton = true;
                userDetails = {
                    login_id: data.list[0].login_id,
                    name: data.list[0].name,
                    role: data.list[0].role
                };
            }
            else {
                console.log('User is not configured');
                setStatusMessages(false,data.message);
            }
        });
    };

    $scope.onLogin = function() {
        console.log('LoginCtrl#onLogin');
        userDetails.password = $scope.login.password;
        console.dir(userDetails);
        var isAuthenticated = baseService.authenticateUser(userDetails,'/rest/api/admin/authenticate');
        isAuthenticated.then(function(data){
            console.dir(data);
            if(data.status === true) {
                $rootScope.userDetails = {
                    login_id: data.list[0].login_id,
                    name: data.list[0].name,
                    role: data.list[0].role
                };
                $rootScope.isUserLoggedIn = true;
                $location.path('dashboard');
            }
            else {
                setStatusMessages(false,data.message);
            }
        });
    };

    $scope.onForgotPassword = function() {
        console.log('LoginCtrl#onForgotPassword');
        var isMailSent = baseService.forgotPassword(userDetails,'/rest/api/admin/forgotPassword');
        isMailSent.then(function(data){
            console.dir(data);
            if(data.status === true) {
                setStatusMessages(true,data.message);
            }
            else {
                setStatusMessages(false,data.message);
            }
        });
    };
});

