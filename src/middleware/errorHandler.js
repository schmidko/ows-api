const { GeneralError } = require('../utils/generalError');

const errorHandler = async (err, req, res, next) => {
	if (!err) {
		return;
	}
	if (err instanceof GeneralError) {
		return res.status(err.getCode()).json({
			status: 'error',
			message: err.message,
		});
	} else {
		return res.status(500).json({
			status: 'error',
			message: err.message,
		});
	}
};

module.exports = errorHandler;
