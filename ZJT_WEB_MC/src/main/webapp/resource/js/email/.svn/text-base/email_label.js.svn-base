Ext.onReady(init);
var grid, ds, fs, win;
function init() {
	buildGrid();
};

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailLabelServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', 'labelName', "labelType", "createBy",
								"createOn", "labelValue", "id", "updateBy",
								"updateOn", "description"]),
				baseParams : {
					type : 5
				},
				countUrl : '/email/EmailLabelServlet',
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
				loadMask : true,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [sm, new Ext.grid.RowNumberer(), {
							header : '标签名称',
							sortable : true,
							width : 120,
							dataIndex : 'name'
						}, {
							header : '标签标识',
							sortable : true,
							dataIndex : 'labelName',
							width : 60
						}, {
							header : '标签系统值',
							sortable : true,
							dataIndex : 'labelValue',
							width : 60
						}, {
							header : '标签标类型',
							sortable : true,
							dataIndex : 'labelType',
							width : 30,
							renderer : function(v) {
								switch (v) {
									case "1" :
										return "常量";
										break;
									case "2" :
										return '变量';
										break;
								}
							}
						}, {
							header : '标签描述',
							sortable : true,
							dataIndex : 'description',
							width : 60
						}, {
							header : '添加时间',
							sortable : true,
							dataIndex : 'createOn',
							renderer : trimDate,
							width : 40
						}, {
							header : '添加人',
							dataIndex : 'createBy',
							width : 40
						}, {
							header : '修改时间',
							sortable : true,
							dataIndex : 'updateOn',
							renderer : trimDate,
							width : 40
						}, {
							header : '修改人',
							sortable : true,
							dataIndex : 'updateBy',
							width : 40
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
							text : '添加',
							icon : '/resource/images/add.gif',
							handler : addLabel,
							hidden : compareAuth('EMAIL_LABEL_ADD')
						}, {
							text : '修改/查看标签',
							icon : '/resource/images/edit.gif',
							handler : function() {
								addLabel('edit');
							},
							hidden : compareAuth('EMAIL_LABEL_MOD')
						}, {
							text : '删除标签',
							icon : '/resource/images/delete.gif',
							handler : delLabel,
							hidden : compareAuth('EMAIL_LABEL_DEL')
						}

				],
				listeners : {
					"rowdblclick" : function() {
						addLabel('edit');
					}
				}
			});
	ds.load();
};

// 添加标签
function addLabel(op) {
	var btn_add = false;
	var btn_edit = false;
	var row = grid.getSelectionModel().getSelected();
	if (op == "edit") {
		btn_add = true;
	} else {
		btn_edit = true;

	}
	fs = new Ext.FormPanel({
				autoWidth : true,
				height : parent.Ext.fly('tab_1102_iframe').getHeight() / 2,
				bodyStyle : 'padding:6px;',
				layout : 'form',
				labelAlign : 'right',
				labelWIdth : 60,
				autoHeight : true,
				items : [{
							fieldLabel : '标签名称',
							xtype : 'textfield',
							id : 'name',
							name : 'name',
							allowBlank : false,
							maxLength : 80,
							width : 200
						}, {
							fieldLabel : '标签标识',
							xtype : 'textfield',
							id : 'labelName',
							name : 'labelName',
							allowBlank : false,
							maxLength : 50,
							width : 200
						}, {
							fieldLabel : '标签系统值',
							xtype : 'textfield',
							id : 'labelValue',
							name : 'labelValue',
							allowBlank : false,
							maxLength : 200,
							width : 200
						}, {
							fieldLabel : '标签名称',
							xtype : 'combo',
							store : label_type,
							triggerAction : 'all',
							id : 'labelType',
							name : 'labelType',
							allowBlank : false,
							maxLength : 80,
							readOnly : true,
							width : 200
						}, {
							fieldLabel : '标签描述',
							xtype : 'textarea',
							id : 'description',
							name : 'description',
							allowBlank : false,
							maxLength : 360,
							width : 200,
							height : 60
						}]
			});
	win = new Ext.Window({
				title : '标签配置',
				modal : true,
				width : 360,
				autoHeight : true,
				items : fs,
				buttons : [{
							text : '修改',
							hidden : btn_edit,
							handler : function() {
								saveEdit(row.get('id'));
							}
						}, {
							text : '添加',
							hidden : btn_add,
							handler : saveAdd

						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	if (op == "edit") {
		bindInfo(row.get('id'));
	}
};

function saveAdd() {
	if (fs.getForm().isValid()) {
		var content = "";
		for (var i = 0; i < fs.getForm().items.length; i++) {
			content += fs.getForm().items.keys[i]
					+ "~"
					+ fs.getForm().items.map[fs.getForm().items.keys[i]]
							.getValue() + ';';
		}
		content = content.slice(0, content.lastIndexOf(';'));
		Ext.Ajax.request({
					url : '/email/EmailLabelServlet',
					params : {
						type : 1,
						content : content
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("添加成功");
							win.close();
							ds.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

function saveEdit(thisid) {
	if (fs.getForm().isValid()) {
		var content = "";
		for (var i = 0; i < fs.getForm().items.length; i++) {
			content += fs.getForm().items.keys[i]
					+ "~"
					+ fs.getForm().items.map[fs.getForm().items.keys[i]]
							.getValue() + ';';
		}
		content = content.slice(0, content.lastIndexOf(';'));
		Ext.Ajax.request({
					url : '/email/EmailLabelServlet',
					params : {
						type : 3,
						content : content,
						id : thisid
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("修改成功");
							win.close();
							ds.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

// 绑定数据
function bindInfo(thisid) {
	Ext.Ajax.request({
				url : '/email/EmailLabelServlet',
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

// 删除标签
function delLabel() {
	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					var ids = [];
					var rows = grid.getSelectionModel().getSelections();
					for (var i = 0; i < rows.length; i++) {
						ids.push(rows[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/email/EmailLabelServlet',
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
				} else
					bindInfo();
			});
};