var schemas = function () {
};

const Joi = require('joi');

schemas.prototype.authSchema = () => {
    return Joi.object().keys({
        success: Joi.boolean().truthy('Y').required(),
        message: Joi.string().required(),
        token_type: Joi.string().required(),
        access_token: Joi.string().required(),
        role: Joi.string().required(),
        id: Joi.string().required(),
        user_data: Joi.array().required(),
        last_login: Joi.string().required(),
        name: Joi.string().required(),
        permissions: Joi.object().required(),
    });
};

schemas.prototype.gupSchema = () => {
    return Joi.array().items(
        Joi.object().keys({
            name: Joi.string().required(),
            id: Joi.string().required()
        })
    );
};

schemas.prototype.singleProgram = () => {
    return Joi.array().items(
        Joi.object().keys({
            id: Joi.string().required(),
            name: Joi.string().required(),
            savings: Joi.string().required(),
            savingsPct: Joi.string().required(),
            reportDate: Joi.string().required(),
            py1Start: Joi.string().required(),
            baseYearStart: Joi.string().required(),
            baseYearEnd: Joi.string().required(),
            qsStart: Joi.string().required(),
            qsEnd: Joi.string().required(),
            baseYearEUI: Joi.string().required(),
            currentEUI: Joi.any().optional(),
            buildings: Joi.array().items(
                Joi.object().keys({
                    id: Joi.string().required(),
                    name: Joi.string().required(),
                    code: Joi.string().required(),
                    primaryUse: Joi.any().optional(),
                    sizeSQFT: Joi.any().optional(),
                    address: Joi.object().keys({
                        street: Joi.string().required(),
                        city: Joi.string().required(),
                        state: Joi.string().required(),
                        zipcode: Joi.string().required(),
                    }),
                    costAvoidance: Joi.any().optional(),
                    costAvoidancePct: Joi.any().optional(),
                    currentEUI: Joi.any().optional(),
                    baseYearEUI: Joi.any().optional(),
                    deltaEUI: Joi.any().optional(),
                    deltaEUImonth: Joi.any().optional(),
                    actualCost: Joi.any().optional(),
                    meters: Joi.array().required()
                })),
            bldgCount: Joi.number().required(),
            meterData: Joi.object().required(),
            commodityCount: Joi.object().required(),
            revenueByDate: Joi.array().required(),
            allMonthsPositive: Joi.number().required(),
            allMonthsNegative: Joi.number().required(),
            meterCount: Joi.number().required(),
            topBottomMeters: Joi.object().required(),

        })
    );
};

schemas.prototype.allPrograms = () => {
    return Joi.array().items(
        Joi.object().keys({
            name: Joi.string().required(),
            id: Joi.string().required()
        })
    );
}

schemas.prototype.singleProPerfData = () => {
    return Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required(),
        children: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                programId: Joi.string().required(),
                type: Joi.string().required(),
                children: Joi.array().required(),
                otherData: Joi.object().required(),
            })
        )
    });
};

schemas.prototype.singleMeter = () => {
    return Joi.array().items(
        Joi.object().keys({
            programId: Joi.string().required(),
            id: Joi.string().required(),
            buildingId: Joi.string().required(),
            place: Joi.string().required(),
            placeCode: Joi.string().required(),
            commodity: Joi.string().required(),
            meterPerformance: Joi.array().items(
                Joi.object().keys({
                    baseStart: Joi.any().optional(),
                    savingStart: Joi.any().optional(),
                    periodStart: Joi.any().optional(),
                    reportDate: Joi.any().optional(),
                    batccUse: Joi.any().optional(),
                    actualUse: Joi.any().optional(),
                    useAvoidance: Joi.any().optional(),
                    batccCost: Joi.any().optional(),
                    unitCost: Joi.any().optional(),
                    actualCost: Joi.any().optional(),
                    costAvoidance: Joi.any().optional(),
                    costAvoidancePct: Joi.any().optional(),
                    unit: Joi.any().optional(),
                    globalUse: Joi.any().optional(),
                    globalUnit: Joi.any().optional(),
                })
            )
        })
    );
}

let taskSchema = () => {
    return Joi.object().keys({
        date: Joi.string().required(),
        programId: Joi.string().required(),
        programName: Joi.string().required(),
        reportDate: Joi.string().required(),
        priority: Joi.string().required(),
        consecutiveOccurences: Joi.number().optional(),
        type: Joi.string().required(),
        subtype: Joi.string().required(),
        meterId: Joi.string().required(),
        commodity: Joi.string().required(),
        bldg: Joi.string().required(),
        bldgCode: Joi.string().required(),
        data: Joi.object().keys({
            dataReportDate: Joi.string().required(),
            costAvoidance: Joi.string().required(),
            costAvoidancePct: Joi.string().required(),
            batccUse: Joi.string().required(),
            actualUse: Joi.string().required(),
            unitCost: Joi.string().required(),
        }),
        comments: Joi.string().required(),
        ams: Joi.object().keys({
            assigned: Joi.any().required(),
            status: Joi.string().required(),
            audit: Joi.array().required(),
            resolution: Joi.any().required(),
            resolutionComments: Joi.any().required(),
            comments: Joi.any().optional(),
        }),
        id: Joi.string().required(),
    });
}

schemas.prototype.taskSchema = () => {
    return Joi.array().items(
        taskSchema()
    );
};

schemas.prototype.singleTaskSchema = () => {
    return taskSchema();
};

schemas.prototype.taskCountSchema = () => {
    return Joi.object().keys({
        count: Joi.number().required(),
    });
};

exports.schemas = new schemas();