Ext.onReady(init);
var mid="";
function init() {
	mid=
	buildGrid();
};

var tbar = [{
			xtype : 'label',
			text : '会员ID:'
		}, {
			xtype : 'textfield',
			id : 'memberId'
		}, {
			text : "查询",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		}];

// 显示列表
function buildGrid() {
	var ds = new Ext.data.SelfStore({
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
					pageSize : 20,
					pageNo : 1
				},
				countUrl : '/AskCountExServlet',
				countParams : {
					type : 7
				},
				remoteSort : false
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	var grid = new Ext.grid.GridPanel({
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
							renderer:typeSel
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
				bbar : pagetool,
				renderTo : "grid"
			});

	ds.load();
};

// 搜索
function searchlist() {
	var mid = Ext.fly("memberId").getValue().trim();
	var store = Ext.getCmp("vas_grid").store;
	store.baseParams["content"] = "memberID~" + mid;
	store.load();
};
