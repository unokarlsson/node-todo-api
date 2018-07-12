const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');
// TODO: How to use the cloude mongodb in a smothe way
// mongodb://<dbuser>:<dbpassword>@ds235181.mlab.com:35181/node-todo-api

module.exports = {mongoose};