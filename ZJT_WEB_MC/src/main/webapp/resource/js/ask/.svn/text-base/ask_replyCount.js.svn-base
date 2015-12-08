var ds, grid, ck, pagetool, askds;
var ids = [];// 选择项
var selectinfo, window_note;

var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ask/AskServlet'
				}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						},
						["id","pid", "name", "spec", "supplier", "AskName", "IssueDate","CreateOn"]
				),
				baseParams : {
					type : 25,
					replyor : "",
					begin   : "",
					end     : "",
					pageSize : 20,
				},
				countUrl : '/ask/AskServlet',
				countParams : {
					type : 26
				},
				remoteSort : true
			});
			var sm = new Ext.grid.CheckboxSelectionModel({
						dataIndex : 'pid'
					});
		
			pagetool = new Ext.ux.PagingToolbar({
						store : ds,
						displayInfo : true		
					});

	grid = new xg.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '询价ID',
							sortable : false,
							width : 30,
							dataIndex : 'pid'
						},  {
							header : '名称',
							sortable : false,
							width : 100,
							dataIndex : 'name'
						}, {
							header : '型号规格',
							sortable : false,
							width : 200,
							dataIndex : 'spec'
						}, {
							header : '公司名称',
							sortable : true,
							width : 100,
							dataIndex : 'supplier'
						}, {
							header : '回复人',
							sortable : true,
							width : 80,
							dataIndex : 'AskName'
						}, {
							header : '发布日期',
							sortable : true,
							width : 100,
							dataIndex : 'IssueDate'
						}, {
							header : '回复日期',
							sortable : false,
							width : 100,
							dataIndex : 'CreateOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				bbar : pagetool,
				renderTo : 'ask_grid'
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();
				selectinfo = row.get("id");
				showaskinfo(selectinfo);

			});
	var bar3 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [
				{
					xtype : "label",
					text : "回复者："
				}, {
					xtype : "textfield",
					textLabel : "回复者",
					id : "replyor"
				}, "-", {
					xtype : "label",
					text : "开始日期："
				}, {
					id : 'begin',
					xtype : 'datefield',
					format : 'Y-m-d',
					emptyText : '请选择'
				}, {
					xtype : 'label',
					text : '结束日期：'
				}, {
					id : 'end',
					xtype : 'datefield',
					format : 'Y-m-d',
					emptyText : '请选择'
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
};

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

Ext.onReady(function() {
			init();
});

// 查询信息
function searchlist() {
	var replyor = Ext.getCmp("replyor").getValue();
	var begin   = Ext.fly('begin').getValue();
	var end     = Ext.fly('end').getValue();
	
	if(replyor=="" || begin=="" || end==""){
		Ext.MessageBox.alert("提示", "请输入查询的开始日期，结束日期和回复者三个必填项！");
		return ;
	}
	ds.baseParams["replyor"] = replyor;
	ds.baseParams["begin"]   = begin;
	ds.baseParams["end"]     = end;
	
	ds.load();
};

// 查看详细信息
function showaskinfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("ask_info", '普通询价信息','/module/ask/ask_info.jsp?id=' + row.get("pid"));
};

//得到日期
function getDate(v){
	if(v)
		return v.substring(0, 10);
	return "";
};