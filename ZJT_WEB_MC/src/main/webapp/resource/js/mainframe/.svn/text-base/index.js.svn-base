var password_edit;
var cur_user_id = "";

// 捕捉浏览器关闭 （无法判断关闭与刷新。。）
//window.onbeforeunload  = function(event) {
//	event = (event) ? event : window.event;
//	if (event.clientX > document.body.clientWidth && event.clientY < 0
//			|| event.altKey) {
//		if (confirm("您确认要离开当前页面吗？")) {
//			Ext.lib.Ajax.request('post', '/account/UserLogin.do?method=logout',
//					{
//						success : function(response) {
//							var data = response.responseText;
//							if (data) {
//								window.location.href = "/login.jsp";
//							}
//						},
//						failure : function() {
//
//						}
//					});
//		}
//
//	}
//};

function createNewWidget(id, title, src, reload) {
	if ((reload == undefined) || (reload == null))
		reload = true;
	var center = Ext.getCmp("center");
	var panel = Ext.getCmp(id);
	if (panel) {
		if (reload) {
			var myIframe = "tab_" + id + "_iframe";
			Ext.get(myIframe).dom.src = src;
		}
		center.activate(panel);
		return;
	}
	if (center.items.length > 8) {
		Ext.MessageBox.confirm("温馨提示", "您打开的标签页太多了，为避免影响性能，是否关闭其它不用的标签页。",
				function(op) {
					if (op == "yes") {
						var ctxItem = center.getActiveTab();
						center.items.each(function(item) {
									if (item.closable && item != ctxItem) {
										center.remove(item);
									}
								});
						if (!panel) {
							var newWigth = new Ext.extend(Ext.Panel, {
								id : id,
								title : title,
								tooltip : title,
								lazyClose : true,
								closable : true,
								autoScroll : false,
								layout : "fit",
								html : "<iframe id='tab_"
										+ id
										+ "_iframe' name='tab_"
										+ id
										+ "_iframe' src='"
										+ src
										+ "' style='width:100%;height:100%' frameborder='0'></iframe>"
							});
							panel = new newWigth();
							center.add(panel).show();
							panel.doLayout();
						}
					}
					return;
				});
	} else {
		if (!panel) {
			var newWigth = new Ext.extend(Ext.Panel, {
				id : id,
				title : title,
				tooltip : title,
				lazyClose : true,
				closable : true,
				autoScroll : false,
				layout : "fit",
				html : "<iframe id='tab_"
						+ id
						+ "_iframe' name='tab_"
						+ id
						+ "_iframe' src='"
						+ src
						+ "' style='width:100%;height:100%' frameborder='0'></iframe>"
			});
			panel = new newWigth();
			center.add(panel).show();
			panel.doLayout();
		}
	}
};

/* 退出系统 */
var exitsys = function() {
	Ext.MessageBox.confirm("提示", "确定退出系统？", function(btn) {
				if (btn == "yes") {
					Ext.lib.Ajax.request('post',
							'/account/UserLogin.do?method=logout&site=mc', {
								success : function(response) {
									var data = response.responseText;
									if (data) {
										window.location.href = "/login.jsp";
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							});
				}
			});
};
/* end 退出系统 */

/* 修改密码 */
var buildPasswordEdit = function(adminName) {
	password_edit_form = new Ext.form.FormPanel({
				el : 'password_edit_form',
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
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
									var checkPwd = function(e) {
										if (Ext.fly("pwd").getValue() != Ext
												.fly("pwd_confirm").getValue()) {
											Ext.Msg.alert("提示", "两次输入密码不一致！");
											return;
										}
									};
									this.el.on("blur", checkPwd, this);
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

var editPassword = function() {
	if (Ext.fly("pwd").getValue() == "") {
		Ext.Msg.alert("提示", "密码不能为空！", function() {
					Ext.fly("pwd").focus();
				});
		return;
	}

	Ext.lib.Ajax.request('post', '/mc/AdminManage.do', {
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

var showPasswordEdit = function(adminName) {
	if (password_edit == null) {
		buildPasswordEdit(adminName);
		password_edit.show();
	} else {
		password_edit.show();
	}
};

/* end 修改密码 */

// area win
function openarea() {
	if (currUser_mc.webProvince == "全国") {
		var pro = new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : eval("(" + getPro() + ")")
				});
	} else {
		var pro = new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : eval("(" + getUserWeb() + ")")
				});
	}
	// alert(currUser_mc.webProvince);
	var areasel = new Ext.Panel({
				id : "area_select",
				height : 120,
				autoScroll : true,
				bodyStyle : "padding:20px;",
				split : false,
				items : [area = new Ext.form.ComboBox({
							fieldLabel : "省",
							id : 'area_sel_main',
							width : 200,
							store : pro,
							emptyText : "请选择",
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							value : currUser_mc.currArea
						})]

			});
	var win = new Ext.Window({
				title : '区域选择',
				id : "area_sel",
				closable : true,
				draggable : true,
				width : 320,
				height : 140,
				modal : true,
				border : false,
				plain : true,
				layout : 'fit',
				closeAction : "close",
				items : [areasel],
				buttons : [{
							text : "确定",
							handler : changeArea
						}]
			});
	win.show();
};

function buildTree() {
	var tree = Ext.tree;
	var treeLoader = new tree.TreeLoader({
				dataUrl : '/mc/AdminRoleServlet.do?type=14'
			});

	/* 修改treeLoader返回的数据 */
	treeLoader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		json = json.slice(json.indexOf("["), json.lastIndexOf("]") + 1);
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth" || o.state == "nologin") {
				Ext.MessageBox.alert('提示', o.result);
				o = [];
			}
			node.beginUpdate();
			for (var i = 0, len = o.length; i < len; i++) {
				for (var j = 0; j < o[i].children.length; j++) {
					o[i].children[j].text = o[i].children[j].title;
				}
				
				o[i].text = o[i].title;
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			
			this.runCallback(callback, scope || node, [node]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	
	treePanel = new tree.TreePanel({
				animate : true,
				autoScroll : true,
				loader : treeLoader,
				containerScroll : true,
				rootVisible : false,
				useArrows : true,
				border : false
			});

	var root = new tree.AsyncTreeNode({
				text : '系统',
				draggable : false,
				id : "0"
			});

	treePanel.setRootNode(root);
	treePanel.render('treearea');
	root.expand(false, true);
	// 添加个人信息管理

	var node = {
		text : '个人设置',
		leaf : false,
		id : 'person_manage',
		children : [{
					id : 'person_pwd_edit',
					text : '修改密码',
					leaf : true,
					src : "/module/person/person_pwd_edit.jsp",
					title : '修改密码'
				}, {
					id : 'person_view_config',
					text : '个人操作设置',
					leaf : true,
					src : "/module/person/person_view_config.jsp",
					title : '个人操作设置'
				}, {
					id : 'person_search_config',
					text : '会员搜索设置',
					leaf : true,
					src : "/module/person/person_search_config.jsp",
					title : '会员搜索设置'
				}, {
					id : 'operating_tutor',
					text : '操作指南',
					leaf : true,
					src : "/module/operating_tutor.jsp",
					title : '操作指南'
				}]

	};
	treePanel.getRootNode().appendChild(node);
	treePanel.on("click", function(node) {
				if (node.attributes.id == "person_edit") {
					node.attributes.src = "/module/person/person_edit.jsp?id="
							+ cur_user_id;
				}
				if (node.isLeaf()) {
					createNewWidget(node.attributes.id, node.attributes.title,
							node.attributes.src, false);
				}
			})

};

// 获取个人信息
function getPersonInfo() {
	Ext.lib.Ajax.request("post", "/account/UserLogin.do", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data) {
						currUser_mc = data.result;
						// Ext.fly("area_show").dom.innerHTML =
						// data.result.currArea;
						Ext.fly("cur_user").replaceWith({
									cls : 'x-btn-text',
									html : currUser_mc.uid
								});
						cur_user_id = currUser_mc.uid;
					}

				},
				failure : function() {
					Warn_Tip();
				}
			}, "method=isLogin")

};

// 更改访问区域
function changeArea() {
	if (Ext.isEmpty(area.getValue())) {
		Warn_Tip("请选择访问区域");
		return;
	}
	Ext.lib.Ajax.request("post", "/account/UserLogin.do", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						currUser_mc = data.result;
						Ext.fly("area_show").dom.innerHTML = Ext
								.fly("area_sel_main").getValue();
						Ext.getCmp("area_sel").close();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "method=changeArea&area=" + Ext.fly("area_sel_main").getValue())
};

// 获得个人后台操作配置
function getPersonConfig_Base(sign) {
	if (sign) {
		Ext.Ajax.request({
			url : '/mc/MemberProfileServlet',
			params : {
				type : 6,
				cid : 1,
				site : 'MC'
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					for (var i = 0; i < jsondata.result.length; i++) {
						base_config[jsondata.result[i]['name']] = jsondata.result[i]['content'];
					}

					if (base_config["DEF_DIR"] == undefined
							|| base_config["DEF_DIR"] == null
							|| base_config["DEF_DIR"] == "") {
						createNewWidget("welcome", "操作指南",
								"/module/operating_tutor.jsp", false);
					} else {
						var obj = decodeSearchcontent(base_config["DEF_DIR"]);
						createNewWidget(obj[0]["id"], obj[0]["title"],
								obj[0]["src"], false);
					}
				}
			},
			failure : function() {
				Warn_Tip();
			}

		});
	}
};
