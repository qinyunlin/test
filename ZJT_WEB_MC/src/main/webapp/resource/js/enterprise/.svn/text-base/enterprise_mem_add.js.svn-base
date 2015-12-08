Ext.onReady(init);
var panel, fs, grid1, grid2, ds1, ds2, eid, query_type, contetn, query_input, sel_mid, emp_obj, ename, vipBol = false, win;
var ids = [];// 移动的数据集
function init() {
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '您可以拖拽数据进行添加或删除操作。');
	eid = getCurArgs("eid");
	ename = decodeURI(getCurArgs("ename"))
	buildPanel();
};

// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu1',
						text : '设置管理员',
						handler : setAdmin
					}, {
						id : 'rMenu2',
						text : '取消管理员',
						handler : cancelAdmin
					}, {
						id : 'rMenu3',
						text : '删除企业会员',
						handler : delEmpMem
					}]
		});
function buildPanel() {
	ds1 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName", "degree"]),
				baseParams : {

					method : "searchPaged",
					validDate : 1,
					pageNo : 1
				},
				remoteSort : true
			});
	ds2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpMemberServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName", "isAdmin",
								"degree"]),
				baseParams : {
					type : 7,
					eid : eid
				},
				remoteSort : true
			});
	ds2.load();
	var sm1 = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var sm2 = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	grid1 = new Ext.grid.GridPanel({
				ddGroup : 'secondGridDDGroup',
				store : ds1,
				width : '49%',
				height : 520,
				viewConfig : {
					forceFit : true
				},
				sm : sm1,
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
						}, {
							header : '会员等级',
							sortable : false,
							dataIndex : 'degree',
							renderer : function(v) {
								return showDegree(v);
							}
						}],
				enableDragDrop : true,
				stripeRows : true,
				title : '查询会员',
				tbar : ["<span style='font-weight:bold'>造价通会员列表</span>"]
			});

	grid2 = new Ext.grid.GridPanel({
				ddGroup : 'firstGridDDGroup',
				store : ds2,
				width : '49%',
				height : 520,
				viewConfig : {
					forceFit : true
				},
				sm : sm2,
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
						}, {
							header : '是否管理员',
							sortable : false,
							dataIndex : 'isAdmin',
							renderer : function(v) {
								if (parseInt(v) == 1)
									return "<font style='color:red'>管理员</font>";
								else
									return "普通会员";
							}
						}, {
							header : '会员等级',
							soratable : false,
							dataIndex : 'degree',
							renderer : function(v) {
								return showDegree(v);
							}
						}],
				enableDragDrop : true,
				stripeRows : true,
				title : '企业会员',
				tbar : ["<span style='font-weight:bold'>本企业会员列表</span>"]
			});
	grid2.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	panel = new Ext.Panel({
				title : "<font style='color:red;margin-right:16px'>" + ename
						+ "</font>企业会员查看/设置",
				autoHeight : true,
				autoWidth : true,
				renderTo : "panel",
				layout : "column",
				items : [grid1, grid2],
				tbar : [{
							xtype : "label",
							text : "查询类型："
						}, {
							xtype : "combo",
							store : [["memberID", "会员ID"],
									["corpName", "企业名称"], ["trueName", "会员姓名"]],
							hiddenName : "query_type",
							mode : "local",
							triggerAction : "all",
							fieldLabel : "查询类型",
							value : "memberID"
						}, {
							xtype : "textfield",
							id : "query_input"
						}, {
							xtype : "button",
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});

	var firstGridDropTargetEl = grid1.getView().scroller.dom;
	var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
				ddGroup : 'firstGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid1.store.add(records);
					grid1.store.sort('name', 'ASC');
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
					grid2.store.sort('name', 'ASC');
					return true;
				}
			});
	grid2.store.on("add", function(store, record, num) {
				if (Ext.isEmpty(record)) {
					Info_Tip("请选择一条记录");
					return;
				}
				saveEmpInfo(record[0].get("memberID"));
			});
	grid2.store.on("remove", function(store, record, num) {
				if (Ext.isEmpty(record)) {
					Info_Tip("请选择一条记录");
					return;
				}
				delEmpMem(record.get("memberID"))
			});
};
// 搜索
function searchlist() {
	query_type = Ext.fly("query_type").getValue();
	query_input = Ext.fly("query_input").getValue();
	if (Ext.isEmpty(query_input)) {
		Info_Tip("请输入条件。");
		return;
	}
	ds1["baseParams"]["content"] = query_type + "~" + query_input;
	ds1.load();
};

// 设置管理员
function setAdmin() {
	var row = grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	sel_mid = row.get("memberID");
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=10", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("设置成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + sel_mid + "&isAdmin=1&eid="+eid);
};

// 取消管理员
function cancelAdmin() {
	var row = grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	sel_mid = row.get("memberID");
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=10", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("设置成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + sel_mid + "&isAdmin=0&eid="+eid);
};

// 保存已添加的企业会员
function saveEmpInfo(mid) {
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=8", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("企业会员添加成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + mid + "&eid=" + eid);
};

// 删除企业会员
function delEmpMem(mid) {
	var sel_mid;
	if (!Ext.isEmpty(mid)) {
		sel_mid = mid;
	} else {
		var row = grid2.getSelectionModel().getSelected();
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
		sel_mid = row.get("memberID");
	}
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=9", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("删除成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + sel_mid+"&eid="+eid);
};
