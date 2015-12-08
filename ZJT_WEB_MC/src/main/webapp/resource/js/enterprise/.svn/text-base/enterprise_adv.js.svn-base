Ext.onReady(init);
var grid, ds, pageSize = 20;
function init() {
	buildGrid();
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu1',
						text : '解锁',
						hidden : compareAuth('CORP_UNLOCK'),
						handler : unLock
					}, {
						id : 'rMenu2',
						text : '删除',
						hidden : compareAuth('CORP_DEL'),
						handler : delEmp
					}]
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"phone", "createOn"]),
				baseParams : {
					page : 1,
					type : 3,
					pageSize : pageSize
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					content : "islock~1",
					type : 9
				},
				remoteSort : true
			});
	ds.load();
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
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
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : false,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : false,
							width : 240,
							dataIndex : 'name'
						}, {
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : false,
							dataIndex : 'area'
						}, {
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '创建时间',
							sortable : false,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : "解锁",
							hidden : compareAuth('CORP_UNLOCK'),
							icon : "/resource/images/lock_open.png",
							handler : unLock
						}, "-", {
							text : "删除",
							hidden : compareAuth('CORP_DEL'),
							icon : "/resource/images/delete.gif",
							handler : delEmp
						}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	var toolbar2 = new Ext.Toolbar({
		renderTo: grid.tbar,
		items : [new Ext.form.ComboBox({
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
							textLabel : "关键字",
							id : "searchtitle",
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e){
									if(e.getKey() == e.ENTER){
										searchlist();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
	});
};

function searchlist() {
	var query = Ext.fly("query_con_val").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~1";
	ds.baseParams["content"] = query;
	ds.load();
};

function unLock() {
	var sels = grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("eid"));
	}
	if (mids.length < 1) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "您确定要解锁您选中的企业吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/ep/EnterpriseServlet?type=5", {
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
							}, "ids=" + mids)
				}
			})
};

// 删除企业
function delEmp() {
	var sels = grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("id"));
	}
	if (mids.length < 1) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "您确定要删除您选中的企业吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/ep/EnterpriseServlet?type=8", {
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
							}, "ids=" + mids)
				}
			})
};