var itSel;
var form;
var dd;
var ds;
var id;
var code;
var ddArr = [];
var dsArr = [];
var priceAcount = null;
var payTotal=0;
var unit="";
var qkprice="";
var areasCountAdd="";
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
		url : '/mc/Order.do',
		params : {
			type : 10,
			id : id
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				
				
				
				Ext.lib.Ajax.request("post", "/ordersitem/group/OrderGroupServlet.do?type=7&ordersItemId=" + data.result["ordersItemType"], {
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
							var orderItemData = jsondata;
							Ext.lib.Ajax.request("post", "/ordersitem/group/OrderGroupServlet.do?type=16&orderGroupId=" + orderItemData.result["pid"], {
								success : function(response) {
									var jsondata = eval("(" + response.responseText + ")");
									if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
										var orderGroupData = jsondata;
										
										data.result["qkPrice"]+ data.result["itemPrice"]* "元"

									   
										
								
										
										if( payTotal.toString()==null ||   payTotal.toString()=="" || payTotal.toString()=="NaN" || payTotal.toString() == NaN){
										   payTotal=0;
									   }
									   qkprice=data.result["qkPrice"];
									
									   if(qkprice==null  || qkprice==""){
										   qkprice="0";
									   } 
									   
									   areasCountAdd=data.result["areasCountAdd"];
									   if(areasCountAdd==null || areasCountAdd==""){
										   areasCountAdd="0";
									   }
									   
									    var webProvincePriceAdd=orderGroupData.result["webProvincePriceAdd"];
										if(webProvincePriceAdd!=null && webProvincePriceAdd !=""){
											payTotal=parseInt(orderGroupData.result["webProvincePriceAdd"]) * parseInt(data.result["areasCountAdd"])
											+ parseInt(qkprice)
										   + parseInt(data.result["itemPrice"]) * parseInt( data.result["type"] == 1 ? data.result["timeLength"]/12  : data.result["timeLength"] );
										   
										}else{
											payTotal =parseInt(qkprice)+parseInt(data.result["itemPrice"]) * parseInt( data.result["type"] == 1 ? data.result["timeLength"]/12  : data.result["timeLength"] );
										}
										
									   
									   unit=orderItemData.result["unit"];
										createFormPanel(data);
										priceAcount = data.result["priceAcount"];
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
						return;
					}
				});
				
				
				
				
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

// 创建表单
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
								text : data.result["uid"]
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
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "订单状态",
								id : "ordersStatus",
								name : 'ordersStatus',
								text : ordersStatusRen(data.result["ordersStatus"])
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
								text : "开通状态："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "开通状态",
								id : "openService",
								name : 'openService',
								text : openServiceRen(data.result["openService"])
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "购买套餐："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "购买套餐",
								id : "ordersItem",
								name : 'ordersItem',
								//text : data.result["ordersItem"]
								text : data.result["orderTypeAllName"] + data.result["ordersItem"] 
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "套餐单价："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;",
							items : [ {
								xtype : "label",
								fieldLabel : "套餐单价",
								id : "itemPrice",
								name : 'itemPrice',
								text : data.result["itemPrice"] + "元/"+unit
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "购买时长："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "购买时长",
								id : "timeLength",
								name : 'timeLength',
								text :data.result["type"] == 1 ? data.result["timeLength"] + "月" : data.result["timeLength"] * 12 + "月"
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "应收金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;font-weight:bold;",
							items : [ {
								xtype : "label",
								fieldLabel : "应收金额",
								id : "priceAcount",
								name : 'priceAcount',
								text :payTotal+ "元"
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
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "期刊金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;",
							items : [ {
								xtype : "label",
								fieldLabel : "期刊金额",
								id : "qkPrice",
								name : 'qkPrice',
								text : qkprice
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "查询区域："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "查询区域",
								id : "webProvince",
								name : 'webProvince',
								text : data.result["webProvince"]
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购区域数："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购区域数",
								id : "areasCountAdd",
								name : 'areasCountAdd',
								text : areasCountAdd
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "实收金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;font-weight:bold;",
							items : [ {
								xtype : "label",
								fieldLabel : "实收金额",
								id : "priceAcount",
								name : 'priceAcount',
								text : data.result["priceAcount"] + "元"
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : ""
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "",
								
							} ]
						},
						{
							colspan : 7,
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
								text : data.result["eName"]
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
								text : data.result["uName"]
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
								text : "职位："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "职位",
								id : "position",
								name : 'position',
								text : data.result["position"]
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
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "备注："
							} ]
						},
						{
							colspan : 3,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;",
							items : [ {
								xtype : "label",
								fieldLabel : "备注",
								id : "comment",
								name : 'comment',
								text : data.result["comment"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "审核人ID："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "审核人ID",
								id : "auditBy",
								name : 'auditBy',
								text : data.result["auditBy"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "审核时间："
							} ]
						},
						{
							width : 184,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "审核时间",
								id : "auditOn",
								name : 'auditOn',
								text : data.result["auditOn"]
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
								text : "1" == data.result["ordersStatus"] ? "" : data.result["payTime"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;",
							items : [ {
								xtype : "label",
								text : "开始时间："
							} ]
						},
						{
							width : 182,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;",
							items : [ {
								xtype : "label",
								fieldLabel : "开始时间",
								id : "auditOn1",
								name : "auditOn1",
								text : getTimeFormat(data.result["auditOn"])
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

	var basic_area2 = new Ext.form.FieldSet({
		columnWidth : .4,
		title : '',
		layout : "column",
		layoutConfig : {
			columns : 3
		},
		border : false,
		height : 50,
		buttons : [
				{
					text : '开通',
					width : 100,
					height : 25,
					handler : openService,
					hidden : hiddenOpenBtn(data.result["type"],
							data.result["ordersStatus"],
							data.result["openService"])
				},
				{
					text : '取消订单',
					width : 100,
					height : 25,
					handler : function up() {
						updateOrder("3");
					},
					hidden : hiddenCancelBtn(data.result["type"],
							data.result["ordersStatus"],data.result["openService"])
				},
				{
					text : '恢复订单',
					width : 100,
					height : 25,
					handler : function up() {
						updateOrder("1");
					},
					hidden : hiddenRemBtn(data.result["type"],
							data.result["ordersStatus"])
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
		}, basic_area1, basic_area2 ]

	});

}

function getTimeFormat(t) {
	if (!t) {
		return "";
	} else {
		return t.slice(0, 16);
	}
}

// 取消或恢复
function updateOrder(tag) {
	var msg = "";
	if (tag == "3") {
		msg = "取消订单";
	} else if (tag == "1") {
		msg = "恢复订单";
	}

	Ext.Msg.confirm("确认操作", "您确认要" + msg + "吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/mc/Order.do',
				params : {
					type : 8,
					id : id,
					ordersStatus : tag
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Ext.MessageBox.alert("提示", msg + "成功", closeWin);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});

}

function typeRen(v) {
	if (v == "1") {
		name = "线下订单";
	} else if ("2" == v){
		name = "线上订单";
	} else if ("3" == v){
		name = "余额支付订单";
	}
	return name;
}

// 开通按扭
function hiddenOpenBtn(tag, ordersStatus, openService) {
	if (ordersStatus == "2" && openService != "1") {// 已付款,未开通
		return false;
	} else {
		return true;
	}
}

// 取消按扭
function hiddenCancelBtn(tag, ordersStatus,openService) {
	if(openService == "1"){
		return true;
	}
	
	if (ordersStatus == "1") {
		return false;
	} else {
		return true;
	}
}

// 恢复按扭
function hiddenRemBtn(tag, ordersStatus) {
	if (ordersStatus == "3") {
		return false;
	} else {
		return true;
	}
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
	var stName = "";
	if (st == "2") {
		stName = "已付款";
	} else if (st == "1") {
		stName = "未付款";
	} else if (st == "3") {
		stName = "已取消";
	}
	return stName;
}
function openServiceRen(r) {
	var opens = r;
	var stName = "";
	if (opens == "1") {
		stName = "已开通";
	} else if (opens == "2") {
		stName = "未开通";
	}
	return stName;
}

// 开通
function openService() {
	priceAcount = "6000";
	if(priceAcount == null){
		alert("订单总金额不能为空！");
		return false;
	}else if (parseFloat(priceAcount) < 1000){
		alert("订单总金额不能少于1000元！");
		return false;
	}
	Ext.Msg.confirm("开通", "确认要开通吗?", function(info) {
		if (info == "yes") {
			Ext.Ajax.request({
				url : '/mc/Order.do',
				params : {
					type : 7,
					code : code
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Ext.MessageBox.alert("提示", "开通成功", closeWin);
						parent.tab_0208_iframe.ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}

function closeWin(tag) {
	window.parent.Ext.getCmp('center').remove("orders_detail");
};
