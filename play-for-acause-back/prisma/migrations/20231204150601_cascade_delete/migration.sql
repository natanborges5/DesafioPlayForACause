-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_author_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "userOnChats" DROP CONSTRAINT "userOnChats_chatId_fkey";

-- DropForeignKey
ALTER TABLE "userOnChats" DROP CONSTRAINT "userOnChats_userId_fkey";

-- AddForeignKey
ALTER TABLE "userOnChats" ADD CONSTRAINT "userOnChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnChats" ADD CONSTRAINT "userOnChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
