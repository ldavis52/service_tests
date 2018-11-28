let token;
let api;
let esUser;
let mvUser;
let enUser
let beUrl;
let amsUrl;
let esUrl;
let authResp;
let unTaskCountResp;
let unTasksResp;
let assignTaskResp;
let assignEnTaskResp;
let assigneMvTaskResp;
let completeESTaskResp;
let assignedTaskResp;
let bulkAssign;
let tasks = [];
let updateESTask;
let updateESTaskComplete;
let updateENTask;
let updateMVTask
const util = require('./util').utility;
const schemas = require('./schemas').schemas;
const request = require("supertest");
const authPost = util.authPost();
const esStatus = "es_assigned";
const esComplete = "es_completed"
const enStatus = "en_assigned";
const mvStatus = "mv_assigned"
const auditTypeES = "Assigned to Energy Specialist";
const auditTypeESComplete = "Completed by Energy Specialist"
const auditTypesEn = "Assigned in Engineering";
const auditTypesMv = "Assigned in M&V"

describe('The AMS service', () => {
    beforeAll(() => {
        if(process.env.__DEV__ === "yes") {
            amsUrl = global.local.amsUrl
            beUrl = global.local.backendUrl
            esUrl = global.local.elasticSearchUrl
            esUser = global.local.esUser
            enUser = global.local.enUser
            mvUser = global.local.mvUser
        } else {
            amsUrl = global.UAT.amsUrl
            beUrl = global.UAT.backendUrl
            esUrl = global.UAT.elasticSearchUrl
        }
        api = request(amsUrl);
        updateESTask = util.updateTask(esUser, esStatus);
        updateESTaskComplete = util.updateTask(esUser, esComplete)
        updateENTask = util.updateTask(enUser, enStatus);
        updateMVTask = util.updateTask(mvUser, mvStatus);
    });
    it('will return a token with the correct json', async () => {
        authResp = await  request(beUrl).post(global.authPath)
            .set('Accept','application/json')
            .send(authPost);
        expect(authResp.status).toEqual(200);
        token = authResp.body.access_token;
    });
    it('can GET the unassigned task count', async () => {
        unTaskCountResp = await  api.get(global.getTaskCountPath)
            .set(util.authHeader(token));
        expect(unTaskCountResp.status).toEqual(200);
        util.schemaValidate(unTaskCountResp, schemas.taskCountSchema());
    });
    it('will NOT GET the unassigned task count w/o token', async () => {
        let badGupResp = await api.get(global.getTaskCountPath);
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.noTokenJson())])
    });
    it('will NOT GET the unassigned task count w/bad token', async () => {
        let badGupResp = await api.get(global.getTaskCountPath)
            .set(util.authHeader('foobar'));
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.failedTokenJson())])
    });
    it('can GET the unassigned tasks', async () => {
        unTasksResp = await api.get(global.getUnTasksPath)
            .set(util.authHeader(token));
        expect(unTasksResp.status).toEqual(200);
        for (let index = 0; index < unTasksResp.body.length; index++) {
            tasks.push(unTasksResp.body[index].id);
        };
        util.schemaValidate(unTasksResp, schemas.taskSchema());
    });
    it('will NOT GET the unassigned tasks w/o token', async () => {
        let badGupResp = await api.get(global.getUnTasksPath);
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.noTokenJson())])
    });
    it('will NOT GET the unassigned tasks w/bad token', async () => {
        let badGupResp = await api.get(global.getUnTasksPath)
            .set(util.authHeader('foobar'));
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.failedTokenJson())])
    });
    it('retrieves the expected number of unassigned tasks', async () => {
        expect(unTaskCountResp.body.count).toEqual(unTasksResp.body.length);
    });
    it('can PUT an update to assign a task to es user', async () => {
        assignTaskResp = await api.put(global.getUnTasksPath + tasks[0])
            .set(util.authHeader(token))
            .send(util.updateTask(esUser, esStatus));
        expect(assignTaskResp.status).toEqual(200);
        util.schemaValidate(assignTaskResp, schemas.singleTaskSchema());
    });
    it('returns the correct values after assigning a task to es user', async () => {
        let ams = assignTaskResp.body.ams;
        util.expectMulti([ams.assigned, ams.status, ams.audit[1].type,
                ams.audit[1].updates.ams.assigned, ams.audit[1].updates.ams.status,
            assignTaskResp.id, ams.audit[1].userId],
            [updateESTask.ams.assigned, updateESTask.ams.status, auditTypeES, esUser, esStatus,
            tasks[0].id, global.uname]);
    });
    it('will NOT PUT an update to assign a task to es user w/o token', async () => {
        let badGupResp = await api.get(global.getUnTasksPath + tasks[0])
            .send(util.updateTask(esUser, esStatus));
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.noTokenJson())])
    });
    it('will NOT PUT an update to assign a task to es user w/bad token', async () => {
        let badGupResp = await api.get(global.getUnTasksPath + tasks[0])
            .set(util.authHeader('foobar'))
            .send(util.updateTask(esUser, esStatus));
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.failedTokenJson())])
    });
    it('can GET assigned tasks', async () => {
        assignedTaskResp = await api.get(global.getAssignedTasksPath + esUser)
            .set(util.authHeader(token))
        expect(assignedTaskResp.status).toEqual(200);
        util.schemaValidate(assignedTaskResp, schemas.taskSchema());
    });
    it('will NOT GET assigned tasks w/o token', async () => {
        let badGupResp = await api.get(global.getAssignedTasksPath + esUser)
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.noTokenJson())])
    });
    it('will NOT GET assigned tasks w/bad token', async () => {
        let badGupResp = await api.get(global.getAssignedTasksPath + esUser)
            .set(util.authHeader('foobar'))
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.failedTokenJson())])
    });
    it('returns the expected number of assigned tasks after assigning one', async () => {
        expect(assignedTaskResp.body.length).toEqual(1)
    });
    it('returns the correct values after retrieving tasks assigned to es user', async () => {
        let ams = assignedTaskResp.body[0].ams;
        util.expectMulti([ams.assigned, ams.status, ams.audit[1].type,
                ams.audit[1].updates.ams.assigned, ams.audit[1].updates.ams.status],
            [updateESTask.ams.assigned, updateESTask.ams.status, auditTypeES, esUser, esStatus]);
    });
    it('can bulk PUT updates to assign multiple tasks', async () => {
        bulkAssign = await api.put(global.getUnTasksPath)
            .set(util.authHeader(token))
            .send(util.bulkAssignTask([tasks[1],tasks[2]],esUser, esStatus));
        expect(bulkAssign.status).toEqual(200);
        util.schemaValidate(bulkAssign, schemas.taskSchema());
    });
    it('will NOT bulk PUT updates to assign multiple tasks w/o token', async () => {
        let badGupResp = await api.get(global.getAssignedTasksPath + esUser)
            .send(util.bulkAssignTask(tasks,esUser, esStatus));
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.noTokenJson())])
    });
    it('will NOT bulk PUT updates to assign multiple tasks w/bad token', async () => {
        let badGupResp = await api.get(global.getAssignedTasksPath + esUser)
            .set(util.authHeader('foobar'))
            .send(util.bulkAssignTask(tasks,esUser, esStatus));
        util.expectMulti([badGupResp.status, JSON.stringify(badGupResp.body)],
            [403, JSON.stringify(util.failedTokenJson())])
    });
    it('returns the expected number of assigned tasks after assigning more tasks', async () => {
        let multiTaskCheck = await api.get(global.getAssignedTasksPath + esUser)
            .set(util.authHeader(token))
        expect(multiTaskCheck.status).toEqual(200);
        expect(multiTaskCheck.body.length).toEqual(3);
    });
    it('returns the expected number of assigned tasks after assigning multipile tasks', async () => {
        expect(bulkAssign.body.length).toEqual(2);
    });
    it('returns the correct values after retrieving tasks assigned to es user', async () => {
        let ams1 = bulkAssign.body[0].ams;
        let ams2 = bulkAssign.body[1].ams;
        util.expectMulti([ams1.assigned, ams1.status, ams1.audit[1].type,
                ams1.audit[1].updates.ams.assigned, ams1.audit[1].updates.ams.status,
                ams2.assigned, ams2.status, ams2.audit[1].type,
                ams2.audit[1].updates.ams.assigned, ams2.audit[1].updates.ams.status],
            [updateESTask.ams.assigned, updateESTask.ams.status, auditTypeES, esUser, esStatus,
                updateESTask.ams.assigned, updateESTask.ams.status, auditTypeES, esUser, esStatus]);
    });
    it('can PUT an update to assign a task to en user', async () => {
        assignEnTaskResp = await api.put(global.getUnTasksPath + tasks[3])
            .set(util.authHeader(token))
            .send(util.updateTask(enUser, enStatus));
        expect(assignEnTaskResp.status).toEqual(200);
        util.schemaValidate(assignEnTaskResp, schemas.singleTaskSchema());
    });
    it('returns the correct values after assigning a task to en user', async () => {
        let ams = assignEnTaskResp.body.ams;
        util.expectMulti([ams.assigned, ams.status, ams.audit[1].type,
                ams.audit[1].updates.ams.assigned, ams.audit[1].updates.ams.status],
            [updateENTask.ams.assigned, updateENTask.ams.status, auditTypesEn, enUser, enStatus]);
    });
    it('can PUT an update to assign a task to mv user', async () => {
        assigneMvTaskResp = await api.put(global.getUnTasksPath + tasks[4])
            .set(util.authHeader(token))
            .send(util.updateTask(mvUser, mvStatus));
        expect(assigneMvTaskResp.status).toEqual(200);
        util.schemaValidate(assigneMvTaskResp, schemas.singleTaskSchema());
    });
    it('returns the correct values after assigning a task to mv user', async () => {
        let ams = assigneMvTaskResp.body.ams;
        util.expectMulti([ams.assigned, ams.status, ams.audit[1].type,
                ams.audit[1].updates.ams.assigned, ams.audit[1].updates.ams.status],
            [updateMVTask.ams.assigned, updateMVTask.ams.status, auditTypesMv, mvUser, mvStatus]);
    });
    it('can PUT an update to complete a task as es user', async () => {
        completeESTaskResp = await api.put(global.getUnTasksPath + tasks[0])
            .set(util.authHeader(token))
            .send(util.updateTask(esUser, esComplete));
        expect(assigneMvTaskResp.status).toEqual(200);
        util.schemaValidate(assigneMvTaskResp, schemas.singleTaskSchema());
    });
    it('returns the correct values after completing a task to es user', async () => {
        let ams = completeESTaskResp.body.ams;
        util.expectMulti([ams.assigned, ams.status, ams.audit[2].type,
                ams.audit[2].updates.ams.assigned, ams.audit[2].updates.ams.status],
            [updateESTaskComplete.ams.assigned, updateESTaskComplete.ams.status, auditTypeESComplete, esUser, esComplete]);
    });
});
