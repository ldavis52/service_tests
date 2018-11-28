const delay = require('delay');
const request = require("supertest");

const globalSetup = (async () => {
    await request('http://localhost:9200').post('/_all/_close');
    await request('http://localhost:9200').post('/_snapshot/timo_backup2/snapshot-number-four/_restore');
    await delay(6000);
});

module.exports = globalSetup;
