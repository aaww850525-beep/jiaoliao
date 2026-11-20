

(function(){
  if(location.protocol!=="https:"&&location.hostname!=="localhost")return;
  const button=document.getElementById("bInstall");
  const dialog=document.getElementById("appInstall");
  const standalone=window.matchMedia("(display-mode: standalone)");
  let installPrompt=null;
  function updateButton(){button.hidden=standalone.matches||navigator.standalone===true}
  updateButton();
  standalone.addEventListener("change",updateButton);
  window.addEventListener("appinstalled",()=>{button.hidden=true;installPrompt=null;if(dialog.open)dialog.close()});
  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    installPrompt=event;
  });
  button.onclick=()=>{
    dialog.innerHTML='<div class="sh-h"><h2>把工程叫料小幫手加入主畫面</h2><small>從手機圖示開啟，使用獨立 App 視窗</small></div>'+
      '<div class="sh-b"><p><b>iPhone／iPad</b><br>用 Safari 開啟工程叫料小幫手 → 按「分享」→「加入主畫面」→ 開啟「以網頁 App 打開」→「加入」。</p>'+
      '<p><b>Android</b><br>用 Chrome 開啟工程叫料小幫手 → 右上角選單 →「加入主畫面」或「安裝應用程式」。</p>'+
      '<p><b>電腦</b><br>用 Chrome 或 Edge 開啟工程叫料小幫手，在網址列或選單選擇「安裝應用程式」。</p>'+
      '<p class="note">第一次開啟後，整個叫料單會存在手機裡，之後沒有網路也能用。叫料資料只存在這台裝置；換手機前請先「💾 備份」匯出，再到新手機匯入。</p>'+
      '<p id="installStatus" role="status"></p></div>'+
      '<div class="sh-f"><button class="btn" id="installClose">關閉</button>'+
      (installPrompt?'<button class="btn btn-p" id="installNow">安裝工程叫料小幫手 App</button>':"")+'</div>';
    document.getElementById("installClose").onclick=()=>dialog.close();
    const install=document.getElementById("installNow");
    if(install)install.onclick=async()=>{
      const prompt=installPrompt;
      if(!prompt)return;
      install.disabled=true;
      try{
        await prompt.prompt();
        const choice=await prompt.userChoice;
        installPrompt=null;
        if(choice.outcome==="accepted")dialog.close();
        else document.getElementById("installStatus").textContent="你可以稍後從瀏覽器選單加入主畫面。";
      }catch(error){
        installPrompt=null;
        document.getElementById("installStatus").textContent="請依照上方說明，從瀏覽器選單加入主畫面。";
      }
    };
    if(!dialog.open)dialog.showModal();
  };
})();

