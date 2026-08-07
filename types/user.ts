export interface User{
    id: number,
    name: string,
    email: string,
    role: string,
    created_at: string,
    nationality: string | null,
    rating: number | null,
    reputation: string | null
}

export interface SignUpBody{
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    nationality: string
}

export interface TokenPayLoad{
    email: string,
    iat: number
}

export interface AdminStats{
    players_created: number,
    matches_scheduled: number,
    tournaments_held: number,
    clubs_created: {
        approved_clubs: number,
        pending_clubs: number
    }
}