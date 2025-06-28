const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb)=>{
    cb(null,true);
}

const limits = {
    fileSize : 10*1024*1024,
};

const upload = multer({
    storage,
    fileFilter,
    limits,
});

module.exports = upload;