Ext.onReady(init);
var grid, ds, ds2, win1, pageSize = 20, query_type, query_input, query_con, win, row, thiseid, fs, vip_grid, memgrid, memds, empgrid, empds, empwin;
var eidGlobal;
var isShows = [];
var upload_form, win;

function init() {
	Ext.QuickTips.init();
	buildGrid();
};
// 工具栏
var toolbar = [ {
	text : '查看/修改',
	hidden : compareAuth('EVALUATION_UPDATE_VIEW'),
	handler : showEnterpriseEditInfo,
	icon : '/resource/images/edit.gif'
}, {
	text : '上传',
	cls : 'x-btn-text-icon',
	icon : '/resource/images/add.gif',
	hidden : compareAuth('EVALUATION_UPLOAD_VIEW'),
	handler : exportEvaluation
}, {
	text : '删除',
	hidden : compareAuth('EVALUATION_DELETE_VIEW'),
	handler : deleteData,
	icon : '/resource/images/delete.gif'
} ];
// 右键菜单
var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : toolbar
});

function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/evaluationServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "evaluationId","companyName", "evaluationBy","companyNameTwo", "title", "content",
				"evaluationType", "createOn", "trueName",
				"userId", "eidType" ]),
		baseParams : {
			type : 1,
			page : 1,
			content : "",
			pageSize : pageSize
		},
		countUrl : '/mc/evaluationServlet.do',
		countParams : {
			type : 2,
			content : ""
		},
		remoteSort : true
	});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true,
		pageSize : pageSize
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	grid = new Ext.grid.EditorGridPanel({
		store : ds,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoHeight : true,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		clicksToEdit : 1,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : 'createOn',
			sortable : false,
			dataIndex : 'createOn',
			hidden : true
		}, {
			header : 'trueName',
			sortable : false,
			dataIndex : 'trueName',
			hidden : true
		}, {
			header : 'userId',
			sortable : false,
			dataIndex : 'userId',
			hidden : true
		}, {
			header : 'eidType',
			sortable : false,
			dataIndex : 'eidType',
			hidden : true
		}, {
			header : '评价类型',
			sortable : true,
			width : 40,
			dataIndex : 'evaluationType',
			renderer : function(value) {
				return value == '1' ? '好评' : '差评';
			}
		}, {
			header : '评价内容',
			sortable : true,
			width : 280,
			dataIndex : 'content',
		}, {
			header : '项目名称',
			sortable : false,
			width : 120,
			dataIndex : 'title',
		//editor :new Ext.form.TextField() 

		}, {
			header : '评价方',
			width : 110,
			sortable : true,
			dataIndex : 'evaluationId'
		}
		, {
			header : '评价方公司名',
			width : 150,
			sortable : true,
			dataIndex : 'companyName'
		},
		{
			header : '被评价方',
			width : 110,
			sortable : true,
			dataIndex : 'evaluationBy'
		},{
			header : '被评价方公司名',
			width : 150,
			sortable : true,
			dataIndex : 'companyNameTwo'
		}, {
			header : '上传时间',
			sortable : true,
			dataIndex : 'createOn'//, 
			//renderer : Ext.util.Format.dateRenderer('y-m-d h:m:s')
		//,
		//editor : {
		//	format : "Y-m-d"
		//}
		} ],
		tbar : toolbar,
		bbar : pagetool,
		renderTo : 'grid'
	});

    new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [
				{
					xtype : "label",
					text : "查询类型："
				},
				{
					xtype : 'combo',
					id : 'queryName',
					store : [ [ "title", "项目名称" ], [ "companyName", "评价方" ],
							[ "companyNameTwo", "被评价方" ] ],
					triggerAction : 'all',
					readOnly : true,
					width : 90,
					value : "title",
					listeners : {
						select : function(combo, record, index) {
							searchlist();
						}
					}
				},
				"-",
				{
					xtype : "label",
					text : "关键字："
				},
				{
					xtype : "textfield",
					id : "content",
					fieldLabel : "关键字",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},
				"-",
				{
					text : "查询",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				},
				{
					xtype : 'combo',
					id : 'elatType',
					store : [ [ "3", "评价类型" ], [ "1", "好评" ], [ "0", "差评" ] ],
					triggerAction : 'all',
					readOnly : true,
					width : 90,
					value : "3",
					listeners : {
						select : function(combo, record, index) {
							searchlist();
						}
					}
				},
				{
					xtype : 'combo',
					id : 'typeName',
					store : [ [ "3", "评价方身份" ], [ "1", "采购商评价" ],
							[ "2", "供应商评价" ] ],
					triggerAction : 'all',
					readOnly : true,
					width : 90,
					value : "3",
					listeners : {
						select : function(combo, record, index) {
							searchlist();
						}
					}
				} ]
	});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		showEnterpriseEditInfo();
	});
	grid.on('beforeedit', function(e) {
		alert("beforeedit");
	});
	grid.on("validateedit", function(e) {
		if (Ext.isEmpty(e.value)) {
			return false;
		}
		return true;
	});
	grid.on("afteredit", function(e) {
		alert("afteredit");
	});
};

// 查询
function searchlist() {
	var queryName = Ext.getCmp("queryName").getValue();
	var queryValue = Ext.getCmp("content").getValue();
	var evaluationTypeName="evaluationType";
	var evaTypeValue = Ext.getCmp("elatType").getValue();
	var eidTypeName="eidType";
	var eidTypeValue = Ext.getCmp("typeName").getValue();
	var content =queryName + "~" + queryValue;
	if(evaTypeValue!=3){
		content+=";" + evaluationTypeName + "~" +evaTypeValue
	}
	if(eidTypeValue!=3){
		content+=";" + eidTypeName+ "~" +eidTypeValue;
	}
	console.log("content: " +content);
	ds["baseParams"]["content"] = content;
	ds["countParams"]["content"] = content;
	console.log("ds[baseParams][content]" +content);
	ds.load();
};

//
var vald=0;
function ckeid(eid, flag){
	vald=0;
	Ext.Ajax.request({
		url : "/mc/evaluationServlet.do",
		params : {
			type : 7,
			eid : eid
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (json.result == "ok") { 
				if(flag==1){
					alert("修改后的评价方ID不存在，请核实后修改");
					vald=1;
				}else{
					alert("修改后的被评价方ID不存在，请核实后修改");
					vald=2;
				}
			}
		},
		failure : function() {
			alert("数据验证失败");
		}
	});
}
// 修改信息
function editInfo() {
	if (!form.getForm().isValid()) {
		alert("数据不符合要求!");
		return false;
	}
	if(vald==1){
		alert("评价方ID不存在，核实后修改!");
		return false;
	}
	if(vald==2){
		alert("被评价方ID不存在，核实后修改!");
		return false;
	}
	vald=0;
	form.getForm().submit({
		success : function(form, action) {
			win1.close();
			Ext.MessageBox.alert("", "修改成功", function() {
				ds.reload();
			});
		},
		failure : function() {
			Ext.MessageBox.alert("", "对不起，表单提交失败！");
		}
	  });
};

function exportEvaluation() {
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [ {
				layout : 'form',
				bodyStyle : 'border:none;',
				items : [
						{
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : '选择文件',
							allowBlank : false
						},
						{
							columnWidth : 0.5,
							layout : 'form',
							bodyStyle : 'border:none;',
							items : {
								bodyStyle : 'border:none;',
								html : "<a href='" + FileSite
										+ "/doc/evaluationTemplate.xls"
										+ "' >标准文档下载</a>"
							}
						} ]
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入评价信息',
		closeable : true,
		width : 400,
		height : 120,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : function() {
				uploadFile();
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

function uploadFile() {
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit(
				{
					url : '/mc/evaluationServlet.do?type=3',
					waitMsg : '上传文件中...',
					success : function(upload_form, o) {
						var returnInfo = o.result;
						if (getState(returnInfo.state, commonResultFunc,
								returnInfo.result)) {
							var sucNum = returnInfo.result;
							var r = /^\+?[1-9][0-9]*$/; //正整数
							if (r.test(sucNum)){
								Info_Tip("成功导入" + sucNum + "条！");
								win.close();
								ds.reload();
							}else{
								showErrorWin(sucNum);
							}	
						}
					},
					failure : function() {
						Info_Tip("上传数据遇到错误!");
					}
				});
	} else
		Info_Tip("请正确填写信息。");
}

/**
 * 
 * @param errorMsg
 */
function showErrorWin(errorMsg) {
	Ext.MessageBox.hide();
	//win.close();
	var exceptionMsg = new Ext.form.FormPanel({
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
			autoHeight : true,

		} ],
		buttons : [ {
			text : '确定',
			handler : function() {
				win1.close();
				ds.reload();
			}
		} ]
	});
	var win1 = new Ext.Window({
		title : '上传数据结果反馈',
		closeAction : "close",
		width : 500,
		autoHeight : true,
		bodyStyle : 'padding:6px',
		draggable : true,
		modal : true,
		items : [ exceptionMsg ]
	});
	win1.show().center();

}
var form;
/**
 * 编辑修改信息
 */
function showEnterpriseEditInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	} 
	form = new Ext.form.FormPanel({
		id : 'card-2',
		layout : "form",
		bodyStyle : 'padding:6px;',
		Width : 500,
		Height : 600,
		labelWidth : 120,
		labelAlign : 'left',
		frame : true,
		border : true,
		buttonAlign : 'right',
		url : '/mc/evaluationServlet.do?type=6',
		method : "post",
		items : [ {
			id : 'id',
			name : 'id',
			value : row.get("id"),
			xtype : 'hidden'
		}, {
			id : 'eidType',
			name : 'eidType',
			value : row.get("eidType"),
			xtype : 'hidden'
		}, {
			id : 'createOn',
			name : 'createOn',
			value : row.get("createOn"),
			xtype : 'hidden'
		}, {
			id : 'userId',
			name : 'userId',
			value : row.get("userId"),
			xtype : 'hidden'
		}, {
			id : 'trueName',
			name : 'trueName',
			value : row.get("trueName"),
			xtype : 'hidden'
		}, {
			id : 'companyName',
			name : 'companyName',
			value : row.get("companyName"),
			xtype : 'hidden'
		}, {
			id : 'companyNameTwo',
			name : 'companyNameTwo',
			value : row.get("companyNameTwo"),
			xtype : 'hidden'
		}
		, {
			xtype : 'combo',
			id : "evaluationType",
			name : "evaluationType",
			store : [ [ '1', '好评' ], [ '0', '差评' ] ],
			triggerAction : "all",
			value : row.get("evaluationType"),
			width : 120,
			readOnly : true,
			fieldLabel : '评价类型',
			listeners : {
				scope : this,
				'select' : function(combo, record, index) {
				}
			}
		}, {
			xtype : 'container',
			layout : 'form',
			id : 'ask_area',
			items : {
				xtype : 'textfield',
				id : 'evaluationId',
				name : 'evaluationId',
				width : 120,
				fieldLabel : '评价方ID',
				allowBlank : false,
				value : row.get("evaluationId"),
				minValue : 0,
				allowNegative : false,
				allowDecimals : false,
				listeners:{
					change:function(){
					  return ckeid(form.getForm().findField("evaluationId").getValue(),1);
					}
				}
			}
		}, {
			xtype : 'container',
			layout : 'form',
			id : 'mat_area',
			items : {
				xtype : 'textfield',
				id : 'evaluationBy',
				name : 'evaluationBy',
				width : 120,
				fieldLabel : '被评价方ID',
				allowBlank : false,
				value : row.get("evaluationBy"),
				minValue : 0,
				allowNegative : false,
				allowDecimals : false,
				listeners:{
					change:function(){
					  return ckeid(form.getForm().findField("evaluationBy").getValue(),2);
					}
				}
			}
		}, {
			xtype : 'container',
			layout : 'form',
			id : 'pro_area',
			items : {
				xtype : 'textfield',
				id : 'title',
				name : 'title',
				width : 220,
				fieldLabel : '项目名称',
				allowBlank : false,
				value : row.get("title"),
				minValue : 0,
				allowNegative : false,
				allowDecimals : false
			}
		}, {
			xtype : 'container',
			layout : 'form',
			id : 'sup_area',
			items : {
				xtype : 'textarea',
				id : 'content2',
				name : 'content',
				width : 320,
				height : 120,
				fieldLabel : '评价内容',
				allowBlank : false,
				value : row.get("content"),
				minValue : 0,
				allowNegative : false,
				allowDecimals : false
			}
		} ],
		buttons : [ {
			text : '确定',
			handler : function() {
				editInfo();
			}
		}, {
			text : '关闭',
			handler : function() {
				win1.close();
			}
		} ],
		listeners : {
			"show" : function() {
			}
		}
	});

	win1 = new Ext.Window({
		title : '查看/修改评价',
		closeAction : "close",
		width : 500,
		Height : 600,
		bodyStyle : 'padding:6px',
		draggable : true,
		modal : true,
		items : [ form ]
	});
	win1.show().center();
}

/**
 * 删除数据
 */
function deleteData() {

	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length >= 1) {
		Ext.MessageBox.confirm("确认操作", "您确定要删除选中评价信息吗?", function(op) {
			if (op == "yes") {
				Ext.Ajax
						.request({
							url : "/mc/evaluationServlet.do",
							params : {
								type : 5,
								ids : ids
							},
							success : function(response) {
								var json = eval("(" + response.responseText+ ")");
								if (getState(json.state, commonResultFunc,json.result)) {
									Info_Tip("删除成功。");
									ds.load();
								}
							},
							failure : function() {
								Info_Tip("删除遇到错误。");
							}
						});
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请至少选择一条信息！");
	}
}
