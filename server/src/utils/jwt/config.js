const crypto = require('crypto');

module.exports = {
  MD5_SUFFIX: 'devin_salt_value',
  md5: pwd => {
    return crypto.createHash('md5').update(pwd).digest('hex');
  },
  // 密钥
  secretKey: 'sdfassadasd1212qwefrawfd34dfa'
};