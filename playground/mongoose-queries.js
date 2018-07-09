const {ObjectID}  = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

// USER
// ====
if(!ObjectID.isValid('5b421ffda0e2f32c2740a488')) {
    console.log('ID not valid');
} else {
    console.log('ID valid');   
}

User.findById('5b421ffda0e2f32c2740a488').then((user) => {
    if(!user) {
        return console.log('Id not found');
    }
    console.log('User By Id',user);
}).catch((error) => {
    console.log(error);
});


// TODO
// ====
// const id = '5b42820d89f50e244a484e49';
// // const id = '5b42820d89f50e244a484e4911'; // Illigal format
// // const id = '6b42820d89f50e244a484e49'; // Do not exist (test purpuse)

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos',todos);
// });

// // Prefered if you know you only should have one result
// // You don't get an array and if not found you get a null back
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo',todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id',todo);
// }).catch((error) => {
//     console.log(error);
// });





