Ext.onReady(init);
var grid, ds, ds2, pageSize = 20, query_type, query_input, query_con, win, row, thiseid, fs, vip_grid, memgrid, memds;
function init() {
	buildGrid();
};
// 工具栏
var toolbar = [{
			text : '解锁',
			hidden : compareAuth('VIP_ADMIN_UNLOCK'),
			cls : 'x-btn-text-icon',
			icon : '/resource/images/lock_open.png',
			handler : unlockEmp
		}, {
			text : '彻底删除',
			hidden : compareAuth('VIP_ADMIN_DEL'),
			icon : '/resource/images/delete.gif',
			handler : delAction
		}];
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : toolbar
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "ename", "degree", "updateBy",
								"updateOn", "createOn"]),
				baseParams : {
					page : 1,
					type : 7,
					pageSize : pageSize,
					content:'degree~8'
				},
				countUrl : '/ep/EpAccountServlet',
				countParams : {
					type : 8
				},
				remoteSort : true
			});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 240,
							dataIndex : 'ename'
						}, /*{
							header : '企业等级',
							sortable : true,
							renderer : showDegree,
							dataIndex : 'degree'
						},*/ {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}, {
							header : '更新人',
							sortable : true,
							dataIndex : 'updateBy'
						}, {
							header : '更新时间',
							sortable : true,
							dataIndex : 'updateOn'
						}],
				tbar : toolbar,
				bbar : pagetool,
				renderTo : 'grid'
			});
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : "label",
							text : "企业类型:"
						}, new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									transform : "vip_type",
									hiddenName : "vip_type_val"
								}), "-", {
							xtype : "label",
							text : "查询类型："
						}, new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									transform : "query_con",
									hiddenName : "query_con_val",
									value : 'name'
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							id : "query_input",
							fieldLabel : "关键字",
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, "-", {
							text : "查询",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				empDetail();
			});
};
// 查看/设置企业会员
function EmpMem() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("eid");
	var ename = encodeURI(row.get("name"));
	window.parent.createNewWidget("enterprise_memToemp", '查看企业会员',
			'/module/enterprise/enterprise_mem_add.jsp?eid=' + thisid
					+ "&ename=" + ename);
};
// 查询
function searchlist() {
	query_type = Ext.fly("vip_type_val").getValue();
	query_con = Ext.fly("query_con_val").getValue();
	query_input = Ext.fly("query_input").getValue();
	var temp = query_con + "~" + query_input;
	ds["baseParams"]["content"] = temp+";degree~"+query_type;
	ds.load();
};

// 锁定企业
function unlockEmp() {
	var rows = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	
	var con = "eid=" + rows.get("eid");
	Ext.MessageBox.confirm("确认操作", "您确定要锁定选中的用户吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/ep/EpAccountServlet?type=3", {
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("解锁成功。");
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							}, con)
				}
			})
};
// 修改信息
function empDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	var eid = row.get("eid");
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?id=' + thisid + '&eid='
					+ eid);
};
// 删除操作
function delAction() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条记录。");
		return;
	}
	Ext.Msg.confirm("温馨提示","您确认要删除该记录吗？", function(op) {

				if (op == "yes") {
					Ext.Ajax.request({
								url : "/ep/EpAccountServlet",
								params : {
									type : 4,
									eid : row.get("eid")
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
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
