import { Video } from '@prisma/client';
import { container } from '../container/DIContainer';
import { IVideoRepository } from '../../../application/interfaces/IRepositories/IVideoRepository';
import { VideoRepository } from '../../../infrastructure/repositories/VideoRepository';
import { IVideoService } from '../../../application/interfaces/IServices/IVideoService';
import { VideoService } from '../../../application/services/VideoService';
import { IResourceOwnership } from '../../../application/interfaces/IServices/IResourceOwnership';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { VideoController } from '../../controllers/VideoController';

container.bind<IVideoRepository>('IVideoRepository').to(VideoRepository).inSingletonScope();
container.bind<IVideoService>('IVideoService').to(VideoService).inSingletonScope();
container.bind<IResourceOwnership<Video>>('IResourceOwnership<Video>').to(VideoService).inSingletonScope();
container.bind<ResourceOwnership<Video>>('ResourceOwnership<Video>').toDynamicValue(() => new ResourceOwnership<Video>('Video')).inSingletonScope();
container.bind<VideoController>('VideoController').to(VideoController).inSingletonScope();
