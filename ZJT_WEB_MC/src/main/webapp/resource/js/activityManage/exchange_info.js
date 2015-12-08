var url = "/mc/activityManageServlet.do";
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	if (!Ext.isEmpty(getCurArgs("id"))) {
		var id = getCurArgs("id");
		getExchangeInfo(id);
	}
};
function getExchangeInfo(id){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 8,
			content : "id~" + id
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				createFormPanel(jsondata);
				if(jsondata.result["state"] != "1")
					Ext.fly("userInfoField").setVisible(false);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//创建表单
function createFormPanel(data) {
	var basic_area_gift = new Ext.form.FieldSet({
		title : '礼品信息',
		layout : "table",
		layoutConfig : {
			columns : 4
		},
		bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;',
		items : [{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "礼品编号："
					} ]
				},
				{
					width : 180,
					autoHeight : true,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:5px;",
					items : [ {
						xtype : "label",
						fieldLabel : "礼品编号",
						id : "gbianma",
						name : "gbianma",
						text : data.result["gbianma"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "礼品名称："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
					items : [ {
						xtype : "label",
						fieldLabel : "礼品名称",
						id : "giftName",
						name : 'giftName',
						text : data.result["giftName"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "所需积分："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "所需积分",
						id : "score",
						name : 'score',
						text : data.result["score"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "数量："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "数量",
						id : "count",
						name : 'count',
						text : data.result["count"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "会员ID："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "会员ID",
						id : "memberID",
						name : 'memberID',
						text : data.result["memberID"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "公司名称 ："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "公司名称",
						id : "memberCorpName",
						name : 'memberCorpName',
						text : data.result["memberCorpName"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "会员类型："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "会员类型",
						id : "degree",
						name : 'degree',
						text : showDegree(data.result["degree"])
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "兑换时间："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "兑换时间",
						id : "createOn",
						name : 'createOn',
						text : data.result["createOn"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "操作人："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "操作人",
						id : "updateBy",
						name : 'updateBy',
						text :data.result["updateBy"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "处理时间："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "处理时间",
						id : "updateOn",
						name : 'updateOn',
						text : data.result["updateOn"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "发放状态："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;",
					items : [ {
						xtype : "label",
						fieldLabel : "发放状态",
						id : "state",
						name : 'state',
						text : getExchangeState(data.result["state"])
					} ]
				}]
	});

	var basic_area_member = new Ext.form.FieldSet({
		id : "userInfoField",
		title : "客户信息",
		layout : "table",
		layoutConfig : {
			columns : 4
		},
		bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;',
		items : [{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "联系人："
					} ]
				},
				{
					width : 180,
					autoHeight : true,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:5px;",
					items : [ {
						xtype : "label",
						fieldLabel : "联系人",
						id : "linkman",
						name : "linkman",
						text : data.result["linkman"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "公司名称："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
					items : [ {
						xtype : "label",
						fieldLabel : "公司名称",
						id : "corpName",
						name : 'corpName',
						text : data.result["corpName"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "联系电话："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "联系电话",
						id : "phone",
						name : 'phone',
						text : data.result["phone"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "快递公司："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "快递公司",
						id : "express",
						name : 'express',
						text : data.result["express"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "快递单号："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "快递单号",
						id : "expressNum",
						name : 'expressNum',
						text : data.result["expressNum"]
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "寄送地址 ："
					} ]
				},
				{
					width : 180,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
					items : [ {
						xtype : "label",
						fieldLabel : "寄送地址",
						id : "addr",
						name : 'addr',
						text : data.result["addr"]
					} ]
				}]
	});
	var basic_area_button = new Ext.form.FieldSet({
		layout : "table",
		layoutConfig : {
			columns : 4
		},
		bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;text-align:center;',
		border : false,
		height : 50,
		buttons : [
				{
					xtype : "button",
					text : '关闭',
					handler : function() {
						window.parent.Ext.getCmp('center').remove("exchange_info");
					}
				}]
	});
	var panel = new Ext.Panel({
		border : false,
		frame : true,
		layout : "table",
		width:'1050',
		bodyStyle : "margin-left:10px;",
		layoutConfig : {
			columns : 1
		},
		renderTo : 'detail',
		items : [ basic_area_gift, basic_area_member, basic_area_button]
	});
}
function getExchangeState(state){
	if(state == 0)
		return "未发放";
	else if(state == 1)
		return "已发放";
	return "取消兑换";
}