const login_middleware = require('../build/routes/middleware/login-middleware');
const idea_middleware = require('../build/routes/middleware/idea-middleware');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../build/server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('login middleware', function() {

  describe('inValid alreadyLoggedIn', function() {

    before(() => {
      return chai.request(app)
        .post('/users/login')
        .send({email: 'jmcdo29@gmail.com', password: 'K!ngdomHearts1'})
        .then(res => {
          return;
        })
        .catch(err => {
          throw err;
        });
    });

    it('should see if the user is already logged in and not allow progression if so', function() {
      chai.request(app)
        .get('/users/login')
        .then(res => {
          console.log(res);
          expect(res).to.have.status(302);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('valid alreadyLoggedIn', () =>{
    it('should allow the user to go through', function() {
      chai.request(app)
        .get('/users/login')
        .then(res => {
          expect(res).to.have.status(200);
        })
        .catch(err => {
          throw err;
        })
    })
  });

  describe('loggedIn', function() {

  })
  describe('verifyPass', function() {

  })
  describe('compareLast', function() {

  })
});

describe('idea middleware', function() {

  describe('authenticated', function() {
    
  })
})