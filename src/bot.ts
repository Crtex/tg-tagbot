import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import {
  addTag,
  removeTag,
  getUserTags,
  getUsersByTag
} from './data/store';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN not set');

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply('👋 Hi! I help manage roles (tags). Use /addtag, /removetag, /mytags, /pingtag.');
});

// /addtag gamer
bot.command('addtag', (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  const chatId = ctx.chat.id;

  if (!tag) return ctx.reply('Usage: /addtag <tag>');
  if (!ctx.from?.username) return ctx.reply('You need a @username to use tags.');

  addTag(chatId, tag, { id: ctx.from.id, username: ctx.from.username });
  ctx.reply(`✅ Tag "${tag}" added to you in this chat.`);
});

// /removetag gamer
bot.command('removetag', (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  const chatId = ctx.chat.id;

  if (!tag) return ctx.reply('Usage: /removetag <tag>');

  removeTag(chatId, tag, ctx.from.id);
  ctx.reply(`🗑 Tag "${tag}" removed from you in this chat.`);
});

// /mytags
bot.command('mytags', (ctx) => {
  const chatId = ctx.chat.id;
  const tags = getUserTags(chatId, ctx.from.id);

  if (tags.length === 0) {
    ctx.reply('😕 You have no tags in this chat.');
  } else {
    ctx.reply(`🏷 Your tags in this chat: ${tags.join(', ')}`);
  }
});

// /pingtag gamer
bot.command('ping', (ctx) => {
  const tag = ctx.message.text.split(' ')[1];
  const chatId = ctx.chat.id;

  if (!tag) return ctx.reply('Usage: /ping <tag>');

  const users = getUsersByTag(chatId, tag);
  if (users.length === 0) {
    return ctx.reply(`Nobody has the tag "${tag}" in this chat.`);
  }

  const mentions = users.map(user => {
    return `[${user.username ?? 'user'}](tg://user?id=${user.id})`;
  }).join(' ');

  ctx.replyWithMarkdownV2(`🔔 *${tag}*: ${mentions}`);
});

export default bot;
