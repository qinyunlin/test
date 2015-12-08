Ext.onReady(init);
function init() {
	buildGrid();
};
var ds, grid, query_type, ds2, grid2;
var stuff = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : Ext.stuff.code
		// from stuff.js
	});
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			shadom : false,
			items : [{
						id : 'rMenu1',
						text : '查看供应商报价',
						hidden : compareAuth("FAC_VIEW"),
						handler : function() {
							openInfo();
						}
					}]
		});

function buildGrid() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/FacMaterial.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["fid", "fname"]),
				baseParams : {
					type : 6
				},
				remoteSort : true
			});
	ds.load();
	var ds_type = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : [['fname', '厂商名称'], ['fid', '厂商ID'], ['fctg', '厂商分类']]
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel();
	// 未审核
	grid = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '厂商ID',
							sortable : false,
							dataIndex : 'fid'
						}, {
							header : '厂商名称',
							sortable : false,
							dataIndex : 'fname'
						}],
				renderTo : 'mat_grid_u',
				tbar : [{
							text : '查看供应商报价',
							hidden : compareAuth("FAC_VIEW"),
							handler : function() {
								openInfo(0);
							},
							icon : '/resource/images/report_magnify.png'
						}]
			});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo(0);
			});

};

// 打开
function openInfo(v) {
	var row;
	row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息");
		return;
	}
	var id = row.get("fid");
	var fname = encodeURI(row.get("fname"));
	window.parent.createNewWidget("mat_cid_list_u", '修改材料分类',
			'/module/mat/mat_cid_list_u.jsp?eid=' + id + "&fname=" + fname);
};

