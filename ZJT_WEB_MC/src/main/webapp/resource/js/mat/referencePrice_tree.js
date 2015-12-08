var root,count="全部";
Ext.onReady(init);
var upload_form;
function init() {
	getData();
};

//获得材料分类数据
function getData() {
	Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
		params : {
			type : 43
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				select_ds = "[";
				var len = jsondata.result.length;
				for ( var i = 0; i < len; i++) {
					
					select_ds += "['" + jsondata.result[i]["id"] + "','"
							+jsondata.result[i]["name"] + "','"+ jsondata.result[i]["govSum"]+"'],";
					
				}
				select_ds = select_ds.slice(0, select_ds.lastIndexOf(","));
				select_ds += "]";
				select_ds = select_ds.replace(/\s/g, "");
				select_ds = eval(select_ds);
				buildTree();
				buildView();
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
};

//创建材料分类树
function buildTree() {
	// 异步根节点
	root = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : count
	});
	// 树型控件
	tree = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/material/MaterialServlet.do?type=43'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:10px;',
		renderTo : 'tree',
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true,
		rootVisible : false
	});
	
	// 重新装配树型数据
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth") {
				Info_Tip("对不起，您暂时不能进行此操作。");
				o = [];
			} else if (o.state == "nologin") {
				Info_Tip("对不起，还未登录。");
				o = [];
			}
			node.beginUpdate();
			for ( var i = 0, len = o.length; i < len; i++) {
				var nodeName = o[i].name;
				//if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				//}
				/*if(o[i].isDeleted==1){
					o[i].text = "<font color='red'>" + nodeName +"("+o[i].govSum+")" + "</font>";
				}else{
					o[i].text = nodeName + "("+o[i].govSum+")";
				}*/
				o[i].text = nodeName + "("+o[i].govSum+")";
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [ node ]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	
	tree.on('beforeexpandnode', function(node) {
		node.select();
	});
	
	// 点击节点事件
	tree.on('click', function(node) {
		node.select();
		/*if (node.isExpanded() && !node.isLeaf()){//true,展开
			node.collapse();
			return;
		}*/
		id = '';
		ds.baseParams["cityCircleId"] = '';
		ds.baseParams["province"] = node.id;
		ds.load();
		/*if(node.isLeaf()){
			id=node.id;
			ds.baseParams["province"] =  node.parentNode.id;
			ds.baseParams["cityCircleId"] = id;
			ds.load();
		}else{
			id = '';
			ds.baseParams["cityCircleId"] = '';
			ds.baseParams["province"] = node.id;
			ds.load();
		}*/
		node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};
