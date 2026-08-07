export interface ClubPlayer{
    "player_id": number,
    "name": string,
    "position": string,
    "age": number,
    "rating": number,
    "price": number,
    "club_id": number,
    "contract_end_date": string
}

export interface BuyablePlayer{
    "player_id": number,
    "name": string,
    "age": number,
    "position": string,
    "rating": number,
    "price": number
}

export interface TransferablePlayer{
    player_id: number,
    player_name: string,
    position: string,
    age: number,
    price: number,
    rating: number,
    contract_end_date: string,
    club_id: number,
    club_name: string
}

export interface TransferRequest{
    requested_club_id: number,
    requested_club_name: string,
    player_id: number,
    player_name: string,
    transfer_amount: number,
    transfer_status: "PENDING" | "APPROVED" | "REJECTED",
    requested_at: string
}