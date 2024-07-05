export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize:
      process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'localProd',
  },
  jwtSecret: process.env.JWT_SECRET,
  email: {
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER,
  },
});
