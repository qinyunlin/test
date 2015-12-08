var ds, grid, pagetool;
Ext.onReady(init);
function init(){
	buildGrid();
};
var buildGrid = function(){
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/MemberStatServlet'
		}),
		reader : new Ext.data.JsonReader({
					root : 'result'
				}, ["ipAddr", "signOn", "memberID", "trueName", "isVoid", "degree", "lastTime",
		"corpName"]),
		baseParams : {
			type : 2,
			page : 1,
			pageSize : 20
		},
		countUrl : '/mc/MemberStatServlet',
		countParams : {
			type : 3
		},
		remoteSort : true
	});
	pagetool = new Ext.ux.PagingToolbar({
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
				renderTo : 'grid',
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
							header : '姓名',
							sortable : true,
							dataIndex : 'trueName'
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
				tbar : [ {
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
							value : 'gd',
							listeners : {
								"select" : function(){
									Ext.getCmp('curr_tot').setText('在线会员(统计中...)');
									Ext.getCmp('today_tot').setText('今天访问会员(统计中...)');
									Ext.getCmp('week_tot').setText('本周访问会员(统计中...)');
									Ext.getCmp('month_tot').setText('本月访问会员(统计中...)');
									Ext.getCmp('today_info_tot').setText('今天访问信息会员(统计中...)');
									Ext.getCmp('today_fact_tot').setText('今天访问厂商会员(统计中...)');
									Ext.getCmp('has_sign_tot').setText('已登录过会员(统计中...)');
									Ext.getCmp('no_sign_tot').setText('未登录过会员(统计中...)');
									getStatInfo();
								}
							}
						},	{
							text : '登录日志中的会员等级：',
							xtype : 'label'
						}, {
							fieldLabel : '登录日志中的会员等级',
							xtype : 'combo',
							store : memberDegree_combo,
							triggerAction : "all",
							value : '',
							id : 'degree',
							width : 80
						}, "登陆时间：", {
							id : 'begin',
							xtype : 'datefield',
							format : 'Y-m-d',
							emptyText : '请选择'
						}, "至",{
							id : 'end',
							xtype : 'datefield',
							format : 'Y-m-d',
							emptyText : '请选择'
						},{
							
						},"登陆次数：", {
							id : 'beginLogNum',
							width: 50,
							xtype : 'numberfield',
							allowDecimals: false,
							allowNegative: false
						}, "至", {
							id : 'endLogNum',
							width: 50,
							xtype : 'numberfield',
							allowDecimals: false,
							allowNegative: false
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}],
				bbar : pagetool,
				listeners : {
					"cellclick" : function(thisgrid, row, column, e) {
						if (column == 7)
							getLoginStat();
					}
				}
			});
	new Ext.Toolbar({
		renderTo: grid.tbar,
		items :[{
			id : 'curr_tot',
			text : '在线会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("curr_tot");
			}
		},{
			id : 'today_tot',
			text : '今天访问会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("today_tot");
			}
		},{
			id : 'week_tot',
			text : '本周访问会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("week_tot");
			}
		},{
			id : 'month_tot',
			text : '本月访问会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("month_tot");
			}
		},{
			id : 'today_info_tot',
			text : '今天访问信息会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("today_info_tot");
			}
		},{
			id : 'today_fact_tot',
			text : '今天访问厂商会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("today_fact_tot");
			}
		},{
			id : 'has_sign_tot',
			text : '已登录过会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("has_sign_tot");
			}
		},{
			id : 'no_sign_tot',
			text : '未登录过会员(统计中...)',
			icon : '/resource/images/map.png',
			handler : function() {
				changeList("no_sign_tot");
			}
		}]
	});
	getStatInfo();
};

// 获取统计信息
function getStatInfo() {
	Ext.Ajax.request({
		url : "/mc/MemberStatServlet",
		params : {
			type : 1,
			loginArea : Ext.fly("area_sel").getValue()
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.getCmp('curr_tot').setText('在线会员(' + json.result["curr_tot"] + ')');
				Ext.getCmp('today_tot').setText('今天访问会员('+ json.result["today_tot"]+ ')');
				Ext.getCmp('week_tot').setText('本周访问会员(' + json.result["week_tot"] + ')');
				Ext.getCmp('month_tot').setText('本月访问会员(' + json.result["month_tot"] + ')');
				Ext.getCmp('today_info_tot').setText('今天访问信息会员(' + json.result["today_info_tot"] + ')');
				Ext.getCmp('today_fact_tot').setText('今天访问厂商会员(' + json.result["today_fact_tot"] + ')');
				Ext.getCmp('has_sign_tot').setText('已登录过会员(' + json.result["has_sign_tot"] + ')');
				Ext.getCmp('no_sign_tot').setText('未登录过会员(' + json.result["no_sign_tot"] + ')');
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
	ds.baseParams["loginArea"] = Ext.fly("area_sel").getValue();
	ds.baseParams["type"] = 2;
	ds.baseParams["stype"] = v;
	ds.countParams["type"] = 3;
	ds.load();
};
//搜索会员访问统计列表
function searchlist(){
	var begin = changeDate(Ext.fly("begin").getValue());
	var end = changeDate(Ext.fly("end").getValue());
	var beginLogNum = Ext.fly("beginLogNum").getValue();
	var endLogNum = Ext.fly("endLogNum").getValue();
	var degree = Ext.getCmp("degree").getValue();
	
	ds.baseParams = {
		page : 1,
		pageSize : 20
	};
	
	ds.countParams = {};
	ds.baseParams["degree"] = degree;
	
	if(begin != "" ||  end != "")
		ds.baseParams["signOn"] = begin + "~" + end;
	if(begin != "" && end != "")
		ds.baseParams["signOn"] += "~DIFF_BETWEEN";
	else if(begin != "")
		ds.baseParams["signOn"] += "~DIFF_EQUAL_GREATER";
	else if(end != "")
		ds.baseParams["signOn"] += "~DIFF_EQUAL_LESS";
	if(beginLogNum != "" || endLogNum != "")
		ds.baseParams["loginNum"] = beginLogNum + "~" + endLogNum;
	if(beginLogNum != "" && endLogNum != "")
		ds.baseParams["loginNum"] += "~DIFF_BETWEEN";
	else if(beginLogNum != "")
		ds.baseParams["loginNum"] += "~DIFF_EQUAL_GREATER";
	else if(endLogNum != "")
		ds.baseParams["loginNum"] += "~DIFF_EQUAL_LESS";
	ds.baseParams["loginArea"] = Ext.fly("area_sel").getValue();
	ds.baseParams["type"] = 4;
	ds.countParams["type"] = 5;
	ds.load();
}
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

function getDate(date){
	if(date == "" || date == "请选择"){
		return "";
	}
	return date;
};

//将日期Y-m-d转为Ymd格式
var changeDate = function(date){

	if(date == "" || date == "请选择"){
		return "";
	}
	var str = "";
	var start = 0;
	var end = date.indexOf("-", start);
	for( start = 0; end != -1; start = end + 1, end = date.indexOf("-", start)){
		str = str + date.substring(start, end);
	}
	str = str + date.substring(start, date.length);
	return str;
}