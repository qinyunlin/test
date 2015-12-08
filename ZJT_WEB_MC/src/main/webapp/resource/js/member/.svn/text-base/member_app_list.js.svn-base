var url = "/mc/appMember.do", grid_info, ds_info,TB_win;

var province_db = ["北京","天津","河北","黑龙江","江西","山东","湖北","湖南","广东","广西","重庆","四川","贵州","云南"];
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = ["全部城市"];

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();

};

// 右键菜单
var tbar = [{
			text : '打开',
			icon : "/resource/images/book_open.png",
//			hidden : compareAuth("MEM_VIEW"),
			handler : openAppMember
		}, {
			text : '锁定',
			icon : "/resource/images/lock.png", 
//			hidden : compareAuth("MEM_LOCK"),
			handler : lockAppMember
		}, {
			text : 'T币明细',
			icon : "/resource/images/edit.gif",
//			hidden : compareAuth("MEM_RENEW"),
			handler : showTBDetail
		}, {
			text : "冻结T币",
			icon : '/resource/images/edit.gif',
//			hidden : compareAuth("MEM_GOVAREA"),
			handler : frozenTB
		}, {
			text : "解冻T币",
			icon : '/resource/images/edit.gif',
//			hidden : compareAuth("MEM_GOVAREA"),
			handler : releaseTB
		}, {
			text : "导出",
			icon : '/resource/images/page_excel.png',
//			hidden : compareAuth("MEM_EXPORT"),
			handler : exportAppMember
		}, {
			text : "提现管理",
			icon : '/resource/images/edit.gif',
//			hidden : compareAuth("MEM_GOVAREA"),
			handler : showWithdrawalManage
		},{
			text : "数据统计",
			icon : '/resource/images/edit.gif',
//			hidden : compareAuth("MEM_GOVAREA"),
			handler : showDataStatistics
		}, {
			text : "已锁定APP会员",
			icon : '/resource/images/edit.gif',
//			hidden : compareAuth("MEM_GOVAREA"),
			handler : showLockedAppMember
		}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : url
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"memberId"},{name:"mobile"},{name:"nickName"},{name:"exp"},{name:"goodAt"},{name:"corpName"},{name:"province"},{name:"city"},{name:"phoneVerification",type:"int"},{name:"loginNum",type:'int'},{name:"withdrawal",type:'int'},{name:"askReplyNum",type:'int'},{name:"bestReplyNum",type:'int'},{name:"currScore",type:'int'},{name:"usefulNum",type:'int'},{name:"notAllowNum",type:'int'},{name:"createOn"},{name:"frozenScore"}]	
						}),
				baseParams : {
					type : 1,
					pageNo : 1,
					pageSize : 20
				},
				countUrl : '/mc/appMember.do',
				countParams : {
					type : 2
				},
				remoteSort : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "memberId"
			});
	var sel_type = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [["mobile", "手机号"],["nickname", "会员昵称"],["corpName", "公司名称"]]
			});

	grid_info = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '手机号',
							sortable : false,
							dataIndex : 'mobile'
						}, {
							header : '会员昵称',
							sortable : false,
							dataIndex : 'nickName'
						}, {
							header : '等级头衔',
							sortable : false,
							dataIndex : 'exp'
						}, {
							header : '擅长材料',
							sortable : true,
							dataIndex : 'goodAt'
						}, {
							header : '公司名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '所属城市',
							sortable : true,
							renderer:function(value,meta,record){
								var province = record.get("province");
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + " " + city;
							}
						},{
							header : "实名认证",
							sortable : true,
							dataIndex:"status",
							renderer:function(v,meta,record){
								var status=record.get("phoneVerification");
								if(status){
									if(status=="1"){
										return "已验证";
									}else{
										return "未验证";
									}
								}else{
									return "未验证";
								}
							}
							
						},{
							header : "登录次数",
							sortable : true,
							width : 70,
							dataIndex : "loginNum"
						}, {
							header : "当前T币",
							sortable : true,
							width : 70,
							dataIndex : "currScore"
						},{
							header : "提现",
							sortable : true,
							width : 70,
							dataIndex : "withdrawal"
						},{
							header : "回复询价",
							sortable : true,
							width : 70,
							dataIndex : "askReplyNum"
						},{
							header : "最佳回复",
							sortable : true,
							dataIndex : "bestReplyNum"
						},{
							header : "有用",
							sortable : true,
							dataIndex:"usefulNum"
						},{
							header : "不准",
							sortable : true,
							dataIndex:"notAllowNum"
						},{
							header : "注册日期",
							sortable : true,
							dataIndex : "createOn"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
			
	
			
			
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
							xtype : 'combo',
							id : 'province',
							store : pro,
							value:'全部省份',
							triggerAction : 'all',
							readOnly : true,
							width:90,
							listeners : {
								select : function(combo, record, index) {
									var province = combo.getValue();
									if(province == "全部省份") {
										city = ["全部城市"];
									}else{
										city = zhcn.getCity(province).concat();;
										city.unshift("全部城市");
									}
									Ext.getCmp('city').store.loadData(city);
									Ext.getCmp('city').setValue("全部城市");
									Ext.getCmp('city').enable();
								}
							}
						}, 
							{
							xtype : 'combo',
							id : 'city',
							store : city,
							triggerAction : 'all',
							value : '全部城市',
							width:120,
							readOnly : true
						}, "-", sel_combo = new Ext.form.ComboBox({
							store : sel_type,
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							displayField : "text",
							value : "mobile",
							width : 80

						}), "-", {
					xtype : "textfield",
					id : "search_input",
					width : 130,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-",{
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});

	ds_info.load();
};

// 查询
function searchlist() {
	var temp_query = "";
	var last_mem_type="";
	var mem_type = Ext.fly("info_type_input").getValue();
	var mainDate=Ext.fly("mainDate").getValue();
	var maxDate=Ext.fly("maxDate").getValue();

	
	if(mem_type != "10" && mem_type.length==2){
		last_mem_type=mem_type.substring(1,2);
		mem_type = mem_type.substring(0,1);
		ds_info.baseParams["lastDegree"] = last_mem_type;
	}else{
		ds_info.baseParams["lastDegree"] = "";
	}
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		temp_query += "province~" + Ext.getCmp("province").getValue() + ";";
		if(city != "全部城市"){
			temp_query += ";city~" + Ext.getCmp("city").getValue()+";";
		}
	}
	if(mainDate!=null && maxDate !=null && maxDate!="" && mainDate!="" && maxDate!="请选择日期" && mainDate!="请选择日期"){
		if (compareDate(mainDate, maxDate)){
			Info_Tip("起始日期不能大于截止日期！");
			return false;
		}
		ds_info.baseParams["mainDate"] = mainDate;
		ds_info.baseParams["maxDate"] = maxDate;
	}else{
		ds_info.baseParams["mainDate"] = "";
		ds_info.baseParams["maxDate"] = "";
	}
	
	temp_query += "query_type~" + sel_combo.getValue() + ";";
	temp_query += "query_input~" + Ext.fly("search_input").getValue() + ";";
	ds_info.baseParams["degree"] = mem_type;

	ds_info.baseParams["content"] = temp_query;
	ds_info.load();
};
//打开
function openAppMember(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	window.parent.createNewWidget("member_app_info", "APP会员信息","/module/member/member_app_info.jsp?memberId=" + row.get("memberId"));
}
//锁定
function lockAppMember(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	Ext.Msg.confirm("提示", "确定锁定该用户吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 3,
					content : "isLock~1;memberId~"+row.get("memberId")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)){
						Info_Tip("操作成功!");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}
//T币明细
function showTBDetail(){
	window.parent.createNewWidget("tbDeatil_list", "总T币明细","/module/member/tbDetail_list.jsp");
}
//冻结T币
function frozenTB(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	var memberId = row.get("memberId");
	Ext.MessageBox.show({
		title : '冻结T币',
		msg : "</br>"
			+ "请输入冻结数额：<input type='text' id='frozenScore' name='frozenScore' value='' style='height:20px;' /></br></br>"
			+ "<input type='text' id='frozenReason' name='frozenReason' value='' style='width:245px;height:20px;' placeholder='简要输入冻结原因' />",
		prompt : false,
		width : 300,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text) {
			if ("ok" == btn) {
				var frozenScore = $("#frozenScore").val();
				var frozenReason = $("#frozenReason").val();
				Ext.Ajax.request({
					url : url,
					params : {
						type : 7,
						content : "frozenScore~"+frozenScore+";frozenReason~"+frozenReason+";memberId~"+memberId
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)){
							if(jsondata.result == "success")
								Info_Tip("冻结成功!");
							else
								Info_Tip(jsondata.result);
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		}
	});
}
//解冻T币
function releaseTB(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	var memberId = row.get("memberId");
	Ext.MessageBox.show({
		title : '解冻T币',
		msg : "</br>"
			+ "当前冻结数额："+row.get("frozenScore")+"</br></br>"
			+ "请输入解冻数额：<input type='text' id='frozenScore' name='frozenScore' value='' style='height:20px;' />",
		prompt : false,
		width : 300,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text) {
			if ("ok" == btn) {
				var frozenScore = $("#frozenScore").val();
				Ext.Ajax.request({
					url : url,
					params : {
						type : 8,
						content : "frozenScore~"+frozenScore+";memberId~"+memberId
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)){
							if(jsondata.result == "success")
								Info_Tip("解冻成功!");
							else
								Info_Tip(jsondata.result);
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		}
	});
}
//导出
function exportAppMember(){
	var sels = grid_info.getSelectionModel().getSelections();
	if(sels.length == 0){
		Warn_Tip("请勾选至少一条！");
		return;
	}
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("memberId"));
	}
	window.document.exportform.action = "/mc/appMember.do?type=9&memberIds=" + mids.toString();
	window.document.exportform.submit();
}
//提现管理
function showWithdrawalManage(){
	window.parent.createNewWidget("member_app_withdrawal_list", "提现管理","/module/member/member_app_withdrawal_list.jsp");
}
//数据统计
function showDataStatistics(){
	window.parent.createNewWidget("member_app_statistics_list", "数据统计","/module/member/member_app_statistics_list.jsp");
}
//已锁定APP会员
function showLockedAppMember(){
	window.parent.createNewWidget("member_app_lock_list", "已锁定APP会员","/module/member/member_app_lock_list.jsp");
}