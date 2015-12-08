/*
*/
var tree;
var ds, grid;
var root;
var ctype, ptype = 2, infoStore;
var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '项目分类管理'
			});
	tree = new Ext.tree.TreePanel({
				root : root,
				renderTo : "tree",
				autoScroll : true,
				animate : true,
				enableDD : true,
				containerScroll : true,
				border : false,
				listeners : {
					"click" : function(node, e) {
						if (node.isLeaf()) {
							ds.baseParams = {};
							ds.baseParams["ctype"] = ctype;
							ds.baseParams["type"] = 6;
							ds.baseParams["id"] = node.id;
						} else {
							ds.baseParams = {};
							ds.baseParams["ctype"] = ctype;
							ds.baseParams["type"] = 1;
							ds.baseParams["node"] = node.id;
						}
						ds.load();
					}
				}

			});
	buildNode();

};

function buildNode() {
	tree.loader = new Ext.tree.TreeLoader({
				dataUrl : '/proj/ProjectCatalogServlet?type=1&ctype=' + ctype,
				params : {
					node : 0
				}
			});
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
	root.reload();
	root.expand();
	root.select();
};

var buildGrid = function() {

	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/proj/ProjectCatalogServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'pid', 'path', 'name']),
				baseParams : {
					type : 2,
					ctype : ctype,
					id : 0
				}
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), {
							header : 'ID',
							sortable : true,
							dataIndex : 'id'

						}, {
							header : '类型名称',
							width : 150,
							sortable : true,
							dataIndex : 'name',
							editor : new Ext.form.TextField()
						}, {
							header : 'pid',
							sortable : true,
							dataIndex : 'pid'
						}, {
							header : 'path',
							sortable : true,
							dataIndex : 'path'
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
		Ext.Msg.confirm("操作确认", "您确认要修改该信息吗？", function(op) {
					if (op == "yes") {
						Ext.Ajax.request({
									url : '/proj/ProjectCatalogServlet',
									params : {
										type : 4,
										id : e.record.id,
										name : e.value,
										ctype : ctype
									},
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (data && data.state == 'success') {
											var node = tree.getSelectionModel().getSelectedNode();
											if(!node.isLeaf())
													node = node.findChild('id',e.record.data.id);
											if (node) {
												node.setText(e.record.data.name);
											}
											Ext.MessageBox.alert("提示", "修改成功！");
											ds.reload();
										} else {
											Ext.MessageBox.alert("提示", "修改失败！");
										}
									},
									failure : function() {
										Warn_Tip();
									}
								});
					} else {
						ds.reload();
					}
				});

	});
	ds.load();

};

var sortCombo = new Ext.form.ComboBox({
			id : 'sortCombo',
			hiddenId : 'tid',
			hiddenName : 'tid',
			// store : sortStore,
			typeAhead : true,
			mode : 'remote',
			triggerAction : 'all',
			valueField : "id",
			displayField : "name",
			readOnly : true,
			fieldLabel : '分类',
			emptyText : '请选择'
		});

sortCombo.on('select', function() {
			search();
		});

var buildLayout = function() {
	new Ext.Viewport({
				layout : 'border',
				defaults : {
					border : false
				},
				items : [{
							region : 'north',
							contentEl : 'north-div',
							height : 25,
							tbar : [{
										xtype : "label",
										text : "项目目录类型："
									}, {
										xtype : 'combo',
										store : new Ext.data.SimpleStore({
											data : [['stage', '阶段类别'], ['build', '建筑类别']],
											fields : ["value", "text"]
										}),
										mode : 'local',
										valueField : 'value',
										displayField : 'text',
										readOnly : true,
										triggerAction : 'all',
										value : ctype,
										listeners : {
											"select" : function(combo, record, index){
												if(combo.getValue() == "stage")
													proStage();
												else
													proBuild();
											}
										}
									}, '-', {
										text : '新增',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/add.gif',
										hidden : ctype == 'build' ? compareAuth("PROJ_BUILDCAT_ADD") : compareAuth("PROJ_STAGECAT_ADD"),
										handler : showAddType
									}, '-', {
										text : '删除',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/delete.gif',
										hidden : ctype == 'build' ? compareAuth("PROJ_BUILDCAT_DEL") : compareAuth("PROJ_STAGECAT_DEL"),
										handler : del
									}, '-', '->', '双击表格可以修改资料']
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

// 建筑类别
function proBuild() {
	window.parent.createNewWidget("0701", '建筑类别',
			'/module/project/project_type_manage.jsp?ctype=build');
}
// 阶段类别
function proStage() {
	window.parent.createNewWidget("0701", '阶段类别',
			'/module/project/project_type_manage.jsp?ctype=stage');
}

// 查找
function search() {
	// /project/ProjectCatalogServlet?type=2&ctype=stage

	Ext.MessageBox.alert("提示", "请先选择分类！");

	// var exStatusId = Ext.fly("exStatusId").getValue();
	// infoStore.baseParams = {};
	// infoStore.baseParams['type'] = 2;
	// infoStore.baseParams['ctype'] = exStatusId;
	// infoStore.load();

	// alert(exStatusId);
	// return;

	// infoId = "";
	// infoStore.baseParams = {};
	// var title = Ext.fly("title").getValue();
	// var content = "";
	// var tid = Ext.fly("tid").getValue();
	// if (tid == "") {
	// Ext.MessageBox.alert("提示", "请先选择分类！");
	// return;
	// }
	// if (title != "") {
	// content += "title~" + title + ";";
	// }
	// var es = Ext.fly("exStatus").getValue();
	// var li = Ext.fly("list").dom.value;
	//
	// if (es == "已审核" && li == "列表") {
	// infoStore.baseParams['type'] = 2;
	// } else if (es == "未审核" && li == "列表") {
	// infoStore.baseParams['type'] = 3;
	// infoStore.countParams['type'] = 5;
	// } else if (es == "" && li == "已删除列表") {
	// infoStore.baseParams['type'] = 6;
	// infoStore.countParams['type'] = 7;
	// }
	// infoStore.baseParams['blur'] = 'yes';
	// infoStore.baseParams['tid'] = tid;
	// infoStore.baseParams['content'] = content;
	// infoStore.load();
}

// 增加分类
var create = function(name) {
	if(!name){
		Ext.MessageBox.alert("提示", "分类名不能为空");
		return ;
	}
	var node = tree.getSelectionModel().getSelectedNode();
	if (node) {
		Ext.lib.Ajax.request('post', '/proj/ProjectCatalogServlet', {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							/*
							root.reload();
							root.expand();
							ds.reload();
							Ext.MessageBox.alert("提示", "增加分类成功！");
							*/
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
				}, "node=" + node.id + "&name=" + name + "&type=5&ctype="
						+ ctype);
	}

};

// 删除分类
var del = function() {
	Ext.Msg.confirm("确认操作", "您确定要删除该分类吗？", function(op) {
		if (op == "yes") {
			var id;
			var rec = grid.getSelectionModel().getSelected();
			if (rec) {
				id = rec.data.id;
			} else {
				var node = tree.getSelectionModel().getSelectedNode();
				id = node.id;
			}
			Ext.lib.Ajax.request('post', '/proj/ProjectCatalogServlet', {
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
											data.result)) {
								Ext.Msg.alert("提示","分类删除成功!");								
								var snode = tree.getSelectionModel()
										.getSelectedNode();
								if (snode.id == id) { // 当前树节点是要删除的节点
									ds.baseParams = {};
									ds.baseParams["ctype"] = ctype;
									ds.baseParams["type"] = 1;
									ds.baseParams["node"] = snode.attributes.pid;
									ds.load();
									snode.remove();
								} else { // 通过id查找子节点
									var node = snode.findChild('id', id);
									node.remove();
								}
								Ext.Msg.alert('提示', '删除成功!');
								ids = [];

								//root.reload();
								//root.expand();
								root.select();
							} 
						},
						failure : function() {
							Ext.Msg.alert('警告', '操作失败。');
						}
					}, "id=" + id + "&type=3&ctype=" + ctype);
		}
	})

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
				modal : true,
				closeAction : 'hide',
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
	ctype = getCurArgs("ctype");
	if(isEmpty(ctype)){
		ctype = 'stage';
	}
	buildTree();
	buildGrid();
	buildLayout();
};

Ext.onReady(init);