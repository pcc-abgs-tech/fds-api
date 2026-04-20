export class HttpError extends Error {
    public statusCode: number;
    public errorCode: string;
    public details?: any;

    constructor(
        message: string, 
        statusCode: number = 500, 
        errorCode: string = "SERVER_ERROR",
        details?: any
    ) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.details = details
        
        Object.setPrototypeOf(this, HttpError.prototype)
    }
}