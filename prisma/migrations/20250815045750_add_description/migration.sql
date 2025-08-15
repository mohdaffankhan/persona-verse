/*
  Warnings:

  - Added the required column `description` to the `Persona` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Persona" ADD COLUMN     "description" TEXT NOT NULL;
