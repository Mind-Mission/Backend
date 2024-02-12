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
	.post(isAuthenticated, isAuthorized('Note', 'GET'), getAllNotes);

noteRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Note', 'GET'), getNoteById);

noteRouter.route("/upsert")
	.post(isAuthenticated, isAuthorized('Note', 'POST'), upsertNoteValidation, upsertNote);

noteRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Note', 'DELETE'), deleteNote);

export default noteRouter;  