import { openDB } from "idb";

const DB_NAME = "notesDB"; // Имя базы данных
const STORE_NAME = "notes"; // Имя хранилища

export const openDatabase = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    },
  });
};

export const saveNoteToDB = async (note) => {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const existingNote = await store.get(note.id);

  const rawNote = JSON.parse(JSON.stringify(note)); // Убираем реактивность

  // Если заметка уже есть, сохраняем старый createdAt
  if (existingNote) {
    rawNote.createdAt = existingNote.createdAt;
  } else {
    rawNote.createdAt = Date.now(); // Если новая заметка — устанавливаем createdAt
  }

  await store.put(rawNote);
  await tx.done;
};

export const getNotesFromDB = async () => {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const notes = await store.getAll();

  return notes.sort((a, b) => b.createdAt - a.createdAt); // Сортируем по дате создания (новые сверху)
};

export const deleteNoteFromDB = async (id) => {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};