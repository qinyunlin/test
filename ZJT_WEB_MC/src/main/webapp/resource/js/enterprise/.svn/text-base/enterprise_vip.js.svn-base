Ext.onReady(init);
var grid, ds, ds2, pageSize = 20, query_type, query_input, query_con, win, row, thiseid, fs, vip_grid, memgrid, memds, empgrid, empds, empwin;
var eidGlobal;
var isShows = [];
var upload_form,win,addData_win,ds_data,grid_data;
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);

function init() {
	Ext.QuickTips.init();
	buildGrid();
};
// 工具栏
	var toolbar = [{
			text : '权限模块设置	',
			hidden : compareAuth('VIP_EP_DIR_AUTH'),
			handler : showAuthWin,
			icon : '/resource/images/brick_edit.png'
		}, {
			text : '查看/修改',
			hidden : compareAuth('VIP_EP_VIEW'),
			handler : showEnterpriseEditInfo,
			icon : '/resource/images/brick_edit.png'
		},{
			text : '续期',
			hidden : compareAuth('VIP_EP_RENEWAL'),
			handler : renewal,
			icon : '/resource/images/brick_edit.png'
		},{
			text : '设置区域',
			hidden : compareAuth('VIP_EP_AREA'),
			handler : setArea,
			icon : '/resource/images/brick_edit.png'
		},{
			text : '积分明细',
			icon : "/resource/images/edit.gif",
			handler : showVipScoreDetail,
			hidden : compareAuth('VIP_EP_SCORE_DETAIL')
		},/*{
			text : '充值明细',
			icon : "/resource/images/edit.gif",
			handler : showRechargeDetail
//			hidden : compareAuth('VIP_EP_RECHARGE_DETAIL')
		},*/{
			text : '开通试用',
			hidden : compareAuth('VIP_EP_OPEN_TRY'),
			handler : showOpenTry,
			icon : '/resource/images/brick_edit.png'
		}, {
			text : '导入订单开通/续期',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/database_add.png',
			hidden : compareAuth('VIP_EP_ORDER_EXPORT'),
			handler : exportVipOrders
		}, {
			text : '查看云造价订单',
			hidden : compareAuth('VIP_EP_ORDER_LIST'),
			handler : showVipOrder,
			icon : '/resource/images/table_row_insert.png'
		}, {
			text : '锁定',
			hidden : compareAuth('VIP_EP_LOCK'),
			cls : 'x-btn-text-icon',
			icon : '/resource/images/lock.png',
			handler : epVipLock
		}, {
			text : '管理子帐号',
			hidden : compareAuth('VIP_EP_ADD_MEM_LIST'),
			icon : '/resource/images/add.gif',
			handler : addMember
		},{
			text : '云造价权限设置',
			hidden : compareAuth('VIP_EP_AUTH_LIST'),
			icon : '/resource/images/brick_edit.png',
			handler : openVipAuth
		}, {
			text : '查看已锁定云造价企业',
			hidden : compareAuth('VIP_EP_LOCK_LIST'),
			icon : '/resource/images/edit.gif',
			handler : openLockList
		}, {
			text : '迁入数据',
			hidden : compareAuth('VIP_EP_ACCOUNT_MOVE'),
			icon : '/resource/images/add.gif',
			handler : showAddData
		}];
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : toolbar
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/vip/VipEpAccountServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "ename", "degree", "isLock","createOn","createBy","updateOn","updateBy","beginDate","endDate","codes",
						    "askCount","totalAskCount","materialCount","residueMaterialCount","collectMaterialCount","facCount","residueFacCount",
						    "collectFacCount","memberCount","residueAskCount","uploadMaterialCount","uploadFacCount","currMemCount","notes","webProvince","currScore"]),
				baseParams : {
					type : 1,
					page : 1,
					content : "isLock~0",
					pageSize : pageSize
				},
				countUrl : '/mc/vip/VipEpAccountServlet.do',
				countParams : {
					type : 2,
					content : "isLock~0"
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
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 80,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : false,
							width : 120,
							dataIndex : 'ename'
						}, {
							header : '创建时间',
							width : 150,
							sortable : true,
							dataIndex : 'createOn'
						}, {
							header : '导入询价数',
							sortable : true,
							dataIndex : 'totalAskCount'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '剩余询价数',
							sortable : true,
							dataIndex : 'residueAskCount'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '已用流量',
							sortable : true,
							dataIndex : 'collectMaterialCount'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '剩余流量数',
							sortable : true,
							dataIndex : 'residueMaterialCount'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, /*{
							header : '已用流量数',
							sortable : true,
							dataIndex : 'collectFacCount',
							editor : {
								xtype : 'numberfield'
							}
						},*//* {
							header : '剩余供应商收藏',
							sortable : true,
							dataIndex : 'residueFacCount',
							editor : {
								xtype : 'numberfield'
							}
						},*/  {
							header : '成员上限数',
							sortable : true,
							dataIndex : 'memberCount'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						},{
							header : '已设置成员数',
							sortable : true,
							dataIndex : 'currMemCount'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						},{
							header : '企业积分',
							sortable : true,
							dataIndex : 'currScore'
						}, {
							header : '有效期',
							sortable : true,
							width : 150,
							dataIndex : 'endDate'/*,
							editor : {
								xtype : 'datefield',
								format : "Y-m-d"
							}*/
						}, {
							header : '访问区域',
							sortable : true,
							width : 150,
							dataIndex : 'webProvince'
						}],
				tbar : toolbar,
				bbar : pagetool,
				renderTo : 'grid'
			});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
				items : [{
							xtype : "label",
							text : "查询类型："
						},{
							xtype : 'combo',
							id : 'queryName',
							store : [ [ "eid", "企业ID" ], [ "ename", "企业名称" ]],
							triggerAction : 'all',
							readOnly : true,
							width : 90,
							value : "ename",
							listeners : {
								select : function(combo, record, index) {
									searchlist();
								}
							}
						}, "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							id : "queryValue",
							fieldLabel : "关键字",
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, "-", {
							text : "查询",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		showEnterpriseEditInfo();
			});
	grid.on('beforeedit', function(e) {
				if (!compareAuth('VIP_ADMIN_MOD'))
					return true;
				else
					return false;
			});
	grid.on("validateedit", function(e) {
				if (Ext.isEmpty(e.value)) {
					return false;
				} else
					return true;
			});
	grid.on("afteredit", function(e) {
				// 为日期类型时转换格式，源码已作修改
				// if (e.grid.colModel.lookup[e.column - 1].editor["xtype"] ==
				// "datefield")
				// editInfo(e.record.data["eid"], e.field,
				// e.value.format("Y-m-d"));
				// else
				editInfo(e.record.data["eid"], e.field, e.value);
			});
};

// 查询
function searchlist() {
	var queryName = Ext.getCmp("queryName").getValue();
	var queryValue = Ext.getCmp("queryValue").getValue();
	var content = queryName + "~" + queryValue + ";isLock~0";
	ds["baseParams"]["content"] = content;
	ds.load();
};

// 添加会员
function addMember() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("eid");
	var ename = encodeURI(row.get("ename"));
	window.parent.createNewWidget("enterprise_vip_mem_add", '查看云造价会员',
			'/module/enterprise/enterprise_vip_mem_add.jsp?eid=' + thisid
					+ "&ename=" + ename);
};
// 验证是否VIP
function checkVip(index) {
	var row = empgrid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("eid");
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 9,
					eid : thisid
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (!json.result) {
						var l = Ext.getCmp('card-wizard-panel').getLayout();
						var next = parseInt(index);
						l.setActiveItem(next);
						Ext.getCmp('card-prev').setDisabled(next == 0);
						Ext.getCmp('card-next').setDisabled(next == 2);
					} else
						Info_Tip("该企业已开通云造价了。");
				},
				failure : function() {
					Warn_Tip();
				}
			});
};


// 修改信息
function editInfo(eid, field, value) {
	Ext.Ajax.request({
				url : '/mc/vip/VipEpAccountServlet.do',
				params : {
					type : 3,
					eid : eid,
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

function openLockList(){
	window.parent.createNewWidget("enterprise_vip_lock", '已锁定云造价企业',
	'/module/enterprise/enterprise_vip_lock.jsp');
}

function openVipAuth(){
	window.parent.createNewWidget("vip_auth_list", '云造价权限设置',
	'/module/enterprise/vip_auth_list.jsp');
}

function exportVipOrders(){
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
				items : [{
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
						html : "<a href='" + FileSite + "/doc/VipOrders.xls"
								+ "' >标准文档下载</a>"
					}
				} ]
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入订单开通/续期',
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
		upload_form
				.getForm()
				.submit(
						{
							url : '/mc/vip/EpVipServlet.do?type=7',
							waitMsg : '上传文件中...',
							success : function(upload_form, o) {
								var returnInfo = o.result;
								if (getState(returnInfo.state,
										commonResultFunc, returnInfo.result)) {
									var sucNum = returnInfo.result;
									var r = /^\+?[1-9][0-9]*$/; //正整数
									if (r.test(sucNum)){
										Info_Tip("云造价订单成功导入" + sucNum + "条！");
										win.close();
										ds.reload();
									}else{
										if (sucNum.indexOf("~") != -1){//信息确认
											//msgTips(sucNum);
											resameMsgTips(sucNum);
										}else{ //错误信息
											showErrorWin(sucNum);
										}
									}
								} 
							},
							failure : function() {

							}
						});
	} else
		Info_Tip("请正确填写信息。");
}

function resameMsgTips(msg){
	var msgArr = msg.split("~");
	var filepath = msgArr[0];//服务器临时文件路径
	var rename = msgArr[1];//疑似的企业
	
	var renameApp = "";
	var reCount = 0;
	if (rename != null && "" != rename){
		var renameArr = rename.split("|");
		for(var i = 0 ; i < renameArr.length; i ++){
			var renameStr = renameArr[i];
			renameApp += "<spane style='color: #000000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
			renameApp += "<p style='color:red'>";
			renameApp += renameStr;
			renameApp += "<p></span>";
			renameApp += "<br>";
		}
		reCount = renameArr.length;
	}
	var msgApp = "<span style='color: #000000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
		+ "系统检测出以下" + (reCount) + "条疑似已存在企业：</span><p><br>"
		+ renameApp;
	
	Ext.MessageBox
			.show({
				title : '云造价开通提示',
				msg : msgApp,
				width : 800,
				prompt : false,
				buttons : {
					"ok" : "仍然提交",
					"cancel" : "取消"
				},
				multiline : false,
				fn : function(
						btn,
						text) {
					if ("ok" == btn) {
						var submitData = filepath;
						Ext.lib.Ajax
								.request(
										"post",
										"/mc/vip/EpVipServlet.do?type=8",
										{
											success : function(
													response) {
												var data = eval("("
														+ response.responseText
														+ ")");
												if (getState(
														data.state,
														commonResultFunc,
														data.result)) {
													var sucNum = data.result;
													var r = /^\+?[1-9][0-9]*$/; //正整数
													if (r.test(sucNum)){
														Info_Tip("云造价订单成功导入" + sucNum + "条！");
														win.close();
														ds.reload();
													}else{
														showErrorWin(sucNum);
													}
												}else{
													showErrorWin(sucNum);
												}
											}
										},
										"submitData=" + submitData);
					}
				}
			});
}

function msgTips(msg){
	var msgArr = msg.split("~");
	var filepath = msgArr[0];//服务器临时文件路径
	var remem = msgArr[1]; //帐号已有关联企业   x1;x2
	var rename = msgArr[2];//企业名称相同 x1;x1|x2;x2
	
	var renameApp = "";
	var rememApp = "";
	var rememData = "";
	
	var msgCount = 0;
	var reCount = 0;

	if (rename != null && "" != rename){
		var renameArr = rename.split("|");
		for(var i = 0 ; i < renameArr.length; i ++){
			var chkArr = renameArr[i].split(";");
			var chk_name = chkArr[0];
			var chk_eid = chkArr[1];
			var chk_memId = chkArr[2];
			var chk_new_eid = chkArr[3];
			var chkValue = chk_eid + "," + chk_memId + "," + chk_new_eid;
			renameApp += "<input type='checkbox' style='margin-left:30px;' name='renameChk' value='" + chkValue + "' />&nbsp;";
			renameApp += "<spane style='color: #000000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
			renameApp += chk_name;
			renameApp += "</span>";
			renameApp += "<p><br>";
		}
		msgCount = renameArr.length;
	}
	
	
	if (remem != null && "" != remem){
		var rememArr = remem.split("|");
		for(var i = 0 ; i < rememArr.length; i ++){
			var epMemArr = rememArr[i].split(";");
			var epMemId = epMemArr[0];
			var epName = epMemArr[1];
			var epMem = epMemArr[2];
			rememData += epName + "," +  epMem + ";";
			rememApp += "<span style='margin-left:30px;color: #ff0000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>";
			rememApp += epMemId;
			rememApp += "</span>";
			rememApp += "<p><br>";
		}
		reCount = rememArr.length;
	}
	
	
	if (rememData.lastIndexOf(";") != -1){
		rememData = rememData.substring(0,rememData.lastIndexOf(";"));
	}
	
	var msgApp = "<span style='color: #000000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
		+ "系统检测出以下" + (msgCount + reCount) + "条疑似已存在企业：（"
		+ "<span style='color: #ff0000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
		+ "红色标识为账号重复，请检查是否应为续期操作"
		+ "</span>)</span>"
		+ "<p><br>"
		+ "<span style='margin-left:30px;color: #000000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
		+ "注意：请勾选确定重复的企业，服务将自动累加到原企业，未勾选的将生成新的企业！"
		+ "</span>"
		+ "<p><br>"
		+ rememApp
		+ renameApp;
	
	Ext.MessageBox
			.show({
				title : '云造价开通提示',
				msg : msgApp,
				width : 800,
				prompt : false,
				buttons : {
					"ok" : "提交",
					"cancel" : "取消"
				},
				multiline : false,
				fn : function(
						btn,
						text) {
					if ("ok" == btn) {
						var checkFlag = false;
						if (renameApp == null || "" == renameApp){
							checkFlag = true;
						}
						if (rememApp != null && "" != rememApp && checkFlag){
							alert("本次无提交成功的订单！");
							return false;
						}
						var submitData = filepath + "~";
						$("input:checkbox[name=renameChk]:checked").each(function() {
							submitData += $(this).val() + ";";
						});
						if (submitData.lastIndexOf(";") != -1){
							submitData = submitData.substring(0,submitData.lastIndexOf(";"));
						}
						submitData += "~" + rememData;
						Ext.lib.Ajax
								.request(
										"post",
										"/mc/vip/EpVipServlet.do?type=8",
										{
											success : function(
													response) {
												var data = eval("("
														+ response.responseText
														+ ")");
												if (getState(
														data.state,
														commonResultFunc,
														data.result)) {
													var sucNum = data.result;
													var r = /^\+?[1-9][0-9]*$/; //正整数
													if (r.test(sucNum)){
														Info_Tip("云造价订单成功导入" + sucNum + "条！");
														win.close();
														ds.reload();
													}else{
														showErrorWin(sucNum);
													}
												}else{
													showErrorWin(sucNum);
												}
											}
										},
										"submitData=" + submitData);
					}
				}
			});



}

/**
 * 
 * @param errorMsg
 */
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
					autoHeight : true,

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

/**
 * 编辑查看VIP企业信息
 */
function showEnterpriseEditInfo(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条云造价企业信息。");
		return;
	}
	var eid = row.get("eid");
	window.parent.createNewWidget("vip_enterprise_edit", '修改企业信息',
	'/module/enterprise/vip_enterprise_edit.jsp?eid=' + eid);
}

/**
 * 查看VIP订单
 */
function showVipOrder(){
	window.parent.createNewWidget("vipOrder_list", '查看云造价订单',
			'/module/enterprise/vipOrder_list.jsp');
}

/**
 * 锁定VIP企业
 */
function epVipLock(){
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length == 1) {
		Ext.MessageBox.confirm("确认操作", "您确定要锁定选中的云造价企业吗?", function(op) {
			if (op == "yes") {
				Ext.Ajax.request({
					url : "/mc/vip/VipEpAccountServlet.do",
					params : {
						type : 5,
						ids : ids,
						isLock : "1"
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("锁定成功。");
							ds.load();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请至少选择一条云造价企业信息！");
	}
}
//弹出迁入数据框
function showAddData() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows) || rows.length > 1) {
		Info_Tip("请至少勾选一条企业信息。");
		return;
	}
	var eid = rows[0].get("eid");
	var ename = rows[0].get("ename");
	ds_data = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
					url : "/mc/vip/EpVipServlet.do"
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					fields:[{name:"memberID"},{name:"trueName"}]	
				}),
				
		baseParams : {
			type : 16,
			eid : eid,
			pageNo : 1,
			pageSize : 10
		},
		countUrl : "/mc/vip/EpVipServlet.do",
		countParams : {
			type : 17,
			eid : eid
		},
		remoteSort : true
	});
	var pagetool_data = new Ext.ux.PagingToolbar({
		store : ds_data,
		displayInfo : true
	});
	var sm1 = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	grid_data = new Ext.grid.GridPanel({
		title : "<font style='color:red;'>"+ename+"</font>-子帐号列表",
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_data,
		sm : sm1,
		viewConfig : {
			forceFit : true
		},
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}),sm1,{
					header : '会员ID',
					sortable : false,
					dataIndex : 'memberID'
				}, {
					header : '会员名称',
					sortable : false,
					dataIndex : 'trueName',
				}],
		bbar : pagetool_data
	});
	ds_data.load();
	addData_win = new Ext.Window({
		id : "addData_win",
		title : "迁移数据 ",
		modal : true,
		width : 600,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		x : "450",
		y : "150",
		items : [grid_data],
		buttons : [{
					text : "确定 ",
					handler : function(){
						var rows = grid_data.getSelectionModel().getSelections();
						if (Ext.isEmpty(rows)) {
							Warn_Tip("请选择一条信息！");
							return;
						}
						var ids = [];
						var count = 0;
						for ( var i = 0; i < rows.length; i++) {
							ids.push(rows[i].get("memberID"));
							count ++;
						}
						checkAccountData(eid, ids.toString());
					}
				}, {
					text : '关闭',
					handler : function() {
						addData_win.close();
					}
				}]
	});
	addData_win.show();
}
//迁入数据
function checkAccountData(eid,ids){
	Ext.Ajax.request({
		url : "/mc/vip/VipEpAccountServlet.do",
		params : {
			type : 14,
			eid : eid,
			ids : ids
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result == "")
					addAccountData(eid, ids);
				else
					Info_Tip("您本次选择的子帐号"+jsondata.result+"已经迁移过数据，请重新选择。");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function addAccountData(eid, ids){
	var loadMarsk = new Ext.LoadMask("addData_win", {
		 msg  : '正在导入数据中.....',
		 removeMask : false// 完成后移除
	});
    loadMarsk.show();
	Ext.Ajax.request({
		url : "/mc/vip/VipEpAccountServlet.do",
		params : {
			type : 13,
			eid : eid,
			ids : ids
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("操作成功。");
				addData_win.close();
				loadMarsk.hide();
			}
		},
		failure : function() {
			Info_Tip("操作成功。");
			addData_win.close();
			loadMarsk.hide();
		}
	});
}

var ds2,vip_grid,win;
function showAuthWin(){
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Info_Tip("请选择一条云造价企业信息。");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var eid = row.get("eid");
	var auths = row.get("codes");
	ds2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/vip/EpVipServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","name", "code"]),
				baseParams : {
					type : 19
				},
				remoteSort : true
			});
	ds2.load();
	ds2.on('load', function(store, records, options) {
				var arr = [];
				var curr_auths = auths;
				if (curr_auths != null && curr_auths != ""){
					curr_auths = ";" + curr_auths + ";";
				}
				for (var i = 0; i < records.length; i++) {
					var record = records[i];
					var isMatch = curr_auths.indexOf(";" + record.get('id') + ";") != -1;
					if (isMatch) {
						arr.push(record);
					}
				}
				cs.selectRecords(arr);
			}, this, {
				delay : 500
			});
	var cs = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "value",
				handleMouseDown : Ext.emptyFn
			});
	vip_grid = new Ext.grid.GridPanel({

				store : ds2,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : cs,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cs, {
									header : '权限ID',
									hidden : true,
									sortable : false,
									dataIndex : 'id'
								},{
									header : '权限码',
									hidden : true,
									sortable : false,
									dataIndex : 'code'
								},{
							header : '模块名称',
							sortable : false,
							dataIndex : 'name'
						}]
			});
	win = new Ext.Window({
				title : "<font style='color:red'>" + row.get("ename")
						+ "</font>&nbsp;&nbsp;&nbsp;&nbsp; 模块控制",
				width : 300,
				autoHeight : true,
				closable : true,
				closeAction : "close",
				modal : true,
				items : [vip_grid],
				buttons : [{
							text : "保存",
							handler : function() {
								setAuth(eid);
							}
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]

			});
	win.show();
}

function setAuth(eid){
	var sels = vip_grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("id"));
	}
	Ext.Msg.confirm("提示", "您确定要保存此设置?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/mc/vip/EpVipServlet.do?type=20", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("模块设置成功。");
										ds.reload();
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "eid=" + eid + "&auths=" + mids.toString());
				}
			});
}

function setArea(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条云造价企业信息。");
		return;
	}
	var eid = row.get("eid");
	var webProvince = row.get("webProvince");
	showArea(eid,webProvince);
}

var area_win;
function showArea(eid,webProvince){
	area_win = new Ext.Window({
				modal : true,
				width : 300,
				//autoHeight : true,
				height : 500,
				items : [{
					layout : 'column',
					bodyStyle : 'padding:6px;',
					defaultType : 'checkbox',
					labelWidth : 15,
					fieldLabel : '区域',
					items:[
						province_select(webProvince)
					]
				},{
					id : 'allprovince',
					xtype : 'checkbox',
					boxLabel : '全选',
					listeners : {
						check : checkAll
					}
				}],
				buttons : [{
								text : "保存",
								handler : function(){
									Ext.Msg.confirm("提示", "您确定要保存此设置?", function(op) {
										if (op == "yes") {
											var save_webProvince = [];
											var selectCount = 0;
											Ext.select("input[name=webProvince_checkbox]").each(function(el) {
												if (Ext.getDom(el).checked){
													save_webProvince.push(el.getValue());
													selectCount += 1;
												}
											});
											var save_webProvince_str = "";
											if (pro.length == selectCount){//全新
												save_webProvince_str = "全国";
											}else{
												save_webProvince_str = save_webProvince.toString();
											}
											Ext.lib.Ajax.request("post",
													"/mc/vip/VipEpAccountServlet.do?type=18", {
														success : function(response) {
															var jsondata = eval("("
																	+ response.responseText + ")");
															if (getState(jsondata.state,
																	commonResultFunc, jsondata.result)) {
																Info_Tip("区域设置成功。");
																ds.reload();
																area_win.close();
															}
														},
														failure : function() {
															Warn_Tip();
														}
													}, "eid=" + eid + "&webProvince=" + save_webProvince_str);
										}
									});
								}
							},
							{
								text : "取消",
								handler :function(){
									area_win.close();
								}
							}]
			});
	area_win.show();
}


function province_select(webProvince){
	var tempObj = [];
	var len = pro.length;
	for (var i = 0; i < len; i++) {
		if(webProvince!=null && webProvince!=""){
			if(webProvince.indexOf(pro[i])!=-1 || "全国" == webProvince){
				tempObj.push({
					columnWidth:.5,
					boxLabel: pro[i],
					name: 'webProvince_checkbox',
					inputValue : pro[i],
					checked:true
				});
			}else{
				tempObj.push({
					columnWidth:.5,
					boxLabel: pro[i],
					name: 'webProvince_checkbox',
					inputValue : pro[i]
				});
			}
		}else{
			tempObj.push({
				columnWidth:.5,
				boxLabel: pro[i],
				name: 'webProvince_checkbox',
				inputValue : pro[i]
			});
		}
	}
	return tempObj;
}

function checkAll(){
	Ext.select("input[name=webProvince_checkbox]").each(function(el) {
		Ext.getDom(el).checked = Ext.fly("allprovince").dom.checked;
	});
}

var re_win;
/**
 * 续期
 */
function renewal(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条云造价企业信息。");
		return;
	}
	var eid = row.get("eid");
	re_win = new Ext.Window({
		title : "续期",
		autoHeight : true,
		width : 300,
		closable : true,
		draggable : true,
		modal : true,
		border : false,
		plain:true,
		layout : 'form',
		closeAction : "close",
		buttonAlign : 'center',
		items : [{
			id : 'dateRadio',
			fieldLabel:'续期时间',
			xtype : 'radiogroup',
			items:[{
				name:'keepMonth',
				xtype:'radio',
				boxLabel:'7天',
				inputValue:'7',
				checked : true
			},{
				name:'keepMonth',
				xtype:'radio',
				boxLabel:'15天',
				inputValue:'15'
			},{
				name:'keepMonth',
				xtype:'radio',
				boxLabel:'30天',
				inputValue:'30'
			}]
		}],
		buttons : [{
					text : "续期",
					handler : function(){
						saveRenewal(eid);
					}
				}, {
					text : "取消",
					handler : function() {
						re_win.close();
					}
				}]
	});
	re_win.show();
}

function saveRenewal(eid){
	Ext.Msg.confirm("提示", "您确定要对该企业进行续期?", function(op) {
		if (op == "yes") {
			if(!Ext.getCmp("dateRadio").getValue()){
				return;
			}
			var day = Ext.getCmp("dateRadio").getValue().inputValue;
			Ext.lib.Ajax.request("post",
					"/mc/vip/VipEpAccountServlet.do?type=19", {
						success : function(response) {
							var jsondata = eval("("
									+ response.responseText + ")");
							if (getState(jsondata.state,
									commonResultFunc, jsondata.result)) {
								Info_Tip("续期成功。");
								ds.reload();
								re_win.close();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					}, "eid=" + eid + "&day=" + day);
		}
	});
}

//查询企业
function searchEmpList() {
	var query = Ext.getCmp("condition").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~0";

	empds.baseParams["content"] = query;
	empds.countParams["content"] = query;
	empds.load();
};


//步骤切换
var cardNav = function(incr) {
	var l = Ext.getCmp('card-wizard-panel').getLayout();
	var i = l.activeItem.id.split('card-')[1];
	var next = parseInt(i, 10) + incr;
	if (!Ext.isEmpty(Ext.getCmp("card-0"))) {
		var row = Ext.getCmp("card-0").getSelectionModel().getSelected();
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
	}
	if (next == 1) {
		checkVip(next);

	} else if (next == 2) {
		var sels = Ext.getCmp("card-1").getSelectionModel().getSelections();
		var mids = [];
		for (var i = 0; i < sels.length; i++) {
			isShows.push(sels[i].get("name"));
		}
		l.setActiveItem(next);
		Ext.getCmp('card-prev').setDisabled(next == 0);
		Ext.getCmp('card-next').setDisabled(next == 2);
		Ext.fly("emp_name").replaceWith({
			id : 'emp_name',
			tag : 'div',
			style : 'color:red;font;font-weight:bold;margin:0 auto;text-align:center;margin-bottom:4px;font-size:14px;',
			html : row.get("name")
		});
		Ext.getCmp("eid").setValue(row.get("eid"));
	} else {
		l.setActiveItem(next);
		Ext.getCmp('card-prev').setDisabled(next == 0);
		Ext.getCmp('card-next').setDisabled(next == 2);
	}
};

var vip_module;
/**
 * 开通试用
 */
function showOpenTry(){
	empds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					content : "islock~0;openTry~1",
					pageSize : pageSize
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					content : "islock~0;openTry~1",
					type : 9
				},
				remoteSort : true
			});

	var pagetool = new Ext.ux.PagingToolbar({
				store : empds,
				displayInfo : true,
				pageSize : 20
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id',
				singleSelect:true //单选
			});
	var tbar = [new Ext.form.ComboBox({
				mode : "local",
				triggerAction : "all",
				id : 'condition',
				width : 80,
				store : [["eid", "企业id"], ["name", "企业名称"],["area", "所在地区"]],
				triggerAction : "all",
				value : 'name'

			}), "-", {
		xtype : "label",
		text : "关键字："
	}, {
		xtype : "textfield",
		textLabel : "关键字",
		id : "searchtitle",
		width : 220,
		enableKeyEvents : true,
		listeners : {
			"keyup" : function(tf, e) {
				if (e.getKey() == e.ENTER) {
					searchEmpList();
				}
			}
		}
	}, {
		text : "查询",
		id : "search",
		icon : "/resource/images/zoom.png",
		handler : searchEmpList
	}];
	empgrid = new Ext.grid.GridPanel({
				id : 'card-0',
				store : empds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : parent.Ext.get("tab_0302_iframe").getHeight() / 2,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 120,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 240,
							dataIndex : 'name'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : tbar,
				bbar : pagetool
			});
	var ds_vip = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : '/mc/vip/EpVipServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","name", "code"]),
				baseParams : {
					type : 19
				},
				remoteSort : true
			});
	ds_vip.load();
	var cs = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "value",
				handleMouseDown : Ext.emptyFn
			});
	vip_module = new Ext.grid.GridPanel({
				id : 'card-1',
				store : ds_vip,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : cs,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
									}), cs, {
										header : '权限ID',
										hidden : true,
										sortable : false,
										dataIndex : 'id'
									},{
										header : '权限码',
										hidden : true,
										sortable : false,
										dataIndex : 'code'
									},{
								header : '模块名称',
								sortable : false,
								dataIndex : 'name'
						}]
			});
	var form = new Ext.form.FormPanel({
		id : 'card-2',
		layout : "form",
		bodyStyle : 'padding:6px;',
		autoWidth : true,
		autoHeight : true,
		labelWidth : 160,
		labelAlign : 'right',
		frame : true,
		border : true,
		buttonAlign : 'right',
		items : [{
					id : 'emp_name',
					xtype : 'label'
				}, {
					id : 'eid',
					name : 'eid',
					xtype : 'hidden'
				}, {
					xtype : 'combo',
					id : "webProvince",
					name : "webProvince",
					store : pro,
					triggerAction : "all",
					value : "广东",
					width : 220,
					readOnly : true,
					fieldLabel : '查询区域'
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'mat_count',
					hidden : false,
					items : {
						xtype : 'numberfield',
						id : 'materialCount',
						name : 'materialCount',
						width : 220,
						fieldLabel : '材价库流量',
						allowBlank : false,
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'ask_count',
					hidden : false,
					items : {
						xtype : 'numberfield',
						id : 'askCount',
						name : 'askCount',
						width : 220,
						fieldLabel : '线下询价数',
						allowBlank : false,
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'memebr_count',
					hidden : false,
					items : {
						xtype : 'numberfield',
						id : 'memberCount',
						name : 'memberCount',
						width : 220,
						fieldLabel : '账号数',
						allowBlank : false,
						minValue : 1,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'vip_score',
					hidden : false,
					items : {
						xtype : 'numberfield',
						id : 'score',
						name : 'score',
						width : 220,
						fieldLabel : '积分',
						allowBlank : false,
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'try_time',
					hidden : false,
					fieldLabel:'试用期限',
					xtype : 'radiogroup',
					items:[{
						width:50,
						name:'tryTime',
						xtype:'radio',
						boxLabel:'7天',
						inputValue:'7',
						checked : true
					},{
						width:50,
						name:'tryTime',
						xtype:'radio',
						boxLabel:'15天',
						inputValue:'15'
					},{
						width:50,
						name:'tryTime',
						xtype:'radio',
						boxLabel:'30天',
						inputValue:'30'
					}]
				}],
		buttons : [{
					text : '确定',
					handler : openVipTry
				}, {
					text : '关闭',
					handler : function() {
						Ext.getCmp("empAdd_Win").close();
					}
				}]
	});
	var empWizard = {
		id : 'card-wizard-panel',
		layout : 'card',
		activeItem : 0,
		defaults : {
			border : false,
			frame : true
		},
		bbar : ['->', {
					id : 'card-prev',
					text : '&laquo; 上一步',
					handler : cardNav.createDelegate(this, [-1]),
					disabled : true
				}, {
					id : 'card-next',
					text : '下一步 &raquo;',
					handler : cardNav.createDelegate(this, [1])
				}],
		items : [empgrid, vip_module, form]
	};
	empwin = new Ext.Window({
				id : 'empAdd_Win',
				modal : true,
				resizable : true,
				width : parent.Ext.get("tab_0302_iframe").getWidth() / 2,
				autoHeight : true,
				title : "开通试用",
				items : empWizard
			});
	empds.load();
	empwin.show();

}

//开通试用
function openVipTry() {
	var row = Ext.getCmp("card-0").getSelectionModel().getSelected();
	var try_webProvince = Ext.getCmp("webProvince").getValue();
	var materialCount = Ext.getCmp("materialCount").getValue();
	var askCount = Ext.getCmp("askCount").getValue();
	var memberCount = Ext.getCmp("memberCount").getValue();
	var score = Ext.getCmp("score").getValue();
	var try_time = Ext.getCmp("try_time").getValue().inputValue;
	var epName = Ext.fly("emp_name").dom.innerHTML;
	if (try_webProvince == null || "" == try_webProvince
			//|| materialCount == null || "" == materialCount
			//|| askCount == null || "" == askCount
			//|| memberCount == null || "" == memberCount
			//|| score == null || "" == score
			|| try_time == null || "" == try_time
			|| epName == null || "" == epName){
		Info_Tip("请正确填写必要信息。");
		return;
	}
	if ((!(parseInt(materialCount,10) >= 0)) || (!(parseInt(askCount,10) >= 0)) || (!(parseInt(score,10) >= 0)) || (!(parseInt(memberCount,10) >= 1))){
		Info_Tip("请正确填写必要信息。");
		return;
	}
	var sels = vip_module.getSelectionModel().getSelections();
	var auths = [];
	for (var i = 0; i < sels.length; i++) {
		auths.push(sels[i].get("id"));
	}
	var content = "webProvince~" + try_webProvince + ";materialCount~" + materialCount + ";askCount~" + askCount + ";memberCount~"
				+ memberCount + ";score~" + score + ";day~" + try_time + ";epName~" + epName;
	Ext.MessageBox.wait("开通中...请稍候","温馨提示");
	Ext.Ajax.request({
				url : '/mc/vip/VipEpAccountServlet.do?',
				params : {
					type : 20,
					eid : row.get("eid"),
					content : content,
					auths : auths.toString()
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("开通试用成功。");
						Ext.getCmp("empAdd_Win").close();
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});

};
/**
 * 积分明细
 */
function showVipScoreDetail(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("enterprise_vip_scoreDetail", '查看积分明细',
			'/module/enterprise/enterprise_vip_scoreDetail.jsp?eid=' + row.get("eid"));
}

/**
 * 充值明细
 */
function showRechargeDetail(){
	/*var row = grid.getSelectionModel().getSelected();
	/if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("vipRechargeOrders_list", '充值明细',
			'/module/orders/vipRechargeOrders_list.jsp?eid=' + row.get("eid"));*/
	window.parent.createNewWidget("vipRechargeOrders_list", '充值明细',
			'/module/orders/vipRechargeOrders_list.jsp');
}
