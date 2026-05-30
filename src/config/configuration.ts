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
  jwtDuration: process.env.JWT_DURATION,
  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  },
  practice: {
    generationsPerDay: parseInt(
      process.env.PRACTICE_GENERATIONS_PER_DAY ?? '10',
      10,
    ),
    maxQuestions: parseInt(process.env.PRACTICE_MAX_QUESTIONS ?? '15', 10),
  },
  clustering: {
    enabled: process.env.CLUSTERING_ENABLED !== 'false',
    cron: process.env.CLUSTERING_CRON ?? '0 3 * * 0',
    aiMock: process.env.CLUSTERING_AI_MOCK !== 'false',
  },
  email: {
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER,
  },
});
