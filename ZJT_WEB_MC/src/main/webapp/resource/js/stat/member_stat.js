Ext.onReady(init);
var ds, grid, win;
function init() {
	// getStatInfo();
	buildGrid();
	// getProportion();
};

function buildGrid() {
	var pro = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : cur_website
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/MemberStatServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["ipAddr", "lastTime", "memberID", "isVoid", "degree",
								"trueName", "loginNum", "corpName"]),
				baseParams : {
					type : 4,
					loginArea : webSite[0][1],
					page : 1,
					pageSize : 20
				},
				countUrl : '/mc/MemberStatServlet',
				countParams : {
					type : 5
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
							header : '会员姓名',
							sortable : false,
							dataIndex : 'trueName'
						}, {
							header : '单位名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '最近登录时间',
							sortable : true,
							dataIndex : 'lastTime'
						}, {
							header : '登录IP',
							sortable : true,
							dataIndex : 'ipAddr'
						}, {
							header : '',
							width : 20,
							dataIndex : 'memberID',
							css : 'text-align:center;cursor:pointer;',
							renderer : function() {
								return "<font style='color:red'>查看</font>";
							}
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [
//						{
//							text : '会员类型：',
//							xtype : 'label'
//						}, {
//							fieldLabel : '会员类型',
//							xtype : 'combo',
//							store : [["", "全部"], ["0", "信息会员"], ["1", "厂商会员"]],
//							triggerAction : "all",
//							value : '',
//							id : 'member_degree',
//							readOnly : true,
//							width : 80
//						}, 
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
						},"-", {
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
						}, "-", {
							text : '登录时间：',
							xtype : 'label'
						}, "从", {
							xtype : 'datefield',
							id : 'startDate',
							format : 'Y-m-d',
							vtype : 'daterange',
							endDateField : "endDate"
						}, "到", {
							xtype : 'datefield',
							id : 'endDate',
							format : 'Y-m-d',
							vtype : 'daterange',
							startDateField : 'startDate'
						}, {
							xtype : 'combo',
							id : 'query_type',
							store : [["memberID", "会员ID"], ["trueName", "会员名称"]],
							triggerAction : 'all',
							value : 'memberID',
							width : 80
						}, {
							xtype : "textfield",
							id : 'search_name'
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}],
				listeners : {
					"cellclick" : function(thisgrid, row, column, e) {
						if (column > 7)
							getLoginStat();
					}
				}
			});
	var toolbar = new Ext.Toolbar({
				renderTo : 'stat_toolbar',
				items : [{
					text : '会员访问统计',
					icon : '/resource/images/chart_pie.png',
					handler : function() {
						window.parent.createNewWidget("stat_pie", '会员访问统计',
								'/module/stat/member_prop_stat.jsp');
					}
				}, {
					text : '会员比例统计',
					icon : '/resource/images/shape_align_bottom.png',
					handler : function() {
						window.parent.createNewWidget("stat_char", '会员比例统计',
								'/module/stat/member_stat_scale.jsp');
					}
				}]
			});
	ds.load();
};

function searchlist() {

	ds.baseParams = {
		type : 7,
		page : 1,
		pageSize : 20
	};
	ds.countParams = {
		type : 8
	};
	//ds.baseParams["memberType"] = Ext.getCmp("member_degree").getValue();
	ds.baseParams["degree"] = Ext.getCmp("member_degree").getValue();
	ds.baseParams["loginArea"] = Ext.fly('area_sel').getValue();
	// ds.baseParams["startDate"] = Ext.fly('startDate').getValue();
	// ds.baseParams["endDate"] = Ext.fly('endDate').getValue();

	var begin = Ext.fly('startDate').getValue();
	var end = Ext.fly('endDate').getValue();
	if (begin != "" && end != "") {
		ds.baseParams["diff"] = "signOn~" + begin + "~" + end + "~DIFF_BETWEEN";
	} else if (begin != "") {
		ds.baseParams["diff"] = "signOn~" + begin + "~~DIFF_EQUAL_GREATER";
	} else if (end != "") {
		ds.baseParams["diff"] = "signOn~" + end + "~~DIFF_EQUAL_LESS";
	}
	var type = Ext.getCmp("query_type").getValue() + "~"
			+ Ext.fly('search_name').getValue();;
	ds.baseParams["content"] = type;
	ds.load();
};

// 获取统计信息
function getStatInfo() {
	Ext.Ajax.request({
		url : "/mc/MemberStatServlet",
		params : {
			type : 1
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				new Ext.Toolbar({
							renderTo : 'stat_panel',
							items : [{
										text : '在线会员（'
												+ json.result["curr_tot"] + "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("curr_tot");
										}
									}, {
										text : '今天访问会员（'
												+ json.result["today_tot"]
												+ "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("today_tot");
										}
									}, {
										text : '本周访问会员（'
												+ json.result["week_tot"] + "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("week_tot");
										}
									}, {
										text : '本月访问会员（'
												+ json.result["month_tot"]
												+ "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("month_tot");
										}
									}, {
										text : '今天访问信息会员（'
												+ json.result["today_info_tot"]
												+ "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("today_info_tot");
										}
									}, {
										text : '今天访问厂商会员（'
												+ json.result["today_fact_tot"]
												+ "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("today_fact_tot");
										}
									}, {
										text : '已登录过会员（'
												+ json.result["has_sign_tot"]
												+ "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("has_sign_tot");
										}
									}, {
										text : '未登录过会员（'
												+ json.result["no_sign_tot"]
												+ "）",
										icon : '/resource/images/map.png',
										handler : function() {
											changeList("no_sign_tot");
										}
									}]
						});
			}
		},
		faliure : function() {
			Warn_Tip();
		}
	});
};

// 切换列表
function changeList(v) {
	ds.baseParams = {
		page : 1,
		pageSize : 20
	};
	ds.countParams = {};
	ds.baseParams["type"] = 2;
	ds.baseParams["stype"] = v;
	ds.countParams["type"] = 3;
	ds.countParams["stype"] = v;
	ds.load();
};

// 获得比例
function getProportion() {
	Ext.Ajax.request({
				url : '/mc/MemberStatServlet',
				params : {
					type : 6,
					stype : 'has_sign_tot'
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {

					}
				},
				faliure : function() {
				}
			})
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