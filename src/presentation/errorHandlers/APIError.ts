class APIError extends Error {
	message: any;
	statusCode: number
	status: string;
	constructor(message: any, statusCode: number) {
		super(message);
		this.message = message instanceof Array ? message : [message];
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'Error' : 'Fail';
	}
}

export default APIError;