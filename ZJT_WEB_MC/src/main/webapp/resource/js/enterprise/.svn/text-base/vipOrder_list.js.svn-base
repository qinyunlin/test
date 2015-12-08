Ext.onReady(init);
var grid, ds, ds2, pageSize = 20, query_type, query_input, query_con, win, row, thiseid, fs, vip_grid, memgrid, memds, empgrid, empds, empwin;
var eidGlobal;
var isShows = [];
var upload_form,win;

function init() {
	Ext.QuickTips.init();
	buildGrid();
};
// 工具栏
var toolbar = [{
			text : '查看详情',
			hidden : compareAuth('VIP_ORDER_VIEW'),
			handler : showVipOrderDetail,
			icon : '/resource/images/edit.gif'
		}, {
			text : '导入订单',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			hidden : compareAuth('VIP_EP_ORDER_EXPORT'),
			handler : exportVipOrders
		}, {
			text : '发票处理',
			hidden : compareAuth('VIP_ORDER_DO_INVONCE'),
			handler : invoiceHandle,
			icon : '/resource/images/application_double.png'
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
							url : '/mc/vip/EpVipServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","code","memberId","trueName","invoice","invoiceStatus","price","money","buyTime","askCount","materialCount",
						    "facCount","memberCount","score","beginDate","endDate","eid","ename","createBy","createOn","updateBy",
						    "updateOn","auditBy","auditOn","notes"]),
				baseParams : {
					type : 9,
					page : 1,
					pageSize : pageSize
				},
				countUrl : '/mc/vip/EpVipServlet.do',
				countParams : {
					type : 10
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
							header : '订单编号',
							sortable : true,
							width : 120,
							dataIndex : 'code'
						}, {
							header : '会员帐号',
							sortable : false,
							width : 120,
							dataIndex : 'memberId'
						}, {
							header : '公司名称',
							width : 150,
							sortable : true,
							dataIndex : 'ename'
						}, {
							header : '联系人',
							sortable : true,
							dataIndex : 'trueName'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '支付金额(元)',
							sortable : true,
							dataIndex : 'money'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '下单时间',
							sortable : true,
							dataIndex : 'createOn'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '购买时长(月)',
							sortable : true,
							dataIndex : 'buyTime'/*,
							editor : {
								xtype : 'numberfield'
							}*/
						}, {
							header : '发票状态',
							sortable : true,
							dataIndex : 'invoiceStatus',
							renderer : function(value, meta, record) {
								var invoiceStatus = record.get("invoiceStatus");
								if ("0" == invoiceStatus){
									return "待开发票";
								}else if ("1" == invoiceStatus){
									return "已开发票";
								}
								return "无需发票";
							}
						/*,
							editor : {
								xtype : 'numberfield'
							}*/
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
							store : [ [ "memberId", "会员帐号" ], [ "code", "订单编号" ], [ "ename", "公司名称" ], [ "trueName", "联系人" ]],
							triggerAction : 'all',
							readOnly : true,
							width : 90,
							value : "ename",
							listeners : {
								select : function(combo, record, index) {
									searchlist();
								}
							}
						}, "-",{
							xtype : "textfield",
							id : "queryValue",
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
		showVipOrderDetail();
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
	var content = queryName + "~" + queryValue;
	ds["baseParams"]["content"] = content;
	ds.load();
};

// 锁定企业
function lockEmp() {
	var ids = [];
	var rows = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}

	var con = "eid=" + rows.get("eid");
	Ext.MessageBox.confirm("确认操作", "您确定要锁定选中的用户吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/ep/EpAccountServlet?type=2",
							{
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("锁定成功。");
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							}, con)
				}
			})
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
	window.parent.createNewWidget("enterprise_vip_mem_add", '查看VIP会员',
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
						Info_Tip("该企业已开通VIP了。");
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

// 获取信息
function getInfo(eid) {
	eidGlobal = eid;
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 11,
					eid : eid
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Ext.getCmp("form_panel_edit").getForm()
								.setValues(json.result);
						oldData = json.result;
						Ext
								.getCmp("startDate")
								.setValue(json.result["startDate"].slice(0, 10));
						Ext
								.getCmp("validDate")
								.setValue(json.result["validDate"].slice(0, 10));
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 修改vip企业信息
function editEmp() {
	Ext.MessageBox.confirm("温馨提示", "您确认要修改该企业的信息吗？", function(op) {
		if (op == "yes") {
			var form = Ext.getCmp("form_panel_edit").getForm();
			if (form.isValid) {
				var content = getDataPack_form(form, "content", false, true);
				Ext.Ajax.request({
					url : '/ep/EpAccountServlet',
					params : {
						type : 10,
						eid : eidGlobal,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("更新成功。", function() {
										closeTab("enterprise_vip_edit");
									});
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			} else
				Info_Tip();
		}
	});
};

function openLockList(){
	window.parent.createNewWidget("enterprise_adv", '已锁定企业',
	'/module/enterprise/enterprise_adv.jsp');
}

function openVipAuth(){
	window.parent.createNewWidget("vip_auth_list", 'VIP权限设置',
	'/module/enterprise/vip_auth_list.jsp');
}

/*function exportVipOrders(){
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
				uploadFile(isPrice);
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

function uploadFile(isPrice) {
	if (upload_form.getForm().isValid()) {
		upload_form
				.getForm()
				.submit(
						{
							url : '/material/MaterialServlet.do?type=10&isPrice='
									+ isPrice
									+ '&cityCircleId='
									+ ds.baseParams["cityCircleId"],
							waitMsg : '上传文件中...',
							success : function(upload_form, o) {
								var returnInfo = o.result;
								if (getState(returnInfo.state,
										commonResultFunc, returnInfo.result)) {
									Info_Tip("导入参考价材料信息成功,已同步更新参考价材料信息和供应商材料信息！");

									win.close();
									ds.reload();
								} else {
									Ext.MessageBox.hide();
									win.close();
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
													value : returnInfo.result,
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
							},
							failure : function() {

							}
						});
	} else
		Info_Tip("请正确填写信息。");
}
*/
/**
 * 编辑查看VIP企业信息
 */
function showVipOrderDetail(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条VIP订单信息。");
		return;
	}
	var id = row.get("id");
	var code = row.get("code");
	window.parent.createNewWidget("vipOrder_detail", '查看云造价订单',
	'/module/enterprise/vipOrder_detail.jsp?id=' + id + '&code=' + code);
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
										Info_Tip("VIP订单成功导入" + sucNum + "条！");
										win.close();
										ds.reload();
									}else{
										if (sucNum.indexOf("~") != -1){//信息确认
											msgTips(sucNum);
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

function msgTips(msg){
	var msgArr = msg.split("~");
	var filepath = msgArr[0];//服务器临时文件路径
	var remem = msgArr[1]; //帐号已有关联企业   x1;x2
	var rename = msgArr[2];//企业名称相同 x1;x1|x2;x2
	
	var renameApp = "";
	var rememApp = "";
	var rememData = "";

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
	}
	
	
	if (rememData.lastIndexOf(";") != -1){
		rememData = rememData.substring(0,rememData.lastIndexOf(";"));
	}
	
	var msgApp = "<span style='color: #000000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;'>"
		+ "系统检测出以下3条疑似已存在企业：（"
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
				title : 'VIP开通提示',
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
														Info_Tip("VIP订单成功导入" + sucNum + "条！");
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

//发票处理
function invoiceHandle() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	var id = rows[0].data["id"];

	Ext.Msg.confirm("确认操作", "确定提供发票?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/mc/vip/EpVipServlet.do',
				params : {
					type : 13,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						if ("sendInvoince" == data.result) {
							Info_Tip("该订单已提供发票，无需再处理发票。");
							return;
						} else if ("noInvoince" == data.result) {
							Info_Tip("该订单不需要提供发票。");
							return;
						} else {
							Info_Tip("该订单发票处理成功。");
							ds.reload();
						}
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}