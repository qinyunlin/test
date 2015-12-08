Ext.onReady(init);
var grid, ds;
function init() {
	getTemplate();
};
function buildGrid(obj) {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
					url : '/ep/EpTempSupplierServlet'
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					id : ["id", "catalog"]
				}, ['name', 'linkman', "phone", "area", "brand", "path", "id"]),
		baseParams : {
			type : 6,
			pageSize : 20,
			content:'type~'+obj[0]["type"]
		},
		countUrl : '/ep/EpTempSupplierServlet',
		countParams : {
			type : 5
		},
		remoteSort : true
	});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var temp = [];
	var len = obj.length
	for (var i = 0; i < len; i++) {
		temp.push("['" + obj[i]["type"] + "','" + obj[i]["owner"] + "']");
	}
	alert(temp);
	temp = eval("([" + temp + "])");
	var sm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : 'id'
	});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				autoWidth : true,
				autoHeight : true,
				autoScroll : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), sm, {
							header : '名称',
							sortable : true,
							width : 150,
							dataIndex : 'name'
						}, {
							header : '品牌',
							sortable : true,
							dataIndex : 'brand'
						}, {
							header : '联系人',
							sortable : true,
							dataIndex : 'linkman'
						}, {
							header : '联系方式',
							width : 150,
							dataIndex : 'phone'
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '路径',
							sortable : true,
							dataIndex : 'path'
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel(),
				bbar : pagetool,
				tbar : [{
							text : '模板名称：',
							xtype : 'label'
						}, {
							xtype : 'combo',
							store : temp,
							id : 'template_combo',
							triggerAction : "all",
							valueField : "value",
							displayField : "text",
							value : obj[0]["type"]
						}, {
							xtype : 'label',
							text : '供应商名称：'
						}, {
							xtype : 'textfield',
							id : 'sup_name'
						}, {
							xtype : 'label',
							text : '品牌：'
						}, {
							xtype : 'textfield',
							id : 'sup_brand'
						}, {
							xtype : 'label',
							text : '联系人：'
						}, {
							xtype : 'textfield',
							id : 'sup_linkman'
						}, {
							xtype : 'label',
							text : '地区：'
						}, {
							xtype : 'textfield',
							id : 'sup_area'
						}, {
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}, "->", {
							text : '此处支持跨分类查找',
							xtype : 'label',
							style : 'font-weight:bold'
						}]
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : []
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});
};

function searchlist() {

	ds.baseParams["content"] = "name~" + Ext.fly("sup_name").getValue()
			+ ";area~" + Ext.fly("sup_area").getValue() + ";type~"
			+ Ext.getCmp("template_combo").getValue() + ';brand~'
			+ Ext.fly("sup_brand").getValue() + ';linkman~'
			+ Ext.fly("sup_linkman").getValue();
	ds.load();
};

// 查看供应商报价
function openInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.data["id"];
	window.parent.createNewWidget("enterprise_vip_template_mat", '查看供应商材料报价',
			'/module/enterprise/enterprise_vip_template_mat.jsp?sid=' + thisid);

};

// 获得模板
function getTemplate() {
	Ext.Ajax.request({
				url : '/ep/EnterpriseTempCatalogServlet',
				params : {
					type : 7
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						buildGrid(data.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			})
};