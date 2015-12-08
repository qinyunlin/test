var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, comboProvinces, comboCities;

var zhcn = new Zhcn_Select();

// 年份
var yearData = [ [ '', '所有' ], [ '2012', '2012' ], [ '2013', '2013' ],
		[ '2014', '2014' ], [ '2015', '2015' ], [ '2016', '2016' ],
		[ '2017', '2017' ], [ '2018', '2018' ] ];

// 套餐类型
var ordersTypeData = [ [ '', '所有' ], [ '1', '推广会员' ], [ '2', 'A套餐' ],
		[ '3', 'B套餐' ], [ '4', 'C套餐' ] ];

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

// 生成列表
function buildGirid() {

	ds_info = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/OrdersItemServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, [ "province", "id", "city", "name", "itemType", "price", "year",
				"createOn", "createBy", "updateBy", "updateOn", "unit" ]),
		baseParams : {
			type : 1,
			pageSize : pageSize,
			standardOrders : 2,
			pageNo : 1

		},
		countUrl : '/mc/OrdersItemServlet.do',
		countParams : {
			type : 2,
			standardOrders : 2
		},
		remoteSort : true
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds_info,
		displayInfo : true,
		pageSize : pageSize
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : "id"
	});
	grid_info = new Ext.grid.EditorGridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_info,
		viewConfig : {
			forceFit : true
		},
		tbar : [ {
			text : '添加套餐',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/add.gif',
			handler : addOrdersItem,
			hidden : compareAuth("ORDERSITEM_ADD")
		}, "-", {
			text : '修改',
			icon : "/resource/images/book_edit.png",
			handler : updateOrdersItem,
			hidden : compareAuth("ORDERSITEM_EDIT")
		}, "-", {
			text : '标准套餐管理',
			icon : "/resource/images/application_double.png",
			handler : standardOrdersItem,
			hidden : compareAuth("STANORDERSITEM_LIST")
		}, "-", {
			text : '删除',
			icon : "/resource/images/delete.gif",
			handler : delOrdersItem,
			hidden : compareAuth("ORDERSITEM_DEL")
		} ],
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '适用地区',
			sortable : false,
			dataIndex : 'province',
			renderer : areaRen
		}, {
			header : '年份',
			sortable : false,
			dataIndex : 'year'
		}, {
			header : '套餐名称',
			sortable : false,
			dataIndex : 'name'
		}, {
			header : '套餐类型',
			sortable : false,
			dataIndex : 'itemType',
			renderer : itemTypeRen
		}, {
			header : '套餐单价(元)',
			sortable : false,
			dataIndex : 'price',
			renderer : priceRen
		}, {
			header : '创建人',
			sortable : false,
			dataIndex : 'createBy'
		}, {
			header : '创建时间',
			sortable : false,
			dataIndex : 'createOn',
			renderer : trimDate
		}, {
			header : '修改人',
			sortable : false,
			dataIndex : 'updateBy'
		}, {
			header : '修改时间',
			sortable : false,
			dataIndex : 'updateOn',
			renderer : trimDate
		} ],
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		bbar : pagetool,
		renderTo : "online_info"
	});

	// 行双击事件
	grid_info.on("rowdblclick", function(grid_info, rowIndex, r) {
		updateOrdersItem();
	});

	function priceRen(value, p, record) {
		return record.data.price + "/" + record.data.unit;
	}

	function areaRen(value, p, record) {
		return record.data.province + record.data.city;
	}

	function itemTypeRen(value, p, record) {
		var t = record.data.itemType;
		var stName = "";
		if (t == "1") {
			stName = "推广会员";
		} else if (t == "2") {
			stName = "A套餐";
		} else if (t == "3") {
			stName = "B套餐";
		} else if (t == "4") {
			stName = "C套餐";
		}
		return stName;

	}

	// 默认第一次打开的时候加载数据
	ds_info.load();

	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = [ "全部城市" ];
	var city_area = [];
	comboProvinces = new Ext.form.ComboBox({
		id : 'comboProvinces',
		store : pro,
		value : "全部省份",
		width : 100,
		listeners : {
			select : function(combo, record, index) {
				comboCities.reset();
				var province = combo.getValue();
				if (province == "全部省份") {
					city = [ "全部城市" ];

				} else {
					city = zhcn.getCity(province).concat();
					city.unshift("全部城市");
				}

				comboCities.store.loadData(city);

				comboCities.enable();
			}
		},

		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		readOnly : true
	});

	comboCities = new Ext.form.ComboBox({
		id : 'comboCities',
		store : city,
		value : '全部城市',
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '',
		hiddenName : 'region',
		editable : false,
		triggerAction : 'all',
		readOnly : true,
		name : 'region',
		disabled : true,
		allowBlank : false,
		width : 100

	});

	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [ {
			xtype : "label",
			text : "省："

		}, comboProvinces, '-', {
			xtype : "label",
			text : "市："
		}, comboCities, "-", {
			xtype : "label",
			text : "年份："
		}, {
			xtype : 'combo',
			store : yearData,
			id : 'year',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 80,
			value : '所有'
		}, "-", {
			xtype : "label",
			text : "套餐类型："
		}, {
			xtype : 'combo',
			store : ordersTypeData,
			id : 'itemType',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 80,
			value : ''
		}, "-", {
			xtype : 'label',
			text : '套餐名称：'
		}, "&nbsp;", {
			xtype : "textfield",
			id : 'name'
		}, {
			text : "查询",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});
};

// 查询
function searchlist() {
	var province = Ext.getCmp("comboProvinces").getValue();
	var city = Ext.getCmp("comboCities").getValue();
	var year = Ext.getCmp("year").getValue();
	var itemType = Ext.getCmp("itemType").getValue();
	var name = Ext.getCmp("name").getValue();

	var content = "";
	if (province && province != "全部省份") {
		content += "province~" + province + ";";
	}
	if (city && city != "全部城市") {
		content += "city~" + city + ";";
	}
	if (year && year != "所有") {
		content += "year~" + year + ";";
	}
	if (itemType && itemType != "所有") {
		content += "itemType~" + itemType + ";";
	}
	if (name && name != "") {
		content += "name~" + name + ";";
	}
	ds_info.baseParams["content"] = content;
	ds_info.load();
};

// 添加套餐
function addOrdersItem() {
	window.parent.createNewWidget("ordersItem_add", '添加套餐',
			'/module/orders/ordersItem_add.jsp');
}

// 修改套餐
function updateOrdersItem() {
	var rows = grid_info.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var id = rows.data.id;

	window.parent.createNewWidget("ordersItem_edit", '修改套餐',
			'/module/orders/ordersItem_edit.jsp?id=' + id);
}

function standardOrdersItem() {
	window.parent.createNewWidget("standardOrdersItem_list", '标准套餐管理套餐',
			'/module/orders/standardOrdersItem_list.jsp');
}
function delOrdersItem() {
	var rows = grid_info.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}

	var id = rows.data.id;

	Ext.Msg.confirm("确认操作", "您确认要删除吗?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", "/mc/OrdersItemServlet.do?type=6&id="
					+ id + "&status=2", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.Msg.alert("提示", "删除成功");
						ds_info.load();
					}
				}
			});
		}
	});
}
