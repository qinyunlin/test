var itSel;
var form;
var dd;
var ds;
var id;
var code;
var ddArr = [];
var dsArr = [];
var payTotal = 0;
Ext.onReady(function() {

	// 初始化修改
	initFormValue();

});

function invoiceStatus(invoiceStatus){
	if ("0" == invoiceStatus){
		return "待开发票";
	}else if ("1" == invoiceStatus){
		return "已开发票";
	}
	return "无需发票";
}

function epType(epType){
	if ("2" == epType){
		return "政府机构";
	}else if ("3" == epType){
		return "造价咨询";
	}else if ("4" == epType){
		return "施工单位";
	}else if ("5" == epType){
		return "业主单位";
	}else if ("6" == epType){
		return "设计单位";
	}
	return "其它单位";
}

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
		url : '/mc/vip/EpVipServlet.do',
		params : {
			type : 11,
			code : code
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				//获取套餐信息
				if(data.result["ordersItemType"] == null){
					Ext.lib.Ajax.request("post", "/ep/EnterpriseServlet?type=27&eid=" + data.result["eid"], {
						success : function(response) {
							var jsondata = eval("(" + response.responseText + ")");
							if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
								payTotal = data.result["money"];
								createFormPanel(data, null, jsondata);
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
					return;
				}
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
										Ext.lib.Ajax.request("post", "/ep/EnterpriseServlet?type=27&eid=" + data.result["eid"], {
											success : function(response) {
												var jsondata = eval("(" + response.responseText + ")");
												if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
													if(orderItemData == null)
														payTotal = data.result["money"];
													else{
														payTotal = parseInt(orderGroupData.result["userCountPriceAdd"]) * parseInt(data.result["memberCountAdd"]) 
														+ parseInt(orderGroupData.result["webProvincePriceAdd"]) * parseInt(data.result["webProvinceCountAdd"])
														+ parseInt(orderGroupData.result["materialPriceAdd"]) * parseInt(data.result["materialCountAdd"])
														+ parseInt(orderGroupData.result["askPriceAdd"]) * parseInt(data.result["askPriceCountAdd"])
													    + parseInt(data.result["periodicalPriceAdd"])
													    + parseInt(orderItemData.result["price"]) * parseInt(parseInt(data.result["buyTime"]) / 12);
													}
													createFormPanel(data, orderItemData, jsondata);
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
function createFormPanel(data, orderItem, enterprise) {
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
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "套餐类型："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
							items : [ {
								xtype : "label",
								fieldLabel : "套餐类型",
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["name"] : ""
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
								text : data.result["createOn"]
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "赠送积分："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
							items : [ {
								xtype : "label",
								fieldLabel : "赠送积分",
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["score"] : ""
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "线下询价："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "线下询价",
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["askPriceCount"] : ""
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
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["ckjRange"] : ""
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "材价库流量："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "材价库流量",
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["materialCount"] : ""
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "帐号数："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "帐号数",
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["userCount"] : ""
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "供应商收藏："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "供应商收藏",
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["facCount"] : ""
							} ]
						},{
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
								text : (orderItem != null && orderItem.result != null) ? orderItem.result["price"] +"元" : ""
							} ]
						},{
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
								text : data.result["buyTime"] + "月"
							} ]
						},{
							colspan : 6,
							html : '<hr>'
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购帐号数："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购帐号数",
								text : data.result["memberCountAdd"]
							} ]
						},{
							width : 100,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购查价区域数："
							} ]
						},
						{
							width : 170,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购查价区域数",
								text : data.result["webProvinceCountAdd"]
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购流量："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购流量",
								text : data.result["materialCountAdd"]
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购线下询价："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购线下询价",
								text : data.result["askPriceCountAdd"]
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购期刊套数："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购期刊套数",
								text : data.result["periodicalCountAdd"]
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "增购期刊金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;color:red;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "增购期刊金额",
								text : (data.result["periodicalPriceAdd"] == null ? 0 : data.result["periodicalPriceAdd"])+".00" + "元"
							} ]
						},{
							colspan : 6,
							html : '<hr>'
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "材价库总流量："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "材价库总流量",
								text : (orderItem == null ||orderItem.result == null) ? 0 : parseInt(orderItem.result["materialCount"])+parseInt(data.result["materialCountAdd"])
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "总帐号数："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "总帐号数",
								text : (orderItem == null ||orderItem.result == null) ? 0 : parseInt(orderItem.result["userCount"]) + parseInt(data.result["memberCountAdd"])
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "总线下询价："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "总线下询价",
								text : (orderItem == null ||orderItem.result == null) ? 0 : parseInt(orderItem.result["askPriceCount"]) + parseInt(data.result["askPriceCountAdd"])
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "开通地区："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "开通地区",
								text : data.result["webProvince"]
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
								fieldLabel : "订单状态",
								text : invoiceStatus(data.result["invoiceStatus"])
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
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "发票信息",
								id : "invoiceInfo",
								name : 'invoiceInfo',
								text : data.result["invoiceInfo"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "应付总金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;color:red;",
							items : [ {
								xtype : "label",
								fieldLabel : "应付总金额",
								text : payTotal + ".00元"
							} ]
						},{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "实付金额："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;color:red;",
							items : [ {
								xtype : "label",
								fieldLabel : "实付金额",
								id : "money",
								name : 'money',
								text : data.result["money"] + "元"
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
								text : "企业名称："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "企业名称",
								id : "name",
								name : 'name',
								text : enterprise.result["name"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "企业简称："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "企业简称",
								id : "fname",
								name : 'fname',
								text : enterprise.result["fname"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "公司注册地："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "公司注册地",
								id : "regAddr",
								name : 'regAddr',
								text : enterprise.result["province"] + "   " + enterprise.result["city"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "公司地址："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "公司地址",
								id : "addr",
								name : 'addr',
								text : enterprise.result["addr"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "公司类型："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "公司类型",
								id : "type",
								name : 'type',
								text : epType(enterprise.result["type"])
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
								id : "linkman",
								name : 'linkman',
								text : enterprise.result["linkman"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "联系方式："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "联系方式",
								id : "mobile",
								name : 'mobile',
								text : enterprise.result["mobile"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "传真号码："
							} ]
						},
						{
							width : 180,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "传真号码",
								id : "fax",
								name : 'fax',
								text : enterprise.result["fax"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "创建人ID："
							} ]
						},
						{
							colspan : 3,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;",
							items : [ {
								xtype : "label",
								fieldLabel : "创建人ID",
								id : "createBy",
								name : 'createBy',
								text : data.result["createBy"]
							} ]
						},
						{
							width : 90,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
							items : [ {
								xtype : "label",
								text : "创建时间："
							} ]
						},
						{
							colspan : 3,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;",
							items : [ {
								xtype : "label",
								fieldLabel : "创建时间",
								id : "createOn",
								name : 'createOn',
								text : data.result["createOn"]
							} ]
						}]
			});

	var panel = new Ext.Panel({
		border : false,
		frame : true,
		layout : "column",
		width : '1050',
		bodyStyle : "margin-left:10px;",
		layoutConfig : {
			columns : 2
		},
		renderTo : 'detail',
		items : [ basic_area, {
			columnWidth : .01,
			html : '&nbsp;'
		}]

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
	} else if ("2" == v) {
		name = "线上订单";
	} else if ("3" == v) {
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
function hiddenCancelBtn(tag, ordersStatus, openService) {
	if (openService == "1") {
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

function sendInvoiceRen(sendInvoice, invoice) {
	var stName = "无提供";
	if ("1" == invoice) {
		if ("1" == sendInvoice) {
			stName = "已处理";
		} else {
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
