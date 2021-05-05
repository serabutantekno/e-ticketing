const nodemailer = require('nodemailer')


const sendMail = (email, uniqueString) => {
  console.log(process.env.EMAIL_VERIFICATION_HOST)
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_VERIFICATION_HOST,
    port: process.env.EMAIL_VERIFICATION_PORT,
    auth: {
      user: process.env.EMAIL_VERIFICATION_ADDRESS,
      pass: process.env.EMAIL_VERIFICATION_PASSWORD
    }
  })

  let sender = 'e-Ticketing Admin'
  let mailOptions = {
    from: sender,
    to: email,
    subject: 'Email Verification',
    html: `Press <a href="http://localhost:3000/auth/verify/${uniqueString}"> here </a> to verify your email. Thanks.`
  }

  transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Message sent')
    }
  })
}


module.exports = sendMail
