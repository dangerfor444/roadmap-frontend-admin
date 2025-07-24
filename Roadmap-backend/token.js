import bcrypt from 'bcrypt';

const password = 'admin'; // или любой другой пароль
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('bcrypt hash:', hash);
});