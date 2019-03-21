const log4js = require('log4js');
const logger = log4js.getLogger();
const config = {};
config.parsers = {};
config.methods = {};
config.roles = {};
config.regex = {}
config.db = {};
logger.level = process.env.LOG_LVL ? process.env.LOG_LVL : 'debug';
config.logger = logger;


config.db.url = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://127.0.0.1:27017/test';

config.parsers.equals = "=="
config.parsers.inequals = "=in="
config.parsers.notinequals = "=out="
config.parsers.greaterthan = ">="
config.parsers.lessthan = "<="
config.parsers.notequals = "!="
config.parsers.like = "=lk="


config.methods.post = 'post'
config.methods.get = 'get'
config.methods.delete = 'delete'
config.methods.put = 'put'
config.methods.patch = 'patch'


config.country = {}
config.country.baseUrl = "http://services.groupkt.com/country/get/"
config.country.subUrls = {}
config.country.subUrls.all = "all"
config.country.subUrls.iso3code = "iso3code/"
config.roles.admin = "admin"
config.roles.user = "user"

config.regex.email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


config.public_secret = process.env.JWT_PUB_SEC
    ? process.env.JWT_PUB_SEC
    : '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0\n' +
    'FPqri0cb2JZfXJ/DgYSF6vUpwmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/\n' +
    '3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQAB\n' +
    '-----END PUBLIC KEY-----';

config.private_secret = process.env.JWT_PRIV_SEC
    ? process.env.JWT_PRIV_SEC
    : '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6vUp\n' +
    'wmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/3j+skZ6UtW+5u09lHNsj6tQ5\n' +
    '1s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQABAoGAFijko56+qGyN8M0RVyaRAXz++xTqHBLh\n' +
    '3tx4VgMtrQ+WEgCjhoTwo23KMBAuJGSYnRmoBZM3lMfTKevIkAidPExvYCdm5dYq3XToLkkLv5L2\n' +
    'pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX\n' +
    'GukBI4eMZZt4nscy2o12KyYner3VpoeE+Np2q+Z3pvAMd/aNzQ/W9WaI+NRfcxUJrmfPwIGm63il\n' +
    'AkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF\n' +
    'L0NDt4SkosjgGwJAFklyR1uZ/wPJjj611cdBcztlPdqoxssQGnh85BzCj/u3WqBpE2vjvyyvyI5k\n' +
    'X6zk7S0ljKtt2jny2+00VsBerQJBAJGC1Mg5Oydo5NwD6BiROrPxGo2bpTbu/fhrT8ebHkTz2epl\n' +
    'U9VQQSQzY1oZMVX8i1m5WUTLPz2yLJIBQVdXqhMCQBGoiuSoSjafUhV7i1cEGpb88h5NBYZzWXGZ\n' +
    '37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=\n' +
    '-----END RSA PRIVATE KEY-----';

config.userIds = []

config.testuser = "user@example.com"
config.testadmin = "admin@example.com"
config.testpassword = "password"

config.tokenDuration = process.env.TOKEN_DURATION ? process.env.TOKEN_DURATION : 4800;

module.exports = config;

