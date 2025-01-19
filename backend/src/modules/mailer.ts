import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

const user = process.env.SMTP_EMAIL
const pass = process.env.SMTP_PASS

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

transport.use(
  'compile',
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./src/resources/mail/'),
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  })
);

export default transport;
