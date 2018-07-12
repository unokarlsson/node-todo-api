const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Create the model 
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLenght: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo',doc);
// },(error) => {
//     console.log('Unable to save todo',error);
// });


// var newTodo = new Todo({
//     text: 'Feed the cat',
//     completed: true,
//     completedAt: 123
// });

// var newTodo = new Todo({
//     text: '   Edit this video  '
// });
// var newTodo = new Todo({
//     text: 'Something to do'
// });


// newTodo.save().then((doc) => {
//     console.log('Saved todo',doc);
// },(error) => {
//     console.log('Unable to save todo',error);
// });


//========= USER ================

// email -require it - trim it- set type - set min length

var User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    }
});

var newUser = new User({
   email: 'uno@unokarlsson.com    '
});

newUser.save().then((doc)=>{
    console.log('Saved user',doc);
},(error) => {
    console.log('Unable to save user!',error);
});
