textWidth=7.8;
function formatList() {
  res = [];
  try {value = editor.getValue();}
  catch(err) {value = document.getElementById("input").value;}
  let arr = value.split(/\r?\n/);
  table = []; tableTime = false;
  quote = []; quoteTime = false;
  copyright = []; copyrightTime = false;
  ascii = []; asciiTime = false;
  header = []; headerTime = false;
  twobox = []; twoboxTime = false;
  threeboxTime = []; threeboxTime = false;
  text = []; textTime = false;
  list = []; listTime = false; olistTime = false;
  rot=[]; rotTime = false; blink=[]; blinkTime = false;
  progress = []; progressTime = false; hideTime = false;
  command = []; commandTime = false;
  code = []; codeTime = false;
  image=[];imageTime = false;
  adTime=false;stockTime=false;networkTime=false;themeTime=false;
  arr.forEach((item) => {
      if(hideTime == true && !item.startsWith("#endhidden")&&!item.startsWith("#endnon-ascii")){return;}      
      if (!codeTime&&(item.startsWith("#hidden")||item.startsWith("#non-ascii"))) { hideTime = true;
      } else if (!codeTime&&(item.startsWith("#endhidden")||item.startsWith("#endnon-ascii"))) { hideTime = false;

      } else if (item.startsWith("#code")) { code=[];codeTime = true;
      } else if (item.startsWith("#endcode")) { codeTime = false;codeon="<pre>"
      for (i in code) {if(i==0){codeon+=code[i]+" ";}else{codeon+="\n"+code[i]+" "}}res.push(codeon+"</pre>")
      } else if (codeTime == true) { code.push(item);

      } else if (item.match(/#gridmail (.+?)\b/) || item.match(/#link (.+?)( |$)/) || item.match(/#topiclink \d+ (.+?)#endtopiclink/) || item.match(/#anchorlink .+? (.+?)#endanchorlink/) || item.match(/#color (.+?) (.+?)#endcolor\b/)) {
          try { regexMatch = item.match(/#gridmail (.+?)\b/);regexMatch = regexMatch[1]; regexMatch += "@nlm.wc";regexMatch = "<bright>"+regexMatch+'</bright>';item = item.replace(/#gridmail (.+?)\b/,regexMatch); } catch {}
          try { regexMatch=item.match(/#link (.+?)($| )/g);i=0;while (i<regexMatch.length) {regexHolder=regexMatch[i].match(/#link (.+?)($| )/);link=regexHolder[1];finalElem=`<a href="/public/${link}">`+link+`</a>`;item=item.replace("#link "+link,finalElem);i++;} } catch {}
          try { regexMatch=item.match(/#topiclink \d+ (.+?)#endtopiclink/g);i=0;while (i<regexMatch.length) {regexHolder=regexMatch[i].match(/#topiclink (\d+) (.+?)#endtopiclink/);link=regexHolder[2];finalElem=`<a href="">`+link+`</a>`;item=item.replace("#topiclink "+regexHolder[1]+" "+link+"#endtopiclink",finalElem);i++;} } catch {}
          try { regexMatch=item.match(/#anchorlink .+? (.+?)#endanchorlink/g);i=0;while (i<regexMatch.length) {regexHolder=regexMatch[i].match(/#anchorlink (.+?) (.+?)#endanchorlink/);link=regexHolder[2];finalElem=`<a href="/public/${regexHolder[1]}">`+link+`</a>`;item=item.replace("#anchorlink "+regexHolder[1]+" "+link+"#endanchorlink",finalElem);i++;}} catch {}
          try {regexMatch=item.match(/#color (.+?) (.+?)#endcolor\b/g);i=0;while (i<regexMatch.length) {regexHolder=regexMatch[i].match(/#color (.+?) (.+?)#endcolor\b/);color=regexHolder[1];message=regexHolder[2];finalElem=`<${color}>`+message+`</${color}>`;item=item.replace("#color "+color+" "+message+"#endcolor",finalElem);i++;}} catch {}
          res.push(`<p>${item}</p>`);

      } else if (item.startsWith("#command")) { command=[];commandTime = true;
      } else if (item.startsWith("#endcommand")) { commandTime = false;comm=command[0].trim();
      res.push(`<p>${comm.padEnd(40," ")}=> ${command[1].trim()}</p>`)
      } else if (commandTime == true) { command.push(item);

      } else if (item.startsWith("#blinking-text")) { blink=[];blinkTime = true;
      } else if (item.startsWith("#endblinking-text")) { blinkTime = false;res.push(`<p class="${blink[0]}"><bl>${blink[1]}</bl></p>`)
      } else if (blinkTime == true) { blink.push(item);
      
      } else if (item.startsWith("#unordered-list")) { list = []; listTime = true;
      } else if (item.startsWith("#endunordered-list")) { listTime = false;color=list[0];res.push(`<ul class="${color} lis">`)
        for (i in list) { if (i<1) {} else { res.push(`<li>`+list[i].trim()+`</li>`)}}res.push(`</ul>`)
      } else if (listTime == true) { list.push(item.trim()) 

      } else if (item.startsWith("#ordered-list")) { list = []; olistTime = true;
      } else if (item.startsWith("#endordered-list")) { olistTime = false;color=list[0];u=0;res.push(`<ol class="${color} lis">`);nested=false;
        for (i in list) { if (i<1) {} else { u=Number(i)+1;
            if (list[i].startsWith("-") && nested==false) {
                res.push(`<ol type="a"><li>`+list[i].trim().replace(/^-/,"")+`</li>`);nested=true;
                if(typeof list[u]!="string"){res.push(`</ol>`)}
            } else if (nested==true && !list[i].startsWith("-")) {
                res.push(`</ol><li>`+list[i].trim()+`</li>`);nested=false;if(typeof list[u]!="string"){res.push(`</ol>`)}
            } else {res.push(`<li>`+list[i].trim().replace(/^-/,"")+`</li>`);}}}res.push(`</ol></ol>`);
      } else if (olistTime == true) { list.push(item.trim()) 

      } else if (item.startsWith("#table")) { table = []; tableTime = true;
      } else if (item.startsWith("#endtable")) { tableTime = false; createTable(table,res);
      } else if (tableTime == true) { table.push(item.trim()) 

      } else if (item.startsWith("#rotating-message")) { rot=[];rotTime = true;
      } else if (item.startsWith("#endrotating-message")) { rotTime = false;random=Math.floor(Math.random()*(rot.length-1))+1;res.push(`<p class="${rot[0]}">${rot[random]}</p>`)
      } else if (rotTime == true) { rot.push(item);
      
      } else if (item.startsWith("#image")) { image=[];imageTime = true;
      } else if (item.startsWith("#endimage")) { imageTime = false;res.push(`<p>Image: <a href='${image[1].trim()}'>${image[1].trim()}</a>\n[OOC: You may access this image and treat it as if you saw it in character.]</p>`)
      } else if (imageTime == true) { image.push(item);

      } else if (item.startsWith("#ad")) {res.push(`<div><blockquote><p style="margin:0px;text-align:center">Cordoba Mallplex: Shop Till You Drop!</p></blockquote></div>`);adTime=true;
      } else if (item.startsWith("#endad")) {adTime=false;
      } else if (adTime==true) {
        
      } else if (item.startsWith("#stock")) {res.push(`<div><blockquote><p style="margin:0px;text-align:center">Corpshare price for NLM: 123.456789c</p></blockquote></div>`);stockTime=true;
      } else if (item.startsWith("#endstock")) {stockTime=false;
      } else if (stockTime==true) {

      } else if (item.startsWith("#network-device")){networkTime=true;res.push('<p>[Network Device Offline]</p>')
      } else if (item.startsWith("#endnetwork-device")){networkTime=false;
      } else if (networkTime==true) {
        
      } else if (item.startsWith("#theme")){themeTime=true;
      } else if (item.startsWith("#endtheme")){themeTime=false;
      } else if (themeTime==true) {

      } else if (item.startsWith("#ascii")) { asciiTime = true; ascii = [];
      } else if (item.startsWith("#endascii")) { asciiTime = false; art = ascii.slice(1); art=art.join("\n"); res.push(`<div title="${ascii[0]}" style="white-space:break-spaces">${art}</div>`);
      } else if (asciiTime == true) { ascii.push(item);
      
      } else if (item.startsWith("#weather")) { 
res.push("<div title='Cloudy' style='white-space:break-spaces'>          .--.            .--.    \n       .-(    ).       .-(    ).  \n      (___.__)__)     (___.__)__) \n   .-(          ). .-(          ). \n  (___.__)__)(__)(___.__)__)(___.)\n\n                Cloudy</div>");
      } else if (item.startsWith("#endweather")) { 

      } else if (item.startsWith("#text")) { text = []; textTime = true;
      } else if (item.startsWith("#endtext")) { textTime = false; wrap=Number(text[0]);wrap*=textWidth;textHolder=`<div class="text" style="width:${wrap}px"><p>`;
        for (i in text) { if (i==0) {} else if (text[i]==""){textHolder+="<nb>&nbsp;</nb>";} else if (i==1) {textHolder+=text[i].trim();}else{textHolder+="\n"+text[i].trim();}}res.push(textHolder+"</p></div>");
      } else if (textTime == true) { text.push(item.trim()) 
      //https://honorless.net/progressbar.htm
      } else if (item.startsWith("#progress-bar")) { progress = []; progressTime = true;
      } else if (item.startsWith("#endprogress-bar")) { progressTime = false;
        complete=progress[0];uncomplete=progress[1];suffix=progress[2];length=progress[3];prog=progress[4];
        progy=prog*0.01 || 0;completeLength=Math.round(length*progy);width=length*5;
        bar = `<div class="progress" style="margin:auto;text-align:center;display:grid;grid-template-columns:auto auto;width:${width}px;" title="${prog}%"><div style="text-align:left;margin:6px auto 0px auto;overflow:hidden;width:inherit;border-radius:9px;height:5px;" class="progress bg${uncomplete}"><div style="height:14px;width: ${prog}%;" class="bg${complete}"></div></div><p class="${suffix}" style="margin-left:5px;">${prog}%</p></div>`
        res.push(bar);
      } else if (progressTime == true) { progress.push(item.trim());

      } else if (item.startsWith("#quote")) { quote = []; quoteTime = true;
      } else if (item.startsWith("#endquote")) {
        quoteTime = false;
        res.push(`<div><blockquote><p style="margin:0px;text-align:center">"${quote[0]}"</p><p style="margin:0px;text-align:center">-- ${quote[1]}, ${quote[2]}</p></blockquote></div>`);
      } else if (quoteTime == true) { quote.push(item.trim());

      } else if (item.startsWith("#copyright")) { copyright = []; copyrightTime = true;
      } else if (item.startsWith("#endcopyright")) {
        copyrightTime = false;
        cop = "Copyright " + copyright[1] + " by " + copyright[0] +".";
        res.push(`<div><blockquote><p style="margin:0px;text-align:center">${cop}</p></blockquote></div>`);
      } else if (copyrightTime == true) { copyright.push(item.trim());

      } else if (item.startsWith("#header")) { header = []; headerTime = true;
      } else if (item.startsWith("#endheader")) {
        headerTime = false;
        headerCenter = `<h1 class="${header[0]}">${header[1]}</h1>`;
        res.push(headerCenter);
      } else if (headerTime == true) { header.push(item.trim())

      } else if (item.startsWith("#two-box")) { twobox = []; twoboxTime = true;
      } else if (item.startsWith("#endtwo-box")) { twoboxTime=false;
        padding = Number(twobox[0].trim());wrap=Number(twobox[1].trim());spacing=Number(twobox[2].trim());
        box1=twobox[3].trim();box2=twobox[4].trim();wrap*=textWidth;
        finalBox=`<div class="conTwo" style="gap:${spacing}px"><div class="box1 bg" style="padding:${padding}px;width:${wrap}px">${box1}</div><div class="box2 bg" style="padding:${padding}px;width:${wrap}px">${box2}</div></div>`;res.push(finalBox);
      } else if (twoboxTime == true) { twobox.push(item.trim())

      } else if (item.startsWith("#three-box")) { threebox = []; threeboxTime = true;
      } else if (item.startsWith("#endthree-box")) { threeboxTime=false;
        padding=Number(threebox[0].trim());wrap=Number(threebox[1].trim());spacing=Number(threebox[2].trim());
        box1=threebox[3].trim();box2=threebox[4].trim();box3=threebox[5].trim();wrap*=textWidth;
        finalBox=`<div class="con" style="gap:${spacing}px"><div class="box1 bg" style="padding:${padding}px;width:${wrap}px">${box1}</div><div class="box2 bg" style="padding:${padding}px;width:${wrap}px">${box2}</div><div class="box3 bg" style="padding:${padding}px;width:${wrap}px">${box3}</div></div>`;res.push(finalBox);
      } else if (threeboxTime == true) { threebox.push(item.trim());
      
      } else if (item.startsWith("#node-acl")){ res.push('<p>ACL: </p>')
      } else if (item.startsWith("#endnode-acl")){
      
      } else if (item!=""&&item!=" "&&item!="&nbsp;"){ res.push(`<p>${item}</p>`); 
      } else { res.push("<nb>&nbsp;</nb>")}
  });

  const textarea = document.getElementById("output");
  formattedArray = res.join("\n");textarea.innerHTML = formattedArray;
}

// Made by ozh (https://github.com/ozh/ascii-tables)
function createTable(table, res) {
    input = table.join("\n"); separator = '|';
    rows = input.split(/[\r\n]+/);
    if (rows[rows.length - 1] == "") { rows.pop(); }
    // calculate the max size of each column
    colLengths = []; isNumberCol = [];
    for (var i = 0; i < rows.length; i++) {
        rows[i] = rows[i].trim();rows[i] = rows[i].replace(/\t/g, "    ");
        var cols = rows[i].split(separator);
        for (var j = 0; j < cols.length; j++) {
            var data = cols[j]; var isNewCol = colLengths[j] == undefined;
            if (isNewCol) { isNumberCol[j] = true; }
            if (isNumberCol[j] && !data.match(/^(\s*-?(\d|,| |[.])*\s*)$/)) { isNumberCol[j] = false; }
            if (isNewCol || colLengths[j] < data.length) { colLengths[j] = data.length; }
        }
    }
    var output = "";hasHeaders=true;
    var outputTable = '<table>';
    for (var i = 0; i < rows.length; i++) {
        var cols;
        cols = rows[i].split(separator);
        var tag = (hasHeaders && i == 0) ? "th" : "td";
        var row = outputTable+"<tr>";
        for (var j = 0; j < colLengths.length; j++) {
            var data = cols[j] || " ";
            var cell = `<${tag}>${data}</${tag}>`
            outputTable+=cell;
        } outputTable+="</tr>"
    }
    outputTable='<table>' + outputTable + '</table>';
    res.push(outputTable) }
function _pad(text, length, char, align) { char = defValue(char, " "); align = defValue(align, "l"); additionalChars = length - text.length; return text + _repeat(char, additionalChars); }
function _trim(str) { var rgx = /^\s*(.*?)\s*$/; var result = str.match(rgx); return result[1]; }
function defValue(value, defaultValue) { return (typeof value === "undefined") ? defaultValue : value; }
function _repeat(str, num) { return new Array(num + 1).join(str); }
function longStr(array) {let longStr = "";array.forEach(function(word) {if(word.length > longStr.length) {longStr = word;}});return longStr;}
//https://www.geeksforgeeks.org/javascript/calculate-the-width-of-the-text-in-javascript/
function getTextWidth() {
    text = document.createElement("pre"); output=document.getElementById("output");
    output.appendChild(text); text.innerHTML = 'H';
    textWidth = text.clientWidth; output.removeChild(text);
} 
