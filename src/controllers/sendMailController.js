const nodemailer = require("nodemailer");

/** instance of nodemailer */
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_VERIFICATION_HOST,
  port: process.env.EMAIL_VERIFICATION_PORT,
  auth: {
    user: process.env.EMAIL_VERIFICATION_ADDRESS,
    pass: process.env.EMAIL_VERIFICATION_PASSWORD,
  },
});

/** email body template */
class emailBody {
  static emailVerification(email, uniqueString) {
    return {
      from: "e-Ticketing Admin",
      to: email,
      subject: "Email Verification",
      html: `Press <a href="http://localhost:3000/auth/verify/${uniqueString}"> here </a> to verify your email. Thanks.`,
    };
  }

  static emailPaymentInstruction24H(email) {
    return {
      from: "e-Ticketing Admin",
      to: email,
      subject: "Payment Instruction",
      html: `Please send some amount of money to this number: 033112139123 within 24 hours`,
    };
  }

  static emailPaymentInstruction(email) {
    return {
      from: "e-Ticketing Admin",
      to: email,
      subject: "Payment Instruction",
      html: `Please send some amount of money to this number: 033112139123`,
    };
  }

  static emailPaymentPending(email) {
    return {
      from: "e-Ticketing Admin",
      to: email,
      subject: "The payment slip you've submitted will be checked by admin soon.",
      html: `Thank you for purchasing the ticket. We'll inform you if the payment slip is valid.`,
    }
  }

  static emailPaymentPassed(email) {
    return {
      from: "e-Ticketing Admin",
      to: email,
      subject: "The payment you made has been verified.",
      html: `Thank you for purchasing the ticket.`,
    }
  }

  static emailPaymentFailed(email) {
    return {
      from: "e-Ticketing Admin",
      to: email,
      subject: "Your submitted payment proof couldn't be processed.",
      html: `Please send some amount of money to this number: 033112139123`,
    }
  }
}

/** nodemailer controller */
// const sendMail = ((transport, email, mailType, uniqueString) => {
//   let mailOptions;
//   if (mailType) {
//     switch (mailType) {
//       case "emailVerification":
//         mailOptions = emailBody.emailVerification(email, uniqueString);
//         break;
//       case "emailPaymentInstruction":
//         mailOptions = emailBody.emailPaymentInstruction(email);
//         break;
//     }
//   }
//   // transport.send
//   console.log(mailOptions);

//   transport.sendMail(mailOptions, (error, response) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Message sent");
//     }
//   });
// }).bind(this, transport);

const sendMail = (email, mailType, uniqueString) => {
  let mailOptions;
  if (mailType) {
    switch (mailType) {
      case "emailPaymentInstruction24H":
        mailOptions = emailBody.emailPaymentInstruction24H(email)
        break
      case "emailVerification":
        mailOptions = emailBody.emailVerification(email, uniqueString);
        break;
      case "emailPaymentInstruction":
        mailOptions = emailBody.emailPaymentInstruction(email);
        break;
      case "emailPaymentPending":
        mailOptions = emailBody.emailPaymentPending(email)
        break
      case "emailPaymentPassed":
        mailOptions = emailBody.emailPaymentPassed(email)
        break
      case "emailPaymentFailed":
        mailOptions = emailBody.emailPaymentFailed(email)
        break
    }
  }
  return transport.sendMail(mailOptions)
};


module.exports = sendMail;
