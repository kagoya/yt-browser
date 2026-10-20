/* PyodideをUIスレッドから分離する。動画取得は行わず、メタデータ解析だけを試す。 */
const say=message=>postMessage({kind:'log',message});
const step=(name,value)=>postMessage({kind:'step',step:name,value});
let running=false;
onmessage=async({data})=>{
 if(running)return;running=true;const start=performance.now();
 try{
  say('Pyodide JavaScriptローダーを取得します');
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js');
  const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/'});
  step('load','Pyodide成功');say('Pyodideロード成功：'+((performance.now()-start)/1000).toFixed(2)+' 秒');
  say('micropipを読み込み、yt-dlpのインストールを試します');
  await py.loadPackage('micropip');
  await py.runPythonAsync("import micropip\nawait micropip.install('yt-dlp')");
  py.runPython('import yt_dlp; import importlib.metadata as m');
  say('yt-dlp import成功：'+py.runPython("m.version('yt-dlp')"));step('call','yt-dlp import成功');
  if(!data.network){say('ネットワーク解析なし：パッケージの実行環境確認だけで終了');step('result','スキップ');postMessage({kind:'done',ok:true});return}
  say('yt-dlp.extract_info(download=False)で動画メタデータを試行します');
  const code=`import yt_dlp, json, traceback\nfrom pyodide.http import pyfetch\ntry:\n    with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True, 'skip_download': True, 'socket_timeout': 12, 'retries': 0, 'extractor_retries': 0}) as ydl:\n        info = ydl.extract_info(${JSON.stringify(data.url)}, download=False)\n    output=json.dumps({'id':info.get('id'),'title':info.get('title'),'duration':info.get('duration'),'formats':len(info.get('formats',[]))},ensure_ascii=False)\nexcept Exception:\n    output='ERROR: '+traceback.format_exc()\noutput`;
  const output=await py.runPythonAsync(code);
  say(String(output).slice(0,5000));const ok=!String(output).startsWith('ERROR:');step('result',ok?'取得成功':'解析失敗');postMessage({kind:'done',ok});
 }catch(e){say('ERROR '+(e?.stack||e?.message||String(e)).slice(0,5000));postMessage({kind:'done',ok:false})}
};
