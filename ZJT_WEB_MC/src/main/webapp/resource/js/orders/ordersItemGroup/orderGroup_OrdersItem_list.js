var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, comboProvinces, comboCities;

var orderGroupId = getCurArgs("id");
var groupName = getCurArgs("groupName");

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

//window.aa = buildGirid();
// 生成列表
function buildGirid() {

	ds_info = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/ordersitem/group/OrderGroupServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, [ "id", "name", "price", "unit", "createOn", "createBy", "updateBy",
				"pid", "isOnLine","degree" ]),
		baseParams : {
			type : 5,
			pageSize : pageSize,
			pageNo : 1,
			orderGroupId : orderGroupId
		},
		countUrl : '/ordersitem/group/OrderGroupServlet.do',
		countParams : {
			type : 15,
			countFlag : 'ordersItem',
			orderGroupId : orderGroupId,
		},
		remoteSort : true
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds_info,
		displayInfo : true,
		pageSize : pageSize
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : "id",
		singleSelect : true
	});
	
	grid_info = new Ext.grid.EditorGridPanel(
			{
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : [ {
					text : groupName,
					cls : 'x-btn-text-icon',
					icon : '/resource/images/add.gif'
				} ],
				tbar : [ {
					text : '添加标准套餐',
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
					text : '设置为线上购买套餐',
					icon : "/resource/images/book_edit.png",
					hidden : compareAuth("ORDERSITEM_SET_ONLINE"),
					handler : function() {
						var rows = grid_info.getSelectionModel().getSelections();
						var ids = [];
						for (var i = 0; i < rows.length; i++) {
							if (rows[i].get("isOnLine") != "1"){
								ids.push(rows[i].get('id'));
							}
						}
						if (ids.length == 0){
							Ext.MessageBox.alert("提示", "请勾选套餐或者勾选未设置为线上购买的套餐！");
							return false;
						}
						setOrdersItemOnLine(ids, "1");
						/*if (isSelected()){
							var rec = grid_info.getSelectionModel().getSelected();
							if (isOnLine(rec.data.isOnLine)){
								setOrdersItemOnLine(rec.data.id);
							}
						}*/
					}
				}, "-", {
					text : '取消线上购买套餐',
					icon : "/resource/images/book_edit.png",
					hidden : compareAuth("ORDERSITEM_SET_ONLINE_CANCEL"), //compareAuth("ORDERSITEM_SET_ONLINE_CANCEL"),
					handler : function() {
						var rows = grid_info.getSelectionModel().getSelections();
						var ids = [];
						for (var i = 0; i < rows.length; i++) {
							if (rows[i].get("isOnLine") == "1"){
								ids.push(rows[i].get('id'));
							}
						}
						if (ids.length == 0){
							Ext.MessageBox.alert("提示", "请勾选套餐或者勾选已设置为线上购买的套餐！");
							return false;
						}
						setOrdersItemOnLine(ids, "0");
						/*if (isSelected()){
							var rec = grid_info.getSelectionModel().getSelected();
							if (isOnLine(rec.data.isOnLine)){
								setOrdersItemOnLine(rec.data.id);
							}
						}*/
					}
				}/*, "-", {
					text : '删除',
					icon : "/resource/images/delete.gif",
					handler : delStandardOrdersItem
				}*/ ],
				columns : [
						new Ext.grid.RowNumberer({
							width : 30
						}),
						sm,
						{
							header : '',
							width : 20,
							sortable : false,
							dataIndex : 'isOnLine',
							renderer : function(value, meta, record) {
								var isOnLine = record.get("isOnLine");
								if ("1" == isOnLine) {
									return "<img src='/resource/images/curr_orderGroup.png' />";
								}
								return "";
							}
						},{
							header : '会员类型',
							sortable : false,
							dataIndex : 'degree',
							renderer : showDegree
						},{
							header : '套餐名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '统一价格(元)',
							sortable : true,
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

	function areaRen(value, p, record) {
		return record.data.province + record.data.city;
	}

	// 默认第一次打开的时候加载数据
	ds_info.load();

	// 省份城市级联选择

};

// 添加标准套餐
function addOrdersItem() {
	window.parent.createNewWidget("orderGroup_OrdersItem_add", '添加套餐',
			'/module/orders/ordersItemGroup/orderGroup_OrdersItem_add.jsp?orderGroupId=' + orderGroupId);
}

// 修改标准套餐
function updateOrdersItem() {
	if (isSelected()){
		var row = grid_info.getSelectionModel().getSelected();
		window.parent.createNewWidget("orderGroup_OrdersItem_edit", '修改标准套餐',
				'/module/orders/ordersItemGroup/orderGroup_OrdersItem_edit.jsp?ordersItemId=' + row.get("id"));
	}
}

// 删除标准套餐
function delStandardOrdersItem() {
	var rows = grid_info.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var name = rows.data.name;

	Ext.Msg.confirm("确认操作", "您确认要删除吗?", function(op) {
		if (op == "yes") {
			var contents = "name~" + name + ";status~2";
			Ext.Ajax.request({
				url : '/mc/OrdersItemServlet.do',
				method : 'POST',
				params : {
					type : 9,
					content : contents
				},
				success : function(response) {
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

			/*
			 * Ext.lib.Ajax.request("post",
			 * "/mc/OrdersItemServlet.do?type=9&name=" + name + "&status=2", {
			 * success : function(response) { var jsondata = eval("(" +
			 * response.responseText + ")"); if (getState(jsondata.state,
			 * commonResultFunc, jsondata.result)) { Ext.Msg.alert("提示",
			 * "删除成功"); ds_info.reload(); } } });
			 */
		}
	});
	// TODO
}

/**
 *  设置/取消 线上购买套餐
 * @param ids 套餐ID集合
 * @param isOnLine 是否线上购买（1为是，0为否）
 */
function setOrdersItemOnLine(ids, isOnLine){
	Ext.lib.Ajax
	.request(
			"post",
			"/ordersitem/group/OrderGroupServlet.do?type=6",
			{
				success : function(response) {
					var data = eval("("
							+ response.responseText
							+ ")");
					if (getState(data.state,
							commonResultFunc,
							data.result)) {
						var msg = "成功设置可线上购买的套餐！";
						if ("0" == isOnLine){
							msg = "成功取消可线上购买的套餐！";
						}
						Ext.MessageBox
								.alert(
										"提示",
										msg,
										reloadGrid);
					}
				}
			}, "ordersItemIds=" + ids + "&isOnLine=" + isOnLine);

}

/**
 * 重新加载列表
 */
function reloadGrid() {
	ds_info.reload();
}

/**
 * 是否线上购买套餐
 * @param isOnLine
 * @returns {Boolean}
 */
function isOnLine(isOnLine){
	if ("1" == isOnLine){
		Ext.MessageBox.alert("提示", "已设置为线上购买套餐，无需进行重复设置！");
		return false;
	}
	return true;
}

/**
 * 是否选中
 * @returns {Boolean}
 */
function isSelected(){
	var rows = grid_info.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length != 1) {
		Ext.MessageBox.alert("提示", "请勾选一条套餐！");
		return false;
	}
	return true;
}
