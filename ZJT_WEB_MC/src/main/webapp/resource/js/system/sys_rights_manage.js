var win, fs, grid, store;
var editText = "";
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu1',
						text : '添加权限',
						handler : function() {
							showAddArea();
						}
					}, {
						id : 'rMenu3',
						text : '删除权限',
						handler : function() {
							delRole();
						}
					}]
		});
var buildPanel = function() {
	store = new Ext.data.Store({
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
			dataIndex : 'id'
	});
	grid = new Ext.grid.EditorGridPanel({
				store : store,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : parent.Ext.fly("tab_0101_iframe").getHeight(),
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
							width : 30 
						}), sm, {
							header : '编号',
							dataIndex : 'code',
							sortable : true,
							editor : new Ext.form.TextField({
									/*
										maxLength : 6,
										allowBlank : false
									*/
									})
						}, {
							header : '名称',
							dataIndex : 'name',
							sortable : true,
							width : 200,
							editor : new Ext.form.TextField({
									/*
										maxLength : 48,
										allowBlank : false
									*/	
									})
						}, {
							header : 'field',
							dataIndex : 'fieldName',
							sortable : true,
							width : 200
						}, {
							header : '描述',
							dataIndex : 'description',
							sortable : true,
							editor : new Ext.form.TextField({
										/*
										maxLength : 400,
										allowBlank : true
										*/
									})
						}],
				renderTo : 'grid',
				border : false,
				tbar : [{
							text : '添加权限',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							handler : showAddArea
						}, {
							text : '删除权限',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : delRole
						}]
			});
	store.load();
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	
	grid.on("validateedit", function(e){
		switch(e.field){
			case 'code':
				if (e.value.gblen() == 0 || e.value.gblen() > 6) {
					Ext.Msg.show({
   							title:'提示',
  						 	msg: '权限编码长度不能小于等于0或大于6。',
   							buttons: Ext.Msg.OK,
   							fn: function(){
   								grid.startEditing( e.row, e.column );
   							},
   							icon: Ext.MessageBox.WARNING
						});
					return false;
				}
				break;
			case 'name':
				if (e.value.gblen() > 48) {
					Ext.Msg.show({
   							title:'提示',
  						 	msg: '权限名称长度不能大于48。',
   							buttons: Ext.Msg.OK,
   							fn: function(){
   								grid.startEditing( e.row, e.column );
   							},
   							icon: Ext.MessageBox.WARNING
						});
					return false;
				}
				break ;
			case 'description':
				if (!e.record.data.description && e.value.length == 0){
					return false;
				} 
				if (e.value.gblen() > 400) {
						Ext.Msg.show({
   							title:'提示',
  						 	msg: '权限描述长度不能大于400。',
   							buttons: Ext.Msg.OK,
   							fn: function(){
   								grid.startEditing( e.row, e.column );
   							},
   							icon: Ext.MessageBox.WARNING
						});
						return false;
				}
				break;
		}
		return true;
	});
	
	grid.on('afteredit', function(e) {
				Ext.Msg.wait("正在保存...", "提示");
				Ext.lib.Ajax.request('post', '/mc/AdminRoleServlet.do', {
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (data && data.state == 'success') {
									Ext.MessageBox.alert("提示", "修改成功！");
									store.reload();
									// Ext.Msg.hide();
								} else {
									Ext.MessageBox.alert("提示", "修改失败！");
								}
							},
							failure : function() {
								Ext.Msg.alert('警告', '操作失败。');
							}
						}, "type=11&id="
								+ e.record.data.id
								+ "&gname="
								+ e.record.data.name
								+ "&gcode="
								+ e.record.data.code
								+ "&description="
								+ (e.record.data.description == null
										? ""
										: e.record.data.description));
			});
			
};

var init = function() {
	Ext.TipSelf.msg('提示', '双击列表可以编辑信息，编辑完毕按回车可进行保存。');
	Ext.QuickTips.init();
	buildPanel();
};

function showAddArea() {
	fs = new Ext.form.FormPanel({
				autoWidth : true,
				height : 130,
				bodyStyle : 'padding:6px',
				labelWidth : 60,
				layout : 'form',
				items : [{
							xtype : 'textfield',
							id : 'code_input',
							fieldLabel : '权限码',
							allowBlank : false,
							maxLength : 6
						}, {
							xtype : 'textfield',
							id : 'name_input',
							fieldLabel : '权限名称',
							allowBlank : false,
							maxLength : 48
						}, {
							xtype : 'textfield',
							id : 'field_input',
							fieldLabel : '标识',
							allowBlank : false,
							maxLength : 48
						}, {
							xtype : 'textfield',
							id : 'desc_input',
							fieldLabel : '描述',
							maxLength : 400
						}]
			});
	win = new Ext.Window({
				title : '添加权限',
				width : 360,
				autoHeight : true,
				modal : true,
				items : fs,
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							handler : addRole
						}, {
							text : '取消',
							handler : function() {
								win.close()
							}
						}]
			});
	win.show();
};

// 添加权限
function addRole() {
	if (fs.getForm().isValid()) {
		var content = "code~" + fs.getForm().items.map["code_input"].getValue()
				+ ";name~" + fs.getForm().items.map["name_input"].getValue()
				+ ";fieldName~"
				+ fs.getForm().items.map["field_input"].getValue()
				+ ";description~"
				+ fs.getForm().items.map["desc_input"].getValue();
		Ext.Ajax.request({
			url : '/mc/AdminRoleServlet.do',
			params : {
				type : 10,
				content : content
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("保存成功。");
					win.close();
					store.reload();
				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();
};

// 删除权限
function delRole() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	if(rows.length>1)
	{
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	}
	Ext.Msg.confirm("提示", "您确定要删除该权限?", function(op){
	if(op == "yes"){
			Ext.Ajax.request({
				url : '/mc/AdminRoleServlet.do',
				params : {
					type : 12,
					id : rows[0].get('id')
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("删除成功。");
						store.reload();
					}

				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	})
};

Ext.onReady(init);