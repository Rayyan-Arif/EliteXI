export interface AdminClub{
    club_id: number,
    name: string,
    created_at: string
}

export type ClubOption = {
    club_id: number;
    name: string;
};

export interface ManagerClub{
    "club_id": number,
    "name": string,
    "manager_id": number,
    "captain_id": number,
    "reputation": string,
    "ranking": number,
    "wins": number,
    "draws": number,
    "losses": number,
    "trophies_won": number,
    "no_of_players": number,
    "created_at": string,
    "club_approved": string,
    "money_left": number,
    "formation": string,
    "players": [{
        "player_id": 12,
        "name": string,
        "position": string,
        "age": number,
        "rating": number,
        "price": number,
        "club_id": number,
        "contract_end_date": string
    }]
};