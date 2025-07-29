import fs from "fs";

type UserId = number;
type Username = string;
type Tag = string;

interface StoreData {
  [tag: Tag]: { id: UserId; username: Username }[];
}


const DATA_FILE = "./src/data/db.json";

function load(): StoreData {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function save(data: StoreData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db: StoreData = load();

export function addTag(tag: string, user: { id: number; username: string }) {
  if (!db[tag]) db[tag] = [];
  if (!db[tag].some((u) => u.id === user.id)) {
    db[tag].push(user);
    save(db);
  }
}

export function removeTag(tag: string, userId: number) {
  if (db[tag]) {
    db[tag] = db[tag].filter((u) => u.id !== userId);
    if (db[tag].length === 0) delete db[tag];
    save(db);
  }
}

export function getUserTags(userId: number): Tag[] {
  return Object.entries(db)
    .filter(([_, users]) => users.some((u) => u.id === userId))
    .map(([tag]) => tag);
}

export function getUsersByTag(tag: string): { id: number; username: string }[] {
  return db[tag] || [];
}
