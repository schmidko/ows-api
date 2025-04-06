
const {connectDB} = require("../db.js");
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

dotenv.config({path: path.join(__dirname, '../../config/.env')});

const configPG = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: 'cexplorer',
    port: 5432
};

async function getDrepData(addressInput) {
    const stakeAddress = await findStakeAddress(addressInput);

    try {
        const {Client} = pg;
        const client = new Client(configPG);
        await client.connect();
        query = `SELECT drep_hash.view AS drep_view from stake_address
            left join delegation_vote on delegation_vote.addr_id = stake_address.id
            left join drep_hash on drep_hash.id = delegation_vote.drep_hash_id
            where stake_address.view = '${stakeAddress}'
            ORDER BY tx_id
        ;`;

        const res = await client.query(query);

        let returnValue = {"isDelegatedToDrep": false, "drep_id": ""};
        if (res.rows[0]?.drep_view) {
            returnValue = {"isDelegatedToDrep": true, "drep_id": res.rows[0].drep_view};
        }
        return returnValue;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getAllAssets(addressInput) {
    const stakeAddress = await findStakeAddress(addressInput);

    try {
        const {db} = await connectDB();
        const collection1 = db.collection("assets");
        const queryFindAssets = {"stakeAddress": stakeAddress};
        const resultAssets = await collection1.findOne(queryFindAssets);
        const collection2 = db.collection("addresses");
        const queryFindAddresses = {"stakeAddress": stakeAddress};
        const resultAddresses = await collection2.findOne(queryFindAddresses);

        const finalResult = {
            "status": 1, data: {
                balanceAda: resultAddresses.balanceAda,
                balanceLovelace: resultAddresses.balanceLovelace,
                assets: resultAssets?.assets ? resultAssets.assets : []
            }
        };

        return finalResult;
    } catch (e) {
        return {status: 0, message: "Unkown error!"};
    }
}

async function getStakeAddress(addressInput) {
    try {
        return {status: 1, stakeAddress: findStakeAddress(addressInput)};
    } catch (e) {
        return {status: 0, message: "Can't find address!"};
    }
}



async function findStakeAddress(address) {
    address = address.toLowerCase();

    if (address.indexOf('stake') === 0) {
        return address;
    }
    if (address.indexOf('addr') === 0) {
        try {
            const {Client} = pg;
            const client = new Client(configPG);
            await client.connect();

            query = `SELECT DISTINCT stake_address.id AS stake_address_id,
                tx_out.address,
                stake_address.view AS stake_address
                FROM stake_address
                LEFT JOIN tx_out ON tx_out.stake_address_id = stake_address.id
                WHERE left(tx_out.address, 128) = '${address}';`;

            const res = await client.query(query);
            await client.end();
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
    getDrepData: getDrepData,
    getAllAssets: getAllAssets,
    getStakeAddress: getStakeAddress,
}