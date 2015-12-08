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
		text : '采购分类'
	});

	tree = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/servlet/cgRationLibServlet?type=1'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:20px;',
		rootVisible : true,
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
					
					o[i].text = o[i].procureCode +" "+ o[i].name;
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
				url : '/servlet/cgRationLibServlet?type=2&isBlur=0'
			});
			ds.load({
				params : {
					id : node.id
				}
			});
		} else {// 不是叶节点
			ds.proxy = new Ext.data.HttpProxy({
				url : '/servlet/cgRationLibServlet?type=2&isBlur=0'
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
			url : '/servlet/cgRationLibServlet?type=2'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'pid', 'name', 'procureCode', 'notes'])
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
			dataIndex : 'procureCode',
			//renderer : showCode,
			width:50
		}, {
			header : '分类名称',
			sortable : false,
			dataIndex : 'name',
			width:50
		}, {
			header : '备注',
			sortable : false,
			dataIndex : 'notes',
			width:50,
			editor : {
				xtype : 'field'
			}
		}],
		renderTo : 'grid',
		border : false,
		selModel : new Ext.grid.RowSelectionModel()
	});

	grid.on('beforeedit', function(e) {
		if (compareAuth("RATION_LIB_MOD")) {
			Info_Tip("对不起，您暂时不能进行此操作。");
			return false;
		} else
			return true;
	});

	grid.on("afteredit", function(e) {
		editInfo(e.record.data["id"], e.field, e.value);
	});


	
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
			},{
				text : '创建材料分类文件',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/report_magnify.png',
				hidden : compareAuth("RATION_LIB_JS_CREATE"),
				handler : createCidFile
			}/*,{
				text : '更新采购分类词库',
				cls : 'x-btn-text-icon',
				icon : '/resource/images/report_magnify.png',
				hidden : compareAuth("RATION_LIB_CG_UPDATE_DIC"),
				handler : updateDicWindow
			} */]
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


// 显示查看面板
function openShowOrder(id) {
	window.parent.createNewWidget("orders_detail", '查看二级分类',
			'/module/mat/rationLib_detail.jsp?id=' + id);
}

// 上传
function uploadFile() {
	submitForm();
};
//修改信息
function editInfo(id, field, value) {
	Ext.Ajax.request({
				url : '/servlet/cgRationLibServlet',
				params : {
					type : 5,
					id : id,
					content : field + "~" + value
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						grid.stopEditing();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 上传操作
function submitForm(append) {
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/servlet/cgRationLibServlet?type=4',
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
									+ "/doc/Ration.xls" + "' >标准文档下载</a>"*/
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


function createCidFile() {
	Ext.Ajax.request({
		url : '/servlet/cgRationLibServlet',
		params : {
			type : 3
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Info_Tip("zjt/commonJS/cgCid_db.js文件创建成功。");
			} else {
				Warn_Tip(data.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}


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
							bodyStyle : 'border:none;',
							html : "<a href='" + FileSite
									+ "/doc/CgMaterialDic.xls" + "' >标准文档下载</a>"
						}
					} ]
		} ]
	});
	win = new Ext.Window({
		title : '更新采购分类词库',
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
			url : '/MaterialTypeUploadServlet?isCgDic=1',
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