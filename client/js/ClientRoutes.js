var ClientRoutes = function($routeProvider,$locationProvider){
    console.log('ClientRoutes');
    $routeProvider.when('/admin',{
            templateUrl: 'view/Admin.html'
        })
        .when('/consultation',{
            templateUrl: 'view/Consultation.html'
        })
        .when('/customer',{
            templateUrl: 'view/Customer.html'
        })
        .when('/diet_plan',{
            templateUrl: 'view/DietPlan.html'
        })
        .when('/email',{
            templateUrl: 'view/Email.html'
        })
        .when('/site_mgmt',{
            templateUrl: 'view/SiteMgmt.html'
        })
        .when('/report',{
            templateUrl: 'view/Report.html'
        })
        .when('/login',{
            templateUrl: 'view/Login.html'
        })
        .when('/admin',{
            templateUrl: 'view/Admin.html'
        })
        .when('/dashboard',{
            templateUrl: 'view/Dashboard.html'
        })
        .when('/password',{
            templateUrl: 'view/Password.html'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
};
