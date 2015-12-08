var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, comboProvinces, comboCities;

var province="",city="";

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

window.aa=buildGirid();
// 生成列表
function buildGirid() {

	ds_info = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/OrdersItemServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, ["id","name", "price", "unit",
				"createOn", "createBy", "updateBy"]),
		baseParams : {
			type : 1,
			pageSize : pageSize,
			pageNo : 1,
			standardOrders:1,
			content:"province~"+province+";city~"+city

		},
		countUrl : '/mc/OrdersItemServlet.do',
		countParams : {
			type : 2,
			standardOrders:1,
			content:"province~"+province+";city~"+city
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
			text : '添加标准套餐',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/add.gif',
			handler : addStandardOrdersItem
		}, "-", {
			text : '修改',
			icon : "/resource/images/book_edit.png",
			handler : updateStandardOrdersItem
		}, "-", {
			text : '删除',
			icon : "/resource/images/delete.gif",
			handler : delStandardOrdersItem
		} ],
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : '序号',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '套餐名称',
			sortable : false,
			dataIndex : 'name',
	
		}, {
			header : '统一价格(元)',
			sortable : false,
			dataIndex : 'price'
		}, {
			header : '单位',
			sortable : false,
			dataIndex : 'unit'
		}, {
			header : '添加时间',
			sortable : false,
			dataIndex : 'createOn',
			renderer : trimDate
		}, {
			header : '添加人ID',
			sortable : false,
			dataIndex : 'createBy'
		}, {
			header : '更新人ID',
			sortable : false,
			dataIndex : 'updateBy'
		}],
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		bbar : pagetool,
		renderTo : "online_info"
	});

	// 行双击事件
	grid_info.on("rowdblclick", function(grid_info, rowIndex, r) {
		selectOrdersItem();
	});

	function areaRen(value, p, record) {
		return record.data.province + record.data.city;
	}

	

	// 默认第一次打开的时候加载数据
	ds_info.load();

	// 省份城市级联选择
	

};


// 添加标准套餐
function addStandardOrdersItem() {
	window.parent.createNewWidget("standardOrdersItem_add", '添加套餐',
			'/module/orders/standardOrdersItem_add.jsp');
}

// 修改标准套餐
function updateStandardOrdersItem() {
	var rows = grid_info.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var name = rows.data.name;
	
	window.parent.createNewWidget("standardOrdersItem_edit", '修改标准套餐',
			'/module/orders/standardOrdersItem_edit.jsp?name=' + name);
}

//删除标准套餐
function delStandardOrdersItem() {
	var rows = grid_info.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var name = rows.data.name;

	Ext.Msg.confirm("确认操作", "您确认要删除吗?", function(op) {
		if (op == "yes") {
			var contents="name~"+name+";status~2";
			Ext.Ajax.request({
				url : '/mc/OrdersItemServlet.do',
				method:'POST',
				params:{
					type:9,
					content:contents
				},
				success:function(response){
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.Msg.alert("提示", "删除成功");
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});	
			
		/*	Ext.lib.Ajax.request("post", "/mc/OrdersItemServlet.do?type=9&name="
					+ name + "&status=2", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.Msg.alert("提示", "删除成功");
						ds_info.reload();
					}
				}
			});*/
		}
	});
	// TODO
}
