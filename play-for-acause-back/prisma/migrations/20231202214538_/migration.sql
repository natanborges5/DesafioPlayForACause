/*
  Warnings:

  - A unique constraint covering the columns `[best_answer_id]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "best_answer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chats_best_answer_id_key" ON "chats"("best_answer_id");
