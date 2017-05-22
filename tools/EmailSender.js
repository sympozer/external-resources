/**
 * Created by pierremarsot on 22/05/2017.
 */
const nodemailer = require('nodemailer');

class EmailSender {
  constructor(){
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreplyatsympozer@gmail.com',
        pass: 'sympozer09876'
      }
    });
  }

  send(to, subject, text, html){
    return new Promise((resolve, reject) => {
      // setup email data with unicode symbols
      let mailOptions = {
        from: 'noreplyatsympozer@gmail.com', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
      };

      // send mail with defined transport object
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }

        console.log(error, info);
        return resolve(info);
      });
    });
  }
}

module.exports = EmailSender;