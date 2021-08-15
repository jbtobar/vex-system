create table ipf_opt (
  SYMBOL varchar,
  COUNTRY varchar,
  OPOL varchar,
  EXCHANGES varchar,
  CURRENCY varchar,
  CFI varchar,
  MULTIPLIER varchar,
  UNDERLYING varchar,
  SPC varchar,
  ADDITIONAL_UNDERLYINGS varchar,
  MMY varchar,
  EXPIRATION varchar,
  LAST_TRADE varchar,
  STRIKE varchar,
  OPTION_TYPE varchar,
  EXPIRATION_STYLE varchar,
  SETTLEMENT_STYLE varchar,
  PRICE_INCREMENTS varchar,
  TRADING_HOURS varchar
);

GRANT ALL PRIVILEGES ON TABLE ipf_opt TO convex3;


CREATE TABLE tasc (
  eventSymbol varchar,
  -- eventTime bigint,
  -- eventFlags int,
  index bigint,
  time bigint,
  -- timeNanoPart int,
  sequence int,
  exchangeCode char(1),
  price real,
  size int,
  bidPrice real,
  askPrice real,
  exchangeSaleConditions varchar,
  tradeThroughExempt char(1),
  aggressorSide varchar,
  spreadLeg boolean,
  extendedTradingHours boolean,
  validTick boolean,
  type varchar,
  buyer varchar,
  seller varchar,
  spot real,
  volatility real,
  rootSymbol varchar(10),
  expirydate varchar(10),
  delta real,
  gamma real,
  vega real,
  theta real,
  dayid smallint GENERATED ALWAYS AS (time/86400000) STORED,
  flag char(1) GENERATED ALWAYS AS (substring(eventSymbol FROM '(?<=\d)[A-Z]{1}(?=\d)')) STORED
);

CREATE TABLE tasc_hist (
  eventSymbol varchar,
  -- eventTime bigint,
  -- eventFlags int,
  index bigint,
  time bigint,
  -- timeNanoPart int,
  sequence int,
  exchangeCode char(1),
  price real,
  size int,
  bidPrice real,
  askPrice real,
  exchangeSaleConditions varchar,
  tradeThroughExempt char(1),
  aggressorSide varchar,
  spreadLeg boolean,
  extendedTradingHours boolean,
  validTick boolean,
  type varchar,
  buyer varchar,
  seller varchar,
  spot real,
  volatility real,
  rootSymbol varchar(10),
  expirydate varchar(10),
  delta real,
  gamma real,
  vega real,
  theta real,
  dayid smallint,
  flag char(1)
);

GRANT ALL PRIVILEGES ON TABLE tasc_hist TO convex3;

CREATE TABLE tasc_fut (
  eventSymbol varchar,
  -- eventTime bigint,
  -- eventFlags int,
  index bigint,
  time bigint,
  -- timeNanoPart int,
  sequence int,
  exchangeCode char(1),
  price real,
  size int,
  bidPrice real,
  askPrice real,
  exchangeSaleConditions varchar,
  tradeThroughExempt char(1),
  aggressorSide varchar,
  spreadLeg boolean,
  extendedTradingHours boolean,
  validTick boolean,
  type varchar,
  buyer varchar,
  seller varchar,
  spot real,
  volatility real,
  rootSymbol varchar,
  expirydate varchar(10),
  delta real,
  gamma real,
  vega real,
  theta real,
  dayid smallint GENERATED ALWAYS AS ((time+10800000)/86400000) STORED,
  flag char(1) GENERATED ALWAYS AS (substring(eventSymbol FROM '(?<=\d)[A-Z]{1}(?=\d)')) STORED
);

GRANT ALL PRIVILEGES ON TABLE tasc_fut TO convex3;

--
-- CREATE TABLE tasc_fut (
--   eventSymbol varchar,
--   -- eventTime bigint,
--   -- eventFlags int,
--   index bigint,
--   time bigint,
--   -- timeNanoPart int,
--   sequence int,
--   exchangeCode char(1),
--   price real,
--   size int,
--   bidPrice real,
--   askPrice real,
--   exchangeSaleConditions varchar,
--   tradeThroughExempt char(1),
--   aggressorSide varchar,
--   spreadLeg boolean,
--   extendedTradingHours boolean,
--   validTick boolean,
--   type varchar,
--   buyer varchar,
--   seller varchar,
--   spot real,
--   volatility real,
--   rootSymbol varchar,
--   expirydate varchar(10),
--   dayid smallint GENERATED ALWAYS AS ((time+10800000)/86400000) STORED,
--   flag char(1) GENERATED ALWAYS AS (substring(eventSymbol FROM '(?<=\d)[A-Z]{1}(?=\d)')) STORED
-- );
CREATE TABLE tasc_fut_hist (
  eventSymbol varchar,
  -- eventTime bigint,
  -- eventFlags int,
  index bigint,
  time bigint,
  -- timeNanoPart int,
  sequence int,
  exchangeCode char(1),
  price real,
  size int,
  bidPrice real,
  askPrice real,
  exchangeSaleConditions varchar,
  tradeThroughExempt char(1),
  aggressorSide varchar,
  spreadLeg boolean,
  extendedTradingHours boolean,
  validTick boolean,
  type varchar,
  buyer varchar,
  seller varchar,
  spot real,
  volatility real,
  rootSymbol varchar,
  expirydate varchar(10),
  delta real,
  gamma real,
  vega real,
  theta real,
  dayid smallint,
  flag char(1)
);

GRANT ALL PRIVILEGES ON TABLE tasc_fut TO convex3;
GRANT ALL PRIVILEGES ON TABLE tasc_fut_hist TO convex3;



-- CREATE TABLE tasc_hist (
--   eventSymbol varchar,
--   -- eventTime bigint,
--   -- eventFlags int,
--   index bigint,
--   time bigint,
--   -- timeNanoPart int,
--   sequence int,
--   exchangeCode char(1),
--   price real,
--   size int,
--   bidPrice real,
--   askPrice real,
--   exchangeSaleConditions varchar,
--   tradeThroughExempt char(1),
--   aggressorSide varchar,
--   spreadLeg boolean,
--   extendedTradingHours boolean,
--   validTick boolean,
--   type varchar,
--   buyer varchar,
--   seller varchar,
--   spot real,
--   volatility real,
--   rootSymbol varchar(10),
--   expirydate varchar(10),
--   dayid smallint,
--   flag char(1)
-- );
-- GRANT ALL PRIVILEGES ON TABLE tasc_hist TO convex3;

CREATE TABLE tasc_fut_hist (
  eventSymbol varchar,
  -- eventTime bigint,
  -- eventFlags int,
  index bigint,
  time bigint,
  -- timeNanoPart int,
  sequence int,
  exchangeCode char(1),
  price real,
  size int,
  bidPrice real,
  askPrice real,
  exchangeSaleConditions varchar,
  tradeThroughExempt char(1),
  aggressorSide varchar,
  spreadLeg boolean,
  extendedTradingHours boolean,
  validTick boolean,
  type varchar,
  buyer varchar,
  seller varchar,
  spot real,
  volatility real,
  rootSymbol varchar(10),
  expirydate varchar(10),
  dayid smallint,
  flag char(1)
);
GRANT ALL PRIVILEGES ON TABLE tasc_fut_hist TO convex3;




CREATE TABLE futdirx (
    symbol character varying,
    rootsymbol character varying,
    dxcode character varying,
    expiration_date character varying,
    dte integer,
    active_month boolean,
    next_active_month boolean,
    stops_trading_at character varying,
    expires_at character varying,
    date_insert timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    year character(2),
    month character(1)
);
GRANT ALL PRIVILEGES ON TABLE futdirx TO convex3;


CREATE TABLE futchainx (
    underlying_symbol character varying,
    rootsymbol character varying,
    option_root_symbol character varying,
    option_contract_symbol character varying,
    asset character varying,
    expirydate character(10),
    days_to_expiration integer,
    notional_value character varying,
    display_factor character varying,
    strike_factor character varying,
    stops_trading_at character varying,
    expires_at character varying,
    tick_sizes json,
    strike numeric,
    flag character(1),
    optionsymbol character varying,
    optioncode character varying,
    date_insert timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
GRANT ALL PRIVILEGES ON TABLE futchainx TO convex3;



CREATE TABLE jkeys (
  name varchar,
  t_up timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  body json
);
GRANT ALL PRIVILEGES ON TABLE jkeys TO convex3;


CREATE TABLE futuresdir (
    symbol character varying,
    name character varying,
    dxsymbol character varying
);
GRANT ALL PRIVILEGES ON TABLE futuresdir TO convex3;



CREATE MATERIALIZED VIEW flow_aggs as (
  SELECT
   sum(size*price*100) as value,
   sum(size) as volm,
   count(*) as count,
   dayid
   from tasc_hist group by dayid
);
GRANT ALL PRIVILEGES ON VIEW flow_aggs TO convex3;



COPY futuresdir FROM stdin with DELIMITER '|';
/6A|Australian Dollar Futures|/6A:XCME
/6B|British Pound Futures|/6B:XCME
/6C|Canadian Dollar Futures|/6C:XCME
/6E|Euro FX Futures|/6E:XCME
/6J|Japanese Yen Futures|/6J:XCME
/6L|Brazilian Real Futures|/6L:XCME
/6M|Mexican Peso Futures|/6M:XCME
/6N|New Zealand Dollar Futures|/6N:XCME
/6R|Russian Ruble Futures|/6R:XCME
/6S|Swiss Franc Futures|/6S:XCME
/6Z|South African Rand Futures|/6Z:XCME
/BTC|Bitcoin Futures|/BTC:XCME
/CJ|Cocoa Futures|/CJ:XNYM
/CL|Crude Oil Futures|/CL:XNYM
/DC|Class III Milk Futures|/DC:XCME
/E7|E-mini Euro FX Futures|/E7:XCME
/EMD|E-mini S&P MidCap 400 Futures|/EMD:XCME
/ES|E-mini S&P 500 Futures|/ES:XCME
/GC|Gold Futures|/GC:XCEC
/GF|Feeder Cattle Futures|/GF:XCME
/HE|Lean Hog Futures|/HE:XCME
/HG|Copper Futures|/HG:XCEC
/HO|NY Harbor ULSD Futures (Heating Oil)|/HO:XNYM
/KT|Coffee Futures|/KT:XNYM
/LBS|Lumber Futures|/LBS:XCME
/LE|Live Cattle Futures|/LE:XCME
/M2K|Micro E-mini Russell 2000 Index Futures|/M2K:XCME
/M6A|Micro AUD/USD Futures|/M6A:XCME
/M6B|Micro GBP/USD Futures|/M6B:XCME
/M6E|Micro EUR/USD Futures|/M6E:XCME
/MCD|Micro CAD/USD Futures|/MCD:XCME
/MES|Micro E-mini S&P 500 Index Futures|/MES:XCME
/MGC|Micro Gold Futures|/MGC:XCEC
/MJY|Micro USD/JPY Futures|/MJY:XCME
/MNQ|Micro E-mini Nasdaq-100 Index Futures|/MNQ:XCME
/MYM|Micro E-mini Dow Jones Industrial Average Index Futures|/MYM:XCBT
/NG|Henry Hub Natural Gas Futures|/NG:XNYM
/NKD|Nikkei/USD Futures|/NKD:XCME
/NQ|E-mini Nasdaq-100 Futures|/NQ:XCME
/PA|Palladium Futures|/PA:XNYM
/PL|Platinum Futures|/PL:XNYM
/QC|E-mini Copper Futures|/QC:XCEC
/QG|E-mini Natural Gas Futures|/QG:XNYM
/QI|E-mini Silver Futures|/QI:XCEC
/QM|E-mini Crude Oil Futures|/QM:XNYM
/QO|E-mini Gold Futures|/QO:XCEC
/RB|RBOB Gasoline Futures|/RB:XNYM
/RP|Euro/British Pound Futures|/RP:XCME
/RTY|E-mini Russell 2000 Index Futures|/RTY:XCME
/SI|Silver Futures|/SI:XCEC
/SIL|Micro Silver (1,000 oz) Futures|/SIL:XCEC
/TN|Ultra 10-Year U.S. Treasury Note Futures|/TN:XCBT
/TT|Cotton Futures|/TT:XNYM
/UB|Ultra U.S. Treasury Bond Futures|/UB:XCBT
/YM|E-mini Dow ($5) Futures|/YM:XCBT
/YO|No. 11 Sugar Futures|/YO:XNYM
/ZB|U.S. Treasury Bond Futures|/ZB:XCBT
/ZC|Corn Futures|/ZC:XCBT
/ZF|5-Year T-Note Futures|/ZF:XCBT
/ZL|Soybean Oil Futures|/ZL:XCBT
/ZM|Soybean Meal Futures|/ZM:XCBT
/ZN|10-Year T-Note Futures|/ZN:XCBT
/ZO|Oats Futures|/ZO:XCBT
/ZR|Rough Rice Futures|/ZR:XCBT
/ZS|Soybean Futures|/ZS:XCBT
/ZT|2-Year T-Note Futures|/ZT:XCBT
/ZW|Chicago SRW Wheat Futures|/ZW:XCBT
/XC|Mini-sized Corn Futures|/XC:XCBT
/XW|Mini-sized Wheat|/XW:XCBT
/GE|Eurodollar Futures|/GE:XCME
/VX|VIX Futures|/VX:XCBF
\.


create table tasc_fut (like tasc);
GRANT ALL PRIVILEGES ON TABLE tasc_fut TO convex3;



create table opt_db as (SELECT symbol as optioncode,expiration as expirydate,strike,(substring(symbol FROM '(?<=\d)[A-Z]{1}(?=\d)')) as flag from ipf_opt);
GRANT ALL PRIVILEGES ON TABLE opt_db TO convex3;

CREATE INDEX optioncode_ix ON opt_db(optioncode);

insert into opt_db(optioncode,expirydate,strike,flag,rootsymbol) ( select optioncode,expirydate,strike,flag,rootsymbol from futchainx);



SELECT eventSymbol,rootSymbol,flag,expirydate, SUM(size),COUNT (*), SUM(price*size*100) as value,
SUM(case WHEN aggressorside = 'BUY' THEN price*size*100 ELSE 0 END) as buyvalue,
SUM(case WHEN aggressorside = 'SELL' THEN price*size*100 ELSE 0 END) as sellvalue
from tasc
GROUP BY eventSymbol,rootSymbol,flag,expirydate
ORDER BY SUM(price*size*100) DESC LIMIT 100;



CREATE TABLE opt_db_hist as (SELECT * FROM opt_db);
GRANT ALL PRIVILEGES ON TABLE opt_db_hist TO convex3;

INSERT INTO opt_db_hist (select * from opt_db);




UPDATE opt_db
SET prevvol = opt_db_hist.volatility,
  prevoi = opt_db_hist.openInterest
FROM opt_db_hist
WHERE opt_db_hist.optioncode = opt_db.optioncode
AND opt_db_hist.dayid = (select max(dayid) from opt_db);





CREATE OR REPLACE FUNCTION calculate_days_to_expiration( expirydate date )
RETURNS int
LANGUAGE plpgsql IMMUTABLE
AS $CODE$
BEGIN
    RETURN expirydate - current_date;
END
$CODE$;


CREATE OR REPLACE FUNCTION extract_dte( expirydate date,dayid smallint )
RETURNS int
LANGUAGE plpgsql IMMUTABLE
AS $CODE$
BEGIN
    RETURN (floor(extract(epoch from expirydate)/8.64e4)-dayid);
END
$CODE$;



--
--
--
--   convex1=# \d series
--                               Table "public.series"
--       Column    |            Type             | Collation | Nullable | Default
--   --------------+-----------------------------+-----------+----------+---------
--    eventsymbol  | character varying           |           |          |
--    time         | bigint                      |           |          |
--    expiration   | smallint                    |           |          |
--    volatility   | real                        |           |          |
--    callvolume   | integer                     |           |          |
--    putvolume    | integer                     |           |          |
--    putcallratio | real                        |           |          |
--    forwardprice | real                        |           |          |
--    dividend     | real                        |           |          |
--    interest     | real                        |           |          |
--    optionvolume | bigint                      |           |          |
--    dayid        | smallint                    |           |          |
--    up_at        | timestamp without time zone |           |          | now()
--   Indexes:
--       "series_eventsymbol_expiration_dayid_key" UNIQUE CONSTRAINT, btree (eventsymbol, expiration, dayid)
--       "series_eventsymbol_idx" btree (eventsymbol)
--
--
-- INSERT INTO series(
--   eventsymbol,
--   time,
--   expiration,
--   volatility,
--   callvolume,
--   putvolume,
--   putcallratio,
--   forwardprice,
--   dividend,
--   interest,
--   optionvolume,
--   dayid
-- )  (
--   select
--   eventsymbol,
--   time,
--   expiration,
--   volatility,
--   callvolume,
--   putvolume,
--   putcallratio,
--   forwardprice,
--   dividend,
--   interest,
--   optionvolume,
--   dayid
--   from seriesf where dayid < 18751
-- );


-- Table "public.seriesf"
-- Column    |         Type          | Collation | Nullable |                     Default
-- --------------+-----------------------+-----------+----------+--------------------------------------------------
-- eventsymbol  | character varying(20) |           |          |
-- eventtime    | bigint                |           |          |
-- eventflags   | integer               |           |          |
-- index        | bigint                |           |          |
-- time         | bigint                |           |          |
-- sequence     | integer               |           |          |
-- expiration   | integer               |           |          |
-- volatility   | numeric               |           |          |
-- callvolume   | bigint                |           |          |
-- putvolume    | bigint                |           |          |
-- putcallratio | numeric               |           |          |
-- forwardprice | numeric               |           |          |
-- dividend     | numeric               |           |          |
-- interest     | numeric               |           |          |
-- optionvolume | bigint                |           |          |
-- dayid        | integer               |           |          | generated always as (("time" / 86400000)) stored
-- Indexes:
-- "seriesf_eventsymbol_expiration_dayid_key" UNIQUE CONSTRAINT, btree (eventsymbol, expiration, dayid)
--
--
--
-- sudo pg_dump -Fc --host localhost --port 63333 --username "convex2"  --password  --verbose --file "users210807" --table "users" "convex1"
-- pg_restore -h localhost -p 5432 -U userdbmgmt -d userdb -v "users210807"
--
-- sudo pg_dump -Fc --host localhost --port 63333 --username "convex2"  --password  --verbose --file "user_layouts210807" --table "user_layouts" "convex1"
-- pg_restore -h localhost -p 5432 -U userdbmgmt -d userdb -v "user_layouts210807"
--
--
-- Table "public.users"
-- Column    |            Type             | Collation | Nullable |              Default
-- --------------+-----------------------------+-----------+----------+-----------------------------------
-- -- id           | integer                     |           | not null | nextval('users_id_seq'::regclass)
-- -- oid          | character varying(24)       |           | not null | generate_object_id()
-- -- email        | text                        |           | not null |
-- -- password     | text                        |           | not null |
-- -- status       | text                        |           |          |
-- date_created | timestamp without time zone |           |          | now()
-- session_id   | text                        |           |          |
-- -- cus_id       | text                        |           |          |
-- -- sub_id       | text                        |           |          |
-- -- passtoken    | text                        |           |          |
-- -- notes        | text                        |           |          |
-- -- name         | text                        |           |          |
-- -- username     | character varying(30)       |           |          |
-- Indexes:
-- "users_email_key" UNIQUE CONSTRAINT, btree (email)
-- "users_oid_key" UNIQUE CONSTRAINT, btree (oid)
-- "users_username_key" UNIQUE CONSTRAINT, btree (username)
--
--
-- Column    |            Type             | Collation | Nullable |       Default
-- --------------+-----------------------------+-----------+----------+----------------------
-- -- oid          | character varying(24)       |           | not null | generate_object_id()
-- -- email        | text                        |           | not null |
-- -- password     | text                        |           | not null |
-- -- status       | text                        |           |          |
-- -- cus_id       | text                        |           |          |
-- -- sub_id       | text                        |           |          |
-- -- passtoken    | text                        |           |          |
-- -- notes        | text                        |           |          |
-- -- name         | text                        |           |          |
-- -- username     | character varying(30)       |           |          |
-- date_created | timestamp without time zone |           |          | now()
-- apikey       | text                        |           |          |
-- ftp          | json                        |           |          |
-- session_id   | text                        |           |          |
-- Indexes:
-- "users_email_key" UNIQUE CONSTRAINT, btree (email)
-- "users_oid_key" UNIQUE CONSTRAINT, btree (oid)
