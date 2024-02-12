import { Request } from "express"

export abstract class RequestManager {
  private static skipItems = 0;
  private static takeItems = 10;

  private static select = (request: Request) => {
    const {select} = request.body;
    return select;
  };

  private static include = (request: Request) => {
    const {include} = request.body;
    return include;
  };

  private static where = (request: Request) => {
    const {where} = request.body;
    return where;
  };

  private static orderBy = (request: Request) => {
    const {order} = request.body;
    return order
  };

  private static skip = (request: Request) => {
    return request.body.skip || this.skipItems;
  };

  private static take = (request: Request) => {
    return request.body.take || this.takeItems;
  };

  private static _count = (request: Request) => {
    return request.body._count;
  }

  private static _sum = (request: Request) => {
    return request.body._sum;
  }

  private static _avg = (request: Request) => {
    return request.body._avg;
  }

  private static _min = (request: Request) => {
    return request.body._min;
  }

  private static _max = (request: Request) => {
    return request.body._min;
  }

  static findOptionsWrapper = (request: Request) => {
    return {
      where: this.where(request),
      select: this.select(request),
      include: this.include(request),
      orderBy: this.orderBy(request),
      skip: this.skip(request),
      take: this.take(request),
    }
  }

  static aggregateOptionsWrapper = (request: Request) => {
    const aggregate = {
      _count: this._count(request),
      _sum: this._sum(request),
      _avg: this._avg(request),
      _min: this._min(request),
      _max: this._max(request),
    }

    for(const option in aggregate) {
      if(!(aggregate as any)[option]) {
        delete (aggregate as any)[option]
      }
    }
    return aggregate;
  }
}

