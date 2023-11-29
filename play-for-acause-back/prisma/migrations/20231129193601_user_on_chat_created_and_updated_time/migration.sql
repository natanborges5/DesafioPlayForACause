/*
  Warnings:

  - You are about to drop the `UsersOnChats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnChats" DROP CONSTRAINT "UsersOnChats_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnChats" DROP CONSTRAINT "UsersOnChats_userId_fkey";

-- DropTable
DROP TABLE "UsersOnChats";

-- CreateTable
CREATE TABLE "userOnChats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),

    CONSTRAINT "userOnChats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userOnChats" ADD CONSTRAINT "userOnChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnChats" ADD CONSTRAINT "userOnChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
