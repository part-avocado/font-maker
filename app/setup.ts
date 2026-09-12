import {afterEach} from "vitest";
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(cleanup);

class memoryStorage implements Storage {
    private store = new Map<string, string>();
    get length() {
        return this.store.size;
    }
    clear(): void {
        this.store.clear()
    
    }

    getItem(key: string): string | null {
        return this.store.has(key) ? this.store.get(key)! :null
    }

    key(index: number): string | null {
        return Array.from(this.store.keys())[index] ?? null
    }

    removeItem(key: string): void {
        this.store.delete(key);
    }

    setItem(key: string, value: string): void {
        this.store.set(key, String(value))
    }
}

for (const key of ['localStorage', 'sessionStorage'] as const) {
    Object.defineProperty(window, key, {value: new memoryStorage(), configurable: true});
}

afterEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
});