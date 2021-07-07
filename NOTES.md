BEGIN;
-- You probably want to make sure that no one else is
-- INSERT / UPDATE / DELETE'ing from the original table, otherwise
-- those changes may be lost during this switchover process. One way
-- to do that would be via:
-- LOCK TABLE "table" IN SHARE ROW EXCLUSIVE mode;
CREATE TABLE "table_new" (LIKE "table");
INSERT INTO "table_new" ...;

-- The ALTER TABLE ... RENAME TO command takes an Access Exclusive lock on "table",
-- but these final few statements should be fast.
ALTER TABLE "table" RENAME TO "table_old";
ALTER TABLE "table_new" RENAME TO "table";
DROP TABLE "table_old";

COMMIT;
