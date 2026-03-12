const env = {
  port: Number(process.env.BACKEND_PORT || process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = env;
