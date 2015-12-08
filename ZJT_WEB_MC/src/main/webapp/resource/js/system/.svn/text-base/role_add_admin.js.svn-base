var role_add_form;
var grid;
var buildFormPanel = function() {

	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ['id', 'code', 'name', 'fieldName', 'description']),
				baseParams : {
					type : 9
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				width : 25
			});
	grid = new Ext.grid.GridPanel({
				autoScroll : true,
				store : store,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : 508,
				sm : sm,
				columns : [sm, {
							header : '编号',
							dataIndex : 'code',
							sortable : true
						}, {
							header : '名称',
							dataIndex : 'name',
							sortable : true,
							width : 200
						}, {
							header : 'field',
							dataIndex : 'fieldName',
							sortable : true,
							width : 200
						}, {
							header : '描述',
							dataIndex : 'description',
							sortable : true
						}]
			});
	store.load();
	role_add_form = new Ext.form.FormPanel({
				border : false,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				frame : true,
				buttonAlign : 'left',
				labelAlign : 'right',
				labelWidth : 100,
				items : [{
							layout : 'form',
							items : {
								id : 'gcode',
								fieldLabel : '编 码',
								name : 'gcode',
								width : 164,
								xtype : "textfield"
							}
						}, {
							layout : 'form',
							items : {
								id : 'gname',
								fieldLabel : '名 称',
								name : 'gname',
								xtype : "textfield",
								width : 164
							}
						}, {
							colspan : 2,
							items : grid
						}, {
							id : 'type',
							xtype : 'textfield',
							inputType : 'hidden',
							emptyText : '3'
						}],
				buttons : [{
													xtype : "button",
													text : '提交',
													width:50,
													handler : addRole
												},{
													xtype : "button",
													text : '重置',
													width:50,
													handler : function() {
														role_add_form.form
																.reset();
													}
												},{
										xtype : "button",
										text : '关闭',
										width:50,
										handler : function() {
											window.parent.Ext.getCmp('center')
													.remove("role_add_admin");
										}
									}]
			});

	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'column',
				renderTo : 'role_add_admin',
				items : [{
							columnWidth : .01,
							html : '&nbsp;'
						}, {
							columnWidth : .9,
							items : {
								items : role_add_form
							}
						}, {
							columnWidth : .09,
							html : '&nbsp;'
						}]

			});
};

var addRole = function() {
	if (Ext.fly("gcode").getValue() == "") {
		Ext.Msg.alert("提示", "编码不能为空！", function() {
					Ext.fly("gcode").focus();
				});
		return;
	}
	if (Ext.fly("gname").getValue() == "") {
		Ext.Msg.alert("提示", "名称不能为空！", function() {
					Ext.fly("gname").focus();
				});
		return;
	}
	var groles = "";
	var groles = [];
	for (var i = 0; i < grid.selModel.selections.items.length; i++) {
		groles.push(grid.selModel.selections.items[i].data.code);
	}
	groles = groles.toString();
	Ext.lib.Ajax.request('post', '/mc/AdminRoleServlet.do', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state)) {
						Ext.MessageBox.alert("提示", "增加成功！");
						parent.tab_0103_iframe.ds.reload();
						role_add_form.form.reset();
					} else {
						Ext.MessageBox.alert("提示", "增加失败！");
						role_add_form.form.reset();
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, role_add_form.getForm().getValues(true) + "&groles=" + groles);
};
var init = function() {
	Ext.QuickTips.init(true);
	Ext.TipSelf.msg('提示', '填写完编码和名称后，可在列表内勾选为其添加相应的权限。');
	buildFormPanel();
};

Ext.onReady(init);