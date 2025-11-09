module.exports = {
  apps: [
    {
      name: "fatemaifb",
      script: "server.js",
      instances: 1,  
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3118,
        DB_HOST: "localhost",
        DB_USER: "pma_user",
        DB_PASSWORD: "pma123",
        DB_NAME: "ib",
        DB_PORT: 3306,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3118,
        DB_HOST: "localhost",
        DB_USER: "pma_user",
        DB_PASSWORD: "pma123",
        DB_NAME: "ib",
        DB_PORT: 3306,
      },
    },
  ],
};
