require('./config/config');

const _ = require('lodash');
const {ObjectID}      = require('mongodb');
const express         = require('express');
const bodyParser      = require('body-parser');

const {mongoose}      = require('./db/mongoose');
const {Todo}          = require('./models/todo');
const {User}          = require('./models/user');
const {authenticate}  = require('./middelware/authenticate');


const port =  process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos',authenticate,(request,respons) => {
    // console.log(request.body);
    var todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });
    todo.save().then((doc)=>{
        respons.send(doc);
    }).catch((error) => {
        respons.status(400).send(error);
    });
});

app.get('/todos',authenticate,(request,response) => {
    Todo.find({
        _creator: request.user._id
    }).then((todos)  => {
        response.send({todos}); // Wrapped in an object so that other attributes can be added later
    },(error) => {
        response.status(400).send(error);
    }).catch((error) => {
        responnse.status(500).send(error);
    });
});

app.get('/todos/:id',authenticate, (request,response) => {
    // response.send(request.params);
    var id = request.params.id;

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: request.user._id
    }).then((todo) => {
        if(!todo) {
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id',authenticate,(request,response) => {
    const id = request.params.id;

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: request.user._id
    }).then((todo) => {
       if(!todo) {
           return response.status(404).send();
       }
       response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.patch('/todos/:id',authenticate,(request,response) =>{
    const id   = request.params.id;
    let body = _.pick(request.body,['text','completed']);

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    }
   
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: request.user._id
    }, {$set: body},{new:true}).then((todo)=> {
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


app.get('/users/me',authenticate,(request,response) => {
    response.send(request.user);
});

app.post('/users/login',(request,response) => {
    var body = _.pick(request.body,['email','password']);
    
    User.findByCredentials(body.email,body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            response.header('x-auth',token).send(user);
        });
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/users/me/token',authenticate,(request,response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    },() => {
        response.status(400).send();
    });
});

app.listen(port,() => {
    console.log(`Started on ${port}`);
});

module.exports = {app};


