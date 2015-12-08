var url = "/mc/activityManageServlet.do", grid_info, sel_combo, sendGift_win, activityId, title, fs_sendGift;
var sel_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["gbianma", "编号"],["gname", "名称"],["memberID", "会员ID"]]
});
var memberTypeArr = [['',"全部会员"],[1,"普通会员"],[3,"正式信息会员"],[8,"VIP信息会员"]];
var exchangeStateArr = [['',"全部状态"],["0","未发放"],["1","已发放"],["2","取消兑换"]];
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	activityId = getCurArgs("aid");
	title = decodeURI(getCurArgs("title"));
	getGiftExchangeList();
};
var tbar = [{
			text : '查看详情',
			icon : "/resource/images/edit.gif", 
			hidden : compareAuth("ACTIVITY_MANAGE_EXCHANGE_VIEW"),
			handler : openGiftExchangeInfo
		},{
			text : "发放礼品",
			icon : '/resource/images/ruby_gear.png',
			hidden : compareAuth("ACTIVITY_MANAGE_GIFT_SEND"),
			handler : showSendGift_win
		},{
			text : "取消兑换",
			icon : '/resource/images/delete.gif',
			hidden : compareAuth("ACTIVITY_MANAGE_EXCHANGE_CANCEL"),
			handler : cancelGiftExchange
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id",type:"int"},{name:"gbianma"},{name:"giftName"},{name:"score"},{name:"count"},{name:"memberID"},{name:"memberCorpName"},{name:"degree"},{name:"createOn"},{name:"updateOn"},{name:"state", type:"int"},{name:"degree"}]	
			}),
			
	baseParams : {
		type : 6,
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 7
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
function getGiftExchangeList(){
	grid_info = new Ext.grid.GridPanel({
		title : "活动主题——<font style='color:red;'>" + title + "</font>",
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_info,
		viewConfig : {
			forceFit : true,
			getRowClass : function(record,rowIndex,rowParams,store){  
                //禁用数据显示红色  
                if(record.data.state == 2){  
                    return 'x-grid-record-red';  
                }else{  
                    return '';  
                }  
            }
		},
		tbar : tbar,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : '编号',
					sortable : false,
					dataIndex : 'gbianma'
				}, {
					header : '名称',
					sortable : false,
					dataIndex : 'giftName',
				}, {
					header : '所需积分',
					sortable : false,
					dataIndex : 'score',
				}, {
					header : '数量',
					sortable : false,
					dataIndex : 'count',
				}, {
					header : '会员ID',
					sortable : false,
					dataIndex : 'memberID',
				}, {
					header : '公司名称',
					sortable : false,
					dataIndex : 'memberCorpName',
				}, {
					header : '会员类型',
					sortable : false,
					dataIndex : 'degree',
					renderer : showDegree
				}, {
					header : '兑换时间',
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
							return "<span style='color:red;'>未发放</span>";
						else if(state == 1)
							return "已发放";
						return "取消兑换";
					}
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
					id : 'member_type',
					name : 'member_type',
					hiddenName : "member_type_input",
					fieldLabel : '会员类型',
					store : memberTypeArr,
					typeAhead : true,
					mode : 'local',
					triggerAction : 'all',
					emptyText : '全部会员',
					valueField : "value",
					displayField : "text",
					readOnly : true,
					xtype : "combo",
					value : "",
					width : 120
				},"-",{
					id : 'exchange_state',
					name : 'exchange_state',
					hiddenName : "exchange_state_input",
					fieldLabel : '发放状态',
					store : exchangeStateArr,
					typeAhead : true,
					mode : 'local',
					triggerAction : 'all',
					emptyText : '全部状态',
					valueField : "value",
					displayField : "text",
					readOnly : true,
					xtype : "combo",
					value : "",
					width : 120
				},"-", sel_combo = new Ext.form.ComboBox({
					store : sel_type,
					mode : "local",
					triggerAction : "all",
					valueField : "value",
					displayField : "text",
					value : "gbianma",
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
	ds_info.baseParams["aid"] = activityId;
	ds_info.countParams["aid"] = activityId;
	ds_info.load();
}
//筛选查询
function searchlist(){
	var temp_query = "degree~" + Ext.fly("member_type_input").getValue() + ";";
	temp_query += "state~" + Ext.fly("exchange_state_input").getValue() + ";";
	temp_query += "query_type~" + sel_combo.getValue() + ";";
	temp_query += "query_input~" + Ext.fly("search_input").getValue() + ";";
	ds_info.baseParams["content"] = temp_query;
	ds_info.countParams["content"] = temp_query;
	ds_info.load();
}
//查看兑换记录详情
function openGiftExchangeInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	window.parent.createNewWidget("exchange_info", '查看礼品', '/module/activityManage/exchange_info.jsp?id=' + id);
}
//显示发放礼品弹出窗口
function showSendGift_win(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	if(row.get("state") == 1){
		Warn_Tip("该记录已发放，无需处理发放。");
		return;
	}
	if(row.get("state") == 2){
		Warn_Tip("该记录已取消兑换，无需处理发放。");
		return;
	}
	var giftExchangeId = row.get("id");
	var memberID = row.get("memberID");
	var gbianma = row.get("gbianma");
	var giftName = row.get("giftName");
	fs_sendGift = new Ext.form.FormPanel({
		labelAlign : 'left',
		labelWidth : 90,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : 250,
		layoutConfig : {
			columns : 2
		},
		bodyStyle : 'padding:6px',
		items : [{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "会员ID："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "label",
						id : "memberID",
						text : memberID
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "联系人："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "textfield",
						id : "linkman",
						maxlength : 30,
						allowBlank : false,
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "联系电话："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "textfield",
						id : "phone",
						maxlength : 30,
						allowBlank : false,
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "公司名称："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "textfield",
						id : "corpName",
						maxlength : 50,
						allowBlank : false,
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "寄送地址："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "textfield",
						id : "addr",
						maxlength : 50,
						allowBlank : false,
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "快递公司："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "textfield",
						id : "express",
						maxlength : 200,
						allowBlank : false,
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "快递单号："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "textfield",
						id : "expressNum",
						maxlength : 30,
						allowBlank : false,
						value : ""
					}]
		}]
	});
	sendGift_win = new Ext.Window({
		title : "填空客户联系信息",
		modal : true,
		width : 400,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs_sendGift],
		buttons : [{
					text : "确定发放",
					handler : function(){
						sendGift(giftExchangeId, gbianma,giftName);
					}
				}, {
					text : '取消',
					handler : function() {
						sendGift_win.close();
					}
				}]
	});
	sendGift_win.show();
}
//发放礼品
function sendGift(giftExchangeId, gbianma,giftName){
	if (!fs_sendGift.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写内容");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 18,
			content : "id~" + giftExchangeId+";gbianma~"+gbianma+";name~"+giftName+";linkman~"+Ext.fly("linkman").getValue()+";phone~"+Ext.fly("phone").getValue()+";corpName~"+Ext.fly("corpName").getValue()
			+";addr~"+Ext.fly("addr").getValue()+";express~"+Ext.fly("express").getValue()+";expressNum~"+Ext.fly("expressNum").getValue()
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("操作成功。");
				sendGift_win.close();
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//取消兑换
function cancelGiftExchange(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	if(row.get("state") != 0){
		Warn_Tip("该记录已处理，不能取消兑换。");
		return;
	}
	Ext.Msg.confirm("提示", "确定取消兑换后，该 礼品所需积分将返回给该 会员。", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 19,
					content : "id~" + row.get("id")+";memberID~"+row.get("memberID")+";name~"+row.get("giftName")+";score~"+row.get("score")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Info_Tip("操作成功。");
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}