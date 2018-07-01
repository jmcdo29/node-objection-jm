require('mocha');
const app = require('../build/server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('This should be a suite for the site.', () => {

  describe('Home page of the app', function() {
    describe('# GET /', function() {
      it('should return a 200 status', function() {
        chai.request(app)
          .get('/')
          .then(res => {
            expect(res).to.have.status(200);
          })
          .catch(err => {
            throw err;
          });
      });
    });
  });

  describe('/users routes', function() {
    describe('# GET /users/login', function (){
      it('should return a 200 status', function() {
        chai.request(app)
          .get('/users/login')
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.text).to.be.a('string');
          })
          .catch(err => {
            throw err;
          });
      });
    });
    describe('POST /users/login', function() {
      it('should throw an error due to no login info', function() {
        chai.request(app)
          .post('/users/login')
          .send({})
          .then(res => {
            //expect(res).to.not.have.status(200);
            expect(res.text).to.be.a('string');
          })
          .catch(err => {
            throw err;
          })
      })
      it('should throw an error for bad info', function() {
        chai.request(app)
          .post('/users/login')
          .send({email: 'jmcdo29@gmail.com', password: 'K!ngdomHearts3'})
          .then(res => {
            //console.log(res);
            expect(res).to.not.have.status(200 || 302);
            expect(res.text).to.be.a('string');
          })
          .catch(err => {
            throw err;
          })
      })
      before(function(){
        chai.request(app)
          .post('/users/login')
          .send({email: 'jmcdo29@gmail.com', password: 'K!ngdomHearts1'})
          .then(res => {
            expect(res).to.have.status(200) || expect(res).to.have.status(304);
            expect(res.text).to.be.a('string');
          })
          .catch(err => {
            throw err;
          });
      });

      it('should log me in with good creds', function() {
        chai.request(app)
          .get('/ideas')
          .then(res => {
            expect(res).to.have.status(200);
          })
          .catch(err => {
            throw err;
          });
      });

      it('should get the page to register a new user', function() {
        chai.request(app)
          .get('/users/signup')
          .then(res => {
            expect(res).to.have.status(200);
          })
          .catch(err => {
            throw err;
          });
      });

      it('should register a new user', function() {
        chai.request(app)
          .post('/users/signup')
          .send({email: 'test@email.com', password: 'P@$$word', confPass: 'P@$$word'})
          .then(res => {
            expect(res).to.have.status(200);
          })
          .catch(err => {
            throw err;
          });
      });

      it('should have an error due to wrong password criteria', function() {
        chai.request(app)
          .post('/user/signup')
          .send({email: 'test@email.com', password: 'password', confPass: 'password'})
          .then(res => {
            expect(res).to.have.status(200);
          })
          .catch(err => {
            throw err;
          });
      })
    })
  });


});
