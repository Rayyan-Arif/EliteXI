import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const generatePlayerName = (): string => {
    const playerNames: string[] = ["Alex","Leo","Ryan","Noah","Liam","Ethan","Lucas",
    "Mason","Aiden","Logan","Caleb","Nathan","Isaac","Dylan","Owen",
    "Julian","Adam","Jason","Kevin","Aaron","Felix","Victor","Oscar",
    "Marco","Diego","Mateo","Bruno","Rafael","Hugo","Nico","Enzo",
    "Kai","Finn","Jude","Milan","Zayn","Ayaan","Arman","Rehan","Sam",
    "Zane","Blake","Cole","Chase","Tyler","Max","Jake","Asher","Ezra","Damian"];

    const idx1 = Math.floor(Math.random() * 50);
    let idx2 = 0;
    idx2 = Math.floor(Math.random() * 50);
    while(idx1 === idx2) idx2 = Math.floor(Math.random() * 50);

    return `${playerNames[idx1]} ${playerNames[idx2]}`;
}

const generatePlayers = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user?.id);

    const {limit, position, min_rating, max_rating} = await request.json();

    if(!(+limit) || !position || !min_rating || !max_rating)
        throw new AppError("Please provide how limit, position, and minimum rating.", 400);

    if(!['ATTACKER', 'DEFENDER', 'MIDFIELDER', 'GOALKEEPER'].includes(position))
        throw new AppError("Invalid position.", 400);

    if(min_rating <= 0 || max_rating >= 100 || max_rating < min_rating)
        throw new AppError("Invalid range of rating.", 400);

    const names: string[] = [], ages: number[] = [], ratings: number[] = [], prices: number[] = [];

    for(let i=1 ; i<=limit ; i++){
        names.push(generatePlayerName());
        ages.push(Math.round(Math.random() * 22 + 18));
        ratings.push(Math.round(Math.random() * (max_rating - min_rating) + min_rating));
        prices.push(Math.round(ratings[i-1] * ratings[i-1] / 10));
    }

    await pool.query(
        `INSERT INTO player(name, position, age, rating, price)
        SELECT unnest($1::text[]), $2, unnest($3::int[]), unnest($4::int[]), unnest($5::int[]);   
    `, [names, position, ages, ratings, prices]);

    return NextResponse.json({status: 'success'}, {status: 201});
});

export const POST = generatePlayers;