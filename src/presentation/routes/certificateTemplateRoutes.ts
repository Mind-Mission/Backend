import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {createCertificateTemplateValidation, updateCertificateTemplateValidation} from "../middlewares/express-validator/certificateTemplateValidator"
import { CertificateTemplateController } from '../controllers/CertificateTemplateController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllCertificateTemplates, getCertificateTemplateById, createCertificateTemplate, updateCertificateTemplate, deleteCertificateTemplate} = container.get<CertificateTemplateController>('CertificateTemplateController');

const certificateTemplateRouter = express.Router();

certificateTemplateRouter.route("/get")
	.post(isAuthenticated, isAuthorized('CertificateTemplate', 'GET'), getAllCertificateTemplates);

certificateTemplateRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplate', 'GET'), getCertificateTemplateById);

certificateTemplateRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplate', 'POST'), createCertificateTemplate, createCertificateTemplate);

certificateTemplateRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplate', 'PATCH'), updateCertificateTemplate, updateCertificateTemplate);

certificateTemplateRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplate', 'DELETE'), deleteCertificateTemplate);

export default certificateTemplateRouter;