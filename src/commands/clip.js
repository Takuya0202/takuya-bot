import { ContentType } from "@prisma/client";
import { db } from "../../lib/db.js";

export async function clip(interaction) {
    // ファイルを取得
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "clip") {
        const attachment = interaction.options.getAttachment("file");
        try {
            await db.content.create({
                data : {
                        channelId : interaction.channelId,
                        type : ContentType.CDN,
                        url : attachment.url,
                        createdAt : new Date(),
                        updatedAt : new Date(),
                }
            })
            await interaction.reply("クリップに成功しました");
        } catch (error) {
            await interaction.reply("クリップに失敗しました");
            console.error(error);
        }
    }
}