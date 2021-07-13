grant all privileges on database userdb to userdbmgmt;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO userdbmgmt;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO userdbmgmt;

CREATE TABLE users (
    oid character varying(24) DEFAULT generate_object_id() NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    status text,
    cus_id text,
    sub_id text,
    passtoken text,
    notes text,
    name text,
    username character varying(30),
    date_created timestamp DEFAULT NOW()
);
