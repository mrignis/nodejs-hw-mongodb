import nodemailer from 'nodemailer';

export const SMTP_HOST = 'smtp-relay.brevo.com';  // Адреса вашого SMTP сервера
export const SMTP_PORT = 587;                      // Порт SMTP сервера
export const SMTP_USER = '76dc8d001@smtp-brevo.com';   // Логін для SMTP сервера
export const SMTP_PASSWORD = 'fzZSyN8jxd2agGrU';   // Пароль для SMTP сервера
export const SMTP_FROM = 'your_email@example.com';  // Ваша електронна адреса

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // false для порту 587 (TLS), true для порту 465 (SSL)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendEmail = async (email, resetLink) => {
  const mailOptions = {
    from: SMTP_FROM,
    to: email, // Встановлюємо отримувача листа
    subject: 'Password Reset',
    html: `
      <p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendEmail };
