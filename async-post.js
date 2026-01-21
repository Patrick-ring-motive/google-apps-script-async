/**
 * RECURSIVE ROUTER
 */
function doPost(e) {
  // Check if this is an internal "worker" call or a fresh external request
  const promiseId = e.parameter.promiseId;

  if (promiseId) {
    return doPostAsync(e, promiseId);
  } else {
    return doPostSync(e);
  }
}

/**
 * MASTER: The initial entry point. 
 * Forwards the entire event content to a worker.
 */
function doPostSync(e) {
  const promiseId = initAsync(e);
  
  try {
    const result = waitSync(promiseId);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.message}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * WORKER: Receives the forwarded event and processes it.
 */
function doPostAsync(e, promiseId) {
  const cache = CacheService.getScriptCache();
  (async()=>{
    try {
      // YOUR ACTUAL LOGIC HERE
      // You have access to the original body via e.postData.contents
      const originalData = JSON.parse(e.postData.contents);
      const processedResult = someProcessingFunction(originalData);

      cache.put(promiseId, JSON.stringify(processedResult), 600);
    } catch (err) {
      cache.put(promiseId, JSON.stringify({error: err.message}), 600);
    }
  })();
  return ContentService.createTextOutput("Worker started.");
}

/**
 * Dispatches the internal fetch with the exact same payload
 */
function initAsync(e) {
  const promiseId = `promise-${Utilities.getUuid()}`;
  const cache = CacheService.getScriptCache();
  cache.put(promiseId, 'pending', 600);

  const url = ScriptApp.getService().getUrl() + "?promiseId=" + promiseId;
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: e.postData.contents, // Forwarding the original body
    muteHttpExceptions: true
  };

  UrlFetchApp.fetch(url, options);
  return promiseId;
}

/**
 * Polling loop to block the Master execution until Worker writes to Cache
 */
function waitSync(promiseId) {
  const cache = CacheService.getScriptCache();
  const start = new Date().getTime();
  const timeout = 300000; // 5 minute max wait

  while (true) {
    const res = cache.get(promiseId);
    if (res && res !== 'pending') {
      cache.remove(promiseId);
      return res;
    }
    
    if (new Date().getTime() - start > timeout) {
      throw new Error("Sync Wait Timeout");
    }
    
    Utilities.sleep(500); // Polling interval
  }
}
