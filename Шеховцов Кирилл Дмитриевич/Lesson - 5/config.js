const address = '127.0.0.1';
const mongoPort = '27017';
const expressPort = '3000';
const db = 'usersdb';
const mongoUrl = `mongodb://${address}:${mongoPort}/${db}`;

module.exports.mongoUrl = mongoUrl;
module.exports.expressPort = expressPort;
