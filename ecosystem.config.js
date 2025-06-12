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
        DB_HOST: "localhost",
        DB_USER: "root",
        DB_PASSWORD: "",
        DB_NAME: "test",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3118,
        DB_HOST: "dreamtsv.com",
        DB_USER: "u643198768_project_ifb",
        DB_PASSWORD: "CHKX2JYOL7^a",
        DB_NAME: "u643198768_project_ifb",
      },
    },
  ],
};
