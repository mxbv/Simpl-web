import { openDB } from "idb";

const DB_NAME = "notesApp";
const DB_VERSION = 1;
const STORE_NAME = "notes";

// Создаем или открываем базу данных
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id", // id будет ключом для заметки
      });
      store.createIndex("timestamp", "timestamp"); // индекс для сортировки по времени
    },
  });
  return db;
};

// Сохраняем заметку в IndexedDB
export const saveNoteToDB = async (note) => {
  const db = await initDB();
  await db.put(STORE_NAME, note); // Вставляем или обновляем заметку
};

// Получаем все заметки из IndexedDB
export const getNotesFromDB = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME); // Получаем все заметки
};

// Удаляем заметку из IndexedDB
export const deleteNoteFromDB = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
