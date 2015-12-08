var ds, grid;
var gcode = "", gname = "";
// 建立表格
var BuildGrid = function() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ['id', 'code', 'name']),
				baseParams : {
					type : 4
				},
				remoteSort : true
			});
	
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	
	var cm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : 'id'
	});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight:true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '编码',
							sortable : false,
							width : 30,
							dataIndex : 'code'
						}, {
							header : '名称',
							sortable : false,
							dataIndex : 'name'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '新增',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							handler : function() {
								addRole();
							}
						}, '-', {
							text : '修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							handler : function() {
								editRole();
							}
						}, '-', {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : function() {
								delRole();
							}

						}],
				bbar : new Ext.PagingToolbar({
							pageSize : 100,
							store : ds,
							displayInfo : true
						}),
				renderTo : 'grid'
			});

	grid.on("rowdblclick", function(grid, rowIndex, r) {
				editRole();
			});

	// 右键菜单
	var rightClick = new Ext.menu.Menu({
				id : 'rightClickCont',
				shadom:false,
				items : [{
							id : 'rMenu3',
							text : '新增',
							handler : function() {
								addRole();
							}
						},{
							id : 'rMenu2',
							text : '修改',
							handler : function() {
								editRole();
							}
						},{
							id : 'rMenu1',
							text : '删除',
							handler : function() {
								delRole();
							}
						}]
			});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				grid.getSelectionModel().selectRow(rowIndex);
				grid.getSelectionModel().each(function(rec) {
							gcode = rec.get("code"); // 记录中的字段code
							gname = rec.get("name"); // 记录中的字段code
						})
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});

	grid.addListener('rowclick', rowClickFn);
	function rowClickFn() {
		grid.getSelectionModel().each(function(rec) {
					gcode = encodeURI(rec.get("code")); // 记录中的字段code
					gname = encodeURI(rec.get("name")); // 记录中的字段code
				});
	}
	ds.load();
};

// 删除角色
function delRole() {
	if (checkSelect())
		return;
	Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/mc/AdminRoleServlet.do", {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										ds.reload();
									}
								},
								failure : function(response) {
									Ext.MessageBox
											.alert("提示", "非常抱歉，您的操作发生错误。");
								}
							}, "type=2&gcode=" + gcode);
				}
			});
};

// 新增角色
function addRole() {
	window.parent.createNewWidget("role_add_admin", '添加后台角色',
			'/module/system/role_add_admin.jsp');
}

// 修改角色
function editRole() {
	if (checkSelect())
		return;
	window.parent.createNewWidget("role_edit_admin", '修改后台角色',
			'/module/system/role_edit_admin.jsp?gcode=' + gcode + '&gname='
					+ gname, true);
}
function checkSelect() {
	var selections = grid.getSelectionModel().getSelected();
	if (selections == null) {
		Ext.MessageBox.alert("提示", "请选择角色！");
		return true;
	}
	return false;
}

function init() {
	BuildGrid();
};

Ext.onReady(function() {
			init()
		});