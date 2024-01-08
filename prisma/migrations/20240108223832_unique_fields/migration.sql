/*
  Warnings:

  - A unique constraint covering the columns `[tipo]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tipo]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_tipo_key" ON "Ingredient"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Status_tipo_key" ON "Status"("tipo");
