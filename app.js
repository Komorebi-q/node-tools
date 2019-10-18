const Koa = require("koa");
const chalk = require("chalk");
const conf = require("./src/config");
const static = require("./src/plugins/static");

const log = console.log;
const app = new Koa();

app.use(static());

app.listen(conf.port, () => {
    log(chalk.green(`server listen to ${conf.port}`));
});
