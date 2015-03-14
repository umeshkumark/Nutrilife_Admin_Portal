/**
 * Created by Umesh on 07-03-2015.
 */
nutrilifePortal.controller('EventCtrl',function($scope,$rootScope,baseService) {
    console.log('nutrilifePortal#EventCtrl');
    $scope.list = [];

     $scope.eventTypeList = [
            {
                name:'WorkShop'
            },{
                name:'Session'
            }
        ];

    // Status Message
    function resetStatusMessages(){
        console.log('EventCtrl#resetStatusMessages');
        $scope.isError = false;
        $scope.isSuccess = false;
        $scope.statusMessage = '';
    }
    resetStatusMessages();

    function handleServerResponse(response){
        console.log('EventCtrl#HandleServerResponse');
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

    $scope.event = {
        event_type:'',
        when:'',
        duration_hr:'',
        duration_min:'',
        duration_days:'',
        charges:'',
        participants:'',
        venue:'',
        comments:''
    };

    $scope.isSave = true;
    $scope.isUpdate = false;
    $scope.selectedDocID = '';


    var eventList =  baseService.getList('/rest/api/event/list');
    eventList.then(function(data){
        console.log('List of Available Diet Plan ');
        handleServerResponse(data);
    });

    $scope.onReset = function(){
        console.log('EventCtrl#onReset');
        $scope.event = {
            event_type:'',
            when:'',
            duration_hr:'',
            duration_min:'',
            duration_days:'',
            charges:'',
            participants:'',
            venue:'',
            comments:''
        };
        $scope.isSave = true;
        $scope.isUpdate = false;
    };

    $scope.onSave = function(){
        console.log('EventCtrl#onSave');
        var eventJSON = {
            createdTime:new Date(),
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            event_type:$scope.event.event_type,
            when:$scope.event.when,
            duration_hr:$scope.event.duration_hr,
            duration_min:$scope.event.duration_min,
            duration_days:$scope.event.duration_days,
            charges:$scope.event.charges,
            participants:$scope.event.participants,
            venue:$scope.event.venue,
            comments:$scope.event.comments

        };
        var isSaved =  baseService.save(eventJSON,'/rest/api/event/saveDocument');
        isSaved.then(function(data){
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onEdit = function(selectedElementJSON){
        console.log('EventCtrl#onEdit');
        console.dir(selectedElementJSON);
        $scope.event.event_type = selectedElementJSON.event_type;
        $scope.event.when = selectedElementJSON.when;
        $scope.event.duration_hr = selectedElementJSON.duration_hr;
        $scope.event.duration_min = selectedElementJSON.duration_min;
        $scope.event.duration_days = selectedElementJSON.duration_days;
        $scope.event.charges = selectedElementJSON.charges;
        $scope.event.participants = selectedElementJSON.participants;
        $scope.event.venue = selectedElementJSON.venue;
        $scope.event.comments = selectedElementJSON.comments;
        $scope.selectedDocID = selectedElementJSON._id;
        $scope.isSave = false;
        $scope.isUpdate = true;
    };

    $scope.onUpdate = function(){
        console.log('EventCtrl#onUpdate');
        var eventJSON = {
            updatedTime:new Date(),
            createdBy:'',
            updatedBy:'',
            event_type:$scope.event.event_type,
            when:$scope.event.when,
            duration_hr:$scope.event.duration_hr,
            duration_min:$scope.event.duration_min,
            duration_days:$scope.event.duration_days,
            charges:$scope.event.charges,
            participants:$scope.event.participants,
            venue:$scope.event.venue,
            comments:$scope.event.comments
        };
        var ID = $scope.selectedDocID;
        var isUpdated =  baseService.update(eventJSON,ID,'/rest/api/event/updateDocument');
        isUpdated.then(function(data){
            console.log('Successfully Updated');
            console.dir(data);
            handleServerResponse(data);
            $scope.onReset();
        });
    };

    $scope.onDelete = function(ID){
        console.log('EventCtrl#onDelete ID - ' + ID);
        var isDeleted = baseService.delete(ID,'/rest/api/event/deleteDocument');
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
            {field:'event_type', displayName:'Event Type',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'event_type\') }}</span></div>'},
            {field:'when', displayName:'When',width:200,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'when\') }}</span></div>'},
            {field:'charges', displayName:'Charges',width:150,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'charges\') }}</span></div>'},
            {field:'participants', displayName:'Participants',width:200,
                cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.getProperty(\'participants\') }}</span></div>'},
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

