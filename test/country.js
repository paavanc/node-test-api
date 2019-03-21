const assert = require('assert');
const chai = require('chai');
const randomize = require('randomatic')
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const config = require('../config');
const utiltest = require('../src/utils/test');
chai.use(chaiHttp);
const randomString = randomize('Aa0', 6, {});
//const Stripe = require('mongoose').model('Stripe');
const countryUrl = "/country"

let countries = []

before(function (done) {
    server.on("test_data_loaded", function () {
        done();
    });
});


function makeSuite(name, tests) {
    describe(name, function () {
        beforeEach(function (done) {
            utiltest.testAuth(chai, server, config.testuser, config.testpassword, function (token) {
                utiltest.testGet(chai, server, countryUrl, token, function (res) {
                    countries = res.body

                    done();
                });
            });

        });
        tests();
        afterEach(function (done) {
            countries = []
            done();
        });

    });
}


makeSuite('Countries', function () {


    it('test /country GET', function (done) {
        utiltest.testAuth(chai, server, config.testuser, config.testpassword, function (token) {
            utiltest.testGet(chai, server, countryUrl + "/" + countries[0].alpha3_code, token, function (res) {
                assert.strictEqual(res.body.alpha3_code, countries[0].alpha3_code)
                done();
            });
        });
    });


});
