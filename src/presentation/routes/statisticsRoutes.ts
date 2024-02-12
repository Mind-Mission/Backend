import express from 'express';
import container from '../DIContainer/DI'
import {StatisticsController} from '../controllers/StatisticsController';

const {getMainStatistics} = container.get<StatisticsController>('StatisticsController');

const statisticsRouter = express.Router();

statisticsRouter.route("/get")
	.post(getMainStatistics);

export default statisticsRouter;