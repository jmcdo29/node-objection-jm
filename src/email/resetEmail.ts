import { User } from '../db/models/user_schema';
import * as pug from 'pug';
import { randomBytes } from 'crypto';
import { createTransport } from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';
import { config } from 'dotenv';

config();

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}

const mailgun = createTransport(mg(auth));

function getBytes(){
  return new Promise( (resolve, reject)=> {
    randomBytes(20, (err, buff)=>{
      if(err){
        reject(err);
      }
      resolve(buff.toString('hex'));
    });
  });
}

function saveRandoString(email: string, random: any){
  return User.query().where({email}).update({
    reset_token: random,
    token_expire: new Date(Date.now() + 900000).toISOString().slice(0, 19).replace('T', ' ')
  });
}

export function sendMail(email: string, host: string){
  Promise.all([
    User.query().select('email').where({email}),
    getBytes()
  ]).then((results)=>{
    const rando = results[1];
    const client = results[0][0];
    const mailOpts = {
      from: {
        name: 'ZeldaPlay',
        address: process.env.MYEMAIL
      },
      to: client.email,
      subject: 'Reset your password',
      template: {
        name: 'views/emailTemp.pug',
        engine: 'pug',
        context: {
          reset: rando,
          host: host === 'localhost' ? host + ':3000' : host
        }
      }
    };
    return Promise.all([
      saveRandoString(client.email, rando),
      mailgun.sendMail(mailOpts)
    ]);
  })
  .then(results => {
    console.log('Updated %s users.', results[0]);
    console.log('Info:', results[1]);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
};