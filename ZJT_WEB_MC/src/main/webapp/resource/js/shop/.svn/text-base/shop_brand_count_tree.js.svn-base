var root,count="";
Ext.onReady(init);
var cid = "";// 选中的一级分类ID
var subcid = "";// 选中的二级分类ID
var upload_form;
var code;
var maxLen = 8;
var loadFlag = false;//默认加载第一个二级分类
var province = '广东';
var frontFlag = "0";

function init() {
	province = getCurArgs("province");
	frontFlag = getCurArgs("frontFlag");
	if (province == null || "" == province){
		province = "广东";
	}else if ("全国" == province){
		province = "";
	}
	if (frontFlag == null || "" == frontFlag){
		frontFlag = "0";
	}
	getData();
	//buildTree();
	//buildView();
};


//获得材料分类数据
function getData() {
	Ext.Ajax.request({
		url : '/ep/EpShopCountServlet?node=0',
		params : {
			type : 10,
			viewFrontlineBrandFlag : frontFlag
		},
		success : function(response) {
			var json = response.responseText;
			try {
				var o = response.responseData || Ext.decode(json);
				if (o.state == "success") {
					o = o.result;
				} else if (o.state == "auth") {
					Info_Tip("对不起，您暂时不能进行此操作。");
					o = [];
					return;
				} else if (o.state == "nologin") {
					Info_Tip("对不起，还未登录。");
					o = [];
					return;
				}
				/*select_ds = "[";
				var len = jsondata.result.length;
				for ( var i = 0; i < len; i++) {
					select_ds += "['" + jsondata.result[i]["id"] + "','"
							+ jsondata.result[i]["name"] + "'],";
				}
				select_ds = select_ds.slice(0, select_ds.lastIndexOf(","));
				select_ds += "]";
				select_ds = select_ds.replace(/\s/g, "");
				select_ds = eval(select_ds);*/
				buildTree();
				buildGrid();
				buildView();
			} catch (e) {
				this.handleFailure(response);
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
			dataUrl : '/ep/EpShopCountServlet',
			requestMethod : "POST",
			baseParams:{
				type : 10,
				province : province,
				viewFrontlineBrandFlag : frontFlag
			},
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:20px;',
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
				if (2 == o[i].id.length){
					nodeName = getStuffName(o[i].id);
				}else if (4 == o[i].id.length){
					nodeName = getSubCidNameBySubcid(o[i].id, false);
					o[i].leaf = true;
				}
				
				o[i].text = o[i].id + nodeName + "("+o[i].govSum+")";
				
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
					if (!loadFlag && i == 0){
						if (o[i].id.length == 2){
							//默认加载第一个一级分类
							cid = o[i].id;
							ds.baseParams["cid"] = cid;
							ds.baseParams["subcid"] = "";
							ds.load();
							setFrontlineBrandCount();
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
			ds.baseParams["cid"] = cid;
			ds.baseParams["subcid"] = subcid;
			ds.load();
			setFrontlineBrandCount();
		}else{
			//点击一级分类
			subcid = "";
			cid = node.id;
			//Ajax请求当前分类的编码
			ds.baseParams["cid"] = cid;
			ds.baseParams["subcid"] = "";
			ds.load();
			setFrontlineBrandCount();
		}
		node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};
