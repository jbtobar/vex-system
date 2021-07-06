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
