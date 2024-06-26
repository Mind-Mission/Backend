import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {updateCertificateValidation} from "../middlewares/express-validator/certificateValidator"
import { CertificateController } from '../controllers/CertificateController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllCertificates, getCertificateById, updateCertificate, deleteCertificate} = container.get<CertificateController>('CertificateController');

const certificateRouter = express.Router();

certificateRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Certificates', 'Get'), getAllCertificates);

certificateRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Certificates', 'Get'), getCertificateById);

certificateRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Certificates', 'Update'), updateCertificateValidation, updateCertificate);

certificateRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Certificates', 'Delete'), deleteCertificate);

export default certificateRouter;