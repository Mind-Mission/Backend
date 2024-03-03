import { Course, Section } from '@prisma/client';
import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { ResourceOwnership } from '../middlewares/ResourceOwnership/ResourceOwnership.';
import {addSectionValidation, updateSectionValidation} from "../middlewares/express-validator/sectionValidator"
import { SectionController } from '../controllers/SectionController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {isResourceBelongsToCurrentUser: isCourseBelongsToCurrentUser} = container.get<ResourceOwnership<Course>>('ResourceOwnership<Course>');
const {isResourceBelongsToCurrentUser} = container.get<ResourceOwnership<Section>>('ResourceOwnership<Section>');
const {getAllSections, getSectionById, createSection, updateSection, deleteSection} = container.get<SectionController>('SectionController');

const sectionRouter = express.Router();

sectionRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Sections', 'Get'), getAllSections);

sectionRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Sections', 'Get'), getSectionById);

sectionRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Sections', 'Add'), addSectionValidation, isCourseBelongsToCurrentUser('courseId', 'body'), createSection);

sectionRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Sections', 'Update'), updateSectionValidation, isResourceBelongsToCurrentUser(), updateSection);

sectionRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Sections', 'Delete'), isResourceBelongsToCurrentUser(), deleteSection);

export default sectionRouter;