Ext.onReady(init);
var grid, ds, ds2, state_val, username, tel, act_avl;
var form, applyWindow, userMsg, reg2, data_ds;
var pageSize = 20;
function init() {
	buildGrid();

};

function buildGrid() {
	data_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/apply/ApplyUserViewServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'actId'
						}, ["actId", "actName"]),
				baseParams : {
					type : 7

				},
				remoteSort : true
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/apply/ApplyUserViewServlet'

						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'applyUserId'
						}, ["applyUserId", "userName", "tel", "addr", "email",
								"comName", "comAddr", "state", "createOn"]),
				baseParams : {
					type : 1,
					content : 'state~DEL',
					pageSize : pageSize,
					pageNo : 1
				},
				countUrl : '/apply/ApplyUserViewServlet',
				countParams : {
					type : 2,
					content : 'state~DEL'
				},
				remoteSort : true
			});

	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'applyUserId'
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'applyUserId',
							hidden : true
						}, {
							header : '用户ID',
							sortable : true,
							width : 60,
							dataIndex : 'applyUserId'
						}, {
							header : '用户姓名',
							sortable : true,
							width : 240,
							dataIndex : 'userName'
						}, {
							header : '联系电话',
							sortable : true,
							dataIndex : 'tel'
						}, {
							header : '联系地址',
							sortable : true,
							dataIndex : 'addr'
						}, {
							header : '电子邮箱',
							sortable : false,
							dataIndex : 'email'
						}, {
							header : '单位名称',
							sortable : false,
							dataIndex : 'comName'
						}, {
							header : '单位地址',
							sortable : true,
							dataIndex : 'comAddr'
						}, {
							header : '用户状态',
							sortable : true,
							dataIndex : 'state',
							renderer : function(v) {

								switch (v) {
									case "NEW" :
										return "<font color:red>新注册</font>";
										break;

									case "PASS" :
										return "<font color:red>审核通过</font>";
										break;
									case "NOPASS" :
										return "<font color:red>审核不通过</font>";
										break;

								}

							}
						}, {
							header : '添加时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				tbar : [{
							text : '修改用户',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							handler : function() {

								updateUser();
							}
						}, {
							text : '删除用户',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : function() {
								delUser("DEL");
							}
						}, {
							text : '查看功能',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/zoom.png',
							handler : function() {
								disPalyUser();
							}
						}, {
							text : '通过',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/tick.png',
							handler : function() {
								delUser("PASS");
							}
						}, {
							text : '不通过',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/cross.png',
							handler : function() {
								delUser("NOPASS");
							}
						}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : "label",
							text : "活动："

						}, {
							xtype : 'combo',
							id : 'actId',
							name : 'actName',
							store : data_ds,
							triggerAction : 'all',
							displayField : 'actName',
							valueField : 'actId',
							emptyText : '请选择活动',
							readOnly : true
						}, "-", {
							xtype : "label",
							text : "状态："
						}, new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									transform : "state",
									hiddenName : "state_val",
									value : 'PASS',
									listeners : {
										"keyup" : function(tf, e) {
											if (e.getKey() == e.ENTER) {
												searchlist();
											}
										}
									}
								}), "-", {
							xtype : "label",
							text : "姓名："
						}, {
							xtype : "textfield",
							id : "username"

						}, "-", {
							xtype : "label",
							text : "联系方式："
						}, {
							xtype : "textfield",
							id : "tel",
							fieldLabel : "关键字"
						}, "-", {
							text : "查询",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});

	grid.on("rowdblclick", function(grid, rowIndex, r) {
				disPalyUser();

			});

	ds.load();

};

// 更新用户

function updateUser() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	Ext.Ajax.request({
		url : '/apply/ApplyUserViewServlet',
		params : {
			type : 4,
			viewId : rows[0].data["applyUserId"]
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				userMsg = new Ext.form.FieldSet({
					title : '基本信息',
					layout : "table",
					layoutConfig : {
						columns : 4
					},
					autoWidth : true,
					bodyStyle : 'background-color:#DFE8F6',
					items : [{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户ID："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "用户ID",
									id : "ApplyUserId",
									width : 162,
									name : "eid",
									allowBlank : false,
									maxLength : 10,
									value : data.result["actId"],
									blankText : "请输入用户ID",
									readOnly : true
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "用户名称",
									width : 162,
									id : "username",
									name : 'name',
									value : data.result["UserName"],
									allowBlank : false,
									maxLength : 50,
									blankText : "请输入用户名称"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "联系电话："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "联系电话",
									id : "tel",
									name : 'tel',
									width : 162,
									value : data.result["tel"],
									allowBlank : false,
									maxLength : 12,
									blankText : "请输入联系电话",
									maxLengthText : "联系电话"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "联系地址："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "联系地址",
									width : 162,
									name : 'addr',
									value : data.result["addr"],
									id : "addr",
									allowBlank : false,
									maxLength : 50,
									blankText : "请输入联系地址"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "email："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "电子邮箱",
									width : 162,
									value : data.result["email"],
									name : 'email',
									id : "email",
									allowBlank : false,
									maxLength : 50,
									blankText : "请输入电子邮箱"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "单位名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "单位名称",
									width : 162,
									name : 'comName',
									value : data.result["comName"],
									id : "comName",
									allowBlank : false,
									maxLength : 50,
									blankText : "请输入单位名称"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "单位地址："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "单位地址",
									width : 162,
									name : 'comAddr',
									value : data.result["comAddr"],
									id : "comAddr",
									allowBlank : false,
									maxLength : 50,
									blankText : "请输入单位名称"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户状态："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "用户状态",
									width : 162,
									name : 'state',
									id : "state",
									// value:data.result["state"],
									maxLength : 50,
									blankText : "请输入单位名称",
									readOnly : true
								}, {
									xtype : 'hidden',
									id : 'state_hieen'

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "添加时间："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "添加时间",
									width : 162,
									name : 'createOn',
									value : data.result["createOn"],
									id : "createOn",
									maxLength : 50,
									blankText : "请输入单位名称",
									readOnly : true
								}]
					}]
				})

				switch (data.result["state"]) {
					case "NEW" :
						Ext.getCmp("state").setValue("新注册");
						break;
					case "PASS" :
						Ext.getCmp("state").setValue("审核通过");
						break;
					case "NOPASS" :
						Ext.getCmp("state").setValue("审核不通过");
						break;

				}

				form = new Ext.FormPanel({
							id : 'applyform',
							labelAlign : 'center',
							buttonAlign : 'center',
							plain : true,
							layout : 'table',
							layoutConfig : {
								columns : 1
							},
							labelWidth : 300,
							AutoScroll : true,
							autoHeight : true,
							frame : true,
							items : [userMsg]
						});

				applyWindow = new Ext.Window({
					id : 'wind',
					title : '添加活动',
					width : 600,
					height : 400,
					autoScroll : true,
					modal : true,
					items : form,
					buttonAlign : 'right',
					buttons : [{
						text : '保存',
						handler : function() {
							var uId = rows[0].data["applyUserId"];

							var applyform = Ext.getCmp("applyform").getForm();
							if (applyform.isValid()) {
								var username = Ext.fly("username").getValue();
								var tel = Ext.fly("tel").getValue();
								var addr = Ext.fly("addr").getValue();
								var email = Ext.fly("email").getValue();
								var comName = Ext.fly("comName").getValue();
								var comAddr = Ext.fly("comAddr").getValue();
								var state = Ext.fly("state_hieen").getValue();

								var createOn = Ext.fly("createOn").getValue();

								var form = Ext.getCmp("applyform").items;
								var datainfo = "";
								var value = "";
								var length = form.length;
								for (var i = 1; i < length; i++) {
									value = Ext
											.fly(form.items[i].items.keys[1])
											.getValue().trim();
									var key = form.items[i].items.items[1].fieldLabel;
									var hd = key.toString().split(",");
									var textName = hd[0];
									var texthidden = hd[1];
									datainfo += texthidden.toString() + "~"
											+ value + ";"
								}

								var content = "username~" + username + ";tel~"
										+ tel + ";" + "addr~" + addr
										+ ";email~" + email + ";" + "comName~"
										+ comName + ";comAddr~" + comAddr + ";"
										+ "state~" + state + ";createOn~"
										+ createOn + ";";

								Ext.Msg.confirm("提示", "您确定要修改此用户嘛?", function(
										op) {
									if (op == "yes") {
										Ext.Ajax.request({
											url : '/apply/ApplyUserViewServlet',
											params : {
												type : 6,
												viewId : uId,
												content : content,
												datainfo : datainfo
											},
											success : function(response) {
												var jsondata = eval("("
														+ response.responseText
														+ ")");
												if (getState(jsondata.state,
														commonResultFunc,
														jsondata.result)) {
													Info_Tip("修改成功。");
													applyWindow.close();
													ds.reload();
												}

											},
											failure : function() {
												Warn_Tip();
											}
										});
									}
								})
							}

						}
					}, {
						text : '取消',
						handler : function() {
							applyWindow.close();
						}
					}]
				});

				applyWindow.show();
			}
		},
		failure : function() {
			Warn_Tip("此用户没有添加任何扩展字段");
		}
	});
	Ext.Ajax.request({
		url : '/apply/ApplyUserViewServlet',
		params : {
			type : 5,
			applyUserId : rows[0].data["applyUserId"],
			actInfoId : Ext.getCmp("actId").getValue()
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				var flag = 0;
				for (var textVar in data.result) {

					flag += 1;

					var hd = textVar.toString().split(",");
					var textName = hd[0];

					var texthidden = hd[1];

					var valueVar = data.result[textVar];
					reg2 = new Ext.form.FieldSet({
						title : "字段信息" + flag,
						id : 'filed' + flag,
						layout : "table",
						bodyStyle : 'background-color:#DFE8F6;font-size:12px;',
						layoutConfig : {
							columns : 4
						},
						autoWidth : true,
						width : 300,
						autoHeight : true,
						items : [{
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
							items : [{
										xtype : "label",
										id : 'lableId' + flag,
										text : textName + ":"
									}]
						}, {
							xtype : 'textfield',
							id : 'viewName_' + flag,
							name : 'viewName',
							fieldLabel : textVar,
							value : valueVar,
							allowBlank : false,
							blankText : "文件名不能为空"

						}, {
							xtype : "",
							id : 'data_info',
							value : texthidden

						}]
					});

					Ext.getCmp("applyform").add(reg2);
					Ext.getCmp("applyform").doLayout(reg2);

				}
			}

		},
		failure : function() {
			Warn_Tip("此用户没有添加任何扩展字段");
		}
	});
}

// 审核用户
function delUser(params) {
	var text;

	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}

	var ids = [];
	for (var v = 0; v < rows.length; v++) {
		ids.push(rows[v].get('applyUserId'));

	}

	switch (params) {
		case "PASS" :
			text = "审核通过";
			break;
		case "NOPASS" :
			text = "审核不通过";
			break;
		case "DEL" :
			text = "删除";
			break;
	}

	Ext.Msg.confirm("提示", "您确定要" + text + "此用户嘛?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/apply/ApplyUserViewServlet',
								params : {
									type : 3,
									viewId : ids.toString(),
									state : params
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("" + text + "成功。");
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			})

}

function disPalyUser() {

	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	Ext.Ajax.request({
		url : '/apply/ApplyUserViewServlet',
		params : {
			type : 4,
			viewId : rows[0].data["applyUserId"]
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {

				userMsg = new Ext.form.FieldSet({
					title : '基本信息',
					layout : "table",
					layoutConfig : {
						columns : 4
					},
					autoWidth : true,
					bodyStyle : 'background-color:#DFE8F6',
					items : [{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户ID："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "用户ID",
									id : "ApplyUserId",
									width : 162,
									text : data.result["actId"]

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "用户名称",
									width : 162,
									id : "username",
									name : 'name',
									text : data.result["userName"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "联系电话："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "联系电话",
									id : "tel",
									name : 'tel',
									width : 162,
									text : data.result["tel"]

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "联系地址："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "联系地址",
									width : 162,
									name : 'addr',
									text : data.result["addr"],
									id : "addr"
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "email："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "电子邮箱",
									width : 162,
									text : data.result["email"],
									name : 'email',
									id : "email"

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "单位名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "单位名称",
									width : 162,
									name : 'comName',
									text : data.result["comName"],
									id : "comName"

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "单位地址："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "单位地址",
									width : 162,
									name : 'comAddr',
									text : data.result["comAddr"],
									id : "comAddr"

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户状态："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "用户状态",
									width : 162,
									name : 'state',
									id : "state"

								}, {
									xtype : 'hidden',
									id : 'state_hieen'

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "添加时间："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "添加时间",
									width : 162,
									name : 'createOn',
									text : data.result["createOn"],
									id : "createOn"

								}]
					}]
				})

				switch (data.result["state"]) {
					case "NEW" :
						Ext.getCmp("state").setText("新增");
						break;
					case "PASS" :
						Ext.getCmp("state").setText("通过");
						break;
					case "NOPASS" :
						Ext.getCmp("state").setText("不通过");
						break;

				}

				form = new Ext.FormPanel({
							id : 'applyform',
							labelAlign : 'center',
							buttonAlign : 'center',
							plain : true,
							layout : 'table',
							layoutConfig : {
								columns : 1
							},
							labelWidth : 300,
							AutoScroll : true,
							autoHeight : true,
							frame : true,
							items : [userMsg]
						});

				applyWindow = new Ext.Window({
							id : 'wind',
							title : '添加活动',
							width : 600,
							autoHeight : true,
							buttonAlign : 'center',
							autoScroll : true,
							modal : true,
							items : form,

							buttons : [{
										text : '关闭',
										handler : function() {
											applyWindow.close();
										}

									}]
						});

				applyWindow.show();
			}
		},
		failure : function() {
			Warn_Tip("此用户没有添加任何扩展字段");
		}
	});

	Ext.Ajax.request({
		url : '/apply/ApplyUserViewServlet',
		params : {
			type : 5,
			applyUserId : rows[0].data["applyUserId"],
			actInfoId : Ext.getCmp("actId").getValue()
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, data.result)) {
				var flag = 0;
				for (var textVar in data.result) {

					flag += 1;
					var text = textVar.split(",");
					var textName = text[0];
					var textName1 = text[1];
					var valueVar = data.result[textVar];
					reg2 = new Ext.form.FieldSet({
						title : "字段信息" + flag,
						id : 'filed' + flag,
						layout : "table",
						bodyStyle : 'background-color:#DFE8F6;font-size:12px;',
						layoutConfig : {
							columns : 4
						},
						autoWidth : true,
						width : 300,
						autoHeight : true,
						items : [{
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
							items : [{
										xtype : "label",
										id : 'lableId' + flag,
										text : textName + ":"
									}]
						}, {
							width : 180,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:center;background-color:#DFE8F6;font-size:12px;color:red",
							items : [{
										xtype : 'label',

										id : 'viewName_' + flag,
										name : 'viewName',
										fieldLabel : textName,
										text : valueVar

									}]

						}]
					});

					Ext.getCmp("applyform").add(reg2);
					Ext.getCmp("applyform").doLayout(reg2);

				}
			}

		},
		failure : function() {

			Warn_Tip("此用户没有添加任何扩展字段");
		}
	});

}

// 查询
function searchlist() {

	var act = Ext.getCmp("actId").getValue();
	if (act == "") {
		Ext.MessageBox.alert("搜索提示", "搜索时,需选择活动");
		return;
	}
	var state_val = Ext.fly("state_val").getValue();
	var tel = Ext.fly("tel").getValue();
	var username = Ext.fly("username").getValue();
	var temp = "state~" + state_val + ";actInfo~ " + act + ";tel~" + tel + ";"
			+ "username~" + username + ";";
	ds["baseParams"]["content"] = temp;
	ds["countParams"]["content"] = temp;
	ds.load();
};
