const config = require('../../config');
const rsqlParser = require('node-rsql-parser')

function manageQueryHelper(req, res, query, next) {
    if (req.query.filter != null && typeof req.query.filter == "string" && rsqlParser.valid(req.query.filter)) {
        query['$and'] = []
        let counter = 0
        let data = req.query.filter.split(";")
        for (let k in data) {
            if (data[k].includes(config.parsers.inequals)) {
                counter = counter + 1
                let nvDict = rsqlParser.tokenizeOperator(data[k], config.parsers.inequals)
                let subDict = {}
                let subArr = []
                let addDict = {}
                subDict["$in"] = subArr
                if (!checkNull(nvDict.value) && Array.isArray(nvDict.value) && nvDict.value.length > 0 && !checkNull(nvDict.value[0])) {
                    let valArr = nvDict.value[0].split(",")
                    addDict[nvDict.key] = subDict
                    for (let j in valArr) {
                        if (!isNaN(valArr[j])) {
                            valArr[j] = Number(valArr[j])
                        }

                        addDict[nvDict.key]["$in"].push(valArr[j])
                        query['$and'].push(addDict)
                    }
                }
            }
            if (data[k].includes(config.parsers.notinequals)) {
                counter = counter + 1
                let nvDict = rsqlParser.tokenizeOperator(data[k], config.parsers.notinequals)
                let subDict = {}
                let subArr = []
                let addDict = {}
                subDict["$nin"] = subArr
                if (!checkNull(nvDict.value) && Array.isArray(nvDict.value) && nvDict.value.length > 0 && !checkNull(nvDict.value[0])) {
                    let valArr = nvDict.value[0].split(",")
                    addDict[nvDict.key] = subDict
                    for (let j in valArr) {
                        if (!isNaN(valArr[j])) {
                            valArr[j] = Number(valArr[j])
                        }
                        addDict[nvDict.key]["$nin"].push(valArr[j])
                        query['$and'].push(addDict)

                    }
                }
            }
            if (data[k].includes(config.parsers.equals)) {
                counter = counter + 1
                let nvDict = rsqlParser.tokenizeOperator(data[k], config.parsers.equals)
                let subDict = {}
                let addDict = {}
                if (!checkNull(nvDict.value)) {

                    if (!isNaN(nvDict.value)) {
                        nvDict.value = Number(nvDict.value)
                    }

                    subDict["$eq"] = nvDict.value

                    addDict[nvDict.key] = subDict
                    query['$and'].push(addDict)

                }
            }
            if (data[k].includes(config.parsers.like)) {
                counter = counter + 1
                let nvDict = customTokenizer(config.parsers.like, data[k])
                let subDict = {}
                let addDict = {}
                if (!checkNull(nvDict.value)) {

                    if (!isNaN(nvDict.value)) {
                        nvDict.value = Number(nvDict.value)
                    }

                    subDict["$regex"] = '' + nvDict.value + '.*'

                    addDict[nvDict.key] = subDict
                    query['$and'].push(addDict)

                }
            }
            if (data[k].includes(config.parsers.notequals)) {
                counter = counter + 1
                let nvDict = rsqlParser.tokenizeOperator(data[k], config.parsers.notequals)
                let subDict = {}
                let addDict = {}
                if (!checkNull(nvDict.value)) {
                    if (!isNaN(nvDict.value)) {
                        nvDict.value = Number(nvDict.value)
                    }

                    subDict["$ne"] = nvDict.value

                    addDict[nvDict.key] = subDict
                    query['$and'].push(addDict)

                }
            }
            if (data[k].includes(config.parsers.greaterthan)) {
                counter = counter + 1
                let nvDict = rsqlParser.tokenizeOperator(data[k], config.parsers.greaterthan)
                let subDict = {}
                let addDict = {}
                if (!checkNull(nvDict.value)) {
                    if (!isNaN(nvDict.value)) {
                        nvDict.value = Number(nvDict.value)
                    }

                    subDict["$gte"] = nvDict.value

                    addDict[nvDict.key] = subDict
                    query['$and'].push(addDict)

                }
            }
            if (data[k].includes(config.parsers.lessthan)) {
                counter = counter + 1
                let nvDict = rsqlParser.tokenizeOperator(data[k], config.parsers.lessthan)
                let subDict = {}
                let addDict = {}
                if (!checkNull(nvDict.value)) {
                    if (!isNaN(nvDict.value)) {
                        nvDict.value = Number(nvDict.value)
                    }

                    subDict["$lte"] = nvDict.value

                    addDict[nvDict.key] = subDict
                    query['$and'].push(addDict)

                }
            }

        }

        if (counter == 0) {
            query = {}
        }


    }
    next(query)
}

module.exports.manageQueryHelper = manageQueryHelper


function customTokenizer(parser, str) {
    let strArr = str.split(parser)
    return {key: strArr[0], value: strArr[1]}
}

function checkNull(item) {
    if (item == null || item === undefined) {
        return true
    }
    return false

}


