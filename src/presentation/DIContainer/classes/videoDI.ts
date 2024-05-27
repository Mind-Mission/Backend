import { Video } from '@prisma/client';
import { container } from '../container/DIContainer';
import { IVideoRepository } from '../../../application/interfaces/IRepositories/i-video-repository';
import { VideoRepository } from '../../../infrastructure/repositories/video.repository';
import { IVideoService } from '../../../application/interfaces/IServices/i-video.service';
import { VideoService } from '../../../application/services/video.service';
import { IResourceOwnershipService } from '../../../application/interfaces/IServices/i-resource-ownership.service';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { VideoController } from '../../controllers/VideoController';

container.bind<IVideoRepository>('IVideoRepository').to(VideoRepository).inSingletonScope();
container.bind<IVideoService>('IVideoService').to(VideoService).inSingletonScope();
container.bind<IResourceOwnershipService<Video>>('IResourceOwnership<Video>').to(VideoService).inSingletonScope();
container.bind<ResourceOwnership<Video>>('ResourceOwnership<Video>').toDynamicValue(() => new ResourceOwnership<Video>('Video')).inSingletonScope();
container.bind<VideoController>('VideoController').to(VideoController).inSingletonScope();
