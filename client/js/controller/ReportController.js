/**
 * Created by Umesh on 26-12-2014.
 */
nutrilifePortal.controller('ReportCtrl',function($scope,$rootScope,$window,baseService) {
    console.log('nutrilifePortal#ReportCtrl');

    $scope.statusList = [
        {
            name:'Completed'
        },{
            name:'In-Progress'
        },{
            name:'All'
        }
    ];

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
        consultation_id:'',
        status:'All'
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
            if(key == 'status' && value == 'All') {
                continue;
            }
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
        if(!$rootScope.userDetails.role == 'Super_Admin') {
            alert('You are not authorized for Customer Export');
            return;
        }
        else {
            var csvBlob = new Blob([getCSVFromList($scope.list)], { type: 'text/csv;charset=utf-8' });
            saveAs(csvBlob, 'Report.csv');    
        }
        
    };

    function getCSVFromList(documentList) {
        var header = 'First Name,Last Name,Email,Mobile No,Age,Sex,Height,Weight,Plan,Consultation,Goal,Medical Condition,Start Date,Duration,Price,Amount Paid,Comments,Balance,Comments,';
        var documentListSize = documentList.length;
        var rowData = header+'\n';
        for(var docCounter=0;docCounter<documentListSize;docCounter++){
            var customer = documentList[docCounter];
            rowData = rowData + customer.first_name+','+customer.last_name+','+customer.emailID+','+customer.mobileNo+','+customer.age+','
            +customer.sex+','+customer.height+','+customer.weight+','+customer.plan_id+','+customer.consultation_id+','+customer.goal+','
            +customer.medical_condition+','+customer.start_date+','+customer.plan_duration+','+customer.price+','+customer.amount_paid+','
            +customer.amount_paid_comments+','+customer.amount_balance+','+customer.amount_balance_comments;
            rowData = rowData+'\n';
        } // End of iteration of all Documents
        console.log('Customers : ' + rowData);
        return rowData;
    }

    $scope.onResetCustomerFilter = function(){
        $scope.customerFilter = {
            first_name:'',
            last_name:'',
            plan_id:'',
            consultation_id:'',
            status:'All'
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
            {field:'mobileNo', displayName:'Contact No',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'mobileNo\') }}</span></div>'},
            {field:'emailID', displayName:'Email',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'emailID\') }}</span></div>'},
            {field:'consultation_id', displayName:'Consulation Type',width:150,
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