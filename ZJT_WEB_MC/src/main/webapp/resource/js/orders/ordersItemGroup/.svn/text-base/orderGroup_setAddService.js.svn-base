var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, comboProvinces, comboCities;

var orderGroupId = getCurArgs("orderGroupId");

// 初始化界面
Ext.onReady(function() {
	getAddServiceInfo();
});

function getAddServiceInfo(){
	Ext.Ajax.request({
		url : "/ordersitem/group/OrderGroupServlet.do",
		params : {
			type : 14,
			orderGroupId : orderGroupId
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				createFormPanel(jsondata);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//创建表单
function createFormPanel(data) {
	var basic_area = new Ext.form.FieldSet({
		title : '增购服务',
		layout : "table",
		layoutConfig : {
			columns : 6
		},
		bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;',
		items : [{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "增购流量："
					} ]
				},
				{
					width : 150,
					autoHeight : true,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:5px;",
					items : [ {
						xtype : "numberfield",
						fieldLabel : "增购流量",
						id : "materialPriceAdd",
						name : "materialPriceAdd",
						value : data.result["materialPriceAdd"]
					} ]
				},{
					width : 30,
					bodyStyle : "min-height:30px;_height:30px;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "元/条"
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "增购线下询价："
					} ]
				},
				{
					width : 150,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
					items : [ {
						xtype : "numberfield",
						fieldLabel : "增购线下询价",
						id : "askPriceAdd",
						name : 'askPriceAdd',
						value : data.result["askPriceAdd"]
					} ]
				},{
					width : 30,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "元/条"
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "增购查价区域："
					} ]
				},
				{
					width : 150,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "numberfield",
						fieldLabel : "增购查价区域",
						id : "webProvincePriceAdd",
						name : 'webProvincePriceAdd',
						value : data.result["webProvincePriceAdd"]
					} ]
				},{
					width : 30,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "元/个"
					} ]
				},
				{
					width : 90,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
					items : [ {
						xtype : "label",
						text : "增购子账号："
					} ]
				},
				{
					width : 150,
					bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
					items : [ {
						xtype : "numberfield",
						fieldLabel : "增购子账号",
						id : "userCountPriceAdd",
						name : 'userCountPriceAdd',
						value : data.result["userCountPriceAdd"]
					} ]
				},{
					width : 30,
					bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
					items : [ {
						xtype : "label",
						text : "元/个"
					} ]
				}]
	});
	var basic_area_button = new Ext.form.FieldSet({
		layout : "table",
		layoutConfig : {
			columns : 1
		},
		bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;text-align:center;',
		border : false,
		height : 50,
		buttons : [
				{
					xtype : "button",
					text : '确定',
					handler : function() {
						save();
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
		renderTo : 'purchaseForm',
		items : [ basic_area, basic_area_button]
	});
}
function save(){
	var materialPriceAdd = Ext.getCmp("materialPriceAdd").getValue();
	var askPriceAdd = Ext.getCmp("askPriceAdd").getValue();
	var webProvincePriceAdd = Ext.getCmp("webProvincePriceAdd").getValue();
	var userCountPriceAdd = Ext.getCmp("userCountPriceAdd").getValue();
	if(materialPriceAdd.length == 0 || askPriceAdd.length == 0 || webProvincePriceAdd.length == 0 || userCountPriceAdd.length == 0){
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}
	var contents = "materialPriceAdd~"+materialPriceAdd+";askPriceAdd~"+askPriceAdd+";webProvincePriceAdd~"+webProvincePriceAdd+";userCountPriceAdd~"+userCountPriceAdd;
	Ext.Ajax.request({
		url : "/ordersitem/group/OrderGroupServlet.do",
		params : {
			type : 13,
			orderGroupId : orderGroupId,
			content : contents
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				Ext.MessageBox.alert("提示", "修改成功！");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}