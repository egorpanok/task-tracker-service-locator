const express 		= require("express");
const app			= express();
const bodyParser  	= require("body-parser");
const jsonParser 	= bodyParser.json();
const config 		= require("./config");
const port			= config.port;
const TaskSchema 	= require('./data-access/schemas/task');


// Service Locator for Test Database
const testServiceLocator = require('./service-locator')();
testServiceLocator.register('dbUrl', config.dbUris.test);
testServiceLocator.register('generateConfig', config.generate);
testServiceLocator.register('TaskSchema', TaskSchema);
testServiceLocator.factory('connection', require('./data-access/db-connection'));
testServiceLocator.factory('modelCreator', require('./data-access/model-creator'));
testServiceLocator.factory('taskDropper', require('./data-gen/task-dropper'));
testServiceLocator.factory('taskGenerator', require('./data-gen/task-generator'));
testServiceLocator.factory('dataGenerator', require('./data-gen/data-generator'));


// Service Locator for Prod Database
const prodServiceLocator = require('./service-locator')();
prodServiceLocator.register('dbUrl', config.dbUris.prod);
prodServiceLocator.register('TaskSchema', TaskSchema);
prodServiceLocator.factory('connection', require('./data-access/db-connection'));
prodServiceLocator.factory('modelCreator', require('./data-access/model-creator'));

// Generate Test DB
testServiceLocator.get('dataGenerator').generate();

// Prod Instances
const modelCreator = prodServiceLocator.get('modelCreator');
const taskSchema = prodServiceLocator.get('TaskSchema');
const Task = modelCreator.create('Task', taskSchema);

app.use(bodyParser.urlencoded({ extended: false })) // get our request parameters
	.use(jsonParser);

app.get('/tasks', (req, res) => {
	Task.find((err, tasks) => {
		if(err) {
			return res.sendStatus(400);
		}

		return res.json(tasks);
	});
});

app.listen(port, () => console.log("Listening on port ", port));