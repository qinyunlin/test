var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, comboProvinces, comboCities;

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

// 生成列表
function buildGirid() {

	ds_info = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/ordersitem/group/OrderGroupServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, [ "id", "groupName", "orderItems", "isCurr", "createOn", "createBy",
				"updateOn", "updateBy" ]),
		baseParams : {
			type : 1,
			pageSize : pageSize,
			pageNo : 1

		},
		countUrl : '/ordersitem/group/OrderGroupServlet.do',
		countParams : {
			type : 2,
			countFlag : 'orderGroup'
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
			text : '添加新套餐组',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/add.gif',
			handler : addOrderGroup,
			hidden : compareAuth("ORDERGROUP_ADD") //compareAuth("ORDERSITEM_ADD")
		}, "-", {
			text : '管理套餐',
			icon : "/resource/images/book_edit.png",
			handler : manageOrderGroup,
			hidden : compareAuth("ORDERGROUP_VIEW_ORDERSITEM_LIST") //compareAuth("ORDERSITEM_EDIT")
		}, "-", {
			text : '设置为当前使用套餐组',
			icon : "/resource/images/book_edit.png",
			hidden : compareAuth("ORDERGROUP_SET_CURR"), //compareAuth("STANORDERSITEM_LIST"),
			handler : function() {
				if (isSelected()){
					var rec = grid_info.getSelectionModel().getSelected();
					if (isCurrOrderGroup(rec.data.isCurr)){
						setCurrentOrderGroup(rec.data.id);
					}
				}
			}
		}, "-", {
			text : '设置增购服务',
			icon : "/resource/images/book_edit.png",
			handler : openSetAddService,
			hidden : compareAuth("ORDERGROUP_ADD")
		}],
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : '套餐组名称',
			sortable : false,
			dataIndex : 'groupName',
			renderer:function(value,meta,record){
				var gName = record.get("groupName");
				var isCurr = record.get("isCurr");
				var currImg = "";
				if ("1" == isCurr){
					currImg = "<img src='/resource/images/curr_orderGroup.png' />";
				}
				return gName + "&nbsp;&nbsp;&nbsp;" + currImg;
			}
		}, {
			header : '包含套餐',
			sortable : false,
			dataIndex : 'orderItems',
			renderer : function(value,meta,record){
				var orderItems = record.get("orderItems");
				if (orderItems != null && "" != orderItems){
					orderItems = "<a style='text-decoration: none;' title='" + orderItems + "' >" + orderItems + "</a>";
				}
				return orderItems;
			}
		}, {
			header : '添加时间',
			sortable : true,
			dataIndex : 'createOn'
		}, {
			header : '添加人ID',
			sortable : false,
			dataIndex : 'createBy'
		}, {
			header : '更新时间',
			sortable : true,
			dataIndex : 'updateOn'
		}, {
			header : '更新人ID',
			sortable : false,
			dataIndex : 'updateBy'
		}  ],
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		bbar : pagetool,
		renderTo : "online_info"
	});

	// 行双击事件：管理套餐
	grid_info.on("rowdblclick", function(grid_info, rowIndex, r) {
		manageOrderGroup();
	});

	// 默认第一次打开的时候加载数据
	ds_info.load();
};

/**
 * 管理套餐
 */
function manageOrderGroup() {
	if (isSelected()){
		var row = grid_info.getSelectionModel().getSelected();
		window.parent.createNewWidget("orderGroup_OrdersItem_list", '管理套餐',
				'/module/orders/ordersItemGroup/orderGroup_OrdersItem_list.jsp?id=' + row.get("id") + "&groupName=" + row.get("groupName"));
	}
}

/**
 * 设置为当前使用套餐组
 * @param id 套餐组ID
 */
function setCurrentOrderGroup(id) {
	Ext.lib.Ajax
	.request(
			"post",
			"/ordersitem/group/OrderGroupServlet.do?type=4",
			{
				success : function(response) {
					var data = eval("("
							+ response.responseText
							+ ")");
					if (getState(data.state,
							commonResultFunc,
							data.result)) {
						Ext.MessageBox
								.alert(
										"提示",
										"成功设置该套餐组为当前使用套餐组！",
										reloadGrid);
					}
				}
			}, "orderGroupId=" + id);
}

/**
 * 重新加载列表
 */
function reloadGrid() {
	ds_info.reload();
}

/**
 * 添加套餐组
 */
function addOrderGroup() {

	Ext.MessageBox
			.show({
				title : '添加新套餐组',
				msg : "<span style='line-height:40px;'>组名：</span>"
						+ "<input type='text' id='groupName' name='groupName' value='' />",
				width : 250,
				prompt : false,
				// value : "请输入自定义理由!",
				buttons : {
					"ok" : "确定",
					"cancel" : "取消"
				},
				multiline : false,
				fn : function(btn, text) {
					if ("ok" == btn) {
						var groupName = document.getElementById("groupName").value;
						if (groupName == null || "" == groupName) {
							Ext.MessageBox.alert("提示", "请填入套餐组名称");
							return false;
						}
						Ext.lib.Ajax
								.request(
										"post",
										"/ordersitem/group/OrderGroupServlet.do?type=3",
										{
											success : function(response) {
												var data = eval("("
														+ response.responseText
														+ ")");
												if (getState(data.state,
														commonResultFunc,
														data.result)) {
													if ("1" == data.result){
														Ext.MessageBox
														.alert(
																"提示",
																"该套餐组已存在！请重新输入");
														return;
													}else{
														Ext.MessageBox
														.alert(
																"提示",
																"套餐组添加成功！",
																reloadGrid);
													}
												}
											}
										}, "groupName=" + groupName);
					}
				}
			});
}

/**
 * 是否当前使用套餐组
 * @param isCurr
 * @returns {Boolean}
 */
function isCurrOrderGroup(isCurr){
	if ("1" == isCurr){
		Ext.MessageBox.alert("提示", "已设置为当前使用套餐组，无需进行重复设置！");
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
		Ext.MessageBox.alert("提示", "请勾选一条套餐组！");
		return false;
	}
	return true;
}
//打开设置增购服务页
function openSetAddService(){
	if (isSelected()){
		var row = grid_info.getSelectionModel().getSelected();
		window.parent.createNewWidget("orderGroup_setAddService", '设置增购服务', '/module/orders/ordersItemGroup/orderGroup_setAddService.jsp?orderGroupId=' + row.get("id"));
	}
}
