import express from 'express';
import multer from 'multer';
import path from 'path';
import appConf from '../config/application';
import { appLog } from '../config/winston';
import { errorResponse, successResponse } from '../util/response.util';

const PORT = process.env.PORT || appConf.port;
const common = express.Router();
//! Use of Multer
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/images/')     // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
      callBack(null, `${file.fieldname  }-${  Date.now()  }${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage
});
common.post(
  "/create-presigned-url",
  upload.single("file"),
  async (req, res) => {
    try {
      const response = `http://api.sheshi.vn/images/${req.file.filename}`;
      return successResponse(res, response);
    } catch (e) {
      appLog.error("Error_Get_Signed_Url: ", e);
      return errorResponse(res, e);
    }
  }
);

export function initWebCommonController(app) {
  app.use('/api/common', common);
}
