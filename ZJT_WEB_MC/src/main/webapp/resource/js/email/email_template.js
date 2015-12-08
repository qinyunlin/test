Ext.onReady(init);
var ds, grid, root, tree, fs, win, email_list1, email_list2, ds1, ds2, eid_ds;
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
				text : '模板分类'
			});
	tree = new Ext.tree.TreePanel({
				root : root,
				renderTo : "tree",
				autoScroll : true,
				enableDrag : false,
				animate : true,
				containerScroll : true,
				border : false,
				tbar : [{
							text : '添加分类',
							icon : '/resource/images/add.gif',
							handler : showTemplateArea,
							hidden : compareAuth('EMAIL_TYPE_ADD')
						}, {
							text : '修改分类',
							icon : '/resource/images/edit.gif',
							handler : editClass,
							hidden : compareAuth('EMAIL_TYPE_MOD')
						}, {
							text : '删除分类',
							icon : '/resource/images/delete.gif',
							handler : delClass,
							hidden : compareAuth('EMAIL_TYPE_DEL')
						}

				],
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
					content : 'isLock~0'
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
							text : '添加邮件模板',
							icon : '/resource/images/add.gif',
							handler : jumpToAdd,
							hidden : compareAuth('EMAIL_TEMP_ADD')
						}, {
							text : '修改/查看邮件模板',
							icon : '/resource/images/edit.gif',
							handler : jumpTodetail,
							hidden : compareAuth('EMAIL_TEMP_VIEW')
						}, {
							text : '锁定邮件模板',
							icon : '/resource/images/lock.png',
							handler : lockTemplate,
							hidden : compareAuth('EMAIL_TEMP_LOCK')
						}, {
							text : '发送邮件',
							icon : '/resource/images/email_go.png',
							handler : showEmailArea,
							hidden : compareAuth('EMAIL_TEMP_SEND')
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
				labelWidth : 80,
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
				title : "添加分类",
				width : 250,
				autoHeight : true,
				modal : true,
				items : fs,
				buttonAlign : 'center',
				buttons : [{
							text : '添加',
							handler : addTemplate
						}, {
							text : '取消',
							handler : function() {
								win.close()
							}
						}],
				listeners : {
					"hide" : function(){
						fs.getForm().reset();
					}
				}
			});
	win.show();
};

// 添加邮件分类名称
function addTemplate() {
	var name = fs.getForm().items.map["templateName"].getValue();
	if(Ext.isEmpty(name)){
		Ext.MessageBox.alert("提示", "分类名不能为空");
		return ;
	}
	if (fs.getForm().isValid()) {
		var node = tree.getSelectionModel().getSelectedNode();
		Ext.Ajax.request({
					url : '/email/EmailType.do',
					params : {
						type : 3,
						node : Ext.isEmpty(node) ? 0 : node.id,
						name : name
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							node.leaf = false;
							node.appendChild(new Ext.tree.AsyncTreeNode({ id :
							data.result, text : name, leaf : true }));
							node.getUI().removeClass('x-tree-node-leaf');
							node.getUI().addClass('x-tree-node-expanded');
							node.expand(); 
							win.close();
							/*
							Info_Tip("添加成功");
							root.reload();
							win.close();
							*/
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
	if (Ext.isEmpty(node) || node.id == '0') {
		Ext.Msg.alert("提示", "请选择分类");
		return;
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
							allowBlank : false,
							value : node.text
						}]
			});
	win = new Ext.Window({
				title : '修改分类',
				width : 260,
				autoHeight : true,
				modal : true,
				items : fs,
				buttonAlign : 'center',
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
							win.close();
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
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node)) {
		Info_Tip("请选择一个模板。");
		return;
	}
	Ext.Msg.confirm("确认操作", "您确认要删除该邮件分类吗?", function(op) {
				if (op == "yes") {
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
										Ext.Msg.alert("提示","分类删除成功!");
										node.remove();
										root.select();
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
	if (Ext.isEmpty(node)||node.id == "0") {
		Info_Tip("请选择一个模板分类。");
		return;
	}
	parent.createNewWidget("email_template_add", "添加邮件模板",
			"/module/email/email_template_add.jsp?id=" + node.id + "&nodeText="
					+ encodeURI(node.text));
};

// 锁定邮件模板
function lockTemplate() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择邮件模板。");
		return;
	}

	Ext.Msg.confirm("确认操作", "您确认要锁定选中的信息吗？", function(op) {
				if (op == 'yes') {
					var ids = [];
					for (var i = 0; i < row.length; i++) {
						ids.push(row[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/email/EmailTemplateServlet',
								params : {
									type : 8,
									id : ids.toString()
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("锁定成功。");
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

// 发送邮件区域
function showEmailArea() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一个邮件模板。");
		return;
	}
	eid_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["name", "id"]),
				baseParams : {
					type : 9
				},
				remoteSort : true
			});
	eid_ds.load();
	ds1 = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName"]),
				baseParams : {
					method : "searchPaged",
					validDate : 1,
					pageNo : 1
				},
				countUrl : '/mc/Member.do',
				countParams : {
					type : 6,
					method : 'searchCount'
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds1,
				displayInfo : true
			});
	ds2 = new Ext.data.Store();
	email_list1 = {
		xtype : 'container',
		columnWidth : 0.6,
		height : parent.Ext.fly('tab_1101_iframe').getHeight() / 2,
		items : grid1 = new Ext.grid.GridPanel({
					title : '查询列表',
					ddGroup : 'secondGridDDGroup',
					autoWidth : true,
					autoScroll : true,
					store : ds1,
					height : parent.Ext.fly('tab_1101_iframe').getHeight() / 2,
					viewConfig : {
						forceFit : true
					},
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								header : '会员ID',
								sortable : false,
								dataIndex : 'memberID'
							}, {
								header : '会员名称',
								sortable : false,
								dataIndex : 'trueName'
							}, {
								header : '企业名称',
								sortable : false,
								dataIndex : 'corpName'
							}],
					enableDragDrop : true,
					stripeRows : true,
					tbar : [{
								xtype : 'label',
								text : '搜索类型:'
							}, {
								xtype : "combo",
								store : [["memberID", "会员ID"],
										["corpName", "企业名称"],
										["trueName", "会员姓名"]],
								hiddenName : "query_type",
								mode : "local",
								width : 80,
								triggerAction : "all",
								fieldLabel : "查询类型",
								value : "memberID"
							}, {
								xtype : 'textfield',
								id : 'input_value',
								enableKeyEvents : true,
								listeners : {
									"keyup" : function(tf, e) {
										if (e.getKey() == e.ENTER) {
											searchMem();
										}
									}
								}

							}, {
								text : '查询',
								icon : "/resource/images/zoom.png",
								handler : searchMem
							}],
					bbar : pagetool,
					listeners : {
						"rowdblclick" : function() {
							openInfo();
						}
					}
				})
	};
	email_list2 = {
		xtype : 'container',
		columnWidth : 0.4,
		height : parent.Ext.fly('tab_1101_iframe').getHeight() / 2,
		items : grid2 = new Ext.grid.GridPanel({
					title : '发送邮件名单',
					ddGroup : 'firstGridDDGroup',
					autoWidth : true,
					autoScroll : true,
					store : ds2,
					height : parent.Ext.fly('tab_1101_iframe').getHeight() / 2,
					viewConfig : {
						forceFit : true
					},
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								header : '会员ID',
								sortable : false,
								dataIndex : 'memberID'
							}, {
								header : '会员名称',
								sortable : false,
								dataIndex : 'trueName'
							}],
					enableDragDrop : true,
					stripeRows : true,
					tbar : [{
								text : '查看会员详细',
								icon : '/resource/images/edit.gif',
								handler : openInfo
							}],
					listeners : {
						"rowdblclick" : function() {
							openInfo();
						}
					}
				})
	};
	win = new Ext.Window({
				title : '发送邮件配置',
				width : 800,
				autoHeight : true,
				modal : true,
				layout : 'column',
				items : [email_list1, email_list2],
				buttons : [{
							xtype : 'label',
							text : '发送邮件帐户：'
						}, {
							xtype : 'combo',
							id : 'eid',
							store : eid_ds,
							triggerAction : "all",
							valueField : 'id',
							readOnly : true,
							displayField : 'name'
						}, {
							text : '发送',
							handler : function() {
								sentEmail(row.get('id'));
							}
						}]

			});
	win.show();
	var firstGridDropTargetEl = grid1.getView().scroller.dom;
	var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
				ddGroup : 'firstGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid1.store.add(records);
					grid1.store.sort('trueName', 'ASC');
					return true;
				}
			});

	var secondGridDropTargetEl = grid2.getView().scroller.dom;
	var secondGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
				ddGroup : 'secondGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid2.store.add(records);
					// grid2.store.sort('trueName', 'ASC');
					return true;
				}
			});
};

function searchMem() {
	var query_type = Ext.fly("query_type").getValue();
	ds1.baseParams["content"] = query_type + "~"
			+ Ext.fly("input_value").getValue();
	ds1.load();
};

// 已锁定管理
function lockList() {
	parent.createNewWidget("email_template_lock", "已锁定邮件模板",
			"/module/email/email_template_lock.jsp");
};

// 打开
function openInfo() {
	var row = grid1.getSelectionModel().getSelected()
			|| grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择会员");
		return;
	}
	var id = row.get("memberID");
	window.parent.createNewWidget("member_info", '会员信息',
			'/module/member/member_info.jsp?id=' + id);
};

// 发送邮件
function sentEmail(thisid) {
	Ext.Msg.confirm("确认操作", "您确认要给发送名单内的会员发送邮件吗?", function(op) {
				if (op == 'yes') {
					var len = grid2.store.data.items.length;
					var ids = [];
					for (var i = 0; i < len; i++) {
						ids.push(grid2.store.data.items[i].get('memberID'));
					}
					if (ids.length < 1) {
						Info_Tip("请在发送名单内添加会员。");
						return;
					}
					Ext.Ajax.request({
								url : '/email/EmailTemplateServlet',
								params : {
									type : 7,
									mid : ids.toString(),
									eid : Ext.getCmp('eid').getValue(),
									id : thisid
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("邮件已发送...");
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