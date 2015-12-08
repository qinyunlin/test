Ext.onReady(init);
function init() {
	buildGrid();
};
var ds, grid, query_type;
var stuff = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : Ext.stuff.code
		// from stuff.js
	});
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu1',
						text : '查看供应商报价',
						handler : function() {
							openInfo();
						},
						hidden : compareAuth("FAC_VIEW")
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
	grid = new Ext.grid.GridPanel({
				autoWidth:true,
				autoHeight : true,
				autoScroll:true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '厂商ID',
							sortable : false,
							dataIndex : 'fid'
						}, {
							header : '厂商名称',
							sortable : false,
							dataIndex : 'fname'
						}],
				renderTo : 'mat_grid',
				tbar : [{
							text : '查看供应商报价',
							handler : openInfo,
							icon : '/resource/images/report_magnify.png',
							hidden : compareAuth("FAC_VIEW")
						}]
			});
	
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

};



// 打开
function openInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息");
		return;
	}
	var id = row.get("fid");
	window.parent.createNewWidget("mat_fac_detail", '供应商材料报价',
			'/module/mat/mat_fac_detail.jsp?eid=' + id);
};