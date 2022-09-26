const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const nodemailerSendgrid = require('nodemailer-sendgrid');

let transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    // auth: {
      apiKey: process.env.MAIL_CODE
    // }
  })
);

  const generarHTML = (vistaEmail, opciones) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${vistaEmail}.pug` , opciones);
    return juice(html)
  }

  exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo,opciones);
    const text = htmlToText.fromString(html);
    let opcionesEmail = {
        from: 'UpTask <uptask-no-repli@yopmail.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    }

    // transporter.sendMail(opcionesEmail);
    const enviarCorreo = util.promisify(transporter.sendMail);
    return enviarCorreo.call(transporter,opcionesEmail)
  }

