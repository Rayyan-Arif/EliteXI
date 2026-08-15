import { NextResponse } from "next/server";
import { DatabaseError } from "pg";

export const validateFormation = (formation: string) => {
    const formations: string[] = ['4-4-2', '4-3-3', '4-3-2-1', '4-1-2-1-2', '4-3-1-2'];
    return formations.includes(formation);
}

export class AppError extends Error{
    status: number;
    constructor(message: string, status: number){
        super(message);

        this.status = status;
    }
}

export const catchAsync = (func: Function) => {
    return async(...args: any[]) => {
        try{
            return await func(...args);
        } catch(err){
            process.env.NODE_ENV === 'development' && console.log(err);

            if(err instanceof DatabaseError && err.code === '23505')
                return NextResponse.json(
                    {
                        status: 'error',
                        message: 'An account with this email already exists.',
                    },
                    {status: 409}
                )

            if(err instanceof AppError)
                return NextResponse.json(
                    {
                        status: 'error',
                        message: err.message,
                        stack: process.env.NODE_ENV === 'development' ? err.stack : null
                    },
                    {
                        status: err.status
                    }
                )

            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Internal Server Error',
                    err: process.env.NODE_ENV === 'development' ? err : null
                },
                {
                    status: 500
                }
            )
        }
    }
}

export const APP_URL = process.env.APP_URL;