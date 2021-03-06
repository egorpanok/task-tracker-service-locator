const random = require('./../random');

module.exports = (serviceLocator) => {

	const generateConfig = serviceLocator.get('generateConfig');
	const n = generateConfig.tasks;
	const modelCreator = serviceLocator.get('modelCreator');
	const taskSchema = serviceLocator.get('TaskSchema');
	const TaskModel = modelCreator.create('Task', taskSchema);

	return {
		generate: () => {
			return new Promise((resolve, reject) => {
				let i, task, counter = 0, tasks = [];

				for (i = 0; i < n; i++) {

					task = new TaskModel({
						name: random.getRandomString(20, 40),
						description: random.getRandomString(100, 300),
						completed: random.getRandomInteger(0, 50) > 10
					});

					task.save((err, t) => {
						if (err) {
							return reject(err);
						}

						counter++;
						tasks.push(t);

						if (counter === n) {
							return resolve(tasks);
						}
					});
				}
			});
		}
	};
};