type UserId = number;
type Username = string;
type Tag = string;
type ChatId = number;

interface StoreData {
  [chatId: string]: {
    [tag: string]: { id: UserId; username: Username }[];
  };
}

import fs from 'fs';

const DATA_FILE = './src/data/db.json';

function load(): StoreData {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function save(data: StoreData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db: StoreData = load();

export function addTag(chatId: number, tag: string, user: { id: number; username: string }) {
  if (!db[chatId]) db[chatId] = {};
  if (!db[chatId][tag]) db[chatId][tag] = [];
  const exists = db[chatId][tag].some(u => u.id === user.id);
  if (!exists) {
    db[chatId][tag].push(user);
    save(db);
  }
}

export function listTags(chatId: number): string[] {
  if (!db[chatId]) return [];

  return Object.keys(db[chatId]);
}

export function removeTag(chatId: number, tag: string, userId: number) {
  if (db[chatId] && db[chatId][tag]) {
    db[chatId][tag] = db[chatId][tag].filter(u => u.id !== userId);
    if (db[chatId][tag].length === 0) delete db[chatId][tag];
    if (Object.keys(db[chatId]).length === 0) delete db[chatId];
    save(db);
  }
}

export function getUserTags(chatId: number, userId: number): Tag[] {
  const result: Tag[] = [];
  const tags = db[chatId] || {};
  for (const [tag, users] of Object.entries(tags)) {
    if (users.some(u => u.id === userId)) {
      result.push(tag);
    }
  }
  return result;
}

export function getUsersByTag(chatId: number, tag: string): { id: number, username: string }[] {
  return db[chatId]?.[tag] || [];
}
