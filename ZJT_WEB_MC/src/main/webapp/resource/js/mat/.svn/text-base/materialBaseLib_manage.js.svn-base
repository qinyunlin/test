var root, ds, tree, win, grid, form, root_win, tree_win, win_list, select_ds, guideds, hisgrid, hisds;
Ext.onReady(init);
var subcid = "";// 选中的二级分类ID
var upload_form;

function init() {
	getData();

	getGuideDs();
};
var toolbar = [ {
	text : '导入主材',
	icon : '/resource/images/add.gif',
	hidden : compareAuth("MATERIALBASE_LIB_ADD"),
	handler : function() {
		importMaterialBaseLib();
	}
}, {
	text : '添加主材',
	icon : '/resource/images/add.gif',
	hidden : compareAuth("MATERIALBASE_LIB_ADD"),
	handler : function() {
		gotoAddMaterialBaseLib("add");
	}
}, {
	text : '查看/修改',
	icon : '/resource/images/edit.gif',
	hidden : compareAuth("MATERIALBASE_LIB_MOD"),
	handler : function() {
		gotoAddMaterialBaseLib("update");
	}
}, {
	text : '删除主材',
	icon : '/resource/images/delete.gif',
	hidden : compareAuth("MATERIALBASE_LIB_DEL"),
	handler : delMaterial
} ];
// 获取指引信息
function getGuideDs() {
	guideds = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/servlet/MaterialBaseLibServlet'
		}),
		baseParams : {
			type : 9,
			field : "name",
			content : ""
		},
		reader : new Ext.data.JsonReader({
			id : 'name'
		}, [ "name" ])
	});
};

//导入主材
function importMaterialBaseLib() {
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : '上传文件',
							allowBlank : false
						}
					},
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							bodyStyle : 'border:none;'/*,
							html : "<a href='" + FileSite
									+ "/doc/MaterialBaseLib.xls" + "' >标准文档下载</a>"*/
						}
					} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入主材',
		closeable : true,
		width : 600,
		height : 100,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : uploadFile
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
};

//上传
function uploadFile() {
	submitForm();
};

// 上传操作
function submitForm(append) {
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/servlet/MaterialBaseLibServlet?type=16',
			waitMsg : '上传文件中...',
			success : function(upload_form, o) {
			},
			failure : function() {
			}
		});
	} else
		Info_Tip("请正确填写信息。");
};

function getResult(flag, msg) {
	if (flag) {
		Info_Tip("上传成功。");
		win.close();
		tree.loader.baseParams = {

		};
		ds.reload();
		tree.getRootNode().reload();
	} else {
		Info_Tip(msg);
	}
};

// 创建材料分类树
function buildTree() {
	// 异步根节点
	root = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : '材料分类'
	});
	// 树型控件
	tree = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/servlet/RationLibServlet?type=2'
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
				o[i].text = o[i].name;
				
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				
				if (o[i].pid.length == 1 && o[i].pid != 0) {
					o[i].text = o[i].code + " " + o[i].name;
				} else {
					if(o[i].code.length ==4){
						o[i].text = o[i].code + " " + o[i].name;
					}else{
						o[i].text = o[i].name;
					}
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

		if (node.isLeaf()) {
			// 点击二级分类
			subcid = node.id;
			ds.baseParams["content"] = "id~" + node.id;
			ds.load();
		}else{
			//点击一级分类
			subcid = "";
			cid = node.id;
			if(node.text == "土建" || node.text == "装饰" || node.text == "安装" || node.text == "市政" || node.text == "园林"){
				return;
			}
			//Ajax请求当前分类的编码
			ds.baseParams["content"] = "cid~" + node.id;
			ds.load();
		}
		node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};

// 跳转到操作页
function gotoAddMaterialBaseLib(op) {
	if (op == "add") {
		if (subcid == null || subcid == "") {
			Info_Tip("请选择二级分类。");
			return;
		}
		window.parent.createNewWidget("materialBaseLib_add", '添加主材',
				'/module/mat/materialBaseLib_add.jsp?id=' + subcid);
	} else {
		var row = grid.getSelectionModel().getSelected();
		if(!row){
			Info_Tip("请选择材料。");
			return;
		}
		var id = row.get("id");
		var subcid1 = row.get("subcid");
		window.parent.createNewWidget("materialBaseLib_update", '查询/修改主材',
				'/module/mat/materialBaseLib_update.jsp?id=' + id + "&subcid="
						+ subcid1);
	}
};

// 主要材料列表
function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/servlet/MaterialBaseLibServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'code', 'name', 'spec', 'cid', 'unit', 'image', 'subcid', 'features', 'keyFeatures' ]),
		baseParams : {
			type : 2,
			page : 1,
			pageSize : 20,
			isBlur : 1
		},
		countUrl : '/servlet/MaterialBaseLibServlet',
		countParams : {
			type : 3
		},
		remoteSort : true
	});
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true
	});
	grid = new Ext.grid.EditorGridPanel({
		store : ds,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		autoExpandColumn : 'common',
		frame : true,
		autoHeight : true,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), cm, {
			header : '国标编码',
			sortable : true,
			dataIndex : 'code',
			renderer : showCode
		},/* {
			header : '二级分类',
			sortable : true,
			dataIndex : 'subcid'
		}, */{
			header : '材料名称',
			sortable : true,
			dataIndex : 'name'
		}, {
			header : '规格',
			sortable : true,
			dataIndex : 'spec'
		}, {
			header : '单位',
			sortable : false,
			dataIndex : 'unit'
		}, {
			header : '关键特征集',
			sortable : false,
			dataIndex : 'keyFeatures',
			renderer : function(value, meta, record) {
				var keyFeatures = record.get("keyFeatures");
				if (keyFeatures == null) return "";
				return "<span title='" + keyFeatures + "'>" + keyFeatures + "</span>";
			}
		}, {
			header : '特征集',
			sortable : false,
			dataIndex : 'features',
			renderer : function(value, meta, record) {
				var features = record.get("features");
				if (features == null) return "";
				return "<span title='" + features + "'>" + features + "</span>";
			}
		}],
		renderTo : 'grid',
		border : false,
		loadMask : true,
		selModel : new Ext.grid.RowSelectionModel(),
		tbar : toolbar,
		bbar : pagetool
	});
	grid.on('beforeedit', function(e) {
		if (compareAuth("MATERIALBASE_LIB_MOD")) {
			Info_Tip("对不起，您暂时不能进行此操作。");
			return false;
		} else
			return true;
	});

	function showCode(value, p, record) {
		var img = record.data.image;
		var code = record.data.code;
		var stName = "";
		if (img != null && img != "") {
			stName = "<div style='float:left;'>"
					+ code
					+ "</div><div style='float:right;'><image src='/ext/resource/images/img_default.jpg'/></div>";
		} else {
			stName = code;
		}
		return stName;
	}
	/*
	 * grid.on('afteredit', function(e) { if (e.record.data.name == "") {
	 * Ext.Msg.alert("提示", "分类名称不能为空！", function() { }); return; }
	 * Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) { if (op == "yes") {
	 * Ext.Ajax .request({ url : '/servlet/MaterialBaseLibServlet', params : {
	 * type : 5, ids : e.record.data.id, content : e.field + "~" + e.value },
	 * success : function(response) { var data = eval("(" +
	 * response.responseText + ")"); if (getState(data.state, commonResultFunc,
	 * data.result)) { Info_Tip("修改成功"); ds.reload(); } else {
	 * Warn_Tip(data.result); ds.reload(); } }, failure : function() {
	 * Warn_Tip(); } }); } }); })
	 */

};
// 搜索
function searchlist() {
	var form = Ext.getCmp("search_form").getForm().items;
	var len = form.length;
	var content = [];
	for ( var i = 0; i < len; i++) {
		if (!Ext.isEmpty(form.map[form.keys[i]].getValue()))
			content.push(form.keys[i].replace("se_", "") + "~"
					+ handlerSpec(form.map[form.keys[i]].getValue()));
	}
	content = content.join().replace(/'/g, ";");
	content += ";othername~" + Ext.get("se_name").getValue();
	ds.baseParams["content"] = content;
	ds.load();
};
function buildView() {
	var view = new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [ {
			region : 'west',
			width : 180,
			split : true,
			autoScroll : true,
			items : tree
		}, {
			region : 'center',
			items : grid
		} ]
	});
};

// 删除材料
function delMaterial() {
	var ids = [];
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择材料。");
		return;
	}
	Ext.Msg.confirm("温馨提示", "请问您确认要删除选中的材料吗?", function(op) {
		if (op == "yes") {
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].get("id"));
			}
			Ext.Ajax.request({
				url : "/servlet/MaterialBaseLibServlet",
				params : {
					type : 6,
					ids : ids.toString()
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("材料删除成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});

};
// 历史记录
function hisWatch() {
	var row = grid.getSelectionModel().getSelected();
	var tempid = "";
	if (!Ext.isEmpty(row))
		tempid = row.get("id");

	hisds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/servlet/MaterialBaseLibServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		},
				[ 'id', "eid", 'code', 'code2010', 'name', 'othername', 'unit',
						'spec', 'moreexplain', 'cid', "updateOn", "updateBy",
						"action" ]),
		baseParams : {
			type : 7,
			page : 1,
			pageSize : 20,
			id : tempid,
			isBlur : 0
		},
		countUrl : '/servlet/MaterialBaseLibServlet',
		countParams : {
			type : 8
		},
		remoteSort : true
	});
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : hisds,
		displayInfo : true
	});
	hisgrid = new Ext.grid.GridPanel({
		store : hisds,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		autoWidth : true,
		height : parent.Ext.get("tab_0407_iframe").getHeight() / 2,
		autoExpandColumn : 'common',
		frame : true,
		autoHeight : true,
		loadmask : true,
		columns : [ new Ext.grid.RowNumberer(), cm, {
			header : 'CODE',
			sortable : true,
			dataIndex : 'code'
		}, {
			header : 'CODE2010',
			sortable : true,
			dataIndex : 'code2010'
		}, {
			header : '材料名称',
			sortable : true,
			dataIndex : 'name'
		}, {
			header : '别名',
			sortable : true,
			dataIndex : 'othername'
		}, {
			header : '单位',
			sortable : true,
			dataIndex : 'unit'
		}, {
			header : '型号',
			sortable : true,
			dataIndex : 'spec'
		}, {
			header : '描述',
			sortable : true,
			dataIndex : 'moreexplain'
		}, {
			header : '分类',
			sortable : true,
			dataIndex : 'cid'
		}, {
			header : '更新人',
			sortable : true,
			dataIndex : 'updateBy'
		}, {
			header : '更新时间',
			sortable : true,
			dataIndex : 'updateOn'
		}, {
			header : '操作',
			sortable : true,
			dataIndex : 'action',
			renderer : function(v) {
				return v == "del" ? "删除" : "修改";
			}
		} ],
		renderTo : 'grid',
		border : false,
		loadMask : true,
		selModel : new Ext.grid.RowSelectionModel(),
		tbar : [
				{
					text : "搜索条件"
				},
				{
					xtype : 'combo',
					store : [ [ "code", "编码" ], [ "code2010", "国标编码" ],
							[ "name", "材料名称" ], [ "othername", "别名" ],
							[ "unit", "单位" ], [ "spec", "型号规格" ],
							[ "updateBy", "更新人" ] ],
					triggerAction : 'all',
					id : 'query_con'
				}, {
					text : '关键字'
				}, {
					xtype : 'textfield',
					id : 'query_value'
				}, {
					xtype : 'button',
					icon : '/resource/images/zoom.png',
					text : '查询',
					handler : searchhis

				} ],
		bbar : pagetool
	});
	win = new Ext.Window({
		title : '历史记录',
		modal : true,
		width : 800,
		autoHeight : true,
		items : hisgrid
	});
	win.show();
	hisds.load();
};

// 搜索历史
function searchhis() {
	hisds.baseParams["content"] = Ext.getCmp("query_con").getValue() + "~"
			+ Ext.fly("query_value").getValue();
	hisds.load();
};
// 显示树形分类
function showTreeList() {
	root_win = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : '定额分类管理'
	});
	tree_win = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/servlet/RationLibServlet?type=2'
		}),
		root : root_win,
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true,
		autoHeight : true
	});
	/* 修改返回的数据 */
	tree_win.loader.processResponse = function(response, node, callback, scope) {
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
	tree_win.on('click', function(node) {
		if (node.id.length == 6) {
			form.getForm().items.map["cid"].setValue(node.id);
			win_list.close();
		}
	});

	win_list = new Ext.Window({
		modal : true,
		title : '材料分类',
		width : 260,
		height : parent.Ext.get("tab_0407_iframe").getHeight() / 2,
		autoScroll : true,
		items : tree_win
	});
	win_list.show();
	root_win.expand();
	root_win.select();
};

// 获得材料分类数据
function getData() {
	Ext.Ajax.request({
		url : '/servlet/RationLibServlet',
		params : {
			type : 6
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				select_ds = "[";
				var len = jsondata.result.length;
				for ( var i = 0; i < len; i++) {
					select_ds += "['" + jsondata.result[i]["id"] + "','"
							+ jsondata.result[i]["name"] + "'],";
				}
				select_ds = select_ds.slice(0, select_ds.lastIndexOf(","));
				select_ds += "]";
				select_ds = select_ds.replace(/\s/g, "");
				select_ds = eval(select_ds);
				buildTree();
				buildGrid();
				buildView();
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
};
// 添加动作
function addAction() {
	var content = [];
	var formObj = form.getForm();
	for ( var i = 0; i < formObj.items.length; i++) {
		if (!Ext.isEmpty(formObj.items.map[formObj.items.keys[i]].getValue()))
			content.push(formObj.items.keys[i]
					+ "~"
					+ handlerSpec(formObj.items.map[formObj.items.keys[i]]
							.getValue()));
	}
	content = content.join().replace(/,/g, ";");
	if (formObj.isValid()) {
		Ext.Ajax.request({
			url : '/servlet/MaterialBaseLibServlet',
			params : {
				type : 4,
				content : content
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					Info_Tip("材料添加成功。");
					ds.reload();
					Ext.Msg.confirm("温馨提示", "材料添加成功，请问你要继续添加吗？(Y/N)", function(
							op) {
						if (op == "yes")
							form.getForm().reset();
						else
							win.close();
					})
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();
};
// 修改动作
function editAction() {
	var row = grid.getSelectionModel().getSelected();
	var obj = form.getForm().items;
	var len = obj.length;
	var content = [];
	for ( var i = 0; i < len; i++) {
		if (!Ext.isEmpty(obj.map[obj.keys[i]].getValue())) {
			content.push(obj.keys[i] + "~"
					+ handlerSpec(obj.map[obj.keys[i]].getValue()));
		}
	}
	content = content.join().replace(/,/g, ";");
	Ext.Ajax.request({
		url : "/servlet/MaterialBaseLibServlet",
		params : {
			type : 5,
			content : content,
			ids : row.get("id")
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Info_Tip("材料修改成功。");
				ds.reload();
				win.close();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

// 获取指引信息
function getGuideInfo(field) {
	var content = [];
	var formObj = form.getForm();
	for ( var i = 0; i < formObj.items.length; i++) {
		if (!Ext.isEmpty(formObj.items.map[formObj.items.keys[i]].getValue()))
			content.push(formObj.items.keys[i]
					+ "~"
					+ handlerSpec(formObj.items.map[formObj.items.keys[i]]
							.getValue()));
	}
	content = content.join().replace(/,/g, ";");

	Ext.Ajax.request({
		url : '/servlet/MaterialBaseLibServlet',
		params : {
			type : 9,
			field : field,
			content : content
		},
		success : function(response) {

		},
		failure : function() {
		}
	});
};

// 检测公司编码唯一性
function checkCode(v) {
	if (Ext.isEmpty(v)) {
		Info_Tip("请输入编码");
		return;
	}
	Ext.Ajax.request({
		url : '/servlet/MaterialBaseLibServlet',
		params : {
			type : 12,
			code : v
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state)) {
				if (!data.result)
					Info_Tip("您输入的编码已存在了。");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};
