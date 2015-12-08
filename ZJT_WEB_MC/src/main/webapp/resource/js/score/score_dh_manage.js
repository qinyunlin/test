Ext.onReady(init);
function init() {
	buildGrid();
};
var tbar = [{
			text : '奖品名称:',
			xtype : 'label'
		}, {
			xtype : 'textfield',
			id : 'name_input'
		}, {
			xtype : 'label',
			text : '奖品编号:'
		}, {
			xtype : 'textfield',
			id : 'code_input'
		}, {
			xtype : 'label',
			text : '会员ID:'
		}, {
			xtype : 'textfield',
			id : 'mid_input'
		}, {
			xtype : 'label',
			text : '积分数:'
		}, {
			xtype : 'numberfield',
			id : 'score_input'
		}, {
			text : '搜索',
			icon : "/resource/images/zoom.png",
			handler : searchlist
		}];
// 创建列表
function buildGrid() {
	var store = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/score/ScoreServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "code", "score", "memberID",
								"quantity", "eid", 'createBy', "createOn","recordId"]),
				baseParams : {
					type : 7
				},
				countUrl : '/score/ScoreServlet',
				countParams : {
					type : 8
				},
				remoteSort : false
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true
			});
	var grid = new Ext.grid.GridPanel({
				id : 'grid_panel',
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : store,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				bbar : pagetool,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '奖品名称',
							sortable : true,
							dataIndex : 'name'
						}, {
							header : '奖品编号',
							sortable : true,
							dataIndex : 'code'
						}, {
							header : "积分数",
							sortable : true,
							dataIndex : "score"
						}, {
							header : "数量",
							sortable : true,
							dataIndex : "quantity"
						}, {
							header : "会员ID",
							sortable : true,
							dataIndex : "memberID"
						}, {
							header : "企业ID",
							sortable : true,
							dataIndex : "eid"
						}, {
							header : "操作人",
							sortable : true,
							dataIndex : "createBy"
						}, {
							header : "操作日期",
							sortable : true,
							dataIndex : "createOn"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				renderTo : "grid"
			});
	store.load();
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				Rule_win("edit");
			});
};

// 奖品
function Rule_win(action) {
	var actionHandler = addRule;
	var actionText = "添加";
	if (action == "edit") {
		actionHandler = updateRule;
		actionText = "修改";
	}
	var form = new Ext.form.FormPanel({
				id : 'form_add',
				bodyStyle : 'padding:6px;',
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				labelWidth : 80,
				labelAlign : "right",
				autoWidth : true,
				autoScroll : true,
				maxHeight : Math.floor(parent.Ext.fly("tab_1301_iframe")
						.getHeight()
						/ 1.5),
				autoHeight : true,
				frame : true,
				items : [{
							columnWidth : 0.5,
							layout : 'form',
							items : [{
										xtype : "textfield",
										id : 'name',
										name : 'name',
										allowBlank : false,
										fieldLabel : '奖品名称'
									}, {
										xtype : "numberfield",
										id : 'score',
										name : 'score',
										allowBlank : false,
										fieldLabel : '积分数'
									}]
						}, {
							columnWidth : 0.5,
							layout : 'form',
							items : [{
										xtype : "textfield",
										id : 'code',
										name : 'code',
										allowBlank : false,
										fieldLabel : '奖品编号',
										readOnly : action == "edit"
												? true
												: false
									}, {
										xtype : "numberfield",
										id : 'quantity',
										name : 'quantity',
										allowBlank : false,
										fieldLabel : '数量'
									}]
						}, {
							layout : 'form',
							items : {
								xtype : "radio",
								name : 'type',
								allowBlank : false,
								boxLabel : '系统自动应用的奖品',
								inputValue : '1',
								checked : true
							}
						}, {
							layout : 'form',
							items : {
								xtype : "radio",
								name : 'type',
								allowBlank : false,
								boxLabel : '手动操作的奖品',
								inputValue : '2'
							}
						}, {
							colspan : 2,
							layout : 'form',
							items : {
								xtype : "textarea",
								id : 'description',
								name : 'description',
								allowBlank : false,
								fieldLabel : '描述',
								width : 340
							}
						}]
			});
	var win = new Ext.Window({
				id : 'rule_win',
				title : actionText + ' 奖品',
				modal : true,
				width : 520,
				autoHeight : true,
				items : form,
				buttons : [{
							text : actionText,
							handler : actionHandler
						}]
			});
	win.show();
	if (action == "edit")
		getInfo();
};

// 添加操作
function addRule() {
	var form = Ext.getCmp("form_add").getForm();
	if (form.isValid()) {
		var content = getDataPake_default(form, "content");
		Ext.Ajax.request({
					url : '/score/ScoreRuleServlet',
					params : {
						type : 1,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (json.state == "success") {
							Info_Tip("添加成功!", function() {
										Ext.getCmp("grid_panel").store.reload();
										Ext.getCmp("rule_win").close();
									});

						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

// 获取信息
function getInfo() {
	var row = Ext.getCmp("grid_panel").getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		Ext.getCmp("rule_win").close();
		return;
	}
	Ext.Ajax.request({
				url : '/score/ScoreRuleServlet',
				params : {
					type : 4,
					code : row.get("code")
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Ext.getCmp("form_add").getForm().setValues(json.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};
// 更新操作
function updateRule() {
	var row = Ext.getCmp("grid_panel").getSelectionModel().getSelected();
	var form = Ext.getCmp("form_add").getForm();
	if (form.isValid()) {
		var content = getDataPake_default(form, "content");
		Ext.Ajax.request({
					url : '/score/ScoreRuleServlet',
					params : {
						type : 3,
						code : row.get("code"),
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("修改成功!", function() {
										Ext.getCmp("grid_panel").store.reload();
										Ext.getCmp("rule_win").close();
									});

						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

// 删除
function delRule() {
	var rows = Ext.getCmp("grid_panel").getSelectionModel().getSelections();
	if (rows.length < 1) {
		Info_Tip("请选择信息。");
		return;
	}
	Ext.MessageBox.confirm("温馨提示", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					var ids = [];
					var len = rows.length;
					for (var i = 0; i < len; i++) {
						ids.push(rows[i].get("code"));
					}
					Ext.Ajax.request({
								url : '/score/ScoreRuleServlet',
								params : {
									type : 2,
									code : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("删除成功!", function() {
													Ext.getCmp("grid_panel").store
															.reload();
												});

									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};

// 搜索
function searchlist() {
	var store = Ext.getCmp("grid_panel").store;
	store["baseParams"]["content"] = "name~"
			+ Ext.fly("name_input").getValue().trim() + ";code~"
			+ Ext.fly("code_input").getValue().trim() + ";memberID~"
			+ Ext.fly("mid_input").getValue().trim() + ";score~"
			+ Ext.fly("score_input").getValue().trim();
	store.load();
};