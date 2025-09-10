CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    level INTEGER DEFAULT 1,
    star_score INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 0,
    penalty_bar INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE Adventures (
    adventure_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);
CREATE TABLE User_Adventures (
    user_adventure_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    adventure_id INTEGER NOT NULL REFERENCES Adventures(adventure_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'in-progress',  -- e.g., in-progress, completed
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
CREATE TABLE User_Profiles (
    user_profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT
);
CREATE TABLE User_Settings (
    user_settings_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}'::JSONB
);
