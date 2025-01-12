
const express = require('express');
const router = express.Router();
const {getDrepData, getAllAssets} = require("../controller/ows.js");

router.get('/ping', async (req, res) => {
		res.json({"message":"pong"});
	}
);

router.get('/isDelegatedToDrep', async (req, res, next) => {
	
	let output = {status: 0};
	if (req.query.address) {
		const result = await getDrepData(req.query.address);
		
		if (result) {
			output = {"status": 1, "data": result};
		} else {
			output['message'] = "No result from database!";
		}
	} else {
		output['message'] = "No address found!";
	}
	
	return res.json(output);
});

router.get('/allAssets', async (req, res, next) => {
	
	let output = {status: 0};
	if (req.query.address) {
		const result = await getAllAssets(req.query.address);
		
		if (result?.assets) {
			output = {"status": 1, "data": result.assets};
		} else {
			output['message'] = {"status": 1, "data": []};
		}
	} else {
		output['message'] = "No address found!";
	}
	
	return res.json(output);
});

router.get('/', (req, res) => {
	throw new Error('Route not found!');
})
  


module.exports = router;
