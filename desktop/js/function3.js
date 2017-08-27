

/**
 * 这个文件用来处理页面逻辑
 */
/**
* 显示上下文菜单
* @param  {[Event]} e [事件对象]
* @param  {[Array]} menuData [要生成的菜单内容]
* @return {[void]}          []
*/

/**
* 显示右键菜单
* @param  {[Event]} e [事件对象]
* @param  {[Array]} menuData [要生成的菜单内容]
* @return {[void]}          []
*/
function showContextmenu(e,container,dataList){
    // 循环传入的数据 并创建、添加到 li 标签
    container.style.display = 'block';
    container.innerHTML = '';
    container.style.left = e.clientX + 'px';
    container.style.top = e.clientY + 'px';
    dataList.forEach(function(item){
        var creLi = document.createElement('li');
        //  如果存在 分割线的处理
        if( item.type && item.type == 'splitLine' ) {
            creLi.className = 'splitline'
        } else {
            creLi.innerHTML = item.name;
            if(item.disabled){
                creLi.className = 'disabled';
            }
            // 检测子菜单
            creLi.onmouseover = function(e){

                if(item.disabled){
                    return;
                }
                var creLiChilren = this.parentNode.children;
                for (var i = 0; i < creLiChilren.length; i++) {
                    if(creLiChilren[i].className != 'splitline' && creLiChilren[i].className != 'disabled' ){
                        creLiChilren[i].className = '';
                    }
                    this.className = 'active';
                }
                // 创建子级菜单
                if(!creLi.children.length){
                    // 这两步 先清除所有的下级菜单
                    var creUls = this.parentNode.querySelectorAll('ul');
                    for (var i = 0; i < creUls.length; i++) {
                        creUls[i].parentNode.removeChild(creUls[i]);
                    }
                    if(item.children){
                        // 递归创建
                        var creUl =  document.createElement('ul');
                        this.appendChild(creUl);
                        showContextmenu(0,creUl,item.children);
                        menuClildOutLine(creUl)
                    }
                }
            }
            creLi.onmouseout = function(e){
                if(item.disabled){
                    return;
                }
                if(!creLi.children.length){
                    creLi.className = '';
                }
            }
            creLi.onmousedown = function(e){
                e.cancelBubble = true;
            }
            creLi.onclick = contextmenuCallback[item.callbackname];
            creLi.addEventListener('click',function(e){
                // contextmenuCallback[item.callbackname]();
                hideContextmenu(contextmenu)
            });
        }
        container.appendChild(creLi);


    });
    outLine(contextmenu)
}
// 隐藏菜单
function hideContextmenu(container){
    container.style.display = 'none';

}



// // 菜单过界处理
function outLine(list){
    var x =  parseFloat(css(list,'left'));
    var y =  parseFloat(css(list,'top'));
    var maxX = document.documentElement.clientWidth - list.offsetWidth;
    var maxY = document.documentElement.clientHeight - list.offsetHeight;
    list.style.left = Math.min(x,maxX) + 'px';
    list.style.top = (y > maxY?document.documentElement.clientHeight - list.offsetHeight:y) + 'px';
}
// // 子菜单过界处理
function menuClildOutLine(ul){
    var rect = ul.getBoundingClientRect();
    if(rect.right > document.documentElement.clientWidth){
        css(ul,'left',-(rect.width));
    }
    if(rect.bottom > document.documentElement.clientHeight) {
        css(ul,'top',(ul.offsetParent.clientHeight - rect.height));
    }
}


// 页面渲染
function view(pid){
    /**
     * 只要调用了 view的方法，那我们就把 _ID 设置成我们要view 的 pid
     */
   //  记录_ID的值，以便与其他地方去使用，记录当 view 过后，当前所在目录的 pid
   _ID = pid;
   // 拿到子数据的 pid
   if(_ID != 0){
       paths.style.display = 'block';
   } else {
       paths.style.display = 'none';
   };

   var dataList=  getChildren(_ID);
   elements.list.innerHTML = '';
   // 生成文件

   dataList.forEach(function(item){
       var newname =  item.name;
       if(item.extname){
           newname += `(${item.extname})`;
       }
       var li = document.createElement('li');
       li.className =  item.type;
       li.innerHTML = `<p>${newname}</p><input type="text">`;
       li.item = item;
        // 设置文件定位
        var offset = getPosi();
        css(li,'left',offset.x);
        css(li,'top',offset.y);
        list.appendChild(li);
        li.item = item;
        li.onmousedown = function(){
            // console.log(li.item);
        }
        // 拖拽删除
        drag(li);
        // 双击进入文件夹
        setHover(li)
        li.ondblclick = function(){
            if(li.classList.contains('txt') || li.classList.contains('trash')){
                return;
            }
            if(item.newOpen){
                openFile(item.newOpen,item.type);
                fileDetail.style.display = 'block';
            } else {
                // 如果目标是文本的话 将不能打开

                view(item.id);
            }
        }

   });
   // 面包屑导航
   // 顶层
   var pathList = getParents(_ID);
   elements.crumbs.innerHTML = '';

   var li = document.createElement('li');
   li.innerHTML = `<a href="javascript:;">回到桌面</a>`;
   li.onclick = function(e){
       view(0);
   }
   elements.crumbs.appendChild(li);

   // console.log(pathList);
   pathList.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = `<span> &gt; </span><a href="javascript:;">${item.name}</a>`;
        li.onclick = function() {
            view(item.id);
        };
        elements.crumbs.appendChild(li);
    });

    // 当前所在目录
   var info = getInfo(_ID);
   if (info) {
       var li = document.createElement('li');
       li.innerHTML = `<span> &gt; </span><span>${info.name}</span>`;
       elements.crumbs.appendChild(li);
   }

}


//给添加到页面上的文件夹绑定移入，选中事件。
function setHover(file) {   // 应该是叫做 setActive
    // 新增  文件右键点击的时候添加 active
    file.addEventListener('contextmenu',function(e){
        var lis = list.querySelectorAll('li');
        if(!e.ctrlKey) {
			for(var i = 0;i < lis.length;i++) {
				lis[i].classList.remove('active');
			}
		}
        file.classList.add('active')
    });
	file.addEventListener('click',function(e){
        // 文件点击的时候 ，隐藏掉 桌面的右键菜单
         hideContextmenu(elements.contextmenu);
        var lis = list.querySelectorAll('li');
		e.stopPropagation();
		if(!e.ctrlKey) {
			for(var i = 0;i < lis.length;i++) {
				lis[i].classList.remove('active');
			}
		}
		this.classList.add('active');
	});
}



// 拖拽
function drag(li){
    if(_ID == 1){
        return
    }
    li.onmousedown = function(e){
        e.stopPropagation();
        // e.preventDefault();
        if(e.button == 1 || e.button == 2){
            return
        }
        this.classList.add('actvie');
        var trash = document.querySelector('.trash');
        var others = list.querySelectorAll('li:not(.active)');
        var activeNodes = list.querySelectorAll('.active');
        var start = {x:e.clientX,y:e.clientY}
        var _self = this;
        if( !_self.classList.contains('active')){
            return;
        }
        var nowNode =  null ;   // 克隆出来的节点
        var clones = [];    // 克隆的数组
        var startElOffset = [];             //  克隆的坐标值
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',end);
        function move(e){
            if( _self == trash){
                return
            }
            if(!nowNode){
                for (var i = 0; i < activeNodes.length; i++) {
                    var node = activeNodes[i].cloneNode(true);
                    node.style.opacity = '.5';
                    clones.push(node);
                    list.appendChild(node)
                    if( _self == activeNodes[i]){
                        nowNode = node;
                    }
                    startElOffset[i] = {x:css(activeNodes[i],'left'),y:css(activeNodes[i],'top')};
                }
            }
            var dis = {x:e.clientX - start.x,y:e.clientY - start.y}
            for (var i = 0; i < clones.length; i++) {
                css(clones[i],'left',dis.x + startElOffset[i].x);
                css(clones[i],'top',dis.y + startElOffset[i].y);
            }
            for (var i = 0; i < others.length; i++) {
                if(getCollide(nowNode,others[i])){
                    others[i].style.backgroundColor = 'rgba(255,0,0,1)';
                } else {
                    others[i].style.backgroundColor = '';
                }
            }
		}
        function end(e){
            document.removeEventListener('mousemove',move);
            document.removeEventListener('mouseup',end);
            if(!nowNode) {
				return
			}
            // 如果说与垃圾桶发生了碰撞，那么删除克隆元素及其模型
            if(trash != null){  //子级文件中没有 回收站 所以加上这个判断
                if(getCollide(nowNode,trash)){
                    for(var i = 0; i < activeNodes.length; i++){
                        // console.log(activeNodes[i].item.pid,trash.item.id);
                        activeNodes[i].item.oid = activeNodes[i].item.pid;
                        activeNodes[i].item.pid = trash.item.id;
                    }
                }

            }
            for (var i = 0; i < others.length; i++) {
                if(others[i] != _self && others[i].item.type == 'floder'){
                    if(getCollide(others[i],nowNode)){
                        for (var j = 0; j < activeNodes.length; j++) {
                            // console.log(j,i);
                            activeNodes[j].item.pid = others[i].item.id;
                        }
                        break;
                    }
                }
            }
            view(_ID)
        }
    }
}


// 框选
(function(){
    document.addEventListener('mousedown',function(e){
        if(e.button == 1 || e.button == 2){
            return
        }
        e.stopPropagation();
        // e.preventDefault();
        clearClass();
        var file = list.querySelectorAll('li');
        var div = document.createElement('div');
        div.classList.add('frame');
        var start = {x: e.clientX,y:e.clientY}
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',end);
        function move(e){
            e.preventDefault();
            if(div.parentNode != document.body){
                document.body.appendChild(div);
            }
            var now = {x:e.clientX,y:e.clientY}
            css(div,'width',Math.abs(now.x - start.x))
            css(div,'height',Math.abs(now.y - start.y))
            css(div,'left',Math.min(now.x , start.x))
            css(div,'top',Math.min(now.y , start.y))
            for (var i = 0; i < file.length; i++) {
                if(getCollide(div,file[i])){
                    file[i].classList.add('active')
                } else {
                    file[i].classList.remove('active')
                }
            }
        };
        function end(e){
            document.removeEventListener('mousemove',move);
            document.removeEventListener('mouseup',end);
            (div.parentNode == document.body) && document.body.removeChild(div)
        }
    })
})();


// 打开文件
// 获取到打开文件的外框
fileDetailCols.addEventListener('click',function(e){
    fileDetailsC.innerHTML = '';
    fileDetail.style.display = 'none';
});
fileDetail.addEventListener('click',function(e){
    e.stopPropagation();
});
fileDetail.addEventListener('mousedown',function(e){
    e.stopPropagation();
});
fileDetail.addEventListener('contextmenu',function(e){
    e.stopPropagation();
    e.preventDefault();
});


// 打开上传文件
function openFile(file,fileType){
    fileDetailsC.innerHTML = '';
    var reader = new FileReader();
    reader.onload = function(e){
        fileDetailsC.style.display = 'block';
        var result =  e.target.result;
        switch (fileType) {
            case 'text':
                var p = document.createElement("p");
                p.innerHTML = result;
                fileDetailsC.appendChild(p);
                break;
            case 'image':
                // console.log(1);
                var img = new Image();
                img.src = result;
                fileDetailsC.appendChild(img);
                break;
            case 'video':
                var video = document.createElement('video');
                video.setAttribute("loop","");
                video.setAttribute("controls","");
                video.src = result;
                fileDetailsC.appendChild(video);
                break;
            case 'audio':
                var audio = document.createElement('audio');
                audio.setAttribute("loop","");
                audio.setAttribute("controls","");
                audio.src = result;
                fileDetailsC.appendChild(audio);
                break;
            default:
        };
    };
    if(fileType == "text"){
        reader.readAsText(file);
    } else {
        reader.readAsDataURL(file);
    }
}


// 清除全局选定
function clearClass(){
    var lis = list.querySelectorAll('li');
    for (var i = 0; i < lis.length; i++) {
        lis[i].classList.remove('active');
    }
}


/**
 * 碰撞检测
 *  检测框选框没有接触到 文件的 中心点
    用来放置文件夹
 * @param el => 框选框  el2 => 被检测的元素
 * @return true | false
 *
 **/
function getCollide(el,el2){
    var rect = el.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    if( rect.top > rect2.bottom - rect2.height/2
    || rect.left > rect2.right - rect2.width/2
    || rect.bottom < rect2.bottom - rect2.height/2
    || rect.right < rect2.right  - rect2.width/2){
        return false;
    }
    return true;
}
