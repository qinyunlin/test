var sunshineForm, guestUnitFieldSet;

var guestUnitId = 0;
var guestUnitNum = 0;
var province = "", city = "";

var orderGroupId = getCurArgs("orderGroupId");
var addFlag = false;
var comboDegree;

// 范围
var rangeData = [[ '1个省', '1个省' ],[ '2个省', '2个省' ],[ '3个省', '3个省' ],[ '4个省', '4个省' ],[ '5个省', '5个省' ],[ '6个省', '6个省' ],[ '7个省', '7个省' ],[ '8个省', '8个省' ],
                 [ '9个省', '9个省' ],[ '10个省', '10个省' ],[ '11个省', '11个省' ],[ '12个省', '12个省' ],[ '13个省', '13个省' ],[ '14个省', '14个省' ],[ '15个省', '15个省' ],[ '全国', '全国' ]];

// 单位
var unitData = [[ '1个月', '1个月' ], [ '3个月', '3个月' ], [ '6个月', '6个月' ], [ '12个月', '12个月' ]];

var priceCaseData = [ [ '无限制', '无限制' ], [ '一个月', '一个月' ] ];

var memberTypeData = [["1","普通会员"],["3","正式信息会员"],["8","云造价会员"]];

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
		emptyText : '12个月',
		value : '12个月',
		editable : false,
		triggerAction : 'all',
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
		value : '',
		editable : false,
		triggerAction : 'all',
		readOnly : true,
		fieldLabel : '查价区域'
	});
	
	comboDegree = new Ext.form.ComboBox({
		id : 'comboMemberType',
		store : memberTypeData,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		value : '',
		editable : false,
		triggerAction : 'all',
		readOnly : true,
		fieldLabel : '会员类型',
		listeners : {
			select : function(combo, record, index) {
				var degree = combo.getValue();//材价收藏数
				if(degree == "1"){
					rangeData = [[ '', '无查价区域' ]];
					Ext.getCmp("comboCkj").setValue("无查价区域");
					Ext.getCmp("comboCkj").setDisabled(true);
					Ext.getCmp("materialCount").setDisabled(true);
					Ext.getCmp("askPriceCount").setDisabled(true);
					Ext.getCmp("userCount").setDisabled(true);
					Ext.getCmp("setAuth").setVisible(false);
				}else if(degree == "3"){
					rangeData = [[ '1个省', '1个省' ]];
					Ext.getCmp("comboCkj").setValue("1个省");
					Ext.getCmp("comboCkj").setDisabled(true);
					Ext.getCmp("materialCount").setDisabled(true);
					Ext.getCmp("askPriceCount").setDisabled(true);
					Ext.getCmp("userCount").setDisabled(true);
					Ext.getCmp("setAuth").setVisible(false);
				}else{
					rangeData = [[ '1个省', '1个省' ],[ '2个省', '2个省' ],[ '3个省', '3个省' ],[ '4个省', '4个省' ],[ '5个省', '5个省' ],[ '6个省', '6个省' ],[ '7个省', '7个省' ],[ '8个省', '8个省' ],
				                 [ '9个省', '9个省' ],[ '10个省', '10个省' ],[ '11个省', '11个省' ],[ '12个省', '12个省' ],[ '13个省', '13个省' ],[ '14个省', '14个省' ],[ '15个省', '15个省' ],[ '全国', '全国' ]];
					Ext.getCmp("comboCkj").setValue("1个省");
					Ext.getCmp("materialCount1").setDisabled(true);
					Ext.getCmp("facCount").setDisabled(true);
					Ext.getCmp("setAuth").setVisible(true);
				}
				Ext.getCmp("comboCkj").store.loadData(rangeData);
				Ext.getCmp("comboCkj").enable();
			}
		}
	});

	/*var comboJyj = new Ext.form.ComboBox({
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
	});*/

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
						{
							xtype : 'textfield',
							inputType : 'hidden',
							id : 'id',
							name : 'id'
						},
						{
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
									items : comboDegree
								}, {
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
												listeners : {
													blur : function() {
														addFlag = false;
														var name = Ext.getCmp("name").getValue();
														if (name != null&& name != "") {
															Ext.Ajax.request({
																		url : '/mc/OrdersItemServlet.do',
																		method : 'POST',
																		params : {
																			type : 7,
																			content : "name~"
																					+ name
																					+ ";province~"
																					+ province
																					+ ";city~"
																					+ city
																					+ ";status~1"
																					+ ";pid~" + orderGroupId,
																		},
																		success : function(response) {
																			var json = eval("("+ response.responseText+ ")");
																			if (getState(json.state,commonResultFunc,json.result)) {
																				if (json.result) {
																					Ext.MessageBox.alert("提示","当前套餐组下已存在该套餐！请重新输入");
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
												fieldLabel : '价格(元)',
												xtype : "numberfield",
												allowBlank : false,
												width : 180,
												allowNegative : false,
												allowDecimals : false
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
							}, /*{
								layout : 'form',
								labelWidth : 100,
								height : 26,
								items : comboJyj
							}, {
								layout : 'form',
								labelWidth : 100,
								height : 26,
								items : comboMj
							}, {
								layout : 'form',
								labelWidth : 100,
								height : 26,
								items : comboPriceCase
							}, *//*{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'userCount',
									name : 'userCount',
									fieldLabel : '用户数',
									xtype : "textfield",
									allowBlank : false,
									width : 180,
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
							}*/{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'materialCount',
									name : 'materialCount',
									fieldLabel : '材价库流量',
									xtype : "numberfield",
									allowBlank : false,
									width : 180
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'materialCount1',
									name : 'materialCount1',
									fieldLabel : '材价收藏',
									xtype : "numberfield",
									allowBlank : false,
									width : 180
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'askPriceCount',
									name : 'askPriceCount',
									fieldLabel : '线下询价数',
									xtype : "numberfield",
									allowBlank : false,
									width : 180
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'facCount',
									name : 'facCount',
									fieldLabel : '供应商收藏',
									xtype : "numberfield",
									allowBlank : false,
									width : 180
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'userCount',
									name : 'userCount',
									fieldLabel : '账号数',
									xtype : "numberfield",
									allowBlank : false,
									width : 180,
									listeners : {
										blur : function() {
											var userCount = Ext.getCmp("userCount").getValue();//用户数
											if (!(userCount > 0)){
												Ext.MessageBox.alert("提示", "账号数只能填入数字且个数至少为1个！");
												Ext.getCmp("userCount").setValue("");
											}
										}
									}
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'score',
									name : 'score',
									fieldLabel : '赠送积分',
									xtype : "numberfield",
									allowBlank : false,
									width : 180
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'discountRate',
									name : 'discountRate',
									fieldLabel : '折扣率',
									xtype : "numberfield",
									allowBlank : false,
									allowDecimals : true, // 允许小数点
								    allowNegative : false, // 允许负数
									width : 180,
									unitText : '0<折扣率<=1'
								}
							}]
						}, {
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
												inputValue : "04"
											}]
								}
							]
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
	Ext.getCmp("setAuth").setVisible(false);
}

function save() {
	if (addFlag){
		Ext.MessageBox.alert("提示", "请不要进行重复添加！");
		return false;
	}
	var introduction;
	//fck的一个bug，若为空第一次提交提示结点找不到
	try{
		introduction = $.fck.content('introduction', '');
	}catch(e){
		save();
		return;
	}
	var degree = comboDegree.getValue();
	var name = Ext.get("name").getValue();// 套餐名称
	var price = Ext.get("price").getValue(); // 统一价格
	var unit = Ext.get("comboUnit").getValue();// 单位名称
	var ckjRange = Ext.get("comboCkj").getValue();// 查价区域
	if(!ckjRange || ckjRange == "无查价区域")
		ckjRange = "";
	
	/*var jyjRange = Ext.get("comboJyj").getValue();// 建议价
	var mjRange = Ext.get("comboMj").getValue();// 面价
	var userCount = Ext.getCmp("userCount").getValue();// 用户数量
	var priceCaseRange = Ext.getCmp("comboPriceCase").getValue();// 价格行情
	 */	
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
	if (degree == "" || name == "" || price == "" || unit == "" || materialCount == "" || score == ""){
		Ext.MessageBox.alert("提示", "请填写必要的内容。");
		return;
	}
	if(degree == "8" && codes == ""){
		Ext.MessageBox.alert("提示", "请选择权限设置。");
		return;
	}
	var contents = "name~" + name + ";price~" + price + ";unit~" + unit
			+ ";ckjRange~" + ckjRange + ";jyjRange~" + ";mjRange~" + ";priceCaseRange~"
			+ ";materialCount~" + materialCount + ";facCount~" + facCount+";degree~"+degree
			+ ";askPriceCount~"+askPriceCount+";userCount~"+userCount+";score~"+score+";discountRate~"+discountRate;
	Ext.Ajax.request({
		url : '/ordersitem/group/OrderGroupServlet.do',
		method : 'POST',
		params : {
			type : 8,
			content : contents,
			introduction : introduction,
			orderGroupId : orderGroupId,
			codes : codes
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				//Ext.MessageBox.alert("提示", "套餐添加成功！", closeWin);
				Ext.MessageBox.show({
					title : '提示',
					msg : "<center>成功添加套餐！</center>",
					width : 250,
					prompt : false,
					buttons : {
						"ok" : "继续添加",
						"cancel" : "返回套餐列表"
					},
					multiline : false,
					fn : function(
							btn,
							text) {
						if ("ok" == btn){
							location.reload();
						}else{
							addFlag = true;
							parent.tab_orderGroup_OrdersItem_list_iframe.ds_info.reload();
							closeWin();
						}
					}
				});
			
			}
		},
		failure : function() {
			addFlag = false;
			Warn_Tip();
		}
	});

}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("orderGroup_OrdersItem_add");
};
