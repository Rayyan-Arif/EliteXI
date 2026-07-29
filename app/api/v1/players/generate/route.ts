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
    while(idx1 === idx2) idx2 = Math.floor(Math.random() * 50);

    return `${playerNames[idx1]} ${playerNames[idx2]}`;
}

const generatePlayerPosition = (): string => {
    const positions = ['ATTACKER', 'DEFENDER', 'MIDFIELDER', 'GOALKEEPER'];

    return positions[Math.floor(Math.random() * 4)];
}

const generatePlayers = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user?.id);

    const {limit} = await request.json();

    if(!(+limit))
        throw new AppError("Please provide how many players you want to create.", 400);

    const names: string[] = [], positions: string[] = [], ages: number[] = [], ratings: number[] = [], prices: number[] = [];

    for(let i=1 ; i<=limit ; i++){
        names.push(generatePlayerName());
        positions.push(generatePlayerPosition());
        ages.push(Math.round(Math.random() * 22 + 18));
        ratings.push(Math.round(Math.random() * 99 + 1));
        prices.push(Math.round(Math.random() * 100) * ratings[i-1]);
    }

    await pool.query(
        `INSERT INTO player(name, position, age, rating, price)
        SELECT unnest($1::text[]), unnest($2::PLAYER_POSITION[]), unnest($3::int[]), unnest($4::int[]), unnest($5::int[]);   
    `, [names, positions, ages, ratings, prices]);

    return NextResponse.json({status: 'success'}, {status: 201});
});

export const POST = generatePlayers;