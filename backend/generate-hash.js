// server/generate-hash.js
const bcrypt = require('bcryptjs');

const passwords = ['admin123', 'teacher123', 'student123'];

passwords.forEach(pw => {
  const hash = bcrypt.hashSync(pw, 10);
  console.log(`Password: ${pw} → Hash: ${hash}`);
});