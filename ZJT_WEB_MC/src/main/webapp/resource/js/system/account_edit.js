var account_edit_form, password_edit, password_edit_form, user_store, userId;

//
var getArgs = function(sArgName, sHref) {
	if (sHref == "" || sHref == null) {
		sHref = window.location.href;
	}
	var args = sHref.split("?");
	var retval = "";
	if (args[0] == sHref) {
		return retval;
	}
	var str = args[1];
	var spec = str.indexOf("#");
	if (spec != -1)
		str = str.substring(0, spec)
	args = str.split("&");
	var len = args.length;
	for (var i = 0; i < len; i++) {
		str = args[i];
		var arg = str.split("=");
		if (len < 1)
			continue;
		if (arg[0] == sArgName)
			retval = arg[1];
	}
	return retval;
}

var buildAccountEditPanel = function() {
	var role_store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['code', 'id', 'name', 'roles']),
				baseParams : {
					type : 4
				},
				remoteSort : true
			});
	Ext.lib.Ajax.request('post', '/mc/AdminManage.do', {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data && data.state == 'success') {
				user_store = data.result;
				account_edit_form = new Ext.form.FormPanel({
							border : false,
							layout : 'form',
							frame : true,
							buttonAlign : 'center',
							labelAlign : 'right',
							labelWidth : 100,
							items : [{
										layout : 'form',
										items : {
											id : 'adminName',
											fieldLabel : '用户名',
											name : 'adminName',
											value : user_store.memberID,
											readOnly : true,
											xtype : "textfield",
											width : 180
										}
									}, {
										layout : 'form',
										items : {
											id : 'trueName',
											fieldLabel : '真实姓名',
											name : 'trueName',
											value : user_store.trueName,
											readOnly : true,
											xtype : "textfield",
											width : 180
										}
									}, {
										layout : 'form',
										items : new Ext.form.ComboBox({
													id : 'roleName',
													name : 'name',
													hiddenName : "role",
													fieldLabel : '用户角色',
													width : 180,
													store : role_store,
													typeAhead : true,
													mode : 'remote',
													triggerAction : 'all',
													emptyText : user_store.roleName,
													valueField : "code",
													displayField : "name",
													readOnly : true
												})
									}, {
										id : 'type',
										name : 'type',
										xtype : 'textfield',
										inputType : 'hidden',
										emptyText : '4'
									}],
							buttons : [{
										text : '提交',
										handler : editAccount
									}, {
										text : '关闭',
										handler : function() {
											window.parent.Ext.getCmp('center')
													.remove("account_edit");
										}
									}]
						});
				new Ext.Panel({
							border : false,
							frame : true,
							layout : 'column',
							renderTo : 'account_edit',
							items : [{
										columnWidth : .30,
										html : '&nbsp;'
									}, {
										columnWidth : .40,
										items : {
											columnWidth : 1,
											items : account_edit_form
										}
									}, {
										columnWidth : .30,
										html : '&nbsp;'
									}]
						});
			} else if (data && data.state == 'failed') {
				Ext.Msg.alert("提示", data.result);
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	}, "adminName=" + userId + "&type=2");
};

var buildPasswordEdit = function(adminName) {
	password_edit_form = new Ext.form.FormPanel({
				el : 'password_edit_form',
				layout : 'table',
				frame : true,
				labelAlign : 'right',
				height : 100,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : {
								id : 'pwd',
								fieldLabel : '密码',
								name : 'pwd',
								maxLength : 50,
								minLength : 5,
								xtype : "textfield",
								inputType : 'password'
							}
						}, {
							layout : 'form',
							items : {
								id : 'pwd_confirm',
								name : 'pwd_confirm',
								fieldLabel : '重复密码',
								xtype : "textfield",
								inputType : 'password',
								initEvents : function() {
									this.el.on("blur", confirmPwd, this);
								}
							}
						}, {
							id : 'adminName_p',
							name : 'adminName_p',
							xtype : 'textfield',
							inputType : 'hidden',
							emptyText : adminName

						}, {
							id : 'type_p',
							name : 'type_p',
							xtype : 'textfield',
							inputType : 'hidden',
							emptyText : '6'
						}]
			});
	password_edit = new Ext.Window({
				el : 'password_edit',
				width : 350,
				height : 173,
				title : '修改密码',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				items : [{
							columnWidth : 1,
							items : {
								items : password_edit_form
							}
						}],
				buttons : [{
							text : '修改',
							handler : function() {
								editPassword();
							}
						}, {
							text : '取消',
							handler : function() {
								password_edit.hide();
							}
						}]
			});

}

var showPasswordEdit = function(adminName) {
	if (password_edit == null) {
		buildPasswordEdit(adminName);
		password_edit.show();
	} else {
		password_edit.show();
	}
};

var confirmPwd = function(e) {
	if (Ext.fly("pwd").getValue() != Ext.fly("pwd_confirm").getValue()) {
		Ext.Msg.alert("提示", "两次输入密码不一致！");
		return false;
	}
};

var editAccount = function() {
	Ext.Msg.confirm("提示", "你确认要修改该帐号吗?", function(op){
		if(op == "yes"){
			Ext.lib.Ajax.request('post', '/mc/AdminManage.do', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state)) {
						Ext.MessageBox.alert("提示", "修改成功！");
						window.parent.tab_0104_iframe.store.reload();
					} else {
						Ext.MessageBox.alert("提示", "修改失败！");
					}

				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, account_edit_form.getForm().getValues(true) + "&roleName="
					+ Ext.fly("roleName").getValue());
		}
	});
	
};

var editPassword = function() {
	if (confirmPwd() == false)
		return false;
	if (Ext.fly("pwd").getValue().length < 5
			|| Ext.fly("pwd").getValue().length > 50) {
		Ext.MessageBox.alert("提示", '密码长度只能在5-50之间！')
		return false;
	}
	if (Ext.fly("pwd").getValue() == "") {
		Ext.Msg.alert("提示", "密码不能为空！", function() {
					Ext.fly("pwd").focus();
				});
		return;
	}

	Ext.lib.Ajax.request('post', '/mc/AdminManage.do?type=6', {
				success : function(response) {
					if (response.responseText.toString() != "") {
						Ext.MessageBox.alert("提示", "修改失败！");
					} else {
						Ext.MessageBox.alert("提示", "修改成功！");
						password_edit_form.form.reset();
						password_edit.hide();
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, password_edit_form.getForm().getValues(true) + "&adminName="
					+ Ext.get('adminName_p').getValue() + "&type="
					+ Ext.get('type_p').getValue());
};

var init = function() {
	userId = getArgs("userId");
	Ext.QuickTips.init()
	buildAccountEditPanel();
};

Ext.onReady(init);