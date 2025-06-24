export default () => ({
  port: parseInt(process.env.APP_DOCKER_PORT, 10) || 3000,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_DOCKER_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize:
      process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'localProd',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '3d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
});
