var role_edit_form, grid;
var gcode, gname;
var sm;
var data, store;
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

var buildRoleEditPanel = function() {
	Ext.lib.Ajax.request('post', '/mc/AdminRoleServlet.do', {
				success : function(response) {
					data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {

						sm = new Ext.grid.CheckboxSelectionModel({
									width : 25
								});
						store = new Ext.data.Store({
									proxy : new Ext.data.HttpProxy({
												url : '/mc/AdminRoleServlet.do'
											}),
									reader : new Ext.data.JsonReader({
												root : 'result',
												id : 'id'
											}, ['id', 'code', 'name',
													'fieldName', 'description']),
									baseParams : {
										type : 9
									},
									remoteSort : true
								});

						store.on('load', function(sto, r, o) {
									var rows = [];
									for (var i = 0; i < data.result.length; i++) {
										var code = data.result[i];
										var j = 0;
										sto.data.each(function(s) {
													if (code == s.data.code) {
														rows.push(j);
													}
													j++;
												});
									}
									sm.selectRows(rows);
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
						grid.on("cellclick", function(grid, rowIndex,
										columnIndex, e) {
									if (columnIndex > 1)
										return false;
								});
						role_edit_form = new Ext.form.FormPanel({
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
													xtype : "textfield",
													value : gcode,
													readOnly : true
												}
											}, {
												layout : 'form',
												items : {
													id : 'gname',
													fieldLabel : '名 称',
													name : 'gname',
													xtype : "textfield",
													width : 164,
													value : gname
												}
											}, {
												colspan : 2,
												items : grid
											}, {
												id : 'type',
												xtype : 'textfield',
												inputType : 'hidden',
												emptyText : '5'
											}],
									buttons : [{
												xtype : "button",
												text : '提交',
												width : 50,
												handler : editRole
											}, {
												xtype : "button",
												text : '重置',
												width : 50,
												handler : resetRole
											}, {
												xtype : "button",
												text : '关闭',
												width : 50,
												handler : function() {
													window.parent.Ext
															.getCmp('center')
															.remove("role_edit_admin");
												}
											}]
								});

						new Ext.Panel({
									border : false,
									frame : true,
									layout : 'column',
									autoWidth : true,
									autoHeight : true,
									renderTo : 'role_edit_admin',
									items : [{
												columnWidth : .01,
												html : '&nbsp;'
											}, {
												columnWidth : .9,
												items : {
													items : role_edit_form
												}
											}, {
												columnWidth : .09,
												html : '&nbsp;'
											}]

								});
						store.load();
					} else if (data && data.state == 'failed') {
						Ext.Msg.alert(data.result);
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, "gcode=" + gcode + "&type=1");

};

//重置角色
var resetRole = function(){
	
	var rows = [];
	for (var i = 0; i < data.result.length; i++) {
		var code = data.result[i];
		var j = 0;
		
		store.data.each(function(s) {
			if (code == s.data.code) {
				rows.push(j);
			}
			j++;
		});
		
	}
	sm.selectRows(rows);
	
}
var editRole = function() {
	var groles = [];
	for (var i = 0; i < grid.selModel.selections.items.length; i++) {
		groles.push(grid.selModel.selections.items[i].data.code);
	}
	groles = groles.toString();
	Ext.Msg.confirm("提示", "您确认要修改该角色吗?", function(op){
		if(op == "yes"){
			Ext.lib.Ajax.request('post', '/mc/AdminRoleServlet.do', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state)) {
						Ext.MessageBox.alert("提示", "修改成功！",function(){
							parent.Ext.getCmp("center").remove("role_edit_admin");
						});
						parent.tab_0103_iframe.ds.reload();
					} else {
						Ext.MessageBox.alert("提示", "修改失败！");
					}

				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, role_edit_form.getForm().getValues(true) + "&groles=" + groles);
		}
	});
	
};

var init = function() {
	gcode = decodeURI(getArgs("gcode"));
	gname = decodeURI(getArgs("gname"));
	Ext.QuickTips.init(true);
	Ext.TipSelf.msg('提示', '填写完编码和名称后，可在列表内勾选为其添加相应的权限（已勾选的表示拥有该权限）。');
	buildRoleEditPanel();
};

Ext.onReady(init);