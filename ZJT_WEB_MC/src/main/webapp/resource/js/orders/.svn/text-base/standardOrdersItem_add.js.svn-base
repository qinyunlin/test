var sunshineForm, guestUnitFieldSet;


var guestUnitId = 0;
var guestUnitNum = 0;
var province="",city="";

//套餐类型
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
	height : 500,
	width : 750,
	toolbar : 'MCZJTCN'
};

// 设置可选范围
var stuffStore = new Ext.data.ArrayStore({
	data : stuff_code_shop,// 引用stuff_code.js
	fields : [ 'value', 'text' ]
});

var selectedStuffStore = new Ext.data.ArrayStore({
	data : [],// 引用stuff_code.js
	fields : [ 'value', 'text' ]
});

Ext.onReady(function() {
	Ext.QuickTips.init();
	init();
});

function init() {
	buildForm();
	$('#introduction').fck();
	$('#purchaseDetail').fck();
	$('#supplierRequirement').fck();
	$('#purchaserRequirement').fck();
}

function buildForm() {

	var comboUnit = new Ext.form.ComboBox({
		id : 'comboUnit',
		store : unitData,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		readOnly : true,
		fieldLabel : '单位'
	});

	var comboCkj = new Ext.form.ComboBox({
		id : 'comboCkj',
		store : rangeData,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
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
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
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
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
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
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
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
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		readOnly : true,
		fieldLabel : '政策法规'
	});

	
	var comboOrdersTypes = new Ext.form.ComboBox({
		id : 'comboOrdersTypes',
		store : ordersTypeData,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		hiddenName : 'region',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		readOnly : true,
		fieldLabel : '套餐类型',
		name : 'comboOrdersTypes'
	});
	var comboYears = new Ext.form.ComboBox({
		id : 'comboYears',
		store : yearData,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		hiddenName : 'region',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		readOnly : true,
		fieldLabel : '套餐年份（年）',
		name : 'comboYear'
	});

	sunshineForm = new Ext.form.FormPanel({

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
		items : [ {
			xtype : 'textfield',
			inputType : 'hidden',
			id : 'id',
			name : 'id'
		}, {
			layout : 'table',
			layoutConfig : {
				columns : 3
			},
			items : [ {
				xtype : "fieldset",
				title : "套餐基本信息",
				width : 700,
				autoHeight : true,
				height : 280,
				layout : "table",
				layoutConfig : {
					columns : 2
				},
				items : [{
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboOrdersTypes
				}, {
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboYears
				},{
					layout : 'form',
					labelWidth : 98,
					height : 26,
					items : {
						id : 'name',
						name : 'name',
						fieldLabel : '套餐名称',
						xtype : "textfield",
						allowBlank : false,
						width : 180,
						listeners :{
							blur:function() {
							var name=Ext.getCmp("name").getValue();
							if(name !=null && name !=""){
								Ext.Ajax.request({
									url : '/mc/OrdersItemServlet.do',
									method : 'POST',
									params : {
										type :7,
										content:"name~"+name+";province~"+province+";city~"+city+";status~1",
									},
									success : function(response) {
										var json = eval("(" + response.responseText + ")");
										if (getState(json.state, commonResultFunc, json.result)) {
											if(json.result){
											  Ext.MessageBox.alert("提示", "该套餐已存在！请重新输入");
											  Ext.getCmp("name").setValue("");
											}
											 
										}
									},
									failure : function() {
										Warn_Tip();
									}
								});
							}
							
							
							}
						}
					}
				}, {
					layout : 'form',
					labelWidth : 100,
					items : {
						id : 'price',
						name : 'price',
						fieldLabel : '统一价格(元)',
						xtype : "textfield",
						allowBlank : false,
						width : 180
					}
				}, {
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboUnit
				} ]
			} ]
		}, {
			xtype : "fieldset",
			title : "套餐详细模块",
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
			}, {
				layout : 'form',
				labelWidth : 100,
				height : 26,
				items : comboJyj
			}, {
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
					width : 180
				}
			}, {
				layout : 'form',
				labelWidth : 100,
				items : {
					id : 'userCount',
					name : 'userCount',
					fieldLabel : '用户数',
					xtype : "textfield",
					allowBlank : false,
					width : 180
				}
			}, {
				layout : 'form',
				labelWidth : 100,
				height : 26,
				items : comboPriceCase
			}, {
				layout : 'form',
				labelWidth : 100,
				height : 26,
				items : comboFg
			} ]
		}, {
			xtype : "fieldset",
			title : "服务介绍",
			width : 700,
			autoHeight : true,
			layout : "column",
			layoutConfig : {
				columns : 2
			},
			items : [ {
				columnWidth : 1,
				layout : 'form',
				labelWidth : 100,
				items : [ {
					xtype : 'textarea',
					id : 'introduction',
					fieldLabel : '服务简介',
					width : 550,
					height : 100
				} ]
			} ]
		} ],
		buttons : [ {
			text : '确定',
			hidden : compareAuth('PROJ_MOD'),
			handler : save
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
}

function save() {

	if (!sunshineForm.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}

	
	var  year= Ext.getCmp("comboYears").getValue();// 套餐年份
	var itemType = Ext.getCmp("comboOrdersTypes").getValue();// 套餐类型
	var name = Ext.getCmp("name").getValue();// 套餐名称
	var price = Ext.getCmp("price").getValue(); // 统一价格
	var comboUnit = Ext.getCmp("comboUnit").getValue();// 单位名称
	var ckjRange = Ext.get("comboCkj").getValue();// 参考价
	var jyjRange = Ext.get("comboJyj").getValue();// 建议价
	var mjRange = Ext.get("comboMj").getValue();// 面价
	var askPriceCount = Ext.getCmp("askPriceCount").getValue();// 在线询价数量
	var userCount = Ext.getCmp("userCount").getValue();// 用户数量
	var priceCaseRange = Ext.getCmp("comboPriceCase").getValue();// 价格行情
	var fgRange = Ext.getCmp("comboFg").getValue();// 政策法规
	var introduction = $.fck.content('introduction', '');// 服务简介
	var contents = "name~" + name + ";price~" + price + ";unit~" + comboUnit
			+ ";ckjRange~" + ckjRange + ";jyjRange~" + jyjRange
			+ ";mjRange~" + mjRange + ";askPriceCount~" + askPriceCount + ";userCount~"
			+ userCount + ";priceCaseRange~" + priceCaseRange + ";fgRange~" + fgRange
			+";itemType~"+itemType+";year~"+year;
	
	
	Ext.Ajax.request({
		url : '/mc/OrdersItemServlet.do',
		method : 'POST',
		params : {
			type : 3,
			standardOrders:1,
			content : contents,
			introduction:introduction
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "添加标准套餐成功", closeWin);
				parent.tab_standardOrdersItem_list_iframe.ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("standardOrdersItem_add");
};
