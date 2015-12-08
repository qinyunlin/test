Ext.onReady(init);
var grid, grid2, mag_grid, ds, pageSize = 20, win, area, datasel, store, fs;
function init() {
	buildGrid();
};
var area_store1 = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var sel_type = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [["eid", "企业ID"], ["name", "名称"]]
			});

// 显示期刊厂商
function buildGrid() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else
		webArea = parent.currUser_mc.webProvince;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/MagFacServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["eid", "magArea"]
						}, ["eid", "name", "createOn", "magArea"]),
				baseParams : {
					page : 1,
					method : 'getPage',
					province : webArea,
					pageSize : pageSize
				},
				countUrl : '/MagFacServlet',
				countParams : {
					method : 'getCount'
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var sm = new Ext.grid.CheckboxSelectionModel({

	});

	mag_grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '企业ID',
							sortable : false,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : false,
							width : 240,
							dataIndex : 'name'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}, {
							header : '期刊地区',
							sortable : true,
							dataIndex : 'magArea'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : ["区域选择：", {
							xtype : 'combo',
							fieldLabel : "区域选择",
							store : area_store1,
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							id : 'area_sel_mag',
							allowBlank : false,
							value : webArea,
							width : 80
							/*
							listeners : {
								"select" : function(combo) {
									if (Ext.isEmpty(combo.getValue())) {
										Info_Tip("请选择区域。");
										return;
									}
									
									ds2.baseParams["province"] = combo
											.getValue();
									ds2.load();
								}
							}
							*/ 
						}, "-", new Ext.form.ComboBox({
									store : sel_type,
									mode : "local",
									emptyText : "请选择",
									triggerAction : "all",
									valueField : "value",
									displayField : "text",
									id : "sel_type",
									value : "eid",
									hiddenName : "sel_type_val",
									width : 80
						}), "-" ,{
							xtype : "label",
							text : "关键字：",
							bodyStyle : "margin-left: 5px"
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "search_input"
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchMaglist
						}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	ds.load();
};
// 查询期刊厂商
function searchMaglist() {
	ds.baseParams["province"] = Ext.fly("area_sel_mag").getValue();
	ds.baseParams["field"] = Ext.fly("sel_type_val").getValue();
	ds.baseParams["text"] = Ext.fly("search_input").getValue();
	ds.load();
};

// 添加企业
function addEnterprise() {
	window.parent.createNewWidget("enterprise_add", '添加企业',
			'/module/enterprise/enterprise_add.jsp');
};
// 查看厂商材料
function MatDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var fid = row.get("eid");
	window.parent.createNewWidget("mat_fac_detail", '供应商材料报价',
			'/module/mat/mat_fac_detail.jsp?eid=' + fid);
};


