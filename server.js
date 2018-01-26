 	var express		=require('express');
 	app			=express();
 	var path 		=require('path');
 	var bodyParser	=require('body-parser');
 	//App Configurations
 	app.use(express.static('public'));
 	app.use(bodyParser.json());
 	app.use(bodyParser.urlencoded({ extended: true }));

 	app.use('/api/user',require('./routers/userR.js'));
 	//ORM Configurations
 	
 	var waterlineConfig = require('./waterline/config')
 	, waterlineOrm = require('./waterline/init').waterlineOrm;
 	var modelPath = path.join(__dirname, '/models');
 	require('./waterline/init')(modelPath);
 	//ORM Initialization 
 	waterlineOrm.initialize(waterlineConfig, function (err, models) {
 	if (err) throw err;
 	db = function (table) { return models['collections'][table]; };
 	db.collections = models.collections;
 	db.connections = models.connections;
 	
 	});

 //	module.exports = app;
 app.listen(process.env.PORT);