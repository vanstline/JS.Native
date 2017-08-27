/**
 * 页面操作
 */


 var elements = {
     list: document.querySelector('#list'),
     filename: document.querySelector('#filename'),
     filetype: document.querySelector('#filetype'),
     createBtn: document.querySelector('#createBtn'),
     contextmenu: document.querySelector('#contextmenu'),
     paths: document.querySelector('#paths'),
     back: document.querySelector('#back'),
     crumbs: document.querySelector('#crumbs'),
     fileBtn: document.querySelector('#upload'),
     fileDetail: document.querySelector('#fileDetail'),
     fileDetailCols: document.querySelector('#fileDetailCols'),
     fileDetailsC: document.querySelector('#fileDetailsC'),
     wind: document.querySelector('#wind')
 };
 document.addEventListener('contextmenu',function(e){
     e.preventDefault();

    if(e.target.classList.contains('trash') || e.target.parentNode.classList.contains('trash') ){
        showContextmenu(e,elements.contextmenu,data.menu.trashMain);
        return;
    }
    
     if(e.target.tagName.toUpperCase() == 'LI' || e.target.parentNode.tagName == 'LI'){
         showContextmenu(e,elements.contextmenu,data.menu.file);
        //  outLine(contextmenu);
         // 先用一个变量来记录每次点击时触发的 target 后期只有渲染 这个 变量的 item .id
         tar = e.target.parentNode.tagName == 'LI'?e.target.parentNode:e.target;
     } else {
         showContextmenu(e,elements.contextmenu,data.menu.main);
     }
 });


 document.addEventListener('mousedown',function(e){
     hideContextmenu(elements.contextmenu);
 });

var _ID = 0;

view(_ID);

/**
 * 绑定新建快捷键
    shift + n
 */
document.addEventListener('keydown',function(e){
    if(e.shiftKey && e.keyCode == 78){
        contextmenuCallback.createFloder();
    }
});
window.addEventListener('resize',function(e){
    resizeOffset();
    outLine(contextmenu)
});
