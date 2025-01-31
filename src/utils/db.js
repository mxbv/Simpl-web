import { openDB } from "idb";

const DB_NAME = "notesDB"; // Имя базы данных
const STORE_NAME = "notes"; // Имя хранилища

export const openDatabase = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveNoteToDB = async (note) => {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const rawNote = JSON.parse(JSON.stringify(note)); // Убираем реактивность

  await store.put(rawNote);
  await tx.done;
};

export const getNotesFromDB = async () => {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return store.getAll();
};

export const deleteNoteFromDB = async (id) => {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};
