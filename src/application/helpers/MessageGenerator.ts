import { ExtendedUser } from "../types/ExtendedUser";

export abstract class MessageGenerator {
	private static AppName: string = process.env.APP_Name || '';
  
  static getEmailVerificationCodeMessage(token: string): string {
    const {Frontend_Verity_Email_Route} = process.env;
    return`<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
						body {
							font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
							background-color: #f8f8f8;
							margin: 0;
							padding: 0;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
						}
						h2 {
							color: #333;
						}
						p {
							color: #555;
							margin-bottom: 20px;
						}
						a {
							display: inline-block;
							padding: 10px 20px;
							background-color: #007BFF;
							color: #fff !important;
							text-decoration: none;
							border-radius: 5px;
						}
						a:hover {
							background-color: #0056b3;
						}
				</style>
		</head>
		<body>
			<div>
				<p>Thank you for registering with us! To activate your account, please click the button below to verify your email address.</p>
				<a href="${Frontend_Verity_Email_Route}?token=${token}">Verify Email Address</a>
				<p>If you did not register for our service, you can safely ignore this email.</p>
				<p>
					<span>Best regards,</span>
					<br/>
					<span>${MessageGenerator.AppName} Team</span>
				</p>
			</div>
		</body>
		</html>
		`;	
  };

	static getForgetPasswordMessage(user: ExtendedUser, resetCode: number): string {
		return `
			<h3 style="color: black">Hi ${user.firstName} ${user.lastName}</h3>
			<p style="color: black">We received a request to reset your password on your ${MessageGenerator.AppName} account.</p>
			<p style="color: black">This is your reset password code</p
			<strong style="font-size: 18px">${resetCode}</strong>
			<p style="color: black">Enter this code to complete the reset</p>
			<p style="color: black">Thanks for helping us keep your account secure.</p>
			<p style="color: black">${MessageGenerator.AppName} Team</p>
		`;
	};
}