/**
 * Created by Umesh on 26-12-2014.
 */
nutrilifePortal.controller('ConsultationCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#ConsultationCtrl');

    // Status Message
    function resetStatusMessages(){
        console.log('AdminCtrl#resetStatusMessages');
        $scope.isError = false;
        $scope.isSuccess = false;
        $scope.statusMessage = '';
    }
    resetStatusMessages();

    function handleServerResponse(response){
        console.log('AdminCtrl#HandleServerResponse');
        console.dir(response);
        if(response.status === true){
            $scope.list = response.list;
            setStatusMessages(true,response.message);
            $scope.onReset();
        }
        else if(response.status === false) {
            setStatusMessages(false,response.message);
        }
    }

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

    $scope.consultation = {
        name:'',
        desc:''
    };

    $scope.isSave = true;
    $scope.isUpdate = false;
    $scope.list = [];
    $scope.selectedDocID = '';
    var consultationList =  baseService.getList('rest/api/consultation/list');
    consultationList.then(function(data){
        handleServerResponse(data);
    });

    $scope.onReset = function(){
        console.log('ConsultationCtrl#onReset');
        $scope.consultation = {
            name:'',
            desc:''
        };
        $scope.isSave = true;
        $scope.isUpdate = false;
    };

    $scope.onSave = function(){
        console.log('consultationCtrl#onSave');
        var consultationJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            name:$scope.consultation.name,
            desc:$scope.consultation.desc

        };
        var isSaved =  baseService.save(consultationJSON,'/rest/api/consultation/saveDocument');
        isSaved.then(function(data){
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onEdit = function(selectedElementJSON){
        $scope.consultation.name = selectedElementJSON.name;
        $scope.consultation.desc= selectedElementJSON.desc;
        $scope.isSave = false;
        $scope.isUpdate = true;
        $scope.selectedDocID = selectedElementJSON._id;
    };

    $scope.onUpdate = function(){
        console.log('consultationCtrl#onUpdate');
        var consultationJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            name:$scope.consultation.name,
            desc:$scope.consultation.desc
        };
        var ID = $scope.selectedDocID;
        var isUpdated =  baseService.update(consultationJSON,ID,'/rest/api/consultation/updateDocument');
        isUpdated.then(function(data){
            console.log('Successfully Updated..');
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onDelete = function(ID){
        console.log('consultationCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'/rest/api/consultation/deleteDocument');
        isDeleted.then(function(data){
            handleServerResponse(data);
            $scope.onReset();
        });
    };


    // Grid
    $scope.gridOptions = {
        data:'list',
        rowHeight:50,
        columnDefs: [
            {field:'name', displayName:'Name',width:200,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'name\') }}</span></div>'},
            {field:'desc', displayName:'Description',width:200,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'desc\') }}</span></div>'},
            {field:'edit', displayName:'Edit',width:75,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#"><i class="fa fa-pencil fa-fw" ng-click="onEdit(row.entity)"></i></a></div>'},
            {field:'delete', displayName:'Delete',width:75,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#"><i class="fa fa-trash-o fa-fw" ng-click="onDelete(row.entity._id)"></i></a></div>'}
        ],
        multiSelect: false,
        enableRowSelection:false,
        selectedItems: []
    };

});