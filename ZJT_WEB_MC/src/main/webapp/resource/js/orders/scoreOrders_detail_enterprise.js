var id;
var code;

Ext.onReady(function() {
	// 初始化修改
	initFormValue();

});

// 初始化修改值
function initFormValue() {
	id = getCurArgs("id");
	code = getCurArgs("code");
	if (id == null || id == "") {
		Ext.Msg.alert("请求的数据不存在");
		return;
	}

	// Ajax取得记录
	Ext.Ajax.request({
		url : '/mc/order/ScoreOrderServlet.do',
		params : {
			type : 23,
			id : id,
			code : code
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				createFormPanel(data);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

function createFormPanel(data) {

	var basic_area = new Ext.form.FieldSet(
			{
				columnWidth : .6,
				title : '订单详情',
				layout : "table",
				layoutConfig : {
					columns : 4
				},
				bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;',
				items : [
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "订单编号："
							} ]
						},
						{
							width : 180,
							autoHeight : true,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:5px;",
							items : [ {
								xtype : "label",
								fieldLabel : "订单编号",
								id : "code",
								name : "code",
								text : data.result["code"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "会员账号："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
							items : [ {
								xtype : "label",
								fieldLabel : "会员账号",
								id : "uid",
								name : 'uid',
								text : data.result["memberId"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "下单时间："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "下单时间",
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
								text : "订单状态："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "订单状态",
								id : "orderStatus",
								name : 'orderStatus',
								text : ordersStatusRen(data.result["orderStatus"])
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "购买积分："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "购买积分",
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
								text : "支付金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;",
							items : [ {
								xtype : "label",
								fieldLabel : "支付金额",
								id : "money",
								name : 'money',
								text : data.result["money"] + "元"
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "订单类型："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "订单类型",
								id : "invoice",
								name : 'invoice',
								text : typeRen(data.result["type"])
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "发票状态："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "发票状态",
								id : "sendInvoice",
								name : 'sendInvoice',
								text : sendInvoiceRen(data.result["sendInvoice"],data.result["invoice"])
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "开据发票："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "开据发票",
								id : "invoice",
								name : 'invoice',
								text : invoiceRen(data.result["invoice"])
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "发票信息："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "发票信息",
								id : "invoiceInfo",
								name : 'invoiceInfo',
								text : data.result["invoiceInfo"]
							} ]
						},
						{
							colspan : 6,
							html : '<hr>'
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "公司名称："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "公司名称",
								id : "eName",
								name : 'eName',
								text : data.result["corpName"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "联系人："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "联系人",
								id : "uName",
								name : 'uName',
								text : data.result["trueName"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "所属部门："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "所属部门",
								id : "dept",
								name : 'dept',
								text : data.result["dept"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "手机号码："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "手机号码",
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
								text : "固定电话："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "固定电话",
								id : "mobile",
								name : 'mobile',
								text : data.result["mobile"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "电子邮箱："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "电子邮箱",
								id : "email",
								name : 'email',
								text : data.result["email"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "邮政编码："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "邮政编码",
								id : "postCode",
								name : 'postCode',
								text : data.result["postCode"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "联系地址："
							} ]
						},
						{
							colspan : 3,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "联系地址",
								id : "address",
								name : 'address',
								text : data.result["address"]
							} ]
						} ]
			});

	var basic_area1 = new Ext.form.FieldSet(
			{
				columnWidth : .3,
				width:'40%',
				title : '订单处理流程',
				layout : "table",
				layoutConfig : {
					columns : 2
				},
				height : 503,
				items : [
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:10px;",
							items : [ {
								xtype : "label",
								text : "下单时间："
							} ]
						},
						{
							width : 182,
							autoHeight : true,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "下单时间",
								id : "createOn",
								name : "createOn",
								text : data.result["createOn"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;",
							items : [ {
								xtype : "label",
								text : "付款时间："
							} ]
						},
						{
							width : 182,
							autoHeight : true,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;",
							items : [ {
								xtype : "label",
								fieldLabel : "付款时间",
								id : "payTime",
								name : "payTime",
								text : "1" == data.result["ordersStatus"] ? "" : data.result["paymentOn"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;",
							items : [ {
								xtype : "label",
								text : "开据发票时间："
							} ]
						},
						{
							width : 182,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;",
							items : [ {
								xtype : "label",
								fieldLabel : "开据发票时间",
								id : "sendInvoiceTime",
								name : "sendInvoiceTime",
								text : data.result["sendInvoiceTime"]
							} ]
						} ]
			});
	var panel = new Ext.Panel({
		border : false,
		frame : true,
		layout : "column",
		width:'1050',
		bodyStyle : "margin-left:10px;",
		layoutConfig : {
			columns : 2
		},
		renderTo : 'detail',
		items : [ basic_area, {
			columnWidth : .01,
			html : '&nbsp;'
		}, basic_area1 ]

	});
}

function typeRen(v) {
	var name = "";
	if (v == "0"){
		name = "网银支付";
	}else if (v == "1"){
		name = "余额支付";
	}
	return name;
}

function sendInvoiceRen(sendInvoice,invoice) {
	var stName = "无提供";
	if ("1" == invoice){
		if ("1" == sendInvoice){
			stName = "已处理";
		}else{
			stName = "未处理";
		}
	}
	return stName;
}

function invoiceRen(invoice) {
	if ("1" == invoice) {
		return "是";
	}
	return "否";
}

function ordersStatusRen(r) {
	var st = r;
	var stName = "未付款";
	if ("1" == st) {
		stName = "付款成功";
	}else if ("2" == st){
		stName = "订单取消";
	}else if ("3" == st){
		stName = "7天未付款";
	}
	return stName;
}



function closeWin(tag) {
	window.parent.Ext.getCmp('center').remove("scoreOrders_detail");
};
