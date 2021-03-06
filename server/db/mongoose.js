const mongoose = require('mongoose');

// NOTE: The environment variable MONGODB_URI need to be set for production
// Please check the mongourl.txt file.

const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI',MONGODB_URI);

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

module.exports = {mongoose};