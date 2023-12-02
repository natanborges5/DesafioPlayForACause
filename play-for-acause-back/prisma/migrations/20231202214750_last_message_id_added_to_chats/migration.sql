-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_best_answer_id_fkey" FOREIGN KEY ("best_answer_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
