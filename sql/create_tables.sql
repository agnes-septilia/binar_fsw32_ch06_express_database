CREATE TABLE user_games (
    id UUID DEFAULT uuid_generate_v4(),
    username VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL ,
    "password" VARCHAR NOT NULL,
    image_filename VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
	CONSTRAINT user_games_pk PRIMARY KEY (id)
);


CREATE TABLE user_game_biodatas (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    gender VARCHAR,
    country VARCHAR,
    date_of_birth TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL,
    deactivated_at TIMESTAMPTZ,
	CONSTRAINT user_game_biodatas_pk PRIMARY KEY (id),
    CONSTRAINT user_game_biodatas_fk foreign key (user_id) references public.user_games(id) on delete no action on update cascade 
);


CREATE TABLE user_game_histories (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    player_weapon VARCHAR,
    computer_weapon VARCHAR,
    result VARCHAR,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT user_game_history_pk PRIMARY KEY (id),
    CONSTRAINT user_game_history_fk foreign key (user_id) references public.user_games(id) on delete no action on update cascade 
);
