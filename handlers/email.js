const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });

  const generarHTML = (vistaEmail, opciones) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${vistaEmail}.pug` , opciones);
    return juice(html)
  }

  exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo,opciones);
    const text = htmlToText.fromString(html);
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    }

    // transporter.sendMail(opcionesEmail);
    const enviarCorreo = util.promisify(transporter.sendMail);
    return enviarCorreo.call(transporter,opcionesEmail)
  }

