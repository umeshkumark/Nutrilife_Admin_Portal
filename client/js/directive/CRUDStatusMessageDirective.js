/**
 * Created by Umesh on 31-12-2014.
 */

nutrilifePortal.directive('crudStatusErrorMessage',function(){
    console.log('NutrilifePortal#CrudStatusMessage');
    return {
        template:'<div class="row form-group" id="statusMessageDiv" style="color: #F42B11"><div class="col-md-6 col-md-offset-5"><span><b>{{statusMessage}}</b></span></div></div>',
        restrict:'A',
        replace:true
    }
});
nutrilifePortal.directive('crudStatusSuccessMessage',function(){
    console.log('NutrilifePortal#CrudStatusMessage');
    return {
        template:'<div class="row form-group" id="statusMessageDiv" style="color: #18A915"><div class="col-md-6 col-md-offset-5"><span><b>{{statusMessage}}</b></span></div></div>',
        restrict:'A',
        replace:true
    }
});