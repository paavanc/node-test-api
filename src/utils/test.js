const util = require('./index')
const assert = require('assert');
const config = require('../../config');
const User = require('mongoose').model('User');

function loadTestData(next) {

    util.genHash(config.testpassword, function (hash) {

        let users = [

            {
                "email": config.testadmin + "@test.com",
                "client_id": config.testadmin,
                "client_secret": hash,
                "age": 23,
                "role": config.roles.admin,
                "isLive": true

            },
            {
                "email": config.testuser + "@test.com",
                "client_id": config.testuser,
                "client_secret": hash,
                "age": 23,
                "role": config.roles.user,
                "isLive": true

            },

        ]
        User.collection.insertMany(users, function (err, docs) {
            if (err) {
                config.logger.error(err)
                process.exit(1);
            }

            config.userIds.push(docs.ops[0]._id)
            config.userIds.push(docs.ops[1]._id)
            config.logger.debug("loaded data")
            next()
        });

    });

}

module.exports.loadTestData = loadTestData


function testPost(chai, server, url, data, token, next) {
    console.log(url)
    console.log(data)
    console.log(token)
    chai.request(server)
        .post(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .send(data)
        .end(function (err, res) {
            res.should.have.status(200);
            next(res)
        });
}

module.exports.testPost = testPost

function testPostFail(chai, server, url, data, token, next) {
    chai.request(server)
        .post(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .send(data)
        .end(function (err, res) {
            assert.strictEqual(res.status >= 400, true)
            next(res)
        });
}

module.exports.testPostFail = testPostFail

function testPut(chai, server, url, data, token, next) {
    chai.request(server)
        .put(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .send(data)
        .end(function (err, res) {
            res.should.have.status(200);
            next(res)
        });
}

module.exports.testPut = testPut

function testPutFail(chai, server, url, data, token, next) {
    chai.request(server)
        .put(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .send(data)
        .end(function (err, res) {
            assert.strictEqual(res.status >= 400, true)
            next(res)
        });
}

module.exports.testPutFail = testPutFail

function testPatch(chai, server, url, data, token, next) {
    chai.request(server)
        .patch(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .send(data)
        .end(function (err, res) {
            res.should.have.status(200);
            next(res)
        });
}

module.exports.testPatch = testPatch

function testPatchFail(chai, server, url, data, token, next) {
    chai.request(server)
        .patch(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .send(data)
        .end(function (err, res) {
            assert.strictEqual(res.status >= 400, true)
            next(res)
        });
}

module.exports.testPatchFail = testPatchFail

function testGet(chai, server, url, token, next) {
    chai.request(server)
        .get(url)
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .end(function (err, res) {
            res.should.have.status(200);
            next(res)
        });
}

module.exports.testGet = testGet

function testDelete(chai, server, url, token, next) {
    chai.request(server)
        .delete(url)
        .set("Authorization", token)
        .end(function (err, res) {
            res.should.have.status(204);
            next(res)
        });
}

module.exports.testDelete = testDelete

function testDeleteFail(chai, server, url, token, next) {
    chai.request(server)
        .delete(url)
        .set("Authorization", token)
        .end(function (err, res) {
            assert.strictEqual(res.status >= 400, true)
            next(res)
        });
}

module.exports.testDeleteFail = testDeleteFail

function testGetFail(chai, server, url, token, next) {
    chai.request(server)
        .get(url)
        .set("Authorization", token)
        .end(function (err, res) {
            assert.strictEqual(res.status >= 400, true)
            next(res)
        });
}

module.exports.testGetFail = testGetFail

function testAuth(chai, server, client_id, client_secret, next) {
    chai.request(server)
        .post('/login?grant_type=client_id')
        .set("Authorization", "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64"))
        .end(function (err, res) {
            res.should.have.status(200);
            next(res.body.type + " " + res.body.access_token)
        });
}

module.exports.testAuth = testAuth

function testAuthFail(chai, server, client_id, client_secret) {
    chai.request(server)
        .post('/login?grant_type=client_id')
        .set("Authorization", "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64"))
        .end(function (err, res) {
            assert.strictEqual(res.status >= 400, true)
        });
}

module.exports.testAuthFail = testAuthFail
