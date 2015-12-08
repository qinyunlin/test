Ext.onReady(init);
var ds, grid;
function init() {
	buildGrid();
};

var item1 = [{
			text : '查看详细',
			handler : function() {
				openInfo();
			},
			hidden : compareAuth("QA_VIEW")
		}, {
			id : 'rMenu3',
			text : '删除',
			handler : function() {
				del_complete();
			},
			hidden : compareAuth("QA_DEL")
		}, {
			id : 'rMenu4',
			text : '解锁',
			handler : function() {
				revertOp();
			},
			hidden : compareAuth("QA_UNLOCK")
		}]
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : item1
		});

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/QuestionServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "tname", "title", "createOn", "author",
								"hits", "revNum", "isTop"]),
				baseParams : {
					pageNo : 1,
					method : 'getPage',
					pageSize : 20,
					isDel : "1"
				},
				countUrl : '/QuestionServlet',
				countParams : {
					method : "getCount"
				},
				remoteSort : true
			});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '所属类别',
							sortable : false,
							width : 40,
							dataIndex : 'tname'
						}, {
							header : 'id',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '标题',
							sortable : false,
							dataIndex : 'title'
						}, {
							header : '发布时间',
							sortable : false,
							width : 40,
							dataIndex : 'createOn',
							renderer : trimDate
						}, {
							header : '发表作者',
							sortable : false,
							width : 40,
							dataIndex : 'author'
						}, {
							header : '阅读数',
							sortable : false,
							width : 40,
							dataIndex : 'hits'
						}, {
							header : '回复数',
							sortable : false,
							width : 40,
							dataIndex : 'revNum'
						}, {
							header : '是否置顶',
							width : 30,
							sortable : false,
							dataIndex : 'isTop',
							renderer : function(v) {
								if (v == "1")
									return "<font style='color:red'>是</font>"
								else
									return "否";
							}
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : []
			});
	
	var bar2 = new Ext.Toolbar({
				id : 'bar2',
				renderTo : grid.tbar,
				items : [{
							text : "查看详细",
							handler : openInfo,
							icon : "/resource/images/book_open.png",
							hidden : compareAuth("QA_VIEW")
						}, {
							text : '删除',
							icon : "/resource/images/delete.gif",
							handler : del_complete,
							hidden : compareAuth("QA_DEL")
						}, {
							text : '解锁',
							icon : "/resource/images/lock_open.png",
							handler : revertOp,
							hidden : compareAuth("QA_UNLOCK")
						}]
			});
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
							text : '类型：',
							xtype : 'label'
						}, {
							xtype : 'combo',
							id : 'type_comno',
							triggerAction : "all",
							readOnly : true,
							value : '',
							emptyText : '请选择',
							store : [["", "所有类型"], ["1", "清单定价"],
									["2", "定额解释"], ["3", "工程保险"],
									["4", "招标与合同"], ["5", "建筑"], ["6", "装饰"],
									["7", "安装"], ["8", "市政"], ["9", "园林"]]
						}, "-", {
							xtype : 'combo',
							id : 'sh_combo',
							mode : "local",
							triggerAction : 'all',
							readOnly : true,
							store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [['1', '已审核'],['0', '未审核']]
							}),
							displayField : "text",
							valueField : "value",
							value : '1'
						}, "-", {
							text : "标题：",
							xtype : "label"
						}, {
							xtype : 'textfield',
							id : 'input_title',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e){
									if(e.getKey() == e.ENTER){
										searchlist();
									}
								}
							}
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}]
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		openInfo();
		});

};
function searchlist() {
	ds.baseParams["title"] = Ext.fly("input_title").getValue();
	ds.baseParams["tid"] = Ext.getCmp("type_comno").getValue();
	ds.baseParams["isAudit"] = Ext.getCmp("sh_combo").getValue();
	ds.load();
};






// 彻底删除
function del_complete() {
	var ids = [];
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	for(var i = 0; i < sels.length; i++){
		ids.push(sels[i].get('id'));
	}
	Ext.MessageBox.confirm("确认操作", "您确认要删除所选中的信息吗？", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/QuestionServlet?method=delete", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + ids.toString());
				}
			})
};
// 还原
function revertOp() {
	var ids = [];
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	for(var i = 0; i < sels.length; i++){
		ids.push(sels[i].get('id'));
	}
	Ext.lib.Ajax.request("post", "/QuestionServlet?method=unlock", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("设置成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "id=" + ids.toString());
};

// 详细页面
function openInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("question_list_detail", '在线答疑详细',
			'/module/question/question_list_detail.jsp?id=' + row.get("id"),
			true);
};

