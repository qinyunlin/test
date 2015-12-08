var sunshineForm, guestUnitFieldSet;

var guestUnitId = 0;
var guestUnitNum = 0;
var province = "", city = "";

var addFlag = false;

$.fck.config = {
	path : '/resource/plugins/FCKeditor/',
	height : 500,
	width : 650,
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
	sunshineForm = new Ext.form.FormPanel(
			{
				border : false,
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				width : 800,
				autoHeight : true,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				items : [
						{
							xtype : "fieldset",
							title : "服务介绍",
							width : 780,
							autoHeight : true,
							layout : "table",
							buttonAlign : 'center',
							layoutConfig : {
								columns : 1
							},
							items : [ {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'triggerCondition',
									name : 'triggerCondition',
									fieldLabel : '触发条件',
									xtype : "textfield",
									allowBlank : false,
									width : 650
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'title',
									name : 'title',
									fieldLabel : '信件主题',
									xtype : "textfield",
									allowBlank : false,
									width : 650
								}
							},{
								layout : 'form',
								labelWidth : 100,
								items : [ {
									xtype : 'textarea',
									id : 'introduction',
									fieldLabel : '信件内容',
									width : 350,
									height : 100
								} ]
							} ],
							buttons : [ {
								text : '保存',
								hidden : compareAuth('MESSAGETEMPLATE_ADD'),
								handler : save
							} ]
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

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
   } else {
        return this.replace(reallyDo, replaceWith);
    }
}

//取fck内容的长度
function getFckLength() {
	var content = $.fck.content('introduction', '');
    if (content == null || "" == content) {
        return 0;
    }
    var m_Regex = "<[^>]*>";
    content = content.replaceAll(m_Regex, "");
    content = content.replaceAll(" ", "");
    return content.length;
}

function save() {
	if (addFlag){
		Ext.MessageBox.alert("提示", "请不要进行重复添加！");
		return false;
	}
	if (!sunshineForm.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容！");
		return;
	}
	var triggerCondition = Ext.getCmp("triggerCondition").getValue();//触发条件
	if (triggerCondition.length > 100){
		Ext.MessageBox.alert("提示", "触发条件字数不能超过100个！");
		return false;
	}
	var title = Ext.getCmp("title").getValue(); // 信件主题
	if (title.length > 50){
		Ext.MessageBox.alert("提示", "信件主题字数不能超过50个！");
		return false;
	}
	var introduction = $.fck.content('introduction', '');// 信件内容
	if (getFckLength() > 10000){
		Ext.MessageBox.alert("提示", "信件内容字数不能超过10000个！");
		return false;
	}
	var contents = "triggerCondition~" + triggerCondition + ";title~" + title;
	addFlag = true;
	Ext.Ajax.request({
		url : '/mc/message/MessageServlet.do',
		method : 'POST',
		params : {
			type : 3,
			content : contents,
			introduction : introduction
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox
				.show({
					title : '提示',
					msg : "<center>成功添加模板！</center>",
					width : 250,
					prompt : false,
					buttons : {
						"ok" : "继续添加",
						"cancel" : "返回模板列表"
					},
					multiline : false,
					fn : function(
							btn,
							text) {
						if ("ok" == btn){
							location.reload();
						}else{
							addFlag = true;
							closeWin();
						}
					}
				});
			}else{
				addFlag = false;
			}
		},
		failure : function() {
			addFlag = false;
			Warn_Tip();
		}
	});

}

function closeWin() {
	if (window.parent.tab_1901_iframe){
		window.parent.tab_1901_iframe.ds_info.reload();
	}
	window.parent.Ext.getCmp('center').remove("messageTemplate_add");
};
