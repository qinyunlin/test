var root,count="全部";
Ext.onReady(init);
var subcid = "";// 选中的二级分类ID
var upload_form;

function init() {
	govPriceCount();
};

function govPriceCount(){
	Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
		params : {
			type : 2
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				count +="("+jsondata.result+")";
				getData();
				buildTree();
				buildView();
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
}

//获得材料分类数据
function getData() {
	Ext.Ajax.request({
		url : '/cityRingServlet',
		params : {
			type : 8
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
			dataUrl : '/cityRingServlet?type=7'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:10px;',
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true,
		//rootVisible : false
		//rootVisible : false
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
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				if(o[i].isDeleted==1){
					o[i].text = "<font color='red'>" + o[i].name+"("+o[i].govSum+")" + "</font>";
				}else{
					o[i].text = o[i].name+"("+o[i].govSum+")";
				}
				
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

	// 点击节点事件
	tree.on('click', function(node) {
		node.expand();
		node.select();
		if(node.isLeaf()){
           //node.id;
			id=node.id;
			ds.baseParams["cityCircleId"] =  node.id;
			ds.load();
		}else{
			id="ext-gen1";
			var text=node.text.substring(0,node.text.indexOf("("));
			if(text == "华东区" || text == "华南区" || text == "华北区" || text == "华中区" || text == "西南区" || text=="全部"){
				return;
			}
			/*if(text=="全部"){
				ds.baseParams["cityCircleId"] =  "";
				ds.load();
			}*/
		}
		node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};