import { ContentType } from "@prisma/client";
import { db } from "../../lib/db.js";
import { ai } from "../../lib/claude.js";

export async function recommend(message) {
    await message.deferReply();
    const channelId = message.channelId;
    try {
        const records = await db.content.findMany({
            where : {
                channelId : channelId,
                type : ContentType.URL
            },
            take : 10,
            orderBy : {
                createdAt : "desc"
            },
            select : {
                url : true
            }
        });

        if (records.length === 0) {
            await message.editReply("まだURLが保存されていないため、おすすめを生成できません。");
            return;
        }

        const urlList = records.map((r, i) => `${i + 1}. ${r.url}`).join("\n");

        const prompt = `以下はユーザーがこれまでに共有したURLの一覧です。

${urlList}

これらのURLのコンテンツの傾向・ジャンル・テーマを分析し、ユーザーが興味を持ちそうな関連性の高い投稿を YouTube・X（旧Twitter）・Instagram からそれぞれ最低1件ずつ、合計3〜6件おすすめしてください。

以下の形式で出力してください：

【おすすめ投稿】

▶ YouTube
- タイトル：〇〇〇
  URL：https://...
  理由：〇〇だから

🐦 X (Twitter)
- タイトル／内容：〇〇〇
  URL：https://...
  理由：〇〇だから

📸 Instagram
- タイトル／内容：〇〇〇
  URL：https://...
  理由：〇〇だから

注意：
- URLは実在するものを必ず提示してください。
- 各プラットフォームから最低1件はおすすめしてください。
- 日本語で回答してください。`;

        const response = await ai.messages.create({
            model: "claude-opus-4-5",
            max_tokens: 1024,
            messages: [
                { role: "user", content: prompt }
            ]
        });

        const replyText = response.content[0].text;
        await message.editReply(replyText);
    } catch (error) {
        console.error(error);
        await message.editReply("おすすめ動画の取得に失敗しました");
    }
}