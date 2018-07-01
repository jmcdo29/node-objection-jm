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
          console.error(err);
        });
    });

    it('should see if the user is already logged in and not allow progression if so', function() {
      chai.request(app)
        .get('/users/login')
        .then(res => {
          //console.log(res);
          expect(res).to.have.status(302);
        })
        .catch(err => {
          console.error(err);
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
          console.error(err);
        })
    })
  });

  describe('loggedIn', function() {

  })
  describe('verifyPass', function() {
    const user = {
      email: 'test@test.com',
      password: 'ThisPa$$willb3g00d',
      confPass: 'ThisPa$$willb3g00d'
    }
    it('should fail for having pass and confPass different', function() {
      chai.request(app)
        .post('/users/signup')
        .send({
          email: 'test@test.com',
          password: 'ThisPa$$willb3g00d',
          confPass: 'ThisIsdiffernt',
          token: '0978sdf098asdf87'
        })
        .then(result => {
          expect(result).to.have.status(302);
        })
        .catch(err => {
          console.error(err);
        })
    })
    it('should have an error for missing capital', function() {
      user.password = user.confPass = 'nocapitals';
      chai.request(app)
        .post('/users/signup')
        .send(user)
        .then(result => {
          expect(result).to.have.status(302);
        })
        .catch(err => {
          console.error(err);
        })
    })
    it('should have an error for missing lowercase', function() {
      user.password = user.confPass = 'ALLCAPITALS';
      chai.request(app)
        .post('/users/signup')
        .send(user)
        .then(result => {
          expect(result).to.have.status(302);
        })
        .catch(err => {
          console.error(err);
        })
    })
    it('should have an error for missing number', function() {
      user.password = user.confPass = 'noCapitalsNoNums';
      chai.request(app)
        .post('/users/signup')
        .send(user)
        .then(result => {
          expect(result).to.have.status(302);
        })
        .catch(err => {
          console.error(err);
        })
    })
    it('should have an error for missing special character', function() {
      user.password = user.confPass = 'YesCapsYesLowYesNumNoSpec';
      chai.request(app)
        .post('/users/signup')
        .send(user)
        .then(result => {
          expect(result).to.have.status(302);
        })
        .catch(err => {
          console.error(err);
        })
    })
    it('should have an error for being too short', function() {
      user.password = user.confPass = 'short';
      chai.request(app)
        .post('/users/signup')
        .send(user)
        .then(result => {
          expect(result).to.be.a('object')
        })
        .catch(err => {
          console.error(err);
        })
    })
    it('should allow me to create the password', function(){
      chai.request(app)
        .post('/users/signup')
        .send(user)
        .then(result => {
          expect(result).to.be.a('object');
        })
        .catch(err => {
          console.error(err);
        })
    })
  })
  describe('compareLast', function() {

  })
});

describe('idea middleware', function() {

  describe('authenticated', function() {
    
  })
})