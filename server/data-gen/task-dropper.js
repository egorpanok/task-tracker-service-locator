module.exports = (serviceLocator) => {

	const modelCreator = serviceLocator.get('modelCreator');
	const taskSchema = serviceLocator.get('TaskSchema');
	const TaskModel = modelCreator.create('Task', taskSchema);

	return {
		drop: () => {
			return new Promise((resolve, reject) => {
				TaskModel.deleteMany((err, res) => {
					if(err) {
						return reject(err);
					}

					return resolve(res);
				});
			});
		}
	};
};