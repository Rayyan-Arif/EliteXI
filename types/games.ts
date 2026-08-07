export type UpcomingGame = {
    game_id: number;
    game_name: string;
    club1_id: number;
    club2_id: number;
    club1_name?: string;
    club2_name?: string;
    game_date: string;
    winning_price: number;
    tournament_id: number | null;
};

export type TournamentOption = {
    tournament_id: number;
    name: string;
    no_of_teams?: number;
};

export interface Match{
    "game_id": number,
    "game_name": string,
    "club1_id": number,
    "club2_id": number,
    "game_date": string,
    "winning_price": string,
    "tournament_name": string,
    "club1_name": string,
    "club2_name": string,
    "has_game_started": number,
    "goals_club_1": number,
    "goals_club_2": number
}

export interface TournamentDetails{
    tournament_details: {
        tournament_id: number,
        name: string,
        no_of_teams: number
    },
    tournament_rankings: [{
        club_id: number,
        club_name: string,
        tournament_rank: number
    }],
    tournament_matches: [{
        "game_id": number,
        "game_name": string,
        "club1_name": string,
        "club2_name": string,
        "goals_club1": number,
        "goals_club2": number,
        "game_date": string
    }]
}

export interface Timeline{
    time: number,
    event: {
        eventType: string,
        clubID: number,
        player: string,
        club1Goals: number,
        club2Goals: number
    }
}