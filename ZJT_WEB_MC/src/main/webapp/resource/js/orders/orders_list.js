var ds, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, upload_form;
var win_orders;var loadMarsk;

// 套餐类型
var customStateData = [ [ '', '所有' ], [ '1', '推广会员' ], [ '2', 'A套餐' ],
		[ '3', 'B套餐' ], [ '4', 'C套餐' ] ];
// 订单状态
var ordersStatusData = [ [ '', '所有' ], [ '2', '已付款' ], [ '1', '未付款' ],
		[ '3', '已取消' ], [ '5', '自动取消' ] ];
// 开通状态
var openServiceData = [ [ '', '所有' ], [ '1', '已开通' ], [ '2', '未开通' ] ];
// 订单类型
var ordersTypeData = [ [ '', '所有' ], [ '1', '线下订单' ], [ '2', '线上订单' ], [ '3', '余额支付订单' ]  ];
// 关键字
var keyWordData = [ [ 'code', '订单编号' ], [ 'uid', '会员账号' ], [ 'eName', '企业名称' ],
		[ 'uName', '联系人' ] ];

var storeOrderGroupAndItems = new Ext.data.Store({
    autoLoad: true,
    url : '/ordersitem/group/OrderGroupServlet.do?type=10',
    reader: new Ext.data.JsonReader({
        root: 'result',
        fields: [
                { name: "value",mapping: "orderTypeAllName" },
                { name: "text",mapping: "orderTypeAllName" }
            ]
    })
});

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

// 添加线下订单方法
function orderAdd() {
	window.parent.createNewWidget("orders_add", '添加线下支付订单',
			'/module/orders/orders_add.jsp');
}

// 修改订单信息
function orderUpdate() {
	var rows = grid_info.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var id = rows.data.id;
	var code = rows.data.code;
	window.parent.createNewWidget("orders_edit", '修改支付订单',
			'/module/orders/orders_edit.jsp?id=' + id + '&code=' + code);
}

// 生成列表
function buildGirid() {

	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/Order.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, [ "code", "id", "uid", "eName", "uName", "ordersItem",
				"priceAcount", "createOn", "auditOn", "ordersStatus",
				"sendInvoice", "openService", "type", "invoice","orderTypeAllName","timeLength"]),
		baseParams : {
			type : 1,
			pageSize : pageSize,
			pageNo : 1
		},
		countUrl : '/mc/Order.do',
		countParams : {
			type : 2
		},
		remoteSort : true
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
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
		store : ds,
		viewConfig : {
			forceFit : true
		},
		tbar : [ {
			text : '查看/开通审核',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/book_open.png',
			handler : showOrders,
			hidden : compareAuth("ORDERS_DETAIL")
		}, "-", {
			text : '修改',
			icon : "/resource/images/book_edit.png",
			handler : orderUpdate,
			hidden : compareAuth("ORDERS_EDIT")
		}, "-", {
			text : '发票处理',
			icon : "/resource/images/application_double.png",
			handler : invoiceHandle,
			hidden : compareAuth("ORDERS_INVOICE")
		}, "-", {
			text : '添加',
			icon : "/resource/images/add.gif",
			handler : orderAdd,
			hidden : compareAuth("ORDERS_ADD")
		}, {
			text : '对账',
			icon : "/resource/images/application_double.png",
			handler : moneyHandle,
			hidden : compareAuth("ORDERS_HANDLE")
		}, {
			text : '导入订单',
			icon : "/resource/images/application_double.png",
			handler : importOrders,
			hidden : compareAuth("ORDERS_IMPORT")
		} ],
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '订单编号',
			sortable : false,
			dataIndex : 'code',
			renderer : ordersCodeRen
		}, {
			header : '会员账号',
			sortable : false,
			dataIndex : 'uid'
		}, {
			header : '公司名称',
			sortable : false,
			dataIndex : 'eName'
		}, {
			header : '联系人',
			sortable : false,
			dataIndex : 'uName'
		}, {
			width : 120,
			header : '套餐类型',
			sortable : false,
			dataIndex : 'orderTypeAllName', //'ordersItemType',
			renderer : function(value, p, record){
				return record.data.orderTypeAllName + record.data.ordersItem;
			}
		}, {
			header : '支付金额(元)',
			sortable : false,
			dataIndex : 'priceAcount',
			renderer : priceAcountRen
		}, {
			width : 120,
			header : '下单时间',
			sortable : false,
			dataIndex : 'createOn',
		},/* {
			header : '开始时间',
			sortable : false,
			dataIndex : 'auditOn',
			renderer : trimDate
		},*/ {
			header : '购买时长',
			sortable : false,
			dataIndex : 'auditOn',
			renderer : function(value, p, record){
				var timeLength = record.get("timeLength");
				var type = record.get("type");
				if ("2" == type || "3" == type){
					return parseInt(timeLength) * 12 + "&nbsp;个月";
					//return timeLength + "年";
				}
				return timeLength + "&nbsp;个月";
			}
		}, {
			header : '订单状态',
			sortable : false,
			dataIndex : 'ordersStatus',
			renderer : ordersStatusRen
		}, {
			header : '开通状态',
			sortable : false,
			dataIndex : 'openService',
			renderer : openServiceRen
		}, {
			header : '发票状态',
			sortable : false,
			dataIndex : 'sendInvoice',
			renderer : sendInvoiceRen
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
		showOrders();
	});

	/*function ordersItemTypeRen(value, p, record) {
		var st = record.data.ordersItemType;
		var name = "";
		if ("1" == st) {
			name = "推广会员";
		} else if ("2" == st) {
			name = "A套餐";
		} else if ("3" == st) {
			name = "B套餐";
		} else if ("4" == st) {
			name = "C套餐";
		}
		return name;
	}
*/
	function priceAcountRen(value, p, record) {
		return "<span style='color:red;'>" + record.data.priceAcount
				+ "</span>";
	}
	function ordersStatusRen(value, p, record) {
		var st = record.data.ordersStatus;
		var stName = "";
		if (st == "1") {
			stName = "未付款";
		} else if (st == "2") {
			stName = "已付款";
		} else if (st == "3") {
			stName = "已取消";
		} else if (st == "5") {
			stName = "已取消(7天未付款)";
		}
		return stName;
	}
	function ordersCodeRen(value, p, record) {
		var code = record.data.code;
		var type = record.data['type'];
		var stName = "";
		if (type == "1") {
			stName = "<span style='color:red;'>" + code + "</span>";
		} else {
			stName = code;
		}
		return stName;
	}
	function openServiceRen(value, p, record) {
		var opens = record.data.openService;
		var stName = "";
		if (opens == "1") {
			stName = "已开通";
		} else if (opens == "2") {
			stName = "未开通";
		}
		return stName;
	}
	function sendInvoiceRen(value, p, record) {
		var opens = record.data.sendInvoice;
		var invoince = record.data.invoice;
		var stName = "";
		/*if (invoince == "1") {
			if (opens == "1") {
				stName = "已提供";
			} else {
				stName = "未处理";
			}
		} else {
			stName = "无提供";
		}
		return stName;*/
		if ("2" == invoince){
			stName = "无提供";
			return stName; 
		}
		stName = "";
		if ("1" == opens){
			stName = "已处理";
		}else{
			stName = "未处理";
		}
		return stName;
	}

	// 默认第一次打开的时候加载数据
	ds.load();

	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [/* {
			xtype : "label",
			text : "套餐类型："

		}, */{
			xtype : 'combo',
			//store : customStateData,
			store : storeOrderGroupAndItems,
			id : 'ordersItemTypeC',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			//width : 80,
			autoWidth: true,
			value : '所有套餐'
		}, "-",/* {
			xtype : "label",
			text : "订单状态："
		},*/ {
			xtype : 'combo',
			store : ordersStatusData,
			id : 'ordersStatusC',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 100,
			value : '所有订单状态'
		}, "-",/* {
			xtype : "label",
			text : "开通状态："
		},*/ {
			xtype : 'combo',
			store : openServiceData,
			id : 'openServiceC',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 100,
			value : '所有开通状态'
		}, "-", /*{
			xtype : "label",
			text : "订单类型："
		}, */{
			xtype : 'combo',
			store : ordersTypeData,
			id : 'ordersTypeC',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 100,
			value : '所有订单类型'
		}, "-", {
			xtype : 'combo',
			store : keyWordData,
			id : 'keyWordC',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 100,
			value : '订单编号'
		}, "&nbsp;", {
			xtype : "textfield",
			id : 'keyWordValC'
		}, {
			text : "查询",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});
};
var code = "";
var ordersStatus = "";
var openService = "";
var mask;
// 对账
function moneyHandle() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	var id = rows[0].data["id"];
	ordersStatus = rows[0].data["ordersStatus"];
	code = rows[0].data["code"];
	var ordersType = rows[0].data["type"];
	openService = rows[0].data["openService"];

	if (ordersType == "1") {
		Ext.MessageBox.alert("对账结果", "线下订单不支持此对账功能!");
		return;
	} else if (ordersType == "3"){
		Ext.MessageBox.alert("对账结果", "余额支付订单不支持此对账功能!");
		return;
	}
	/**
	 * mask = new Ext.LoadMask(Ext.getBody(), { msg : '正在对账中...', removeMask :
	 * true }); mask.show();
	 */
	// 请求网银在线判定是否支付成功
	Ext.Ajax
			.request({
				url : '/mc/Order.do',
				params : {
					type : 17,
					code : code
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						var v_url = "http://mc.zjtcn.com/module/orders/orders_compare_result.jsp";
						var v_oid = code;
						var v_mid = "20972310";
						var billNo_md5 = data.result.md5Search;
						var error = data.result.error;
						if (error != null && error != "" && error == "error") {
							Ext.MessageBox.alert("对账结果",
									"只能对一个月以内的订单，如需要请登录网银在线后台查看!");
							return;
						}
						$("#v_url").val(v_url);
						$("#v_oid").val(v_oid);
						$("#v_mid").val(v_mid);
						$("#billNo_md5").val(billNo_md5);
						document.forms["uploadform"].submit();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
}

// 导入订单
function importOrders() {
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [ {
				layout : 'form',
				bodyStyle : 'border:none;',
				items : [{
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				},
				{
					columnWidth : 0.5,
					layout : 'form',
					bodyStyle : 'border:none;',
					items : {
						bodyStyle : 'border:none;',
						html : "<a href='" + FileSite + "/doc/Orders.xls"
								+ "' >标准文档下载</a>"
					}
				} ]
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入订单',
		closeable : true,
		width : 600,
		height : 160,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : uploadFile
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

// 上传
function uploadFile() {
	
	  loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '上传开通会员订单处理中.....!',
	        disabled : false,
	        //store : store
	      });
	      loadMarsk.show();
	     
	uploadOrderFile();
};


function uploadOrderFile() {
	if (upload_form.getForm().isValid()) {
		
		upload_form.getForm().getEl().dom["accept-charset"] = "UTF-8";
		upload_form.getForm().getEl().dom["accept-charset"] = "UTF-8";
		upload_form.getForm().submit({
				    url : '/mc/Order.do?type=21',
					method:"post",
					//waitMsg : '上传文件中...',
					success : function(batch_up, o) {
						 
					},
					failure : function() {

					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
};


function getOrderResult(flag, msg) {
	if (flag) {
		
		priew();
	} else {
		Info_Tip(msg);
	}
};


function priew(){
	Ext.Ajax.request({url:'/mc/Order.do?type=22',
		method:'POST',
	success:function(response){
		var jsondata=eval("("+response.responseText+")");
		if(jsondata.result!=null && jsondata.result!=""){
			loadMarsk.hide();
			 resultException(jsondata.result);	
		}else{
			submitForm();
		}
			
	}
	});
}



function  resultException(mag){
	var excepMsg = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:80px;padding-left:0px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'center',
				items : [{
							xtype : 'textarea',
							//fieldLabel : "上传文件",
							width : 222,
							value:mag,
							style:"min-height:80px;border:none;background-image:url('');",
							allowBlank : false,
							autoHeight : true,

						}],
				buttons : [{
								text : '确定上传',
								handler : function() {
									win.close();
									submitForm();
						
								}
							},{
							text : '取消上传',
							handler : function() {
								win.close();
							}
						}]
			});
	var win = new Ext.Window({
				title : '温馨提示',
				closeAction : "close",
				width : 400,
				autoHeight : true,
				//bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [excepMsg]
			});
	win.show();
}


// 上传操作
function submitForm(append) {
	
	  Ext.Ajax.request({url:'/mc/Order.do?type=18',
			method:'POST',
		success:function(response){
			var jsondata=eval("("+response.responseText+")");
			if(getState(jsondata.state,commonResultFunc,jsondata.result)){
				if(jsondata.result!=null && jsondata.result !=""){
					getResult(jsondata.result);
				}else{
					loadMarsk.hide();
					Info_Tip("上传成功！");
					
					ds.reload();
					win.close();
				}
				
			}
		}
	  });

};

function getResult(msg) {
	loadMarsk.hide();
	var exceptionMsg = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'border:none;background-color:min-height:400px;',
		fileUpload : true,
		labelWidth : 60,
		buttonAlign : 'center',
		items : [{
					xtype : 'textarea',
					//fieldLabel : "上传文件",
					width : 380,
					value: msg,
					style:"min-height:300px;",
					allowBlank : false,
					autoHeight : true,

				}],
		buttons : [{
					text : '确定',
					handler : function() {
						win1.close();
					}
				}]
	});
	var win1 = new Ext.Window({
				title : '错误提示',
				closeAction : "close",
				width : 500,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [exceptionMsg]
			});
	win1.show();
 

};

function ordersCompareRe(msg) {
	var msgStr = "编号 " + code + " 的订单" + msg;
	if (msg == "已付款成功") {
		if (openService == "2") {
			Ext.Ajax.request({
				url : '/mc/Order.do',
				params : {
					type : 7,
					code : code
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						// mask.hide();
						Ext.MessageBox.alert("对账结果", msgStr + "，现已开通。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		} else {
			Ext.MessageBox.alert("对账结果", msgStr);
		}
	} else {
		// mask.hide();
		Ext.MessageBox.alert("对账结果", msgStr);
	}
}

// 查询
function searchlist() {
	var ordersItemType = Ext.getCmp("ordersItemTypeC").getValue();
	var ordersStatus = Ext.getCmp("ordersStatusC").getValue();
	var openService = Ext.getCmp("openServiceC").getValue();
	var ordersType = Ext.getCmp("ordersTypeC").getValue();
	var keyWord = Ext.getCmp("keyWordC").getValue();
	if (keyWord && keyWord == "订单编号") {
		keyWord = "code";
	}
	var keyWordVal = Ext.getCmp("keyWordValC").getValue();
	var content = "";
	if (ordersItemType && ordersItemType != "所有套餐") {
		//content += "ordersItemType~" + ordersItemType + ";";
		content += "concat(orderTypeAllName,ordersItem)~" + ordersItemType + ";";
	}
	if (ordersStatus && ordersStatus != "所有订单状态") {
		content += "ordersStatus~" + ordersStatus + ";";
	}
	if (ordersType && ordersType != "所有订单类型") {
		content += "type~" + ordersType + ";";
	}
	if (openService && openService != "所有开通状态") {
		content += "openService~" + openService + ";";
	}
	if (keyWordVal && keyWordVal != "") {
		content += keyWord + "~" + keyWordVal + ";";
	}

	ds.baseParams["content"] = content;
	ds.load();
};

// 发票处理
function invoiceHandle() {

	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	var id = rows[0].data["id"];

	Ext.Msg.confirm("确认操作", "确定提供发票?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/mc/Order.do',
				params : {
					type : 11,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						if ("nopay" == data.result) {
							Info_Tip("该订单未付款，不能处理发票。");
							return;
						} else if ("cancel" == data.result) {
							Info_Tip("该订单已取消，不能处理发票。");
							return;
						} else if ("sendInvoince" == data.result) {
							Info_Tip("该订单已提供发票，无需再处理发票。");
							return;
						} else if ("noInvoince" == data.result) {
							Info_Tip("该订单不需要提供发票。");
							return;
						} else {
							Info_Tip("该订单发票处理成功。");
							ds.reload();
						}
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}

// 查看
function showOrders() {

	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	var id = rows[0].data["id"];
	var code = rows[0].data["code"];
	openShowOrder(id, code);
}

// 显示查看面板
function openShowOrder(id, code) {
	window.parent.createNewWidget("orders_detail", '查看详细',
			'/module/orders/orders_detail.jsp?id=' + id + "&code=" + code);
}
