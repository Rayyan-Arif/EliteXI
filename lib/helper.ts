import { NextResponse } from "next/server";

export const validateFormation = (formation: string) => {
    const formations: string[] = ['4-4-2', '4-3-3', '4-3-2-1', '4-1-2-1-2', '4-3-1-2'];
    return formations.includes(formation);
}

export const scrollToComponent = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'center'});
}

export class AppError extends Error{
    status: number;
    constructor(message: string, status: number){
        super(message);

        this.status = status;
    }
}

export const catchAsync = async (func: Function) => {
    return async(...args: any[]) => {
        try{
            return await func(...args);
        } catch(err){
            console.log(err);

            if(err instanceof AppError)
                return NextResponse.json(
                    {
                        status: 'error',
                        message: err.message
                    },
                    {
                        status: err.status
                    }
                )

            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Internal Server Error'
                },
                {
                    status: 500
                }
            )
        }
    }
}

export const countries = ["Argentina","Australia","Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Denmark","Egypt","England","France","Germany","Ghana","Greece","India","Indonesia","Iran","Ireland","Italy","Japan","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Paraguay","Peru","Poland","Portugal","Qatar","Saudi Arabia","Scotland","Senegal","Serbia","South Africa","South Korea","Spain","Sweden","Switzerland","Turkey","Ukraine","United Arab Emirates","United States","Uruguay","Wales","Zimbabwe"];

export const APP_URL = process.env.APP_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;