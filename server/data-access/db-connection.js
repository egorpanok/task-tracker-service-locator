const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

module.exports = (serviceLocator) => {
	const dbUrl = serviceLocator.get('dbUrl');

	return mongoose.createConnection(dbUrl, {
		useNewUrlParser: true
	});
};
