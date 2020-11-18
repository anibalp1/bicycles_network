const nodeMailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'sammy.white@ethereal.email',
        pass: 'd3MJG6ptYS25wa4Ug6'
    }
};

module.exports = nodeMailer.createTransport(mailConfig); 