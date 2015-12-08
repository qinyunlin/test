// 建立表格
var store, grid;
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu3',
						text : '新增',
						handler : function() {
							addAccount();
						}
					}, {
						id : 'rMenu2',
						text : '修改',
						handler : function() {
							editAccount();
						}
					}, {
						id : 'rMenu1',
						text : '删除',
						handler : function() {
							delAccount();
						}
					}]
		});
var buildGrid = function() {
	var pageSize = 300;
	store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminManage.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ['memberID', 'trueName', 'roleName',
								'createOn','ipAddr','lastTime']),
				baseParams : {
					type : 1
				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel();
	grid = new Ext.grid.GridPanel({
				store : store,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '用户名',
							dataIndex : 'memberID'
						}, {
							header : '真实姓名',
							dataIndex : 'trueName'
						}, {
							header : '用户角色',
							dataIndex : 'roleName'
						}, {
							header : '加入时间',
							dataIndex : 'createOn'
						}, {
							header : '上次登录IP',
							dataIndex : 'ipAddr'
						}, {
							header : '上次登录时间',
							dataIndex : 'lastTime'
						}],
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							store : store,
							displayInfo : true
						}),
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : [{
							text : '新增',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							handler : addAccount
						}, '-', {
							text : '修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							handler : editAccount
						}, '-', {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : delAccount
						}],
				renderTo : 'grid'
			});
	store.load({
				params : {
					start : 0,
					limit : pageSize
				}
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				editAccount();
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});

};
// 添加新增
function addAccount() {
	window.parent.createNewWidget("account_add", '添加账号',
			'/module/system/account_add.jsp');
};

// 修改
function editAccount() {
	var selections = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(selections)) {
		Ext.MessageBox.alert("提示", "请选择账号！");
	} else {
		window.parent.createNewWidget("account_edit", '修改账号',
				'/module/system/account_edit.jsp?userId='
						+ selections.data.memberID, true);
	}
};
// 删除角色
function delAccount() {
	var selections = grid.getSelectionModel().getSelected();
	if(Ext.isEmpty(selections)) {
		Ext.MessageBox.alert("提示", "请选择账号！");
		return ;
	}
	Ext.MessageBox.confirm("提示", "确定删除该账号吗？", function(btn) {
				if (btn == "yes") {
					if (Ext.isEmpty(selections)) {
						Ext.MessageBox.alert("提示", "请选择账号！");
					} else {
						Ext.Ajax.request({
									url : '/mc/AdminManage.do',
									success : function(response) {
										var jsondata = eval("("
												+ response.responseText + ")");
										if (getState(jsondata.state)) {
											Ext.MessageBox.alert("提示", "删除成功！");
											store.reload();
										} else {
											Ext.MessageBox.alert("提示", "删除失败！");
										}
									},
									failure : function() {
										Ext.MessageBox.alert("提示", "删除失败！");
									},
									headers : {
										'my-header' : 'foo'
									},
									params : {
										adminName : selections.data.memberID,
										type : '5'
									}
								});
					}
				} else {
					return;
				}
			});
};
function init() {
	buildGrid();
};

Ext.onReady(function() {
			init();
		});
