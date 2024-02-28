import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addVideoValidation, updateVideoValidation} from "../middlewares/express-validator/videoValidator"
import { VideoController } from '../controllers/VideoController';
import multer from 'multer';
import { VideoUploader } from '../services/VideoUploader';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllVideos, getVideoById, createVideo, updateVideo, deleteVideo} = container.get<VideoController>('VideoController');
const {upload} = new VideoUploader();
const videoRouter = express.Router();

videoRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Videos', 'Get'), getAllVideos);

videoRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Videos', 'Get'), getVideoById);

videoRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Videos', 'Add'), addVideoValidation, createVideo);

videoRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Videos', 'Update'), updateVideoValidation, updateVideo);

videoRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Videos', 'Delete'), deleteVideo);

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

videoRouter.route('/upload')
	.post(multerUpload.single('video'), upload)

export default videoRouter;