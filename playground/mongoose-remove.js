const {ObjectID}  = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

// Todo.remove({}) NOTE: to remove all items you need to specify {}
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove() Returns the removed item
// Todo.findOneAndRemove({_id: '5b471475dddfe45d77f66d46'}).then((todo) => {
//     console.log(todo);
// });

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('5b471475dddfe45d77f66d46').then((todo) => {
    console.log(todo);
});
