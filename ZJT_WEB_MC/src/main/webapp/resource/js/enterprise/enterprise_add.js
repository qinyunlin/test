var fs, panel, basic_area, info_area, area, area1, area2, emp_type;
var linkman_area;
var linkman_info;
var linkman_info_id = 0;
var linkman_info_num = 0;
var linkman_count = 1;
var zhcn = new Zhcn_Select();
var enType = [["2", "政府机构"], ["3", "造价咨询"],
              		["4", "施工单位"], ["5", "业主单位"], ["6", "设计单位"], ["7", "其它单位"]];

var keywordResultWin;


Ext.onReady(init);
function init() {
	Ext.QuickTips.init();
	buildPanel();
};

function buildPanel() {
	// 省份数据
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
	basic_area = new Ext.form.FieldSet({
		title : '基本信息',
		layout : "table",
		layoutConfig : {
			columns : 4
		},
		autoWidth : true,
		bodyStyle : 'background-color:#DFE8F6;font-size:12px;',
		items : [{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "label",
						text : "企业ID："
					}]
		}, {
			width : 220,
			autoHeight : true,
			layout : "table",
			layoutConfig : {
				columns : 2
			},
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "emp_id",
						allowBlank : false,
						width : 162,
						maxLength : 10,
						readOnly : true,
						blankText : "请输入企业ID"
					}, {
						xtype : "button",
						text : '生成ID',
						handler : getFId
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
						value : '3',
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
						maxLength : 100,
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
		},{
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
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;margin-left:2px;",
				items : [{
							xtype : "textfield",
							fieldLabel : "关键字",
							width : 162,
							id : "emp_kw",
							name : 'keywork',
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
			bodyStyle : "border:none;background-color:#DFE8F6;font-size:12px;",
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
		}]
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
				city_area=zhcn.getArea(ci)
				area2.store.loadData(city_area);
				area2.reset();
				area2.enable();

			})
	fs = new Ext.form.FormPanel({
				title : "添加企业",
				autoHeight : true,
				autoWIdth : true,
				layout : "table",
				layoutConfig : {
					columns : 1
				},
				buttonAlign : "center",
				bodyStyle : 'background-color:#DFE8F6;font-size:12px;',
				renderTo : "enterprise_panel",
				items : [basic_area, linkman_area, {
							layout : "form",
							buttonAlign : "center",
							baseCls : 'x-plain',
							buttons : [{
										text : '提交',
										handler : isExistsEName
									}]
						}]
			});
};
// 初始化联系人区域
function initLinkManArea(linkmans) {
	if (!linkmans)
		return;
	for (var i = 0; i < linkmans.length; i++) {
		createLinkManInfo();
		var id = "linkman_info" + (i + 1);
		Ext.fly(id + "_name").dom.value = linkmans[i]["name"];
		Ext.fly(id + "_phone").dom.value = linkmans[i]["phone"];
		Ext.fly(id + "_mobile").dom.value = linkmans[i]["mobile"];
		Ext.fly(id + "_email").dom.value = linkmans[i]["email"];
		Ext.fly(id + "_qq").dom.value = linkmans[i]["qq"];
		Ext.fly(id + "_msn").dom.value = linkmans[i]["msn"];
		Ext.fly(id + "_addr").dom.value = linkmans[i]["addr"];
		Ext.fly(id + "_postcode").dom.value = linkmans[i]["postcode"];
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
						blankText : "请输入邮政编码",
						regex : /^(\d{6}){0,1}$/,
						regexText : "请正确输入邮政编码"
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

// 生成id
function getFId() {
	Ext.lib.Ajax.request("post", "/ep/EnterpriseServlet?type=21", {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("ID生成成功。");
						Ext.fly("emp_id").dom.value = json.result;
					}
				},
				failure : function() {
					Warn_Tip();
				}
			})
};
// 保存信息
function saveInfo() {
	var eid = Ext.fly("emp_id").getValue();
	var ename = Ext.fly("emp_name").getValue();
	//var jname = Ext.fly("emp_jname").getValue();
	var ephone = Ext.fly("emp_phone").getValue();
	var efax = Ext.fly("emp_fax").getValue();
	var epostCode = Ext.fly("emp_postcode").getValue();
	var homepage = Ext.fly("emp_homepage").getValue();
	var eaddr = Ext.fly("emp_addr").getValue();
	var person = Ext.fly("emp_person").getValue();
	var contact = Ext.fly('emp_contact').getValue();
	var emparea = Ext.fly("area_sel").getValue();
	var province =Ext.fly("province_sel").getValue();
	var city = Ext.fly("city_sel").getValue();
	var keyword = Ext.fly("emp_kw").getValue();
	
	var emptype = emp_type.getValue();
	if(!keyword){
		Ext.MessageBox.alert("提示", "关键字不能为空!");
		return;
	}
	/*if (jname.gblen() < 4 || jname.gblen() > 32) {
		Info_Tip("请正确输入企业简称（最少两个汉字）");
		return;
	}*/

	// 联系人信息
	var linkman = "";
	var items = linkman_area.items;
	var length = items.getCount() - 1;
	for (var i = 0; i < length; i++) {
		var itemId = items.itemAt(i + 1).id;
		var info = "";
		var name = Ext.fly(itemId + "_name").getValue().trim();
		var phone = Ext.fly(itemId + "_phone").getValue().trim();
		var mobile = Ext.fly(itemId + "_mobile").getValue().trim();
		var email = Ext.fly(itemId + "_email").getValue().trim();
		var qq = Ext.fly(itemId + "_qq").getValue().trim();
		var msn = Ext.fly(itemId + "_msn").getValue().trim();
		var addr = Ext.fly(itemId + "_addr").getValue().trim();
		var postcode = Ext.fly(itemId + "_postcode").getValue().trim();
		
		
		if (name || phone || mobile || email || qq || msn || addr || postcode) {
			if (!name) {
				Ext.Message.alert("提示", "联系人不能为空!");
				return;
			}
			info = "name:" + name + ",phone:" + phone + ",mobile:" + mobile
					+ ",email:" + email + ",qq:" + qq + ",msn:" + msn
					+ ",addr:" + addr + ",postcode:" + postcode;
		}
		if (info != "" && linkman != "")
			linkman = linkman + "|";
		linkman = linkman + info;
	}

	if (linkman.gblen() > 256) {
		Ext.Message.alert("提示", "联系人太多，请删减联系人数量");
		return;
	}

	
	var content = "";
	content += "eid~" + eid + ";name~" + ename + ";phone~" + ephone + ";fax~" + efax + ";addr~" + eaddr
			+ ";postCode~" + epostCode + ";homePage~" + homepage
			+ ";corpn~" + person + ";area~" + emparea + ";type~" + emptype
			+ ";linkman~" + linkman +  ";contact~" + contact+";province~"+province+";city~"+city;
	//检查关键字
	Ext.Ajax.request({
		url : "/ep/EnterpriseServlet",
		params : {
			type : 51,
			keyword : keyword
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				
				if(json.result != null && json.result.length > 0){
						buildKeywordResultWin(json.result,content,keyword);
				}else{
					submitRequest(content,keyword);
				}
			}

		},
		failure : function() {
			Warn_Tip();
		}
	});


	
	/*if (fs.getForm().isValid()) {
		var content = "";
		content += "eid~" + eid + ";name~" + ename + ";phone~" + ephone + ";fax~" + efax + ";addr~" + eaddr
				+ ";postCode~" + epostCode + ";homePage~" + homepage
				+ ";corpn~" + person + ";area~" + emparea + ";type~" + emptype
				+ ";linkman~" + linkman +  ";contact~" + contact+";province~"+province+";city~"+city;
		Ext.Ajax.request({
					url : "/ep/EnterpriseServlet",
					params : {
						type : 6,
						content : content,
						dec : Ext.fly("emp_desc").getValue(),
						keyword : keyword
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("信息保存成功。", closeWin);
							fs.getForm().reset();
							area1.setDisabled(true);
							area2.setDisabled(true);
							parent.tab_0301_iframe.ds.reload();
						}

					},
					failure : function() {
						Warn_Tip();
					}
				})
	} else
		Info_Tip();*/
};

function submitRequest(content,keyword){
	Ext.Ajax.request({
		url : "/ep/EnterpriseServlet",
		params : {
			type : 6,
			content : content,
			dec : Ext.fly("emp_desc").getValue(),
			keyword : keyword
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Info_Tip("信息保存成功。", closeWin);
				fs.getForm().reset();
				area1.setDisabled(true);
				area2.setDisabled(true);
				parent.tab_0301_iframe.ds.reload();
			}

		},
		failure : function() {
			Warn_Tip();
		}
	});
}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("enterprise_add");
};
function RenderMemberId(memberId){
	if(memberId == null){
		return "";
	}else{
		return memberId;
	}
	
}
function buildKeywordResultWin(obj,content,keyword){
	var htmltext= "";
	Ext.each(obj,function(item){
		htmltext+= "<p style='color:red'>"+item.name+" 账号："+RenderMemberId(item.memberId)+"</p>";
	});
	var msgPanl = new Ext.Panel({
		frame : true,
		width : 360,
		layout : "form",
		autoHeight : true,
		bodyStyle : "margin-right:12px",
		items : [{
			align : 'center',
			autoWidth : true,
			height : 30,
			html : "系统检测出以下"+obj.length+"条疑似已存在企业："
		}, {
			autoWidth : true,
			autoHeight : true,
			html : htmltext
		}]
	});
	keywordResultWin = new Ext.Window({
		title : '系统提示',
		border : false,
		/*autoWidth : true,
		autoHeight : true,*/
		width : 390,
		autoHeight : true,
		region : 'center',
		autoScroll : true,
		resizable : false,
		layout : 'form',
		modal : true,
		//frame : true,
		closeAction : 'hide',
		layoutConfig : {
			columns : 1
		},
		items : [msgPanl],
		buttons : [{
					text : '仍然添加',
					handler : function(){
						keywordResultWin.hide();
						submitRequest(content,keyword);
					}
				},{
					text : '不添加',
					handler : function(){
						keywordResultWin.close();
						closeWin();
					}
				}]
	});
	keywordResultWin.show();
}

function isExistsEName(){
	var ename = Ext.fly("emp_name").getValue();
	Ext.Ajax.request({
		url : "/ep/EnterpriseServlet",
		params : {
			type : 52,
			ename : ename,
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				if(json.result == true){
					Info_Tip("该企业名称已存在，不可添加");
				}else{
					saveInfo();
				}
			}

		},
		failure : function() {
			Warn_Tip();
		}
	});
}