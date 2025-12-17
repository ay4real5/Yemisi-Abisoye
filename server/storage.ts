// Updated and cleaned up the storage.ts file
export interface Storage {
  saveData(data: string): void;
  fetchData(): string;
}

class LocalStorage implements Storage {
  saveData(data: string): void {
    localStorage.setItem('key', data);
  }

  fetchData(): string {
    const data = localStorage.getItem('key');
    return data ? data : '';
  }
}

export const storageInstance: Storage = new LocalStorage();