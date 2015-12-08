var root,count="全部";
Ext.onReady(init);
var cid = "";// 选中的一级分类ID
var subcid = "";// 选中的二级分类ID
var upload_form;
var code;
var maxLen = 8;
var loadFlag = false;//默认加载第一个二级分类

function init() {
	getData();
};


//获得材料分类数据
function getData() {
	Ext.Ajax.request({
		//url : '/servlet/RationLibServlet',
		url : '/material/MaterialServlet.do',
		params : {
			type : 18
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				count +="("+jsondata.result+")";
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
			dataUrl : '/material/MaterialServlet.do?type=50'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:20px;',
		renderTo : 'tree',
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true,
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
				o[i].text = o[i].name;
				
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				var name = o[i].name;
				if ("-1" == o[i].code){
					o[i].text = "其它分类" + "("+o[i].govSum+")";
				}else if (o[i].code.length == 2){ //一级分类
					name = getStuffName(o[i].code);
					if (name == null) name = "";
					if (name.length > maxLen) name = name.substring(0, maxLen) + "...";
					o[i].text = o[i].code + " " + name + "("+o[i].govSum+")";
				}else if (o[i].code.length == 4){//二级分类
					name = getSubCidNameBySubcid(o[i].code, false);
					if (name == null) name = "";
					if (name.length > maxLen) name = name.substring(0, maxLen) + "...";
					o[i].text = o[i].code + " " + name + "("+o[i].govSum+")";
				}else{
					o[i].text = name + "("+o[i].govSum+")";
				}
				
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
					if (!loadFlag && i == 0){
						if (o[i].code.length == 4){
							//默认加载第一个二级分类
							subcid = o[i].code;
							cid = subcid.substring(0,2);
							ds.baseParams["content"] = "id~" + subcid;
							ds.load();
							loadFlag = true;
						}
						tree.getSelectionModel().select(n);
						tree.fireEvent("click",n);
					}
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
		//node.expand();
		node.select();
		if (node.isExpanded() && !node.isLeaf()){//true,展开
			node.collapse();
			return;
		}
		if (node.isLeaf()) {
			// 点击二级分类 或者 其它分类
			subcid = node.id;
			cid = node.parentNode.id;
			//ds.baseParams["content"] = "id~" + node.id;
			//ds.load();
			searchlist();
		}else{
			//点击一级分类
			subcid = "";
			//cid = node.id;
			var text = node.text.substring(0,node.text.indexOf("("));
			if(text == "土建" || text == "装饰" || text == "安装" || text == "市政" || text == "园林"){
				code = "";
				cid = "";
				node.expand();
				return;
			}
			cid = node.id;
			//Ajax请求当前分类的编码
			//ds.baseParams["content"] = "id~" + node.id;
			//ds.load();
			searchlist();
		}
		node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};


