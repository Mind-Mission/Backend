import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {upsertRatingValidation} from "../middlewares/express-validator/ratingValidator";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {RatingController} from '../controllers/RatingController';

const {isAuthenticated, isAuthorized, isCurrentUserRoleInWhiteList} = container.get<Authorization>('Authorization');
const {getAllRatings, getRatingById, upsertRating, deleteRating} = container.get<RatingController>('RatingController');

const ratingRouter = express.Router();

ratingRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Rating', 'GET'), getAllRatings);

ratingRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Rating', 'GET'), getRatingById);

ratingRouter.route('/upsert')
	.post(isAuthenticated, isAuthorized('Rating', 'POST'), isCurrentUserRoleInWhiteList('student'), upsertRatingValidation, upsertRating);

ratingRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Rating', 'DELETE'), deleteRating);

export default ratingRouter;