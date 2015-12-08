var sunshineForm, guestUnitFieldSet;

var comboProvinces, comboCities;

var guestUnitId = 0;
var guestUnitNum = 0;

var city = [];

var name = getCurArgs("name");

// 套餐类型
var ordersTypeData = [ [ '', '所有' ], [ '1', '推广会员' ], [ '2', 'A套餐' ],
		[ '3', 'B套餐' ], [ '4', 'C套餐' ] ];

// 年份
var yearData = [ [ '', '所有' ], [ '2012', '2012' ], [ '2013', '2013' ],
		[ '2014', '2014' ], [ '2015', '2015' ], [ '2016', '2016' ],
		[ '2017', '2017' ], [ '2018', '2018' ] ];
// 范围
var rangeData = [ [ '全国', '全国' ], [ '一个省', '一个省' ], [ '一个市', '一个市' ] ];

// 单位
var unitData = [ [ '年', '年' ], [ '月', '月' ] ];

var priceCaseData = [ [ '无限制', '无限制' ], [ '一个月', '一个月' ] ];
$.fck.config = {
		path : '/resource/plugins/FCKeditor/',
		height : 300,
		width : 550,
		toolbar : 'MCZJTCN'
	};
Ext.onReady(function() {
	Ext.QuickTips.init();
	init();
});

function init() {

	buildForm();

	
}

function buildForm() {

	Ext.Ajax.request({
		url : '/mc/OrdersItemServlet.do',
		method : 'POST',
		params : {
			type :7,
			content:"name~"+name
		},
						success : function(response) {
							var jsondata = eval("(" + response.responseText
									+ ")");
							if (getState(jsondata.state, commonResultFunc,
									jsondata.result)) {
								var data = jsondata.result;
								var comboCkj = new Ext.form.ComboBox({
									id : 'comboCkj',
									store : rangeData,
									width : 180,
									valueField : "value",
									displayField : "text",
									mode : 'local',
									forceSelection : true,
									emptyText : '',
									editable : false,
									triggerAction : 'all',
									allowBlank : true,
									readOnly : true,
									fieldLabel : '造价通参考价'
								});

								var comboJyj = new Ext.form.ComboBox({
									id : 'comboJyj',
									store : rangeData,
									width : 180,
									valueField : "value",
									displayField : "text",
									mode : 'local',
									forceSelection : true,
									emptyText : '',
									editable : false,
									triggerAction : 'all',
									allowBlank : true,
									readOnly : true,
									fieldLabel : '建议价'
								});

								var comboMj = new Ext.form.ComboBox({
									id : 'comboMj',
									store : rangeData,
									width : 180,
									valueField : "value",
									displayField : "text",
									mode : 'local',
									forceSelection : true,
									emptyText : '',
									editable : false,
									triggerAction : 'all',
									allowBlank : true,
									readOnly : true,
									fieldLabel : '面价'
								});
								var comboPriceCase = new Ext.form.ComboBox({
									id : 'comboPriceCase',
									store : priceCaseData,
									width : 180,
									valueField : "value",
									displayField : "text",
									mode : 'local',
									forceSelection : true,
									emptyText : '',
									editable : false,
									triggerAction : 'all',
									allowBlank : true,
									readOnly : true,
									fieldLabel : '价格行情'
								});
								var comboFg = new Ext.form.ComboBox({
									id : 'comboFg',
									store : priceCaseData,
									width : 180,
									valueField : "value",
									displayField : "text",
									mode : 'local',
									forceSelection : true,
									emptyText : '',
									editable : false,
									triggerAction : 'all',
									allowBlank : true,
									readOnly : true,
									fieldLabel : '政策法规'
								});

								var comboUnit = new Ext.form.ComboBox({
									id : 'comboUnit',
									store : unitData,
									width : 100,
									valueField : "value",
									displayField : "text",
									mode : 'local',
									forceSelection : true,
									emptyText : '',
									editable : false,
									triggerAction : 'all',
									allowBlank : false,
									readOnly : true,
									fieldLabel : '单位'
								});

								sunshineForm = new Ext.form.FormPanel(
										{

											border : false,
											layout : 'table',
											layoutConfig : {
												columns : 1
											},
											width : 803,
											autoHeight : true,
											frame : true,
											buttonAlign : 'center',
											labelAlign : 'right',
											items : [
													new Ext.form.FieldSet(
															{
																columnWidth : .4,
																title : '套餐基本信息',
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
																				text : "套餐类型："
																			} ]
																		},
																		{
																			width : 180,
																			autoHeight : true,
																			bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:5px;",
																			items : [ {
																				xtype : "label",
																				fieldLabel : "套餐类型",
																				id : "itemType",
																				name : "itemType",
																				text : itemTypeRen(data.itemType)
																			} ]
																		},
																		{
																			width : 90,
																			bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
																			items : [ {
																				xtype : "label",
																				text : "套餐年份："
																			} ]
																		},
																		{
																			width : 180,
																			bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;",
																			items : [ {
																				xtype : "label",
																				fieldLabel : "套餐年份",
																				id : "year",
																				name : 'year',
																				text : data.year
																			} ]
																		},
																		{
																			width : 90,
																			bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
																			items : [ {
																				xtype : "label",
																				text : "套餐名称："
																			} ]
																		},
																		{
																			width : 180,
																			bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
																			items : [ {
																				xtype : "label",
																				fieldLabel : "套餐名称",
																				id : "name",
																				name : 'name',
																				text : data.name
																			} ]
																		},
																		
																		{
																			width : 90,
																			bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:8px;",
																			items : [ {
																				xtype : "label",
																				text : "价格(元)："
																			} ]
																		},
																		{
																			width : 180,
																			bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
																			items : [ {
																				xtype : "textfield",
																				fieldLabel : "价格(元)",
																				id : "price",
																				name : 'price',
																				value : data.price
																			} ]
																		},
																		{
																			width : 90,
																			bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:12px;",
																			items : [ {
																				xtype : "label",
																				text : "单位："
																			} ]
																		},
																		{
																			labelWidth : 180,
																			items : comboUnit
																		} ]
															}),
													{
														xtype : 'textfield',
														inputType : 'hidden',
														id : 'id',
														name : 'id'
													},
													{
														xtype : "fieldset",
														title : "套餐详细",
														width : 700,
														autoHeight : true,
														height : 280,
														layout : "table",
														layoutConfig : {
															columns : 2
														},
														items : [

																{
																	layout : 'form',
																	labelWidth : 100,
																	height : 26,
																	items : comboCkj
																},
																{
																	layout : 'form',
																	labelWidth : 100,
																	height : 26,
																	items : comboJyj
																},
																{
																	layout : 'form',
																	labelWidth : 100,
																	height : 26,
																	items : comboMj
																},

																{
																	layout : 'form',
																	labelWidth : 100,
																	items : {
																		id : 'askPriceCount',
																		name : 'askPriceCount',
																		fieldLabel : '在线询价数量',
																		xtype : "textfield",
																		allowBlank : false,
																		width : 180,
																		value : data.askPriceCount
																	}
																},
																{
																	layout : 'form',
																	labelWidth : 100,
																	items : {
																		id : 'userCount',
																		name : 'userCount',
																		fieldLabel : '用户数',
																		xtype : "textfield",
																		allowBlank : false,
																		width : 180,
																		value : data.userCount
																	}
																},
																{
																	layout : 'form',
																	labelWidth : 100,
																	height : 26,
																	items : comboPriceCase
																},
																{
																	layout : 'form',
																	labelWidth : 100,
																	height : 26,
																	items : comboFg,
																	value : data.fgRange
																} ]
													},
													{
														xtype : "fieldset",
														title : "服务描述",
														width : 700,
														autoHeight : true,
														layout : "column",
														layoutConfig : {
															columns : 2
														},
														items : [
																{
																	columnWidth : 1,
																	layout : 'form',
																	labelWidth : 100,
																	items : [ {
																		xtype : 'textarea',
																		id : 'introduction',
																		name : 'introduction',
																		fieldLabel : '服务介绍',
																		width : 550,
																		height : 150,
																		value : data.introduction
																	} ]
																} ]
													} ],
											buttons : [ {
												text : '确定',
												handler : updateOrdersItem
											} ]
										});

								var sunshineWin = new Ext.Panel({
									frame : true,
									layout : "table",
									width : true,
									autoHeight : true,
									renderTo : "purchaseForm",
									items : [ sunshineForm ]
								});

								Ext.get("comboUnit").dom.value = data.unit;
					
								Ext.get("comboCkj").dom.value = data.ckjRange;
								Ext.get("comboMj").dom.value = data.mjRange;
								Ext.get("comboJyj").dom.value = data.jyjRange;
								Ext.get("comboPriceCase").dom.value = data.priceCaseRange;
								Ext.get("comboFg").dom.value = data.fgRange;
								$('#introduction').fck();
							}
						}
					});
}

function itemTypeRen(t) {
	var stName = "";
	if (t == "1") {
		stName = "推广会员";
	} else if (t == "2") {
		stName = "A套餐";
	} else if (t == "3") {
		stName = "B套餐";
	} else if (t == "4") {
		stName = "C套餐";
	}
	return stName;

}

// 确定
function updateOrdersItem() {
	if (!sunshineForm.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}

	var price = Ext.get("price").getValue();
	var unit = Ext.get("comboUnit").getValue();
	var ckjRange = Ext.get("comboCkj").getValue();
	var jyjRange = Ext.get("comboJyj").getValue();
	var mjRange = Ext.get("comboMj").getValue();

	var askPriceCount = Ext.get("askPriceCount").getValue();
	var userCount = Ext.get("userCount").getValue();

	var priceCaseRange = Ext.get("comboPriceCase").getValue();
	var fgRange = Ext.get("comboFg").getValue();

	var introduction = $.fck.content('introduction', '');
	var contents = "price~" + price + ";unit~" + unit + ";ckjRange~" + ckjRange
			+ ";jyjRange~" + jyjRange + ";mjRange~" + mjRange
			+ ";askPriceCount~" + askPriceCount + ";userCount~" + userCount
			+ ";priceCaseRange~" + priceCaseRange + ";fgRange~" + fgRange;
	
	Ext.Ajax.request({
		url : '/mc/OrdersItemServlet.do',
		method : 'POST',
		params : {
			type : 8,
			content : contents,
			name : name,
			introduction:introduction
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "修改标准套餐成功", closeWin);
				parent.tab_standardOrdersItem_list_iframe.ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("standardOrdersItem_edit");
};
