Ext.onReady(init);
var fs, ds, cid, nodeText;
function init() {
	Ext.QuickTips.init(true);
	cid = getCurArgs('id');
	nodeText = decodeURI(getCurArgs('nodeText'));
	if (cid == null || cid == undefined || nodeText == null
			|| nodeText == undefined) {
		Info_Tip("非法访问。", closeWin);
		return;
	}
	buildForm();

};

function closeWin() {
	window.parent.Ext.getCmp('center').remove("email_template_add");
};
function buildForm() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailLabelServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', 'labelName']),
				baseParams : {
					type : 7
				},
				remoteSort : true
			});
	ds.load();
	var input_form = new Ext.form.FieldSet({
		width : 800,
		autoHeight : true,
		padding : 6,
		layout : 'column',
		items : [new Ext.form.FieldSet({
			title : '邮件信息配置',
			width : 780,
			autoHeight : true,
			padding : 6,
			labelAlign : 'right',
			labelWidth : 60,
			layout : 'form',
			buttonAlign : 'center',
			items : [{
				xtype : 'label',
				text : "当前邮件分类:" + nodeText,
				style : 'font-weight:bold;height:26px;padding-left:8px;line-height:26px;'
			}, {
				xtype : 'textfield',
				fieldLabel : '信件名称',
				id : 'email_name',
				name : 'name',
				maxLength : 80,
				width : 656,
				allowBlank : false

			}, {
				xtype : 'textfield',
				fieldLabel : '信件主题',
				name : 'subject',
				id : 'email_subject',
				maxLength : 80,
				width : 656,
				allowBlank : false

			}, {
				layout : 'column',
				items : [{
							columnWidth : 0.45,
							layout : 'form',
							items : {

								xtype : 'combo',
								fieldLabel : '标签内容',
								id : 'email_label',
								store : ds,
								readOnly : true,
								valueField : 'labelName',
								displayField : 'name',
								triggerAction : 'all',
								width : 260

							}
						}, {
							columnWidth : 0.4,
							layout : 'form',
							items : {

								xtype : 'button',
								text : '插入标签',
								handler : function() {
									Ext.getCmp('email_content')
											.insertAtCursor("${"
													+ Ext.getCmp('email_label')
															.getValue() + "}");
								}
							}
						}]
			}, {
				xtype : 'label',
				style : 'color:red;text-align:left;padding-left:10px;height:26px;line-height:26px;',
				text : '选择标签后，点击插入标签，将会为您在信件内容光标处添加上标签的内容标识。此标识将会为您替换你所需要的内容，请不要更改。',
				allowBlank : false,
				width : 616

			}, {
				xtype : 'htmleditorself',
				fieldLabel : '信件内容',
				id : 'email_content',
				name : 'content',
				allowBlank : false,
				width : 656,
				height : 300,
				requestURL : "http://ftp.zjtcn.com",
				requestType : 'RS_INFO',
				fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
			}],
			buttons : [{
						text : '保存',
						handler : saveInfo
					}]
		})]
	});
	fs = new Ext.FormPanel({
				autoWidth : true,
				height : parent.Ext.fly('tab_email_template_add_iframe')
						.getHeight(),
				padding : 6,
				autoScroll : true,
				frame : true,
				buttonAlign : 'center',
				items : input_form,
				renderTo : 'panel',
				buttonAlign : 'center'
			});
};

// 保存内容
function saveInfo() {

	if (fs.getForm().isValid()) {
		var content = "name~" + fs.getForm().items.map["email_name"].getValue()
				+ ";subject~"
				+ fs.getForm().items.map["email_subject"].getValue() + ";cid~"
				+ cid + ';cname~' + nodeText;
		Ext.Ajax.request({
					url : '/email/EmailTemplateServlet',
					params : {
						type : 1,
						content : content,
						desc : fs.getForm().items.map["email_content"]
								.getValue()
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("保存成功。", closeWin);
							window.parent.tab_1101_iframe.ds.reload();

						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();

};