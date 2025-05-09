import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

export interface Task {
  id: string;
  userId: string;
  name: string;
  email: string;
  task: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private dbName = 'TaskDB';
  private storeName = 'tasks';
  private db: IDBDatabase | null = null;
  

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initDB();
    }
  }

  private initDB(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }
    };

    request.onsuccess = () => {
      this.db = request.result;
    };

    request.onerror = () => {
      console.error('IndexedDB initialization error:', request.error);
    };
  }

  async saveTask(task: any): Promise<void> {
    console.log(task);
    
    if (!this.db) return;

    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.put(task);
    console.log("it's work");

    await this.getTasksByUser(task.id);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.delete(taskId);
    console.log('delete task');
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    if (!this.db) return [];

    const tx = this.db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    const index = store.index('userId');
    const request = index.getAll(userId);
console.log(request.onsuccess);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Task[]);
      request.onerror = () => reject(request.error);
    });
  }
}
