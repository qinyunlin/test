var ds, grid;
var pro = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : cur_website
		});
// 右键菜单
var rightClick = new Ext.menu.Menu({
			shadow : false,
			id : 'rightClickCont',
			items : [{
						id : 'rMenu2',
						text : '打开',
						hidden : compareAuth("ASK_VIEW"),
						handler : showaskinfo
					}, {
						id : 'rMenu1',
						text : '解锁',
						hidden : compareAuth("ASK_UNLOCK"),
						handler : unlock
					}, {
						id : 'rMenu0',
						text : '删除',
						hidden : compareAuth("ASK_ADMIN_DEL"),
						handler : del
					}]
		});
var buildGrid = function() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ask/AskServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "spec", "memberID", "createOn",
								"revNum"]),
				baseParams : {
					type : 6,
					isLock : 1,
					pageSize : 20
				},
				countUrl : '/ask/AskServlet',
				countParams : {
					type : 7

				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});

	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							width : 30,
							dataIndex : 'id'
						}, {
							header : '名称',
							sortable : false,
							width : 200,
							dataIndex : 'name'
						}, {
							header : '型号规格',
							sortable : false,
							width : 200,
							dataIndex : 'spec'
						}, {
							header : '发布人',
							sortable : true,
							width : 80,
							dataIndex : 'memberID'
						}, {
							header : '发布日期',
							sortable : true,
							width : 100,
							dataIndex : 'createOn'
						}, {
							header : '回复数',
							sortable : false,
							width : 30,
							dataIndex : 'revNum'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '打开',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("ASK_VIEW"),
							handler : function() {
								var rec = grid.getSelectionModel()
										.getSelected();
								showaskinfo(rec.data.id);
							}
						}, '-', {
							text : '解锁',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/lock_open.png",
							hidden : compareAuth("ASK_UNLOCK"),
							handler : unlock
						}, '-', {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							hidden : compareAuth("ASK_ADMIN_DEL"),
							handler : del
						}],
				bbar : pagetool,
				renderTo : 'ask_grid'
			});
	var tbar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : 'label',
							text : '站点:'
						}, new Ext.form.ComboBox({
									store : pro,
									emptyText : "请选择",
									id : 'area_sel',
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									displayField : "text",
									allowBlank : false,
									// value : tempzhcn[0],
									listeners : {
										'select' : function(combo) {
											ds.baseParams["province"] = combo.value;
											ds.load();
										}
									}
								})]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();

				selectinfo = row.get("id");
				showaskinfo(selectinfo);

			});
	ds.load();
};
function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};
Ext.onReady(function() {
			init();
		});

// 查看详细信息
function showaskinfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("ask_info", '普通询价信息',
			'/module/ask/ask_info.jsp?id=' + row.get("id"));
};

// 解锁
function unlock() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定解锁选中的信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskServlet", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("解锁成功。");
							ds.reload();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				}, "type=22&id=" + ids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}
};

// 删除
function del() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除选中的信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskServlet", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("删除成功。");
							ds.reload();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				}, "type=23&id=" + ids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}
};