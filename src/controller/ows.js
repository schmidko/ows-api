
const {connectDB} = require("../db.js");
const pg = require('pg');
const {Client} = pg;

async function getOwsData(address) {

    address = await findStakeAddress(address);
    
    if (!address) {
        return false;
    }

    try {
        const {db} = await connectDB();
        const collection = db.collection("addresses");
        const queryFind = {"stakeAddress": address};
        const result = await collection.find(queryFind).toArray();
        return result;
    } catch (e) {
        return false;
    }
}

async function findStakeAddress(address) {
    address = address.toLowerCase();

    const config = {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: 'cexplorer',
        port: 5432,
        //ssl: true
    };
    
    if (address.indexOf('stake') === 0) {
        return address;
    }
    if (address.indexOf('addr') === 0) {
        
        try {
            const client = new Client(config);
            await client.connect();
            query = `SELECT DISTINCT stake_address.id as stake_address_id, tx_out.address, stake_address.view as stake_address
	        from stake_address left join tx_out on tx_out.stake_address_id = stake_address.id
	        where address = '${address}';`;
            const res = await client.query(query)
            if (res?.rows[0]?.stake_address) {
                return res.rows[0].stake_address;
            }
        } catch (e) {
            console.log(e);
            return false;
        }

    }

}

module.exports = {
    getOwsData: getOwsData
}