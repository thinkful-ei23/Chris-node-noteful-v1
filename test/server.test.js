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

  // it('should return empty string for none existent word in title', function () {
  //   const searchTerm = 'something that doesnt exist';
  //   return chai.request(app)
  //     .get(`/api/notes?searchTerm=${searchTerm}`)
  //     .then(function (res) {
  //     });

  // });

});

describe('GET /api/notes', function () {

  it('should list an item on GET', function () {
    return chai.request(app)
      .get('/api/notes/1002')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
      });
  });

});

describe('POST new item to /api/notes', function(){

  it('should add an item on POST', function () {
    const testItem = { title: 'New Title from server.test.js', content: 'My new content from server.test.js BLOW!' };
    return chai.request(app)
      .post('/api/notes')
      .send(testItem)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
      });
  });


});



// describe('POST new item to /api/notes', function () { });



// describe('POST new item to /api/notes', function () { });



// describe('POST new item to /api/notes', function () { });


