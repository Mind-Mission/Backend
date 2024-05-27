import { Lesson, Section } from '@prisma/client';
import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addLessonValidation, updateLessonValidation} from "../middlewares/express-validator/lessonValidator"
import { ResourceOwnership } from '../middlewares/ResourceOwnership/ResourceOwnership.';
import { LessonController } from '../controllers/LessonController';

const {isAuthenticated, isAuthorized, restrictedUpdateForAdminOnly} = container.get<Authorization>('Authorization');
const {isResourceBelongsToCurrentUser: isSectionBelongsToCurrentUser} = container.get<ResourceOwnership<Section>>('ResourceOwnership<Section>');
const {isResourceBelongsToCurrentUser} = container.get<ResourceOwnership<Lesson>>('ResourceOwnership<Lesson>');
const {getAllLessons, getLessonById, createLesson, restrictedPropertiesForAdminOnly, updateLesson, deleteLesson} = container.get<LessonController>('LessonController');

const lessonRouter = express.Router();

lessonRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Lessons', 'Get'), getAllLessons);

lessonRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lessons', 'Get'), getLessonById);

lessonRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Lessons', 'Add'), addLessonValidation, isSectionBelongsToCurrentUser('sectionId', 'body'), createLesson);

lessonRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lessons', 'Update'), updateLessonValidation, restrictedUpdateForAdminOnly(restrictedPropertiesForAdminOnly), isResourceBelongsToCurrentUser(), updateLesson);

lessonRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lessons', 'Delete'), isResourceBelongsToCurrentUser(), deleteLesson);

export default lessonRouter;