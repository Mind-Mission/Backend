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
	.post(isAuthenticated, isAuthorized('CertificateTemplates', 'Get'), getAllCertificateTemplates);

certificateTemplateRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplates', 'Get'), getCertificateTemplateById);

certificateTemplateRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplates', 'Add'), createCertificateTemplate, createCertificateTemplate);

certificateTemplateRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplates', 'Update'), updateCertificateTemplate, updateCertificateTemplate);

certificateTemplateRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('CertificateTemplates', 'Delete'), deleteCertificateTemplate);

export default certificateTemplateRouter;