var card_member_win, card_member_form;
var buildFormPanel = function() {			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 95,
				labelAlign : 'left',
				items : [{
							fieldLabel : '后台管理专用'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,											
											items : {
												xtype : "button",
												text : "生成权限文件",
												height : 30,
												width : 180,
												formAlign : 'left',
												handler : function() {
													genAuditFile();
												}
											}
						}]
							}	
						}]

			});
			
			
			
			
	
	new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'right',
				items : [{
							fieldLabel : '造价通中国'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('cn');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('cn');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'right',
				items : [{
							fieldLabel : '造价通四川'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('sc');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('sc');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'left',
				items : [{
							fieldLabel : '造价通广东'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('gd');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('gd');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'right',
				items : [{
							fieldLabel : '网材网'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('wcw');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('wcw');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'right',
				items : [{
							fieldLabel : '造价通深圳'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('sz');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('sz');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'right',
				items : [{
							fieldLabel : '造价通广西'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('gx');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('gx');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 65,
				labelAlign : 'right',
				items : [{
							fieldLabel : '造价通天津'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('tj');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('tj');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 85,
				labelAlign : 'left',
				items : [{
							fieldLabel : '造价通黑龙江'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('hlj');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('hlj');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			new Ext.Panel({
				border : false,
				frame : true,
				// layout : 'column',
				layout : 'form',
				renderTo : 'sys_config',
				labelWidth : 85,
				labelAlign : 'left',
				items : [{
							fieldLabel : '造价通内蒙古'
						},{
							columnWidth : .30,
							items : {
								layout : 'table',
								layoutConfig : {
									columns : 5
								},
								frame : true,
								labelAlign : 'center',
								buttonAlign : 'center',
								autoWidth : true,
								hideBorders : true,
								bodyStyle : 'padding:6px',
								items : [{
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成所有Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genAllHtml('nmg');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}, {
											layout : 'form',
											height : 40,
											items : {
												xtype : "button",
												text : "生成一级Html页面",
												height : 30,
												width : 180,
												handler : function() {
													genIndexHtml('nmg');
												}
											}
										}, {
											bodyStyle : "border:none",
											width : 10
										}]
							}
						}]

			});
			
			

			
};

/* 生成持卡会员 */
var buildCardMember = function(adminName) {
	card_member_form = new Ext.form.FormPanel({
				el : 'card_member_form',
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				frame : true,
				labelAlign : 'right',
				height : 130,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : {
								id : 'prefix',
								name : 'prefix',
								fieldLabel : '会员id前缀',
								xtype : "textfield",
								allowBlank : false
							}
						}, {
							layout : 'form',
							items : {
								id : 'start',
								name : 'start',
								fieldLabel : '会员id开始数',
								xtype : "textfield",
								allowBlank : false,
								regex : /^\d+$/,
								regexText : "开始数必须是数字"
							}
						}, {
							layout : 'form',
							items : {
								id : 'end',
								name : 'end',
								fieldLabel : '会员id结束数',
								xtype : "textfield",
								allowBlank : false,
								regex : /^\d+$/,
								regexText : "结束数必须是数字"
							}
						}, {
							layout : 'form',
							items : {
								id : 'pwd',
								name : 'pwd',
								fieldLabel : '会员开始密码',
								allowBlank : false,
								xtype : "textfield",
								regex : /^\d+$/,
								regexText : "开始密码必须是数字"
							}
						}, {
							layout : 'form',
							items : {
								id : 'type',
								name : 'type',
								xtype : "textfield",
								inputType : 'hidden',
								emptyText : '8'
							}
						}]
			});
	card_member_win = new Ext.Window({
				el : 'card_member_win',
				width : 350,
				height : 203,
				title : '生成持卡会员',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				items : [{
							columnWidth : 1,
							items : {
								items : card_member_form
							}
						}],
				buttons : [{
							text : '生成',
							handler : function() {
								genMember();
							}
						}, {
							text : '取消',
							handler : function() {
								card_member_win.hide();
							}
						}]
			});

}

var showCardMember = function() {
	if (card_member_win == null) {
		buildCardMember();
		card_member_win.show();
	} else {
		card_member_win.show();
	}
};

var genMember = function() {
	Ext.lib.Ajax.request('post', '/sys/SystemConfig.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "成功！");
						card_member_form.form.reset();
						card_member_win.hide();
					} else if (data && data.state == 'failed') {
						Ext.MessageBox.alert("提示", "失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, card_member_form.getForm().getValues(true));

};

/* end 生成持卡会员 */

var reload = function(type) {
	Ext.lib.Ajax.request('post', '/sys/SystemConfig.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "成功！");
					} else if (data && data.state == 'failed') {
						Ext.MessageBox.alert("提示", "失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, "type=" + type);
};

var genAllHtml = function(cn_area) {
	Ext.Ajax.request({
				url : '/sys/SystemConfig.do',
				params : {
					type : 10,
					m : 'all',
//					site : Ext.getCmp("site").getValue()
					site : cn_area
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Info_Tip("成功！");
					} else if (data && data.state == 'failed') {
						Info_Tip("失败！");
						return;
					} else if (data && data.state == 'auth') {
						Info_Tip("权限不足！");
						return;
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

var genIndexHtml = function(cn_area) {
	Ext.Ajax.request({
				url : '/sys/SystemConfig.do',
				params : {
					type : 10,
					m : 'index',
//					site : Ext.getCmp("site").getValue()
					site : cn_area
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Info_Tip("成功！");
					} else if (data && data.state == 'failed') {
						Info_Tip("失败！");
						return;
					} else if (data && data.state == 'auth') {
						Info_Tip("权限不足！");
						return;
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

var genAuditFile = function() {
	Ext.lib.Ajax.request('post', '/sys/SystemConfig.do', {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("权限文件生成成功。您可以在/file目录下找到权限文件authcode.json");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "type=9");
};

var init = function() {
	Ext.QuickTips.init();
	buildFormPanel();
};

Ext.onReady(init);