import 'dotenv/config';
import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// イベント一覧
// messageCreateはサーバー内でメッセージが送信された時に発火するイベント
client.on("messageCreate" , (message) => {
    if (message.author.bot) return; // ボットのメッセージは無視
    message.reply("テスト");
} )

const token = process.env.DISCORD_TOKEN;
client.login(token).then(() => {
    console.log("ログイン成功");
}).catch((err) => {
    console.log("ログイン失敗" , err);
});