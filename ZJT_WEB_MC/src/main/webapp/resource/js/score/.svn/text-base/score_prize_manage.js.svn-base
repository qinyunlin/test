Ext.onReady(init);
function init() {
	buildGrid();
};
var tbar = [{
			text : '添加奖品',
			icon : "/resource/images/ruby_add.png",
			hidden : compareAuth("SCORE_GOODS_ADD"),
			handler : function() {
				Rule_win("add")
			}
		}, {
			text : '修改奖品',
			icon : "/resource/images/ruby_gear.png",
			hidden : compareAuth("SCORE_GOODS_MOD"),
			handler : function() {
				Rule_win("edit");
			}
		}, {
			text : '删除奖品',
			icon : "/resource/images/ruby_delete.png",
			hidden : compareAuth("SCORE_GOODS_DEL"),
			handler : delGoods

		}];
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});
// 创建列表
function buildGrid() {
	var store = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/score/GoodsServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "code", "score", "description",
								"createBy", "createOn", "updateBy", "updateOn",
								"photo"]),
				baseParams : {
					type : 5
				},
				countUrl : '/score/GoodsServlet',
				countParams : {
					type : 6
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
							header : "创建人",
							sortable : true,
							dataIndex : "createBy"
						}, {
							header : "创建日期",
							sortable : true,
							dataIndex : "createOn"
						}, {
							header : "更新人",
							sortable : true,
							dataIndex : "updateBy"
						}, {
							header : "更新日期",
							sortable : true,
							dataIndex : "updateOn"
						}, {
							header : "描述",
							sortable : true,
							dataIndex : "description"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				renderTo : "grid"
			});

	store.load();
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : 'label',
							text : '奖品编号:'
						}, {
							xtype : "textfield",
							id : 'code_input'
						}, {
							xtype : 'label',
							text : '奖品名称:'
						}, {
							xtype : "textfield",
							id : 'name_input'
						}, {
							text : '搜索',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				Rule_win("edit");
			});
};

// 奖品
function Rule_win(action) {
	var actionHandler = addAction;
	var actionText = "添加";
	if (action == "edit") {
		actionHandler = updateAction;
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
		autoScroll : true,
		labelAlign : "right",
		autoWidth : true,
		autoScroll : true,
		maxHeight : Math.floor(parent.Ext.fly("tab_1304_iframe").getHeight()
				/ 1.5),
		autoHeight : true,
		frame : true,
		items : [{
					columnWidth : 0.7,
					layout : 'form',
					items : [{
								xtype : "textfield",
								id : 'name',
								name : 'name',
								width : 220,
								allowBlank : false,
								fieldLabel : '奖品名称'
							}, {
								xtype : "numberfield",
								id : 'score',
								name : 'score',
								width : 220,
								allowBlank : false,
								fieldLabel : '积分数'
							}, {
								layout : 'form',
								hidden : action == "edit" ? false : true,
								items : {
									xtype : "textfield",
									id : 'code',
									name : 'code',
									width : 220,
									fieldLabel : '奖品编号',
									readOnly : true
								}
							}, {
								layout : 'form',
								items : {
									xtype : "textarea",
									id : 'description',
									name : 'description',
									width : 220,
									fieldLabel : '描述'
								}
							}]
				}, {
					columnWidth : 0.3,
					layout : 'form',
					items : [{
								style : 'margin-left:16px;',
								html : '<img id="imgLogo" src="" width="160" />'
							}, {
								text : '上传',
								xtype : "button",
								style : 'margin-left:16px;',
								handler : initUpload
							}]
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
function addAction() {
	var form = Ext.getCmp("form_add").getForm();
	if (form.isValid()) {
		var content = getDataPake_default(form, "content");

		var img = getImgUrl(Ext.fly("imgLogo").dom.src);
		content += ';photo~' + img;
		Ext.Ajax.request({
					url : '/score/GoodsServlet',
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
				url : '/score/GoodsServlet',
				params : {
					type : 4,
					code : row.get("code")
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Ext.getCmp("form_add").getForm().setValues(json.result);
						Ext.fly("imgLogo").dom.src = getImgUrl(FileSite
										+ json.result["photo"], "160", true);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};
// 更新操作
function updateAction() {
	var row = Ext.getCmp("grid_panel").getSelectionModel().getSelected();
	var form = Ext.getCmp("form_add").getForm();
	if (form.isValid()) {
		var content = getDataPake_default(form, "content");
		var img = getImgUrl(Ext.fly("imgLogo").dom.src);
		content += ';photo~' + img;
		Ext.Ajax.request({
					url : '/score/GoodsServlet',
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
function delGoods() {
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
								url : '/score/GoodsServlet',
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

// 初始化上传组件
function initUpload() {
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|jpeg|gif/;
	FileUpload_Ext.initComponent();
};
function upload_fn() {
	Ext.fly("imgLogo").dom.src = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};

// 搜索列表
function searchlist() {
	var store = Ext.getCmp("grid_panel").store;
	store["baseParams"]["content"] = "code~" + Ext.fly("code_input").getValue().trim()
			+ ";name~" + Ext.fly("name_input").getValue().trim()
	store.load();
};