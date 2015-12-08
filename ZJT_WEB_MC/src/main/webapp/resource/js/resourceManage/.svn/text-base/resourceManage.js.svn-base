/**/
var tree;
var ds, grid;
var root;

var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0001',
				draggable : false,
				text : '资源管理'
			});
	tree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/ResCatalog.do?type=1'
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

				o[i].text = o[i].cname;
				o[i].id = o[i].cata_id;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}else{
					o[i].leaf = false;
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
								url : '/ResCatalog.do?type=6'
							});
					ds.load({
								params : {
									id : node.id
								}
							});
				} else {
					ds.proxy = new Ext.data.HttpProxy({
								url : '/ResCatalog.do?type=1'
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
							url : '/ResCatalog.do?type=1'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id','cata_id', 'parent_id', 'cname', 'modify_user', 'modify_time'])
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'cata_id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), cm, {
							header : 'ID',
							width : 10,
							sortable : true,
							dataIndex : 'id'
						},{
							header : '分类ID',
							width : 20,
							sortable : true,
							dataIndex : 'cata_id'
						}, {
							header : '父类ID',
							width : 20,
							sortable : true,
							dataIndex : 'parent_id'
						}, {
							header : '分类名称',
							width : 30,
							sortable : true,
							dataIndex : 'cname',
							editor : new Ext.form.TextField()
						}, {
							header : '修改时间',
							width : 30,
							sortable : true,
							dataIndex : 'modify_time'
						}, {
							header : '修改人',
							width : 10,
							sortable : true,
							dataIndex : 'modify_user'
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel()
			});
	grid.on('afteredit', function(e) {
		if (e.record.data.cname == "") {
			Ext.Msg.alert("提示", "分类名称不能为空！", function() {
						Ext.fly(this).focus();
					});
			return;
		}
		Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request('post', '/ResCatalog.do', {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {
											var node = tree.getSelectionModel().getSelectedNode();
											if(!node.isLeaf()){
												node = node.findChild('id',
															e.record.data.cata_id);
											}	
											if (node) {
												node.setText(e.record.data.cname);
											}
											ds.reload();
											 Ext.MessageBox.alert("提示",
											 "修改成功！");
										} else {
											Ext.MessageBox.alert("提示", "修改失败！");
										}
									},
									failure : function() {
										Ext.Msg.alert('警告', '操作失败。');
									}
								}, "id=" + e.record.data.cata_id + "&type=5&name="
										+ e.record.data.cname);
					}
				});
	});
	ds.load({
				params : {
					node : '0001'
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
										hidden : false,
										handler : showAddType
									}, '-', {
										text : '删除',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/delete.gif',
										hidden : false,
										handler : del
									}, '->', '双击表格可以修改资料']
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

// 增加分类
var create = function(name) {
	if(!name){
		Ext.MessageBox.alert("提示", "分类名不能为空");
		return ;
	}
	var node = tree.getSelectionModel().getSelectedNode();
	if (node) {
		Ext.lib.Ajax.request('post', '/ResCatalog.do', {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							  node.leaf = false;
							  node.appendChild(new Ext.tree.AsyncTreeNode({ id :
							  data.result, text : name, leaf : true }));
							  node.getUI().removeClass('x-tree-node-leaf');
							  node.getUI().addClass('x-tree-node-expanded');
							  node.expand(); 
							  ds.reload();
							  addTypeForm.getForm().reset(); 
							  addTypeWin.hide();
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
	var rec = grid.getSelectionModel().getSelected();
	var node = tree.getSelectionModel().getSelectedNode();
	if (isEmpty(rec)&&isEmpty(node)) {
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	if (rec) {
		console.debug(rec);
		id = rec.data.cata_id;
	} else {
		id = node.id;
	}
	Ext.Msg.confirm("提示", "您确定要删除该分类?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request('post', '/ResCatalog.do', {
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
											data.result)) {
								Ext.Msg.alert("提示","分类删除成功!");				
								var snode = tree.getSelectionModel()
										.getSelectedNode();
								if (snode.id == id) { // 当前树节点是要删除的节点
									ds.proxy = new Ext.data.HttpProxy({
												url : '/ResCatalog.do?type=1'
											});
									ds.load({
												params : {
													node :snode.attributes.parent_id
												}
											});
									var pNode = snode.parentNode;
									snode.remove();
									if(pNode.childNodes.length==0){
										pNode.leaf = true;
									}
								} else { // 通过id查找子节点
									var node = tree.getNodeById(id);
									console.debug(node);
									node.remove();
									ds.load();
								}
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