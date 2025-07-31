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
        PORT: 3120,
        DB_HOST: "147.93.121.3",
        DB_USER: "root",
        DB_PASSWORD: "ifb118",
        DB_NAME: "ib",
        DB_PORT: 3120,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3120,
        DB_HOST: "147.93.121.3",
        DB_USER: "root",
        DB_PASSWORD: "ifb118",
        DB_NAME: "ib",
        DB_PORT: 3120,
      },
    },
  ],
};
