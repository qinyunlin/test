Ext.onReady(init);
var ds, ds2, grid1, grid2, panel;
function init() {
	Ext.TipSelf.msg('提示', '列表间的拖拽行为可对数据进行添加与删除的操作。');
	buildGrid();
};
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu3',
						text : '删除专家 ',
						handler : delPro
					}]
		});
function buildGrid() {
	ds1 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName"]),
				baseParams : {

					method : "searchPaged",
					isvoid : 1,
					pageNo : 1
				},
				remoteSort : true
			});
	ds2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/QuestionServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName", "degree",
								"createOn"]),
				baseParams : {
					method : "getExperts"

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
								}), sm1, {
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
				title : '查询会员列表'
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
								}), sm2, {
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
							header : '会员类型',
							sortable : false,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '注册日期',
							sortable : false,
							dataIndex : 'createOn',
							renderer : trimDate
						}],
				enableDragDrop : true,
				stripeRows : true,
				title : '专家列表'

			});
	grid2.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	panel = new Ext.Panel({
				title : "",
				autoHeight : true,
				autoWidth : true,
				renderTo : "panel",
				layout : "column",
				bodyStyle : 'border:nonde',
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
				addPro(record[0].get("memberID"));
			});
	grid2.store.on("remove", function(store, record, num) {
				if (Ext.isEmpty(record)) {
					Info_Tip("请选择一条记录");
					return;
				}
				delPro(record.get("memberID"))
			});
};
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

// 添加专家
function addPro(mid) {
	Ext.lib.Ajax.request("post", "/QuestionServlet?method=setExpert", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("添加成功。");
						ds2.reload();
					} else {
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "mid=" + mid);
};

// 删除专家
function delPro(mid) {
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
	Ext.lib.Ajax.request("post", "/QuestionServlet?method=deleteExpert", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("删除成功。");
						ds2.reload();
					} else {
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "mid=" + sel_mid);
};