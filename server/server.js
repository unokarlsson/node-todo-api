require('./config/config');

const _ = require('lodash');
const {ObjectID}  = require('mongodb');
const express     = require('express');
const bodyParser  = require('body-parser');

const {mongoose}  = require('./db/mongoose');
const {Todo}      = require('./models/todo');
const {User}      = require('./models/user');

const port =  process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos',(request,respons) => {
    // console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((doc)=>{
        respons.send(doc);
    }).catch((error) => {
        respons.status(400).send(error);
    });
});

app.get('/todos',(request,response) => {
    Todo.find().then((todos)  => {
        response.send({todos}); // Wrapped in an object so that other attributes can be added later
    },(error) => {
        response.status(400).send(error);
    }).catch((error) => {
        responnse.status(500).send(error);
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
        response.status(400).send();
    });
});

app.delete('/todos/:id',(request,response) => {
    const id = request.params.id;

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
       if(!todo) {
           return response.status(404).send();
       }
       response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.patch('/todos/:id',(request,response) =>{
    const id   = request.params.id;
    const body = _.pick(request.body,['text','completed']);

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body},{new:true}).then((todo)=> {
        if(!todo) {
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    })
});

app.post('/users',(request,response) => {
    var body = _.pick(request.body,['email','password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header('x-auth',token).send(user);
    }).catch((error) => {
        response.status(400).send(error);
    })
});


app.listen(port,() => {
    console.log(`Started on ${port}`);
});

module.exports = {app};


