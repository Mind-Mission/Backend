import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addSectionValidation, updateSectionValidation} from "../middlewares/express-validator/sectionValidator"
import { SectionController } from '../controllers/SectionController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllSections, getSectionById, createSection, updateSection, deleteSection} = container.get<SectionController>('SectionController');

const sectionRouter = express.Router();

sectionRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Section', 'GET'), getAllSections);

sectionRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Section', 'GET'), getSectionById);

sectionRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Section', 'POST'), addSectionValidation, createSection);

sectionRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Section', 'PATCH'), updateSectionValidation, updateSection);

sectionRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Section', 'DELETE'), deleteSection);

export default sectionRouter;