/**
 * Created by Umesh on 26-12-2014.
 */
nutrilifePortal.controller('CustomerCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#CustomerCtrl');

    function resetStatusMessages(){
        console.log('CustomerCtrl#resetStatusMessages');
        $scope.isError = false;
        $scope.isSuccess = false;
        $scope.statusMessage = '';
    }

    resetStatusMessages();

    function handleServerResponse(response){
        console.log('CustomerCtrl#HandleServerResponse');
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

    $scope.grid_customer_status = 'All';

    $scope.customer = {
        first_name:'',
        last_name:'',
        age:'',
        sex:'',
        height:'',
        weight:'',
        plan_id:'',
        start_date:'',
        price:'',
        plan_duration:'',
        consultation_id:'',
        amount_paid:'',
        amount_paid_comments:'',
        amount_balance:'',
        amount_balance_comments:'',
        misc_comments:'',
        medical_condition:'',
        goal:'',
        status:'All',
        mobileNo:'',
        emailID:'',
        completed_comments:'',
        grid_customer_status:'All'
    };

    $scope.selectedDocumentID = '';
    $scope.isSave = true;
    $scope.isUpdate = false;
    $scope.list = [];
    $scope.consultationList = [];
    $scope.dietPlanList = [];
    $scope.statusList = [
        {
            name:'Completed'
        },{
            name:'In-Progress'
        },{
            name:'All'
        }
    ];
    $scope.sexList = [
        {
            name:'Male'
        },{
            name:'Female'
        }
    ];
    var customerList =  baseService.getList('/rest/api/customer/list');
    customerList.then(function(data){
        console.log('CustomerCtrl#list');
        console.dir(data);
        handleServerResponse(data);

    });

    var dietList = baseService.getList('/rest/api/dietplan/list');
    dietList.then(function(data){
        console.log('CustomerCtrl#dietPlanList');
        console.dir(data);
        if(data.status === true) {
            setStatusMessages(true,data.message);
            $scope.dietPlanList = data.list;
        }
        else {
            setStatusMessages(false,data.message);
            $scope.dietPlanList = [];
        }

    });

    var consList = baseService.getList('/rest/api/consultation/list');
    consList.then(function(data){
        console.log('CustomerCtrl#consultationList');
        console.dir(data);
        if(data.status === true) {
            setStatusMessages(true,data.message);
            $scope.consultationList = data.list;
        }
        else {
            setStatusMessages(false,data.message);
            $scope.consultationList = [];
        }

    });

    $scope.onReset = function(){
        console.log('CustomerCtrl#onReset');
        $scope.customer = {
            first_name:'',
            last_name:'',
            age:'',
            sex:'',
            height:'',
            weight:'',
            plan_id:'',
            start_date:'',
            price:'',
            plan_duration:'',
            consultation_id:'',
            amount_paid:'',
            amount_paid_comments:'',
            amount_balance:'',
            amount_balance_comments:'',
            misc_comments:'',
            medical_condition:'',
            goal:'',
            grid_customer_status:'All',
            status:'All',
            mobileNo:'',
            emailID:'',
            completed_comments:'',
        };
        $scope.isSave = true;
        $scope.isUpdate = false;
    };

    $scope.onSave = function(){
        console.log('CustomerCtrl#onSave');
        var customerJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            first_name:$scope.customer.first_name,
            last_name:$scope.customer.last_name,
            age:$scope.customer.age,
            sex:$scope.customer.sex,
            height:$scope.customer.height,
            weight:$scope.customer.weight,
            plan_id:$scope.customer.plan_id,
            start_date:$scope.customer.start_date,
            price:$scope.customer.price,
            plan_duration:$scope.customer.plan_duration,
            consultation_id:$scope.customer.consultation_id,
            amount_paid:$scope.customer.amount_paid,
            amount_paid_comments:$scope.customer.amount_paid_comments,
            amount_balance:$scope.customer.amount_balance,
            amount_balance_comments:$scope.customer.amount_balance_comments,
            misc_comments:$scope.customer.misc_comments,
            medical_condition:$scope.customer.medical_condition,
            goal:$scope.customer.goal,
            mobileNo:$scope.customer.mobileNo,
            emailID:$scope.customer.emailID,
            completed_comments:$scope.customer.completed_comments,
            status:$scope.customer.status
        };
        var isSaved =  baseService.save(customerJSON,'/rest/api/customer/saveDocument');
        isSaved.then(function(data){
            handleServerResponse(data);
        });
    };

    $scope.onEdit = function(selectedElementJSON){
        console.log('CustomerCtrl#onEdit');
        console.dir(selectedElementJSON);
        $scope.customer.first_name=selectedElementJSON.first_name;
        $scope.customer.last_name=selectedElementJSON.last_name;
        $scope.customer.age=selectedElementJSON.age;
        $scope.customer.sex=selectedElementJSON.sex;
        $scope.customer.height=selectedElementJSON.height;
        $scope.customer.weight=selectedElementJSON.weight;
        $scope.customer.plan_id=selectedElementJSON.plan_id;
        $scope.customer.start_date=selectedElementJSON.start_date;
        $scope.customer.price=selectedElementJSON.price;
        $scope.customer.plan_duration=selectedElementJSON.plan_duration;
        $scope.customer.consultation_id=selectedElementJSON.consultation_id;
        $scope.customer.amount_paid=selectedElementJSON.amount_paid;
        $scope.customer.amount_paid_comments=selectedElementJSON.amount_paid_comments;
        $scope.customer.amount_balance=selectedElementJSON.amount_balance;
        $scope.customer.amount_balance_comments=selectedElementJSON.amount_balance_comments;
        $scope.customer.misc_comments=selectedElementJSON.misc_comments;
        $scope.selectedDocumentID = selectedElementJSON._id;
        $scope.customer.medical_condition = selectedElementJSON.medical_condition;
        $scope.customer.goal = selectedElementJSON.goal;
        $scope.customer.mobileNo = selectedElementJSON.mobileNo;
        $scope.customer.emailID = selectedElementJSON.emailID;
        $scope.customer.completed_comments = selectedElementJSON.completed_comments;
        $scope.customer.status = selectedElementJSON.status;
        $scope.isSave = false;
        $scope.isUpdate = true;
    };

    $scope.onUpdate = function(){
        console.log('CustomerCtrl#onUpdate');
        var customerJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            first_name:$scope.customer.first_name,
            last_name:$scope.customer.last_name,
            age:$scope.customer.age,
            sex:$scope.customer.sex,
            height:$scope.customer.height,
            weight:$scope.customer.weight,
            plan_id:$scope.customer.plan_id,
            start_date:$scope.customer.start_date,
            price:$scope.customer.price,
            plan_duration:$scope.customer.plan_duration,
            consultation_id:$scope.customer.consultation_id,
            amount_paid:$scope.customer.amount_paid,
            amount_paid_comments:$scope.customer.amount_paid_comments,
            amount_balance:$scope.customer.amount_balance,
            amount_balance_comments:$scope.customer.amount_balance_comments,
            misc_comments:$scope.customer.misc_comments,
            medical_condition:$scope.customer.medical_condition,
            goal:$scope.customer.goal,
            mobileNo:$scope.customer.mobileNo,
            emailID:$scope.customer.emailID,
            completed_comments:$scope.customer.completed_comments,
            status:$scope.customer.status
        };
        var ID = $scope.selectedDocumentID;
        var isUpdated =  baseService.update(customerJSON,ID,'/rest/api/customer/updateDocument');
        isUpdated.then(function(data){
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onDelete = function(ID){
        console.log('CustomerCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'/rest/api/customer/deleteDocument');
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
            {field:'first_name', displayName:'First Name',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'first_name\') }}</span></div>'},
            {field:'last_name', displayName:'Last Name',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'last_name\') }}</span></div>'},
            {field:'mobileNo', displayName:'Contact No',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'mobileNo\') }}</span></div>'},
            {field:'emailID', displayName:'Email',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'emailID\') }}</span></div>'},
            {field:'consultation_id', displayName:'Consulation Type',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'consultation_id\') }}</span></div>'},
            {field:'plan_id', displayName:'Plan Type',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'plan_id\') }}</span></div>'},
            {field:'start_date', displayName:'Start Date',width:100,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'start_date\') }}</span></div>'},
            {field:'medical_condition', displayName:'Medical Condition',width:100,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'medical_condition\') }}</span></div>'},
            {field:'edit', displayName:'Edit',width:50,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#"><i class="fa fa-pencil fa-fw" ng-click="onEdit(row.entity)"></i></a></div>'},
            {field:'delete', displayName:'Delete',width:75,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#"><i class="fa fa-trash-o fa-fw" ng-click="onDelete(row.entity._id)"></i></a></div>'}
        ],
        multiSelect: false,
        enableRowSelection:false,
        selectedItems: []
    };

    // Grid Filter 
    $scope.onGridFilter = function(){
        var customerList = null;
        var status = $scope.grid_customer_status;
        console.log('onGridFilter Status : ' + status);
        if(status == 'All') {
            customerList = baseService.getList('/rest/api/customer/list');
        }
        else {
            var filterCriteria = {
                status:status
            };
            customerList = baseService.getFilteredList('/rest/api/customer/filteredList',filterCriteria);
        }
        customerList.then(function(data){
            console.log('CustomerCtrl#list');
            console.dir(data);
            $scope.list = data.list;
        });
    };

});