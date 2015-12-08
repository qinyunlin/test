var role_edit_form;
var store, ds, compareGrid, fs, win, grid;
var sm, degreeData = [];
var tempRole = [];
var editMemberRole = function(col) {
	function reload() {
		ds.reload();
	};
	var groles = [];
	for (var i = 0; i < grid.selModel.selections.items.length; i++) {
		groles.push(grid.selModel.selections.items[i].data.code);
	}
	groles = groles.toString();
	Ext.Msg.confirm("提示", "您确认要保存权限吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/mc/AdminRoleServlet.do',
								params : {
									type : 8,
									id : col,
									groles : groles
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("保存成功", reload);
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});

};

var init = function() {
	Ext.TipSelf.msg('提示', '列表选中表示拥有该权限，可在列区域双击进行修改权限操作。');
	Ext.QuickTips.init();
	buildGrid();
};

// 生成对比列表
function buildGrid() {
	ds = new Ext.data.Store({
				autoDestroy : true,
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'code', 'name', 'fieldName', {
									name : 'degree1',
									type : 'bool'
								}, {
									name : 'degree2',
									type : 'bool'
								}, {
									name : 'degree3',
									type : 'bool'
								}, {
									name : 'degree4',
									type : 'bool'
								}, {
									name : 'degree5',
									type : 'bool'
								}, {
									name : 'degree6',
									type : 'bool'
								}, {
									name : 'degree7',
									type : 'bool'
								}, {
									name : 'degree8',
									type : 'bool'
								}, {
									name : 'degree9',
									type : 'bool'
								}, {
									name : 'degree11',
									type : 'bool'
								}, {
									name : 'degree12',
									type : 'bool'
								}]),
				baseParams : {
					type : 18
				},
				remoteSort : true
			});

	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel();
	compareGrid = new Ext.grid.GridPanel({
				store : ds,
				sm : sm,
				autoWidth : true,
				autoScroll : true,
				stripeRows : true,
				loadMask : true,
				trackMouseOver : true,
				frame : true,
				autoExpandColumn : 'common',
				clicksToEdit : 1,
				viewConfig : {
					forceFit : true
				},
				height : parseInt(parent.Ext.get("tab_0102_iframe").getHeight())
						- 4,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '编号',
							dataIndex : 'code',
							width : 40,
							sortable : true
						}, {
							header : '名称',
							dataIndex : 'name',
							width : 70,
							sortable : true
						}, {
							header : '标识',
							dataIndex : 'fieldName',
							width : 80,
							sortable : true
						}, {
							header : '试用信息',
							dataIndex : 'degree1',
							width : 40,
							renderer : changeTake
						}, {
							header : '试用厂商',
							dataIndex : 'degree2',
							width : 40,
							renderer : changeTake
						}, {
							header : '正式信息',
							dataIndex : 'degree3',
							width : 40,
							renderer : changeTake
						}, {
							header : '正式厂商',
							dataIndex : 'degree4',
							width : 40,
							renderer : changeTake
						}, {
							header : '赠送',
							dataIndex : 'degree5',
							width : 30,
							renderer : changeTake
						}, {
							header : '持卡',
							dataIndex : 'degree6',
							width : 30,
							renderer : changeTake
						}, {
							header : '内部',
							dataIndex : 'degree7',
							width : 30,
							renderer : changeTake
						}, {
							header : 'VIP信息',
							dataIndex : 'degree8',
							width : 40,
							renderer : changeTake
						}, {
							header : '企业',
							dataIndex : 'degree9',
							width : 40,
							renderer : changeTake
						}, {
							header : '未审核信息',
							dataIndex : 'degree11',
							width : 50,
							renderer : changeTake
						}, {
							header : '未审核厂商',
							dataIndex : 'degree12',
							width : 50,
							renderer : changeTake
						}],
				listeners : {
					'celldblclick' : getColumnArea,
					'headerdblclick' : getColumnArea
				}

			});
	fs = new Ext.FormPanel({
				autoWidth : true,
				autoHeight : true,
				layout : 'form',
				items : compareGrid,
				renderTo : 'role_edit_member'
			});
	ds.load();

};

// 显示修改区域
function editArea(col, colTitle) {
	store = new Ext.data.Store({
				autoDestroy : true,
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'code', 'name', 'fieldName']),
				baseParams : {
					type : 9
				},
				remoteSort : true
			});

	sm = new Ext.grid.CheckboxSelectionModel({
				width : 25,
				dataIndex : 'code',
				handleMouseDown : Ext.emptyFn
			});
	grid = new Ext.grid.GridPanel({
		store : store,
		autoWidth : true,
		autoScroll : true,
		stripeRows : true,
		loadMask : true,
		trackMouseOver : true,
		frame : true,
		clicksToEdit : 1,
		viewConfig : {
			forceFit : true
		},
		height : parseInt(parent.Ext.get("tab_0102_iframe").getHeight()) / 2,
		sm : sm,
		columns : [sm, {
					header : '编号',
					dataIndex : 'code',
					width : 60,
					sortable : true
				}, {
					header : '名称',
					dataIndex : 'name',
					width : 120,
					sortable : true
				}, {
					header : '标识',
					dataIndex : 'fieldName',
					width : 140,
					sortable : true
				}, {
					header : '描述',
					dataIndex : 'description',
					width : 60,
					sortable : true
				}]
			// ,
			// listeners : {
			// "rowclick" : function(grid, row, e) {
			// var rows = [];
			// for (var i = 0; i < degreeData.length; i++) {
			// var code = degreeData[i];
			// var j = 0;
			// store.data.each(function(s) {
			// if (code == s.data.code) {
			// rows.push(j);
			// }
			// j++;
			// });
			// }
			// var len=grid.store.data.length;
			// for(var i=0;i<len;i++){
			// if(grid.store.data.items[i].data.code=grid.store.data.items[row].data.code.slice(0,4)){
			// tempRole.push(i);
			// break;
			// }
			// }
			// for(var i=0;i<tempRole.length;i++){
			// rows.push(tempRole[i]);
			// }
			//						
			// // tempRole.push(row);
			// sm.selectRows(rows);
			//						
			// }
			// }

		});
	var windowTitle = '权限修改--' + colTitle;
	win = new Ext.Window({
				title : windowTitle,
				modal : true,
				width : parseInt(parent.Ext.get("tab_0102_iframe").getWidth())
						/ 2,
				autoHeight : true,
				items : grid,
				buttons : [{
							text : '默认权限',
							handler : function() {
								defaultRole(col);
							}
						}, {
							text : '恢复',
							handler : resetDegree
						}, {
							text : '保存',
							handler : function() {
								editMemberRole(col);
							}
						}, {
							text : '取消',
							handler : function() {
								win.close()
							}
						}]
			});
	getDegree(col);
	win.show();

};

// 重置数据
function resetDegree() {
	var rows = [];
	for (var i = 0; i < degreeData.length; i++) {
		var code = degreeData[i];
		var j = 0;
		store.data.each(function(s) {
					if (code == s.data.code) {
						rows.push(j);
					}
					j++;
				});
	}
	sm.selectRows(rows);
}
// 绑定数据
function getDegree(col) {
	Ext.Ajax.request({
				url : '/mc/AdminRoleServlet.do',
				params : {
					type : 7,
					id : col
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					store.load();
					store.on('load', function(sto, r, o) {
								var rows = [];
								if (data.result!=null&&data.result!="" && data.result.roles) {
									var roles = data.result.roles.split(",");
									degreeData = roles;
									for (var i = 0; i < roles.length; i++) {
										var code = roles[i];
										var j = 0;
										sto.data.each(function(s) {
													if (code == s.data.code) {
														rows.push(j);
													}
													j++;
												});
									}
								}
								sm.selectRows(rows);
							});
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 获取列区域
function getColumnArea(thisgrid, row, column, e) {
	var colTitle = thisgrid.getColumnModel().getColumnHeader(column); // Get
	// field
	// name
	if (column < 14 && column > 4)
		editArea(parseInt(column) - 4, colTitle);
	if (column > 13)
		editArea(parseInt(column) - 3, colTitle);
};
// 默认权限
function defaultRole(thisid) {
	Ext.Msg.confirm("确认操作", "您确认要恢复默认权限吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/mc/AdminRoleServlet.do',
								params : {
									type : 19,
									id : thisid
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");

									var rows = [];
									if (data.result.length > 0) {
										var roles = data.result.split(",");
										degreeData = roles;
										for (var i = 0; i < roles.length; i++) {
											var code = roles[i];
											var j = 0;
											store.data.each(function(s) {
														if (code == s.data.code) {
															rows.push(j);
														}
														j++;
													});
										}
										sm.selectRows(rows);
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			})
};

Ext.onReady(init);