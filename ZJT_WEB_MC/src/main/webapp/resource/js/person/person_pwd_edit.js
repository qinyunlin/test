Ext.onReady(init);
var ds, fs;
//var mid;
function init() {
	//if (!Ext.isEmpty(getCurArgs("id"))) {
	//	mid = getCurArgs("id");
		buildPanel();
	//}
};

function buildPanel() {
	fs = new Ext.FormPanel({
				layout : 'form',
				bodyStyle : 'padding:6px',
				items : [new Ext.form.FieldSet({
							title : '修改密码',
							layout : 'table',
							width:640,
							autoHeight : true,
							labelWidth : 60,
							buttonAlign : 'center',
							labelAlign : 'right',
							layoutConfig : {
								columns : 3
							},
							items : [{
										layout : 'form',
										xtype : 'container',
										items : {
											fieldLabel : '原始密码',
											xtype : 'textfield',
											id : 'old_pwd',
											inputType : 'password',
											allowBlank : false
										}
									}, {
										layout : 'form',
										xtype : 'container',
										items : {
											fieldLabel : '新密码',
											xtype : 'textfield',
											id : 'new_pwd',
											inputType : 'password',
											allowBlank : false,
											maxLength : 20,
											regex : formMsg.userpwdPatrn,
											regexText : formMsg.userpwdErrMsg
										}
									}, {
										layout : 'form',
										xtype : 'container',
										items : {
											fieldLabel : '确认密码',
											xtype : 'textfield',
											id : 'confirm_pwd',
											inputType : 'password',
											allowBlank : false,
											maxLength : 20,
											regex : formMsg.userpwdPatrn,
											regexText : formMsg.userpwdErrMsg
										}
									}],
							buttons : [{
										text : '修改',
										handler  : submitPwd
									}]
						})],
				renderTo : 'panel'
			});
};

//submit pwd
function submitPwd(){
	if(fs.getForm().isValid()){
		if(fs.getForm().items.map["new_pwd"].getValue()!=fs.getForm().items.map["confirm_pwd"].getValue()){
			Info_Tip("确认密码与新密码不一致，请重新输入。");
		}
		else{
			Ext.Msg.confirm("提示", "你确定要修改密码吗?", function(button){
				if(button == "yes"){
					Ext.lib.Ajax.request('post', '/account/Member.do', {
						success : function(response) {
							var json = eval("(" + response.responseText + ")");
							var state = json.state;
							var result = json.result;
							if (state == "success") {
								Ext.MessageBox.alert("提示", "修改成功！", function(){
									window.parent.Ext.getCmp('center').remove('person_pwd_edit');
								});
							} else {
								if(result != null && result.length > 0)
									Ext.MessageBox.alert("提示", result);
								else
									Ext.MessageBox.alert("提示", "修改失败！");
							}
						},
						failure : function() {
							Ext.Msg.alert('警告', '操作失败。');
						}
					}, "method=changePWD&op=" + fs.getForm().items.map["old_pwd"].getValue()
				 	+ "&np=" + fs.getForm().items.map["new_pwd"].getValue());
				}
			});
		}
	}
	else if (fs.getForm().items.map["new_pwd"].getValue.length < 6){
			Info_Tip("密码长度不能小于6或大于20。");
	}
	else
		Info_Tip();
};