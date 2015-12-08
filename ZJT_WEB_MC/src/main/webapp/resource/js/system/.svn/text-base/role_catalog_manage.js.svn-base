var treePanel;
var roleGrid;
var gcode;
// 后台帐号
var buildBackPanel = function() {
	var ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ['id', 'code', 'name']),
				baseParams : {
					type : 4
				},
				remoteSort : true
			});

	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	roleGrid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				autoExpandColumn : 'name',
				sm : sm,
				columns : [{
							header : "id",
							width : 30,
							sortable : true,
							dataIndex : 'id'
						}, cm, {
							id : 'name',
							header : "角色名称",
							width : 160,
							sortable : true,
							dataIndex : 'name'
						}, {
							header : "编码",
							width : 50,
							sortable : true,
							dataIndex : 'code'
						}]
			});
	ds.load();
	roleGrid.on("rowclick", function(grid, rowIndex, rec) {
				gcode = ds.getAt(rowIndex).get("code");
				Ext.getCmp("catologTitle").enable();
				getDirsByCode();
			});
};

// 目录
var buildTree = function() {
	var tree = Ext.tree;
	var treeLoader = new tree.TreeLoader({
				dataUrl : '/mc/AdminRoleServlet.do?type=13'
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
					o[i].children[j].checked = false;
				}
				o[i].checked = false;
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
				id : 'treePanel',
				animate : true,
				autoScroll : true,			
				loader : treeLoader,
				containerScroll : true,
				rootVisible : false,
				border : false,
				useArrows : true,
				checkModel : 'cascade', // 对树的级联多选
				onlyLeafCheckable : false,// 对树所有结点都可选
				maskDisabled : true,
				autoScroll : true,
				containerScroll : true,
				ddScroll : true,
				tbar : [{
							width : '70',
							text : "保 存",
							icon : '/resource/images/application_double.png',
							handler : updateDirsByCode
						}, {
							xtype : 'label',
							text : " <- 修改权限后，请务必保存。"
						}]
			});

	var root = new tree.AsyncTreeNode({
				text : '系统',
				draggable : false,
				id : "0"
			});

	treePanel.setRootNode(root);
	root.expand(true, true);

	treePanel.on('checkchange', function(node) {

				if (!node.isLeaf()) {
					 node.expand(true, true);
				}

				fireCheckChange(node);
			});
};

// 当fire checkchange时执行
function fireCheckChange(node) {
	if (node.getUI().isChecked()) {
		checkedChildrenNodes(node);
		checkedParentNodes(node);
	} else {
		// 取得当前节点的所有子节点,包括当前节点
		var allChildrenNodes = getAllChildrenNodes(node);
		// 如果当前节点的所有子节点中,不存在checked=true的节点,那么将当前节点置为checked=false.
		// 如果当前节点有子节点,同时,当前节点checked=false,那么将其所有子节点置为checked=false
		for (var i = 0; i < allChildrenNodes.length; i++) {
			if (allChildrenNodes[i].getUI().isChecked()) {
				if (allChildrenNodes[i].attributes.checked == true) {
					allChildrenNodes[i].getUI().checkbox.checked = false;
					allChildrenNodes[i].attributes.checked = false;
				}
			}
		}
	}
}

// 当点击父节点时 将其所有子节点选中
function checkedChildrenNodes(node) {
	// 取得本节点的所有子节点,子节点中包括其自己
	var allChildrenNodes = getAllChildrenNodes(node);
	if (allChildrenNodes.length > 1) {
		for (var i = 0; i < allChildrenNodes.length; i++) {
			if (!allChildrenNodes[i].getUI().isChecked()) {
				if (allChildrenNodes[i].attributes.checked == true) {
					allChildrenNodes[i].getUI().checkbox.checked = false;
					allChildrenNodes[i].attributes.checked = false;
				}
			}
		}
	}
}

// 当当前子节点的父节点的所有子节点中 不存在checked=true的子节点时,父节点不被选中
function unCheckedParentNode(currentChildNode) {
	if (currentChildNode.parentNode) {
		var parentNode = currentChildNode.parentNode;
		// 取得本父节点下所有被选中的子节点
		// 包括本父节点本身
		var allCheckedChildrenNodes = getCheckedNodes(parentNode);
		if (allCheckedChildrenNodes.length === 1) {
			if (parentNode.attributes.checked == true) {
				parentNode.getUI().checkbox.checked = false;
				parentNode.attributes.checked = false;
			}
		}
		if (parentNode.parentNode) {
			unCheckedParentNode(parentNode);
		}
	}
}

// 当点击子节点时 将父节点选中
function checkedParentNodes(node) {
	// 取得本节点的所有父节点,父节点中包括其自己
	var allParentNodes = getAllParentNodes(node);
	if (allParentNodes.length > 1) {
		for (var i = 0; i < allParentNodes.length; i++) {
			if (!allParentNodes[i].getUI().isChecked()) {
				if (allParentNodes[i].getUI().checkbox != null) {
					allParentNodes[i].getUI().checkbox.checked = true;
					allParentNodes[i].attributes.checked = true;
				}
			}
		}
	}
}

// 取得所有子节点中checked 为true的节点ID 包括本节点
function getCheckedNodesId(node) {
	var checked = [];
	if (node.getUI().isChecked() || node.attributes.checked) {
		checked.push(node.id);
		if (!node.isLeaf()) {
			for (var i = 0; i < node.childNodes.length; i++) {
				checked = checked.concat(getCheckedNodesId(node.childNodes[i]));
			}
		}
	}
	return checked;
};

// 取得所有子节点中checked为true的节点(TreeNode) 包括本节点
function getCheckedNodes(node) {
	var checked = [];
	if (node.getUI().isChecked()) {
		checked.push(node);
		if (!node.isLeaf()) {
			for (var i = 0; i < node.childNodes.length; i++) {
				checked = checked.concat(getCheckedNodes(node.childNodes[i]));
			}
		}
	}
	return checked;
};

// 取得一个节点的所有子节点 包括本节点
function getAllChildrenNodes(node) {
	var children = [];
	children.push(node);
	if (!node.isLeaf()) {
		for (var i = 0; i < node.childNodes.length; i++) {
			children = children.concat(getAllChildrenNodes(node.childNodes[i]));
		}
	}
	return children;
};

// 取得一个节点的所有父节点
function getAllParentNodes(node) {
	var parentNodes = [];
	parentNodes.push(node);
	if (node.parentNode) {
		parentNodes = parentNodes.concat(getAllParentNodes(node.parentNode));
	}
	return parentNodes;
};

// 取得所有checked=true的节点ID
function getAllChecked() {
	return getCheckedNodesId(root);
}

// treePanel需要重载的自定义函数
var createNewWidget = function(id, title, src) {
};

// 主要的panel
var buildPanel = function() {
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [{
							title : '角色',
							region : 'west',
							margins : '5 0 0 0',
							cmargins : '5 5 0 0',
							width : 300,
							minSize : 200,
							maxSize : 400,
							split : true,
							autoScroll : true,
							items : [roleGrid]
						}, {
							id : 'catologTitle',
							title : '目录',
							region : 'center',
							margins : '5 0 0 0',
							cmargins : '5 5 0 0',
							split : true,
							autoScroll : true,
							items : [treePanel]
						}]
			});
	Ext.getCmp("catologTitle").disable();
};

// 清空nodes
var cleanNodes = function(children) {
	for (var i = 0; i < children.length - 1; i++) {
		children[i].getUI().checkbox.checked = false;
		children[i].attributes.checked = false;
	}
};

// 获取用户的后台目录
var getDirsByCode = function() {
	Ext.lib.Ajax.request('post', '/mc/AdminRoleServlet.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						var root = treePanel.getRootNode();
						var children = getAllChildrenNodes(root);
						children.shift();
						cleanNodes(children);
						var cData = data.result == null || data.result == ""
								? ""
								: data.result.toString().split(",");
						for (var i = 0; i < children.length; i++) {
							for (var j = 0; j < cData.length; j++) {
								if (children[i].attributes.id == cData[j]) {
									children[i].getUI().checkbox.checked = true;
									children[i].attributes.checked = true;
								}
							}
						}
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, "type=16&gcode=" + gcode);
};

// 修改用户的后台目录
var updateDirsByCode = function() {
	if (gcode == null) {
		Ext.MessageBox.alert("提示", "请选择角色！");
		return;
	}
	var checkedNodes = treePanel.getChecked();
	var s = [];
	for (var i = 0; i < checkedNodes.length; i++) {
		s.push(checkedNodes[i].id)
	}
	Ext.Msg.confirm("提示", "您确定要修改权限吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request('post', '/mc/AdminRoleServlet.do', {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (data && data.state == 'success') {
										Ext.MessageBox.alert("提示", "修改目录权限成功！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, "type=15&gcode=" + gcode + "&dirs="
									+ s.toString());
				}
			})
};

function init() {
	Ext.QuickTips.init(true);
	Ext.TipSelf.msg('提示', '当您想勾选目录时，只需点击选中区域即可选中该目录。');
	buildBackPanel();
	buildTree();
	buildPanel();
};

Ext.onReady(function() {
			init();
		});
