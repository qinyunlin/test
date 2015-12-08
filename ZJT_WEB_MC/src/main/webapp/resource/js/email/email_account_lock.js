Ext.onReady(init);
var grid, ds, fs, win;
function init() {
	buildGrid();
	Ext.QuickTips.init(true);
};
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['createBy', 'createOn', "displayName",
								"emailAddress", "id", "name",
								"server", "updateBy", "updateOn"]),
				baseParams : {
					type : 5,
					cid : 1,
					content : 'isLock~1'
				},
				countUrl : '/email/EmailAccountServlet',
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
	grid = new Ext.grid.GridPanel({
				autoWidth : true,
				autoScroll : true,
				store : ds,
				autoHeight : true,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [sm, new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '邮箱帐户名称',
							sortable : true,
							dataIndex : 'name'
						}, {
							header : 'SMTP服务器',
							sortable : true,
							dataIndex : 'server'
						}, {
							header : '邮箱地址',
							sortable : true,
							dataIndex : 'emailAddress'
						}, {
							header : '显示名称',
							sortable : true,
							width : 50,
							dataIndex : 'displayName'
						}, {
							header : '修改人',
							sortable : true,
							width : 50,
							dataIndex : 'updateBy'
						}, {
							header : '修改时间',
							sortable : true,
							dataIndex : 'updateOn',
							width : 50,
							renderer : trimDate
						}],
				enableDragDrop : true,
				stripeRows : true,
				tbar : [{
							text : '修改帐户',
							icon : "/resource/images/edit.gif",
							handler : function() {
								showAddArea('edit');
							},
							hidden : compareAuth('EMAIL_ACCOUNT_MOD')
//						}, {
//							text : '解锁帐户',
//							icon : "/resource/images/lock_open.png",
//							handler : unlock,
//							hidden : compareAuth('EMAIL_ACCOUNT_UNLOCK')
//						}, {
//							text : '删除帐户',
//							icon : "/resource/images/delete.gif",
//							handler : delAccount,
//							hidden : compareAuth('EMAIL_ACCOUNT_DEL')
						}],
				renderTo : 'grid',
				bbar : pagetool,
				listeners : {
					"rowdblclick" : function() {
						showAddArea('edit');
					}
				}
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : 'label',
							text : '邮箱帐户名称:'
						}, {
							xtype : 'textfield',
							id : 'input_name'

						}, "-", {
							xtype : 'label',
							text : '邮箱用户名:'
						}, {
							xtype : 'textfield',
							id : 'input_username',
							fieldLabel : '邮件用户名'

						}, "-", {
							xtype : 'label',
							text : '邮箱地址:'
						}, {
							xtype : 'textfield',
							id : 'input_addr'

						}, "-", {
							xtype : 'label',
							text : '显示名称:'
						}, {
							xtype : 'textfield',
							id : 'input_displayname'

						}, {
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});
	ds.load();
};
var content;
function searchlist() {
	content = "name~" + Ext.fly("input_name").getValue() + ";username~"
			+ Ext.fly("input_username").getValue() + ';emailAddress~'
			+ Ext.fly("input_addr").getValue() + ";displayName~"
			+ Ext.fly("input_displayname").getValue() + ";isLock~1";
	ds.baseParams["content"] = content;
	ds.load();
};

// 显示添加区域
function showAddArea(op) {
	var add_btn = false;
	var edit_btn = false;
	var row = grid.getSelectionModel().getSelected();
	if (op == "edit") {
		add_btn = true;
	} else {
		edit_btn = true;
	}
	if (op == "edit") {
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
	}
	fs = new Ext.FormPanel({
				autoWidth : true,
				autoHeight : true,
				layout : 'form',
				bodyStyle : "padding:6px",
				items : [{
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							labelWdith : 80,
							labelAlign : 'right',
							items : {
								xtype : 'textfield',
								fieldLabel : '邮箱帐户名称',
								id : 'name',
								name : 'name',
								width : 184,
								allowBlank : false,
								maxLength : 80
							}
						}, {
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							labelWdith : 80,
							labelAlign : 'right',
							items : {
								xtype : 'textfield',
								fieldLabel : '显示名称',
								id : 'displayName',
								name : 'displayName',
								width : 184,
								allowBlank : false,
								maxLength : 180
							}
						}, {
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							labelWdith : 80,
							labelAlign : 'right',
							items : {
								xtype : 'textfield',
								fieldLabel : '邮箱用户名',
								id : 'username',
								name : 'username',
								width : 184,
								allowBlank : false,
								maxLength : 80
							}
						}, {
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							labelWdith : 80,
							labelAlign : 'right',
							items : {
								xtype : 'textfield',
								fieldLabel : '邮箱密码',
								id : 'password',
								name : 'password',
								inputType:'password',
								width : 184,
								allowBlank : false,
								maxLength : 180
							}
						}, {
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							labelWdith : 80,
							labelAlign : 'right',
							items : {
								xtype : 'textfield',
								fieldLabel : 'SMTP服务器',
								id : 'server',
								name : 'server',
								width : 184,
								allowBlank : false,
								maxLength : 180
							}
						}, {
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							labelWdith : 80,
							labelAlign : 'right',
							items : {
								xtype : 'textfield',
								fieldLabel : '邮箱地址',
								id : 'emailAddress',
								name : 'emailAddress',
								width : 184,
								allowBlank : false,
								maxLength : 180,
								vtype : 'email'
							}
						}]
			});
	win = new Ext.Window({
				title : '帐户配置',
				modal : true,
				width : 360,
				autoScroll : true,
				autoHeight : true,
				items : fs,
				buttons : [{
							text : '添加',
							handler : saveAccount,
							hidden : add_btn
						}, {
							text : '修改',
							hidden : edit_btn,
							handler : function() {
								saveEdit(row.get('id'));
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	if(op == 'edit'){
		bindInfo(row.get('id'));
	}
};

function saveAccount() {
	if (fs.getForm().isValid()) {
		var content = '';
		var len = fs.getForm().items.length;
		for (var i = 0; i < len; i++) {
			content += fs.getForm().items.keys[i]
					+ "~"
					+ fs.getForm().items.map[fs.getForm().items.keys[i]]
							.getValue() + ";";
		}
		content = content.slice(0, content.lastIndexOf(";"));
		Ext.Ajax.request({
					url : '/email/EmailAccountServlet',
					params : {
						type : 1,
						content : content
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("添加成功。");
							ds.reload();
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

function bindInfo(thisid) {
	Ext.Ajax.request({
				url : '/email/EmailAccountServlet',
				params : {
					type : 4,
					id : thisid
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						fs.getForm().setValues(data.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

function saveEdit(thisid) {
	Ext.Msg.confirm("确认操作", "您确认要修改该信息吗？", function(op) {
		if (op == "yes") {
			if (fs.getForm().isValid()) {
				var content = '';
				var len = fs.getForm().items.length;
				for (var i = 0; i < len; i++) {
					content += fs.getForm().items.keys[i]
							+ "~"
							+ fs.getForm().items.map[fs.getForm().items.keys[i]]
									.getValue() + ";";
				}
				content = content.slice(0, content.lastIndexOf(";"));
				Ext.Ajax.request({
					url : '/email/EmailAccountServlet',
					params : {
						type : 3,
						id : thisid,
						content : content
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("修改成功。");
							win.close();
							ds.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			} else {
				Info_Tip();
			}
		} else {
			bindInfo(thisid);
		}
	});
};

function unlock() {
	Ext.Msg.confirm("确认操作", "您确认要解锁选中的信息吗？", function(op) {
				if (op == "yes") {
					var row = grid.getSelectionModel().getSelections();
					if (Ext.isEmpty(row)) {
						Info_Tip("请选择要解锁的帐户。");
						return;
					}
					var ids = [];
					for (var i = 0; i < row.length; i++) {
						ids.push(row[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/email/EmailAccountServlet',
								params : {
									type : 8,
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

function delAccount() {
	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					var row = grid.getSelectionModel().getSelections();
					if (Ext.isEmpty(row)) {
						Info_Tip("请选择要删除的帐户。");
						return;
					}
					var ids = [];
					for (var i = 0; i < row.length; i++) {
						ids.push(row[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/email/EmailAccountServlet',
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