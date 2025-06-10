import  React from "react"
import { createContext, useContext, useState } from "react"


const CacheContext = createContext()

export function CacheProvider({ children }) {
  const [cache, setCache] = useState(new Map())

  const getCache = (key) => {
    const item = cache.get(key)
    if (item && item.expires > Date.now()) {
      return item.data
    }
    if (item) {
      cache.delete(key)
      setCache(new Map(cache))
    }
    return null
  }

  const setCacheData = (key, data, ttl = 300000) => {
    const expires = Date.now() + ttl
    const newCache = new Map(cache)
    newCache.set(key, { data, expires })
    setCache(newCache)
  }

  const clearCache = (key) => {
    if (key) {
      const newCache = new Map(cache)
      newCache.delete(key)
      setCache(newCache)
    } else {
      setCache(new Map())
    }
  }

  return (
    <CacheContext.Provider value={{ getCache, setCache: setCacheData, clearCache }}>{children}</CacheContext.Provider>
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (context === undefined) {
    throw new Error("useCache must be used within a CacheProvider")
  }
  return context
}
