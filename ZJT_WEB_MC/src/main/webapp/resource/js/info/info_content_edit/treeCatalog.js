	
	var selectRoot,selectTree;
	//右侧选择树的生成
	var isLoadOk = false;
	
	selectRoot = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '信息分类管理'
			});	
	selectTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/InfoContentType.do?type=1'
						}),
				root : selectRoot,
				border : false,
				animate : true,
				autoScroll : true,
				containerScroll : true,
				checkModel : 'cascade', // 对树的级联多选
				onlyLeafCheckable : false// 对树所有结点都可选	
			});
	/* 修改返回的数据 */
	selectTree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth" || o.state == "nologin") {
				Ext.MessageBox.alert('提示', o.result);
				o = [];
			}
			node.beginUpdate();
			for (var i = 0, len = o.length; i < len; i++) {
				o[i].text = o[i].name;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				o[i].checked = false;
				var n = this.createNode(o[i]);
				//扩展node节点的属性，保存栏目路径的引用
				n.tpath=o[i].path;
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();	
			this.runCallback(callback, scope || node, [node]);
			
		} catch (e) {
			this.handleFailure(response);
		}
		
	};	
	//debugger;
	//展开所有的结点
	var tid = getCurArgs("tid");
	selectRoot.expand(false,false,expandAfter);
	function expandAfter(pnode){
		for(var n=0; n<pnode.childNodes.length; n++){
			var node01 = pnode.childNodes[n]
			for(var i=0;i<tid.length;i++){	
						var chooseNodeId = tid.substring(0,i);
						if(chooseNodeId==node01.id){
							node01.expand(false,false,expandAfter);
							
						}
					}
			if(node01.id == tid){
				node01.getUI().checkbox.click();
			}
		}
	}
	selectTree.on('checkchange', function(node) {
		if (!node.isLeaf()) {
			 node.expand(true, true);
		}
	});
	//增加选中参数传递过来的栏目
	//控制只处理一次选中事件
	/*
	var tidChooseTask = {
		run : function() {	
				var tid = Ext.get("tid_temp").dom.value;
				for(var i=0;i<tid.length;i++){	
					var chooseNode = selectTree.getNodeById(tid.substring(0,i));
					if(chooseNode==undefined){
						continue ;
					}else{
						chooseNode.expand();
					}
				}
				if(selectTree.getNodeById(tid)!=undefined){
					if(selectTree.getNodeById(tid).getUI().checkbox!=undefined){
						selectTree.getNodeById(tid).getUI().checkbox.click();
						taskRunner.stop(tidChooseTask);
					}
				}
		},
		interval:1000
	};
	var taskRunner = new Ext.util.TaskRunner();
	*/
	