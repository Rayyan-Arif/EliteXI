import cron from "node-cron";
import pool from "../pool";
import { DefaultEventsMap } from "socket.io";
import { Server } from "socket.io";

const events = [
    'passes the ball to another player.',
    'takes a shoot from long distance.',
    'takes a shoot inside the box.',
    'scores a goal!',
    'blocks the shot.',
    'blocks the pass.',
];

const getClubPlayers = async(match: any) => {
    let players = (await pool.query(`
        SELECT
        (
            SELECT json_agg(
                json_build_object(
                    'club_id', p.club_id,
                    'player_name', p.name
                )
            )
            FROM (SELECT * FROM player WHERE club_id = $1 AND contract_end_date >= NOW() ORDER BY rating LIMIT 11) p
        ) AS club1players,
        (
            SELECT json_agg(
                json_build_object(
                    'club_id', p.club_id,
                    'player_name', p.name
                )
            )
            FROM (SELECT * FROM player WHERE club_id = $2 AND contract_end_date >= NOW() ORDER BY rating LIMIT 11) p
        ) AS club2players;
    `, [match.club1_id, match.club2_id])).rows[0];

    // players = {...Object.assign({}, ...players.club1players.map((player: any) => {return {[player.player_name]: player.club_id}})), 
    // ...Object.assign({}, ...players.club2players.map((player: any) => {return {[player.player_name]: player.club_id}}))};

    players = [...players.club1players, ...players.club2players];

    return players;
}

interface Timeline{
    time: number,
    event: {
        eventType: string,
        clubID: number,
        player: string,
        club1Goals: number,
        club2Goals: number,
    }
}

const saveResultsToDB = async(match: any, club1Goals: number, club2Goals: number) => {
    const client = await pool.connect();

    try{
        await client.query('UPDATE game SET goals_club_1 = $1, goals_club_2 = $2, has_game_started = 2 WHERE game_id = $3;', [club1Goals, club2Goals, match.game_id]);

        const c1 = club1Goals > club2Goals ? 'wins' : (club1Goals < club2Goals ? 'losses' : 'draws');
        const c2 = club2Goals > club1Goals ? 'wins' : (club2Goals < club1Goals ? 'losses' : 'draws');

        const para1 = c1 === 'wins' ? [match.club1_id, Math.round(match.winning_price)] : [match.club1_id];
        const para2 = c2 === 'wins' ? [match.club2_id, Math.round(match.winning_price)] : [match.club2_id];

        await client.query(`UPDATE club SET ${c1} = ${c1} + 1 ${c1 === 'wins' ? ', money_left = money_left + $2' : ''} WHERE club_id = $1;`, para1);

        await client.query(`UPDATE club SET ${c2} = ${c2} + 1 ${c2 === 'wins' ? ', money_left = money_left + $2' : ''} WHERE club_id = $1;`, para2);
    } catch(err){
        console.log(err);
        await client.query("ROLLBACK");
    }
}

const startMatch = async (match: any, io: Server) => {
    let time = 180;
    let club1Goals = 0, club2Goals = 0;

    const timeline: Timeline[] = [];

    const players = await getClubPlayers(match);

    const eventInterval = setInterval(() => {
        const eventIdx = Math.round(Math.random() * 5);
        const playerIdx = Math.round(Math.random() * (players.length - 1));
        const event = events[eventIdx];
        const player = players[playerIdx];

        if(eventIdx === 3){
            if(player.club_id === match.club1_id) club1Goals++;
            else club2Goals++;
        }
        
        timeline.push({
            time,
            event: {
                eventType: `${player.player_name} ${event}`,
                clubID: player.club_id,
                player: player.player_name,
                club1Goals,
                club2Goals
            }
        });

        io.to(`match_${match.game_id}`).emit("timeline", timeline);
    }, 3000);

    const timer = setInterval(async () => {
        if(time === 0){
            await saveResultsToDB(match, club1Goals, club2Goals);
            clearInterval(timer);
            clearInterval(eventInterval);

            io.to(`match_${match.game_id}`).emit('finished', {club1Goals, club2Goals});
            return;
        }

        time -= 1;

        io.to(`match_${match.game_id}`).emit(`time_${match.game_id}`, time);
    }, 1000);
}

export const startScheduler = (io: Server) => {
    console.log("Scheduler started");

    cron.schedule("* * * * *", async () => {
        const matches = (await pool.query("SELECT * FROM game WHERE game_date <= NOW() AND has_game_started = 0;")).rows;
        
        if(matches.length > 0)
            await pool.query("UPDATE game SET has_game_started = 1 WHERE game_id = ANY($1);", [matches.map(match => match.game_id)]);

        for(const match of matches){
            startMatch(match, io);
        }
    });
}