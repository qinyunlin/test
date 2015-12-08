var url = "/mc/activityManageServlet.do", grid_info, activityId, title, state, sel_combo, giftInfo_win, ds_gift;
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	activityId = getCurArgs("aid");
	title = decodeURI(getCurArgs("title"));
	state = getCurArgs("state");
	getActivityGiftList();
};
var tbar = [{
			text : '添加礼品',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("ACTIVITY_MANAGE_GIFT_ADD"),
			handler : showAddGift
		}, {
			text : '查看/修改礼品',
			icon : "/resource/images/edit.gif",
			hidden : compareAuth("ACTIVITY_MANAGE_GIFT_EDIT"),
			handler : function(){
				showGiftInfo();
			}
		},{
			text : "兑换礼品",
			icon : '/resource/images/ruby_gear.png',
			hidden : compareAuth("ACTIVITY_MANAGE_EXCHANGE"),
			handler : showExchangeGift
		},{
			text : '兑换记录',
			icon : "/resource/images/ruby_gear.png",
			handler : openGiftExchange,
			hidden : compareAuth('ACTIVITY_MANAGE_EXCHANGE_LIST')
		}, {
			text : '删除礼品',
			icon : "/resource/images/delete.gif",
			handler : delGift,
			hidden : compareAuth('ACTIVITY_MANAGE_GIFT_DEL')
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"aid"},{name:"gbianma"},{name:"giftName"},{name:"score"},{name:"count"},{name:"usedCount"},{name:"surplusCount"},{name:"createBy"},{name:"createOn"},{name:"updateBy"},{name:"updateOn"}]	
			}),
			
	baseParams : {
		type : 4,
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 5,
	},
	remoteSort : true
});
var pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "gbianma",
	singleSelect : true
});
//获取活动列表
function getActivityGiftList(){
	grid_info = new Ext.grid.GridPanel({
		title : "活动主题——<font style='color:red;'>" + title + "</font>",
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
					header : '计划礼品数',
					sortable : false,
					dataIndex : 'count',
				}, {
					header : '已兑数量',
					sortable : false,
					dataIndex : 'usedCount',
				}, {
					header : '剩余数量',
					sortable : false,
					dataIndex : 'surplusCount',
				}, {
					header : '创建人',
					sortable : false,
					dataIndex : 'createBy'
				}, {
					header : '创建日期',
					sortable : false,
					dataIndex : 'createOn'
				}, {
					header : '更新人',
					sortable : false,
					dataIndex : 'updateBy'
				}, {
					header : '更新日期',
					sortable : false,
					dataIndex : 'updateOn'
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});
	ds_info.baseParams["aid"] = activityId;
	ds_info.countParams["aid"] = activityId;
	ds_info.load();
}
//查看兑换记录
function openGiftExchange(){
	window.parent.createNewWidget("exchange_list", "兑奖记录", "/module/activityManage/exchange_list.jsp?aid="+activityId +"&title="+title);
}
//添加礼品
function showAddGift(){
	if(state == "1"){
		Ext.Msg.alert("提示", "该活动已关闭，不可进行该操作！");
		return;
	}
	var sel_type = new Ext.data.ArrayStore({
		fields : ['value', 'text'],
		data : [["number", "编号"],["name", "名称"]]
	});
	var tbar = [
	 sel_combo = new Ext.form.ComboBox({
		store : sel_type,
		mode : "local",
		triggerAction : "all",
		valueField : "value",
		displayField : "text",
		value : "number",
		text : "编号",
		width : 80

	}),"-",{
		xtype : "label",
		text : " 关键字： "
	},{
		xtype : "textfield",
		id : "search_input",
		width : 150,
		enableKeyEvents : true,
		listeners : {
			"keyup" : function(tf, e) {
				if (e.getKey() == e.ENTER) {
					searchGiftlist();
				}
			}
		}
	},{
		text : "查询",
		id : "search",
		icon : "/resource/images/zoom.png",
		handler : searchGiftlist
	}];
	ds_gift = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
					url : "/mc/giftManageServlet"
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					fields:[{name:"id"},{name:"bianma"},{name:"name"},{name:"count"},{name:"usedCount"}]	
				}),
				
		baseParams : {
			type : 1,
			pageNo : 1,
			pageSize : 10
		},
		countUrl : "/mc/giftManageServlet",
		countParams : {
			type : 2
		},
		remoteSort : true
	});
	var pagetool_gift = new Ext.ux.PagingToolbar({
		store : ds_gift,
		displayInfo : true
	});
	grid_gift = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_gift,
		viewConfig : {
			forceFit : true
		},
		tbar : tbar,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}),{
					header : '编号',
					sortable : false,
					dataIndex : 'bianma'
				}, {
					header : '名称',
					sortable : false,
					dataIndex : 'name',
				}, {
					header : '库存量',
					sortable : false,
					renderer : function(value,meta,record){
						var usedCount = record.get("usedCount");
						var count = record.get("count");
						return count-usedCount;
					}
				}],
		bbar : pagetool_gift
	});
	ds_gift.load();
	addGift_win = new Ext.Window({
		title : "关联礼品 ",
		modal : true,
		width : 600,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		x : "450",
		y : "150",
		items : [grid_gift],
		buttons : [{
					text : "关联礼品 ",
					handler : function(){
						var row = grid_gift.getSelectionModel().getSelected();
						if (Ext.isEmpty(row)) {
							Warn_Tip("请选择一条信息！");
							return;
						}
						addGift_win.close();
						showAddGiftInfo(row.get("id"), activityId, row.get("bianma"));
					}
				}, {
					text : '关闭',
					handler : function() {
						addGift_win.close();
					}
				}]
	});
	addGift_win.show();
}
function searchGiftlist(){
	ds_gift.baseParams["number"] = "";
	ds_gift.baseParams["name"] = "";
	ds_gift.countParams["number"] = "";
	ds_gift.countParams["name"] = "";
	var searchInput = Ext.fly("search_input").getValue();
	if(searchInput.trim() == ""){
		ds_gift.load();
		return;
	}
	ds_gift.baseParams[sel_combo.getValue()] = searchInput;
	ds_gift.countParams[sel_combo.getValue()] = searchInput;
	ds_gift.load();
}
function showGiftInfo_win(type){
	var fs_showGiftInfo = new Ext.form.FormPanel({
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
			layout : 'table',
			bodyStyle : 'border:none;width:500;padding:5px;',
			layoutConfig : {
				columns : 2
			},
			items : [{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;",
				items : [{
							xtype : "label",
							text : ""
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;",
				items : [{
							xtype : "hidden",
							id : "aid",
							text : ""
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;",
				items : [{
							xtype : "label",
							text : ""
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;",
				items : [{
							xtype : "hidden",
							id : "bianma",
							text : ""
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "礼品编号："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							id : "gbianma",
							text : ""
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "礼品名称："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							id : "giftName",
							text : ""
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "礼品库存量："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							id : "giftCount",
							text : ""
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "计划礼品数："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "numberfield",
							id : "giftCount",
							id : "count",
							name : "count",
							minValue : 1,
							allowNegative : false,
							value : ""
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "所需积分："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "numberfield",
							id : "score",
							name : "score",
							minValue : 1,
							allowNegative : false,
							value : ""
						}]
			}]
		},{
			bodyStyle : 'border:none;padding-left:50px;',
			items : [{
				width : 160,
				height : 160,
				html : "<img id='picPath' src='' width='160' height='160' />"
			}]
		}]
	});
	giftInfo_win = new Ext.Window({
		title : (type == "add" ? "添加" : "修改") + "礼品",
		modal : true,
		width : 500,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs_showGiftInfo],
		buttons : [{
					id : "btn_update",
					text : type == "add" ? "添加" : "修改",
					handler : function(){
						addOrUpdateGift(type);
					}
				}, {
					text : '取消',
					handler : function() {
						giftInfo_win.close();
					}
				}]
	});
	giftInfo_win.show();
}
//查看/修改礼品
function showGiftInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 13,
			content : "aid~"+row.get("aid")+";gbianma~"+row.get("gbianma")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				showGiftInfo_win("update");
				if(state == "1")
					Ext.getCmp("btn_update").setVisible(false);
				Ext.getCmp("gbianma").setText(jsondata.result["gbianma"]);
				Ext.getCmp("giftName").setText(jsondata.result["giftName"]);
				Ext.getCmp("giftCount").setText(jsondata.result["giftCount"]);
				Ext.get("aid").dom.value = jsondata.result["aid"];
				Ext.get("bianma").dom.value = jsondata.result["gbianma"];
				Ext.get("count").dom.value = jsondata.result["count"];
				Ext.get("score").dom.value = jsondata.result["score"];
				Ext.get("picPath").dom.src = FileUpload_Ext.requestURL + jsondata.result["imgURL"].replace(/(\\)|(\/\/)/g, "/");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//关联礼品
function showAddGiftInfo(id, aid, bianma){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 9,
			content : "aid~"+aid+";gbianma~"+bianma
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result >= 1){
					Info_Tip("该礼品已经添加过了。");
					return;
				}
				Ext.Ajax.request({
					url : "/mc/giftManageServlet",
					params : {
						type : 7,
						id : id
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
							showGiftInfo_win("add");
							Ext.get("aid").dom.value = activityId;
							Ext.get("bianma").dom.value = jsondata.result["bianma"];
							Ext.getCmp("gbianma").setText(jsondata.result["bianma"]);
							Ext.getCmp("giftName").setText(jsondata.result["name"]);
							Ext.getCmp("giftCount").setText(jsondata.result["count"]);
							Ext.get("picPath").dom.src = FileUpload_Ext.requestURL + jsondata.result["imgURL"].replace(/(\\)|(\/\/)/g, "/");
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//添加或修改活动下某礼品
function addOrUpdateGift(type){
	var count = Ext.fly("count").getValue();
	if(count.length == 0){
		Ext.Msg.alert("提示", "计划礼品数不能为空。");
		return;
	}
	var score = Ext.fly("score").getValue();
	if(score.length == 0){
		Ext.Msg.alert("提示", "所需积分不能为空。");
		return;
	}
	var aid = Ext.fly("aid").getValue();
	var gbianma = Ext.fly("bianma").getValue();
	var urlType = 14;
	if(type == "update")
		urlType = 15;
	Ext.Ajax.request({
		url : url,
		params : {
			type : urlType,
			content : "aid~"+aid+";gbianma~"+gbianma+";count~"+count+";score~"+score
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("操作成功。");
				giftInfo_win.close();
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//显示兑换礼品窗口
function showExchangeGift(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 13,
			content : "aid~"+row.get("aid")+";gbianma~"+row.get("gbianma")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				showExchangeGift_win();
				Ext.get("hid_aid").dom.value = jsondata.result["aid"];
				Ext.get("hid_gbianma").dom.value = jsondata.result["gbianma"];
				Ext.get("hid_giftName").dom.value = jsondata.result["giftName"];
				Ext.get("hid_score").dom.value = jsondata.result["score"];
				Ext.getCmp("giftName").setText(jsondata.result["giftName"]);
				Ext.getCmp("score").setText(jsondata.result["score"]);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//创建弹出面板
function showExchangeGift_win(){
	var fs_exchangeGift = new Ext.form.FormPanel({
		labelAlign : 'left',
		labelWidth : 90,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : 150,
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
						text : "名称："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "label",
						id : "giftName",
						text : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
			items : [{
						xtype : "label",
						text : "所需要积分："
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px;",
			items : [{
						xtype : "label",
						id : "score",
						text : ""
					}]
		},{
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
						xtype : "textfield",
						id : "memberID",
						allowBlank : false,
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "label",
						text : ""
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "hidden",
						id : "hid_aid",
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "label",
						text : ""
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "hidden",
						id : "hid_gbianma",
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "label",
						text : ""
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "hidden",
						id : "hid_score",
						value : ""
					}]
		},{
			width : 80,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "label",
						text : ""
					}]
		}, {
			width : 200,
			autoHeight : true,
			bodyStyle : "border:none;",
			items : [{
						xtype : "hidden",
						id : "hid_giftName",
						value : ""
					}]
		}]
	});
	exchangeGift_win = new Ext.Window({
		title : "系统提示",
		modal : true,
		width : 350,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs_exchangeGift],
		buttons : [{
					text : "确定兑换",
					handler : function(){
						exchangeGift();
					}
				}, {
					text : '取消',
					handler : function() {
						exchangeGift_win.close();
					}
				}]
	});
	exchangeGift_win.show();
}
//兑换礼品
function exchangeGift(){
	var memberID = Ext.fly("memberID").getValue();
	if(memberID.trim().length == 0){
		Ext.Msg.alert("提示", "请填写会员ID。");
		return;
	}
	var aid = Ext.fly("hid_aid").getValue();
	var gbianma = Ext.fly("hid_gbianma").getValue();
	var score = Ext.fly("hid_score").getValue();
	var giftName = Ext.fly("hid_giftName").getValue();
	Ext.Ajax.request({
		url : url,
		params : {
			type : 16,
			content : "aid~"+aid+";gbianma~"+gbianma+";memberID~"+memberID+";score~"+score+";name~"+giftName+";title~"+title
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result == "success"){
					Ext.Msg.alert("提示","礼品兑换成功！",function(){
						window.parent.createNewWidget("exchange_list", "兑奖记录", "/module/activityManage/exchange_list.jsp?aid="+activityId +"&title="+title);
					});
					ds_info.reload();
					exchangeGift_win.close();
				}else{
					Info_Tip(jsondata.result);
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//删除礼品
function delGift(){
	if(state == "1"){
		Ext.Msg.alert("提示", "该活动已关闭，不可进行该操作！");
		return;
	}
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	Ext.Msg.confirm("提示", "确定删除该礼品吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 17,
					content : "aid~"+row.get("aid")+";gbianma~"+row.get("gbianma")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						if(jsondata.result != null && jsondata.result.length > 0){
							Info_Tip(jsondata.result);
							return;
						}
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