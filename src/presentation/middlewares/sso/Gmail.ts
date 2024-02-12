import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { SSOPlatform } from '@prisma/client';
import asyncHandler from'express-async-handler';
import { OAuth } from '../../services/OAuth';
import { PlatformInfo } from '../../types/Platform';
import { GmailUserData } from '../../types/GmailUserData';
import APIError from '../../errorHandlers/APIError';
import HttpStatusCode from '../../enums/HTTPStatusCode';

export class Gmail extends OAuth<GmailUserData>{
  protected platformInfo: PlatformInfo;

  constructor() {
    super();
    this.platformInfo = {
      clientId: process.env.Google_Client_Id as string,
      clientSecret: process.env.Google_Client_Secret as string,
      tokenURL: process.env.Google_Token_URL as string,
      scopeURL: process.env.Google_Scope_URL as string
    };
  };

  protected async getAccessToken(code: string, redirectURL: string): Promise<string> {
    const {clientId, clientSecret, tokenURL} = this.platformInfo;
    const response = await fetch(tokenURL, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectURL,
        grant_type: "authorization_code"
      }),
    });
    if(response.status !== 200) {
      const error = await response.json();
      throw new APIError(`${error.error}, ${error.error_description}`, HttpStatusCode.InternalServerError);
    }
    const {access_token} = await response.json();
    return access_token;
  }; 

  signup = asyncHandler(async(request: Request, response: Response, next: NextFunction) => {
    const {code, redirectURL} = request.body.input;
    const userData = await this.getData(code, redirectURL);
    delete request.body.input.code;
    delete request.body.input.redirectURL;
    request.body.input = {
      ...request.body.input,
      firstName: userData.given_name,
      lastName: userData.family_name,
      email: userData.email,
      password: crypto.randomUUID(),
      picture: userData.picture,
      isSignWithSSO: true,
      platform: SSOPlatform.GMAIL,
      isEmailVerified: userData.verified_email
    };
    next();
  });

  login = asyncHandler(async(request: Request, response: Response, next: NextFunction) => {
    const {code, redirectURL} = request.body.input;
    const userData = await this.getData(code, redirectURL);
    delete request.body.input.code;
    delete request.body.input.redirectURL;
    request.body.input = {
      ...request.body.input,
      email: userData.email,
      password: crypto.randomUUID(),
      isSignWithSSO: true,
      platform: SSOPlatform.GMAIL
    };
    next();
  });
}