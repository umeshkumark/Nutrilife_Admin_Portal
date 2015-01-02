/**
 * Created by Umesh on 26-12-2014.
 */
nutrilifePortal.controller('AdminCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#AdminCtrl');

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

    $scope.admin = {
        name:'',
        login_id:'',
        is_suspended:'',
        role:'',
        password:''
    };

    $scope.isSave = true;
    $scope.isUpdate = false;
    $scope.list = [];
    $scope.selectedID = '';

    $scope.suspendedList = [
        {name:'No'},
        {name:'Yes'}
    ];

    $scope.roleList = [
        {name:'Super_Admin'},
        {name:'Admin'},
        {name:'Demo'}
    ];

    var adminUserList =  baseService.getList('/rest/api/admin/list');
    adminUserList.then(function(data){
        handleServerResponse(data);
    });

    $scope.onReset = function(){
        console.log('AdminCtrl#onReset');
        $scope.admin = {
            name:'',
            login_id:'',
            is_suspended:'',
            role:'',
            password:''
        };
        $scope.isSave = true;
        $scope.isUpdate = false;
    };

    $scope.onSave = function(){
        console.log('AdminCtrl#onSave');
        var adminJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            name:$scope.admin.name,
            login_id:$scope.admin.login_id,
            is_suspended:$scope.admin.is_suspended,
            role:$scope.admin.role,
            password:$scope.admin.password

        };
        var isSaved =  baseService.save(adminJSON,'/rest/api/admin/saveDocument');
        isSaved.then(function(data){
            handleServerResponse(data);
        });
    };

    $scope.onEdit = function(selectedElementJSON){
        $scope.admin.name = selectedElementJSON.name;
        $scope.admin.login_id= selectedElementJSON.login_id;
        $scope.admin.is_suspended= selectedElementJSON.is_suspended;
        $scope.admin.role= selectedElementJSON.role;
        $scope.isSave = false;
        $scope.isUpdate = true;
        $scope.selectedID = selectedElementJSON._id;
        $scope.password = selectedElementJSON.password;
    };

    $scope.onUpdate = function(){
        console.log('DietPlanCtrl#onUpdate');
        var dietPlanJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            name:$scope.admin.name,
            login_id:$scope.admin.login_id,
            is_suspended:$scope.admin.is_suspended,
            role:$scope.admin.role,
            password:$scope.admin.password
        };
        var ID = $scope.selectedID;
        var isUpdated =  baseService.update(dietPlanJSON,ID,'/rest/api/admin/updateDocument');
        isUpdated.then(function(data){
            handleServerResponse(data);
        });
    };

    $scope.onDelete = function(ID){
        console.log('DietPlanCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'/rest/api/admin/deleteDocument');
        isDeleted.then(function(data){
            handleServerResponse(data);
        });
    };


    // Grid
    $scope.gridOptions = {
        data:'list',
        rowHeight:50,
        columnDefs: [
            {field:'name', displayName:'Name',width:200,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'name\') }}</span></div>'},
            {field:'login_id', displayName:'Login ID',width:250,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'login_id\') }}</span></div>'},
            {field:'is_suspended', displayName:'Is Suspended',width:125,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'is_suspended\') }}</span></div>'},
            {field:'role', displayName:'Role',width:175,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'role\') }}</span></div>'},
            {field:'edit', displayName:'Edit',width:50,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#"><i class="fa fa-pencil fa-fw" ng-click="onEdit(row.entity)"></i></a></div>'},
            {field:'delete', displayName:'Delete',width:75,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#"><i class="fa fa-trash-o fa-fw" ng-click="onDelete(row.entity._id)"></i></a></div>'}
        ],
        multiSelect: false,
        enableRowSelection:false,
        selectedItems: []
    };

});

