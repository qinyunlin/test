Ext.onReady(init);
var panel, fs, grid1, grid2, ds1, ds2, eid, query_type, contetn, query_input, sel_mid, emp_obj, ename, win;
var ids = [];// 移动的数据集
function init() {
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '您可以拖拽数据进行添加或删除操作。');
	eid = getCurArgs("eid");
	ename = decodeURI(getCurArgs("ename"))
	buildPanel();
};

// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu1',
						text : '设置管理员',
						handler : setAdmin
					}, {
						id : 'rMenu2',
						text : '取消管理员',
						handler : cancelAdmin
					}, {
						id : 'rMenu3',
						text : '删除企业会员',
						handler : delEmpMem
					}, {
						text : '审核',
						hidden : compareAuth("MEM_AUDIT"),
						handler : showPas
					}]
		});
function buildPanel() {
	ds1 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName", "degree"]),
				baseParams : {

					method : "searchPaged",
					validDate : 1,
					pageNo : 1
				},
				remoteSort : false
			});
	ds2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpMemberServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName", "isAdmin",
								"degree"]),
				baseParams : {
					type : 7,
					eid : eid
				},
				remoteSort : false
			});
	ds2.load();
	var sm1 = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var sm2 = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	grid1 = new Ext.grid.GridPanel({
				ddGroup : 'secondGridDDGroup',
				store : ds1,
				width : '49%',
				height : 520,
				viewConfig : {
					forceFit : true
				},
				sm : sm1,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '会员ID',
							sortable : true,
							dataIndex : 'memberID'
						}, {
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						}, {
							header : '企业名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '会员等级',
							sortable : true,
							dataIndex : 'degree',
							renderer : function(v) {
								return showDegree(v);
							}
						}],
				enableDragDrop : true,
				stripeRows : true,
				title : '查询会员',
				tbar : ["<span style='font-weight:bold'>正式采购会员列表</span>"]
			});

	grid2 = new Ext.grid.GridPanel({
				ddGroup : 'firstGridDDGroup',
				store : ds2,
				width : '49%',
				height : 520,
				viewConfig : {
					forceFit : true
				},
				sm : sm2,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '会员ID',
							sortable : true,
							dataIndex : 'memberID'
						}, {
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						}, {
							header : '企业名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '是否管理员',
							sortable : true,
							dataIndex : 'isAdmin',
							renderer : function(v) {
								if (parseInt(v) == 1)
									return "<font style='color:red'>管理员</font>";
								else
									return "普通会员";
							}
						}, {
							header : '会员等级',
							soratable : true,
							dataIndex : 'degree',
							renderer : function(v) {
								return showDegree(v);
							}
						}],
				enableDragDrop : true,
				stripeRows : true,
				title : '企业会员',
				tbar : ["<span style='font-weight:bold'>本企业会员列表</span>"]
			});
	grid2.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	panel = new Ext.Panel({
				title : "<font style='color:red;margin-right:16px'>" + ename
						+ "</font>企业会员查看/设置",
				autoHeight : true,
				autoWidth : true,
				renderTo : "panel",
				layout : "column",
				items : [grid1, grid2],
				tbar : [{
							xtype : "label",
							text : "查询类型："
						}, {
							xtype : "combo",
							store : [["memberID", "会员ID"],
									["corpName", "企业名称"], ["trueName", "会员姓名"]],
							hiddenName : "query_type",
							mode : "local",
							triggerAction : "all",
							fieldLabel : "查询类型",
							value : "memberID"
						}, {
							xtype : "textfield",
							id : "query_input"
						}, {
							xtype : "button",
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});

	var firstGridDropTargetEl = grid1.getView().scroller.dom;
	var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
				ddGroup : 'firstGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid1.store.add(records);
					grid1.store.sort('name', 'ASC');
					return true;
				}
			});

	var secondGridDropTargetEl = grid2.getView().scroller.dom;
	var secondGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
				ddGroup : 'secondGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid2.store.add(records);
					grid2.store.sort('name', 'ASC');
					return true;
				}
			});
	grid2.store.on("add", function(store, record, num) {
				if (Ext.isEmpty(record)) {
					Info_Tip("请选择一条记录");
					return;
				}
				saveEmpInfo(record[0].get("memberID"));
			});
	grid2.store.on("remove", function(store, record, num) {
				if (Ext.isEmpty(record)) {
					Info_Tip("请选择一条记录");
					return;
				}
				delEmpMem(record.get("memberID"))
			});
};
// 搜索
function searchlist() {
	query_type = Ext.fly("query_type").getValue();
	query_input = Ext.fly("query_input").getValue();
	if (Ext.isEmpty(query_input)) {
		Info_Tip("请输入条件。");
		return;
	}
	ds1["baseParams"]["content"] = query_type + "~" + query_input;
	ds1.load();
};

// 设置管理员
function setAdmin() {
	var row = grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	sel_mid = row.get("memberID");
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=10", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("设置成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + sel_mid + "&isAdmin=1&eid="+eid);
};

// 取消管理员
function cancelAdmin() {
	var row = grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	sel_mid = row.get("memberID");
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=10", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("设置成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + sel_mid + "&isAdmin=0&eid="+eid);
};

// 保存已添加的企业会员
function saveEmpInfo(mid) {
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=23", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("企业会员添加成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + mid + "&eid=" + eid);
};

// 删除企业会员
function delEmpMem(mid) {
	var sel_mid;
	if (!Ext.isEmpty(mid)) {
		sel_mid = mid;
	} else {
		var row = grid2.getSelectionModel().getSelected();
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
		sel_mid = row.get("memberID");
	}
	Ext.lib.Ajax.request("post", "/ep/EpMemberServlet?type=9", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("删除成功。");
						ds2.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "memberID=" + sel_mid+"&eid="+eid);
};

// 审核区域
function showPas() {
	var sels = grid2.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	}
	var mem_type_ds = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : [['10', '采购会员']]
			});
	win = new Ext.Window({
		title : "审核",
		width : 300,
		height : 160,
		closable : true,
		draggable : true,
		modal : true,
		border : false,
		plain : true,
		layout : 'form',
		closeAction : "close",
		buttonAlign : 'center',
		items : [{
					xtype : "combo",
					store : mem_type_ds,
					mode : 'local',
					id : 'mem_type',
					name : 'degree',
					triggerAction : 'all',
					readOnly : true,
					valueField : "value",
					displayField : "text",
					fieldLabel : "信息会员类型",
					hiddenName : 'degree_input',
					emptyText : '请选择信息会员类型'
				}, {
					xtype : "combo",
					id : 'pass_type',
					store : new Ext.data.SimpleStore({
								fields : [{
											name : 'value'
										}, {
											name : 'text'
										}],
								data : [['0', '有效日期'], ['1', '有效天数']]
							}),
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					valueField : "value",
					displayField : "text",
					fieldLabel : "审核类型",
					emptyText : '请选择审核类型',
					value : '0',
					listeners : {
						select : function(ComboBox, record) {
							if (record.get('value') == '1') {

								Ext.fly("day_area").setVisible(true);
								Ext.fly("date_area")
										.setVisibilityMode(Ext.Element.DISPLAY);
								Ext.fly("date_area").setVisible(false);
							} else {
								Ext.fly("day_area")
										.setVisibilityMode(Ext.Element.DISPLAY);
								Ext.fly("day_area").setVisible(false);
								Ext.fly("date_area").setVisible(true);
							}
						}
					}
				}, {
					id : 'date_area',
					layout : 'table',
					layoutConfig : {
						columns : 2
					},
					bodyStyle : "border:none;background-color:#CED9E7",
					items : [{
								layout : "form",
								bodyStyle : "border:none;background-color:#CED9E7",
								items : [{
											xtype : 'datefield',
											emptyText : '请选择日期',
											format : 'Y-m-d',
											fieldLabel : "有效日期",
											name : 'validDate',
											id : "date_i",
											readOnly : true
										}]
							}, {
								xtype : 'label',
								html : '<font color="red">(不包含此日期)</font>'
							}]
				}, {
					id : "day_area",
					layout : "form",
					bodyStyle : "border:none;background-color:#CED9E7",
					items : [{
								xtype : 'textfield',
								emptyText : '请输入天数',
								name : 'addDays',
								fieldLabel : "有效天数",
								allowBlank : false,
								id : "day_i"

							}]
				}],
		buttons : [{
					text : "审核",
					handler : passOp
				}, {
					text : "取消",
					handler : function() {
						win.close();
					}
				}]
	});
	win.show();
	Ext.fly("day_area").setVisibilityMode(Ext.Element.DISPLAY);
	Ext.fly("day_area").setVisible(false);
};

// 审核提交
function passOp() {
	var query = "";
	var addDays = Ext.fly('day_i').getValue();
	var valdate = Ext.fly('date_i').getValue();
	var degree = Ext.fly("degree_input").getValue();
	var sels = grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	var mid = sels.get("memberID");
	if (Ext.isEmpty(degree)) {
		degree = mem_degree;
	}
	if (addDays == "请输入天数") {
		if (valdate == "请选择日期") {
			Info_Tip("请输入日期");
			return;
		}
		query = "degree=" + degree + "&validDate=" + valdate;
	}

	if (valdate == "请选择日期") {
		if (addDays == "请输入天数") {
			Info_Tip("请输入天数");
			return;
		}
		query = "degree=" + degree + "&addDays=" + addDays;
	}
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=audit&mid=" + mid, {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succpass);
						ds2.reload();
						win.close();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};
