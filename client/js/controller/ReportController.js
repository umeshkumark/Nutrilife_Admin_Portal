/**
 * Created by Umesh on 26-12-2014.
 */
nutrilifePortal.controller('ReportCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#ReportCtrl');

    // Status Message
    function resetStatusMessages(){
        console.log('AdminCtrl#resetStatusMessages');
        $scope.isError = false;
        $scope.isSuccess = false;
        $scope.statusMessage = '';
    }
    resetStatusMessages();

    var allCustomerList = [];

    function handleServerResponse(response){
        console.log('AdminCtrl#HandleServerResponse');
        console.dir(response);
        if(response.status === true){
            $scope.list = response.list;
            allCustomerList = $scope.list;
            setStatusMessages(true,response.message);
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


    $scope.customerFilter = {
        first_name:'',
        last_name:'',
        plan_id:'',
        consultation_id:''
    };

    $scope.consultationList = [];
    $scope.dietPlanList = [];


    // Get the list of all Customers
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
            $scope.dietPlanList = data.list;
        }
        else {
            setStatusMessages(false,data.message);
        }
    });

    var consList = baseService.getList('/rest/api/consultation/list');
    consList.then(function(data){
        console.log('CustomerCtrl#consultationList');
        console.dir(data);
        if(data.status === true) {
            $scope.consultationList = data.list;
        }
        else {
            setStatusMessages(false,data.message);
        }

    });

    // Get the list of Customers based on the Filter Criteria
    $scope.getFilteredCustomerList = function(){
        console.log('ReportCtrl#getFilteredCustomerList Filter Criteria ');
        console.dir($scope.customerFilter);
        var filterCriteria = {};
        for (var key in $scope.customerFilter){
            var value = $scope.customerFilter[key];
            if(value != ''){
                filterCriteria[key] = value;
            }
        }
        console.dir(filterCriteria);
        var filteredList = baseService.getFilteredList('/rest/api/customer/filteredList',filterCriteria);
        filteredList.then(function(data){
            handleServerResponse(data);
        });
    };

    $scope.onSendEmail = function(){
        var isMailSent = baseService.sendEmail($scope.list,'/rest/api/admin/email/emailCustomerReport');
        isMailSent.then(function(data){
            console.log('ReportCtrl#onSendEmail');
            console.dir(data);
            if(data.status === true){
                setStatusMessages(true,data.message);
            }
            else {
                setStatusMessages(false,data.message);
            }
        });
    };

    $scope.onExport = function(){
        var isExported = baseService.exportReport($scope.list,'');
        isExported.then(function(data){
            console.log('Exported ...');
        });
    };

    $scope.onResetCustomerFilter = function(){
        $scope.customerFilter = {
            first_name:'',
            last_name:'',
            plan_id:'',
            consultation_id:''
        };
        $scope.list = allCustomerList;
        resetStatusMessages();
    };

    $scope.customerGridOptions = {
        data:'list',
        rowHeight:50,
        columnDefs: [
            {field:'first_name', displayName:'First Name',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'first_name\') }}</span></div>'},
            {field:'last_name', displayName:'Last Name',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'last_name\') }}</span></div>'},
            {field:'consultation_id', displayName:'Consulation Type',width:250,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'consultation_id\') }}</span></div>'},
            {field:'plan_id', displayName:'Plan Type',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'plan_id\') }}</span></div>'},
            {field:'start_date', displayName:'Start Date',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'start_date\') }}</span></div>'}
        ],
        multiSelect: false,
        enableRowSelection:false,
        selectedItems: []
    };

});