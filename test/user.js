const assert = require('assert');
const chai = require('chai');
const randomize = require('randomatic')
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const config = require('../config');
const utiltest = require('../src/utils/test');
chai.use(chaiHttp);
const User = require('mongoose').model('User');
const userUrl = "/user"
const randomString = randomize('Aa0', 6, {});


let users = []


function makeSuite(name, tests) {
    describe(name, function () {
        beforeEach(function (done) {
            utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
                utiltest.testPost(chai, server, userUrl, {
                    "age": 11,
                    "name": randomString,
                    "email": "one@gmail.com",
                    "role": config.roles.admin
                }, token, function (res) {
                    users.push(res.body)
                    assert.strictEqual(res.body.email, "one@gmail.com")
                    utiltest.testPost(chai, server, userUrl, {
                        "age": 22,
                        "name": randomString,
                        "email": "two@gmail.com",
                        "role": config.roles.user
                    }, token, function (res) {
                        users.push(res.body)
                        assert.strictEqual(res.body.email, "two@gmail.com")
                        utiltest.testAuth(chai, server, users[0].client_id, users[0].exposed_client_secret, function (token) {
                            utiltest.testPost(chai, server, userUrl, {
                                "age": 33,
                                "name": randomString,
                                "email": "three@gmail.com",
                                "role": config.roles.user
                            }, token, function (res) {
                                users.push(res.body)
                                assert.strictEqual(res.body.email, "three@gmail.com")
                                done();
                            });
                        });

                    });
                });


            });
        });
        tests();
        afterEach(function (done) {
            users = []
            User.deleteMany({name: randomString}, function (err) {
                if (err != null) {
                    assert.fail(err)
                }
                done();
            })

        });

    });
}


makeSuite('User', function () {

    it('test fail  /user POST', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testPostFail(chai, server, userUrl, {
                "name": randomString,
                "email": "fail"
            }, token, function (res) {
                done();
            });

        });
    });

    it('test single get /user/{id} GET', function (done) {
        utiltest.testAuth(chai, server, users[0].client_id, users[0].exposed_client_secret, function (token) {
            utiltest.testGet(chai, server, userUrl + "/" + users[0]._id, token, function (res) {
                done();
            });
        });
    });

    it('fail single get /user/{id} GET', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testGetFail(chai, server, userUrl + "/152389", token, function (res) {
                done();
            });
        });
    });


    it('test /user PUT', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testPut(chai, server, userUrl + "/" + users[2]._id, {
                "name": randomString,
                "email": "something@gmail.com",
                "role": config.roles.admin
            }, token, function (res) {
                assert.strictEqual(res.body.email, "something@gmail.com")
                done();
            });
        });

    });


    it('test fail /user PUT', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testPutFail(chai, server, userUrl + "/" + users[0]._id, {
                "email": "anotheremail@gmail.com"
            }, token, function (res) {
                utiltest.testPutFail(chai, server, userUrl + "/" + users[1]._id, {
                    "name": randomString,
                    "email": "one@gmail.com",
                    "role": config.roles.admin
                }, token, function (res) {
                    utiltest.testPutFail(chai, server, userUrl + "/asd", {
                        "name": randomString,
                        "email": "something@gmail.com",
                        "role": config.roles.admin
                    }, token, function (res) {
                        utiltest.testAuth(chai, server, users[2].client_id, users[2].exposed_client_secret, function (token) {
                            utiltest.testPutFail(chai, server, userUrl + "/" + userUrl[0]._id, {
                                "name": randomString,
                                "email": "something@gmail.com",
                                "role": config.roles.admin
                            }, token, function (res) {
                                done();
                            });
                        });


                    });
                });
            });
        });
    });

    it('test fail /user PATCH', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testPatchFail(chai, server, userUrl + "/oweir", {
                "name": randomString,
            }, token, function (res) {
                done();
            });
        });
    });

//Not Working
//Same error as the one above

    it('test /user DELETE', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testDelete(chai, server, userUrl + "/" + users[1]._id, token, function (res) {
                utiltest.testDeleteFail(chai, server, userUrl + "/" + users[1]._id, token, function (res) {
                    utiltest.testDeleteFail(chai, server, userUrl + "/wopqd", token, function (res) {
                        done();
                    });

                });
            });
        });
    });


    it('test fail /user DELETE', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testDelete(chai, server, userUrl + "/" + users[1]._id, token, function (res) {
                done();
            });
        });

    });

    it('test (all) /user GET', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testGet(chai, server, userUrl + "/", token, function (res) {
                assert.strictEqual(5, res.body.docs.length)
                done();
            });
        });
    });


    it('test filter /user GET', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testGet(chai, server, userUrl + "?filter=email==two@gmail.com;_id==" + users[1]._id + "&sort_field=_id&ascending=true", token, function (res) {
                assert.strictEqual("two@gmail.com", res.body.docs[0].email)
                done();
            });
        });
    });


    it('test /user PATCH', function (done) {
        utiltest.testAuth(chai, server, config.testadmin, config.testpassword, function (token) {
            utiltest.testPatch(chai, server, userUrl + "/" + users[0]._id, {
                "name": "testing"
            }, token, function (res) {
                assert.strictEqual("testing", res.body.name)
                utiltest.testPatch(chai, server, userUrl + "/" + users[0]._id, {
                    "resetCredentials": true
                }, token, function (res) {
                    assert.strictEqual(users[0].client_id==res.body.client_id, false)
                    done()

                });

            });
        });
    });


});

