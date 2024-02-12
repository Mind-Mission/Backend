import { Prisma, Comment, Message } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Socket } from "socket.io";
import { IOnlineUserService } from "../../application/interfaces/IServices/IOnlineUserService";
import { ICommentService } from "../../application/interfaces/IServices/ICommentService";
import { notifier } from "./Notifier";
import { NotifyFor, SubscribeOn } from "../enums/NotificationEvent";

@injectable()
export class RealTimeManager {
	constructor(@inject('IOnlineUserService') private onlineUserService: IOnlineUserService, @inject('ICommentService') private commentService: ICommentService) {
    notifier.on(SubscribeOn.Connection, (socket) => {
      socket.on(SubscribeOn.Login, async (userId: number) => {
        try {
          await this.addCurrentLoggedInUserIntoOnlineUserTable(userId, socket);
          // await this.sendNotificationWithOnlineUsersCount(socket);
          socket.on(SubscribeOn.NewComment, async (comment: Comment) => {
            await this.notifyForNewComment(comment, socket);
          });
          socket.on(SubscribeOn.Disconnect, async () => {
            try {
              await this.removeCurrentLoggedInUserIFromOnlineUserTable(socket.id);
              // await this.sendNotificationWithOnlineUsersCount(socket);
            }catch(error) {
              console.log(error);
            }
          });
        }catch(error) {
          console.log(error);
        }
      });
      socket.on(SubscribeOn.NewMessage, (message: Message) => {
        socket.emit(NotifyFor.NewMessage, message);
      })
    });
  };

  private async getOnlineUserCount(): Promise<number> {
    const onlineUsers = await this.onlineUserService.findMany({
      select: {
        userId: true,
      },
      distinct: Prisma.OnlineUserScalarFieldEnum.userId,
    });

    return onlineUsers.length;
  };

  private async addCurrentLoggedInUserIntoOnlineUserTable(userId: number, socket: Socket<any>) {
    await this.onlineUserService.create({
      data: {
        socketId: socket.id,
        userId
      },
      select: {
        id: true,
      }
    });
  };

  private async removeCurrentLoggedInUserIFromOnlineUserTable(socketId: string) {
    await this.onlineUserService.delete(socketId);
  };

  private async sendNotificationWithOnlineUsersCount(socket: Socket<any>) {
    const onlineUserCount = await this.getOnlineUserCount();
    socket.emit(NotifyFor.OnlineUserCount, onlineUserCount);
  }

  private async getSocketIdsForParentUserComment(parentCommentId: number) {
    const comment = await this.commentService.findUnique({
      where: {
        id: parentCommentId
      },
      select: {
        user: {
          select: {
            onlineUser: {
              select: {
                socketId: true,
              }
            }
          }
        }
      }
    }) as any;
    return comment?.user.onlineUser.map((user: any) => user.socketId);
  };

  private async getSocketIdsForInstructor(commentId: number) {
    const comment = await this.commentService.findUnique({
      where: {
        id: commentId
      },
      select: {
        lesson: {
          select: {
            section: {
              select: {
                course: {
                  select: {
                    instructor: {
                      select: {
                        user: {
                          select: {
                            onlineUser: {
                              select: {
                                socketId: true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }) as any;
    return comment?.lesson.section.course.instructor.user.onlineUser.map((user: any) => user.socketId);
  };

  private async notifyForNewComment(comment: Comment, socket: Socket<any>) {
    const notifiedSocketIds = comment.parentId ? await this.getSocketIdsForParentUserComment(comment.parentId) : await this.getSocketIdsForInstructor(comment.id);
    socket.to(notifiedSocketIds).emit(NotifyFor.NewComment, comment);
  };
}