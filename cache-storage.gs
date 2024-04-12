
function importCacheStorage() {
  globalThis.cacheStorage = Object.create(null);
  globalThis.cacheStorage.getItem=function(key){
    if(!globalThis.cacheStorageService){
      globalThis.cacheStorageService = CacheService.getScriptCache();
    }
    return globalThis.cacheStorageService.get(key);
  };
  globalThis.cacheStorage.setItem=function(key,value){
    if(!globalThis.cacheStorageService){
      globalThis.cacheStorageService = CacheService.getScriptCache();
    }
    return globalThis.cacheStorageService.put(key,value);
  };
    globalThis.cacheStorage.removeItem=function(key){
    if(!globalThis.cacheStorageService){
      globalThis.cacheStorageService = CacheService.getScriptCache();
    }
    return globalThis.cacheStorageService.remove(key);
  };
}
