const env = process.env.NODE_ENV || 'development';
console.log('env',env);

if(env==='development' || env ==='test') {
    // The production case not in here.
    const config = require('./config.json');
    // console.log(JSON.stringify(config,undefined,2));

    const envConfig = config[env];
    // console.log(JSON.stringify(envConfig,undefined,2));

    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    });
}
