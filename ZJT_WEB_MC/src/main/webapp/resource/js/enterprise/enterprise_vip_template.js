Ext.onReady(init);
function init() {
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '请先选择模板,双击模板名称可进行修改。');
	buildGrid_manage();
	buildTree();
	buildNodeContent();
	buildLayout();
};
var tree_node = {
	text : '未分类',
	leaf : true,
	path : '0'
};
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						text : '查看供应商',
						handler : function() {
							lookSuplier();
						}
					}, {
						text : '添加供应商',
						handler : function() {
							addEmterprise();
						}
					}, {
						text : '删除供应商',
						handler : function() {
							delEmterprise();
						}
					}, {
						text : '移动供应商',
						handler : function() {
							moveSup();
						}
					}, {
						text : '查看供应商材料',
						handler : function() {
							openInfo();
						}
					}]
		});
var ds, grid, ds_manage, grid_manage, tree, root, win, fs, ds_template, grid_template;
var tempType;// 分类标识
// 建立模板管理区
function buildGrid_manage() {
	ds_manage = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseTempCatalogServlet?type=7'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ['type', 'owner']
						}, ['type', 'owner'])
			});
	ds_manage.load();
	grid_manage = new Ext.grid.EditorGridPanel({
				store : ds_manage,
				autoWidth : true,
				height : 130,
				autoScroll : true,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), {
							header : '模板名称',
							width : 150,
							sortable : true,
							dataIndex : 'owner',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '模板标识',
							width : 150,
							sortable : true,
							dataIndex : 'type'
						}],
				renderTo : 'l_grid',
				border : false,
				autoExpandColumn : 'common',
				selModel : new Ext.grid.RowSelectionModel(),
				tbar : [{
							text : '添加模板',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('VIP_TEMP_SUP'),
							handler : addTemplateArea
						}, {
							text : '查看模板导入记录',
							icon : '/resource/images/table_multiple.png',
							hidden : compareAuth('VIP_TEMP_VIEW'),
							handler : showTemplageLog
						}],
				listeners : {
					"rowclick" : function(thisgrid, rowIndex, e) {
						var row = thisgrid.getSelectionModel().getSelected();
						changeTemplage(row);
						Ext.getCmp("center_area").enable();
						tree.getRootNode().appendChild(tree_node);
					}
				}
			});
	grid_manage.on('afteredit', function(e) {
				Ext.Msg.confirm('确认操作', '确认要修改选中的信息吗？', function(op) {
							if (op == 'yes') {
								editTemplate_name(e.record.data);
							} else
								ds_manage.reload();
						})
			});
};

// 建立layout
function buildLayout() {
	new Ext.Viewport({
				layout : 'border',
				items : [new Ext.Panel({
									region : 'north',
									split : true,
									height : 128,
									items : grid_manage
								}), new Ext.Panel({
									width : "22%",
									region : 'center',
									autoScroll : true,
									id : 'center_area',
									split : true,
									items : [tree]
								}), new Ext.Panel({
									width : "78%",
									autoScroll : true,
									region : "east",
									split : true,
									items : [grid]
								})]
			});
	Ext.getCmp("center_area").disable();
};

// 建立center模板内容区域
function buildTree() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '模板内容'
			});
	tree = new Ext.tree.TreePanel({
				root : root,
				renderTo : "tree",
				autoScroll : true,
				animate : true,
				enableDrag : false,
				containerScroll : true,
				border : false,
				tbar : [{
							text : '添加分类',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('VIP_TEMP_SUP'),
							handler : showAddClass
						}, {
							text : '删除分类',
							icon : '/resource/images/delete.gif',
							hidden : compareAuth('VIP_TEMP_SUP'),
							handler : delClass
						}, {
							text : '修改分类',
							icon : '/resource/images/book_edit.png',
							hidden : compareAuth('VIP_TEMP_SUP'),
							handler : editClass
						}],
				listeners : {
					"click" : function(node, e) {
						if (Ext.isEmpty(node)) {
							Info_Tip("请选择一个分类。");
							return;
						}
						if (node.attributes["text"] == '未分类') {
							ds.baseParams["path"] = node.attributes["path"];
							ds.baseParams["content"] = "";
						} else {
							ds.baseParams["path"] = node.attributes["path"];
							ds.baseParams["content"] = "type~" + tempType;
						}
						ds.load();
					}
				}

			});
};

// 模板内容切换
function changeTemplage(obj) {
	tree.loader = new Ext.tree.TreeLoader({
				dataUrl : '/ep/EnterpriseTempCatalogServlet?type=4&tempType='
						+ obj.get('type'),
				params : {
					node : 0
				}
			});
	tree.loader.processResponse = function(response, node, callback, scope) {
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
				var n = this.createNode(o[i]);
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
	tempType = obj.get('type');
	root.attributes["owner"] = obj.get('owner');
	root.attributes["tempType"] = obj.get('type');
	root.attributes["path"] = "0";
	root.reload();
	root.expand();
	root.select();

};

// 建立厂商列表
function buildNodeContent() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpTempSupplierServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', 'linkman', "phone", "area", "brand",
								"cname", "id", "catalog"]),
				baseParams : {
					type : 6,
					pageSize : 20
				},
				countUrl : '/ep/EpTempSupplierServlet',
				countParams : {
					type : 5
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				autoWidth : true,
				autoHeight : true,
				autoScroll : true,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [sm, new Ext.grid.RowNumberer(), {
							header : '名称',
							sortable : true,
							width : 150,
							dataIndex : 'name',
							editor : {
								xtype : "textfield"
							}
						}, {
							header : '品牌',
							sortable : true,
							dataIndex : 'brand',
							editor : {
								xtype : "textfield"
							}
						}, {
							header : '联系人',
							sortable : true,
							dataIndex : 'linkman',
							editor : {
								xtype : "textfield"
							}
						}, {
							header : '联系电话',
							width : 150,
							dataIndex : 'phone',
							editor : {
								xtype : "textfield"
							}
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area',
							editor : {
								xtype : "textfield"
							}
						}, {
							header : '分类名称',
							sortable : true,
							dataIndex : 'cname',
							renderer : function(v) {
								if (v == null) {
									return "未分类";
								} else
									return v;
							}
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel(),
				bbar : pagetool,
				tbar : [{
							text : '查看供应商',
							icon : '/resource/images/book_open.png',
							handler : function() {
								lookSuplier();
							}
						}, {
							text : '添加供应商',
							icon : '/resource/images/add.gif',
							handler : addEmterprise
						}, {
							text : '删除供应商',
							icon : '/resource/images/delete.gif',
							handler : delEmterprise
						}, {
							text : '移动供应商',
							icon : '/resource/images/arrow_redo.png',
							handler : moveSup
						}, {
							text : '查看供应商材料',
							icon : '/resource/images/book_open.png',
							handler : openInfo
						}]
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : 'label',
							text : '供应商名称：'
						}, {
							xtype : 'textfield',
							id : 'sup_name'
						}, {
							xtype : 'label',
							text : '地区：'
						}, {
							xtype : 'textfield',
							id : 'sup_area'
						}, {
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}, "->", {
							text : '高级搜索',
							icon : "/resource/images/keyboard_magnify.png",
							handler : highSearch
						}]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on('beforeedit', function(e) {
				if (!compareAuth('VIP_SUP_SUP'))
					return true;
				else
					return false;
			});
	grid.on("validateedit", function(e) {
				if (e.value.length == 0 && !e.record.data[e.field]) {
					return false;
				}
				switch (e.field) {
					case "name" :
						if (e.value.gblen() == 0) {
							Info_Tip("企业名称不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (e.value.gblen() > 240) {
							Info_Tip("企业名称长度不能大于120。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case "brand" :

						if (e.value.gblen() > 90) {
							Info_Tip("品牌长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case "linkman" :
						if (e.value.gblen() > 90) {
							Info_Tip("联系人长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case "mobile" :
						if (e.value.gblen() > 120) {
							Info_Tip("联系方式长度不能大于60。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case "area" :
						if (e.value.gblen() > 100) {
							Info_Tip("地区长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
				}
				return true;
			});
	grid.on("afteredit", function(e) {
				if (compareAuth('VIP_SUP_SUP')) {
					return;
				}
				editSupInfo(e.record.data.id, e.field, e.record.data[e.field]);
			});
};

// 修改模板名称
function editTemplate_name(obj) {
	var row = grid_manage.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请双击一条信息。");
		return;
	}
	Ext.Ajax.request({
				url : "/ep/EnterpriseTempCatalogServlet",
				params : {
					type : 8,
					tempName : obj["owner"],
					tempType : obj["type"]
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("修改成功");
						ds_manage.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 添加模板
function addTemplateArea() {
	fs = new Ext.FormPanel({
				layout : "form",
				autoWidth : true,
				autoHeight : true,
				labelWidth : 60,
				labelAlign : 'right',
				bodyStyle : 'padding:6px',
				items : [{
							xtype : 'textfield',
							fieldLabel : '模板名称',
							id : "tempName",
							allowBlank : false,
							maxLength : 60
						}, {
							xtype : 'textfield',
							fieldLabel : '模板标识',
							id : "tempType",
							allowBlank : false,
							maxLength : 50,
							regex : /^\w{6,50}$/,
							regexText : "请正确输入模板标识（最少6位字母或数字）"
						}, {
							xtype : 'textfield',
							fieldLabel : '分类名称',
							id : 'name',
							allowBlank : false,
							maxLength : 50
						}]
			});
	win = new Ext.Window({
				title : '添加模版',
				width : 320,
				autoHeight : true,
				draggable : true,
				modal : true,
				items : [fs],
				buttons : [{
							text : '添加',
							handler : addTemplareSubmit
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 添加模板保存
function addTemplareSubmit() {
	var len=ds_manage.data.keys.length;
	var temp=[];
	for(var i=0;i<len;i++){
		temp.push(ds_manage.data.map[ds_manage.data.keys[i]].data.type);
	}
	if(temp.indexOf(fs.getForm().items.map["tempType"]
								.getValue())!=-1){
		Info_Tip("模板标识重复，请重新输入。")	
		return;
	}
	if (fs.getForm().isValid()) {
		Ext.Ajax.request({
					url : '/ep/EnterpriseTempCatalogServlet',
					params : {
						type : 1,
						node : 0,
						name : fs.getForm().items.map["name"].getValue(),
						tempName : fs.getForm().items.map["tempName"]
								.getValue(),
						tempType : fs.getForm().items.map["tempType"]
								.getValue()
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("添加成功");
							ds_manage.reload();
							win.close();
						}
					},
					failure : function() {
					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
};
// 删除模板
function delTemplate() {
	var row = grid_template.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.Ajax.request({
				url : '/ep/EpTemplateServlet',
				params : {
					type : 2,
					tempType : row.get("tempType"),
					eid : row.json["eid"]
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("删除成功");
						ds_template.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 添加分类
function showAddClass() {
	fs = new Ext.FormPanel({
				layout : "form",
				autoWidth : true,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				labelWidth : 60,
				labelAlign : 'right',
				items : [{
							xtype : 'textfield',
							fieldLabel : '分类名称',
							id : "class_name",
							allowBlank : false,
							width : 180,
							maxLength : 60
						}]
			});
	win = new Ext.Window({
				title : '添加分类',
				width : 300,
				autoHeight : true,
				raggable : true,
				modal : true,
				items : [fs],
				buttons : [{
							text : '添加',
							handler : addClassSubmit
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 添加分类保存
function addClassSubmit() {
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node)) {
		Info_Tip("请选择一个分类。");
		return;
	}
	var temptype = '';
	if (Ext.isEmpty(node.attributes["tempType"])) {
		temptype = tempType;
	} else
		temptype = node.attributes["tempType"];
	if (fs.getForm().isValid()) {
		Ext.Ajax.request({
					url : '/ep/EnterpriseTempCatalogServlet',
					params : {
						type : 1,
						node : node.id,
						name : fs.getForm().items.map["class_name"].getValue(),
						tempName : node.attributes["owner"],
						tempType : temptype
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("添加成功");
							root.reload();
							tree.getRootNode().appendChild(tree_node);
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
};

// 删除分类
function delClass() {
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node) || node == tree.getRootNode()) {
		Info_Tip("请选择一个分类。");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "请问您确定要删除选中的分类吗？", function(op) {
				if (op == 'yes') {
					Ext.Ajax.request({
								url : '/ep/EnterpriseTempCatalogServlet',
								params : {
									type : 2,
									id : node.id
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("删除成功");
										root.reload();
										tree.getRootNode()
												.appendChild(tree_node);
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			})
};

// 修改分类
function editClass() {
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node) || node == tree.getRootNode()) {
		Info_Tip("请选择一个分类。");
		return;
	}
	fs = new Ext.FormPanel({
				layout : "form",
				autoWidth : true,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				labelWidth : 60,
				labelAlign : 'right',
				items : [{
							xtype : 'textfield',
							fieldLabel : '分类名称',
							id : "edit_name",
							allowBlank : false,
							width : 180,
							maxLength : 60,
							value : node.text
						}]
			});
	win = new Ext.Window({
				title : '修改分类',
				width : 300,
				autoHeight : true,
				raggable : true,
				modal : true,
				items : [fs],
				buttons : [{
							text : '修改',
							handler : editClassSubmit
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};
// 保存修改信息
function editClassSubmit() {
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node) || node.text == "模板内容" || node.text == "未分类") {
		Info_Tip("请选择一个分类。");
		win.close();
		return;
	}
	if (fs.getForm().isValid()) {
		Ext.Ajax.request({
					url : '/ep/EnterpriseTempCatalogServlet',
					params : {
						type : 3,
						id : node.id,
						name : fs.getForm().items.map["edit_name"].getValue()
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("修改成功");
							root.reload();
							tree.getRootNode().appendChild(tree_node);
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip("请填写必要信息。");
};
// 查询列表
function searchlist() {
	var node = tree.getSelectionModel().getSelectedNode();
	ds.baseParams["path"] = node.attributes["path"];
	ds.baseParams["content"] = "type~" + tempType + ";name~"
			+ Ext.fly("sup_name").getValue() + ";area~"
			+ Ext.fly("sup_area").getValue();
	ds.load();
};

// 查看供应商报价
function openInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.data["id"];
	window.parent.createNewWidget("enterprise_vip_template_mat", '查看供应商材料报价',
			'/module/enterprise/enterprise_vip_template_mat.jsp?sid=' + thisid);

};

// 查看模板导入记录
function showTemplageLog() {
	var row = grid_manage.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择模板。");
		return;
	}
	ds_template = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpTemplateServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : "id"
						}, ['eid', 'id', 'fname', 'tempName', 'tempType',
								'updateBy', 'updateOn']),
				baseParams : {
					type : 3,
					tempType : row.get("type")
				},
				remoteSort : true
			});
	ds_template.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds_template,
				displayInfo : true
			});
	grid_template = new Ext.grid.GridPanel({
				store : ds_template,
				autoWidth : true,
				autoHeight : true,
				autoScroll : true,
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',

							dataIndex : 'eid'
						}, {
							header : '企业简称',

							dataIndex : 'fname'
						}, {
							header : '模板名称',

							dataIndex : 'tempName'
						}, {
							header : '更新人',

							dataIndex : 'updateBy'
						}, {
							header : '更新日期',

							dataIndex : 'updateOn',
							renderer : trimDate
						}],
				tbar : [{
							text : '删除企业已导入模板',
							icon : '/resource/images/delete.gif',
							handler : delTemplate
						}
				// , {
				// text : '同步供应商模板',
				// icon : '/resource/images/arrow_refresh.png',
				// handler : updateTemplate
				// }
				]
			});
	win = new Ext.Window({
				title : '查看模板导入记录',
				width : parent.Ext.fly("tab_0303_iframe").getWidth() / 2,
				maxHeight : parent.Ext.fly("tab_0303_iframe").getHeight() / 2,
				autoScroll : true,
				modal : true,
				border : false,
				plain : true,
				items : [grid_template]
			});
	win.show();
};

// 同步模板
function updateTemplate() {
	var row = grid_template.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择记录。");
	}
	Ext.Ajax.request({
				url : '/ep/EpTemplateServlet',
				params : {
					type : 4,
					eid : row.json["eid"],
					tempType : tempType
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("模板同步成功。");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};
// 删除供应商
function delEmterprise() {
	var row = grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < row.length; i++) {
		mids.push(row[i].get("id"));
	}
	if (mids.length < 1) {
		Info_Tip("请选择供应商。");
		return;
	}
	Ext.Ajax.request({
				url : '/ep/EpTempSupplierServlet',
				params : {
					type : 3,
					id : mids.toString()
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("供应商删除成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

var tree1, root1;
function buildTree1() {
	root1 = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '模板内容'
			});
	tree1 = new Ext.tree.TreePanel({
				root : root1,
				rootVisible : true,
				height : parent.Ext.fly('tab_0303_iframe').getHeight() / 2,
				autoScroll : true,
				animate : true,
				enableDD : true,
				containerScroll : true,
				border : false
			});
	changeTreeLoad(grid_manage.getSelectionModel().getSelected().data["type"]);
	// var node = {
	// text : '未分类',
	// leaf : true,
	// path : '0',
	// id : '0'
	// };
	// root1.appendChild(node);
};

function changeTreeLoad(temp) {
	tree1.loader = new Ext.tree.TreeLoader({
				dataUrl : '/ep/EnterpriseTempCatalogServlet',
				baseParams : {
					type : 4,
					tempType : temp
				}
			});
	tree1.loader.processResponse = function(response, node, callback, scope) {
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
				var n = this.createNode(o[i]);
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

	// tempType = obj['type'];
	// root.attributes["owner"] = obj['owner'];
	root1.attributes["tempType"] = temp
	root1.attributes["path"] = "0";
	root1.expand();
	root1.select();

};
// 移动供应商
function moveSup() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择供应商。");
		return;
	}
	buildTree1();
	win = new Ext.Window({
				title : '移动供应商 当前分类：<font style="color:red">'
						+ (rows[0].get('cname') == null ? "未分类" : rows[0]
								.get('cname')) + "</font>",
				modal : true,
				width : 300,
				autoHeight : true,
				items : tree1,
				buttons : [{
							text : '移动',
							handler : saveMove
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();

};

// 保存移动
function saveMove() {
	Ext.Msg.show({
		title : '确认操作',
		msg : "请选择您要进行的操作:1.复制,此操作会经您选择的供应商复制一份至目标分类,该操作不会删除原分类已选中的供应商(是)。<br/>2.移动,此操作会将您所选中的供应商移动至目标分类,该操作<font style='color:red'>会删除</font>原分类已选中的供应商（否）。",
		buttons : Ext.Msg.YESNOCANCEL,
		icon : Ext.MessageBox.QUESTION,
		fn : function(op) {
			var cid = tree1.getSelectionModel().getSelectedNode().attributes['id'];
			if (cid == "0") {
				Info_Tip('请正确选择分类。');
				return;
			}
			var rows = grid.getSelectionModel().getSelections();
			var ids = [];
			for (var i = 0; i < rows.length; i++) {
				ids.push(rows[i].get('id'));
			}
			var iscopy = 1;
			if (op == 'no') {
				iscopy = 0;
			}
			Ext.Ajax.request({
						url : '/ep/EpTempSupplierServlet',
						params : {
							type : 7,
							id : ids.toString(),
							copy : iscopy,
							fromCId : rows[0].data['catalog'],
							cid : cid
						},
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
									data.result)) {
								Info_Tip("供应商移动成功。");
								ds.reload();
								win.close();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
		}
	});
};

// 修改供应商信息
function editSupInfo(thisid, field, data) {
	Ext.Ajax.request({
				url : '/ep/EpTempSupplierServlet',
				params : {
					type : 2,
					id : thisid,
					content : field + "~" + data
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("供应商修改成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}

			});
};

// 查看供应商信息
function lookSuplier() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一个供应商");
		return;
	}
	window.parent.createNewWidget("enterprise_vip_sup_look", '查看供应商',
			'/module/enterprise/enterprise_vip_sup_look.jsp?id='
					+ row.get("id"), false);
};

// 添加企业
function addEmterprise() {
	window.parent.createNewWidget("enterprise_vip_sup_add", '添加供应商',
			'/module/enterprise/enterprise_vip_sup_add.jsp', false);
};

// 高级搜索
function highSearch() {
	window.parent.createNewWidget("enterprise_vip_sup_search", '供应商高级搜索',
			'/module/enterprise/enterprise_vip_sup_search.jsp', false);
};