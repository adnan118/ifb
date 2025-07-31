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
        DB_HOST: "idealbody25.online",
        DB_USER: "root",
        DB_PASSWORD: "ifb118",
        DB_NAME: "ib",
        DB_PORT: 3120,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3118,
        DB_HOST: "idealbody25.online",
        DB_USER: "root",
        DB_PASSWORD: "ifb118",
        DB_NAME: "ib",
        DB_PORT: 3120,
      },
    },
  ],
};
