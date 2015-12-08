Ext.onReady(init);
var tree, grid, ds, root, addTypeWin, addTypeForm, hisds, win, upload_form;
function init() {
	Ext.QuickTips.init();
	buildTree();
	buildGrid();
	buildView();
};
function buildTree() {
	root = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : '材料分类'
	});

	tree = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/servlet/RationLibServlet?type=2'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:20px;',
		rootVisible : false,
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
			} else if (o.state == "auth") {
				Info_Tip("对不起，您暂时不能进行此操作。");
				o = [];
			} else if (o.state == "nologin") {
				Info_Tip("对不起，还未登录。");
				o = [];
			}
			node.beginUpdate();
			for ( var i = 0, len = o.length; i < len; i++) {
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				if (o[i].pid.length == 1 && o[i].pid != 0) {
					o[i].text = o[i].code +" "+ o[i].name;
					o[i].leaf = true;
				} else {
					o[i].text = o[i].name;
				}
				
				var n = this.createNode(o[i]);
				
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [ node ]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	tree.on('click', function(node) {
		node.expand();
		node.select();
		if (node.isLeaf()) {// 是叶节点
			ds.proxy = new Ext.data.HttpProxy({
				url : '/servlet/RationLibServlet?type=6&isBlur=0'
			});
			ds.load({
				params : {
					id : node.id
				}
			});
		} else {// 不是叶节点
			ds.proxy = new Ext.data.HttpProxy({
				url : '/servlet/RationLibServlet?type=6&isBlur=0'
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

function buildGrid() {
	ds = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/servlet/RationLibServlet?type=6'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'pid', 'name', 'askAttr', 'units', 'mainAttr', 'code',
				'image', 'otherName', 'bulk','calcWeight',"matReminds" ])
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
		columns : [ new Ext.grid.RowNumberer(), cm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '材料分类编码',
			sortable : true,
			dataIndex : 'code',
			renderer : showCode,
			width:50
		}, {
			header : '分类名称',
			sortable : true,
			dataIndex : 'name',
			width:50
		}, {
			header : '简称',
			sortable : true,
			dataIndex : 'otherName',
			width:50
		}, {
			header : '单位',
			sortable : true,
			dataIndex : 'units',
			width:50
		}, {
			header : '起批量',
			sortable : true,
			dataIndex : 'bulk',
			renderer : function(value, meta, record) {
				var bulk = record.get("bulk");
				if (bulk == null || "" == bulk || "0" == bulk) {
					return "";
				}
				return bulk;
			}
		}, {
			header : '测算权重',
			sortable : true,
			dataIndex : 'calcWeight',
			renderer : function(value, meta, record) {
				var calcWeight = record.get("calcWeight");
				if (calcWeight == null || "" == calcWeight || "0" == calcWeight) {
					return "";
				}
				return calcWeight + "%";
			}
		}, {
			width : 200,
			header : '报价更新周期',
			sortable : false,
			dataIndex : 'matReminds'
		} /*, {
			header : '询价特征项',
			sortable : true,
			dataIndex : 'askAttr'
		}, {
			header : '关键特征项',
			sortable : true,
			dataIndex : 'mainAttr'
		} */],
		renderTo : 'grid',
		border : false,
		selModel : new Ext.grid.RowSelectionModel()
	});

	// 行双击事件
	grid.on("rowdblclick", function(grid_info, rowIndex, r) {
		show();
	});

	grid.on('beforeedit', function(e) {
		if (compareAuth("RATION_LIB_MOD")) {
			Info_Tip("对不起，您暂时不能进行此操作。");
			return false;
		} else
			return true;
	});
	grid.on('afteredit', function(e) {
		if (e.record.data.name == "") {
			Ext.Msg.alert("提示", "分类名称不能为空！", function() {

			});
			return;
		}
		if (e.field == "name") {
			Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
						url : '/servlet/RationLibServlet',
						params : {
							type : 3,
							id : e.record.data.id,
							content : "name~" + e.record.data.name
						},
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
									data.result)) {
								Info_Tip("修改成功");
								root.reload();
								ds.reload();
							} else {
								Warn_Tip(data.result);

							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}
			});
		}
		if (e.field == "othername") {
			Ext.Msg.confirm("提示", "您确定要修改该分类别名吗?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
						url : '/servlet/RationLibServlet',
						params : {
							type : 7,
							id : e.record.data.id,
							name : e.record.data.othername
						},
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
									data.result)) {
								Info_Tip("别名修改成功");
								root.reload();
								ds.reload();
							} else {
								Warn_Tip(data.result);

							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}
			});
		}
	});

	function showCode(value, p, record) {
		var img = record.data.image;
		var code = record.data.code;
		var stName = "";
		if (img != null && img != "") {
			stName = "<div style='float:left;'>"
					+ code
					+ "</div><div style='float:right;'><image src='/ext/resource/images/img_default.jpg'/></div>";
		} else {
			stName = code;
		}
		return stName;
	}
};

function buildView() {
	var view = new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [ {
			region : 'north',

			height : 25,
			tbar : [ {
				text : '导入材料分类',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/add.gif',
				hidden : compareAuth("RATION_LIB_ADD"),
				handler : showUpArea
			}, {
				text : '上传图片',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/application_double.png',
				hidden : compareAuth("RATION_LIB_ADD"),
				handler : showUploadImgWin
			}, {
				text : '创建材料分类文件',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/report_magnify.png',
				hidden : compareAuth("RATION_LIB_JS_CREATE"),
				handler : createCidFile
			},{
				text : '更新材料分类词库',
				cls : 'x-btn-text-icon',
				tooltip : '建议在闲时更新词库，否则会影响系统运行速度，超过3w条可能会超时，请不要重复上传！',
				icon : "/resource/images/book_open.png",
				hidden : compareAuth("FAC_UPDATE_DIC"),
				handler : updateDicWindow
			}]
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
		} ]
	});
};

// 查看
function show() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	var code = rows[0].data["code"];
	if (code.length < 4) {
		return;
	}

	var id = rows[0].data["id"];
	var pid = rows[0].data["pid"];
	if (pid == "" || pid == "0" || pid == "1" || pid == "2" || pid == "3"
			|| pid == "4" || pid == "5") {
		Info_Tip("请选择二级分类。");
		return;
	}

	openShowOrder(id);
}

// 显示查看面板
function openShowOrder(id) {
	window.parent.createNewWidget("orders_detail", '查看二级分类',
			'/module/mat/rationLib_detail.jsp?id=' + id);
}

// 上传
function uploadFile() {
	submitForm();
};

// 上传操作
function submitForm(append) {
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/servlet/RationLibServlet?type=10',
			waitMsg : '上传文件中...',
			success : function(upload_form, o) {
			},
			failure : function() {
			}
		});
	} else
		Info_Tip("请正确填写信息。");
};

function getResult(flag, msg) {
	if (flag) {
		Info_Tip("上传成功。");
		win.close();
		tree.loader.baseParams = {

		};
		ds.reload();
		tree.getRootNode().reload();
	} else {
		Info_Tip(msg);
	}
};

function showUpArea() {
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : '上传文件',
							allowBlank : false
						}
					},
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							bodyStyle : 'border:none;'/*,
							html : "<a href='" + FileSite
									+ "/doc/RationLib.xls" + "' >标准文档下载</a>"*/
						}
					} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入材料分类',
		closeable : true,
		width : 600,
		height : 100,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : uploadFile
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
};

// 添加分类
function showAddType() {
	addTypeForm = new Ext.form.FormPanel({
		layout : 'table',
		layoutConfig : {
			columns : 1
		},
		frame : true,
		labelAlign : 'right',
		autoHeight : true,
		autoWidth : true,
		hideBorders : true,
		items : [ {
			layout : 'form',
			items : {
				id : 'id',
				fieldLabel : '编码',
				name : "id",
				xtype : 'textfield',
				maxLength : 6,
				allBlank : false
			}

		}, {
			layout : 'form',
			items : {
				id : 'name',
				fieldLabel : '分类名称',
				name : 'name',
				xtype : "textfield",
				allBlank : false
			}
		} ]
	});

	addTypeWin = new Ext.Window({
		width : 350,
		autoHeight : true,
		title : '新增分类',
		layout : 'column',
		border : false,
		frame : true,
		buttonAlign : 'center',
		labelAlign : 'right',
		closeAction : 'hide',
		modal : true,
		items : [ {
			columnWidth : 1,
			items : {
				items : addTypeForm
			}
		} ],
		buttons : [
				{
					text : '确定',
					handler : function() {
						create(addTypeForm.getForm().getEl().dom.id.value,
								addTypeForm.getForm().getEl().dom.name.value);
					}
				}, {
					text : '取消',
					handler : function() {
						addTypeWin.close();
					}
				} ],
		listeners : {
			"hide" : function() {
				addTypeForm.getForm().reset();
			}
		}
	});
	addTypeWin.show();

};

// 删除分类
function del() {
	var id;
	var rec = grid.getSelectionModel().getSelected()
			|| tree.getSelectionModel().getSelectedNode();
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
			Ext.Msg.wait("删除中...", "提示");
			Ext.Ajax.request({
				url : '/servlet/RationLibServlet',
				params : {
					type : 4,
					ids : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("删除成功");
						var snode = tree.getSelectionModel().getSelectedNode();
						if (snode.id == id) { // 当前树节点是要删除的节点
							ds.proxy = new Ext.data.HttpProxy({
								url : '/servlet/RationLibServlet?type=2'
							});
							ds.load({
								params : {
									node : snode.pid
								}
							});
							snode.remove();
						} else { // 通过id查找子节点
							var node = snode.findChild('id', id);
							node.remove();
						}
						// root.reload();
						ds.reload();
					} else {
						Warn_Tip(data.result);

					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
};

// 增加分类action
var create = function(id, name) {
	if (!name || !id) {
		Ext.MessageBox.alert("提示", "分类名或编码不能为空");
		return;
	}
	var node = tree.getSelectionModel().getSelectedNode();
	if (node.id.length >= 6) {
		Info_Tip("定额暂时只支持三级分类。");
		return;
	}
	if (addTypeForm.getForm().isValid()) {
		if (node) {
			Ext.Ajax.request({
				url : '/servlet/RationLibServlet',
				params : {
					type : 1,
					id : node.id,
					content : "name~" + name + ";id~" + id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("添加成功");
						node.leaf = false;
						node.appendChild(new Ext.tree.AsyncTreeNode({
							id : id,
							text : name,
							leaf : true
						}));
						node.getUI().removeClass('x-tree-node-leaf');
						node.getUI().addClass('x-tree-node-expanded');
						node.expand();
						ds.reload();
						// root.reload();

						ds.load({
							params : {
								node : id
							}
						});
						addTypeWin.close();
					} else {
						Warn_Tip(data.result);

					}
				},
				failure : function() {
					Warn_Tip();
				}

			});
		}
	} else {
		Info_Tip("请正确填写信息。");
	}
};
function createCidFile() {
	Ext.Ajax.request({
		url : '/servlet/RationLibServlet',
		params : {
			type : 9
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Info_Tip("zjt/commonJS/cid_db.js文件创建成功。");
			} else {
				Warn_Tip(data.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
/*
 * // 查看历史记录 function hisWatch() { var id; var rec =
 * grid.getSelectionModel().getSelected() ||
 * tree.getSelectionModel().getSelectedNode(); if (isEmpty(rec)) {
 * Ext.Msg.alert("提示", "请选择分类"); return; } if (rec) { id = rec.id; } else { var
 * node = tree.getSelectionModel().getSelectedNode(); id = node.id; } hisds =
 * new Ext.data.Store({ proxy : new Ext.data.HttpProxy({ url :
 * '/servlet/RationLibServlet' }), reader : new Ext.data.JsonReader({ root :
 * 'result' }, ['id', 'pid', 'name', 'updateOn', 'updateBy', "code", "action"])
 * }); var sm = new Ext.grid.RowSelectionModel({ singleSelect : true }); var cm =
 * new Ext.grid.CheckboxSelectionModel({ dataIndex : 'id' }); var hisgrid = new
 * Ext.grid.GridPanel({ store : hisds, sm : sm, viewConfig : { forceFit : true },
 * autoWidth : true, height : parent.Ext.get("tab_0406_iframe").getHeight() / 2,
 * autoScroll : true, columns : [new Ext.grid.RowNumberer(), cm, { header :
 * 'CODE', sortable : true, dataIndex : 'id' }, { header : '类型名称', sortable :
 * true, dataIndex : 'name', editor : new Ext.form.TextField() }, { header :
 * '父类ID', sortable : true, dataIndex : 'pid' }, { header : '更新人', sortable :
 * true, dataIndex : 'updateBy' }, { header : '更新时间', sortable : true, dataIndex :
 * 'updateOn' }, { header : '操作', sortable : true, dataIndex : 'action',
 * renderer : function(v) { if (!Ext.isEmpty(v)) return v == "del" ? "删除" :
 * "修改"; else return ""; } }], border : false, selModel : new
 * Ext.grid.RowSelectionModel() }); win = new Ext.Window({ modal : true,
 * autoHeight : true, width : 660, title : '历史记录', labelAlign : "right",
 * buttonAlign : "center", items : hisgrid }); hisds.load({ params : { type : 5,
 * id : id, content : '' } }); win.show(); };
 */

var showUploadImgWin = function() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	var pid = rows[0].data["pid"];
	if (pid == "" || pid == "0" || pid == "1" || pid == "2" || pid == "3"
			|| pid == "4" || pid == "5") {
		Info_Tip("请选择二级分类。");
		return;
	}
	var code = rows[0].data["code"];
	if(code == null || code == ""){
		Info_Tip("二级分类编码为空。");
		return;
	}
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_RATIONLIB";
	FileUpload_Ext.fileType = /jpg|JPG/;
	FileUpload_Ext.fileName = code;
	FileUpload_Ext.initComponent();
};
function upload_fn() {
	// debugger;
	var rows = grid.getSelectionModel().getSelected();
	if (rows.length < 1) {
		Info_Tip("请选择信息。");
		return;
	}
	var path1 = FileUpload_Ext.callbackMsg.split(".");
	path1 = path1[0] + "." + path1[1];
	Ext.Ajax.request({
		url : '/servlet/RationLibServlet?type=13',
		params : {
			type : 3,
			content : 'image~' + FileUpload_Ext.callbackMsg,
			id : rows.get("id")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				ds.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

};

//上传词库窗口
function updateDicWindow(){
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : '上传文件',
							allowBlank : false
						}
					},
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							bodyStyle : 'border:none;'/*,
							html : "<a href='" + FileSite
									+ "/doc/MaterialDic.xls" + "' >标准文档下载</a>"*/
						}
					} ]
		} ]
	});
	win = new Ext.Window({
		title : '更新造价分类词库',
		closeable : true,
		width : 600,
		autoHeight : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : uploadDicFile
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

//词库上传更新方法
function uploadDicFile(){
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/MaterialTypeUploadServlet',
			waitMsg : '上传文件中...',
			success : function(upload_form, o) {
				var returnInfo = o.result;
				if (getState(returnInfo.state,
						commonResultFunc, returnInfo.result)) {
					var sucNum = returnInfo.result;
					var r = /^\+?[1-9][0-9]*$/; //正整数
					if (r.test(sucNum)){
						Info_Tip("本次共更新" + sucNum + "条！");
						win.close();
						//ds.reload();
					}else{
						//错误信息
						showErrorWin(sucNum);
					}
				} 
			},
			failure : function() {
				showErrorWin("词库更新失败，具体请联系技术人员！");
			}
		});
	} else {
		Info_Tip("请正确填写信息。");
	}
}


function showErrorWin(errorMsg){
	Ext.MessageBox.hide();
	//win.close();
	var exceptionMsg = new Ext.form.FormPanel(
			{
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [ {
					xtype : 'textarea',
					width : 380,
					value : errorMsg,
					style : "min-height:300px;",
					allowBlank : false,
					autoHeight : true
				} ],
				buttons : [ {
					text : '确定',
					handler : function() {
						win1.close();
					}
				} ]
			});
	var win1 = new Ext.Window({
		title : '错误提示',
		closeAction : "close",
		width : 500,
		autoHeight : true,
		bodyStyle : 'padding:6px',
		draggable : true,
		modal : true,
		items : [ exceptionMsg ]
	});
	win1.show();

}
