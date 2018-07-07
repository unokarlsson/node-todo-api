// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db) => {
    if(error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // // Find all todos
    db.collection('Todos').find().toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    },(error) => {
        console.log('Unable to fetch todos',error);
    });

    // Find specific todos
    db.collection('Todos').find({completed:false}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    },(error) => {
        console.log('Unable to fetch todos',error);
    });

    // Find specific todos
    db.collection('Todos').find({
        _id: new ObjectID('5b40c0e0f02eb24ff86b63fc')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    },(error) => {
        console.log('Unable to fetch todos',error);
    });

    // Count Todos
   db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
    },(error) => {
        console.log('Unable to fetch and count todos',error);
    });

     // Count users with name Uno
     db.collection('Users').find({name:'Uno'}).count().then((count) => {
        console.log(`Users with name Uno count: ${count}`);
    },(error) => {
        console.log('Unable to fetch and count users with name Uno',error);
    });

     // <Find the users named  Uno
     db.collection('Users').find({name:'Uno'}).toArray().then((users) => {
        console.log(JSON.stringify(users,undefined,2));
    });

    // db.close();
});