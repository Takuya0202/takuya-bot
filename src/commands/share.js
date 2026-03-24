import { ContentType } from "@prisma/client";
import { db } from "../../lib/db.js";

// urlが共有されたときにリンクをクリップする。
export async function share(message) {
    if (message.content.includes("https://")) {
        const url = message.content.match(/https:\/\/[^\s]+/)[0];
        try {
            await db.content.create({
                data : {
                    channelId : message.channelId,
                    type : ContentType.URL,
                    url : url,
                    createdAt : new Date(),
                    updatedAt : new Date(),
                }
            })
            await message.reply("リンクを保存しました!関連性の高い動画を定期的に共有します。");
        } catch (error) {
            await message.reply("リンクの保存に失敗しました");
            console.error(error);
        }
    }
}