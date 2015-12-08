var url = "/mc/appMember.do", grid_info, sel_combo;
var sel_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["mobile", "手机号"],["nickName", "会员昵称"],["account", "支付宝账号"],["transactionNum", "交易号"]]
});
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};
var tbar = [{
			text : '发放',
			icon : "/resource/images/edit.gif", 
//			hidden : compareAuth("ACTIVITY_MANAGE_EXCHANGE_VIEW"),
			handler : giveOutWithdrawal
		},{
			text : "退回申请",
			icon : '/resource/images/edit.gif',
//			hidden : compareAuth("ACTIVITY_MANAGE_GIFT_SEND"),
			handler : gobackApply
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id",type:"int"},{name:"code"},{name:"mobile"},{name:"nickName"},{name:"money"},{name:"account"},{name:"transactionNum"},{name:"createOn"},{name:"updateOn"},{name:"state", type:"int"}]	
			}),
			
	baseParams : {
		type : 19,
		content : "",
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 20
	},
	remoteSort : true
});
pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "id",
	singleSelect : true
});
//获取活动列表
function buildGrid(){
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
					header : '流水号',
					sortable : false,
					dataIndex : 'code'
				}, {
					header : '手机号',
					sortable : false,
					dataIndex : 'mobile',
				}, {
					header : '会员昵称',
					sortable : false,
					dataIndex : 'nickName',
				}, {
					header : '提现金额',
					sortable : false,
					dataIndex : 'money',
				}, {
					header : '支付宝账号',
					sortable : false,
					dataIndex : 'account',
				}, {
					header : '支付宝交易号',
					sortable : false,
					dataIndex : 'transactionNum',
				}, {
					header : '申请时间',
					sortable : false,
					dataIndex : 'createOn'
				}, {
					header : '处理时间',
					sortable : false,
					dataIndex : 'updateOn'
				}, {
					header : '发放状态',
					sortable : false,
					dataIndex : 'state',
					renderer:function(v,meta,record){
						var state = record.get("state");
						if(state == 0)
							return "未发放";
						else if(state == 1)
							return "已发放";
						return "<span style='color:red;'>已退回</span>";
					}
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [sel_combo = new Ext.form.ComboBox({
					store : sel_type,
					mode : "local",
					triggerAction : "all",
					valueField : "value",
					displayField : "text",
					value : "mobile",
					width : 80
				}),{
					xtype : "textfield",
					id : "search_input",
					width : 150,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},{
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	ds_info.load();
}
//筛选查询
function searchlist(){
	var temp_query = "query_type~" + sel_combo.getValue() + ";";
	temp_query += "query_input~" + Ext.fly("search_input").getValue() + ";";
	ds_info.baseParams["content"] = temp_query;
	ds_info.load();
}

//发放
function giveOutWithdrawal(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	if(row.get("state") != "0"){
		Warn_Tip("已发放或已退回申请！");
		return;
	}
	
	Ext.MessageBox.show({
		title : "",
		msg : "<br />"
			+ "支付宝交易号：<input type='text' id='transactionNum' name='transactionNum' value='' style='height:20px;' /><br /><br /><br />",
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
				var transactionNum = $("#transactionNum").val();
				if(transactionNum.length == 0){
					Ext.Msg.alert("提示", "支付宝交易号不能为空！");
					return;
				}
				Ext.Ajax.request({
					url : url,
					params : {
						type : 21,
						content : "id~"+row.get("id")+";state~1;transactionNum~"+transactionNum
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)){
							Info_Tip("发放成功!");
							ds_info.reload();
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
//退回申请
function gobackApply(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	if(row.get("state") != "0"){
		Warn_Tip("该条申请已处理过了！");
		return;
	}
	
	Ext.MessageBox.show({
		title : "",
		msg : "<br />"
			+ "<span style='padding-left:25px; font-size:14px;'>支付宝转账失败，退回该提现申请！</span><br /><br /><br />",
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
				Ext.Ajax.request({
					url : url,
					params : {
						type : 22,
						content : "id~"+row.get("id")
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)){
							Info_Tip("退回成功!");
							ds_info.reload();
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