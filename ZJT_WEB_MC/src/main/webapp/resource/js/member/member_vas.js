Ext.onReady(init);
function init() {
	buildGrid();
	Ext.TipSelf.time = 5;
	Ext.TipSelf.msg('提示', "在列表中双击您想修改的询价总量可进行快速修改。");
};
var query_fs, ds_info;
var ds_mem = new Ext.data.SimpleStore({
			fields : [{
						name : 'value'
					}, {
						name : 'text'
					}],
			data : info_type_combox_common
		});

var tbar = [{
			text : '添加帐户',
			icon : '/resource/images/add.gif',
			hidden : compareAuth("MEM_ADD"),
			handler : openInfo
		}, {
			text : '删除帐户',
			icon : '/resource/images/cross.png',
			hidden : compareAuth("MEM_DEL"),
			handler : delInfo
		}, {
			text : '查看帐户历史',
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("MEM_VIEW"),
			handler : checkHis
		}];
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});
// 显示列表
function buildGrid() {
	var ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/AskCountExServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "memberID", "createBy", "createOn", "total",
								"updateBy", "updateOn", "used"]),
				baseParams : {
					type : 4,
					pageSize : 20,
					pageNo : 1
				},
				countUrl : '/AskCountExServlet',
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
				dataIndex : "id"
			});
	var grid = new Ext.grid.EditorGridPanel({
				id : 'vas_grid',
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : '询价总量',
							sortable : false,
							dataIndex : 'total',
							editor : {
								xtype : 'numberfield',
								allowBlank : false
							}
						}, {
							header : '已使用量',
							sortable : false,
							dataIndex : 'used'
						}, {
							header : '创建人',
							sortable : true,
							dataIndex : 'createBy'
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
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid"
			});
	var tbar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							text : '会员ID',
							handler : search
						}, {
							xtype : 'textfield',
							id : "mid_input"
						}, "-", {
							text : "查询",
							icon : "/resource/images/zoom.png",
							handler : search
						}]
			});
	ds.load();
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on('beforeedit', function(e) {
				if (!compareAuth('MEM_MOD'))
					return true;
				else
					return false;
			});
	grid.on("validateedit", function(e) {
				if (Ext.isEmpty(e.value)) {
					return false;
				} else
					return true;
			});
	grid.on("afteredit", function(e) {
				editInfo(e.record.data["memberID"], e.value);
			});
};

// 显示会员列表
function openInfo() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else {

		webArea = parent.currUser_mc.accessStie;
		if (webArea == "ALL") {
			webArea = '中国';
		}
	}
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "memberID", "degree", "trueName", "corpName",
								"createOn", "validDate", "regProvince",
								"accessSite"]),
				baseParams : {
					method : "searchPaged",
					pageNo : 1,
					validDate : 0,
					memberType : 0,
					province : webArea,
					pageSize : 10,
					validDate : 1,
					degree : 3
				},
				countUrl : '/mc/Member.do',
				countParams : {
					method : "searchCount"
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});

	var sel_type = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [["memberID", "会员ID"], ["trueName", "会员名称"],
						["corpName", "公司名称"], ["regProvince", "注册地区"],
						["webProvince", "信息价地区"]]
			});

	var grid_info = new Ext.grid.GridPanel({
				id : 'mem_grid',
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							xtype : "label",
							text : '站点选择:'
						}, new Ext.form.ComboBox({
									store : getAccessSite(),
									emptyText : "请选择",
									id : 'area_sel',
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									displayField : "text",
									allowBlank : false,
									value : webArea,
									width : 80
								}), {
							id : 'info_type',
							name : 'info_type',
							hiddenName : "info_type_input",
							fieldLabel : '会员类型',
							store : ds_mem,
							typeAhead : true,
							mode : 'local',
							triggerAction : 'all',
							emptyText : '请选择会员类型',
							valueField : "value",
							displayField : "text",
							readOnly : true,
							xtype : "combo",
							value : "3",
							listeners : {
								"select" : function(combo) {
									ds_info.baseParams["degree"] = combo.value;
									ds_info.load();
								}
							}
						}, "-", sel_combo = new Ext.form.ComboBox({
									store : sel_type,
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									displayField : "text",
									value : "memberID",
									width : 80

								}), "-", {
							xtype : "textfield",
							id : "search_input",
							width : 130,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}],
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : 'eid',
							sortable : false,
							dataIndex : 'EID',
							hidden : true
						}, {
							header : '会员类型',
							sortable : false,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						}, {
							header : "访问站点",
							sorable : true,
							width : 70,
							dataIndex : 'accessSite',
							renderer : changeSite
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool
			});
	var win = new Ext.Window({
				id : 'add_win',
				title : '添加增值帐户',
				modal : true,
				width : Math.floor(parent.Ext.fly("tab_0206_iframe").getWidth()
						/ 1.5),
				autoHeight : true,
				items : grid_info,
				buttons : [{
							text : '询价量:',
							xtype : 'label'
						}, {
							xtype : 'numberfield',
							id : 'total',
							fieldLabel : "询价量"
						}, {
							text : '添加',
							handler : addMem
						}, {
							text : '取消',
							handler : function() {
								Ext.getCmp("add_win").close();
							}
						}]
			});
	win.show();
	ds_info.load();
};
// 查询
function searchlist() {
	var temp_query = "";
	var query_type = sel_combo.getValue();
	var mem_type = Ext.fly("info_type_input").getValue();
	temp_query = query_type + "~";
	ds_info.baseParams["degree"] = mem_type;
	ds_info.baseParams["province"] = Ext.getCmp("area_sel").getValue();
	ds_info.baseParams["content"] = temp_query
			+ Ext.fly("search_input").getValue();
	ds_info.load();
};

// 添加帐户
function addMem() {
	var row = Ext.getCmp("mem_grid").getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择会员。");
		return;
	}
	var total = Ext.fly("total").getValue().trim();
	if (Ext.isEmpty(total)) {
		Info_Tip("请输入询价量。");
		return;
	}
	Ext.Ajax.request({
				url : '/AskCountExServlet',
				params : {
					type : 1,
					mid : row.get("memberID"),
					total : total
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("添加成功。", function() {
									Ext.getCmp("add_win").close();
									Ext.getCmp("vas_grid").store.reload();
								});
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 修改询价量
function editInfo(mid, value) {
	Ext.Ajax.request({
				url : '/AskCountExServlet',
				params : {
					type : 3,
					total : value,
					mid : mid
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {

					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 删除帐户
function delInfo() {
	var row = Ext.getCmp("vas_grid").getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择信息。");
		return;
	}
	Ext.MessageBox.confirm("温馨提示", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/AskCountExServlet',
								params : {
									type : 2,
									mid : row.get("memberID")
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("信息已删除。", function() {
													Ext.getCmp("vas_grid").store
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

function search() {
	var store = Ext.getCmp("vas_grid").store;
	var mid = Ext.fly("mid_input").getValue().trim();
	store.baseParams["content"] = "memberID~" + mid;
	store.load();
};
// 查看历史
function checkHis() {
	var row = Ext.getCmp("vas_grid").getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择信息。");
		return;
	}
	var store = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/AskCountExServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "memberID", "createBy", "createOn", "total",
								"updateBy", "updateOn", "used", "opType",
								"opTime", "operator"]),
				baseParams : {
					type : 6,
					pageSize : 10,
					pageNo : 1,
					mid : row.get("memberID")
				},
				countUrl : '/AskCountExServlet',
				countParams : {
					type : 7
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
				autoWidth : true,
				height : Math.floor(parent.Ext.fly("tab_0206_iframe")
						.getHeight()
						/ 1.5),
				stripeRows : true,
				loadMask : true,
				store : store,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : '询价总量',
							sortable : true,
							dataIndex : 'total'
						}, {
							header : '已使用量',
							sortable : false,
							dataIndex : 'used'
						}, {
							header : '创建人',
							sortable : false,
							dataIndex : 'createBy'
						}, {
							header : "创建日期",
							sortable : false,
							dataIndex : "createOn"
						}, {
							header : "操作类型",
							sortable : false,
							dataIndex : "opType",
							renderer : typeSel
						}, {
							header : "操作人",
							sortable : false,
							dataIndex : "operator"
						}, {
							header : "操作日期",
							sortable : false,
							dataIndex : "opTime"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool
			});
	var win = new Ext.Window({
				title : '历史记录',
				modal : true,
				width : Math.floor(parent.Ext.fly("tab_0206_iframe").getWidth()
						/ 1.5),
				autoHeight : true,
				items : grid
			});
	win.show();
	store.load();
};
