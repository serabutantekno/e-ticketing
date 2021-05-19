const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_VERIFICATION_HOST,
  port: process.env.EMAIL_VERIFICATION_PORT,
  auth: {
    user: process.env.EMAIL_VERIFICATION_ADDRESS,
    pass: process.env.EMAIL_VERIFICATION_PASSWORD
  }
})

const sendMail = ((transport, email, uniqueString) => {
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
}).bind(this, transport)


module.exports = sendMail
