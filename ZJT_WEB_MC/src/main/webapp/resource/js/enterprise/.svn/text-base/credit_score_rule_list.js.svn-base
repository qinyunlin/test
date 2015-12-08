Ext.onReady(init);

var memberType = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["0", "诚信供应商"], ["1", "诚信采购商"]]
});

var codeType = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["FAC_AUTH", "FAC_AUTH"], 
	        ["FAC_CREDIT_YEAR_NUM", "FAC_CREDIT_YEAR_NUM"],
	        ["FAC_SUC_EXAMPLE", "FAC_SUC_EXAMPLE"],
	        ["FAC_HONOR", "FAC_HONOR"],
	        ["FAC_SERVICE_BUY", "FAC_SERVICE_BUY"],
	        ["FAC_PUTIN", "FAC_PUTIN"],
	        ["FAC_PROJECT_REG", "FAC_PROJECT_REG"],
	        ["FAC_RECRUITMENT_REG", "FAC_RECRUITMENT_REG"],
	        ["FAC_PRODUCT_DISPLAY", "FAC_PRODUCT_DISPLAY"],
	        ["FAC_PRODUCT_RECOMMEND", "FAC_PRODUCT_RECOMMEND"],
	        ["FAC_HITS", "FAC_HITS"],
	        ["FAC_AWARD", "FAC_AWARD"],
	        ["EP_AUTH", "EP_AUTH"],
	        ["EP_CREDIT_YEAR_NUM", "EP_CREDIT_YEAR_NUM"],
	        ["EP_SERVICE_BUY", "EP_SERVICE_BUY"],
	        ["EP_PROJECT_INFO", "EP_PROJECT_INFO"],
	        ["EP_RECRUITMENT_REG", "EP_RECRUITMENT_REG"],
	        ["EP_PURCHASE_INFO", "EP_PURCHASE_INFO"],
	        ["EP_RECOMMEND", "EP_RECOMMEND"],
	        ["EP_AWARD", "EP_AWARD"]]
});

function init() {
	buildGrid();
};
var tbar = [{
			text : '添加',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("CREDIT_SCORE_RULE_ADD"),
			handler : function() {
				Rule_win("add")
			}
		}, {
			text : '修改',
			icon : "/resource/images/edit.gif",
			hidden : compareAuth("CREDIT_SCORE_RULE_EDIT"),
			handler : function() {
				Rule_win("edit");
			}
		}, {
			text : '删除',
			icon : "/resource/images/cross.png",
			hidden : compareAuth("CREDIT_SCORE_RULE_DEL"),
			handler : function() {
				delRule();
			}
		}];
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});
// 创建列表
function buildGrid() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/score/CreditScoreServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "title", "code","detail", "score", "type", "isDeleted","createOn","updateOn","createBy","updateBy"]),
				baseParams : {
					type : 1,
					content : "isDeleted~0"
				},
				countUrl : '/mc/score/CreditScoreServlet.do',
				countParams : {
					type : 2
				},
				remoteSort : false
			});
	var pagetool = new Ext.ux.PagingToolbar({
		store : store,
		displayInfo : true
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
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
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '积分条件',
							sortable : true,
							dataIndex : 'title'
						}, {
							header : '规则编号',
							sortable : true,
							dataIndex : 'code'
						}, {
							header : "积分",
							sortable : true,
							dataIndex : "score"
						}, {
							header : "积分详情",
							sortable : false,
							dataIndex : "detail"
						}, {
							header : "适用会员",
							sortable : true,
							dataIndex : "type",
							renderer:function(value, metaData, record){
								var type = record.get("type");
								if ("1" == type) return "诚信采购商";
								return "诚信供应商";
							}
						},{
							header : "更新时间",
							sortable : true,
							dataIndex : "updateOn"
						},{
							header : "更新人",
							sortable : true,
							dataIndex : "updateBy"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				renderTo : "grid",
				bbar : pagetool
			});
	store.load();
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				Rule_win("edit");
			});
};

// 规则
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
				maxHeight : Math.floor(parent.Ext.fly("tab_0305_iframe")
						.getHeight()
						/ 1.5),
				autoHeight : true,
				frame : true,
				items : [{
							columnWidth : 0.5,
							layout : 'form',
							items : [{
										xtype : "textfield",
										id : 'title',
										name : 'title',
										allowBlank : false,
										fieldLabel : '积分条件'
									}, {
										xtype : "numberfield",
										id : 'score',
										name : 'score',
										allowBlank : false,
										fieldLabel : '积分'
									}]
						}, {
							columnWidth : 0.5,
							layout : 'form',
							items : [{
									xtype : "combo",
									id : 'code',
									triggerAction : 'all',
									mode : 'local',
									valueField : "value",
									displayField : "text",
									width : 200,
									editable : false,
									store : codeType,
									value : "FAC_AUTH",
									fieldLabel : '规则编号',
									readOnly : true,
									disabled : action == "edit"
											? true
											: false
									}, {
										xtype : "textfield",
										id : 'detail',
										name : 'detail',
										allowBlank : false,
										width : 200,
										fieldLabel : '积分详情'
									}]
						},{
							columnWidth : 0.5,
							layout : 'form',
							items : [{
								xtype : "combo",
								id : 'type',
								triggerAction : 'all',
								mode : 'local',
								valueField : "value",
								displayField : "text",
								width : 100,
								editable : false,
								store : memberType,
								value : "0",
								fieldLabel : '适用会员'
							}]
						}]
			});
	var win = new Ext.Window({
				id : 'rule_win',
				title : actionText + ' 诚信积分设置',
				modal : true,
				width : 600,
				autoHeight : true,
				buttonAlign : "center",
				items : form,
				buttons : [{
							text : '规则编号请勿与现有的编号重复。',
							xtype : 'label'
						}, {
							text : actionText,
							hidden : action == "edit" ? compareAuth("CREDIT_SCORE_RULE_EDIT") : compareAuth("CREDIT_SCORE_RULE_ADD"),
							handler : actionHandler
						}]
			});
	win.show();
	if (action == "edit")
		getInfo();
};

var numReg = /^[1-9]{1}\d*$/;
// 添加操作
function addRule() {
	var form = Ext.getCmp("form_add").getForm();
	if (form.isValid()) {
		var title = Ext.getCmp("title").getValue();
		var score = Ext.getCmp("score").getValue();
		var detail = Ext.getCmp("detail").getValue();
		var code = Ext.getCmp("code").getValue();
		var type = Ext.getCmp("type").getValue();
		if (!numReg.test(score)){
			Info_Tip("积分只能是数字！");
			return false;
		}else if (parseInt(score,10) < 1 || parseInt(score,10) > 50){
			Info_Tip("积分数量只能在1-50之间！");
			return false;
		}
		var content = "title~" + title + ";detail~" + detail + ";type~" + type;
		//var content = getDataPake_default(form, "content");
		Ext.Ajax.request({
					url : '/mc/score/CreditScoreServlet.do',
					params : {
						type : 3,
						code : code,
						score : score,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (json.state == "success") {
							Info_Tip("添加成功!", function() {
										Ext.getCmp("grid_panel").store.reload();
										Ext.getCmp("rule_win").close();
							});
						} else {
							Info_Tip(json.result);
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
				url : '/mc/score/CreditScoreServlet.do',
				params : {
					type : 5,
					id : row.get("id")
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
		var title = Ext.getCmp("title").getValue();
		var score = Ext.getCmp("score").getValue();
		var detail = Ext.getCmp("detail").getValue();
		var code = Ext.getCmp("code").getValue();
		var type = Ext.getCmp("type").getValue();
		if (parseInt(score,8) < 1 || parseInt(score,8) > 50){
			Info_Tip("积分数量只能在1-50之间！");
			return false;
		}
		var content = "title~" + title + ";detail~" + detail + ";type~" + type;
		//var content = getDataPake_default(form, "content");
		Ext.Ajax.request({
					url : '/mc/score/CreditScoreServlet.do',
					params : {
						type : 4,
						id : row.get("id"),
						code : code,
						score : score,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("修改成功!", function() {
										Ext.getCmp("grid_panel").store.reload();
										Ext.getCmp("rule_win").close();
									});

						}else {
							Info_Tip(json.result);
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
						ids.push(rows[i].get("id"));
					}
					Ext.Ajax.request({
								url : '/mc/score/CreditScoreServlet.do',
								params : {
									type : 4,
									id : ids.toString(),
									flag : "del"
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