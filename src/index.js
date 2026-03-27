import 'dotenv/config';
import { ApplicationCommandOptionType, Client, GatewayIntentBits } from "discord.js";
import { clip } from './commands/clip.js';
import { share } from './commands/share.js';
import { explain } from './commands/explain.js';
const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// slashコマンド登録
client.on("clientReady" , async () => {
    const data = [{
        name : "clip",
        description : "動画または画像をクリップします。クリップされた動画または画像は定期的にチャンネル内に投稿されます。",
        options : [
            {
                name : "file",
                description : "クリップするファイル",
                type : ApplicationCommandOptionType.Attachment, // 11
                required : true
            }
        ]
    }];
    await client.application.commands.set(data)
    console.log("slashコマンド登録完了");
});


// イベント一覧
client.on("interactionCreate" , async (interaction) => await clip(interaction));
client.on("messageCreate" , (message) => {
    if (message.author.bot) return; // ボットのメッセージは無視
    if (message.mentions.has(client.user)) {
        explain(message);
    }
    share(message);
} )

const token = process.env.DISCORD_TOKEN;
client.login(token).then(() => {
    console.log("ログイン成功");
}).catch((err) => {
    console.log("ログイン失敗" , err);
});