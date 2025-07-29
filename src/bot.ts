import { Telegraf } from "telegraf";
import { addTag, getUsersByTag, getUserTags, removeTag } from "./data/store";
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is not set');

const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply(
    "Hey! I am a bot for managing tags. Use the commands /addtag, /removetag, /mytags, /ping"
  )
);

// /addtag gamer
bot.command("addtag", (ctx) => {
  const tag = ctx.message.text.split(" ")[1];
  if (!tag) return ctx.reply("Specify a tag: /addtag <tag>");
  if (!ctx.from?.username) return ctx.reply("You don't have a username in Telegram.");
  addTag(tag, { id: ctx.from.id, username: ctx.from.username });
  ctx.reply(`Tag "${tag}" added.`);
});

// /removetag gamer
bot.command("removetag", (ctx) => {
  const tag = ctx.message.text.split(" ")[1];
  if (!tag) return ctx.reply("Specify a tag: /removetag <tag>");
  removeTag(tag, ctx.from.id);
  ctx.reply(`Tag "${tag}" removed.`);
});

// /mytags
bot.command("mytags", (ctx) => {
  const tags = getUserTags(ctx.from.id);
  if (tags.length === 0) {
    ctx.reply("You don't have any tags.");
  } else {
    ctx.reply(`Your tags: ${tags.join(", ")}`);
  }
});

// /pingtag gamer
bot.command('ping', async (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  if (!tag) return ctx.reply('Specify a tag: /pingtag gamer');

  const users = getUsersByTag(tag);
  if (users.length === 0) {
    return ctx.reply(`No users found with tag "${tag}".`);
  }

  const mentions = users.map(user => {
    return `[${user.username ?? 'user'}](tg://user?id=${user.id})`;
  }).join(' ');

  await ctx.replyWithMarkdownV2(`🔔 *Tag "${tag}":* ${mentions}`);
});

export default bot;
