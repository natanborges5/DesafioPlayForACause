/*
  Warnings:

  - You are about to drop the column `users_ids` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "users_ids";

-- DropTable
DROP TABLE "_ChatToUser";

-- CreateTable
CREATE TABLE "UsersOnChats" (
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "UsersOnChats_pkey" PRIMARY KEY ("userId","chatId")
);

-- AddForeignKey
ALTER TABLE "UsersOnChats" ADD CONSTRAINT "UsersOnChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnChats" ADD CONSTRAINT "UsersOnChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
