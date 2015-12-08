var grid;
var id = "", gname = "";

var BuildGrid = function() {
	var ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/AdminRoleServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ['id', 'name', 'roles']),
				baseParams : {
					type : 6
				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '编码',
							sortable : false,
							dataIndex : 'id',
							width : 15
						}, {
							header : '会员名称',
							sortable : false,
							dataIndex : 'name',
							editor : {
								xtype : 'textfield',
								allowBlank : false
							}
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : new Ext.PagingToolbar({
							pageSize : 100,
							store : ds,
							displayInfo : true
						}),
				renderTo : 'grid'
			});

	grid.on("rowdblclick", function(grid, rowIndex, r) {
				editMemberRole();
			});
	ds.load();
};

// 修改角色
function editMemberRole() {
	window.parent.createNewWidget("role_edit_member", '修改会员等级权限',
			'/module/system/role_edit_member.jsp?id=' + id + '&gname=' + gname,
			true);
}

function init() {
	Ext.TipSelf.msg('提示', '双击列表可进行权限修改操作。');
	BuildGrid();
};

Ext.onReady(function() {
			init();
		});