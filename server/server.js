const express     = require('express');
const bodyParser  = require('body-parser');

const {mongoose}  = require('./db/mongoose');
const {Todo}      = require('./models/todo');
const {User}      = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(request,response) => {
    console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((doc)=>{
        response.send(doc);
    },(error) => {
        response.status(400).send(error);
    });
});

app.get('/todos',(request,response) => {
    
});


app.listen(3000,() => {
    console.log('Started on 3000');
});




