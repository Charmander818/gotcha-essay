import { MCQ } from '../types';

const DB_NAME = 'cie_econ_mcq_db';
const STORE_NAME = 'mcqs';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getMCQs = async (): Promise<MCQ[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
        const mcqs: MCQ[] = request.result;
        // Fix for old duplicated topics before resolving
        const fixedMcqs = mcqs.map(q => {
            if (q.topic) {
                // regex fixes "1.1 1.1 Scarcity" into "1.1 Scarcity"
                q.topic = q.topic.replace(/^(\d+\.\d+)\s+\1\s+/, '$1 ');
            }
            return q;
        });
        resolve(fixedMcqs);
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveMCQ = async (mcq: MCQ): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(mcq);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const deleteMCQ = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getAllMCQsForExport = async (): Promise<string> => {
  const mcqs = await getMCQs();
  return JSON.stringify(mcqs);
};

export const restoreMCQsFromImport = async (jsonString: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonString) as MCQ[];
    if (!Array.isArray(data)) throw new Error("Invalid file format");
    
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      let count = 0;
      data.forEach(item => {
        if(item.id && item.paper && item.imageUrl) {
            store.put(item);
            count++;
        }
      });
      
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (e) {
    throw e;
  }
};

