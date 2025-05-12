import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { promises } from 'node:dns';

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
  private dbReady: Promise<void> = new Promise<void>(() => {});
  private dbReadyResolve!: () => void;



  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.dbReady = new Promise<void>((resolve) => {
        this.dbReadyResolve = resolve;
      });
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
    console.log('DB opened successfully');
    this.db = request.result;
    this.dbReadyResolve();
  };

  request.onerror = () => {
    console.error('DB open error:', request.error);
  };
}


  async saveTask(task: any): Promise<void> {
    await this.dbReady;
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
    await this.dbReady;
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
    await this.dbReady; 
    console.log('DB:', this.db);
    if (!this.db) return [];
    console.log('getTasksByUser it run as well');
    
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
