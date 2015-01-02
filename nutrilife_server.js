/**
 * Created by Umesh on 27-12-2014.
 */


// init express

var express = require('express');
var app = express();

// Read the config.json file
var fs = require('fs');
var configJSONFile = './nutrilife.json';

fs.readFile(configJSONFile, 'utf8', function (error, data) {
    console.log('nutrilife_server#Reading config file');
    var configData = null;
    if (error) {
        console.log('Error while reading config file :' + error);
        return;
    }
    configData = JSON.parse(data);
    console.dir(configData);
    if(configData != null) {
        startServer(configData);
    }
    else {
        console.log('Unable to start Server . Check if nutrilife.json exists');
    }
});

function startServer(configData) {
    console.log('nutrilife_server#startServer');
    var current_dir = __dirname;
    console.log('nutrilife_server#startServer CURRENT DIR - ' + current_dir);
    app.configure(function(){
        var static_dir = current_dir+configData.clientDirectory;
        var home_screen_html_file = current_dir+configData.homeScreen;
        var environment = configData.environment;
        var db_conn_uri = configData[environment].dbURI;
        var http_port = null;
        var server_ip = null;
        if('openshift' == environment) {
            http_port = process.env.OPENSHIFT_NODEJS_PORT || configData[environment].httpPort;
            server_ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
        }
        else if ('heroku' == environment){
            http_port = process.env.PORT || configData[environment].httpPort;
            server_ip = process.env.IP || '127.0.0.1';
        }
        else {
            http_port = configData[environment].httpPort;
            server_ip = configData[environment].serverIp;
        }
        console.log('Start Server . Environment - ' + environment + ' , Static Dir - ' + static_dir + ', Home Screen - ' + home_screen_html_file + ', DB Conn URI - ' + db_conn_uri + ', Http Port - ' + http_port + ', Server IP - ' + server_ip);

        app.use(express.static(static_dir));
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);

        // default route. When user hits F5/reload send the index.html file
        app.use(function(request, response) {
            response.sendfile(home_screen_html_file);
        });

        // Load Server Route
        var server_routes = require('./server/route/ServerRoute.js')(app,current_dir,db_conn_uri);

        // Start Server
        app.listen(http_port,server_ip);
    });
}