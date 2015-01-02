/**
 * Created by Umesh on 26-12-2014.0
 */
nutrilifePortal.controller('SiteMgmtCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#SiteMgmtCtrl');

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


    $scope.sitemgmt = {
        site_header:'',
        site_footer:'',
        login_header:'',
        login_footer:''
    };

    $scope.selectedDocumentID = '';

    $scope.isSave = true;
    $scope.isUpdate = false;

    var siteMgmtList =  baseService.getList('/rest/api/admin/sitemgmt/list');
    siteMgmtList.then(function(data){
        if(data.status === true) {
            var siteMgmt = data.list[0];
            $scope.sitemgmt.site_header = siteMgmt.site_header;
            $scope.sitemgmt.site_footer = siteMgmt.site_footer;
            $scope.sitemgmt.login_header = siteMgmt.login_header;
            $scope.sitemgmt.login_footer = siteMgmt.login_footer;
            $scope.selectedDocumentID = siteMgmt._id;
            $scope.isSave = false;
            $scope.isUpdate = true;
        }
        else {
            setStatusMessages(false,data.message);
        }
    });

    $scope.onReset = function(){
        console.log('SiteMgmtCtrl#onReset');
        $scope.sitemgmt = {
            site_header:'',
            site_footer:'',
            login_header:'',
            login_footer:''
        };
        $scope.isSave = true;
        $scope.isUpdate = false;
        resetStatusMessages();
    };

    $scope.onSave = function(){
        console.log('SiteMgmtCtrl#onSave');
        var siteMgmtJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            site_header:$scope.sitemgmt.site_header,
            site_footer:$scope.sitemgmt.site_footer,
            login_header:$scope.sitemgmt.login_header,
            login_footer:$scope.sitemgmt.login_footer
        };
        var isSaved =  baseService.save(siteMgmtJSON,'/rest/api/admin/sitemgmt/saveDocument');
        isSaved.then(function(data){
            if(data.status === true) {
                setStatusMessages(true,data.message);
            }
            else {
                setStatusMessages(false,data.message);
            }
        });
    };

    $scope.onEdit = function(selectedElementJSON){
        $scope.sitemgmt.site_header = selectedElementJSON.site_header;
        $scope.sitemgmt.site_footer= selectedElementJSON.site_footer;
        $scope.sitemgmt.login_header = selectedElementJSON.login_header;
        $scope.sitemgmt.login_footer= selectedElementJSON.login_footer;
        $scope.isSave = false;
        $scope.isUpdate = true;
    };

    $scope.onUpdate = function(){
        console.log('SiteMgmtCtrl#onUpdate');
        var dietPlanJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            site_header:$scope.sitemgmt.site_header,
            site_footer:$scope.sitemgmt.site_footer,
            login_header:$scope.sitemgmt.login_header,
            login_footer:$scope.sitemgmt.login_footer
        };
        var ID = $scope.selectedDocumentID;
        var isUpdated =  baseService.update(dietPlanJSON,ID,'/rest/api/admin/sitemgmt/updateDocument');
        isUpdated.then(function(data){
            if(data.status === true) {
                setStatusMessages(true,data.message);
            }
            else {
                setStatusMessages(false,data.message);
            }
        });
    };

    $scope.onDelete = function(ID){
        console.log('SiteMgmtCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'');
        isDeleted.then(function(data){
            $scope.list = data;
            $scope.onReset();
        });
    };

});


