const {ObjectID}  = require('mongodb');
const express     = require('express');
const bodyParser  = require('body-parser');

const {mongoose}  = require('./db/mongoose');
const {Todo}      = require('./models/todo');
const {User}      = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(request,respons) => {
    // console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((doc)=>{
        respons.send(doc);
    },(error) => {
        respons.status(400).send(error);
    });
});

app.get('/todos',(request,respons) => {
    Todo.find().then((todos)  => {
        respons.send({todos}); // Wrapped in an object so that other attributes can be added later
    },(error) => {
        respons.status(400).send(error);
    });
});

app.get('/todos/:id',(request,response) => {
    // response.send(request.params);
    var id = request.params.id;
    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(404).send();
    });
});

app.listen(3000,() => {
    console.log('Started on 3000');
});

module.exports = {app};


