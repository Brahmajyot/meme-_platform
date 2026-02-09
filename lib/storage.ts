import { Meme } from "@/components/providers/MemeProvider";

const DB_NAME = "MemeDB";
const STORE_NAME = "memes";
const VIDEO_STORE = "videos";
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(VIDEO_STORE)) {
                db.createObjectStore(VIDEO_STORE);
            }
        };
    });
};

export const saveMemeToDB = async (meme: Meme, file?: Blob) => {
    const db = await initDB();
    const tx = db.transaction([STORE_NAME, VIDEO_STORE], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const videoStore = tx.objectStore(VIDEO_STORE);

    // Save metadata
    store.put(meme);

    // Save file if present
    if (file) {
        // Use ID as key for video blob
        videoStore.put(file, meme.id);
    }

    return tx.oncomplete;
};

export const getMemesFromDB = async (): Promise<Meme[]> => {
    const db = await initDB();
    const tx = db.transaction([STORE_NAME, VIDEO_STORE], "readonly");
    const store = tx.objectStore(STORE_NAME);
    const videoStore = tx.objectStore(VIDEO_STORE);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = async () => {
            const memes = request.result as Meme[];
            // Reconstruct URLs for stored blobs
            const videoRequest = videoStore.openCursor();

            // This is async inside async, let's simplify: 
            // We need to fetch all blobs and create ObjectURLs. 
            // For now, let's just get all memes. 
            // Optimization: Only load blobs when needed? 
            // Better: Load all blobs now to reconstruct full state.

            const tasks = memes.map(async (m) => {
                if (m.videoUrl && m.videoUrl.startsWith("blob:")) {
                    // It was a blob URL, we need to recover the blob from DB to create a new URL
                    // Wait, the URL is invalid on reload. We must fetch the blob from DB.
                    const blob = await new Promise<Blob | undefined>((res) => {
                        const r = videoStore.get(m.id);
                        r.onsuccess = () => res(r.result);
                        r.onerror = () => res(undefined);
                    });

                    if (blob) {
                        const newUrl = URL.createObjectURL(blob);
                        return { ...m, videoUrl: newUrl };
                    }
                }
                // Handle image thumbnails if we stored them? 
                // Currently only storing "videoUrl" related blobs.
                // If thumbnail is also a blob URL, we should store/retrieve it too.
                // For simplicity, assuming thumbnails are standard URLs or we handle them similarly if needed.
                return m;
            });

            Promise.all(tasks).then(resolve).catch(reject);
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteMemeFromDB = async (id: string) => {
    const db = await initDB();
    const tx = db.transaction([STORE_NAME, VIDEO_STORE], "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.objectStore(VIDEO_STORE).delete(id);
    return tx.oncomplete;
};
