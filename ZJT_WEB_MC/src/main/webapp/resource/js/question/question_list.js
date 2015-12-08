Ext.onReady(init);
var ds, grid;
function init() {
	buildGrid();
};
// 邮件菜单选项
var menuItem = new Ext.menu.Item({
			text : '审核',
			handler : function() {
				isAudit();
			},
			hidden : compareAuth("QA_AUDIT")
		});
var item1 = [{
			text : '查看详细',
			handler : function() {
				openInfo();
			},
			hidden : compareAuth("QA_VIEW")
		}, {
			id : 'rMenu1',
			text : '锁定',
			handler : function() {
				delInfo();
			},
			hidden : compareAuth("QA_LOCK")
		}, {
			id : 'rMenu2',
			text : '置顶/取消置顶',
			handler : function() {
				isTop();
			},
			hidden : compareAuth("QA_MOD")
		}];

// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
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
								"hits", "revNum", "isTop", "isAddr"]),
				baseParams : {
					pageNo : 1,
					method : 'getPage',
					pageSize : 20,
					isDel : "0"
				},
				countUrl : '/QuestionServlet',
				countParams : {
					method : "getCount",
					isDel : "0"
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
						}, {
							header : 'IP地址',
							sortable : false,
							width : 50,
							dataIndex : 'isAddr'
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : []
			});
	var bar = new Ext.Toolbar({
				id : 'bar',
				renderTo : grid.tbar,
				items : [{
							text : "查看详细",
							handler : openInfo,
							icon : "/resource/images/book_open.png",
							hidden : compareAuth("QA_VIEW")
						}, {
							text : '锁定',
							icon : "/resource/images/lock.png",
							handler : delInfo,
							hidden : compareAuth("QA_LOCK")
						}, {
							text : '置顶/取消置顶',
							icon : "/resource/images/flag_green.png",
							handler : isTop,
							hidden : compareAuth("QA_MOD")
						}, {
							id : 'sh_menuItem',
							text : '审核',
							icon : '/resource/images/add.gif',
							handler : isAudit,
							style : 'display : none;',
							hidden : compareAuth("QA_AUDIT")
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
										data : [['1', '已审核'], ['0', '未审核']]
									}),
							displayField : "text",
							valueField : "value",
							value : '1',
							listeners : {
								"select" : function(combo, record, index) {
									if (combo.getValue() == "0") {
										showEl("sh_menuItem");
										rightClick.add(menuItem);
									} else {
										hideEl("sh_menuItem");
										rightClick.remove(menuItem);
									}
									searchlist();
								}
							}
						}, "-", {
							text : "标题：",
							xtype : "label"
						}, {
							xtype : 'textfield',
							id : 'input_title',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
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

function delInfo() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "您确认要锁定所选中的信息吗？", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/QuestionServlet?method=lock", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("锁定成功。");
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

function isTop() {
	var sels = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var temp = "";
	if (sels.get("isTop") == "1")
		temp = "0";
	else
		temp = "1";
	Ext.lib.Ajax.request("post", "/QuestionServlet?method=setTop", {
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
			}, "id=" + sels.get("id") + "&isTop=" + temp);
};

// 已删除列表与正常列表切换
function changeList(v) {
	window.parent.createNewWidget("0902", '已锁定答疑',
			'/module/question/question_list_lock.jsp', false);
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

// 审核
function isAudit() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "id=" + ids.toString();
	Ext.Msg.confirm("提示", "您确定选中的信息通过审核?", function(op) {
				Ext.lib.Ajax.request("post", "/QuestionServlet?method=audit", {
							success : function(response) {
								var json = eval("(" + response.responseText
										+ ")");
								if (json.state == "success") {
									Info_Tip("审核成功!");
									ds.reload();
								}
							},
							failure : function() {
								Warn_Tip();
							}
						}, data);
			});
}