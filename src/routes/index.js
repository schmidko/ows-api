
const express = require('express');
const router = express.Router();
const {getOwsData} = require("../controller/ows.js");

router.get('/ping', async (req, res) => {
		res.json({"message":"pong"});
	}
);

router.get('/ows', async (req, res, next) => {
	
	let output = {status: 0};
	if (req.query.address) {
		const result = await getOwsData(req.query.address);
		//console.log('dd', result);
		
		if (result) {
			output = {"status": 1, "data": result[0]};
		} else {
			output['message'] = "No result from database!";
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
