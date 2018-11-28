
let url;
let api;
let authResp;
let allProgramsResp;
let singleProgResp;
let singleProgPerfResp;
let meterPerfResp;
let programId;
let meterId;
let token;
const util = require('./util').utility;
const authPost = util.authPost();
const request = require("supertest");
const schemas = require('./schemas').schemas;

describe('The Backend Service', () => {
    beforeAll(() => {
        if(process.env.__DEV__ === "yes") {
            url = global.local.backendUrl
        } else {
            url = global.UAT.backendUrl
        }
        console.log('backend url = ' + url);
        api = request(url);
    });

    it('will return a token with the correct credentials', async () => {
        authResp = await  api.post(global.authPath)
            .set('Accept','application/json')
            .send(authPost);
        expect(authResp.status).toEqual(200);
        token = authResp.body.access_token;
        util.schemaValidate(authResp, schemas.authSchema());
    });
    // it('will NOT return token with bad credentials', async () => {
    //     let badAuthResp = await  api.post(global.authPath)
    //         .set('Accept','application/json')
    //         .send({
    //             "name": "cmanning@cenergistic.com",
    //             "password": "foobar"
    //         });
    //     util.expectMulti([badAuthResp.status, JSON.stringify(badAuthResp.body)],
    //         [401, JSON.stringify(util.badTokenJson())])
    // });
    // it('will 404 if bad path on POST', async () => {
    //     let badAuthResp = await  api.post('/foobar')
    //         .set(util.authHeader(token));
    //     expect(badAuthResp.status).toEqual(404)
    // });
    // it('will 404 if bad path on GET', async () => {
    //     let badAuthResp = await  api.get('/foobar')
    //         .set(util.authHeader(token));
    //     expect(badAuthResp.status).toEqual(404)
    // });
    // it('will 404 if bad path on PUT', async () => {
    //     let badAuthResp = await  api.put('/foobar')
    //         .set(util.authHeader(token));
    //     expect(badAuthResp.status).toEqual(404)
    // });
    // it('will GET programs by user', async () => {
    //     let gupResp = await api.get(global.progByUserPath)
    //         .set(util.authHeader(token));
    //     expect(gupResp.status).toEqual(200);
    //     util.schemaValidate(gupResp, schemas.gupSchema());
    // });
    // it('will NOT GET programs by user w/o token', async () => {
    //     let badGupResp = await api.get(global.progByUserPath);
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.noTokenJson())])
    // });
    // it('will NOT GET programs by user w/bad token', async () => {
    //     let badGupResp = await api.get(global.progByUserPath)
    //         .set(util.authHeader('foobar'));
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.failedTokenJson())])
    // });
    // it('will GET all programs', async () => {
    //     allProgramsResp = await api.get(global.getAllProgramsPath)
    //         .set(util.authHeader(token));
    //     expect(allProgramsResp.status).toEqual(200);
    //     util.schemaValidate(allProgramsResp, schemas.allPrograms());
    // });
    // it('will NOT GET all programs w/o token', async () => {
    //     let badGupResp = await api.get(global.getAllProgramsPath);
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.noTokenJson())])
    // });
    // it('will NOT GET all programs w/bad token', async () => {
    //     let badGupResp = await api.get(global.getAllProgramsPath)
    //         .set(util.authHeader('foobar'));
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.failedTokenJson())])
    // });
    // it('will GET a single program', async () => {
    //     singleProgResp = await api.get(global.getSingleProgramPath + allProgramsResp.body[0].id)
    //         .set(util.authHeader(token));
    //     programId = allProgramsResp.body[0].id;
    //     expect(singleProgResp.status).toEqual(200);
    //     util.schemaValidate(singleProgResp, schemas.singleProgram());
    // });
    // it('will NOT GET a single program w/o token', async () => {
    //     let badGupResp = await api.get(global.getSingleProgramPath + allProgramsResp.body[0].id);
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.noTokenJson())])
    // });
    // it('will NOT GET a single program w/bad token', async () => {
    //     let badGupResp = await api.get(global.getSingleProgramPath + allProgramsResp.body[0].id)
    //         .set(util.authHeader('foobar'));
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.failedTokenJson())])
    // });
    // it('will GET a single program w/performance data', async () => {
    //     singleProgPerfResp = await api.get(global.getProgramPerfDataPath + programId)
    //         .set(util.authHeader(token));
    //     meterId = singleProgResp.body[0].buildings[0].meters[0].id;
    //     expect(singleProgPerfResp.status).toEqual(200);
    //     util.schemaValidate(singleProgPerfResp, schemas.singleProPerfData());
    // });
    // it('will NOT GET a single program w/performance data w/o token', async () => {
    //     let badGupResp = await api.get(global.getProgramPerfDataPath + programId);
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.noTokenJson())])
    // });
    // it('will NOT GET a single program w/performance data w/bad token', async () => {
    //     let badGupResp = await api.get(global.getProgramPerfDataPath + programId)
    //         .set(util.authHeader('foobar'));
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.failedTokenJson())])
    // });
    // it('will GET meter performance data', async () => {
    //     meterPerfResp = await api.get(global.getMeterPerfPath + meterId + '&pgmId=' + programId)
    //         .set(util.authHeader(token));
    //     expect(meterPerfResp.status).toEqual(200);
    //     util.schemaValidate(meterPerfResp, schemas.singleMeter());
    // });
    // it('will NOT GET meter performance data w/o token', async () => {
    //     let badGupResp = await api.get(global.getMeterPerfPath + meterId + '&pgmId=' + programId);
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.noTokenJson())])
    // });
    // it('will NOT GET meter performance data w/bad token', async () => {
    //     let badGupResp = await api.get(global.getMeterPerfPath + meterId + '&pgmId=' + programId)
    //         .set(util.authHeader('foobar'));
    //     util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
    //         [403, JSON.stringify(util.failedTokenJson())])
    // });
});
