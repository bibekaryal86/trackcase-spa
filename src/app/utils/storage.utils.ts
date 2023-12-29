import { SessionStorageItem } from '../types/app.data.types'

export const LocalStorage = {
  getItem: (key: string): unknown => {
    const localStorageItem = localStorage.getItem(key) as string
    return JSON.parse(localStorageItem)
  },

  setItem: (key: string, data: unknown): void => {
    const item = JSON.stringify(data)
    localStorage.setItem(key, item)
  },

  removeItems: (keys: string[]): void => {
    keys.map((key) => localStorage.removeItem(key))
  },

  removeAllItems: (): void => localStorage.clear(),
}

export const SessionStorage = {
  getItem: (key: string): unknown => {
    const sessionStorageItem = sessionStorage.getItem(key) as string
    const item = JSON.parse(sessionStorageItem) as SessionStorageItem

    if (item) {
      if (item.expiry && item.expiry < Date.now()) {
        return null
      }

      return item.data
    }

    return null
  },

  setItem: (key: string, data: unknown, expiry?: number): void => {
    const item = JSON.stringify({ data, expiry })
    sessionStorage.setItem(key, item)
  },
  // example: SessionStorage.setItem(key, data, Date.now() + 100000)
  // or: SessionStorage.setItem(key, data)

  removeItems: (keys: string[]): void => {
    keys.map((key) => sessionStorage.removeItem(key))
  },

  removeAllItems: (): void => sessionStorage.clear(),
}
