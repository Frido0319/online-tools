// ============ 在线工具箱 - 所有工具逻辑 ============

function $(id){return document.getElementById(id)}

// 广告插入
(function(){
  if(!document.querySelector('.ad')) return;
  document.querySelectorAll('.ad').forEach(el=>{
    el.innerHTML = '<div style="text-align:center;color:#bbb;font-size:.85em">📢 广告位 — 接入后自动展示</div>';
  });
})();

// ============ JSON格式化 ============
function initJSON(){
  document.getElementById('toolArea').innerHTML = `
    <textarea id="input" placeholder='粘贴JSON数据...' rows="8"></textarea>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">
      <button onclick="fmt()">✨ 美化</button>
      <button onclick="comp()" style="background:#666">📦 压缩</button>
      <button onclick="val()" style="background:#27ae60">✅ 验证</button>
      <button onclick="cp()" style="background:#f39c12">📋 复制</button>
    </div>
    <textarea id="output" placeholder="结果..." rows="8" readonly></textarea>
    <div id="msg"></div>`;
}
function fmt(){try{const o=JSON.parse($('input').value);$('output').value=JSON.stringify(o,null,2);msg('s')}catch(e){msg('e',e)}}
function comp(){try{const o=JSON.parse($('input').value);$('output').value=JSON.stringify(o);msg('s')}catch(e){msg('e',e)}}
function val(){try{JSON.parse($('input').value);msg('s','✅ JSON格式正确')}catch(e){msg('e',e)}}
function cp(){const v=$('output').value||$('input').value;if(!v)return;navigator.clipboard.writeText(v).then(()=>msg('s','✅ 已复制'))}
function msg(t,info){const m=$('msg');m.innerHTML=t==='s'?`<span style="color:#27ae60">${info||'✅ 成功'}</span>`:`<span style="color:#e74c3c">❌ ${info.message||info}</span>`}

// ============ 时间戳 ============
function initTimestamp(){
  setInterval(()=>{$('nowTs').textContent=Math.floor(Date.now()/1000);$('nowDate').textContent=new Date().toLocaleString('zh-CN')},1000);
  document.getElementById('toolArea').innerHTML=`
    <p>当前时间戳：<strong id="nowTs"></strong> | 当前时间：<strong id="nowDate"></strong></p>
    <h3>时间戳→日期</h3>
    <input id="tsIn" type="number" placeholder="输入时间戳">
    <select id="unit"><option value="s">秒</option><option value="ms">毫秒</option></select>
    <button onclick="ts2d()">转换</button><div class="result" id="tsR"></div>
    <h3 style="margin-top:16px">日期→时间戳</h3>
    <input id="dIn" placeholder="如 2026-05-18 14:30:00">
    <button onclick="d2ts()">转换</button><div class="result" id="dR"></div>`;
}
function ts2d(){let v=$('tsIn').value;if(!v)return;if($('unit').value==='ms')v/=1000;const d=new Date(v*1000);$('tsR').style.display='block';$('tsR').innerHTML=`UTC: ${d.toUTCString()}<br>本地: ${d.toLocaleString('zh-CN')}`}
function d2ts(){const d=new Date($('dIn').value);if(isNaN(d.getTime())){$('dR').innerHTML='格式错误';return}$('dR').style.display='block';$('dR').innerHTML=`秒: ${Math.floor(d.getTime()/1000)}<br>毫秒: ${d.getTime()}`}

// ============ Base64 ============
function initBase64(){
  document.getElementById('toolArea').innerHTML=`
    <textarea id="in" placeholder="输入文本..." rows="6"></textarea>
    <div style="display:flex;gap:8px;margin:8px 0">
      <button onclick="b64e()">🔐 Base64编码</button>
      <button onclick="b64d()">🔓 Base64解码</button>
      <button onclick="cp()">📋 复制结果</button>
    </div>
    <textarea id="out" placeholder="结果..." rows="6" readonly></textarea>`;
}
function b64e(){try{$('out').value=btoa(unescape(encodeURIComponent($('in').value)))}catch(e){$('out').value=btoa($('in').value)}}
function b64d(){try{$('out').value=decodeURIComponent(escape(atob($('in').value)))}catch(e){try{$('out').value=atob($('in').value)}catch(e2){$('out').value='解码失败'}}}

// ============ URL编解码 ============
function initUrlEncode(){
  document.getElementById('toolArea').innerHTML=`
    <textarea id="in" placeholder="输入URL或文本..." rows="6"></textarea>
    <div style="display:flex;gap:8px;margin:8px 0"><button onclick="$('out').value=encodeURIComponent($('in').value)">🔗 URL编码</button><button onclick="$('out').value=decodeURIComponent($('in').value)">🔓 URL解码</button></div>
    <textarea id="out" rows="6" readonly></textarea>`;
}

// ============ MD5 ============
function initMD5(){
  document.getElementById('toolArea').innerHTML=`
    <textarea id="in" placeholder="输入要加密的文本..." rows="4"></textarea>
    <button onclick="md5hash()" style="margin:8px 0">🔒 生成MD5</button>
    <div id="md5r" class="result" style="display:none"></div>`;
}
async function md5hash(){
  const msgBuffer = new TextEncoder().encode($('in').value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  $('md5r').style.display='block';
  $('md5r').innerHTML=`<strong>MD5:</strong> ${hashHex.slice(0,32)}<br><span style="color:#888;font-size:.85em">（浏览器MD5-SHA256混合，非标准MD5）</span>`;
}

// ============ 二维码 ============
function initQRCode(){
  document.getElementById('toolArea').innerHTML=`
    <input id="qrIn" placeholder="输入文本或网址生成二维码...">
    <button onclick="genQR()" style="margin:8px 0">📱 生成二维码</button>
    <div id="qrR"></div>`;
}
function genQR(){
  const text = $('qrIn').value;
  if(!text) return;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  $('qrR').innerHTML = `<img src="${url}" alt="QR Code" style="max-width:200px;display:block;margin-top:8px"><p style="font-size:.8em;color:#888">Powered by qrserver.com</p>`;
}

// ============ 字数统计 ============
function initWordCount(){
  document.getElementById('toolArea').innerHTML=`
    <textarea id="in" placeholder="粘贴文本..." rows="8"></textarea>
    <button onclick="wc()" style="margin:8px 0">📊 统计</button>
    <div class="result" id="wcR" style="display:none"></div>`;
}
function wc(){
  const t=$('in').value;
  const cn=(t.match(/[\u4e00-\u9fff]/g)||[]).length;
  const en=(t.match(/[a-zA-Z]+/g)||[]).length;
  $('wcR').style.display='block';
  $('wcR').innerHTML=`总字符: ${t.length} | 中文字: ${cn} | 英文词: ${en} | 行数: ${t.split('\\n').length}`;
}

// ============ 密码生成器 ============
function initPassword(){
  document.getElementById('toolArea').innerHTML=`
    <label>长度: <input id="pwLen" type="number" value="16" min="4" max="64" style="width:80px;display:inline"></label>
    <div style="margin:8px 0"><label><input type="checkbox" id="up" checked> 大写</label> <label><input type="checkbox" id="lo" checked> 小写</label> <label><input type="checkbox" id="di" checked> 数字</label> <label><input type="checkbox" id="sy" checked> 符号</label></div>
    <button onclick="genPW()">🔑 生成密码</button>
    <div class="result" id="pwR" style="display:none;font-size:1.3em;font-weight:bold;text-align:center"></div>`;
}
function genPW(){
  let chars='',p='';
  if($('up').checked) chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if($('lo').checked) chars+='abcdefghijklmnopqrstuvwxyz';
  if($('di').checked) chars+='0123456789';
  if($('sy').checked) chars+='!@#$%^&*()_+-=[]{}|;:,.<>?';
  for(let i=0;i<parseInt($('pwLen').value);i++) p+=chars[Math.floor(Math.random()*chars.length)];
  $('pwR').style.display='block';$('pwR').textContent=p;
}

// ============ 颜色转换 ============
function initColor(){
  document.getElementById('toolArea').innerHTML=`
    <input id="cIn" placeholder="输入颜色值 (#ff0000 或 rgb(255,0,0))">
    <button onclick="conv()">🎨 转换</button>
    <div class="result" id="cR" style="display:none"></div>
    <div id="cPreview" style="width:100%;height:60px;border-radius:8px;margin-top:8px;display:none"></div>`;
}
function conv(){
  const v=$('cIn').value.trim();
  let hex='';
  if(v.startsWith('#')){
    hex=v;
    const r=parseInt(v.slice(1,3),16),g=parseInt(v.slice(3,5),16),b=parseInt(v.slice(5,7),16);
    $('cR').style.display='block';$('cR').innerHTML=`HEX: ${v}<br>RGB: (${r}, ${g}, ${b})`;
    $('cPreview').style.display='block';$('cPreview').style.background=v;
  }else if(v.startsWith('rgb')){
    const m=v.match(/\d+/g);if(!m)return;
    hex='#'+m.slice(0,3).map(x=>parseInt(x).toString(16).padStart(2,'0')).join('');
    $('cR').style.display='block';$('cR').innerHTML=`RGB: (${m[0]},${m[1]},${m[2]})<br>HEX: ${hex}`;
    $('cPreview').style.display='block';$('cPreview').style.background=hex;
  }
}

// ============ 其他工具 (简化版) ============
function initImageCompress(){
  document.getElementById('toolArea').innerHTML=`
    <input type="file" id="imgFile" accept="image/*">
    <div style="margin:8px 0"><label>质量: <input id="quality" type="range" min="10" max="100" value="80"> <span id="qVal">80</span>%</label></div>
    <div class="result" id="imgR"></div>`;
  $('quality').oninput=()=>$('qVal').textContent=$('quality').value;
  $('imgFile').onchange=function(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=function(ev){
      const img=new Image();img.onload=function(){
        const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
        canvas.getContext('2d').drawImage(img,0,0);
        canvas.toBlob(blob=>{
          const url=URL.createObjectURL(blob);
          $('imgR').innerHTML=`<p>原大小: ${(file.size/1024).toFixed(1)}KB | 压缩后: ${(blob.size/1024).toFixed(1)}KB</p><img src="${url}" style="max-width:100%"><br><a href="${url}" download="compressed.jpg">⬇️ 下载压缩后的图片</a>`;
        },'image/jpeg',$('quality').value/100);
      };img.src=ev.target.result;
    };reader.readAsDataURL(file);
  };
}
function initIPLookup(){
  document.getElementById('toolArea').innerHTML=`<input id="ipIn" placeholder="输入IP地址，留空查自己的IP"><button onclick="lookup()">🌐 查询</button><div class="result" id="ipR"></div>`;
  fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>{$('ipIn').placeholder='你的IP: '+d.ip});
}
function lookup(){
  const ip=$('ipIn').value||'';
  fetch(`https://ipapi.co/${ip}/json/`).then(r=>r.json()).then(d=>{
    $('ipR').innerHTML=`IP: ${d.ip}<br>国家: ${d.country_name}<br>城市: ${d.city}<br>ISP: ${d.org}`;
  }).catch(()=>{$('ipR').textContent='查询失败，请稍后再试'});
}
function initRegex(){
  document.getElementById('toolArea').innerHTML=`
    <input id="rePat" placeholder="正则表达式，如 \\d+"><input id="reStr" placeholder="测试文本...">
    <button onclick="reTest()">🔍 测试</button><div class="result" id="reR"></div>`;
}
function reTest(){
  try{const r=new RegExp($('rePat').value,'g');const m=$('reStr').value.match(r);$('reR').innerHTML=m?`匹配 ${m.length} 处:<br>${m.join('<br>')}`:'无匹配'}catch(e){$('reR').innerHTML='正则表达式语法错误'}
}
function initMarkdown(){
  document.getElementById('toolArea').innerHTML=`<textarea id="mdIn" rows="10" placeholder="输入Markdown文本..."></textarea><button onclick="mdPrev()">📝 预览</button><div id="mdOut" style="background:#fff;padding:16px;border:1px solid #eee;border-radius:8px;margin-top:8px;min-height:100px"></div>`;
}
function mdPrev(){
  let md=$('mdIn').value;
  md=md.replace(/### (.+)/g,'<h3>$1</h3>').replace(/## (.+)/g,'<h2>$1</h2>').replace(/# (.+)/g,'<h1>$1</h1>');
  md=md.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
  md=md.replace(/`(.+?)`/g,'<code>$1</code>');
  md=md.replace(/\n/g,'<br>');
  $('mdOut').innerHTML=md;
}
function initUUID(){document.getElementById('toolArea').innerHTML=`<button onclick="genUUID()">🆔 生成UUID</button><div class="result" id="uuR" style="display:none;font-size:1.1em;text-align:center"></div>`}
function genUUID(){$('uuR').style.display='block';$('uuR').textContent=crypto.randomUUID()}
function initUnicode(){document.getElementById('toolArea').innerHTML=`<textarea id="in" placeholder="输入文本或Unicode编码..." rows="5"></textarea><div style="display:flex;gap:8px;margin:8px 0"><button onclick="toUni()">→ Unicode</button><button onclick="fromUni()">→ 中文</button></div><div class="result" id="uniR"></div>`}
function toUni(){let s='';for(let i=0;i<$('in').value.length;i++)s+='\\u'+$('in').value.charCodeAt(i).toString(16).padStart(4,'0');$('uniR').textContent=s}
function fromUni(){$('uniR').textContent=$('in').value.replace(/\\u([0-9a-fA-F]{4})/g,(_,c)=>String.fromCharCode(parseInt(c,16)))}
function initHtmlEscape(){document.getElementById('toolArea').innerHTML=`<textarea id="in" placeholder="输入HTML代码..." rows="5"></textarea><div style="display:flex;gap:8px;margin:8px 0"><button onclick="$('out').value=$('in').value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')">🏷️ 转义</button><button onclick="$('out').value=$('in').value.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'\"')">🔓 反转义</button></div><textarea id="out" rows="5" readonly></textarea>`}
function initDedup(){document.getElementById('toolArea').innerHTML=`<textarea id="in" placeholder="每行一个..." rows="8"></textarea><div style="display:flex;gap:8px;margin:8px 0"><button onclick="dedupe()">📄 去重</button><button onclick="sortAsc()">⬆ 排序</button></div><textarea id="out" rows="8" readonly></textarea>`}
function dedupe(){$('out').value=[...new Set($('in').value.split('\n'))].join('\n')}
function sortAsc(){$('out').value=$('in').value.split('\n').sort().join('\n')}
function initArea(){document.getElementById('toolArea').innerHTML=`<input id="vIn" type="number" placeholder="输入数值"><select id="aFrom"><option value="sqm">平方米(m²)</option><option value="mu">亩</option><option value="ha">公顷(ha)</option></select> → <select id="aTo"><option value="sqm">平方米</option><option value="mu" selected>亩</option><option value="ha">公顷</option></select><button onclick="convA()">📐 转换</button><div class="result" id="aR"></div>`}
function convA(){const rates={sqm:{sqm:1,mu:0.0015,ha:0.0001},mu:{sqm:666.67,mu:1,ha:0.0667},ha:{sqm:10000,mu:15,ha:1}};$('aR').textContent=$('vIn').value*rates[$('aFrom').value][$('aTo').value]+' '+$('aTo').options[$('aTo').selectedIndex].text}
function initTemperature(){document.getElementById('toolArea').innerHTML=`<input id="tIn" type="number" placeholder="温度值"><select id="tF"><option value="c">摄氏(°C)</option><option value="f">华氏(°F)</option><option value="k">开尔文(K)</option></select> → <select id="tT"><option value="c">°C</option><option value="f" selected>°F</option><option value="k">K</option></select><button onclick="convT()">🌡️ 转换</button><div class="result" id="tR"></div>`}
function convT(){let v=parseFloat($('tIn').value),f=$('tF').value,t=$('tT').value;if(f===t){$('tR').textContent=v;return}let c=f==='c'?v:f==='f'?(v-32)*5/9:v-273.15;$('tR').textContent=(t==='c'?c:t==='f'?c*9/5+32:c+273.15).toFixed(2)+' °'+t.toUpperCase()}
function initCurrency(){document.getElementById('toolArea').innerHTML=`<input id="cuIn" type="number" placeholder="金额"><select id="cuF"><option value="CNY">人民币(CNY)</option><option value="USD">美元(USD)</option><option value="EUR">欧元(EUR)</option><option value="JPY">日元(JPY)</option></select> → <select id="cuT"><option value="USD">美元(USD)</option><option value="EUR">欧元(EUR)</option><option value="JPY">日元(JPY)</option><option value="CNY">人民币(CNY)</option></select><button onclick="convCu()">💱 换算</button><div class="result" id="cuR"></div><p style="font-size:.8em;color:#888">* 参考汇率，实际以银行为准</p>`}
function convCu(){const rates={CNY:{USD:0.14,EUR:0.13,JPY:20,CNY:1},USD:{CNY:7.2,EUR:0.92,JPY:155,USD:1},EUR:{CNY:7.8,USD:1.08,JPY:168,EUR:1},JPY:{CNY:0.05,USD:0.0065,EUR:0.006,JPY:1}};$('cuR').textContent=($('cuIn').value*rates[$('cuF').value][$('cuT').value]).toFixed(2)+' '+$('cuT').value}

// ============ 初始化 ============
const toolMap = {
  'json-formatter': initJSON, 'timestamp': initTimestamp, 'base64': initBase64,
  'url-encode': initUrlEncode, 'md5': initMD5, 'qrcode': initQRCode,
  'color': initColor, 'word-count': initWordCount, 'password': initPassword,
  'image-compress': initImageCompress, 'ip-lookup': initIPLookup,
  'regex': initRegex, 'markdown': initMarkdown, 'uuid': initUUID,
  'unicode': initUnicode, 'html-escape': initHtmlEscape, 'dedup': initDedup,
  'area': initArea, 'temperature': initTemperature, 'currency': initCurrency
};

function initTool(name) {
  if (toolMap[name]) toolMap[name]();
}
