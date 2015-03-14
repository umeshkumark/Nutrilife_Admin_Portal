/**
 * Created by Umesh on 25-12-2014.
 */
nutrilifePortal.factory('baseService', function($http) {
    console.log('nutrilifePortal#BaseService');
    return {
        save:function(elementJSON,restEndPoint) {
            console.log('nutrilifePortal#save REST End Point - ' + restEndPoint);
            console.dir(elementJSON);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:elementJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#save');
            });
            return promise;
        },
        update:function(elementJOSN,elementID,restEndPoint) {
            console.log('nutrilifePortal#update REST End Point - ' + restEndPoint + ' ID - ' + elementID);
            console.dir(elementJOSN);
            var promise = $http({
                method:'POST',
                url:restEndPoint+'/'+elementID,
                data:elementJOSN
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#update');
            });
            return promise;
        },
        getByID:function(elementID,restEndPoint) {
            console.log('nutrilifePortal#getByID REST End Point - ' + restEndPoint + ' ID - ' + elementID);
            var promise = $http({
                method : 'GET',
                url:restEndPoint+'/'+elementID
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#getByID');
            });
            return promise;
        },
        getList:function(restEndPoint) {
            console.log('nutrilifePortal#getList CORS REST End Point - ' + restEndPoint);
            var promise = $http({
                method:'GET',
                url:restEndPoint
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#getList');
            });
            return promise;
        },
        getFilteredList:function(restEndPoint,filterJSON) {
            console.log('nutrilifePortal#getFilteredList REST End Point - ' + restEndPoint);
            console.dir(filterJSON);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:filterJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#getFilteredList');
            });
            return promise;
        },
        delete:function(elementID,restEndPoint) {
            console.log('nutrilifePortal#delete REST End Point - ' + restEndPoint + ' ID - ' + elementID);
            var promise = $http({
                method:'DELETE',
                url:restEndPoint+'/'+elementID
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#delete');
            });
            return promise;
        },
        checkIfUserExists:function(userJSON,restEndPoint) {
            console.log('nutrilifePortal#checkIfUserExists REST End Point - ' + restEndPoint);
            console.dir(userJSON);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:userJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#checkIfUserExists');
            });
            return promise;
        },
        authenticateUser:function(userJSON,restEndPoint) {
            console.log('nutrilifePortal#authenticateUser REST End Point - ' + restEndPoint);
            console.dir(userJSON);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:userJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#authenticateUser');
            });
            return promise;
        },
        forgotPassword:function(userJSON,restEndPoint) {
            console.log('BaseService#forgotPassword REST End Point - ' + restEndPoint);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:userJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#forgotPassword');
            });
            return promise;
        },
        modifyPassword:function(passwordJSON,restEndPoint) {
            console.log('BaseService#modifyPassword REST End Point - ' + restEndPoint);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:passwordJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#sendEmail');
            });
            return promise;
        },
        sendEmail:function(documentJSON,restEndPoint) {
            console.log('nutrilifePortal#sendEmail REST End Point - ' + restEndPoint);
            var promise = $http({
                method:'POST',
                url:restEndPoint,
                data:documentJSON
            }).then(function(response){
                return response.data;
            },function(error){
                console.log('Error in nutrilifePortal#sendEmail');
            });
            return promise;
        }
    };

});