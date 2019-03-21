const config = require('../../config');
const axios = require('axios');
const queryUtils = require('./query')
const bcrypt = require('bcryptjs');


function genHash(password, next) {
    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) {
            return next(null, saltError);
        }

        return bcrypt.hash(password, salt, (hashError, hash) => {
            if (hashError) {
                return next(null, hashError);
            }

            return next(hash, null);
        });
    });
}

module.exports.genHash = genHash


function genRest(operation, url, headers, data, res, next) {
    config.logger.debug(url)
    axios({
        method: operation,
        url: url,
        data: data,
        headers: headers
    }).then(function (response) {
        next(response.data)
    })
        .catch(function (error) {
            config.logger.debug(error)
            return res.status(400).json({"message": "unable to make " + operation + " request to " + url})
        });
}

module.exports.genRest = genRest


function validateDict(dict, validator, next) {
    next(validator.validate(dict))
}

module.exports.validateDict = validateDict


function valiationErrConstructor(err) {

    let errors = {}
    for (let k in err) {
        errors[err[k].path] = err[k].message
    }
    return errors
}

module.exports.valiationErrConstructor = valiationErrConstructor


function saveDocument(req, res, model, next) {
    let model_instance = new model(req.body);
    model_instance
        .save()
        .then(model_instance => {
            next(model_instance)
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json(err);
        });


}

module.exports.saveDocument = saveDocument


function paginateHelper(query, options, res, model, next) {
    model.paginate(query, options, function (err, result) {
        if (err) {
            return res.status(400).json({message: "fail to get records from db: " + model.modelName})
        }
        next(result)
    });
}


function updateDocumentById(req, res, model, next) {
    let options = configureOptions(req)

    findRecord(options, res, model, function (record) {
        let modelReq = new model(req.body);
        modelReq._id = record._id;
        patch(modelReq, record);
        updateDocument(options, modelReq, res, model, function (result) {
            next(result)
        });
    });
}

function patchDocumentById(req, res, model, validator, next) {
    let options = configureOptions(req)
    findRecord(options, res, model, function (record) {
        let modelReq = new model(req.body);
        modelReq._id = record._id;
        patch(modelReq, record);
        validateDict(modelReq.toObject(), validator, function (err) {
            if (err != null && err.length > 0) {
                return res.status(400).json(valiationErrConstructor(err))
            }
            updateDocument(options, modelReq, res, model, function (result) {
                next(result)
            });
        });
    });

}

module.exports.patchDocumentById = patchDocumentById


module.exports.updateDocumentById = updateDocumentById

function updateDocument(options, doc, res, model, next) {
    model
        .bulkWrite([
            {
                updateOne: {
                    filter: options,
                    update: doc.toObject()
                }
            }
        ])
        .then(res => {
            findRecord(options, res, model, function (response) {
                next(response);
            });
        })
        .catch(err => {
            return res.status(400).json({message: "fail to update record in db: " + model.modelName});
        });
};


function getAllDocuments(req, res, model, next) {

    let query = {}
    let sortField = req.query.sort_field && typeof req.query.sort_field == "string" ? req.query.sort_field : "_id"
    let sortDict = {}
    sortDict[sortField] = req.query.ascending ? 1 : -1
    let options = {
        page: req.query.page && !isNaN(req.query.page) && req.query.page > 0 ? Number(req.query.page) : 1,
        limit: req.query.limit && !isNaN(req.query.limit) && req.query.limit > 0 && req.query.limit < 101 ? Number(req.query.limit) : 20,
        sort: sortDict

    }
    queryUtils.manageQueryHelper(req, res, query, function (result) {
        paginateHelper(result, options, res, model, function (page) {
            next(page)
        });
    });

}

module.exports.getAllDocuments = getAllDocuments


function patch(reqDoc, dbDoc) {
    for (let key in reqDoc.schema.paths) {
        if (!checkNull(reqDoc[key]) && Array.isArray(reqDoc[key])) {
            reqDoc[key] = reqDoc[key].length > 0 ? reqDoc[key] : dbDoc[key];
        } else {
            reqDoc[key] = !checkNull(reqDoc[key]) ? reqDoc[key] : dbDoc[key];
        }
    }
};

module.exports.patch = patch


function checkNull(item) {
    if (item == null || item === undefined) {
        return true
    }
    return false

}

module.exports.checkNull = checkNull


function configureOptions(req) {
    return {_id: req.params.id}
}

module.exports.configureOptions = configureOptions


function findRecord(options, res, model, next) {
    model.findOne(options, function (err, record) {
        if (err) {
            return res.status(400).json({message: "failed to get record from db: " + model.modelName});
        }
        if (!record) {
            return res.status(404).json({message: "record doesn't exist in db: " + model.modelName});
        }
        next(record)
    });
};

module.exports.findRecord = findRecord

function deleteRecordById(req, res, model) {
    findRecord(configureOptions(req), res, model, function (result) {
        model.deleteOne({_id: result._id}, function (err, record) {
            if (err) {
                return res.status(400).json({message: "failed to delete record from db: " + model.modelName});
            } else if (!record) {
                return res.status(404).json({message: "record doesn't exist in db: " + model.modelName});
            } else {
                return res.status(204).json({message: 'record successfully deleted from db: ' + model.modelName});
            }
        });
    });

};

module.exports.deleteRecordById = deleteRecordById