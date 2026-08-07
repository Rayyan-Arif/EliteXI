import cron from "node-cron";
import pool from "../pool";

export const calculateRanking = () => {
    cron.schedule("0 0 * * *", async() => {
        await pool.query(`
            WITH ranked AS (
                SELECT 
                club_id, wins, losses, draws, trophies_won,
                RANK() OVER (
                    ORDER BY wins DESC, draws DESC, trophies_won DESC, losses ASC 
                ) AS new_rank
                FROM club
            )    
            UPDATE club c
            SET ranking = r.new_rank
            FROM ranked r
            WHERE c.club_id = r.club_id;
        `);
    });
}