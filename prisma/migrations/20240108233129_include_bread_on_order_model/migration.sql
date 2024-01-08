/*
  Warnings:

  - Added the required column `pao` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "carne" TEXT NOT NULL,
    "pao" TEXT NOT NULL,
    "opcionais" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_Order" ("carne", "id", "nome", "opcionais", "status") SELECT "carne", "id", "nome", "opcionais", "status" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
