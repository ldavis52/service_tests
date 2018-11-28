var utility = function () {
};

const Joi = require('joi');

utility.prototype.schemaValidate = (response, schema) => {
    Joi.validate(response.body,schema,function (err, value) {
        if(err){
            console.log('the error is '+err)
        }
        expect(err).toBe(null);
    });
};

utility.prototype.badTokenJson = () => {
    return {
        "success": false,
        "message": "Authentication failed"
    }
};

utility.prototype.noTokenJson = () => {
    return {
        "success": false,
        "message": "No token provided."
    }
};

utility.prototype.failedTokenJson = () => {
    return {
        "success": false,
        "message": "Failed to authenticate token."
    }
};

utility.prototype.authPost = () => {
    return {
        name: global.uname,
        password: global.pword
    };
}

utility.prototype.authHeader = (token) => {
    return {
        'Authorization': 'Bearer '+token
    };
};

let amsObject = (user, status) => {
    return {
        "ams": {
            "status": status,
            "assigned": user
        }
    };
};

let bulkAssignObject = (tasks, user, status) => {
    return {
        "ids": tasks,
        "body": amsObject(user, status)
    }
}

utility.prototype.updateTask = (user, status) => {
    return amsObject(user, status)
};

utility.prototype.bulkAssignTask = (tasks, user, status) => {
    return bulkAssignObject(tasks, user, status)
}

utility.prototype.expectMulti = (results, expected) => {
    for (let index = 0; index < results.length; index++) {
        expect(results[index]).toEqual(expected[index]);
    };
}

exports.utility = new utility();