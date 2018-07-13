const mongoose = require('mongoose');

// NOTE: The environment variable MONGOURL need to be set!!!
// Please check the mongourl.txt file.


console.log('MONGOURL',process.env.MONGOURL);

const MONGO_URL = process.env.MONGOURL || 'mongodb://todo:543TODO678-@ds235181.mlab.com:35181/node-todo-api';
console.log('MONGO_URL',MONGO_URL);

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
// TODO: How to use the cloude mongodb in a smothe way
// mongodb://<dbuser>:<dbpassword>@ds235181.mlab.com:35181/node-todo-api

module.exports = {mongoose};