let multer = require("multer");
let mStrograge = multer.memoryStorage();
let mUploader = multer({storage:mStrograge});
module.exports = {mUploader}
