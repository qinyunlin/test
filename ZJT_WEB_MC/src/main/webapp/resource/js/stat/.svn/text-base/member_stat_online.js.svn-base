Ext.onReady(init);
var win, ds, grid;
function init() {
	buildGrid();
};

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/MemberStatServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["ipAddr", "signOn", "memberID", "isVoid", "degree",
								"corpName"]),
				baseParams : {
					type : 12,
					loginArea : webSite[0][1],
					page : 1,
					pageSize : 20
				},
				countUrl : '/mc/MemberStatServlet',
				countParams : {
					type : 11
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'memberID'
			});
	grid = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : true,
							dataIndex : 'memberID'
						}, {
							header : '会员等级',
							sortable : true,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '单位名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '最近登录时间',
							sortable : true,
							dataIndex : 'signOn'
						}, {
							header : '登录IP',
							sortable : true,
							dataIndex : 'ipAddr'
						}, {
							// header : '查看',
							width : 20,
							sortable : true,
							dataIndex : 'memberID',
							css : 'text-align:center;cursor:pointer;',
							renderer : function() {
								return "<font style='color:red'>查看</font>";
							}
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [
// {
//							text : '会员类型：',
//							xtype : 'label'
//						}, {
//							fieldLabel : '会员类型',
//							xtype : 'combo',
//							store : [["", "全部"], ["0", "信息会员"], ["1", "厂商会员"]],
//							triggerAction : "all",
//							value : '',
//							id : 'member_type',
//							width : 80
//						},"-",
						{
							text : '会员等级：',
							xtype : 'label'
						}, {
							fieldLabel : '会员等级',
							xtype : 'combo',
							store : memberDegree_combo,
							triggerAction : "all",
							value : '',
							id : 'member_degree',
							width : 80
						}, "-", {
							text : '登录地区：',
							xtype : "label"
						}, {
							xtype : 'combo',
							store : webSite,
							id : 'area_sel',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							width : 80,
							value : 'gd'
						}, {
							xtype : "label",
							text : '会员ID：'
						},"-", {
							xtype : "textfield",
							id : 'search_name'
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}],
				listeners : {
					"cellclick" : function(thisgrid, row, column, e) {
						if (column > 6)
							getLoginStat();
					}
				}
			});
	ds.load();
};

function searchlist() {
//	ds.baseParams["memberType"] = Ext.getCmp("member_type").getValue();
	ds.baseParams["degree"] = Ext.getCmp("member_degree").getValue();
	ds.baseParams["loginArea"] = Ext.fly('area_sel').getValue();
	ds.baseParams["content"] = "memberID~" + Ext.fly('search_name').getValue();
	ds.load();
};

function openInfo() {

};

// 查看该会员登录数
function getLoginStat() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一个会员。");
		return;
	}
	var mid = row.get("memberID");
	var site = encodeURI(Ext.fly("area_sel").getValue());
	window.parent.createNewWidget("member_stat_online_detail", '会员登录统计',
			'/module/stat/member_stat_online_detail.jsp?mid=' + mid + "&site="
					+ site);
};