var sunshineForm, guestUnitFieldSet, degree;

var comboProvinces, comboCities;

var guestUnitId = 0;
var guestUnitNum = 0;

var city = [];

var name = getCurArgs("name");
var ordersItemId = getCurArgs("ordersItemId");
var updateFlag = false;

//范围
var rangeData;

//单位
var unitData = [ [ '1个月', '1个月' ], [ '3个月', '3个月' ], [ '6个月', '6个月' ], [ '12个月', '12个月' ] ];

var priceCaseData = [ [ '无限制', '无限制' ], [ '一个月', '一个月' ] ];

var memberTypeData = [["1","普通会员"],["3","正式信息会员"],["8","云造价会员"]];
$.fck.config = {
	path : '/resource/plugins/FCKeditor/',
	height : 300,
	width : 550,
	toolbar : 'MCZJTCN'
};
Ext.override(Ext.form.TextField, {   
    unitText : '',   
    onRender : function(ct, position) {   
  Ext.form.TextField.superclass.onRender.call(this, ct, position);   
      // 如果单位字符串已定义 则在后方增加单位对象   
  if (this.unitText != '') {   
    this.unitEl = ct.createChild({   
      tag : 'div',   
      html : this.unitText   
   });   
    this.unitEl.addClass('x-form-unit');   
        // 增加单位名称的同时 按单位名称大小减少文本框的长度 初步考虑了中英文混排 未考虑为负的情况   
    this.width = this.width - (this.unitText.replace(/[^\x00-\xff]/g, "xx").length * 6 + 2);   
        // 同时修改错误提示图标的位置   
    this.alignErrorIcon = function() {   
    this.errorIcon.alignTo(this.unitEl, 'tl-tr', [2, 0]);   
    };   
  }   
    }   
});
Ext.onReady(function() {
	Ext.QuickTips.init();
	init();
});

function init() {

	buildForm();

}

function buildForm() {

	Ext.Ajax
			.request({
				url : '/ordersitem/group/OrderGroupServlet.do',
				method : 'POST',
				params : {
					type : 7,
					ordersItemId : ordersItemId
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,jsondata.result)) {
						var data = jsondata.result;
						var codes = ";" + data.codes + ";";
						degree = data.degree;
						if(degree == "1")
							rangeData = [[ '', '无查价区域' ]];
						else if(degree == "3")
							rangeData = [[ '1个省', '1个省' ]];
						else
							rangeData = [[ '1个省', '1个省' ],[ '2个省', '2个省' ],[ '3个省', '3个省' ],[ '4个省', '4个省' ],[ '5个省', '5个省' ],[ '6个省', '6个省' ],[ '7个省', '7个省' ],[ '8个省', '8个省' ],
						                 [ '9个省', '9个省' ],[ '10个省', '10个省' ],[ '11个省', '11个省' ],[ '12个省', '12个省' ],[ '13个省', '13个省' ],[ '14个省', '14个省' ],[ '15个省', '15个省' ],[ '全国', '全国' ]];
						var comboCkj = new Ext.form.ComboBox({
							id : 'comboCkj',
							store : rangeData,
							width : 100,
							valueField : "value",
							displayField : "text",
							mode : 'local',
							forceSelection : true,
							emptyText : '请选择',
							value : '',
							editable : false,
							triggerAction : 'all',
							allowBlank : true,
							readOnly : true,
							fieldLabel : '查价区域'
						});

						/*var comboJyj = new Ext.form.ComboBox({
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
						});*/

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
																	bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
																	items : [ {
																		xtype : "label",
																		text : "会员类型："
																	} ]
																},
																{
																	width : 180,
																	bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
																	items : [ {
																		xtype : "label",
																		text : getDegreeName(data.degree)
																	} ]
																},{
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
																		xtype : "numberfield",
																		id : "price",
																		name : 'price',
																		value : data.price,
																		allowBlank : false,
																		allowNegative : false,
																		allowDecimals : false
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
													columns : 4
												},
												items : [
												{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:12px;",
													items : [ {
														xtype : "label",
														text : "查价区域："
													} ]
												},
												{
													labelWidth : 180,
													items : comboCkj
												},/*{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:12px;",
													items : [ {
														xtype : "label",
														text : "建议价："
													} ]
												},
												{
													labelWidth : 180,
													items : comboJyj
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:12px;",
													items : [ {
														xtype : "label",
														text : "面价："
													} ]
												},
												{
													labelWidth : 180,
													items : comboMj
												},*//*{
													layout : 'form',
													labelWidth : 100,
													items : {
														id : 'userCount',
														name : 'userCount',
														fieldLabel : '用户数',
														xtype : "textfield",
														allowBlank : false,
														width : 180,
														value : data.userCount,
														listeners : {
															blur : function() {
																var userCount = Ext.getCmp("userCount").getValue();//用户数
																if (!(userCount > 0)){
																	Ext.MessageBox.alert("提示", "用户数只能填入数字且个数至少为1个！");
																	Ext
																	.getCmp(
																			"userCount")
																	.setValue(
																			"");
																}
															}
														}
													}
												},*/ 
												/*{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:12px;",
													items : [ {
														xtype : "label",
														text : "价格行情："
													} ]
												},
												{
													labelWidth : 180,
													items : comboPriceCase
												},*/{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "材价库流量："
													} ]
												},
												{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "materialCount",
														name : 'materialCount',
														value : data.materialCount,
														allowBlank : false
													} ]
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "材价收藏："
													} ]
												},
												{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "materialCount1",
														name : 'materialCount1',
														value : data.materialCount,
														allowBlank : false
													} ]
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "线下询价数："
													} ]
												},
												{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "askPriceCount",
														name : 'askPriceCount',
														value : data.askPriceCount,
														allowBlank : false
													} ]
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "供应商收藏："
													} ]
												},{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "facCount",
														name : 'facCount',
														value : data.facCount,
														allowBlank : false
													} ]
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "账号数："
													} ]
												},{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "userCount",
														name : 'userCount',
														value : data.userCount,
														allowBlank : false,
														listeners : {
															blur : function() {
																var userCount = Ext.getCmp("userCount").getValue();//用户数
																if (!(userCount > 0)){
																	Ext.MessageBox.alert("提示", "账号数只能填入数字且个数至少为1个！");
																	Ext.getCmp("userCount").setValue("");
																}
															}
														}
													} ]
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "赠送积分："
													} ]
												},{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "score",
														name : 'score',
														value : data.score,
														allowBlank : false
													} ]
												},{
													width : 90,
													bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:3px;",
													items : [ {
														xtype : "label",
														text : "折扣率："
													} ]
												},{
													width : 180,
													bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:3px;",
													items : [ {
														xtype : "numberfield",
														id : "discountRate",
														name : 'discountRate',
														value : data.discountRate,
														allowBlank : false,
														allowDecimals : true, // 允许小数点
													    allowNegative : false, // 允许负数
														unitText : '<br />0<折扣率<=1'
													} ]
												}]
											},{
												xtype : "fieldset",
												id : "setAuth",
												title : "权限设置",
												width : 700,
												autoHeight : true,
												height : 280,
												layout : "table",
												layoutConfig : {
													columns : 1
												},
												bodyStyle : 'padding-left:30px;',
												items : [
													{
														autoHeight : true,
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "材价库",
																	id : "code_01",
																	inputValue : "01",
																	checked : codes.indexOf(";01;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked)
																				$("input[name=code_01]").attr("checked",true);
																			else
																				$("input[name=code_01]").attr("checked",false);
																		}
																	}
																}]
													},{
														autoHeight : true,
														layout : 'table',
														layoutConfig : {
															columns : 9
														},
														bodyStyle : "padding:10px 10px 10px 15px; border:2px solid #ADADAD;width:500px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "上传材价",
																	id : "code_0101",
																	name : "code_01",
																	inputValue : "0101",
																	checked : codes.indexOf(";0101;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_01").attr("checked"))
																				$("#code_01").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "导出材价",
																	id : "code_0102",
																	name : "code_01",
																	inputValue : "0102",
																	checked : codes.indexOf(";0102;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_01").attr("checked"))
																				$("#code_01").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "更新材价",
																	id : "code_0103",
																	name : "code_01",
																	inputValue : "0103",
																	checked : codes.indexOf(";0103;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_01").attr("checked"))
																				$("#code_01").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "修改材价",
																	id : "code_0104",
																	name : "code_01",
																	inputValue : "0104",
																	checked : codes.indexOf(";0104;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_01").attr("checked"))
																				$("#code_01").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "删除材价",
																	id : "code_0105",
																	name : "code_01",
																	inputValue : "0105",
																	checked : codes.indexOf(";0105;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_01").attr("checked"))
																				$("#code_01").attr("checked",true);
																		}
																	}
																}]
													},{
														autoHeight : true,
														bodyStyle : "margin-top:15px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "供应商库",
																	id : "code_02",
																	inputValue : "02",
																	checked : codes.indexOf(";02;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked)
																				$("input[name=code_02]").attr("checked",true);
																			else
																				$("input[name=code_02]").attr("checked",false);
																		}
																	}
																}]
													},{
														autoHeight : true,
														layout : 'table',
														layoutConfig : {
															columns : 9
														},
														bodyStyle : "padding:10px 10px 10px 15px; border:2px solid #ADADAD;width:500px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "上传供应商",
																	id : "code_0201",
																	name : "code_02",
																	inputValue : "0201",
																	checked : codes.indexOf(";0201;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_02").attr("checked"))
																				$("#code_02").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "导出供应商",
																	id : "code_0202",
																	name : "code_02",
																	inputValue : "0202",
																	checked : codes.indexOf(";0202;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_02").attr("checked"))
																				$("#code_02").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "转移分类",
																	id : "code_0203",
																	name : "code_02",
																	inputValue : "0203",
																	checked : codes.indexOf(";0203;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_02").attr("checked"))
																				$("#code_02").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "删除供应商",
																	id : "code_0204",
																	name : "code_02",
																	inputValue : "0204",
																	checked : codes.indexOf(";0204;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_02").attr("checked"))
																				$("#code_02").attr("checked",true);
																		}
																	}
																},{
																	border : false,
																	width : 30,
																	html : "&nbsp;"
																},{
																	xtype : 'checkbox',
																	boxLabel : "自定义分组",
																	id : "code_0205",
																	name : "code_02",
																	inputValue : "0205",
																	checked : codes.indexOf(";0205;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_02").attr("checked"))
																				$("#code_02").attr("checked",true);
																		}
																	}
																}]
													},{
														autoHeight : true,
														bodyStyle : "margin-top:15px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "在线询价",
																	id : "code_03",
																	inputValue : "03",
																	checked : codes.indexOf(";03;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked)
																				$("input[name=code_03]").attr("checked",true);
																			else
																				$("input[name=code_03]").attr("checked",false);
																		}
																	}
																}]
													},{
														autoHeight : true,
														layout : 'table',
														layoutConfig : {
															columns : 1
														},
														bodyStyle : "padding:10px 10px 10px 15px; border:2px solid #ADADAD;width:500px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "批量询价",
																	id : "code_0301",
																	name : "code_03",
																	inputValue : "0301",
																	checked : codes.indexOf(";0301;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_03").attr("checked"))
																				$("#code_03").attr("checked",true);
																		}
																	}
																}]
													},{
														autoHeight : true,
														bodyStyle : "margin-top:15px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "企业文库",
																	id : "code_05",
																	inputValue : "05",
																	checked : codes.indexOf(";05;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked)
																				$("input[name=code_05]").attr("checked",true);
																			else
																				$("input[name=code_05]").attr("checked",false);
																		}
																	}
																}]
													},{
														autoHeight : true,
														layout : 'table',
														layoutConfig : {
															columns : 1
														},
														bodyStyle : "padding:10px 10px 10px 15px; border:2px solid #ADADAD;width:500px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "下载文档",
																	id : "code_0501",
																	name : "code_05",
																	inputValue : "0501",
																	checked : codes.indexOf(";0501;") != -1 ? true : false,
																	listeners : {
																		check : function(el, checked){
																			if(checked && !$("#code_05").attr("checked"))
																				$("#code_05").attr("checked",true);
																		}
																	}
																}]
													},{
														autoHeight : true,
														bodyStyle : "margin-top:15px;",
														items : [{
																	xtype : 'checkbox',
																	boxLabel : "成员管理",
																	id : "code_04",
																	inputValue : "04",
																	checked : codes.indexOf(";04;") != -1 ? true : false
														}]
													}
												]
											},
											{
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
														name : 'introduction',
														fieldLabel : '服务简介',
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
						if(data.ckjRange == null || data.ckjRange == "")
							Ext.get("comboCkj").dom.value = "无查价区域";
						else
							Ext.get("comboCkj").dom.value = data.ckjRange;
						if(degree == "1"){
							Ext.getCmp("materialCount").setDisabled(true);
							Ext.getCmp("materialCount").setValue("");
							Ext.getCmp("askPriceCount").setDisabled(true);
							Ext.getCmp("askPriceCount").setValue("");
							Ext.getCmp("userCount").setDisabled(true);
							Ext.getCmp("userCount").setValue("");
							Ext.getCmp("setAuth").setVisible(false);
						}else if(degree == "3"){
							Ext.getCmp("comboCkj").setValue("1个省");
							Ext.getCmp("materialCount").setDisabled(true);
							Ext.getCmp("materialCount").setValue("");
							Ext.getCmp("askPriceCount").setDisabled(true);
							Ext.getCmp("askPriceCount").setValue("");
							Ext.getCmp("userCount").setDisabled(true);
							Ext.getCmp("userCount").setValue("");
							Ext.getCmp("setAuth").setVisible(false);
						}else{
							Ext.getCmp("materialCount1").setDisabled(true);
							Ext.getCmp("materialCount1").setValue("");
							Ext.getCmp("facCount").setDisabled(true);
							Ext.getCmp("facCount").setValue("");
							Ext.getCmp("setAuth").setVisible(true);
						}
						/*Ext.get("comboMj").dom.value = data.mjRange;
						Ext.get("comboJyj").dom.value = data.jyjRange;
						Ext.get("comboPriceCase").dom.value = data.priceCaseRange;*/
						// Ext.get("comboFg").dom.value = data.fgRange;
						$('#introduction').fck();
					}
				}
			});
}

// 确定
function updateOrdersItem() {
	var introduction;
	//fck的一个bug，若为空第一次提交提示结点找不到
	try{
		introduction = $.fck.content('introduction', '');
	}catch(e){
		updateOrdersItem();
		return;
	}
	var price = Ext.get("price").getValue();
	var unit = Ext.get("comboUnit").getValue();
	var ckjRange = Ext.get("comboCkj").getValue();
	if(!ckjRange || ckjRange == "无查价区域")
		ckjRange = "";
	var materialCount;
	if(degree == 1 || degree == 3)
		materialCount = Ext.get("materialCount1").getValue();// 材价收藏数
	else
		materialCount = Ext.get("materialCount").getValue();
	var askPriceCount = Ext.get("askPriceCount").getValue();//线下询价数
	if(!askPriceCount)
		askPriceCount = 0;
	var userCount = Ext.get("userCount").getValue();//账号数
	if(!userCount || parseInt(userCount) <= 0)
		userCount = 1;
	var facCount = Ext.get("facCount").getValue();// 供应商收藏数
	if(!facCount)
		facCount = 0;
	var score = Ext.get("score").getValue();//赠送积分
	var discountRate = Ext.get("discountRate").getValue();//折扣率
	discountRate = parseFloat(discountRate);
	if(discountRate == "" || discountRate == 0 || discountRate > 1){
		Ext.MessageBox.alert("提示", "折扣率必须大于0小于等于1。");
		return;
	}
	var codes = "";
	Ext.select("input[name=code_01]").each(function(el) {
		if (Ext.getDom(el).checked)
			codes += el.getValue() + ";";
	});
	Ext.select("input[name=code_02]").each(function(el) {
		if (Ext.getDom(el).checked)
			codes += el.getValue() + ";";
	});
	Ext.select("input[name=code_03]").each(function(el) {
		if (Ext.getDom(el).checked)
			codes += el.getValue() + ";";
	});
	if(Ext.get("code_04").dom.checked)
		codes += "04;";
	Ext.select("input[name=code_05]").each(function(el) {
		if (Ext.getDom(el).checked)
			codes += el.getValue() + ";";
	});
	codes = codes.substring(0,codes.lastIndexOf(";"));
	if (price == "" || unit == "" || materialCount == "" || score == ""){
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}
	if(degree == "8" && codes == ""){
		Ext.MessageBox.alert("提示", "请选择权限设置。");
		return;
	}
	var contents = "price~" + price + ";unit~" + unit
			+ ";ckjRange~" + ckjRange+";materialCount~"+materialCount
			+ ";askPriceCount~"+askPriceCount+";userCount~"+userCount
			+ ";facCount~"+facCount+";score~"+score+";discountRate~"+discountRate;
	Ext.Ajax.request({
		url : '/ordersitem/group/OrderGroupServlet.do',
		method : 'POST',
		params : {
			type : 9,
			content : contents,
			ordersItemId : ordersItemId,
			introduction : introduction,
			codes : codes
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "套餐修改成功！", closeWin);
				parent.tab_orderGroup_OrdersItem_list_iframe.ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

function closeWin() {
	updateFlag = true;
	window.parent.Ext.getCmp('center').remove("orderGroup_OrdersItem_edit");
};
function getDegreeName(degree){
	var degreeName = "";
	for(var i = 0; i < memberTypeData.length; i++){
		if(memberTypeData[i][0] == degree){
			degreeName = memberTypeData[i][1];
			break;
		}
	}
	return degreeName;
}
