class APIError extends Error {
	statusCode: number
	status: string;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'Error' : 'Fail';
	}
}

export default APIError;