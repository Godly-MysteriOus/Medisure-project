const {cloudinary}= require('./cloudinary');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../../utils/Logger/logger')(filePathRelativeToRoot);
async function uploadFile(fileBuffer, fileName, folderName, objId, source){
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        {
            folder: `${source}/${folderName}`,
            public_id: `${objId}-${fileName}-pid`,
            resource_type: 'auto',
        },
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        }
        );
        stream.end(fileBuffer); // stream the buffer
    });
};

exports.uploadFilesToCloudinary = async(obj,files,source)=>{
    logger.info('Inside uploadFilesToCloudinary method !!!');
    try{
        const fileUploadPromises = files.map(file=>{
            return uploadFile(file.buffer,file.originalname,file.fieldname,obj?._id?.toString(),source)
        });
        return await Promise.all(fileUploadPromises);
    }catch(err){
        logger.error('Error inside uploadFilesToCloudinary Mehtod !!!');
        logger.error(err);
        throw new Error(err);
    }
}