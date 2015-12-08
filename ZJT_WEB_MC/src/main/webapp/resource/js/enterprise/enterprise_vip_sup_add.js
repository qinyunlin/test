Ext.onReady(init);
var grid, ds, win, pageSize = 20, tree, root;
var tempType;// 默认模板，获取第一个
function init() {
	// getTemplate();
	buildGrid();

	// buildViewPort();
};
var nodeindex = {
	text : '未分类',
	leaf : true,
	path : '0',
	id:''
};
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						},
						["id", "eid", "name", "fname", "createOn", "linkman"]),
				baseParams : {
					cid : '',
					type : 17,
					pageSize : pageSize
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 16
				},
				remoteSort : true
			});
	ds.load();
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : false
			});// 是否支持多行选择
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});

	var cs = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "value"
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cs, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业Eid',
							dataIndex : 'eid'
						}, {
							header : '企业名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '企业简称',
							sortable : false,
							dataIndex : 'fname'
						}, {
							header : '联系人',
							sortable : false,
							dataIndex : 'linkman'
						}, {
							header : '创建日期',
							sortable : true,
							dataIndex : 'createOn',
							renderer : trimDate
						}],
				viewConfig : {
					forceFit : true
				},
				sm : cs,
				tbar : [{
							text : '厂商分类:',
							xtype : "label"
						}, {
							xtype : 'combo',
							id : 'input_cid',
							store : Ext.stuff.code,
							triggerAction : "all",
							value : 0
						}, "-", {
							text : '企业名称:',
							xtype : 'label'
						}, {
							xtype : 'textfield',
							id : 'input_name'
						}, {
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							text : '添加供应商至模板',
							icon : "/resource/images/add.gif",
							handler : showAddarea
						}]
			});
};

function searchlist() {
	if(Ext.getCmp("input_cid").getValue() == '0'){
		ds.baseParams["cid"] = '';
	}else{
		ds.baseParams["cid"] = Ext.getCmp("input_cid").getValue();
	}
	ds.baseParams["name"] = Ext.getCmp("input_name").getValue();
	ds.load();
};

function buildTree(temp) {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '模板内容'
			});
	tree = new Ext.tree.TreePanel({
				root : root,
				rootVisible : true,
				renderTo : "tree",
				height : 420,
				autoScroll : true,
				animate : true,
				enableDD : true,
				containerScroll : true,
				border : false
			});
	changeTreeLoad(temp);
//	var node = {
//		text : '未分类',
//		leaf : true,
//		path : '0',
//		id : '0'
//	};
	root.appendChild(nodeindex);
};

function changeTreeLoad(temp) {
	tree.loader = new Ext.tree.TreeLoader({
				dataUrl : '/ep/EnterpriseTempCatalogServlet',
				baseParams : {
					type : 4,
					tempType : temp
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

	// tempType = obj['type'];
	// root.attributes["owner"] = obj['owner'];
	root.attributes["tempType"] = temp
	root.attributes["path"] = "0";
	root.reload();
	root.expand();
	root.select();
};

// 获得模板
function getTemplate() {
	Ext.Ajax.request({
		url : '/ep/EnterpriseTempCatalogServlet',
		params : {
			type : 7
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				tempType = data.result[0]["type"];
				buildTree(tempType);
				var len = data.result.length;
				var temp = [];
				for (var i = 0; i < len; i++) {
					temp.push("['" + data.result[i]["type"] + "','"
							+ data.result[i]["owner"] + "']");
				}
				temp = eval("([" + temp + "])");
				var bar = new Ext.Toolbar({
							items : [{
										text : '模板名称:',
										xtype : 'label'
									}, {
										xtype : 'combo',
										store : temp,
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										value : data.result[0]["owner"],
										listeners : {
											"select" : function(combo) {

												changeTreeLoad(combo.getValue());
												tree.getRootNode()
														.appendChild(nodeindex);
											}
										}
									}]
						});
				win = new Ext.Window({
							title : '选择分类',
							modal : true,
							width : 520,
							autoHeight : true,
							sutoScroll : true,
							draggable : true,
							scrollIntoView : true,
							buttonAlign : 'right',

							items : [bar, tree],
							buttons : [{
										text : '选择完分类后请点击保存。',
										xtype : 'label'
									}, {
										text : '保存',
										handler : saveSup
									}, {
										text : '取消',
										handler : function() {
											win.close();
										}
									}]
						});
				win.show();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

// 显示添加区域
function showAddarea() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择供应商。");
		return;
	}
	getTemplate();
};

// 保存添加的厂商
function saveSup() {
	var rows = grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < rows.length; i++) {
		mids.push(rows[i].get("eid"));
	}
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node)) {
		Info_Tip("请选择一个分类。");
		return;
	}
	if (node.attributes["text"] == "模板内容") {
		Info_Tip("请正确选择一个分类。");
		return;
	}
	if (node.attributes["text"] == "未分类") {
		node.id=0;
	}
	Ext.Ajax.request({
				url : '/ep/EpTempSupplierServlet',
				params : {
					type : 8,
					fids : mids.toString(),
					cid : node.id
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("供应商添加成功。");
						win.close();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};