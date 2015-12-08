var ds, grid, ck, pagetool, askds,eid,ename;
var ids = [];// 选择项
var selectinfo,window_note;
var isreplyType = {};

// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu2',
						text : '导入询价',
						handler : function() {
							batchUploadEnterprisePrice();
						},
						hidden : compareAuth('VIP_ASK_UPLOAD')
					}, {
						id : 'rMenu3',
						text : '导出询价',
						handler : function() {
							exportaskinfo();
						},
						hidden : compareAuth('VIP_OFFLINE_ASKPRICE_EXPORT')
					}, {
						id : 'rMenu4',
						text : '同步到VIP材价库',
						handler : synMemberAskPriceLibrary,
						hidden : compareAuth('VIP_SYN_MATERIAL_LIB')
					}, {
						id : 'rMenu5',
						text : '查看全部询价结果',
						handler :toList ,
						hidden : compareAuth("VIP_OFFLINE_ASKPRICE_VIEW")
					},{
						id:'rMenu6',
						text:'导入普通询价',
						hidden:compareAuth("UPLOAD_ASKPRICE_TO_ENTERPRISE"),
						handler:batchUploadAskPriceToEnterprise
					}]
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/EpEnterpriseAskPriceServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "ename", "updateby","offlineInquiryNum",
							"updateon","validdate"
							]),
				baseParams : {
					page : 1,
					method : "searchVipAskPrice",
					pageSize : 20
				},
				countUrl : '/mc/EpEnterpriseAskPriceServlet',
				countParams : {
					method : "searchVipAskPriceCount"
				},
				sortInfo : {field: "updateOn", direction: "DESC"},
				remoteSort : true

			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				// pageSize:20,
				displayInfo : true
			});

	grid = new xg.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '企业ID',
							sortable : false,
							width : 100,
							dataIndex : 'eid'
						}, {
							header : '企业名称',
							sortable : false,
							width : 100,
							dataIndex : 'ename'
						},{
							header : '询价数',
							sortable : true,
							width : 180,
							dataIndex : 'offlineInquiryNum'
						},  {
							header : '更新时间',
							sortable : true,
							width : 180,
							dataIndex : 'updateon'
						}, {
							header : '有效期',
							sortable : false,
							width : 80,
							dataIndex : 'validdate',
							renderer: function (data, metadata, record, rowIndex, columnIndex, ds) {  
							      var  total= ds.getAt(rowIndex).get('validdate');  
							      return total.split(" ")[0];  
							  
							 }  
								
						}, {
							header : '更新人',
							sortable : true,
							width : 80,
							dataIndex : 'updateby'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '导入询价',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/page_excel.png',
							handler : batchUploadEnterprisePrice,
							hidden : compareAuth('VIP_ASK_UPLOAD')

						}, {
							text : '导出询价',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/page_excel.png',
							handler : exportaskinfo,
							hidden : compareAuth('VIP_OFFLINE_ASKPRICE_EXPORT')
						}, {
							text : '同步到VIP材价库',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/page_excel.png',
							handler : synMemberAskPriceLibrary,
							hidden : compareAuth('VIP_SYN_MATERIAL_LIB')
						}, {
							text : '查看全部询价结果',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("VIP_OFFLINE_ASKPRICE_VIEW"),
							handler : toList
						},{
							text:'导入普通询价',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/page_excel.png',
							hidden:compareAuth("UPLOAD_ASKPRICE_TO_ENTERPRISE"),
							handler:batchUploadAskPriceToEnterprise
						}],
				bbar : pagetool,
				renderTo : 'ask_grid'
			});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
					xtype : "label",
					text : "企业名称："
				}, {
					xtype : "textfield",
					triggerAction : 'all',
					valueField : "eid",
					displayField : "fname",
					readOnly : false,
					//emptyText : '请选择',
					id : "search_emp",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();
				selectinfo = row.get("ename");
				showaskinfo(selectinfo);
			});
	ds.load();
	//emp_store.load();
	
};

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

Ext.onReady(function() {
			init();
		});

function showaskinfo(selectinfo){
	window.parent.createNewWidget("ask_vipEnterprisePrice_list", '查看全部询价',
	'/module/ask/ask_vipEnterprisePrice_list.jsp?ename=' + selectinfo);
}

// 查询信息
function searchlist() {
	ds.baseParams["content"] = "ename~"+Ext.fly("search_emp").getValue();
	ds.baseParams["page"] = 1;
	ds.load();
};
// 导出询价信息
function exportaskinfo() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个企业");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个企业");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var eid = row.get("eid");
	Ext.Msg.confirm("提示", "您确定要导出企业全部询价?", function(op) {
		if (op == "yes") {
			window.document.exportform.action = "/mc/EpEnterpriseAskPriceServlet?method=enterpriseAskPriceExport&eid="
					+eid + "&dir=" + ds.sortInfo.direction;
			window.document.exportform.submit();
		}
	});
};


function batchUploadEnterprisePrice() {
	
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个企业");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个企业");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
    eid = row.get("eid");
    ename = row.get("ename");
	window.parent.createNewWidget("ask_material_price_preview", '导入企业询价预览',
			'/module/ask/ask_material_price_preview.jsp?eid='+eid+'&ename='+ename);
};



function batchUploadAskPriceToEnterprise(){
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [ {
				// columnWidth : 0.5,
				layout : 'form',
				bodyStyle : 'border:none;',
				items : {
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				}
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入普通询价',
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


function uploadFile(){
	var loadMarsk = new Ext.LoadMask(document.body, {
		 msg  : '系统正在处理中，请稍后.....',
		 removeMask : true// 完成后移除
	});
	
	if (upload_form.getForm().isValid()) {
		win.hide();
		loadMarsk.show();
		upload_form.getForm().getEl().dom["accept-charset"] = "UTF-8";
		upload_form.getForm().submit({
				    url : '/mc/EpEnterpriseAskPriceServlet?method=uploadAskPriceToEnterprise',
					method:"post",
					//waitMsg : '上传文件中...',
					success : function(batch_up, o) {
						var returnInfo = o.result;
					
						if (getState(returnInfo.state,
								commonResultFunc, returnInfo.result)) {
							
							var r = /^\+?[1-9][0-9]*$/; //正整数
							if(r.test(returnInfo.result)){
								win.close();
								alert("本次共上传"+returnInfo.result+"条普通询价！");
								ds.reload();
							}else{
								win.show();
							    resultException(returnInfo.result);
							}
							loadMarsk.hide();
							
						} 

					},
					failure : function() {
						win.show();
						loadMarsk.hide();
					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
}

function  resultException(mag){
	var exceptionMsg = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [{
							xtype : 'textarea',
							//fieldLabel : "上传文件",
							width : 350,
							value:mag,
							style:"min-height:300px;",
							allowBlank : false,
							autoHeight : true,

						}],
				buttons : [{
							text : '确定',
							handler : function() {
								win.close();
							}
						}]
			});
	win1 = new Ext.Window({
				title : '错误提示',
				closeAction : "close",
				width : 500,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [exceptionMsg]
			});
	win1.show();
}


function toList(){
	window.parent.createNewWidget("ask_vipEnterprisePrice_list", '查看全部询价',
			'/module/ask/ask_vipEnterprisePrice_list.jsp');
}


//将字符串格式化为时间
function parseDate(str) {
    if (typeof str == 'string') {
        var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
        if (results && results.length > 3)
            return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10));
        results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
        if (results && results.length > 6)
            return new Date(parseInt(results[1], 10), (parseInt(results[2], 10) - 1), parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10));
        results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
        if (results && results.length > 7)
            return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10), parseInt(results[7], 10));
    }
    return null;
}


function synMemberAskPriceLibrary(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个企业");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个企业");
		return;
	}
	
	var row = grid.getSelectionModel().getSelected();
	var eid = row.get("eid");
	var validdate = row.get("validdate");
	var now = new Date();
    var endDate = parseDate(validdate);
    var leftTime = endDate.getTime() - now.getTime();
    if (leftTime < 0) {
       alert("该企业已经过期，不能同步材价");
       return;
    }
	
	
	Ext.Msg.confirm("提示", "您确定要同步到该企业的材价库?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post",
					"/mc/EpEnterpriseAskPriceServlet?method=addToMaterialLib&eid="+eid, {
						success : function(response) {
							var jsondata = eval("("
									+ response.responseText + ")");
							if (getState(jsondata.state,
									commonResultFunc, jsondata.result)) {
								Info_Tip("本次同步"+jsondata.result+"条材价！");
								win.close();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
		}
	});
	
}