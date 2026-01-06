import { ApiResponse } from "../types/apiTypes";

export default class ApiError extends Error {
    statusCode : number;

    constructor(response : ApiResponse){
        super(response.message);
        this.statusCode = response.status
        console.log(response)
        // Error.captureStackTrace(this,this.constructor)
    }
}