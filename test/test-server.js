const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);


// Tests for end point /blog-posts
describe('Blog Posts', function() {

  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the that promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    return runServer();
  });

  // although we only have one test module at the moment, we'll
  // close our server at the end of these tests. Otherwise,
  // if we add another test module that also has a `before` block
  // that starts our server, it will cause an error because the
  // server would still be running from the previous tests.
  after(function() {
    return closeServer();
  });


  //GET
  it('should return a list of blogs posts from a GET req to /blog-posts', function() {
    // for Mocha tests, when we're dealing with asynchronous operations,
    // we must either return a Promise object or else call a `done` callback
    // at the end of the test. The `chai.request(server).get...` call is asynchronous
    // and returns a Promise, so we just return it.
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');

      expect(res.body.length).to.be.at.least(1);

      const expectedKeys = ['title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        expect(item).to.be.a('object');
        expect(item).to.include.keys(expectedKeys);
      });
    });
  });

  //POST
  it('should create a new blogs post with a POST req to /blog-posts', function() {
    const newPost = {
      title: 'new title',
      content: 'new content',
      author: 'new author',
      publishDate: 'new publishDate'
    }
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
      })
  });

  //PUT
  // ASK MICHEAL WHY COMMENTED OUT LINES ARE FAILING
  it('should update an existing blog post with a PUT req to /blog-posts', function() {
    const updatePost = {
      title: 'updated title',
      content: 'updated content',
      author: 'updated author',
      publishDate: 'updated publishDate'
    };
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      updatePost.id = res.body[0].id;
      return chai.request(app)
        .put(`/blog-posts/${updatePost.id}`)
        .send(updatePost);
    })
    .then(function(res) {
      expect(res).to.have.status(204);
      // expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      // expect(res.body).to.deep.equal(updatePost);
    })
  });

  //DELETE
  it('should delete items on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

});














//end place holder
