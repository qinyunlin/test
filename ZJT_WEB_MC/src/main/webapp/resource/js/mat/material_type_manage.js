var dsType, gridType, smType;

var rootType, treeType, loadTree;

var dsCity, gridCity, smCity;

var viewBar;
var mtCity = "中国";
var pidCity = "0";

Ext.onReady(function() {
	Ext.QuickTips.init();
	buildCityGrid();
	buildTypeGrid();
	buildToolBar();
});

// ****************************** 创建城市列表
function buildCityGrid() {

	dsCity = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/MaterialType.do?type=1'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'city', 'status', 'comeFrom' ])
	});

	dsCity.load();

	smCity = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});

	cmCity = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'city'
	});

	gridCity = new Ext.grid.EditorGridPanel({
		id : 'gridCity1',
		store : dsCity,
		sm : smCity,
		viewConfig : {
			forceFit : true
		},
		autoExpandColumn : 'city',
		loadMask : true,
		columns : [ new Ext.grid.RowNumberer(), cmCity, {
			header : 'comeFrom',
			sortable : true,
			dataIndex : 'comeFrom',
			hidden : true
		}, {
			header : '城市名称',
			sortable : true,
			dataIndex : 'city',
			editor : new Ext.form.TextField()
		}, {
			header : '状态',
			sortable : true,
			dataIndex : 'status',
			renderer : getStatusName
		} ],
		renderTo : 'gridCity',
		border : false,
		autoScroll : true,
		autoHeight : true
	});
	buildTree();

	gridCity.on('afteredit', function(e) {

		if (e.record.data.comeFrom == "0") {
			// 添加城市
			var rows = gridCity.getSelectionModel().getSelections();
			var city = rows[0].get("city");
			if (!city || city == "请输入城市名称") {
				return;
			}
			mtCity = city;
			loadTree.baseParams = {
				city : mtCity
			};
			treeType.getRootNode().reload();
			return;
		} else {
			// 修改城市
			if (e.record.data.city == "") {
				Ext.Msg.alert("提示", "城市名称不能为空！", function() {
					return;
				});
			}

			if (e.field == "city") {
				Ext.Msg.confirm("提示", "您确定要修改该城市名称吗?", function(op) {
					if (op == "yes") {
						Ext.Ajax.request({
							url : '/MaterialType.do',
							params : {
								type : 9,
								cityNew : e.record.data.city,
								cityOld : mtCity
							},
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									dsType.reload();
									dsCity.reload();
								} else {
									Warn_Tip(data.result);
								}
							},
							failure : function() {
								Warn_Tip();
							}
						});
					}
				});
			}
		}
	});
	gridCity.on('click', function(e) {
		var rows = gridCity.getSelectionModel().getSelections();
		var city = rows[0].get("city");
		if (!city || city == "请输入城市名称") {
			return;
		}
		mtCity = city;
		loadTree.baseParams = {
			city : mtCity
		};
		treeType.getRootNode().reload();
	});

}

function getStatusName(status) {
	if (status == "0") {
		return "有效";
	} else {
		return "无效";
	}
}

// ****************创建分类树型
function buildTree() {
	rootType = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : '材料分类管理'
	});

	loadTree = new Ext.tree.TreeLoader({
		dataUrl : "/MaterialType.do?type=2",
		baseParams : {
			city : mtCity
		}
	});

	treeType = new Ext.tree.TreePanel({
		loader : loadTree,
		root : rootType,
		renderTo : 'tree',
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true
	});

	treeType.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			}
			mtCity = o[0].city;
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

	treeType.on('click', function(node) {
		node.expand();
		node.select();
		dsType.proxy = new Ext.data.HttpProxy({
			url : '/MaterialType.do?type=6'
		});
		dsType.load({
			params : {
				node : node.id
			}
		});
		node.expand();
	});
	rootType.expand();
	rootType.select();
};

// ***************创建分类列表*******************
function buildTypeGrid() {
	dsType = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/MaterialType.do?type=6'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "name", "pname", "cid", "city", "createBy", "createTime",
				"lastUpdateBy", "lastUpdateTime" ])
	});
	dsType.load();
	smType = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});

	cmType = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});

	gridType = new Ext.grid.EditorGridPanel({
		id : 'gridType1',
		store : dsType,
		sm : smType,
		loadMask : true,
		viewConfig : {
			forceFit : true
		},
		columns : [ new Ext.grid.RowNumberer(), cmType, {
			header : '父类名称',
			sortable : true,
			dataIndex : 'pname'
		}, {
			header : '分类名称',
			sortable : true,
			dataIndex : 'name',
			editor : new Ext.form.TextField()
		}, {
			header : '分类编码',
			sortable : true,
			dataIndex : 'cid',
			editor : new Ext.form.TextField()
		}, {
			header : '创建人',
			sortable : true,
			dataIndex : 'createBy'
		}, {
			header : '创建时间',
			sortable : true,
			dataIndex : 'createTime'
		}, {
			header : '更新人',
			sortable : true,
			dataIndex : 'lastUpdateBy'
		}, {
			header : '更新时间',
			sortable : true,
			dataIndex : 'lastUpdateTime'
		} ],
		renderTo : 'gridType',
		border : false,
		selModel : new Ext.grid.RowSelectionModel(),
		autoHeight : true
	});

	gridType.on('afteredit', function(e) {
		if (e.record.data.name == "") {
			Ext.Msg.alert("提示", "分类名称不能为空！", function() {
				return;
			});
		}

		if (e.field == "name") {
			Ext.Msg.confirm("提示", "您确定要修改该分类名称吗?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
						url : '/MaterialType.do',
						params : {
							type : 3,
							id : e.record.data.id,
							name : e.record.data.name,
							cid : e.record.data.cid,
							op : "name"
						},
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
									data.result)) {
								Info_Tip("修改成功");
								rootType.reload();
								dsType.reload();
							} else {
								Warn_Tip(data.result);
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}
			});
		}

		if (e.field == "cid") {
			Ext.Msg.confirm("提示", "您确定要修改该分类编码吗?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
						url : '/MaterialType.do',
						params : {
							type : 3,
							id : e.record.data.id,
							name : e.record.data.name,
							cid : e.record.data.cid,
							op : "cid"
						},
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
									data.result)) {
								Info_Tip("修改成功");
								rootType.reload();
								dsType.reload();
							} else {
								Warn_Tip(data.result);
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}
			});
		}

	});
};

// *****************************创建菜单********//
function buildToolBar() {
	viewBar = new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : true
		},
		contentEl : 'view',
		items : [ {
			region : 'north',
			height:29,
			tbar : [ {
				text : '新增城市',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/add.gif',
				hidden: compareAuth('LOCAL_MATERIAL_TYPE'),
				handler : addCity
			}, '-',{
				text : '删除城市',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/delete.gif',
				hidden: compareAuth('LOCAL_MATERIAL_TYPE'),
				handler : delCity
			},'-', {
				text : '同步系统材料分类文件',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/email_go.png',
				hidden: compareAuth('LOCAL_MATERIAL_TYPE'),
				handler : generatedJsFile
			}, '-', '-', {
				text : '新增分类',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/cart_add.png',
				hidden: compareAuth('LOCAL_MATERIAL_TYPE'),
				handler : showAddTypeWin
			}, '-', {
				text : '删除分类',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/delete.gif',
				hidden: compareAuth('LOCAL_MATERIAL_TYPE'),
				handler : del
			} ]
		}, new Ext.Panel({
			region : 'west',
			width : "20%",
			autoScroll : true,
			split : true,
			items : [ gridCity ]
		}), new Ext.Panel({
			width : "20%",
			region : 'center',
			autoScroll : true,
			id : 'center_area',
			split : true,
			items : [ treeType ]
		}), new Ext.Panel({
			width:"60%",
			region : 'east',
			id : 'center_area1',
			split : true,
			items : [ gridType ]
		}) ]
	});
};


function delCity(){
	var rows = gridCity.getSelectionModel().getSelections();
	var comeFrom = rows[0].get("comeFrom");
	var city = rows[0].get("city");
	if(!comeFrom){
		//从数据库删除
		Ext.Msg.confirm("提示", "删除后不可恢复，确定要删除吗?", function(op) {
			if (op == "yes") {
				Ext.Ajax.request({
					url : '/MaterialType.do',
					params : {
						type : 10,
						city : city
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							dsCity.reload();
							loadTree.baseParams = {
								city : "中国"
							};
							treeType.getRootNode().reload();
							dsType.reload();
						} else {
							Warn_Tip(data.result);
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		});
	}else{
		dsCity.reload();
		loadTree.baseParams = {
			city : "中国"
		};
		treeType.getRootNode().reload();
	}
}


function showAddTypeWin() {
	var node = treeType.getSelectionModel().getSelectedNode();
	if (node.isLeaf()) {
		Info_Tip("\"" + node.text + "\"已属于一级分类，不能添加。");
		return;
	}

	addTypeForm = new Ext.form.FormPanel({
		layout : 'table',
		layoutConfig : {
			columns : 1
		},
		frame : true,
		labelAlign : 'right',
		autoHeight : true,
		autoWidth : true,
		hideBorders : true,
		items : [ {
			layout : 'form',
			items : {
				id : 'cid',
				fieldLabel : '编码',
				name : "cid",
				xtype : 'textfield'
			}

		}, {
			layout : 'form',
			items : {
				id : 'name',
				fieldLabel : '分类名称',
				name : 'name',
				xtype : "textfield",
				allBlank : false
			}
		} ]
	});

	addTypeWin = new Ext.Window({
		width : 350,
		autoHeight : true,
		title : "为\"" + treeType.getSelectionModel().getSelectedNode().text
				+ "\"添加子分类:",
		layout : 'column',
		border : false,
		frame : true,
		buttonAlign : 'center',
		labelAlign : 'right',
		closeAction : 'hide',
		modal : true,
		items : [ {
			columnWidth : 1,
			items : {
				items : addTypeForm
			}
		} ],
		buttons : [
				{
					text : '确定',
					handler : function() {
						addMaterialType(
								addTypeForm.getForm().getEl().dom.cid.value,
								addTypeForm.getForm().getEl().dom.name.value);
					}
				}, {
					text : '取消',
					handler : function() {
						addTypeWin.close();
					}
				} ],
		listeners : {
			"hide" : function() {
				addTypeForm.getForm().reset();
			}
		}
	});
	addTypeWin.show();

};

function addMaterialType(cid, name) {
	if (name == "") {
		Ext.MessageBox.alert("提示", "分类名称不能为空。");
		return;
	}
	var node = treeType.getSelectionModel().getSelectedNode();
	if (node == null) {
		Ext.MessgeBox.alert("提示", "请选择分类节点。");
	}
	var isLeaf = "1";
	if (node.isLeaf()) {
		Info_Tip("当前分类已属一级分材，不能添加。");
		addTypeWin.close();
		return;
	} else {
		isLeaf = "1";
	}

	if (addTypeForm.getForm().isValid()) {
		if (node) {
			var pid = node.id;
			var pname = node.text;
			if (pid == "0") {
				pname = mtCity;
				isLeaf = "0";
			}
			Ext.Ajax.request({
				url : '/MaterialType.do',
				params : {
					type : 4,
					content : "name~" + name + ";cid~" + cid + ";city~"
							+ mtCity + ";pname~" + pname + ";pid~" + pid
							+ ";isLeaf~" + isLeaf
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						addTypeWin.close();
						rootType.reload();
						dsCity.reload();
					} else {
						Warn_Tip(data.result);

					}
				},
				failure : function() {
					Warn_Tip();
				}

			});
		}
	} else {
		Info_Tip("请正确填写信息。");
	}
};

// 删除分类
function del() {
	var node = treeType.getSelectionModel().getSelectedNode();
	if (isEmpty(node)) {
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}

	var id = node.id;
	if (id == 0) {
		Ext.Msg.alert("提示", "不能从根节点删除，请选择分类节点");
		return;
	}
	Ext.Msg.confirm("提示", "您选择了\"" + node.text + "\"节点,确定要删除吗?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/MaterialType.do',
				params : {
					type : 5,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						rootType.reload();
						dsType.reload();
						dsCity.reload();
					} else {
						Warn_Tip(data.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});

};

var MyRecord = new Ext.data.Record.create([ {
	name : 'comeFrom',
	type : 'string'
}, {
	name : 'city',
	type : 'string'
}, {
	name : 'status',
	type : 'string'
} ]);

function addCity() {
	var p = new MyRecord({
		comeFrom : '0',
		city : '请输入城市名称',
		status : '0'
	});
	dsCity.add(p);
	// gridCity.stopEditing();
	// dsCity.insert(dsCity.record.data.length, p);
	// gridCity.startEditing(0, 0);
}

function generatedJsFile() {
	Ext.Msg.wait("同步中...", "提示");
	Ext.Ajax.request({
		url : '/MaterialType.do',
		params : {
			type : 7
		},
		success : function(response) {
			Info_Tip("同步完成");
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
