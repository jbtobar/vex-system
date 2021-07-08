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
  rootSymbol varchar(10),
  dayid smallint GENERATED ALWAYS AS (time/86400000) STORED,
  flag char(1) GENERATED ALWAYS AS (substring(eventSymbol FROM '(?<=\d)[A-Z]{1}(?=\d)')) STORED
);

GRANT ALL PRIVILEGES ON TABLE tasc TO convex3;
