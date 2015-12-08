var ds, grid;
var buildGrid = function() {

	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ResType.do?type=1'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'ename', 'cname', 'suffix', 'status','size','modify_user','modify_time'])
			});
	ds.load();
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), cm, {
							header : '类型ID',
							width : 10,
							sortable : true,
							dataIndex : 'id'
						}, {
							header : '英文名称',
							width : 30,
							sortable : true,
							dataIndex : 'ename',
							editor : new Ext.form.TextField()
						}, {
							header : '中文名称',
							width : 30,
							sortable : true,
							dataIndex : 'cname',
							editor : new Ext.form.TextField()	
						}, {
							header : '后缀',
							width : 30,
							sortable : true,
							dataIndex : 'suffix',
							editor : new Ext.form.TextField()
						}, {
							header : '状态',
							width : 20,
							sortable : true,
							dataIndex : 'status',renderer:function(value,cellmeta,record){
							if(value=="1")
								return '<input type="radio" name="status'+record.id+'" value="1" checked="true" onChange="changed('+record.id+',this)"/> 开启'
								+'   <input type="radio" value="0" name="status'+record.id+'" onChange="changed('+record.id+',this)"/> 关闭';
							return '<input type="radio" name="status'+record.id+'" value="1"onChange="changed('+record.id+',this)"/> 开启'
							+'   <input type="radio" name="status'+record.id+'" value="0" checked="true" onChange="changed('+record.id+',this)"/> 关闭';
							}
						},{
							header : '大小',
							width : 10,
							sortable : true,
							dataIndex : 'size',
							editor : new Ext.form.TextField()
						},{
							header : '创建人',
							width : 20,
							sortable : true,
							dataIndex : 'modify_user'
						},{
							header : '修改时间',
							width : 20,
							sortable : true,
							dataIndex : 'modify_time'
						}
						],
				tbar : [{
					text : '新增',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/add.gif',
					hidden : false,
					handler : showAddType
				}, '-', {
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/delete.gif',
					hidden : false,
					handler: del
				}, '->', '双击表格可以修改资料'],		
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel()
			});
	
	grid.on('afteredit', function(e) {
		if (e.record.data.ename == ""||e.record.data.cname == "" || e.record.data.suffix ==  ""|| e.record.data.size =="") {
			Ext.Msg.alert("提示", "资源类型信息不能为空！", function() {
						Ext.fly(this).focus();
					});
			return;
		}
		Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request('post', '/ResType.do', {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {
											ds.load();
											Ext.MessageBox.alert("提示", "修改成功！");
										} else {
											Ext.MessageBox.alert("提示", "修改失败！");
										}
									},
									failure : function() {
										Ext.Msg.alert('警告', '操作失败。');
									}
								}, "id=" + e.record.data.id + "&type=5&cname="
										+ e.record.data.cname+"&ename="+e.record.data.ename+
										"&suffix="+e.record.data.suffix+"&size="+e.record.data.size);
					}
				});
	});

};
var changed = function(id,radio) {
	var msg ="开启";
	if(radio.value=="0")
		msg = "关闭";
	Ext.Msg.confirm("提示", "您确定要"+msg+"该类型资源?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request('post', '/ResType.do', {
								success : function(response) {
									var data = eval("("
											+ response.responseText + ")");
									if (getState(data.state, commonResultFunc, data.result)) {
										ds.load();
										Ext.MessageBox.alert("提示", msg+"成功！");
									} else {
										Ext.MessageBox.alert("提示", msg+"失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, "id="+id + "&type=5&status="+radio.value);
				}
				else{
					if(radio.value=='0')
						radio.previousSibling.previousSibling.checked=true;
					else
						radio.nextSibling.nextSibling.checked=true;
				}
			});
}
/* 新增类型 */
var addTypeWin;
var addTypeForm;
var buildAddType = function() {
	addTypeForm = new Ext.form.FormPanel({
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				frame : true,
				labelAlign : 'right',
				height : 150,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : [{
								id : 'ename',
								fieldLabel : '类型英文名称',
								name : 'ename',
								xtype : "textfield"
							},{
								id : 'cname',
								fieldLabel : '类型中文名称',
								name : 'cname',
								xtype : "textfield"
							},{
								id : 'suffix',
								fieldLabel : '后缀',
								name : 'suffix',
								xtype : "textfield"
							}, {
						         xtype:"panel",
						         layout:"column",
						         fieldLabel:'状态',
						         isFormField:true,
						         items:[{
						               columnWidth:.5,
						               xtype:"radio",
						               boxLabel:"开启",
						               name:"status",
						               inputValue:"1"
						         },{
						               columnWidth:.5,
						               checked:true,
						               xtype:"radio",
						               boxLabel:"关闭",
						               name:"status",
						               inputValue:"0"
						         }]
						     },		                     
							 {
								id : 'size',
								fieldLabel : '大小',
								items:[{
										name:"size",
										xtype:"textfield",
										width:50
										},
										{
										xtype:"textfield",
										value:"KB",
										width:30,
										readOnly:true
										}]
									
							}]							
						}]
			});

	addTypeWin = new Ext.Window({
				el : 'add_type_win',
				width : 350,
				height : 225,
				title : '新增资源类型',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				modal : true,
				items : [{
							columnWidth : 1,
							items : {
								items : addTypeForm
							}
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								add(addTypeForm.getForm().getEl().dom.ename.value,
										addTypeForm.getForm().getEl().dom.cname.value,
										addTypeForm.getForm().getEl().dom.suffix.value,
										addTypeForm.getForm().findField("status").getGroupValue(),
										addTypeForm.getForm().getEl().dom.size.value);
							}
						}, {
							text : '取消',
							handler : function() {
								addTypeWin.hide();
							}
						}],
				listeners : {
					"hide" : function(){
						addTypeForm.getForm().reset();
					}
				}
			});
};
var add = function(ename,cname,suffix,status,size){
	Ext.lib.Ajax.request('post', '/ResType.do', {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc,
							data.result)) {
				ds.load();
				addTypeForm.getForm().reset(); 
				addTypeWin.hide();
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	},"type=3&ename="+ename+"&cname="+cname+"&suffix="+suffix+"&status="+status+"&size="+size)
}
 /*删除类型*/
var del = function(){
	var rec = grid.getSelectionModel().getSelected();
	if (isEmpty(rec)) {
		Ext.Msg.alert("提示", "请选择要删除的类型！");
		return;
	}
	var id = rec.id;
	Ext.Msg.confirm("提示", "您确定要删除该分类?", function(op) {
		if (op == "yes") {	
			Ext.lib.Ajax.request('post', '/ResType.do', {
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
											data.result)) {
								ds.load();
								Ext.Msg.alert("提示","分类删除成功!");
								}
						},
						failure : function() {
							Ext.Msg.alert('警告', '操作失败。');
						}
			},"type=4&id="+id);
		}
	});
}
var showAddType = function() {
	if (addTypeWin == null) {
		buildAddType();
		addTypeWin.show();
	} else {
		addTypeWin.show();
	}
};
/* end新增分类 */

var init = function() {
	buildGrid();
};

Ext.onReady(init);