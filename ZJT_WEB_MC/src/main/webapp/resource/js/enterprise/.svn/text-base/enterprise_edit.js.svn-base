Ext.onReady(init);
var fs, panel, img_area, basic_area, win, picform, id = "", eid, store, area, emp_type, area1, area2;
var pic_ds;
var linkman_area;
var linkman_info;
var linkman_info_id = 0;
var linkman_info_num = 0;
var linkman_count = 1;
var zhcn = new Zhcn_Select();
var enType = [["2", "政府机构"], ["3", "造价咨询"],
        		["4", "施工单位"], ["5", "业主单位"], ["6", "设计单位"], ["7", "其它单位"]];
function init() {
	// id = getCurArgs("id");
	eid = getCurArgs("eid");
	Ext.QuickTips.init();
	buildForm();
	getEmpInfo();
};
function getEmpInfo() {
	Ext.lib.Ajax.request("post", "/ep/EnterpriseServlet?type=27", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data.result == null) {
						Info_Tip("非常抱歉，该会员并未与已厂商进行绑定或该会员所在的公司不存在。");
						return;
					}
					if (getState(data.state, commonResultFunc, data.result)) {
						if ((id || "") == "")
							id = data["result"]["id"];
						if (!Ext.isEmpty(data["result"]["type"]))
							emp_type.setValue(data["result"]["type"]);
						if (!Ext.isEmpty(data["result"]["area"])) {
								area2.setValue(data["result"]["area"]);
						}
						/*if (!Ext.isEmpty(data["result"]["keyword"])) {
							Ext.fly("emp_kw").setValue(data["result"]["keyword"]);
						}*/
						if(!Ext.isEmpty(data["result"]["province"]))
						{
						   area.setValue(data["result"]["province"]);
						}
						if(!Ext.isEmpty(data["result"]["city"]))
						{
						   area1.setValue(data["result"]["city"]);
						}
						if (!Ext.isEmpty(data["result"]["degree"]))
							emp_deg.setValue(data["result"]["degree"]);
						fs.getForm().setValues(data["result"]);
						var linkmans = readLinkMan(data["result"].linkman);
						initLinkManArea(linkmans);
					}
					fillInfo(data.result);
				},
				failure : function() {
					Warn_Tip();
				}
			}, "eid=" + eid);
};
function buildForm() {
	var pro = zhcn.getProvince(true);
	var city = [];
	var city_area = [];
	var emp_degree = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : [["0", "无"], ["8", "VIP企业"], ["9", "普通企业"]]
			});
	// img_area = new Ext.form.FieldSet({
	// title : "企业图片",
	// layout : "form",
	// items : [{
	// width : 80,
	// height : 80,
	// html : "<img id='picPath' src='/resource/images/def_info.jpg' width='80'
	// height='80' />"
	// }, {
	// xtype : "button",
	// text : "修改",
	// width : 80,
	// handler : showImgArea,
	// hidden : true
	// }]
	// });
	basic_area = new Ext.form.FieldSet({
		title : '基本信息',
		layout : "table",
		layoutConfig : {
			columns : 4
		},
		autoWidth : true,
		bodyStyle : 'background-color:#DFE8F6',
		items : [		
		{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "企业ID："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "emp_id",
						width : 162,
						name : "eid",
						allowBlank : false,
						maxLength : 10,
						blankText : "请输入企业ID",
						readOnly : true
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "企业名称："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业名称",
						width : 162,
						id : "emp_name",
						name : 'name',
						allowBlank : false,
						maxLength : 50,
						blankText : "请输入企业名称"
					}]
		}, /*{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "企业简称："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业简称",
						id : "emp_jname",
						name : 'fname',
						width : 162,
						allowBlank : false,
						maxLength : 12,
						blankText : "请输入企业简称",
						maxLengthText : "字数最大限制6个汉字，12个英文字母"
					}]
		},*/ {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "法人代表："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "法人代表",
						width : 162,
						name : 'corpn',
						id : "emp_person",
						maxLength : 50,
						blankText : "请输入法人代表"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "企业类型："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [emp_type = new Ext.form.ComboBox({
						fieldLabel : "企业类型",
						store : enType,
						emptyText : "请选择企业类型",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						readOnly : true,
						displayField : "text",
						allowBlank : false
					})]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "省："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [area = new Ext.form.ComboBox({
						fieldLabel : "省",
						store : pro,
						id : "province_sel",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						readOnly : true,
						displayField : "text",
						allowBlank : false
					})]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "市："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [area1 = new Ext.form.ComboBox({
						fieldLabel : "市",
						store : city,
						id : "city_sel",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						readOnly : true,
						disabled : true,
						displayField : "text",
						allowBlank : false
					})]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "区："
					}]
		}, {
			colspan : 3,
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [area2 = new Ext.form.ComboBox({
						fieldLabel : "区",
						id : "area_sel",
						store : city_area,
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						readOnly : true,
						disabled : true,
						displayField : "text",
						allowBlank : false
					})]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "联系人："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "联系人",
						width : 162,
						id : "emp_contact",
						name : 'contact',
						maxLength : 50,
						blankText : "请输入联系人姓名"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "联系电话："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "联系电话",
						width : 162,
						id : "emp_phone",
						name : 'phone',
						maxLength : 50,
						blankText : "请输入联系电话"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "传真号码："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "传真号码",
						width : 162,
						id : "emp_fax",
						name : 'fax',
						maxLength : 50,
						blankText : "请输入传真号码"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "邮政编码："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "邮政编码",
						width : 162,
						id : "emp_postcode",
						name : 'postCode',
						maxLength : 50,
						blankText : "请输入邮政编码",
						regex : /^(\d{6}){0,1}$/,
						regexText : "请正确输入邮政编码"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "企业网址："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业网址",
						width : 162,
						id : "emp_homepage",
						name : 'homePage',
						maxLength : 50,
						blankText : "请输入企业网址",
						vtype : 'url',
						allowBlack : true
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "详细地址："
					}]
		}, {
			width : 180,
			autoHeight : true,
			hide : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "详细地址",
						width : 162,
						id : "emp_addr",
						name : 'addr',
						maxLength : 100,
						blankText : "请输入详细地址"
					}]
		},/*{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "关键字："
					}]
		},{
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "关键字：",
						width : 162,
						id : "emp_kw",
						name : 'keyword',
						maxLength : 100,
						blankText : "请输入关键"
					}]
		},*/{
			colspan : 4,
			layout : 'column',
			bodyStyle : "border:none;background-color:#DFE8F6;font-size:12px;",
			items : [{
				width : 90,
				autoHeight : true,
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
				items : [{
							xtype : "label",
							text : "关键字："
						}]
			}, {
				autoWidth : true,
				autoHeight : true,
			
				//layout : "fit",
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;margin-left:10px;",
				items : [{
							xtype : "textfield",
							fieldLabel : "关键字",
							width : 162,
							id : "emp_kw",
							name : 'keyword',
							maxLength : 100,
							blankText : "请输入关键"
						},{
							xtype : "label",
							text : "多个用“；”隔开"
						}]
			}]
		}, {
			colspan : 4,
			layout : 'column',
			bodyStyle : "border:none;background-color:#DFE8F6;font-size:12px;margin-left:12px;",
			items : [{
				width : 90,
				autoHeight : true,
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
				items : [{
							xtype : "label",
							text : "企业简介："
						}]
			}, {
				autoWidth : true,
				autoHeight : true,
				layout : "fit",
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
				items : [{
							xtype : "htmleditor_simple",
							id : "emp_desc",
							name : 'discription',
							text : "企业简介",
							width : 500,
							maxLength : 2000
						}]
			}]
		},{colspan : 4,
			layout : 'column',
			bodyStyle : "border:none;background-color:#DFE8F6;font-size:12px;margin-left:101px;margin-top:8px;",
			items : [{
				width : 120,
				height : 120,
				
				items : [{
					
					width : 120,
					height : 120,
					html : "<img id='picPath' src='/resource/images/def_info.jpg' width='120' height='120' />"
				}]
			}, 
			{
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;margin-left:8px;margin-top:50px;",
				items : [{
					xtype : "tbbutton",
					width : 120,
					text : "修改",
					handler : showPic
						}]
			}]
		}	
		]
	});

	linkman_area = new Ext.form.FieldSet({
				title : "联系人信息",
				items : [{
							xtype : 'button',
							text : '新添联系人',
							hidden : compareAuth('CORP_MOD'),
							handler : addLinkMan
						}]
			});

	fs = new Ext.form.FormPanel({
				autoHeight : true,
				autoWidth : true,
				layout : "table",
				layoutConfig : {
					columns : 1
				},
				bodyStyle : "background-color:#DFE8F6;font-size:12px;",
				style : 'background-color:#DFE8F6;font-size:12px;',
				renderTo : "grid",
				tbar : [{
							text : '查看企业会员',
							hidden : compareAuth('CORP_MEM_MANAGE'),
							handler : EmpMem,
							icon : '/resource/images/group.png'
						}, {
							text : '查看企业材料图片库',
							hidden : compareAuth('CORP_PIC_MANAGE'),
							handler : showPicArea,
							icon : '/resource/images/images.png'
						}],
				items : [{
							baseCls : 'x-plain',
							items : [basic_area, linkman_area, {
										layout : "form",
										buttonAlign : "center",
										baseCls : 'x-plain',
										buttons : [{
													text : '修改',
													handler : saveInfo,
													hidden : compareAuth('CORP_MOD')
												}]
									}]
						}],
				waitMsgTarget : true,
				reader : new Ext.data.JsonReader({
							root : 'result',
							successProperty : 'state'
						}, ["id", "eid", "name", "fname", "type", "area","province","city",
								"phone", "createOn"])
			});
	area.on("select", function(combobox) {
				var province = combobox.getValue();
				city = zhcn.getCity(province);
				area1.store.loadData(city);
				area1.reset();
				area2.reset();
				area1.enable();
			})
	area1.on("select", function(combobox) {
				var ci = combobox.getValue();
				city_area = zhcn.getArea(ci)
				area2.store.loadData(city_area);
				area2.reset();
				area2.enable();
			})

};
// 初始化联系人区域
function initLinkManArea(linkmans) {
	if (!linkmans)
		return;
	for (var i = 0; i < linkmans.length; i++) {
		createLinkManInfo();
		var id = "linkman_info" + (i + 1);
		Ext.fly(id + "_name").dom.value = linkmans[i]["name"]
				? linkmans[i]["name"]
				: "";
		Ext.fly(id + "_phone").dom.value = linkmans[i]["phone"]
				? linkmans[i]["phone"]
				: "";
		Ext.fly(id + "_mobile").dom.value = linkmans[i]["mobile"]
				? linkmans[i]["mobile"]
				: "";
		Ext.fly(id + "_email").dom.value = linkmans[i]["email"]
				? linkmans[i]["email"]
				: "";
		Ext.fly(id + "_qq").dom.value = linkmans[i]["qq"]
				? linkmans[i]["qq"]
				: "";
		Ext.fly(id + "_msn").dom.value = linkmans[i]["msn"]
				? linkmans[i]["msn"]
				: "";
		Ext.fly(id + "_fax").dom.value = linkmans[i]["fax"]
				? linkmans[i]["fax"]
				: "";
		Ext.fly(id + "_addr").dom.value = linkmans[i]["addr"]
				? linkmans[i]["addr"]
				: "";
		Ext.fly(id + "_postcode").dom.value = linkmans[i]["postcode"]
				? linkmans[i]["postcode"]
				: "";
	}
};
// 创建联系人区域
function createLinkManInfo() {
	linkman_info_id++;
	linkman_info_num++;
	var id = "linkman_info" + linkman_info_id;
	var linkman_title = '联系人' + linkman_info_num;
	linkman_info = new Ext.form.FieldSet({
		id : id,
		title : linkman_title,
		layout : "table",
		style : 'margin-top:5px;',
		bodyStyle : 'background-color:#DFE8F6;font-size:12px;',
		buttonAlign : 'right',
		layoutConfig : {
			columns : 4
		},
		autoWidth : true,
		items : [{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "姓名："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_name",
						xtype : "textfield",
						fieldLabel : "姓名",
						width : 162,
						maxLength : 50,
						blankText : "请输入联系人姓名"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "电话："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_phone",
						xtype : "textfield",
						fieldLabel : "电话",
						width : 162,
						maxLength : 50,
						blankText : "请输入联系电话"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "手机："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_mobile",
						xtype : "textfield",
						fieldLabel : "手机",
						width : 162,
						maxLength : 50,
						blankText : "请输入手机"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "邮箱："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_email",
						xtype : "textfield",
						fieldLabel : "邮箱",
						width : 162,
						maxLength : 50,
						blankText : "请输入邮箱"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "QQ："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_qq",
						xtype : "textfield",
						fieldLabel : "QQ",
						width : 162,
						maxLength : 50,
						blankText : "请输入QQ"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "MSN："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_msn",
						xtype : "textfield",
						fieldLabel : "MSN",
						width : 162,
						maxLength : 50,
						blankText : "请输入MSN"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "传真："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_fax",
						xtype : "textfield",
						fieldLabel : "FAX",
						width : 162,
						maxLength : 50,
						blankText : "请输入传真"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "地址："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_addr",
						xtype : "textfield",
						fieldLabel : "地址",
						width : 162,
						maxLength : 50,
						blankText : "请输入地址"
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "邮政编码："
					}]
		}, {
			width : 180,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						id : id + "_postcode",
						xtype : "textfield",
						fieldLabel : "邮政编码",
						width : 162,
						maxLength : 50,
						blankText : "请输入邮政编码"
					}]
		}],
		buttons : [{
					xtype : 'button',
					text : '删除此联系人',
					parentId : id,
					hidden : compareAuth('CORP_MOD'),
					handler : function(b) {
						delLinkMan(b.parentId);
					}
				}]
	});
	linkman_area.add(linkman_info);
	linkman_area.doLayout();
}
// 新添联系人
function addLinkMan() {
	createLinkManInfo();
};
// 删除联系人
function delLinkMan(linkman_info_id) {
	linkman_area.remove(Ext.getCmp(linkman_info_id));
	var items = linkman_area.items;
	var length = items.getCount() - 1;
	for (linkman_info_num = 0; linkman_info_num < length; linkman_info_num++) {
		items.itemAt(linkman_info_num + 1).setTitle("联系人"
				+ (linkman_info_num + 1));
	}
};

// 保存信息

function saveInfo() {

	var emp_id=Ext.fly("emp_id").getValue();
	var keyword = Ext.fly("emp_kw").getValue();
	var ename = Ext.fly("emp_name").getValue();
	//var jname = Ext.fly("emp_jname").getValue();
	var ephone = Ext.fly("emp_phone").getValue();
	var efax = Ext.fly("emp_fax").getValue();
	var epostCode = Ext.fly("emp_postcode").getValue();
	var homepage = Ext.fly("emp_homepage").getValue();
	var eaddr = Ext.fly("emp_addr").getValue();
	var person = Ext.fly("emp_person").getValue();
	var contact = Ext.fly("emp_contact").getValue();
	var emparea = Ext.fly("area_sel").getValue();
	var province =Ext.fly("province_sel").getValue();
	var city  = Ext.fly("city_sel").getValue();
	var emptype = emp_type.getValue();
	var desc = Ext.fly("emp_desc").getValue();
	var logo = Ext.fly("picPath").dom.src.split("/");
	logo = "/" + logo.slice(3).toString().replace(/,/g, "/");
	if(!keyword){
		Ext.MessageBox.alert("提示", "关键字不能为空!");
		return;
	}
	// 联系人信息
	var linkman = "";
	var items = linkman_area.items;
	var length = items.getCount() - 1;
	for (var i = 0; i < length; i++) {
		var itemId = items.itemAt(i + 1).id;
		var info = "";
		var name = Ext.fly(itemId + "_name").getValue();
		var phone = Ext.fly(itemId + "_phone").getValue();
		var mobile = Ext.fly(itemId + "_mobile").getValue();
		var email = Ext.fly(itemId + "_email").getValue();
		var qq = Ext.fly(itemId + "_qq").getValue();
		var msn = Ext.fly(itemId + "_msn").getValue();
		var fax = Ext.fly(itemId + "_fax").getValue();
		var addr = Ext.fly(itemId + "_addr").getValue();
		var postcode = Ext.fly(itemId + "_postcode").getValue();
		
		if (name || phone || mobile || email || qq || msn || fax || addr
				|| postcode) {
			if (!name) {
				Ext.Message.alert("提示", "联系人不能为空!");
				return;
			}
			info = "name:" + name + ",phone:" + phone + ",mobile:" + mobile
					+ ",email:" + email + ",qq:" + qq + ",msn:" + msn + ",fax:"
					+ fax + ",addr:" + addr + ",postcode:" + postcode;
		}
		if (info != "" && linkman != "")
			linkman = linkman + "|";
		linkman = linkman + info;
	}

	if (linkman.gblen() > 256) {
		Ext.Message.alert("提示", "联系人太多，请删减联系人数量");
		return;
	}

	/*if (jname.gblen() < 4 || jname.gblen() > 32) {
		Info_Tip("请正确输入企业简称（最少两个汉字）");
		return;
	}*/
	if (fs.getForm().isValid()) {
		var content = "";
		content += "name~" + ename + ";phone~" + ephone
				+ ";fax~" + efax + ";addr~" + eaddr + ";postCode~" + epostCode
				+ ";homePage~" + homepage + ";corpn~" + person + ";area~"
				+ emparea + ";type~" + emptype + ";linkman~" + linkman + ";keyword~" + keyword
				+ ";contact~" + contact+";logo~"+logo+";province~"+province+";city~"+city;
		// + ";culture~" + culture
		Ext.Ajax.request({
					url : "/ep/EnterpriseServlet",
					params : {
						type : 7,
						ids : id,
						eid : eid,
						content : content,
						dec : desc
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("信息修改成功。");
							if (parent.tab_0301_iframe)
								parent.tab_0301_iframe.ds.reload();
						}

					},
					failure : function() {
						Warn_Tip();
					}
				})
	} else {
		Info_Tip();
	}
};

// // 显示上传
// function showImgArea() {
// store = new Ext.data.Store({
// proxy : new Ext.data.HttpProxy({
// url : '/ep/EnterprisePicServlet'
// }),
// reader : new Ext.data.JsonReader({
// root : 'result'
// }, ['name', 'path', {
// name : 'size',
// type : 'float'
// }, {
// name : 'upTime',
// type : 'date',
// dateFormat : 'timestamp'
// }]),
// baseParams : {
// type : 3,
// eid : id
// }
// });
// store.load();
// var tpl = new Ext.XTemplate(
// '<tpl for=".">',
// '<div class="thumb-wrap" id="{name}">',
// '<div class="thumb"><img src="{path}" title="{name}" width="80"
// height="80"></div>',
// '<span class="x-editable">{shortName}</span></div>', '</tpl>',
// '<div class="x-clear"></div>');
// var imgshow = new Ext.Panel({
// id : 'images-view',
// title : "图片显示",
// frame : true,
// width : 535,
// autoHeight : true,
// collapsible : true,
// layout : 'fit',
// items : new Ext.DataView({
// store : store,
// tpl : tpl,
// autoHeight : true,
// multiSelect : true,
// overClass : 'x-view-over',
// itemSelector : 'div.thumb-wrap',
// emptyText : '没有图片显示，您可以先上传再进行选择。',
// plugins : [new Ext.DataView.DragSelector(),
// new Ext.DataView.LabelEditor({
// dataIndex : 'name'
// })],
// prepareData : function(data) {
// data.shortName = Ext.util.Format
// .ellipsis(data.name, 15);
// data.sizeString = Ext.util.Format.fileSize(data.size);
// data.dateString = data.upTime.format("m/d/Y g:i a");
// return data;
// },
// listeners : {
// selectionchange : {
// fn : function(dv, nodes) {
// var picUrl = Ext.get(nodes[0]).child('img').dom.src;
// Ext.fly("picPath").dom.src = picUrl;
// win.close();
// }
// }
// }
//
// })
//
// });
// var picup = new Ext.form.TextField({
// inputType : "file",
// id : "upPic",
// height : 26
// });
// picform = new Ext.form.FormPanel({
// laeblAlign : "right",
// frame : true,
// fileUpload : true,
// layout : "form",
// items : [{
// xtype : "textfield",
// fieldLabel : "名称",
// id : "name_input"
// }, picup, {
// xtype : "label",
// text : "图片类型：jpg,jpeg,建议尺寸:80*80,大小不能超过150K。"
// }],
// buttons : [{
// text : "上传",
// handler : uploadPic
// }]
// });
// win = new Ext.Window({
// title : "修改相片",
// autoHeight : true,
// autoWidth : true,
// closable : true,
// draggable : true,
// modal : true,
// border : false,
// plain : true,
// layout : 'fit',
// closeAction : "close",
// buttonAlign : 'center',
// items : [imgshow, picform],
// buttons : [{
// text : "取消",
// handler : function() {
// win.close();
// }
// }]
// });
// win.show();
// };
//
// // 修改相片
// function uploadPic() {
// if (picform.getForm().isValid()) {
// picform.getForm().submit({
// url : '/ep/EnterprisePicServlet?eid=' + id + "&name="
// + Ext.fly("name_input").getValue() + "&type=1",
// waitMsg : '上传图片中...'
// });
// }
//
// };
//
// // 上传图片返回信息
// function getResult(flag, msg) {
// if (flag) {
// Info_Tip(opMsg.succupload);
// Ext.fly("picPath").dom.src = msg;
// picform.getForm().reset();
// store.reload();
// // win.close();
// } else {
// Warn_Tip(opMsg.failupload);
// }
// };
// 查看/设置企业会员
function EmpMem() {

	var thisid = Ext.fly('emp_id').getValue();
	var ename = encodeURI(Ext.fly("emp_name").getValue());
	window.parent.createNewWidget("enterprise_memToemp", '查看企业会员',
			'/module/enterprise/enterprise_mem_add.jsp?eid=' + thisid
					+ "&ename=" + ename);
};

// 显示图片库区域
function showPicArea() {
	pic_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/FacMaterialPic.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['name', 'path', "id", 'description', {
									name : 'size',
									type : 'float'
								}, {
									name : 'upTime',
									type : 'date',
									dateFormat : 'timestamp'
								}]),
				baseParams : {
					type : 4,
					fid : eid
				}
			});
	pic_ds.load();
	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="thumb-wrap" id="pic_{id}">',
			'<div class="thumb"><img src="{changePath}" title="{name}" width="80" height="80" _id="{id}"></div>',
			'<span style="text-align:left;float:left;">名称：</span><span style="text-align:left;float:left;">{shortName}</span>',
			'<div class="x-clear"></div>',
			'<span style="text-align:left;float:left;">描述：</span><span style="display:block;text-align:left;float:left;height:30px;">{shortDescription}</span></div>',
			'</tpl>',
			// '<span class="x-editable">{shortName}</span></div>', '</tpl>',
			'<div class="x-clear"></div>');

	var imgshow = new Ext.Panel({
		id : 'images-view',
		title : "图片显示",
		frame : true,
		// width : 500,
		autoWidth : true,
		height : 260,
		autoScroll : true,
		collapsible : true,
		style : 'overflow-x:hidden;',
		layout : 'fit',
		items : picView = new Ext.DataView({
					store : pic_ds,
					tpl : tpl,
					id : 'mai_view',
					// autoHeight : true,
					autoWidth : true,
					multiSelect : true,
					overClass : 'x-view-over',
					itemSelector : 'div.thumb-wrap',
					emptyText : '没有图片显示，您可以先上传再进行选择。',
					plugins : [new Ext.DataView.DragSelector(),
							new Ext.DataView.LabelEditor({
										dataIndex : 'name'
									})],
					prepareData : function(data) {
						data.shortName = Ext.util.Format
								.ellipsis(data.name, 15);
						data.sizeString = Ext.util.Format.fileSize(data.size);
						data.dateString = data.upTime.format("Y-m-d");
						data.changePath = FileSite + data.path;
						if (data.description)
							data.shortDescription = data.description.length > 50
									? Ext.util.Format.ellipsis(
											data.description, 50)
											+ "..."
									: data.description;
						else
							data.shortDescription = "";
						return data;
					},
					listeners : {
						selectionchange : {
							fn : function(dv, nodes) {
								pid = Ext.get(nodes[0]).child('img')
										.getAttribute("_id");
							}
						}
					}
				})
	});

	picform = new Ext.form.FormPanel({
		laeblAlign : "right",
		frame : true,
		fileUpload : true,
		layout : "form",
		labelWidth : 50,
		buttonAlign : 'center',
		hidden : compareAuth('CORP_PIC_ADD'),
		items : [{
			layout : 'table',
			layoutConfig : {
				columns : 4
			},
			items : [{
						xtype : 'label',
						width : 50,
						text : "名称："
					}, {
						xtype : "textfield",
						fieldLabel : "名称",
						id : "name_input"
					}, {
						xtype : 'button',
						text : '上传图片',
						handler : function() {
							if (Ext.isEmpty(Ext.fly("name_input").getValue())) {
								Ext.MessageBox.alert("提示", "图片名称不能为空");
								return;
							}
							FileUpload_Ext.requestId = eid;
							FileUpload_Ext.requestType = "RS_EP";
							FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif|PNG|png/;
							FileUpload_Ext.initComponent();
						}
					}, {
						xtype : "label",
						style : 'margin-left:5px;',
						html : "<font color='red'>(图片类型：jpg,jpeg,建议尺寸:80*80,大小不能超过150K。)</font>"
					}]
		}, {
			layout : 'table',
			style : 'margin-top:5px;',
			layoutConfig : {
				columns : 2
			},
			items : [{
				autoHeight : true,
				width : 37,
				style : 'vertical-align:top',
				bodyStyle : "position:absolute;top:0;border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
				items : [{
							width : 50,
							xtype : "label",
							text : "描述："
						}]
			}, {
				id : 'description_input',
				width : 180,
				autoHeight : true,
				xtype : 'textarea'
			}]
		}]
/*
 * , buttons : [{ text : "上传图片", handler : function() { if
 * (Ext.isEmpty(Ext.fly("name_input") .getValue())) { Ext.MessageBox.alert("提示",
 * "图片名称不能为空"); return; } FileUpload_Ext.requestId = eid;
 * FileUpload_Ext.requestType = "RS_EP"; FileUpload_Ext.fileType =
 * /jpg|JPG|JPEG|jpeg|GIF|gif/; FileUpload_Ext.initComponent(); } }]
 */
	});
	win = new Ext.Window({
				title : "材料图片库",
				autoHeight : true,
				width : 780,
				height : 700,
				closable : true,
				// autoScroll : true,
				draggable : true,
				modal : true,
				border : false,
				plain : true,
				closeAction : "close",
				buttonAlign : 'center',
				items : [imgshow, picform],
				buttons : [{
							text : '删除选定图片',
							hidden : compareAuth('CORP_PIC_DEL'),
							handler : del_selpic

						}, {
							text : '删除所有图片',
							hidden : compareAuth('CORP_PIC_DEL'),
							handler : del_allpic
						}, {
							text : "关闭",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};
// 上传文件自定义操作
function upload_fn() {
	savePicPath(FileUpload_Ext.callbackMsg);
};
// 保存材料图片
function savePicPath(path) {
	Ext.Ajax.request({
				url : '/FacMaterialPic.do',
				params : {
					type : 1,
					fid : eid,
					path : path,
					name : Ext.fly("name_input").getValue(),
					description : Ext.fly("description_input").getValue()
				},
				success : function(response) {
					Ext.fly('name_input').dom.value = "";
					Ext.fly("description_input").dom.value = "";
					pic_ds.reload();

				},
				failure : function() {
					Warn_Tip();
				}
			});
};
// 删除选定图片
function del_selpic() {
	/*
	 * if ((pid || "") == "") { Info_Tip("请选择一张图片。"); return; }
	 */
	var nodes = picView.getSelectedNodes();
	if (Ext.isEmpty(nodes)) {
		Info_Tip("请选择图片。");
		return;
	}
	pic = Ext.get(nodes[0]).child('img').getAttribute("_id");

	Ext.MessageBox.confirm("确认操作", "您确认要删除选中的图片吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/FacMaterialPic.do',
								params : {
									type : 5,
									pid : pid
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("图片删除成功。");
										Ext.fly("pic_" + pid).remove();
									}
								},
								faliure : function() {
									Warn_Tip();
								}
							})
				}
			})
};

// 删除所有图片
function del_allpic() {
	Ext.MessageBox.confirm("确认操作", "您确认要删除该供应商所有的图片吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/FacMaterialPic.do',
								params : {
									type : 2,
									fid : eid
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("图片删除成功。");
										Ext.select(".thumb-wrap").each(
												function(el) {
													Ext.get(el).remove();
												});
									}
								},
								faliure : function() {
									Warn_Tip();
								}
							})
				}
			})
};
// 显示修改相片区域
function showPic() {
	FileUpload_Ext.requestId = eid;
	FileUpload_Ext.requestType = "RS_MEMBER";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

// 上传图片回调函数2
function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + FileUpload_Ext.callbackMsg;
};
// 填充信息(相片)
function fillInfo(data) {
	if (!Ext.isEmpty(data["logo"])) {
		Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
				+ data["logo"].replace(/(\\)|(\/\/)/g, "/");
	}
};