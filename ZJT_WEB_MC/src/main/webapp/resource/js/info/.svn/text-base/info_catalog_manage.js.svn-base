/**/
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
						}, ['id','CONTENT_TEMPLATE','pid', 'path', 'name', 'creatBy','CONTENT_TEMPLATE1'])
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
							width : 10,
							sortable : true,
							dataIndex : 'id'
						}, {
							header : '栏目名称',
							width : 30,
							sortable : true,
							dataIndex : 'name',
							editor : new Ext.form.TextField()
						},  {
							header : '查看内容页模板',
							width : 30,
							sortable : true,
							dataIndex : 'CONTENT_TEMPLATE',
							editor : new Ext.form.TextField()
						},{
							header:'查看列表页模版',
							width:30,
							sortable:true,
							dataIndex:'CONTENT_TEMPLATE1',
							editor:new Ext.form.TextField()
						},{
							header : '父类ID',
							width : 20,
							sortable : true,
							dataIndex : 'pid'
						}, {
							header : 'path',
							width : 20,
							sortable : true,
							dataIndex : 'path'
						}, {
							header : '创建人',
							width : 20,
							sortable : true,
							dataIndex : 'creatBy'
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel()
			});
	grid.on('afteredit', function(e) {
		if (e.record.data.name == "") {
			Ext.Msg.alert("提示", "栏目名称不能为空！", function() {
						Ext.fly("name_edit").focus();
					});
			return;
		}	
		var CONTENT_TEMPLATE = e.record.data.CONTENT_TEMPLATE;
		var CONTENT_TEMPLATE1 = e.record.data.CONTENT_TEMPLATE1;
		if(CONTENT_TEMPLATE==null){
			CONTENT_TEMPLATE = '';
		}
		if(CONTENT_TEMPLATE1==null){
			CONTENT_TEMPLATE1 = '';
		}
		var editPara = "&CONTENT_TEMPLATE="+CONTENT_TEMPLATE.trim() + "&path=" + e.record.data.path+"&CONTENT_TEMPLATE1="+CONTENT_TEMPLATE1.trim();
	
		Ext.Msg.confirm("提示", "您确定要修改该栏目信息?", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request('post', '/InfoContentType.do', {
									success : function(response) {
										var data = eval("("+ response.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {
											var node = tree.getSelectionModel().getSelectedNode();
											if(!node.isLeaf()){
												node = node.findChild('id',e.record.data.id);
											}	
											if (node) {
												node.setText(e.record.data.name);
											}
											ds.reload();
										} else {
											Ext.MessageBox.alert("提示", "修改失败！"+data.result);
										}
									},
									failure : function() {
										Warn_Tip();
									}
								}, "id=" + e.record.data.id + "&type=5&name="
										+ e.record.data.name+editPara.trim());
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
										cls  : 'x-btn-text-icon',
										icon : '/resource/images/add.gif',
										hidden  : compareAuth("INFO_CALOG_ADD"),
										handler : showAddType
									}, '-', {
										text : '删除',
										cls : 'x-btn-text-icon',
										icon  : '/resource/images/delete.gif',
										hidden  : compareAuth("INFO_CALOG_DEL"),
										handler : del
									}, '-', {
										text : '栏目资讯刷新',
										cls  : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler : genContentHtmlByTid
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
var create = function() {
	var name = Ext.getCmp("name").getValue();
	var content_template1 = Ext.getCmp("CONTENT_TEMPLATE1").getValue();
	var content_template = Ext.getCmp("CONTENT_TEMPLATE").getValue();
	if(!name){
		Ext.MessageBox.alert("提示", "分类名不能为空");
		return ;
	}
	var node = tree.getSelectionModel().getSelectedNode();
	var addPara = "&name=" + name + "&CONTENT_TEMPLATE="+content_template+"&CONTENT_TEMPLATE1="+content_template1;
	if (node) {
		Ext.lib.Ajax.request('post', '/InfoContentType.do', {
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
				}, "node=" + node.id + "&name=" + name + "&type=3"+addPara);
	}
};
//栏目首页预览
function cataHomePreView() {
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
	if(id=="0"){		
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	window.open("/servlet/CMSPreViewServlet?type=cataHome&tid="+id);
}
//栏目列表预览 
function cataListPreView() {
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
	if(id=="0"){		
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	window.open("/servlet/CMSPreViewServlet?type=cataList&tid="+id);
}
//栏目主页生成
function buildCataLogHomePage() {
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
	if(id=="0"){		
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	Ext.lib.Ajax.request('post', 'http://mc.zjtcn.com/servlet/GenHtmlServlet', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc,data.result)) {
						window.open(data.result["htmlNetPath"]);
					} 
				},
				failure : function() {
					Ext.Msg.alert('警告', '刷新栏目首页失败。');
				}
			}, "type=cataHome&tid="+id);	
}
//刷新栏目列表页面
function buildCataLogListPage(){
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
	if(id=="0"){		
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	Ext.lib.Ajax.request('post', 'http://mc.zjtcn.com/servlet/GenHtmlServlet', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc,data.result)) {
						window.open(data.result["htmlNetPath"]);
					} 
				},
				failure : function() {
					Ext.Msg.alert('警告', '刷新栏目列表页面失败。');
				}
			}, "type=cataList&tid="+id);	
}
//栏目资讯刷新
function genContentHtmlByTid() {
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
	if(id=="0"){		
		Ext.Msg.alert("提示", "请选择分类");
		return;
	}
	Ext.lib.Ajax.request('post', 'http://mc.zjtcn.com/servlet/GenHtmlServlet', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc,data.result)) {
						Ext.Msg.alert('提示', '栏目资讯刷新成功。');
					} 
				},
				failure : function() {
					Ext.Msg.alert('警告', '栏目资讯刷新失败。');
				}
			}, "type=contentById&tid="+id);	
}
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
				height : 120,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : [{
								id : 'name',
								fieldLabel : '分类名称',
								name : 'name',
								xtype : "textfield"
							},{
								id : 'CONTENT_TEMPLATE',
								fieldLabel : '查看页模板',
								name : 'CONTENT_TEMPLATE',
								xtype : "textfield"
							},{
								id : 'CONTENT_TEMPLATE1',
								fieldLabel : '查看列表页模板',
								name : 'CONTENT_TEMPLATE1',
								xtype : "textfield"
							}]
						}]
			});

	addTypeWin = new Ext.Window({
				el : 'add_type_win',
				width : 350,
				height : 172,
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
								create();
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