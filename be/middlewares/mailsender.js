"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMail = async function (email, token) {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'connektda@gmail.com', // generated ethereal user
      pass: 'c0nn3kt_da' // generated ethereal password
    }
  });

  transporter.verify((err,success) =>{
      if(err) console.error(err);
  });


  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Connekt" <connektda@gmail.com', // sender address
    to: `${email}`, // list of receivers
    subject: "Verify Token ✔", // Subject line
    text: `http://localhost:4200/auth/verify/${token}`, // plain text body
    html: `<b>click <a href='http://localhost:4200/auth/verify/${token}'> here </a> to verify your email</b>` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports.resetPassword = async function (email, newPass) {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'connektda@gmail.com', // generated ethereal user
      pass: 'c0nn3kt_da' // generated ethereal password
    }
  });

  transporter.verify((err,success) =>{
      if(err) console.error(err);
  });


  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Connekt" <connektda@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "Password Reset ✔", // Subject line
    text: `You new password id`, // plain text body
    html: `<b>Your new password is ${newPass}. You can use it to login rom now</b>` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}