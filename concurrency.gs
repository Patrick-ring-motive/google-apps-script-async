


importCacheStorage();
globalThis.req={};
Logger.log(globalThis)

function add(a,b){
  return a+b;
}

function doGet(req) {
  globalThis.req=req;
  try{
    let res='';
    if(req?.parameter?.['promiseid']){
      res = doAsync(req);
      return ContentService.createTextOutput(res).setMimeType(ContentService.MimeType.CSV);
    }else{
      res = doSync(req);
      console.log(res);
    }
    return ContentService.createTextOutput(res);
  }catch(e){
    console.log(e.message+'\n'+e.stack);
    return ContentService.createTextOutput(e.message+'\n'+e.stack);
  }
}


function test(){

}

function doSync(req){               
    let prom = ASYNC('add',[1,2]);
    return AWAIT(prom);
}

function ASYNC(func,parr){
  const promiseid = `promiseid${new Date().getTime()}${Math.random()}`.replaceAll('.','');
  console.log(promiseid)
    cacheStorage.setItem(promiseid, 'pending');
    let params='';
      try{
        params = encodeURIComponent(JSON.stringify(parr));
      }catch(e){
        params = encodeURIComponent(`${req?.parameter?.['params']}`);
      }
    const urlString = `${ScriptApp.getService().getUrl()}${(req?.pathInfo||'')}?promiseid=${promiseid}&func=${encodeURIComponent(func)}&params=${params}`;
    console.log(urlString);
    UrlFetchApp.fetch(urlString);
  return promiseid;
}

function AWAIT(promiseid){
  let nextStep = cacheStorage.getItem(promiseid);
  let exponentialBackoff = 1;
  while((nextStep=='pending')||(nextStep==null)){
    Utilities.sleep(20 + exponentialBackoff);
    nextStep = cacheStorage.getItem(promiseid);
    exponentialBackoff *= 2;
    if(exponentialBackoff>5000){
      cacheStorage.setItem(promiseid, 'timeout');
    }
  }
  cacheStorage.removeItem(promiseid);
  return nextStep;
}

async function doAsync(req){              
  let par = [];
  try{
    par = JSON.parse(decodeURIComponent(req?.parameter?.['params']));
  }catch(e){}
  try{
  let res = `${globalThis[decodeURIComponent(req?.parameter?.['func'])]?.(...par)}`;
  return cacheStorage.setItem(req.parameter['promiseid'], res);
  }catch(e){
    return cacheStorage.setItem(req.parameter['promiseid'], e.message);
  }
}
