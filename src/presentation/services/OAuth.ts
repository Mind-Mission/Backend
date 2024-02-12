import { PlatformInfo } from "../types/Platform";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from "../enums/HTTPStatusCode";

export abstract class OAuth<T> {
  protected abstract platformInfo: PlatformInfo;
  constructor () {} 

  protected abstract getAccessToken(code: string, redirectURL: string): Promise<string>;
  
  protected async getData(code: string, redirectURL: string): Promise<T> {
    const access_token = await this.getAccessToken(code, redirectURL);
    const response = await fetch(this.platformInfo.scopeURL, {
      method: 'GET',  
      headers: { 
        Authorization: `Bearer ${access_token}`,
      }
    });
    if(response.status !== 200) {
      const error = await response.json();
      throw new APIError(`${error.error}, ${error.error_description}`, HttpStatusCode.InternalServerError);
    }
    return await response.json();
  };
};