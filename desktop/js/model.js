/**
 * 这个文件 只用来用来处理数据
 */


/**
{
     name: '新建',
     // disabled: true,
     children: [
         {
             callbackname: 'createFloder',
             type: 'floder',
             name: '新建文件夹',
         },
         {
             callbackname: 'createTxt',
             type: 'txt',
             name: '新建文本'
         }
     ]
 },
 {
     id: 1,
     pid: 0,
     type: 'floder',
     name: '技术'

 }

 * 以这两条数据为例  在这个文件中需要操作到 name \ disabled \ callbackname \ type \ id \ pid 等相关属性及方法
 */




/**
 * 首先  我们要做的是一个桌面
 *      需要获取到 当前层 子级层 父级层 三层 的 id
 */

 /**
  * 获取指定id的数据信息
  * @param id 要查找的id
  * @return {Object} 满足条件的数据
  */
 function getInfo(id) {
     return data.list.filter(function (item) {
         return item.id == id
     })[0];
 }
 /**
  * 根据指定的id，返回其下的所有一级子数据
  * @param id 要查找的id
  * @returns {Array} 包含一级子数据的数组
  */
 function getChildren(id) {
     return data.list.filter(function (item) {
         return item.pid == id
     });
 }

 function getTrashChildren(id) {
     return data.trash.filter(function (item) {
         return item.pid == id
     });
 }
 function getParent(id) {
     // 得到当前数据
     var info = getInfo(id);
     if (info) {
         // 根据自己的pid获取父级的info
         return getInfo(info.pid);
     }
 }
 /**
  * 获取指定id的所有父级（不包括自己）
  * @param id
  * @return {Array} 返回一个包含所有父级数据的数组
  */
 function getParents(id) {
     // 保存所有父级数据
     var parents = [];

     // 获取父级
     var parentInfo = getParent(id);
     // 如果父级信息存在
     if (parentInfo) {
         // 把当前父级的信息保存到parents里面
         parents.push(parentInfo);
         var more = getParents(parentInfo.id);
         parents = more.concat(parents);
     }
     return parents;
 }

/**
 * 添加新数据
 * @param newData
 * @return null
 */

function addData(newData){
    // 新创建一个数据 这个数据的 id 为原有的id + 1
    newData.id = getMaxId() + 1;
    // 添加一个新的数据的时候 同时应该考虑到重名的问题
    var ext =  checkName(newData);
    if(ext){
        for (var i = 1; i <= ext.length; i++) {
            var v = ext.find(function(ele){
                return ele.extname == (i+1);
            });
            if(v === undefined){
                newData.extname = (i+1);
                break;
            }
        }
    }
    data.list.push(newData);
}

 // 获取到数据中做大的 id
 function getMaxId(){
     var maxid = 0;
     data.list.forEach(function(item){
         if(item.id > maxid){
             maxid = item.id
         }
     });
     return maxid;
 }


 // 重名检测
 function checkName(fileData){
     // 创建一个数组 将重名的名字保存到数组
     var filename = [];
     for (var i = 0; i < data.list.length; i++) {
         if(
             fileData.type == data.list[i].type
             && fileData.name == data.list[i].name
             && fileData.pid == data.list[i].pid
         ){
             filename.push(data.list[i]);
         }
     }
     return filename;
 }

var v = {};

// 处理赋值粘贴
function getCopy(c){
    // console.log(c);
    var nowID = _ID;
    addData({
        pid: nowID,
        type: c.type,
        name: c.name + '- 副本'
    });
    var maxID = getMaxId();
    // console.log(maxID);
    superCopy(c,maxID)
}

// 深度拷贝
function superCopy(c,maxID){
    // console.log(getChildren(c.id).length > 0);
    if(getChildren(c.id).length > 0){
        /**
        * 如果有文件的pid 是他的id 循环子级，继续调用
         *
         */
        getChildren(c.id).forEach(function(item){
            // getCopy(item);
            // _ID = maxID
            nowID = maxID
            // console.log(_ID,maxID);
            addData({
                pid: nowID,
                type: item.type,
                name: item.name + '- 副本'
            });
            // superCopy(c,maxID);
        });
    }
}



/**
 * @todo 暂时
 */
var copy;
  // 数据功能
  var contextmenuCallback = {
      createFloder(){
          addData({
              pid: _ID,
              type: 'floder',
              name: '新建文件夹'
          });
          view(_ID);
      },
      createTxt(){
          addData({
              pid: _ID,
              type: 'txt',
              name: '新建文本'
          });
          view(_ID);
      },
      uploadF(){
          elements.fileBtn.click();
          elements.fileBtn.addEventListener('change',function(e){
              var file = this.files[0];
            //   console.log(file.type);
              var fileType = file.type.split('/')[0];
              if(!((fileType == 'text' && file.type.split('/')[1] == 'plain')
                  || fileType == 'image'
                  || fileType == 'video'
                  || fileType == 'audio')){
                      alert("目前只支持图片、视频、和音频文档的上传");
                      return;
              }
              addData({
                  pid: _ID,
                  type: fileType = (fileType == 'text')?'txt':fileType,
                  name: file.name,
                  newOpen: file
              });
              view(_ID);
              elements.fileBtn.value = '';
          },{
              once: true
          });
      },
      openFile(e){
          if(tar.classList.contains('txt')){
              return;
          }
          if(tar.item.newOpen){

              openFile(tar.item.newOpen,tar.item.type);
              fileDetail.style.display = 'block';
          } else {
              // 如果目标是文本的话 将不能打开

              view(tar.item.id);
          }
      },
      Rename(e){
          // 重命名
        //   console.log(tar);
          var ext = data.list;
        //   console.log(ext);
          // 将所有的名称 放进一个数组
          // 过滤数组
          ext = ext.filter(function(value){
              if(value.pid == _ID && value.type == tar.item.type){
                  return true;
              } else {
                  return false;
              }
          });
          // 直接拿里面的 name
          var names = [];
          var name = tar.item.name;
          for (var i = 0; i < ext.length; i++) {
              if(ext[i].extname){
                  names.push(ext[i].name+'('+ext[i].extname+')');
              } else {
                  names.push(ext[i].name);
              }
          };

          if(tar.item.extname){
              name += `(${tar.item.extname})`;
          }

          var p = tar.children[0];
          var input = tar.children[1];
          p.style.display = 'none';
          input.style.display = 'block';
          input.value = p.innerHTML;
          input.select();
          input.focus();
        //   console.log(tar.item.name);
          input.onblur = function(){
            //   console.log(tar.item);
              if(hasName()){
                  var mask = document.querySelector('.mask');
                  var info = document.querySelector('#info');
                  mask.style.display = 'block';
                  startMove({
                      el:info,
                      target: {
                          top: 70
                      },
                      time: 500,
                      type: 'linear',
                      callBack: function(){
                          setTimeout(function(){
                              startMove({
                                  el:info,
                                  target: {
                                      top: -50
                                  },
                                  time: 500,
                                  type: 'linear',
                                  callBack: function(){
                                      mask.style.display = 'none';
                                      input.focus();
                                  }
                              });
                          },1000);
                      }
                  });
              } else {
                  if(tar.item.extname){
                      /**
                      * 这里简单的用
                      *      a 代表 要截取的 '(' 在字符串中的位置序号
                      *      b 代表 要截取的 ')' 在字符串中的位置序号
                      *      c 代表 替换后的 extname
                      *      d 代表 替换后的 name
                      */
                      var  a,b,c;
                      a = input.value.lastIndexOf('(');
                      b = input.value.lastIndexOf(')');
                      c = input.value.slice(a+1,b);

                      if(input.value.lastIndexOf('(') == -1 ||input.value.lastIndexOf('(') == -1
                      || c.length == 0  ){
                          tar.item.name = input.value;
                          tar.item.extname = null;
                      } else {
                          tar.item.name = input.value.slice(0,a);
                          tar.item.extname = parseInt(c);
                      }
                      input.style.display = 'none';
                      p.style.display = 'block';
                      view(_ID);
                  } else if(input.value == '') {
                      view(_ID);
                  } else {
                      tar.item.name =  input.value;
                      input.style.display = 'none';
                      p.style.display = 'block';
                      view(_ID);
                  }
              }
          }
          function hasName(){
              for (var i = 0; i < names.length; i++) {
                  // 将input.value 去除收尾空格再做比较
                  if(input.value.trim() == names[i] && p.innerHTML != names[i]){
                      return true;
                  }
              }
              return false;
          }
      },
      Delete(e){
            // 获取删除页面上所有的 active 类
          var lis = document.querySelectorAll('#list .active');
          for (var i = 0; i < lis.length; i++) {
              if(lis[i].classList.contains('trash')){   //回收站不可被删除
                  lis[i].item.pid = 0;
              } else {
                  lis[i].item.oid = lis[i].item.pid ;
                  lis[i].item.pid = 1;
              }
          }
        //   console.log(1);
          view(_ID);
      },
      typeSort(e){
          var trash = [];
          var arrFloder = [];
          var arrTxt = [];
          var arrImage = [];
          var arrAudio = [];
          var arrVideo = [];
          var arrHtml = [];
          for (var i = 0; i < data.list.length; i++) {
              switch (data.list[i].type) {
                  case 'trash':
                      trash.push(data.list[i]);
                      break;
                  case 'floder':
                      arrFloder.push(data.list[i]);
                      break;
                  case 'txt':
                     arrTxt.push(data.list[i]);
                      break;
                  case 'image':
                     arrImage.push(data.list[i]);
                      break;
                  case 'audio':
                     arrAudio.push(data.list[i]);
                      break;
                  case 'video':
                     arrVideo.push(data.list[i]);
                      break;
                  case 'html':
                     arrHtml.push(data.list[i]);
                      break;
                  default:
              }
          }
          typeS(arrFloder);
          typeS(arrTxt);
          typeS(arrImage);
          typeS(arrAudio);
          typeS(arrVideo);
          typeS(arrHtml);
          var listArr = [];
           data.list = listArr.concat(trash,arrFloder,arrTxt,arrImage,arrAudio,arrVideo,arrHtml)
          function typeS(type){
              type.sort( function(a, b) {
                  if (a.id > b.id) {
                      return 1;
                  } else {
                      return -1;
                  }
              } );
          }
          view(_ID);
      },
      timeSort(e){
          data.list.sort( function(a, b) {
              if (a.id > b.id) {
                  return 1;
              } else {
                  return -1;
              }
          } );
          view(_ID);
      },
      pinyinSort(e){
        // data.list.sort(function(a,b){
		// 	if(pinyin.getFullChars(a.name + a.extname) > pinyin.getFullChars(b.name + a.extname)) {
		// 		return -1;
		// 	}
		// 	return 1;
		// });
		// view(_ID);
      },
      Copy(e){
        // console.log(copy);
        if(copy != undefined){
        //   console.log(1);
          data.menu.main.pop(copy)
        }
        copy = {name: '粘贴',callbackname: 'paste'}
        // console.log(copy);
          data.menu.main.push(copy);
          v = tar.item;
        //   console.log(v);
      },
      paste(e){
        //   console.log('粘贴');
        //   data.menu.main.pop({name: '粘贴',callbackname: 'paste'});
        //   data.list.push(v);
          getCopy(v)
          view(_ID);
      },
      clearAll(e){
        //   console.log(getDeletedFiles());
          getDeletedFiles().forEach(item => {
              item.pid = -1;
          })
          view(_ID);
      },
      reduction(e){
          getDeletedFiles().forEach(item => {
              item.pid = item.oid;
          });
          view(_ID);
      }

  }


// 定位布局
/**
 * 处理文件的定位
 *    参数可以不传或者任何数值
 *    传参时 文件呈现运动形式定位布局
 *    不传参 则成正常形式 给予定位布局
 */
function getPosi(index){
    var lis = list.querySelectorAll('li');
    index = (typeof index != 'undefined')?index:lis.length;
    var lisW = 100 + 10;
    var lisH = 100 + 10;
    var scale = Math.floor(document.documentElement.clientHeight / lisH);
    var x = Math.floor(index / scale);
    var y = (index % scale);
    return {x: x* lisW + 10, y: y* lisH + 10}
}

function resizeOffset(){
    var lis =  list.querySelectorAll('li');
    for (var i = 0; i < lis.length; i++) {
        var offset = getPosi(i);
        startMove({
            el: lis[i],
            target: {
                left: offset.x,
                top: offset.y
            },
            time: 300,
            type: 'easeOut'
        })
    }
}
/**
 * @todo 存在一个问题 是否在首页才放置垃圾桶 数据中如何处理
 */
/**
 * 可以在主页页面放置一个trash 当其点击进入的时候 重新生成一个 DIV 将所有需要渲染的下级页面 渲染在这个 DIV 中
 */


function getDeletedFiles(){
    var deletedFiles = [];
    data.list.forEach(item =>{
         if(item.pid == 1){
             deletedFiles.push(item)
         }
    });
    return deletedFiles;
};
