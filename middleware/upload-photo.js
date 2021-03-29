const multer = require('multer');
const MulterGoogleCloudStorage = require('multer-cloud-storage');


const upload = new multer({
    storage: new MulterGoogleCloudStorage.storageEngine({
        acl: 'publicread',
        filename: (req, file, cb) => {
            cb(null,`${Date.now().toString() + file.originalname}`);
        },
        contentType: 'image/jpeg'
    }),
});

module.exports = upload;

