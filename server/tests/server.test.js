const {ObjectID} = require('mongodb');
const expect  = require('expect');
const request = require('supertest');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');
const {User}  = require('./../models/user');
const {users,populateUsers,todos,populateTodos} = require('./seed/seed');


// Clear all todos before each test (it)
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me',() => {
    it('Should return user if authenticated',(done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Shgould return 401 if not authenticated',(done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((response) => {
                expect(response.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((result) => {
                expect(result.headers['x-auth']).toExist();
                expect(result.body._id).toExist();
                expect(result.body.email).toBe(email);
            })
            .end((error) => {
                if(error) {
                    return done(error);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch(error => done(error));
            });
    });

    it('Should return validation errors if request invalid',(done) => {
        var email = 'ee.com';
        var password = '123';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it('Should not create user if email is in use', (done) => {
        var email = users[0].email;
        var password = '123mnb!';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should login user and return auth token',(done) =>{
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((result) => {
                expect(result.headers['x-auth']).toExist();
            })
            .end((error,response) => {
                if(error) {
                    return done(error);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: response.headers['x-auth']
                    });
                    done();
                }).catch(error => done(error));
            });
    });

    it('Should reject invalid login',(done) =>{
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'incorrectpassword'
            })
            .expect(400)
            .expect((result) => {
                expect(result.headers['x-auth']).toNotExist();
            })
            .end((error,response) => {
                if(error) {
                    return done(error);
                }
                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(error => done(error));
            });
    });    
});

describe('DELETE /users/me/token',() => {
    it('Should remove auth token on logout',(done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((error,response) => {
                if(error) {
                    return done(error);
                }
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(error => done(error));
            });
    });
});
