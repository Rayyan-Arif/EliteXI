DROP TYPE IF EXISTS USER_ROLE CASCADE;
DROP TYPE IF EXISTS REPUTATION CASCADE;
DROP TYPE IF EXISTS PLAYER_POSITION CASCADE;
DROP TYPE IF EXISTS CLUB_STATUS CASCADE;
DROP TYPE IF EXISTS TRANSFER_STATUS CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS manager CASCADE;
DROP TABLE IF EXISTS club CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS transfer CASCADE;
DROP TABLE IF EXISTS game CASCADE;
DROP TABLE IF EXISTS tournament CASCADE;
DROP TABLE IF EXISTS tournament_rankings CASCADE;

CREATE TYPE USER_ROLE AS ENUM ('MANAGER', 'ADMIN');
CREATE TYPE REPUTATION AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE PLAYER_POSITION AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'ATTACKER');
CREATE TYPE CLUB_STATUS AS ENUM ('PENDING', 'APPROVED');
CREATE TYPE TRANSFER_STATUS AS ENUM ('REJECTED', 'PENDING', 'APPROVED');

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	role USER_ROLE DEFAULT 'MANAGER',
	created_at TIMESTAMPTZ DEFAULT NOW(),
	password_reset_token TEXT,
	password_reset_token_expires TIMESTAMPTZ,
	password_changed_at TIMESTAMPTZ
);

CREATE TABLE manager(
	manager_id INT UNIQUE NOT NULL,
	nationality VARCHAR(50) NOT NULL,
	rating INT DEFAULT 0,
	reputation REPUTATION DEFAULT 'LOW',
	FOREIGN KEY(manager_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT check_manager_rating CHECK(rating >= 0 AND rating <= 100)
);

CREATE TABLE club(
	club_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	manager_id INT NOT NULL,
	captain_id INT,
	reputation REPUTATION DEFAULT 'LOW',
	ranking INT,
	wins INT DEFAULT 0,
	draws INT DEFAULT 0,
	losses INT DEFAULT 0,
	trophies_won INT DEFAULT 0,
	no_of_players INT DEFAULT 0,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	club_approved CLUB_STATUS DEFAULT 'PENDING',
	money_left INT DEFAULT 10000,
	formation VARCHAR(10) DEFAULT '4-4-2',
	FOREIGN KEY(manager_id) REFERENCES manager(manager_id) ON DELETE CASCADE,
	CONSTRAINT positive_wins CHECK(wins >= 0),
	CONSTRAINT positive_draws CHECK(draws >= 0),
	CONSTRAINT positive_losses CHECK(losses >= 0),
	CONSTRAINT positive_ranking CHECK(ranking >= 0),
	CONSTRAINT positive_trophies_won CHECK(trophies_won >= 0),
	CONSTRAINT positive_money_left CHECK(money_left >= 0),
	CONSTRAINT max_no_of_players CHECK(no_of_players >= 0 AND no_of_players <= 22)
);

CREATE TABLE player(
	player_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	position PLAYER_POSITION NOT NULL,
	age INT DEFAULT 18,
	rating INT DEFAULT 1,
	price INT DEFAULT 100,
	club_id INT,
	contract_end_date TIMESTAMPTZ,
	CONSTRAINT check_player_rating CHECK(rating >= 1 AND rating <= 100),
	CONSTRAINT check_player_age CHECK(age > 0 AND age <= 40),
	CONSTRAINT check_contract_date CHECK(contract_end_date >= NOW()),
	FOREIGN KEY(club_id) REFERENCES club(club_id)
);

ALTER TABLE club ADD FOREIGN KEY(captain_id) REFERENCES player(player_id);

-- club1 will request to club2 for transfer of a player
CREATE TABLE transfer(
	club1_id INT NOT NULL,
	club2_id INT NOT NULL,
	player_id INT NOT NULL,
	transfer_amount NUMERIC(10,2) NOT NULL,
	transfer_at TIMESTAMPTZ DEFAULT NOW(),
	transfer_status TRANSFER_STATUS DEFAULT 'PENDING',
	FOREIGN KEY(club1_id) REFERENCES club(club_id) ON DELETE CASCADE,
	FOREIGN KEY(club2_id) REFERENCES club(club_id) ON DELETE CASCADE,
	FOREIGN KEY(player_id) REFERENCES player(player_id) ON DELETE CASCADE,
	PRIMARY KEY(club1_id, club2_id, player_id),
	CONSTRAINT club_not_same CHECK(club1_id != club2_id)
);

CREATE TABLE tournament(
	tournament_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	no_of_teams INT DEFAULT 32,
	winner INT,
	runner_up INT,
	third_place INT,
	FOREIGN KEY(winner) REFERENCES club(club_id) ON DELETE CASCADE,
	FOREIGN KEY(runner_up) REFERENCES club(club_id) ON DELETE CASCADE,
	FOREIGN KEY(third_place) REFERENCES club(club_id) ON DELETE CASCADE
);

CREATE TABLE tournament_rankings(
	tournament_id INT NOT NULL,
	club_id INT NOT NULL,
	ranking INT NOT NULL,
	FOREIGN KEY(tournament_id) REFERENCES tournament(tournament_id) ON DELETE CASCADE,
	FOREIGN KEY(club_id) REFERENCES club(club_id) ON DELETE CASCADE,
	PRIMARY KEY(tournament_id, club_id)
);

CREATE TABLE game(
	game_id SERIAL PRIMARY KEY,
	game_name VARCHAR(50) NOT NULL,
	club1_id INT NOT NULL,
	club2_id INT NOT NULL,
	game_date TIMESTAMPTZ NOT NULL,
	winning_price NUMERIC(10, 2) NOT NULL,
	goals_club_1 INT DEFAULT 0,
	goals_club_2 INT DEFAULT 0,
	tournament_id INT,
	has_game_started INT DEFAULT 0,
	FOREIGN KEY(tournament_id) REFERENCES tournament(tournament_id),
	FOREIGN KEY(club1_id) REFERENCES club(club_id) ON DELETE CASCADE,
	FOREIGN KEY(club2_id) REFERENCES club(club_id) ON DELETE CASCADE,
	CONSTRAINT check_goals CHECK(goals_club_1 >= 0 AND goals_club_2 >= 0),
	CONSTRAINT game_not_same CHECK(club1_id != club2_id),
	CONSTRAINT positive_winning_price CHECK(winning_price >= 0),
	CONSTRAINT check_game_status CHECK(has_game_started IN (0, 1))
);