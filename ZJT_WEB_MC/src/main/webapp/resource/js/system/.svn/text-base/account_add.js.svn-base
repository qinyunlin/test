var account_add_form, win, user_store, account_add_grid, trueName;
var buildFormPanel = function() {
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

	account_add_form = new Ext.form.FormPanel({
				border : false,
				layout : 'form',
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				items : [{
							layout : 'form',
							items : [{
										layout : "form",
										items : [{
													id : 'adminName',
													fieldLabel : '用户名',
													name : 'adminName',
													maxLength : 50,
													width : 164,
													readOnly : true,
													allowBlank : false,
													xtype : "textfield"
												}, {
													bodyStyle : "padding-left:104px;",
													items : [{
																xtype : "button",
																text : "选择会员",
																handler : selUser
															}]
												}]
									}]
						}, {}, {
							layout : 'form',
							items : {
								id : 'roleName',
								name : 'roleName',
								hiddenName : "role",
								fieldLabel : '用户角色',
								store : role_store,
								typeAhead : true,
								mode : 'remote',
								triggerAction : 'all',
								emptyText : '请选择用户角色',
								valueField : "code",
								displayField : "name",
								readOnly : true,
								xtype : "combo"
							}
						}, {
							id : 'type',
							xtype : 'textfield',
							inputType : 'hidden',
							emptyText : '3'
						}],
				buttons : [{
							text : '提交',
							handler : addAccount
						}, {
							text : '重置',
							handler : function() {
								account_add_form.form.reset();
							}
						}, {
							text : '关闭',
							handler : function() {
								window.parent.Ext.getCmp('center')
										.remove("account_add");
							}
						}]
			});

	new Ext.Panel({
				border : false,
				autoWidth : true,
				autoHeight : true,
				frame : true,
				layout : 'column',
				renderTo : 'account_add',
				items : [{
							columnWidth : .35,
							html : '&nbsp;'
						}, {
							columnWidth : .30,
							items : {
								items : account_add_form
							}
						}, {
							columnWidth : .35,
							html : '&nbsp;'
						}]

			});
};

var addAccount = function() {
	if (Ext.fly("adminName").getValue() == "") {
		Ext.Msg.alert("提示", "用户名不能为空！", function() {
					Ext.fly("adminName").focus();
				});
		return;
	}
	if (Ext.fly("roleName").getValue() == "请选择用户角色") {
		Ext.Msg.alert("提示", "请选择用户角色！", function() {
					Ext.fly("roleName").focus();
				});
		return;
	}

	Ext.lib.Ajax.request('post', '/mc/AdminManage.do?type=3', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Ext.MessageBox.alert("提示", "增加成功！", function() {
									window.parent.Ext.getCmp('center')
											.remove("account_add");
								});
						account_add_form.form.reset();
						window.parent.tab_0104_iframe.store.reload();
					} 
				},
				failure : function() {
					Warn_Tip();
				}
			}, account_add_form.getForm().getValues(true) + "&roleName="
					+ Ext.fly("roleName").getValue() + "&trueName=" + trueName);
};
// 选择会员
function selUser() {
	user_store = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "memberID", "degree", "trueName", "corpName",
								"loginNum", "createOn", "validDate",
								"searchTimes"]),
				baseParams : {
					method : "searchPaged",
					pageNo : 1,
					validDate : 1,
					memberType : 0,
					pageSize : 20
				},
				countUrl : '/mc/Member.do',
				countParams : {
					method : "searchCount",
					memberType : 0,
					validDate : 1
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : user_store,
				displayInfo : true
			});
	account_add_grid = new Ext.grid.GridPanel({
				store : user_store,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : '会员类型',
							sortable : false,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						}, {
							header : '公司名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : "有效期限",
							sortable : true,
							dataIndex : "validDate"
						}],
				viewConfig : {
					forceFit : true
				},
				bbar : pagetool,
				tbar : [{
							xtype : "label",
							text : "用户ID："
						}, {
							xtype : "textfield",
							id : "name_input"
						}, {
							text : '查询',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}]
			});
	win = new Ext.Window({
				title : "选择会员",
				closable : true,
				draggable : true,
				width : 640,
				height : 420,
				modal : true,
				border : false,
				plain : true,
				layout : 'fit',
				closeAction : "close",
				items : [account_add_grid]
			});
	account_add_grid.on("rowclick", function(grid, rowIndex, r) {
				checkMem();
			});
	user_store.load();
	win.show();
	Ext.TipSelf.msg('提示', '单击用户后可进行选择操作。');
};

// 查询会员
function searchlist() {
	user_store.baseParams["content"] = "memberID~"
			+ Ext.fly("name_input").getValue();
	user_store.countParams["content"] = "memberID~"
			+ Ext.fly("name_input").getValue();
	user_store.load();
};

// 选中会员
function checkMem() {
	var row = account_add_grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择会员");
		return;
	}
	var mid = row.get("memberID");
	trueName = encodeURI(row.get("trueName"));
	Ext.fly("adminName").dom.value = mid;
	win.close();
};
var init = function() {
	Ext.QuickTips.init(true);
	buildFormPanel();
	selUser();
};

Ext.onReady(init);