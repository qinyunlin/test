var tree;
var ds, grid;
var root;

var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '信息分类管理'
			});
	tree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/InfoContentType.do?type=1'
						}),
				root : root,
				renderTo : 'tree',
				border : false,
				animate : true,
				autoScroll : true,
				containerScroll : true
			});

	/* 修改返回的数据 */
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
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

				o[i].text = o[i].name;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
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
	tree.on('click', function(node) {
				node.expand();
				node.select();
				if (node.isLeaf()) {
					ds.proxy = new Ext.data.HttpProxy({
								url : '/InfoContentType.do?type=6'
							});
					ds.load({
								params : {
									id : node.id
								}
							});
				} else {
					ds.proxy = new Ext.data.HttpProxy({
								url : '/InfoContentType.do?type=1'
							});
					ds.load({
								params : {
									node : node.id
								}
							});
				}
				node.expand();
			});

	root.expand();
	root.select();
};

var buildGrid = function() {

	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/InfoContentType.do?type=1'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'pid', 'path', 'name', 'creatBy'])
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), cm, {
							header : 'ID',
							width : 20,
							sortable : true,
							dataIndex : 'id'
						}, {
							header : '类型名称',
							width : 150,
							sortable : true,
							dataIndex : 'name',
							editor : new Ext.form.TextField()
						}, {
							header : '父类ID',
							width : 30,
							sortable : true,
							dataIndex : 'pid'
						}, {
							header : 'path',
							width : 50,
							sortable : true,
							dataIndex : 'path'
						}, {
							header : '创建人',
							width : 100,
							sortable : true,
							dataIndex : 'creatBy'
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel()
			});
	grid.on('afteredit', function(e) {
		if (e.record.data.name == "") {
			Ext.Msg.alert("提示", "分类名称不能为空！", function() {
						Ext.fly("name_edit").focus();
					});
			return;
		}
		Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request('post', '/InfoContentType.do', {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {
											var node = tree.getSelectionModel().getSelectedNode();
											if(!node.isLeaf()){
												node = node.findChild('id',
															e.record.data.id);
											}	
											if (node) {
												node.setText(e.record.data.name);
											}
											ds.reload();
											// Ext.MessageBox.alert("提示",
											// "修改成功！");
										} else {
											Ext.MessageBox.alert("提示", "修改失败！");
										}
									},
									failure : function() {
										Ext.Msg.alert('警告', '操作失败。');
									}
								}, "id=" + e.record.data.id + "&owner="
										+ e.record.data.owner + "&type=5&name="
										+ e.record.data.name);
					}
				});
	});
	ds.load({
				params : {
					node : '0'
				}
			});
};

var buildLayout = function() {
	var view = new Ext.Viewport({
				layout : 'border',
				defaults : {
					border : false
				},
				items : [{
							region : 'north',
							contentEl : 'north-div',
							height : 25,
							tbar : [{
										text : '新增',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/add.gif',
										hidden : compareAuth("INFO_CALOG_ADD"),
										handler : showAddType
									}, '-', {
										text : '删除',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/delete.gif',
										hidden : compareAuth("INFO_CALOG_DEL"),
										handler : del
									}, '-' , {
										text : '增加扩展属性',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/database_add.png',
										//hidden : compareAuth("INFO_EXTEND"),
										handler : showExWin
									} , '->', '双击表格可以修改资料']
						}, {
							region : 'west',
							width : 180,
							split : true,
							autoScroll : true,
							items : tree
						}, {
							region : 'center',
							layout : 'fit',
							items : grid
						}]
			});
};

//扩展属性
var addExWin;
var addExForm;

function showExWin(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	
	var id = row.get("id");
	
	Ext.Ajax.request({
		url : '/InfoContentType.do',
		params : {
			type : 7,
			id : id
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				if(addExWin == null){
					addExtend(id);
				}
				
				if(Ext.isEmpty(data.result)){
					addExWin.show();
					addExForm.getForm().reset();
				}else{
					addExWin.show();
					addExForm.getForm().reset();
					if(!Ext.isEmpty(data.result['col1'])){
						Ext.get("col1").dom.value =data.result['col1'];
					}
					if(!Ext.isEmpty(data.result['col2'])){
						Ext.get("col2").dom.value =data.result['col2'];
					}
					if(!Ext.isEmpty(data.result['col3'])){
						Ext.get("col3").dom.value =data.result['col3'];
					}
					if(!Ext.isEmpty(data.result['col4'])){
						Ext.get("col4").dom.value =data.result['col4'];
					}
					if(!Ext.isEmpty(data.result['col5'])){
						Ext.get("col5").dom.value =data.result['col5'];
					}
				}
			}
		},
		failure : function(){
			Warn_Tip();
		}
	});
	
	
	
}

function addExtend(id){
	addExForm = new Ext.form.FormPanel({
		layout : 'form',
		frame : true,
		labelAlign : 'right',
		width : 348,
		autoHeight : true,
		hideBorders : true,
		items : [{
					id : 'col1',
					fieldLabel : '扩展属性1',
					name : 'col1',
					xtype : "textfield"
				},{
					id : 'col2',
					fieldLabel : '扩展属性2',
					name : 'col2',
					xtype : "textfield"
				},{
					id : 'col3',
					fieldLabel : '扩展属性3',
					name : 'col3',
					xtype : "textfield"
				},{
					id : 'col4',
					fieldLabel : '扩展属性4',
					name : 'col4',
					xtype : "textfield"
				},{
					id : 'col5',
					fieldLabel : '扩展属性5',
					name : 'col5',
					xtype : "textfield"
				},{
					id : 'tid',
					name: 'tid',
					value : id,
					xtype : 'hidden'
				}]
	});
	
	addExWin = new Ext.Window({
		el : 'add_ext_win',
		modal : true,
		width : 350,
		autoHeight : true,
		title : '增加扩展属性',
		layout : 'column',
		border : false,
		frame : true,
		buttonAlign : 'center',
		labelAlign : 'right',
		closeAction : 'hide',
		items : addExForm,
		buttons : [{
					text : '确定',
					handler : function() {
						var row = grid.getSelectionModel().getSelected();
						var col1 = Ext.fly("col1").getValue();
						var col2 = Ext.fly("col2").getValue();
						var col3 = Ext.fly("col3").getValue();
						var col4 = Ext.fly("col4").getValue();
						var col5 = Ext.fly("col5").getValue();
						
						var id = row.get("id");
						if(col1 == '' && col2 == '' && col3 == ''&& col4 == ''&& col5 == ''){
							Info_Tip("扩展属性需要至少填写一个!");
							return;
						}
						
						Ext.Ajax.request({
							url : '/InfoContentType.do?type=8',
							method : 'POST',
							params : {
								id : id,
								col1 : col1,
								col2 : col2,
								col3 : col3,
								col4 : col4,
								col5 : col5
							},
							success : function(response){
								var data = eval("(" + response.responseText + ")");
								if (getState(data.state, commonResultFunc, data.result)) {	
									addExWin.hide();
									Info_Tip("操作成功！");								
								}
							},
							failure : function(){
								Warn_Tip();
							}
						});
						
					}
				}, {
					text : '取消',
					handler : function() {
						addExWin.hide();
					}
				}]
	});
}

// 增加分类
var create = function(name) {
	if(!name){
		Ext.MessageBox.alert("提示", "分类名不能为空");
		return ;
	}
	var node = tree.getSelectionModel().getSelectedNode();
	if (node) {
		Ext.lib.Ajax.request('post', '/InfoContentType.do', {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							//window.location.reload();
							
							  node.leaf = false;
							  node.appendChild(new Ext.tree.AsyncTreeNode({ id :
							  data.result, text : name, leaf : true }));
							  node.getUI().removeClass('x-tree-node-leaf');
							  node.getUI().addClass('x-tree-node-expanded');
							  node.expand(); 
							  ds.reload();
							  addTypeForm.getForm().reset(); 
							  addTypeWin.hide();
							  //debugger;
						

							// Ext.MessageBox.alert("提示", "增加成功！");
						}
					},
					failure : function() {
						Warn_Tip();
					}
				}, "node=" + node.id + "&name=" + name + "&type=3");
	}
};

// 删除分类
var del = function() {
	var id;
	var rec = grid.getSelectionModel().getSelected()||tree.getSelectionModel().getSelectedNode();
	if (isEmpty(rec)) {
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	if (rec) {
		id = rec.id;
	} else {
		var node = tree.getSelectionModel().getSelectedNode();
		id = node.id;
	}
	Ext.Msg.confirm("提示", "您确定要删除该分类?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request('post', '/InfoContentType.do', {
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
											data.result)) {
								Ext.Msg.alert("提示","分类删除成功!");				
								var snode = tree.getSelectionModel()
										.getSelectedNode();
								if (snode.id == id) { // 当前树节点是要删除的节点
									ds.proxy = new Ext.data.HttpProxy({
												url : '/InfoContentType.do?type=1'
											});
									ds.load({
												params : {
													node :snode.pid
												}
											});
									snode.remove();
								} else { // 通过id查找子节点
									var node = snode.findChild('id', id);
									node.remove();
								}
								root.select();
							} 
						},
						failure : function() {
							Ext.Msg.alert('警告', '操作失败。');
						}
					}, "id=" + id + "&type=4");
		}
	});
};

/* 新增分类 */
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
				height : 50,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : {
								id : 'name',
								fieldLabel : '分类名称',
								name : 'name',
								xtype : "textfield"
							}
						}]
			});

	addTypeWin = new Ext.Window({
				el : 'add_type_win',
				width : 350,
				height : 123,
				title : '新增分类',
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
								create(addTypeForm.getForm().getEl().dom.name.value);
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
	buildTree();
	buildGrid();
	buildLayout();
};

Ext.onReady(init);