const {ObjectID} = require('mongodb');
const expect  = require('expect');
const request = require('supertest');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');

const todos = [{
    _id : new ObjectID(),
    text: 'First test todo'
},{
    _id : new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

// Clear all todos before each test (it)
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});


describe('POST /todos',() => {
    
    it('Sould create a todo',(done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((respons) => {
                expect(respons.body.text).toBe(text);
            })
            .end((error,respons) => {
                if(error) {
                    return done(error);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            });
    });
    

    it('Should not create todo with invalid body data',(done)=> {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error,respons) => {

                if(error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done();
                }).catch((error) => done(error));
            });
    });
});


describe('GET /todos',() => {
    it('Should get all todos',(done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((respons) => {
                expect(respons.body.todos.length).toBe(2);
            })
            .end(done);
    });
});


describe('GET /todos/:id',() => {
    it('Should return the todo with :id',(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found',(done) => {
        const hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids',(done) => {
        request(app)
            .get('/todos/123abs')
            .expect(404)
            .end(done);
    });
});

describe('DEL /todos/:id',() => {
    it('Should remove a todo',(done) => {
        const hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((result) => {
                expect(result.body.todo._id).toBe(hexId);
            })
            .end((error,result) => {
                if(error) {
                    return done(error);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((error) => done(error));
            });       
    });

    it('Should return 404 if todo not found',(done) => {
        const hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids',(done) => {
        request(app)
            .delete('/todos/123abs')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo' ,(done) => {
        const hexId = todos[0]._id.toHexString();
        const text = 'This is an updated text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((result) => {
                expect(result.body.todo.text).toBe(text);
                expect(result.body.todo.completed).toBe(true);
                expect(result.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('Should clear completeAt when to do is not completed' ,(done) => {
        const hexId = todos[1]._id.toHexString();
        const text = 'This is an updated text ...';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((result) => {
                expect(result.body.todo.text).toBe(text);
                expect(result.body.todo.completed).toBe(false);
                expect(result.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

