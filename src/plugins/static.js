const fs = require("fs");
const path = require("path");
const mime = require("mime");
const zlib = require("zlib");
module.exports = ({ headers = {}, proxyRoute } = {}) =>
    function(ctx, next) {
        // 相对文件夹的路径
        const filePath = path.join(__dirname, "..", ctx.request.path);
        const stats = fs.statSync(filePath);
        const isDirectory = stats.isDirectory();
        const startPath = "/static";

        console.log(" ========================> ");

        if (!ctx.request.path.startsWith(startPath)) {
            next();

            return;
        }

        if (isDirectory) {
            // 文件夹返回 html
            const dirFiles = fs.readdirSync(filePath);
            let html = "";

            if (dirFiles.length) {
                html += "<ul>";
                for (const f of dirFiles) {
                    html += `<li><a href=${ctx.request.path +
                        "/" +
                        f}>${f}</a></li>`;
                }

                html += "</ul>";
            } else {
                html += "<p>空文件夹</p>";
            }

            ctx.set("Content-Type", "text/html;charset=utf-8");
            ctx.response.statusCode = 200;
            ctx.body = html;

            return;
        }

        // 文件

        const gz = zlib.createGzip();
        const fileType = mime.getType(filePath);
        const file = fs.createReadStream(filePath).pipe(gz);

        ctx.set("Content-Type", `${fileType};charset=utf-8`);
        ctx.set("Content-Encoding", "gzip");
        ctx.response.statusCode = 200;
        ctx.response.body = file;
    };
