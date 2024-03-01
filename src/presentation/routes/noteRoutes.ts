import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {upsertNoteValidation} from "../middlewares/express-validator/noteValidator"
import { NoteController } from '../controllers/NoteController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllNotes, getNoteById, upsertNote, deleteNote} = container.get<NoteController>('NoteController');

const noteRouter = express.Router();

noteRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Notes', 'Get'), getAllNotes);

noteRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Notes', 'Get'), getNoteById);

noteRouter.route("/upsert")
	.post(isAuthenticated, isAuthorized('Notes', 'Add'), upsertNoteValidation, upsertNote);

noteRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Notes', 'Delete'), deleteNote);

export default noteRouter;  