const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": "mem_sh",
    "password": process.env.DB_PASSWORD,
    "database": "velog_development",
    "host": "3.35.169.150",
    "dialect": "mysql"
  },
  "test": {
    "username": "mem_sh",
    "password": process.env.DB_PASSWORD,
    "database": "velog_test",
    "host": "3.35.169.150",
    "dialect": "mysql"
  },
  "production": {
    "username": "mem_sh",
    "password": process.env.DB_PASSWORD,
    "database": "velog_production",
    "host": "3.35.169.150",
    "dialect": "mysql"
  }
}
