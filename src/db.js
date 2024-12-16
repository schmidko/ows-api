
const { MongoClient, ObjectID } = require('mongodb');
let client;

exports.connectDB = async function connectDB() {
	const user = encodeURIComponent(process.env.MONGO_USER);
	const password = encodeURIComponent(process.env.MONGO_PASSWORD);
	const host = process.env.MONGO_HOST;
	const port = process.env.MONGO_PORT;
	const authMechanism = 'DEFAULT';
	const url = `mongodb://${user}:${password}@${host}:${port}/?authMechanism=${authMechanism}`;

	if (!client) {
		client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
	}
	return {
		db: client.db(process.env.MONGO_DBNAME),
		client,
	};
};

exports.collections = {
	PROJECTS: 'projects',
	PROJECT_USER_MAPPING: 'project_user_mapping',
	EXPERIMENTS: 'experiments',
	USERS: 'users',
	ROLES: 'roles',
	FLOW_BUILDER: 'flow_builder',
	FLOW_CONFIGS: 'published_flows',
	STEP_BUILDER: 'step_builder',
	STEP_TEMPLATES: 'step_templates',
	ACCOUNTS: 'workspaces',
	TRACK_EVENTS: 'track_events',
	TRACK_SESSIONS: 'track_sessions',
};

exports.getObjectId = (id) => new ObjectID(id);

exports.getSortParam = (arr = []) => {
	let sortQuery = {};

	arr.forEach((param) => {
		const isDesc = param.indexOf('-') === 0;
		const key = isDesc ? param.substr(1) : param;
		sortQuery = {
			...sortQuery,
			[key]: isDesc ? -1 : 1,
		};
	});

	return sortQuery;
};
