var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet;
Ext.onReady(function() {
			init();
		})

function init() {
	buildGirid();

}

// 生成列表
function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/act/ActivityInfoServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'actId'
						},
						["actId", "actName", "createBy", "createOn", "state"]),
				baseParams : {
					type : 1,
					pageSize : pageSize,
					pageNo : 1

				},
				countUrl : '/act/ActivityInfoServlet',
				countParams : {
					type : 9
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true,
				pageSize : pageSize
			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "actId"
			});
	grid_info = new Ext.grid.EditorGridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '添加活动',
							icon : "/resource/images/add.gif",
							handler : function() {
								addActInfo();
							}
						},{
							text : '修改活动',
							icon : "/resource/images/add.gif",
							handler : function() {
								updateAct();
							}
						}, {
							text : '删除活动',

							icon : "/resource/images/delete.gif",
							handler : function() {
								delParamsActInfo("DEL");

							}
						}, {
							text : '删除/修改活动扩展',

							icon : "/resource/images/edit.gif",
							handler : function() {
								openActInfoView();

							}
						},

						{
							text : '导出用户',
							handler : importUser,
							icon : '/resource/images/page_excel.png'
						}, {
							text : '开放',
							icon : "/resource/images/tick.png",
							handler : function() {
								selectAction("OPEN");
							}
						}, {
							text : '关闭',
							icon : "/resource/images/cross.png",
							handler : function() {
								selectAction("CLOSE");
							}
						}],
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '活动ID',
							sortable : false,
							dataIndex : 'actId'
						}, {
							header : 'actId',
							sortable : false,
							dataIndex : 'actId',
							hidden : true
						}, {
							header : '活动名称',
							sortable : false,
							dataIndex : 'actName'
						}, {
							header : '创建者',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}, {
							header : "活动状态",
							sortable : true,
							width : 70,
							dataIndex : "state",
							renderer : function(v) {

								switch (v) {
									case "CLOSE" :
										return "<font color:red>关闭</font>";
										break;

									case "OPEN" :
										return "<font color:red>打开</font>";
										break;
								}

							}
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "act_info"
			});

	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				updateAct();

			});

	ds_info.load();

};
/**
function updateAct() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	Ext.Ajax.request({
				url : '/act/ActivityInfoServlet',
				params : {
					type : 6,
					actId : rows[0].get("actId")

				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.getCmp("ActName").setValue(jsondata.result["actName"]);

					}

				},
				failure : function() {
					Warn_Tip();
				}
			});

	formPanel = new Ext.form.FormPanel({
				id : 'fpanel',
				autoWidth : true,
				height : 130,
				bodyStyle : 'padding:6px',
				labelWidth : 60,
				layout : 'form',
				items : [{
							xtype : 'textfield',
							id : 'ActName',
							fieldLabel : '活动名称',

							allowBlank : false,
							blankText : "活动不能为空"

						}]

			});

	win = new Ext.Window({

				title : '添加活动',
				width : 360,
				autoHeight : true,
				modal : true,
				items : formPanel,
				buttonAlign : 'right',
				buttons : [{
							text : '修改',
							handler :function (){
							
							updateActUser(rows[0].get("actId"),rows[0].get("state"));
								
							} 
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
}
**/
function updateAct() {
	var rows = grid_info.getSelectionModel().getSelections();
	if(Ext.isEmpty(rows)){
		Ext.MessageBox.alert("提示", "请选择一条记录。");
		return;
	}
	if(rows.length > 1){
		Ext.MessageBox.alert("提示", "该操作最多只能选择一条记录。");
		return;
	}
	var sel = grid_info.getSelectionModel().getSelected();
	window.parent.createNewWidget("act_update", '修改活动',
			'/module/onlineApply/act_update.jsp?id=' + sel.get("actId"));
}

function updateActUser(objid,objstate){
	
	var name=Ext.getCmp("ActName").getValue();
	Ext.Ajax.request({
				url : '/act/ActivityInfoServlet',
				params : {
					type : 3,
					actId :objid,
					actName:name,
                    state:objstate
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("修改成功。");
					win.close();
					ds_info.reload();

					}

				},
				failure : function() {
					Warn_Tip();
				}
			});


}



// 添加活动
/*
function addActInfo() {

	formPanel = new Ext.form.FormPanel({
				id : 'fpanel',
				autoWidth : true,
				height : 130,
				bodyStyle : 'padding:6px',
				labelWidth : 60,
				layout : 'form',
				items : [{
							xtype : 'textfield',
							id : 'ActName',
							fieldLabel : '活动名称',
							allowBlank : false,
							blankText : "活动不能为空"

						}]

			});

	win = new Ext.Window({

				title : '添加活动',
				width : 360,
				autoHeight : true,
				modal : true,
				items : formPanel,
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							handler : addInfo
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();

}
*/
function addActInfo() {
	window.parent.createNewWidget("act_add", '添加活动',
			'/module/onlineApply/act_add.jsp');
}



// 保存操作
function addInfo() {
	if (formPanel.getForm().isValid()) {
		var name = Ext.get("ActName").dom.value;
		Ext.Ajax.request({
			url : '/act/ActivityInfoServlet',
			params : {
				type : 2,
				actName : name
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("保存成功。");
					win.close();
					ds_info.reload();
				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();

}
// ext-comp-1014,viewName,colName,viewName_1,colName_1
// viewName~value,colName,viewName,colName
// colName1==>>NEWS4

function splitStr(str) {
	try {
		return str.substring(13);
	} catch (e) {

		return null

	}
	txt
}// ext-comp-1014,viewName,colName,viewName_1,colName_1
// ext-comp-1014~;viewName~fdsaf;colName~fsda;viewName_1~fsda;colName_1~fsda;
function addApplyInfoView() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var actForm = Ext.getCmp("applyform").getForm();
	var varkeys;
	var params = [];// 定义参数
	var lh = "";
	var keyparams = actForm.items.keys;
	var text = keyparams.toString().substring(14);
	var vars = "";
	var spr = text.toString().split(",");

	for (var k = 0; k < spr.length; k++) {
		varkeys = spr[k];
		params = actForm.items.map[varkeys].getValue();
		var kvar = varkeys.replace(/_\d/g, "");
		vars += varkeys + "~" + params + ";";

	}
	if (actForm.isValid()) {
		Ext.Ajax.request({
			url : '/act/ActivityInfoServlet',
			params : {
				type : 5,
				actId : rows[0].get('actId'),
				content : vars
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("添加成功。");
					applyWindow.close();
					ds_info.reload();
				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();

}

// 动态添加用户字段

var flag = 0;
function addView() {
	flag += 1;
	var reg2 = new Ext.form.FieldSet({
				id : "reg" + flag,
				title : '添加字段',
				labelWidth : 300,
				align : 'center',
				collapsible : true,

				items : [{
							name : "id",
							xtype : 'textfield',

							hidden : true,
							hideLabel : true
						}, {
							layout : 'table',
							colspan : 3,
							style : 'margin-top:10px',
							items : [{

								layout : 'form',
								items : [{
											xtype : 'textfield',
											id : 'viewName_' + flag,
											name : 'viewName',

											fieldLabel : '显示名称',
											allowBlank : false,
											blankText : "文件名不能为空"

										}, {

											layout : 'form',
											items : [{
														xtype : 'textfield',
														id : 'colName_' + flag,
														name : 'colName',

														fieldLabel : '字段名称',
														allowBlank : false,
														blankText : "文件名不能为空"

													}]

										}, {

											layout : 'form',
											items : [{
												style : 'margin-left:5px',
												xtype : 'button',
												id : 'btn_' + flag,
												name : 'btn_' + flag,
												width : 70,
												text : '删除',
												handler : function() {
													Ext.getCmp("applyform")
															.remove(reg2);
													Ext.getCmp("applyform")
															.doLayout(reg2);

												}
											}]

										}]
							}]

						}]
			});

	Ext.getCmp("applyform").add(reg2);
	Ext.getCmp("applyform").doLayout(reg2);

}

var flag = 0;
function updateOrAddView() {
	flag += 1;

	var reg2 = new Ext.form.FieldSet({
		id : "reg" + flag,
		title : '添加字段',
		labelWidth : 600,
		width : 470,
		align : 'center',
		collapsible : true,
		items : [{
					name : "id",
					xtype : 'textfield',
					hidden : true,
					hideLabel : true
				}, {
					layout : 'table',
					colspan : 3,
					style : 'margin-top:10px',
					items : [{

						layout : 'form',
						items : [{
									xtype : 'textfield',
									id : 'viewName_' + flag,
									name : 'viewName',
									fieldLabel : '显示名称',
									allowBlank : false,
									blankText : "文件名不能为空"

								}, {

									layout : 'form',
									items : [{
												xtype : 'textfield',
												id : 'colName_' + flag,
												name : 'colName',
												fieldLabel : '字段名称',
												allowBlank : false,
												blankText : "文件名不能为空"

											}]

								}, {

									layout : 'form',
									items : [{
										style : 'margin-left:5px',
										xtype : 'button',
										id : 'btn_' + flag,
										name : 'btn_' + flag,
										width : 70,
										text : '删除',
										handler : function() {
											var actForm = Ext.getCmp("fromUp")
													.getForm();
											var length = actForm.items.length;

											if (length == 3) {
												Ext.Msg
														.confirm(
																"提示",
																"你确定要删除最后一组添加框嘛?如果关闭的话,就无法进行功能操作",
																function(op) {
																	if (op == "yes") {

																		Ext
																				.getCmp("fromUp")
																				.remove(reg2);
																		Ext
																				.getCmp("fromUp")
																				.doLayout(reg2);

																	}
																})

											} else {

												Ext.getCmp("fromUp")
														.remove(reg2);
												Ext.getCmp("fromUp")
														.doLayout(reg2);

											}

										}
									}]

								}]
					}]

				}]
	});

	Ext.getCmp("fromUp").add(reg2);
	Ext.getCmp("fromUp").doLayout(reg2);

}

// 删除操作
function delParamsActInfo(params) {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	if (rows.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	}
	Ext.Msg.confirm("提示", "您确定要删除该活动嘛?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/act/ActivityInfoServlet',
								params : {
									type : 3,
									actId : rows[0].get('actId'),
									state : params
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功。");
										ds_info.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			})

}

function openActInfoView() {

	var rows = grid_info.getSelectionModel().getSelections();

	// 如果没有选择就代表添加

	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择要添加/修改的字段...");
		return;

	} else if (rows.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	} else if (rows.length == 1) {

		fromUp = new Ext.form.FormPanel({
					id : 'fromUp',
					labelAlign : 'center',
					buttonAlign : 'center',
					plain : true,
					layout : 'table',
					layoutConfig : {
						columns : 1
					},
					labelWidth : 300,
					AutoScroll : true,

					frame : true,
					items : []

				});

		findWindow = new Ext.Window({

					title : '修改字段',
					width : 500,
					height : 400,
					autoScroll : true,
					modal : true,
					items : fromUp,
					buttonAlign : 'right',
					buttons : [{
								text : '修改字段',
								handler : function() {
									updateViewOrCol(rows[0].get('actId'));

								}
							}, {
								text : '添加字段',
								handler : function() {
									updateOrAddView();
									// updateViewOrCol(rows[0].get('actId'));
									// findWindow.close();
								}
							}, {
								text : '关闭',
								handler : function() {
									findWindow.close();
								}
							}]
				});

		findWindow.show();

		Ext.Ajax.request({
			url : '/act/ActivityInfoServlet',
			params : {
				type : 7,
				actId : rows[0].get('actId')
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					var dataVar = data.result;
					var length = dataVar.length;

					if (length == 0) {
						reg2 = new Ext.form.FieldSet({
							id : 'view',
							title : '删除字段',
							labelWidth : 600,
							width : 470,
							align : 'center',
							collapsible : true,

							items : [{
										name : "id",
										xtype : 'textfield',

										hidden : true,
										hideLabel : true
									}, {
										layout : 'table',
										colspan : 3,
										style : 'margin-top:10px',
										items : [{

											layout : 'form',
											items : [{
														xtype : 'textfield',
														id : 'viewName',
														name : 'viewName',
														fieldLabel : "显示名称",
														allowBlank : false,
														blankText : "文件名不能为空"

													}, {

														layout : 'form',
														items : [{
															xtype : 'textfield',
															id : 'colName',
															name : 'colName',
															fieldLabel : '字段名称',
															allowBlank : false,
															blankText : "文件名不能为空"

														}]

													}, {

														layout : 'form',
														items : [{
															style : 'margin-left:5px',
															xtype : 'button',
															id : 'btn',
															name : 'btn',
															width : 70,
															text : '删除',
															handler : function(
																	b) {
																var id = b.id;
																var fieldId = id
																		.substring(4);
																var actForm = Ext
																		.getCmp("fromUp")
																		.getForm();
																var length = actForm.items.length;
																if (length == 3) {
																	Ext.Msg
																			.confirm(
																					"提示",
																					"你确定要删除最后一组添加框嘛?如果删除的话,就无法进行功能操作",
																					function(
																							op) {
																						if (op == "yes") {

																							var reg = "view"
																									+ fieldId;
																							Ext
																									.getCmp('fromUp')
																									.remove(reg);
																							Ext
																									.getCmp('fromUp')
																									.doLayout();

																						}
																					})

																} else {

																	var reg = "view"
																			+ fieldId;
																	Ext
																			.getCmp('fromUp')
																			.remove(reg);
																	Ext
																			.getCmp('fromUp')
																			.doLayout();

																}

															}
														}]

													}]
										}]

									}]
						});

						Ext.getCmp("fromUp").add(reg2);
						Ext.getCmp("fromUp").doLayout(reg2);

					} else {

						for (var y = 0; y < length; y++) {
							reg2 = new Ext.form.FieldSet({
								id : 'view' + dataVar[y].viewId,
								title : '删除字段',
								labelWidth : 600,
								width : 470,
								align : 'center',
								collapsible : true,

								items : [{
											name : "id",
											xtype : 'textfield',

											hidden : true,
											hideLabel : true
										}, {
											layout : 'table',
											colspan : 3,
											style : 'margin-top:10px',
											items : [{

												layout : 'form',
												items : [{
													xtype : 'textfield',
													id : 'viewName_'
															+ dataVar[y].viewId,
													name : 'viewName_'
															+ dataVar[y].viewId,
													fieldLabel : "显示名称",
													value : dataVar[y].viewName,
													allowBlank : false,
													blankText : "文件名不能为空"

												}, {

													layout : 'form',
													items : [{
														xtype : 'textfield',
														id : 'colName_'
																+ dataVar[y].viewId,
														name : 'colName_'
																+ dataVar[y].viewId,
														fieldLabel : '字段名称',
														value : dataVar[y].colName,
														allowBlank : false,
														blankText : "文件名不能为空"

													}]

												}, {

													layout : 'form',
													items : [{
														style : 'margin-left:5px',
														xtype : 'button',
														id : 'btn_'
																+ dataVar[y].viewId,
														name : 'btn_'
																+ dataVar[y].viewId,
														width : 70,
														text : '删除',
														handler : function(b) {
															var id = b.id;
															var fieldId = id
																	.substring(4);
															// delActInfo(fieldId);

															var actForm = Ext
																	.getCmp("fromUp")
																	.getForm();
															var length = actForm.items.length;

															if (length == 3) {
																Ext.Msg
																		.confirm(
																				"提示",
																				"你确定要删除最后一组添加框嘛?如果关闭的话,就无法进行功能操作",
																				function(
																						op) {
																					if (op == "yes") {
																						var reg = "view"
																								+ fieldId;
																						Ext
																								.getCmp('fromUp')
																								.remove(reg);
																						Ext
																								.getCmp('fromUp')
																								.doLayout();
																					}
																				})

															} else {

																var reg = "view"
																		+ fieldId;
																Ext
																		.getCmp('fromUp')
																		.remove(reg);
																Ext
																		.getCmp('fromUp')
																		.doLayout();

															}

														}
													}]

												}]
											}]

										}]
							});

							Ext.getCmp("fromUp").add(reg2);
							Ext.getCmp("fromUp").doLayout(reg2);

						}
					}
				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
	}

}

function addViewInfoString() {
	form = new Ext.FormPanel({
		id : 'applyform',
		labelAlign : 'center',
		buttonAlign : 'center',
		plain : true,
		layout : 'table',
		layoutConfig : {
			columns : 1
		},
		AutoScroll : true,
		autoHeight : true,
		frame : true,
		items : [

		formSet = new Ext.form.FieldSet({
					title : '添加字段',
					labelWidth : 300,
					align : 'center',
					collapsible : true,
					items : [{
								name : "id",
								xtype : 'textfield',
								hidden : true,
								hideLabel : true
							}, {
								layout : 'table',
								colspan : 3,
								style : 'margin-top:10px',
								items : [{

									layout : 'form',
									items : [{
												xtype : 'textfield',
												id : 'viewName',
												name : 'viewName',
												fieldLabel : '显示名称',
												allowBlank : false,
												blankText : "文件名不能为空"

											}, {

												layout : 'form',
												items : [{
															xtype : 'textfield',
															id : 'colName',
															name : 'colName',
															fieldLabel : '字段名称',
															allowBlank : false,
															blankText : "文件名不能为空"

														}]

											}, {

												layout : 'form',
												items : [{
													style : 'margin-left:5px',
													xtype : 'button',
													id : 'btn',
													name : 'btn',
													width : 70,
													text : '删除',
													handler : function() {

														Ext
																.getCmp("applyform")
																.remove(formSet);
														Ext
																.getCmp("applyform")
																.doLayout(formSet);

													}
												}]

											}]
								}]

							}]
				})

		],
		buttons : [{
					buttonAlign : 'center',
					text : "add",
					handler : function() {
						addView();
					}
				}]
	});

	applyWindow = new Ext.Window({

				title : '添加字段',
				width : 500,
				height : 500,
				autoScroll : true,
				modal : true,
				items : form,
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							handler : addApplyInfoView
						}, {
							text : '取消',
							handler : function() {
								applyWindow.close();
							}
						}]
			});

	applyWindow.show();

}

// 修改功能中的修改方法
function updateViewOrCol(objId) {
	var varkeys;
	var key;
	var vars;
	var params = [];
	var actForm = Ext.getCmp("fromUp").getForm();
	if (actForm.isValid()) {
		var keyparams = actForm.items.keys;
		for (var d = 1; d < keyparams.length; d++) {
			varkeys = keyparams[d];
			var params = actForm.items.map[varkeys].getValue();

			var key = varkeys.replace(/ext\-comp\-(\d)*/g, "");
			vars += key + "~" + params + ";";

		}

		var content = vars.toString().substring(9);
		Ext.Ajax.request({
			url : '/act/ActivityInfoServlet',
			params : {
				type : 5,
				actId : objId,
				content : content

			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改成功..");
					findWindow.close();
					ds_info.reload();

				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
	}

}

function delActInfo(objId) {

	if (Ext.isEmpty(objId)) {
		Info_Tip("请选择一条信息。");
		return;
	}

	Ext.Msg.confirm("提示", "您确定要删除该字段嘛?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/act/ActivityInfoServlet',
								params : {
									type : 8,
									viewId : objId

								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功。");

									}

								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});

}

function selectAction(params) {
	var text;
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)||rows.length<1) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	var ids = [];
	for (var v = 0; v < rows.length; v++) {
		ids.push(rows[v].get('actId'));

	}

	switch (params) {
		case "OPEN" :
			text = "打开";
			break;
		case "CLOSE" :
			text = "关闭";
			break;

	}

	Ext.Msg.confirm("提示", "您确定要" + text + "" + rows.length + "条活动嘛?",
			function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/act/ActivityInfoServlet',
								params : {
									type : 4,
									actId : ids.toString(),
									state : params
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc,
											jsondata.result)) {
										Info_Tip("" + text + "成功..");
										ds_info.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			})

}

// 导出用户信息
function importUser() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择你所要导出用户活动信息...");
		return;
	}
	if (rows.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	}

	window.document.exportform.action = "/reort/ReortUserExcelServlet?actId="
			+ rows[0].get('actId');
	window.document.exportform.submit();

};
