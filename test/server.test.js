'use strict';

const app = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

// 
describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});
// handle error
describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});
// get from API all items
describe('GET /api/notes', function() {

  it('should list default of 10 items in array and an array of objects with id,title and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(item => {
          expect(item).to.include.keys('id', 'title', 'content');
        });

      });
  });

  it('should return correct search results for existing titles', function(){
    const searchTerm = 'lady gaga';
    return chai.request(app)
      .get(`/api/notes?searchTerm=${searchTerm}`)
      .then(function (res) {
        expect(res).to.have.status(200);
        res.body.forEach(item => {
          expect(item.title).to.include(searchTerm);
        });
      });

  });

  it('should return empty string for none existent word in title', function () {
    const searchTerm = 'something that doesnt exist';
    return chai.request(app)
      .get(`/api/notes?searchTerm=${searchTerm}`)
      .then(function (res) {
        expect(res).to.have.status(200);
        res.body.forEach(item => {
          expect(item.title).to.be.a('');
        });
      });

  });

});

describe('GET /api/notes/:id', function () {

  it('should list an item on GET', function () {
    return chai.request(app)
      .get('/api/notes/1002')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.exist;
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
      });
  });

  it('should respond with status 404 for invalid id', function () {
    return chai.request(app)
      .get('/api/notes/5569')
      .then(function (res) {
        expect(res).to.have.status(404);
        expect(res).to.exist;
      });
  });

});

describe('POST new item to /api/notes', function(){

  it('should create and return newItem on POST with location header', function () {
    const testItem = { title: 'New Title from server.test.js', content: 'My new content from server.test.js BLOW!' };
    return chai.request(app)
      .post('/api/notes')
      .send(testItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(testItem, {id: res.body.id}));
        // expect(res.headers.location).to.include(res.body.id);
      });
  });

  it('should return an object with message propert when missing title field', function () {
    const testItem = { title: '' ,content: 'My new content from server.test.js BLOW!' };
    return chai.request(app)
      .post('/api/notes')
      .send(testItem)
      .then(function (res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('message', 'error');
        expect(res.body.message).to.not.equal('Missing title in request body');
      });
  });

});



describe('PUT /api/notes/:id', function () {
  it('should update and return note object', function () {
    const updateItem = { title: 'my new edited title', content: 'edited content'};
    return chai.request(app)
      .put('/api/notes/1005')
      .send(updateItem)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        // expect(res.body).to.deep.equal(updateItem);
      });
  });

  it('should respond with a 404 for invalid id', function () {
    const updateItem = { title: 'my new edited title', content: 'edited content' };
    return chai.request(app)
      .put('/api/notes/doesnotexist')
      .send(updateItem)
      .then(function (res) {
        expect(res).to.have.status(404);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        // expect(res.body).to.deep.equal(updateItem);
        expect(res.body.message).to.equal('Not Found');
      });
  });

});

describe('DELETE /api/notes/:id', function () {
  it('should delete item by id', function () {
    return chai.request(app)
      .delete('/api/notes/1003')
      .then(function (res) {
        expect(res).to.have.status(204);
      });
  });
});


