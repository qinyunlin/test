Ext.onReady(init);
var fieldset,panel,info_panel,item_panel,detail_panel,detail_fieldset,panel2;
var emp_type;
var id;
var vipEpAccount = null;

function init() {
	eid = getCurArgs("eid");
	Ext.QuickTips.init();
	buildForm();
	buildVipForm();
};

var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];
var enType = [["2", "政府机构"], ["3", "造价咨询"],
        		["4", "施工单位"], ["5", "业主单位"], ["6", "设计单位"], ["7", "其它单位"]];

function buildForm() {
	Ext.lib.Ajax
			.request(
					"post",
					"/ep/EnterpriseServlet?type=27",
					{
						success : function(response) {
							var jsondata = eval("(" + response.responseText
									+ ")");
							if (getState(jsondata.state, commonResultFunc,
									jsondata.result)) {
								var enterprise = jsondata.result;
								id = enterprise["id"];
									panel = new Ext.form.FormPanel({
									layout : "table",
									width:700,
									bodyStyle : "margin-left:50px;border:none;",
									layoutConfig : {
										columns : 4
									},
									items : [{
										width : 90,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
										items : [{
													xtype : "label",
													text : "企业ID："
												}]
									}, {
										width : 160,
										colspan:3,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [{
													xtype : "label",
													text : enterprise["eid"]
												}]
									}, {
										width : 90,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
										items : [{
													xtype : "label",
													text : "企业名称："
												}]
									}, {
										colspan : 3,
										width : 200,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [{
											xtype : "textfield",
											fieldLabel : "企业名称：",
											width:200,
											maxLength : 50,
											allowBlank : false,
											id : "name",
											value : enterprise["name"]
										}]
									},/* {
										width : 90,
										autoHeight : true,
										bodyStyle:"text-align:right;font-size:12px;",
										items : [{
													xtype : "label",
													text : "企业简称："
												}]
									}, {
										width : 200,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [{
											xtype : "textfield",
											fieldLabel : "企业简称：",
											width:200,
											maxLength : 50,
											allowBlank : false,
											id : "fname",
											value : enterprise["fname"]
										}]
									},*/ {
										width : 90,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
										items : [{
													xtype : "label",
													text : "公司注册地："
												}]
									}, {
										id : "item_select",
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : new Ext.Panel({
											border : false,
											layout:'column',
											layoutConfig : {
												columns : 2
											},
											items : [{
												xtype : 'combo',
												id : 'province',
												store : pro,
												triggerAction : 'all',
												emptyText : '请选择省',
												readOnly : true,
												width : 90,
												value:enterprise["province"],
												listeners : {
													select : function(combo, record, index) {
														var province = combo.getValue();
														if (province == "全部省份") {
															city = [ "全部城市" ];
														} else {
															city = zhcn.getCity(province).concat();
															city.unshift("全部城市");
														}

														Ext.getCmp('city').store.loadData(city);
														Ext.getCmp('city').setValue("全部城市");
														Ext.getCmp('city').enable();
													}
												}
											},{
												xtype : 'combo',
												id : 'city',
												store : city,
												triggerAction : 'all',
												emptyText : '请选择城市',
												readOnly : true,
												width : 90,
												//disabled : true,
												value:enterprise["city"]
											}]
										})
									},{
										width : 90,
										autoHeight : true,
										bodyStyle:"text-align:right;font-size:12px;",
										items : [{
													xtype : "label",
													text : "公司地址："
												}]
									}, {
										width : 200,
										autoHeight : true,
										bodyStyle:"text-align:left;font-size:12px;",
										items : [{
											xtype : "textfield",
											fieldLabel : "公司地址：",
											maxLength : 50,
											width:250,
											allowBlank : false,
											id : "addr",
											value : enterprise["addr"]
										}]
									}, {
										width : 90,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
										items : [{
													xtype : "label",
													text : "公司类型："
												}]
									}, {
										width : 160,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [emp_type = new Ext.form.ComboBox({
											id:"type",
											xtype : 'combo',
											store : enType,
											triggerAction : 'all',
											emptyText : '请选择企业类型',
											readOnly : true,
											width : 120,
											//disabled : true,
											value : enterprise["type"]
										})]
									},{
										width : 100,
										autoHeight : true,
										bodyStyle:"text-align:right;font-size:12px;",
										items : [{
													xtype : "label",
													text : "联系人："
												}]
									}, {
										width : 200,
										autoHeight : true,
										bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [{
											xtype : "textfield",
											fieldLabel : "联系人：",
											maxLength : 50,
											allowBlank : false,
											id : "contact",
											value : enterprise["contact"]
										}]
									}, {
										width : 100,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
										items : [{
													xtype : "label",
													text : "联系方式："
												}]
									}, {
										width : 200,
										autoHeight : true,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [{
											xtype : "textfield",
											fieldLabel : "联系方式：",
											maxLength : 50,
											width:200,
											allowBlank : false,
											id : "mobile",
											value : enterprise["mobile"] + "   " + enterprise["phone"]
										}]
									},
									{
										width : 90,
										height : 28,
										bodyStyle:"text-align:right;font-size:12px;",
										items : [{
													xtype : "label",
													text : "传真号码："
												}]
									}, {
										width : 200,
										height : 28,
										bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
										items : [{
													xtype : "textfield",
													fieldLabel : "传真号码：",
													maxLength : 13,
													//allowBlank : false,
													id : "fax",
													value : enterprise["fax"]
												}]
									}]
								});
									
									fieldset = new Ext.form.FieldSet({
										title:'基本信息',
										layout:'column',
										columnWidth:'.5',
										items:panel
									});
									
									info_panel = new Ext.Panel({
										border : false,
										frame : true,
										layout : "column",
										bodyStyle : "margin-left:10px;border:none;",
										layoutConfig : {
											columns : 3
										},
										renderTo : "grid",
										tbar : [{
											text : '查看企业会员',
											hidden : compareAuth('VIP_EP_ADD_MEM_LIST'),
											handler : addMember,
											icon : '/resource/images/group.png'
										}],
										items : [{
													layout : "form",
													width : 800,
													bodyStyle : "padding:10px;",
													autoHeight : true,
													items : [fieldset]
												}]

									});
									
									var province = Ext.getCmp("province").getValue();
									var city_val = Ext.getCmp("city").getValue();
									if (province == "全部省份") {
										city = [ "全部城市" ];
									} else {
										city = zhcn.getCity(province).concat();
										city.unshift("全部城市");
										Ext.getCmp('city').setValue(city_val);
									}
									Ext.getCmp('city').store.loadData(city);
									Ext.getCmp('city').enable();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					}, "eid=" + eid);
}


function buildVipForm(){
	Ext.lib.Ajax
			.request(
					"post",
					"/mc/vip/VipEpAccountServlet.do?type=4",
					{
						success : function(response) {
							var jsondata = eval("(" + response.responseText
									+ ")");
							if (getState(jsondata.state, commonResultFunc,
									jsondata.result)) {
								vipEpAccount = jsondata.result;
									panel2 = new Ext.Panel({
										layout : "table",
										width:700,
										bodyStyle : "margin-left:50px;border:none;",
										layoutConfig : {
											columns : 4
										},
										items : [{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "线下询价："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "textfield",
														fieldLabel : "线下询价：",
														width:90,
														maxLength : 6,
														allowBlank : false,
														id : "askCount",
														value : vipEpAccount["askCount"],
														regex : /^\d+$/,
														regexText : "请输入正确的线下询价数"
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "材价库流量总数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "textfield",
														fieldLabel : "材价库流量总数：",
														width:90,
														maxLength : 6,
														allowBlank : false,
														id : "materialCount",
														value : vipEpAccount["materialCount"],
														regex : /^\d+$/,
														regexText : "请输入正确的材价收藏"
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "导入询价数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														
														text: vipEpAccount["totalAskCount"],
								
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "剩余流量数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["residueMaterialCount"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "剩余询价数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["residueAskCount"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "已用流量数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["collectMaterialCount"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "供应商收藏："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "textfield",
														fieldLabel : "供应商收藏：",
														width:90,
														maxLength : 6,
														allowBlank : false,
														id : "facCount",
														value : vipEpAccount["facCount"],
														regex : /^\d+$/,
														regexText : "请输入正确的供应商收藏"
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "子成员："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "textfield",
														fieldLabel : "子成员：",
														width:90,
														maxLength : 6,
														allowBlank : false,
														id : "memberCount",
														value : vipEpAccount["memberCount"],
														regex : /^\+?[1-9][0-9]*$/,
														regexText : "请输入正确的子成员"
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "收藏供应商数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["collectFacCount"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "当前成员数："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["currMemCount"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "剩余供应商收藏："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["residueFacCount"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "开始时间："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["beginDate"]
													}]
										},{
											width : 120,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : "结束时间："
													}]
										}, {
											width : 160,
											autoHeight : true,
											bodyStyle : "min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
											items : [{
														xtype : "label",
														text : vipEpAccount["endDate"]
													}]
										}]
									});
									
									
									detail_fieldset = new Ext.form.FieldSet({
										layout:'column',
										columnWidth:'.5',
										items:panel2
									});
									
									detail_panel = new Ext.Panel({
										border : false,
										frame : true,
										layout : "column",
										bodyStyle : "margin-left:10px;border:none;",
										layoutConfig : {
											columns : 3
										},
										renderTo : "detail",
										items : [{
													layout : "form",
													width : 800,
													bodyStyle : "padding:10px;",
													autoHeight : true,
													items : [detail_fieldset,{
														layout : "form",
														buttonAlign : "center",
														baseCls : 'x-plain',
														buttons : [{
																	text : '修改',
																	handler : doUpdate,
																	hidden : compareAuth('VIP_EP_EDIT')
																}]
													}]
									}]});
									
							}
						},
						failure : function() {
							Warn_Tip();
						}
					}, "eid=" + eid);

}


function doUpdate(){
	if (!panel.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容！");
		return;
	}
	var ename = Ext.getCmp("name").getValue();
	//var fname = Ext.getCmp("fname").getValue();
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	var eAddr = Ext.getCmp("addr").getValue();
	var eType = Ext.getCmp("type").getValue();
	var linkman = Ext.getCmp("contact").getValue();
	var mobile = Ext.getCmp("mobile").getValue();
	var fax = Ext.getCmp("fax").getValue();
	var content = "name~" + ename + ";province~" + province + ";city~" + city + ";addr~" + eAddr
	+ ";type~" + eType + ";contact~" + linkman + ";mobile~" + mobile + ";fax~" + fax;
	
	var askCount = Ext.getCmp("askCount").getValue();
	var materialCount = Ext.getCmp("materialCount").getValue();
	var facCount = Ext.getCmp("facCount").getValue();
	var memberCount = Ext.getCmp("memberCount").getValue();
	//var r = /^\+?[1-9][0-9]*$/; //正整数
	var r = /^\d+$/;
	if (!r.test(askCount)){
		alert("请输入正确的线下询价！");
		return false;
	}
	askCount = parseInt(askCount, 10);
	if (!r.test(materialCount)){
		alert("请输入正确的材价收藏！");
		return false;
	}
	materialCount = parseInt(materialCount, 10);
	if (!r.test(facCount)){
		alert("请输入正确的供应商收藏！");
		return false;
	}
	facCount = parseInt(facCount, 10);
	var rMem = /^\+?[1-9][0-9]*$/; //正整数
	if (!rMem.test(memberCount)){
		alert("请输入正确的子成员！");
		return false;
	}
	memberCount = parseInt(memberCount, 10);
	
	var residueAskCount = 0;
	var residueMaterialCount = 0;
	var residueFacCount = 0;
	if (vipEpAccount != null){
		residueAskCount = parseInt(vipEpAccount["residueAskCount"]);
		residueMaterialCount = parseInt(vipEpAccount["residueMaterialCount"]);
		residueFacCount = parseInt(vipEpAccount["residueFacCount"]);
		if (parseInt(askCount) > parseInt(vipEpAccount["askCount"])){ //增加线下询价数量
			residueAskCount = residueAskCount + (parseInt(askCount) - parseInt(vipEpAccount["askCount"]));
		}else{
			residueAskCount = residueAskCount - (parseInt(vipEpAccount["askCount"]) - parseInt(askCount));
		}
		if (parseInt(materialCount) > parseInt(vipEpAccount["materialCount"])){ //增加线下询价数量
			residueMaterialCount = residueMaterialCount + (parseInt(materialCount) - parseInt(vipEpAccount["materialCount"]));
		}else{
			residueMaterialCount = residueMaterialCount - (parseInt(vipEpAccount["materialCount"]) - parseInt(materialCount));
		}
		if (parseInt(facCount) > parseInt(vipEpAccount["facCount"])){ //增加线下询价数量
			residueFacCount = residueFacCount + (parseInt(facCount) - parseInt(vipEpAccount["facCount"]));
		}else{
			residueFacCount = residueFacCount - (parseInt(vipEpAccount["facCount"]) - parseInt(facCount));
		}
	}
	
	if (residueAskCount < 0){
		alert("线下询价数超出最大值！");
		return false;
	}
	if (residueMaterialCount < 0){
		alert("材价收藏数超出最大值！");
		return false;
	}
	if (residueFacCount < 0){
		alert("供应商收藏数超出最大值！");
		return false;
	}
	
	var vipContent = "askCount~" + askCount 
				   + ";materialCount~" 
				   + materialCount 
				   + ";facCount~" 
				   + facCount 
				   + ";memberCount~" 
				   + memberCount
				   + ";residueAskCount~"
				   + residueAskCount
				   + ";residueMaterialCount~"
				   + residueMaterialCount
				   + ";residueFacCount~"
				   + residueFacCount
				   + ";ename~"
				   + ename;
	
	//修改
	Ext.Ajax.request({
		url : "/ep/EnterpriseServlet",
		params : {
			type : 7,
			ids : id,
			content : content
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				//Info_Tip("信息修改成功。",closeWin);
				//if (parent.tab_0302_iframe){
					//parent.tab_0302_iframe.ds.reload();
			     //}
				//修改
				Ext.Ajax.request({
					url : "/mc/vip/VipEpAccountServlet.do",
					params : {
						type : 3,
						eid : eid,
						content : vipContent
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("信息修改成功。",closeWin);
							if (parent.tab_0302_iframe){
								parent.tab_0302_iframe.ds.reload();
						     }
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
			return false;
		}
	});
}

//添加会员
function addMember() {
	window.parent.createNewWidget("enterprise_vip_mem_add", '查看VIP会员',
			'/module/enterprise/enterprise_vip_mem_add.jsp?eid=' + eid);
};

function closeWin(){
	window.parent.Ext.getCmp('center').remove("vip_enterprise_edit");
}
