/**
 * Created by Umesh on 26-12-2014.
 */
nutrilifePortal.controller('DietPlanCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#DietPlanCtrl');
    $scope.list = [];
    // Status Message
    function resetStatusMessages(){
        console.log('DietPlanCtrl#resetStatusMessages');
        $scope.isError = false;
        $scope.isSuccess = false;
        $scope.statusMessage = '';
    }
    resetStatusMessages();

    function handleServerResponse(response){
        console.log('DietPlanCtrl#HandleServerResponse');
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

    $scope.dietPlan = {
        name:'',
        desc:''
    };

    $scope.isSave = true;
    $scope.isUpdate = false;
    $scope.selectedDocID = '';


    var dietPlanList =  baseService.getList('/rest/api/dietplan/list');
    dietPlanList.then(function(data){
        console.log('List of Available Diet Plan ');
        handleServerResponse(data);
    });

    $scope.onReset = function(){
        console.log('DietPlanCtrl#onReset');
        $scope.dietPlan = {
            name:'',
            desc:''
        };
        $scope.isSave = true;
        $scope.isUpdate = false;
    };

    $scope.onSave = function(){
        console.log('DietPlanCtrl#onSave');
        var dietPlanJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            name:$scope.dietPlan.name,
            desc:$scope.dietPlan.desc

        };
        var isSaved =  baseService.save(dietPlanJSON,'/rest/api/dietplan/saveDocument');
        isSaved.then(function(data){
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onEdit = function(selectedElementJSON){
        console.log('DietPlanCtrl#onEdit');
        console.dir(selectedElementJSON);
        $scope.dietPlan.name = selectedElementJSON.name;
        $scope.dietPlan.desc= selectedElementJSON.desc;
        $scope.selectedDocID = selectedElementJSON._id;
        $scope.isSave = false;
        $scope.isUpdate = true;
    };

    $scope.onUpdate = function(){
        console.log('DietPlanCtrl#onUpdate');
        var dietPlanJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            name:$scope.dietPlan.name,
            desc:$scope.dietPlan.desc
        };
        var ID = $scope.selectedDocID;
        var isUpdated =  baseService.update(dietPlanJSON,ID,'/rest/api/dietplan/updateDocument');
        isUpdated.then(function(data){
            console.log('Successfully Updated');
            console.dir(data);
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onDelete = function(ID){
        console.log('DietPlanCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'/rest/api/dietplan/deleteDocument');
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

