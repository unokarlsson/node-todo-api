const expect  = require('expect');
const request = require('supertest');

const {app}   = require('./../server');
const {Todo}  = require('./../models/todo');

// Clear all todos before each test (it)
beforeEach((done) => {
    Todo.remove({}).then(() => done());
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
                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            });
    });
});