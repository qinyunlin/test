var sunshineForm, guestUnitFieldSet;

var comboProvinces, comboCities;

var guestUnitId = 0;
var guestUnitNum = 0;

var zhcn = new Zhcn_Select();
var proStore = zhcn.getProvince(true);
var city = [];
// 套餐类型
var ordersTypeData = [ [ '', '所有' ], [ '1', '推广会员' ], [ '2', 'A套餐' ],
		[ '3', 'B套餐' ], [ '4', 'C套餐' ] ];

// 年份
var yearData = [ [ '', '所有' ], [ '2012', '2012' ], [ '2013', '2013' ],
		[ '2014', '2014' ], [ '2015', '2015' ], [ '2016', '2016' ],
		[ '2017', '2017' ], [ '2018', '2018' ] ];
// 范围
var rangeData = [ [ '全国', '全国' ], [ '一个省', '一个省' ] ];

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
	init();
});

function init() {

	buildForm();
	$('#introduction').fck();
}

function buildForm() {
	var defaultProvince = proStore[0];
	var defaultCity = zhcn.getCity(defaultProvince);
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	var city = [];
	var area = [];
	var comboProvinces = new Ext.form.ComboBox({
		id : 'comboProvinces',
		store : pro,
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
		fieldLabel : '省',
		listeners : {
			select : function(combo, record, index) {
				comboCities.reset();
				var province = combo.getValue();
				city = zhcn.getCity(province);
				comboCities.store.loadData(city);
				comboCities.enable();

			}
		}

	});

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
		emptyText : '请选择',
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
		emptyText : '请选择',
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
		emptyText : '请选择',
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
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '政策法规'
	});

	var comboCities = new Ext.form.ComboBox({
		id : 'comboCities',
		store : city,
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
		name : 'city',
		fieldLabel : '市'

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
		fieldLabel : '套餐年份',
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
				items : [ {
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboOrdersTypes
				}, {
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboYears
				}, {
					layout : 'form',
					labelWidth : 98,
					height : 26,
					items : {
						id : 'name',
						name : 'name',
						fieldLabel : '套餐名称',
						xtype : "textfield",
						width : 180,
						allowBlank : false
					}
				}, {
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboProvinces
				}, {
					layout : 'form',
					labelWidth : 100,
					height : 26,
					items : comboCities
				}, {
					layout : 'form',
					labelWidth : 100,
					items : {
						id : 'price',
						name : 'price',
						fieldLabel : '价格(元)',
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
			title : "服务描述",
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
					fieldLabel : '服务介绍',
					width : 500,
					height : 80
				} ]
			} ]
		} ],
		buttons : [ {
			text : '确定',
			handler : addOrdersItem
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

// 确定
function addOrdersItem() {
	if (!sunshineForm.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}
	var itemType = Ext.getCmp("comboOrdersTypes").getValue();
	var price = Ext.get("price").getValue();
	var year = Ext.get("comboYears").getValue();
	var name = Ext.get("name").getValue();
	var province = Ext.getCmp("comboProvinces").getValue();
	var city = Ext.getCmp("comboCities").getValue();
	var unit = Ext.getCmp("comboUnit").getValue();

	var ckjRange = Ext.getCmp("comboCkj").getValue();
	var jyjRange = Ext.getCmp("comboJyj").getValue();
	var mjRange = Ext.getCmp("comboMj").getValue();

	var askPriceCount = Ext.getCmp("askPriceCount").getValue();
	var userCount = Ext.getCmp("userCount").getValue();

	var priceCaseRange = Ext.getCmp("comboPriceCase").getValue();
	var fgRange = Ext.getCmp("comboFg").getValue();

	var introduction = $.fck.content('introduction', '');

	var contents = "itemType~" + itemType + ";price~" + price + ";year~" + year
			+ ";name~" + name + ";province~" + province + ";city~" + city
			+ ";unit~" + unit + ";ckjRange~" + ckjRange + ";jyjRange~"
			+ jyjRange + ";mjRange~" + mjRange + ";askPriceCount~"
			+ askPriceCount + ";userCount~" + userCount + ";priceCaseRange~"
			+ priceCaseRange + ";fgRange~" + fgRange;
	Ext.Ajax.request({
		url : '/mc/OrdersItemServlet.do',
		method : 'POST',
		params : {
			type : 3,
			content : contents,
			standardOrders : 2,
			introduction : introduction
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				if(json.result == "exists"){
					Ext.MessageBox.alert("提示", "套餐名称已经存在，请重新输入。");
				}else{
					Ext.MessageBox.alert("提示", "添加成功", closeWin);
					parent.tab_0209_iframe.ds_info.reload();
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("ordersItem_add");
};
