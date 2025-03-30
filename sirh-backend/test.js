const bcrypt = require('bcrypt');

bcrypt.hash('123456', 10).then(hash => {
  console.log("Hash du mot de passe :", hash);
});