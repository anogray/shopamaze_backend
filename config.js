import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/shopamaze',
  JWT_SECRET: process.env.JWT_SECRET,
  KEY_CLIENT_ID: process.env.KEY_CLIENT_ID,
  KEY_SECRET_ID: process.env.KEY_SECRET_ID,
  MAIL_USERNAME:process.env.MAIL_USERNAME,
  MAIL_PASS:process.env.MAIL_PASS
};