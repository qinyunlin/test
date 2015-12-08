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
			shadom : false,
			items : [{
						id : 'rMenu1',
						text : '查看供应商报价',
						hidden : compareAuth("FAC_VIEW"),
						handler : function() {
							openInfo(1);
						}
					}]
		});

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "createOn"]),
				baseParams : {
					type : 2,
					page : 1,
					types : 'fac',
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9,
					types : 'fac'
				},
				remoteSort : true
			});
	ds.setDefaultSort("createOn", "DESC");
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
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
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
							dataIndex : 'eid'
						}, {
							header : 'id',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '厂商名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '厂商简称',
							sortable : false,
							dataIndex : 'fname'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [{
							text : '修改供应商报价分类',
							hidden : compareAuth('FAC_VIEW'),
							handler : function() {
								openInfo(1);
							},
							icon : '/resource/images/report_magnify.png'
						}
//						, {
//							text : '未审核材料供应商',
//							handler : function() {
//								window.parent.createNewWidget(
//										"mat_fac_list_u", '未审核材料供应商',
//										'/module/mat/mat_fac_cid_list_u.jsp');
//							},
//							icon : '/resource/images/application_double.png',
//							hidden : compareAuth("FAC_AUDIT")
//						}
						]
			});
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							text : '查询厂商：',
							xtype : 'label'
						}, query_type = new Ext.form.ComboBox({
									id : 'query_type',
									store : ds_type,
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									displayField : "text",
									readOnly : true,
									value : 'fname'
								}), {
							xtype : 'textfield',
							id : 'input_value',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							id : 'stuff_area',
							xtype : 'container',
							items : [new Ext.form.ComboBox({
										id : 'stype_input',
										fieldLabel : "材料分类",
										store : stuff,
										emptyText : "请选择",
										mode : "local",
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										hiddenName : "stuffcode",
										readOnly : true,
										value : 1

									})]
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}]

			});
	hideEl('stuff_area');
	query_type.on('select', function(combo) {
				if (combo.getValue() == 'fctg') {
					showEl('stuff_area');
					hideEl('input_value');
				} else {
					hideEl('stuff_area');
					showEl('input_value');
				}
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

};

function searchlist() {
	var content = '';
	var type = query_type.getValue();
	ds.baseParams['cid'] = "";
	switch (type) {
		case 'fname' :
			content += 'name~' + Ext.fly('input_value').getValue();
			ds.baseParams['content'] = content;
			ds.baseParams['type'] = 2;
			ds.countParams['type'] = 9;
			break;
		case 'fid' :
			content += 'eid~' + Ext.fly('input_value').getValue();
			ds.baseParams['content'] = content;
			ds.baseParams['type'] = 2;
			ds.countParams['type'] = 9;
			break;
		default :
			ds.baseParams['type'] = 17;
			ds.countParams['type'] = 16;
			ds.baseParams['cid'] = Ext.fly('stuffcode').getValue();
	}
	ds.load();

};

// 打开
function openInfo(v) {
	var row;
	row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息");
		return;
	}
	var id = row.get("eid");
	var fname = encodeURI(row.get("fname"));
	window.parent.createNewWidget("mat_cid_list", '修改已审核材料分类',
			'/module/mat/mat_cid_list.jsp?eid=' + id + "&fname=" + fname);
};