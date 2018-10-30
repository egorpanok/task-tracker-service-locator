module.exports = (serviceLocator) => {
	const connection = serviceLocator.get('connection');

	return {
		create: (modelName, schema) => {
			return connection.model(modelName, schema);
		}
	};
};