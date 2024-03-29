import { diskStorage } from 'multer';

export const MulterOptions = {
        limits: {
            fileSize: 10000000000000,
        },
        fileFilter: (req: any, file: any, cb: any) => {
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
                cb(null, true);
            } else {
                cb(null, false);
            }
        },
        storage: diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req: any, file, cb) {
                const timestamp = new Date().getTime().toString();
                cb(null, `${timestamp}.png`);
            },
        }),
};
