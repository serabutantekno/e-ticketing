const nodemailer = require('nodemailer')

/** instance of nodemailer */
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_VERIFICATION_HOST,
  port: process.env.EMAIL_VERIFICATION_PORT,
  auth: {
    user: process.env.EMAIL_VERIFICATION_ADDRESS,
    pass: process.env.EMAIL_VERIFICATION_PASSWORD
  }
})


/** email body template */
class emailBody {

  static emailVerification(email, uniqueString) {
    return {
      from: 'e-Ticketing Admin',
      to: email,
      subject: 'Email Verification',
      html: `Press <a href="http://localhost:3000/auth/verify/${uniqueString}"> here </a> to verify your email. Thanks.`
    }
  }

  static emailPaymentInstruction(email) {
    return {
      from: 'e-Ticketing Admin',
      to: email,
      subject: 'Payment Instruction',
      html: `Please send some amount of money to this number: 033112139123`
    }
  }

}


/** nodemailer controller */
const sendMail = ((transport, email, mailType, uniqueString) => {
  let mailOptions
  if (mailType) {
    switch (mailType) {
      case 'emailVerification':
        mailOptions = emailBody.emailVerification(email, uniqueString)
        break
      case 'emailPaymentInstruction':
        mailOptions = emailBody.emailPaymentInstruction(email)
        break
    }
  }

  console.log(mailOptions)

  transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Message sent')
    }
  })
}).bind(this, transport)


module.exports = sendMail
