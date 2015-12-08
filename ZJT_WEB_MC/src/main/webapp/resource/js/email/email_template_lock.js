Ext.onReady(init);
var ds, grid, root, tree, fs, win, email_list1, email_list2, ds1, ds2;
function init() {
	buildTree();
	buildNodeContent();
	buildLayout();
};

// 创建模板树
function buildTree() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '邮件分类'
			});
	tree = new Ext.tree.TreePanel({
				title : '邮件分类',
				root : root,
				renderTo : "tree",
				autoScroll : true,
				animate : true,
				enableDD : true,
				containerScroll : true,
				border : false,
				/*
				tbar : [{
							text : '添加分类',
							icon : '/resource/images/add.gif',
							handler : showTemplateArea,
							hidden:compareAuth('EMAIL_TYPE_ADD')
						}, {
							text : '修改分类',
							icon : '/resource/images/edit.gif',
							handler : editClass,
							hidden:compareAuth('EMAIL_TYPE_MOD')
						}, {
							text : '删除分类',
							icon : '/resource/images/delete.gif',
							handler : delClass,
							hidden:compareAuth('EMAIL_TYPE_DEL')
						}

				],*/
				listeners : {
					"click" : function(node, e) {
						ds.baseParams["cid"] = node.id;
						ds.load();
					}
				}

			});
	changeTemplage();
};

// 模板内容切换
function changeTemplage() {
	tree.loader = new Ext.tree.TreeLoader({
				dataUrl : '/email/EmailType.do?type=1',
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
	// tempType = obj.get('type');
	// root.attributes["owner"] = obj.get('owner');
	// root.attributes["tempType"] = obj.get('type');
	// root.attributes["path"] = "0";
	root.reload();
	root.expand();
	root.select();

};

// 建立模板内容列表
function buildNodeContent() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailTemplateServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', 'cname', "content", "createBy", "createOn",
								"subject", "id", "updateBy", "updateOn"]),
				baseParams : {
					type : 5,
					cid : 1,
					content:'isLock~1'
				},
				countUrl : '/email/EmailTemplateServlet',
				countParams : {
					type : 6
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
							width : 260,
							dataIndex : 'name'
						}, {
							header : '邮件分类名称',
							sortable : true,
							dataIndex : 'cname',
							width : 60
						}, {
							header : '添加时间',
							sortable : true,
							dataIndex : 'createOn',
							renderer : trimDate,
							width : 60
						}, {
							header : '添加人',
							dataIndex : 'createBy',
							width : 60
						}, {
							header : '修改时间',
							sortable : true,
							dataIndex : 'updateOn',
							renderer : trimDate,
							width : 60
						}, {
							header : '修改人',
							sortable : true,
							dataIndex : 'updateBy',
							width : 60
						}, {
							header : 'id',
							sortable : true,
							dataIndex : 'id',
							hidden : true
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel(),
				bbar : pagetool,
				tbar : [{
							text : '修改/查看邮件模板',
							icon : '/resource/images/edit.gif',
							handler : jumpTodetail,
							hidden:compareAuth('EMAIL_TEMP_MOD')
//						}, {
//							text : '解锁邮件模板',
//							icon : '/resource/images/lock_open.png',
//							handler : unlockTemplate,
//							hidden:compareAuth('EMAIL_TEMP_UNLOCK')
//						}, {
//							text : '删除邮件模板',
//							icon : '/resource/images/delete.gif',
//							handler : delTemplate,
//							hidden:compareAuth('EMAIL_TEMP_DEL')
						}

				]
			});
	ds.load();
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				jumpTodetail();
			});
};

function buildLayout() {
	new Ext.Viewport({
				layout : 'border',
				items : [new Ext.Panel({
									width : "22%",
									region : 'center',
									autoScroll : true,
									id : 'center_area',
									split : true,
									items : tree
								}), new Ext.Panel({
									width : "78%",
									autoScroll : true,
									region : "east",
									split : true,
									items : [grid]
								})]
			});
};

// 添加模板区域
function showTemplateArea() {
	fs = new Ext.FormPanel({
				bodyStyle : 'padding:6px',
				autoWidth : true,
				height : 40,
				labelWidth : 90,
				labelAlign : 'right',
				items : [{
							fieldLabel : '邮件分类名称',
							id : 'templateName',
							xtype : 'textfield',
							maxLength : 50,
							allowBlank : false
						}]
			});
	win = new Ext.Window({
				width : 300,
				title:'添加分类',
				autoHeight : true,
				modal : true,
				items : fs,
				buttons : [{
							text : '添加',
							handler : addTemplate
						}, {
							text : '取消',
							handler : function() {
								win.close()
							}
						}]
			});
	win.show();
};

// 添加邮件分类名称
function addTemplate() {
	if (fs.getForm().isValid()) {
		var node = tree.getSelectionModel().getSelectedNode();
		if (Ext.isEmpty(node))
			node = 0;
		else
			node = node.id;
		Ext.Ajax.request({
					url : '/email/EmailType.do',
					params : {
						type : 3,
						node : node,
						name : fs.getForm().items.map["templateName"]
								.getValue()
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("添加成功");
							root.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

// 修改分类
function editClass() {
	var node = tree.getSelectionModel().getSelectedNode();
	if(Ext.isEmpty(node) || node.id=='0'){
		Ext.Msg.alert("提示", "请选择分类");
		return ;
	}
	fs = new Ext.FormPanel({
				bodyStyle : 'padding:6px',
				autoWidth : true,
				height : 40,
				labelWidth : 90,
				labelAlign : 'right',
				items : [{
							fieldLabel : '邮件分类名称',
							id : 'editName',
							xtype : 'textfield',
							maxLength : 50,
							allowBlank : false
						}]
			});
	win = new Ext.Window({
				width : 300,
				autoHeight : true,
				title:'修改分类',
				modal : true,
				items : fs,
				buttons : [{
							text : '修改',
							handler : editTemplate
						}, {
							text : '取消',
							handler : function() {
								win.close()
							}
						}]
			});
	win.show();
};

// 修改邮件分类名称
function editTemplate() {
	if (fs.getForm().isValid()) {
		var node = tree.getSelectionModel().getSelectedNode();
		if (Ext.isEmpty(node)) {
			Info_Tip("请选择一个模板。");
			return;
		}
		Ext.Ajax.request({
					url : '/email/EmailType.do',
					params : {
						type : 5,
						node : node.id,
						name : fs.getForm().items.map["editName"].getValue()
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("修改成功");
							root.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

// 删除邮件分类
function delClass() {
	Ext.Msg.confirm("确认操作", "您确认要删除该邮件分类吗?", function(op) {
				if (op == "yes") {
					var node = tree.getSelectionModel().getSelectedNode();
					if (Ext.isEmpty(node)) {
						Info_Tip("请选择一个模板。");
						return;
					}
					Ext.Ajax.request({
								url : '/email/EmailType.do',
								params : {
									type : 4,
									node : node.id
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("修改成功");
										root.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};

// 转入模板内容页
function jumpTodetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	parent.createNewWidget("email_template_detail", "模板内容",
			"/module/email/email_template_detail.jsp?id=" + row.get('id')
					+ "&nodeText=" + encodeURI(row.get('cname')));
};

// 添加邮件模板
function jumpToAdd() {
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node)) {
		Info_Tip("请选择一个模板分类。");
		return;
	}
	if (node.id == "0") {
		Info_Tip("请勿选择模板内容。");
		return;
	}
	parent.createNewWidget("email_template_add", "添加邮件模板",
			"/module/email/email_template_add.jsp?id=" + node.id + "&nodeText="
					+ encodeURI(node.text));
};

// 解锁邮件模板
function unlockTemplate() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择邮件模板。");
		return;
	}

	Ext.Msg.confirm("确认操作", "您确认要解锁选中的信息吗？", function(op) {
				if (op == 'yes') {
					var ids = [];
					for (var i = 0; i < row.length; i++) {
						ids.push(row[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/email/EmailTemplateServlet',
								params : {
									type : 9,
									id : ids.toString()
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("解锁成功。");
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

//删除
function delTemplate() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择邮件模板。");
		return;
	}

	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == 'yes') {
					var ids = [];
					for (var i = 0; i < row.length; i++) {
						ids.push(row[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/email/EmailTemplateServlet',
								params : {
									type : 2,
									id : ids.toString()
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("删除成功。");
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

