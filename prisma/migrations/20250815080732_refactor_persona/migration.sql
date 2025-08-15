/*
  Warnings:

  - You are about to drop the column `talkingStyle` on the `Persona` table. All the data in the column will be lost.
  - Added the required column `behaviouralTraits` to the `Persona` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Persona` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Persona" DROP COLUMN "talkingStyle",
ADD COLUMN     "behaviouralTraits" TEXT NOT NULL,
ADD COLUMN     "commonPhrases" TEXT,
ADD COLUMN     "language" TEXT NOT NULL;
