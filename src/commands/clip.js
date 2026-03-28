import { ContentType } from "@prisma/client";
import { db } from "../../lib/db.js";
import { uploadToR2 } from "../../lib/r2.js";

export async function clip(interaction) {
    const attachment = interaction.options.getAttachment("file");
    try {
        const res = await fetch(attachment.url);
        const buffer = Buffer.from(await res.arrayBuffer());

        const url = await uploadToR2(
            buffer,
            attachment.name,
            attachment.contentType
        )
        await db.content.create({
            data : {
                    channelId : interaction.channelId,
                    type : ContentType.CDN,
                    url : url,
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