var ds, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, upload_form;
var win_orders;

// 订单状态
var orderStatusData = [ [ '', '所有订单状态' ], [ '1', '付款成功' ], [ '0', '未付款' ], [ '2', '订单取消' ], [ '3', '7天未付款' ], [ '-1', '已删除' ] ];
// 订单类型
var orderTypeData = [ [ '', '所有订单类型' ],['2','线下订单'] , [ '0', '网银支付' ], [ '1', '余额支付' ]];
// 查询条件
var searchDiyArr = [ [ 'tScoreOrders.code', '订单编号' ],
		[ 'tScoreOrders.memberId', '会员帐号' ], [ 'tMember.corpName', '公司名称' ] ];

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

var bar = new Ext.Toolbar({
	renderTo : "title",
	items:[]
});0
// 生成列表
function buildGirid() {

	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/order/ScoreOrderServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, [ "id", "code", "memberId", "score", "money", "type", "orderStatus", "status",
				"createOn", "createBy", "updateOn", "updateBy", "paymentOn", "trueName", "corpName", "invoice", "sendInvoice","isAct" ]),
		baseParams : {
			type : 1,
			pageSize : pageSize,
			pageNo : 1
		},
		countUrl : '/mc/order/ScoreOrderServlet.do',
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
			text : '个人积分订单',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("scoreOrders_list", '个人积分订单',
				'/module/orders/scoreOrders_list.jsp');
			}
		},{
			text : '企业积分订单',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("scoreOrders_list_enterprise", '企业积分订单',
				'/module/orders/scoreOrders_list_enterprise.jsp');
			}
		}],
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '订单编号',
			sortable : true,
			dataIndex : 'code',
			renderer : function(value, p, record) {
				var code = record.get("code");
				var status = record.get("status");
				
				var type = record.get("type");
				if ("1" == status || "2" == type){
					return "<font color='red'>" + code + "</font>";
				}
				return code;
			}
		}, {
			header : '会员账号',
			sortable : false,
			dataIndex : 'memberId',
			renderer : function(value, p, record) {
				var memberId = record.get("memberId");
				var status = record.get("status");
				var type = record.get("type");
				if ("1" == status || "2" == type){
					return "<font color='red'>" + memberId + "</font>";
				}
				return memberId;
			}
		}, {
			header : '公司名称',
			sortable : false,
			dataIndex : 'corpName',
			renderer : function(value, p, record) {
				var corpName = record.get("corpName");
				var status = record.get("status");
				var type = record.get("type");
				if ("1" == status || "2" == type){
					return "<font color='red'>" + corpName + "</font>";
				}
				return corpName;
			}
		}, /*{
			header : '联系人',
			sortable : false,
			dataIndex : 'trueName'
		},*/{
			width : 120,
			header : '购买积分',
			sortable : true,
			dataIndex : 'score',
			renderer : function(value, p, record) {
				var score = record.get("score");
				var status = record.get("status");
				var type = record.get("type");
				if ("1" == status || "2" == type){
					return "<font color='red'>" + score + "</font>";
				}
				return score;
			}
		}, {
			width : 80,
			header : '支付金额(元)',
			sortable : true,
			dataIndex : 'money',
			renderer : function(value, p, record) {
				var money = record.get("money");
				var status = record.get("status");
				var isAct = record.get("isAct");
				
				var type = record.get("type");
				if ("1" == status || "2" == type){
					if("1"==isAct){
						return "<font color='red'>" + money + "</font><font color='red' style='font-size: 12px;font-weight: normal;'>活动折扣</font>";
					}
					return "<font color='red'>" + money + "</font>";
				}
				if("1"==isAct){
					return money+ "<font color='red'  style='font-size: 12px;font-weight: normal;'>活动折扣</font>";
				}
				return money;
			}
		},  {
			width : 80,
			header : '订单类型',
			sortable : true,
			dataIndex : 'type',
			renderer : orderType
		}, {
			header : '下单时间',
			sortable : true,
			dataIndex : 'createOn',
			renderer : function(value, p, record) {
				var createOn = record.get("createOn");
				var status = record.get("status");
				var type = record.get("type");
				if ("1" == status || "2" == type){
					return "<font color='red'>" + createOn + "</font>";
				}
				return createOn;
			}
		}, {
			width : 120,
			header : '付款时间',
			sortable : true,
			dataIndex : 'paymentOn',
			renderer : function(value, p, record) {
				var orderStatus = record.get("orderStatus");
				if ("1" != orderStatus) return "";
				var paymentOn = record.get("paymentOn");
				
				
				if (paymentOn == null || "null" == paymentOn){
					paymentOn = "";
				}

				var status = record.get("status");
				var type = record.get("type");
				if ("1" == status || "2" == type){
					return "<font color='red'>" + paymentOn + "</font>";
				}
				return paymentOn;
			}
		}, {
			header : '订单状态',
			sortable : false,
			dataIndex : 'orderStatus',
			renderer : orderStatus
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

	var tbar1 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
			text : '对账',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/book_open.png',
			handler : moneyHandle,
			hidden : compareAuth("RECHARGE_RECONCILIATION")
		}, "-", {
			text : '发票处理',
			icon : "/resource/images/application_double.png",
			handler : invoiceHandle,
			hidden : compareAuth("SCOREORDERS_INVOICE")
		},{
			text : '查看详情',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/book_open.png',
			handler : showOrders,
			hidden : compareAuth("SCOREORDERS_DETAIL")
		}, {
			text : '导入订单',
			icon : "/resource/images/application_double.png",
			handler : importOrders,
			hidden : compareAuth("SCOREORDERS_IMPORT")
		} /*, "-", {
			text : '账户明细',
			icon : "/resource/images/book_edit.png",
			handler : showAccountDetail,
			hidden : compareAuth("RECHARGE_ACCOUNTDETAIL")
		} */]
	});
	// 行双击事件
	grid_info.on("rowdblclick", function(grid_info, rowIndex, r) {
		//showAccountDetail();
		showOrders();
	});

	function orderStatus(value, p, record) {
		var orderStatus = record.data.orderStatus;
		var status = record.data.status;
		var returnVal = "未付款";
		if ("1" == orderStatus) {
			returnVal = "付款成功";
		}else if ("2" == orderStatus){
			returnVal = "订单取消";
		}else if ("3" == orderStatus){
			returnVal = "7天未付款";
		}
		var type = record.data.type;
		if ("1" == status || "2" == type){
			return "<font color='red'>" + returnVal + "</font>";
		}
		return returnVal;
	}
	
	function orderType(value, p, record) {
		var type = record.data.type;
		var orderStatus = record.data.orderStatus;
		var status = record.data.status;
		var returnVal = "";
		if ("0" == type){
			returnVal = "网银支付";
		}else if ("1" == type){
			returnVal = "余额支付";
		}else if ("2" == type){
			returnVal = "线下订单";
		}
		var type = record.data.type;
		if ("1" == status || "2" == type){
			return "<font color='red'>" + returnVal + "</font>";
		}
		return returnVal;
	}

	// 默认第一次打开的时候加载数据
	ds.load();

	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [ {
			xtype : 'combo',
			store : orderStatusData,
			id : 'orderStatusData',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			autoWidth : true,
			value : ''
		}, "-",{
			xtype : 'combo',
			store : orderTypeData,
			id : 'orderTypeData',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			autoWidth : true,
			value : ''
		}, "-", {
			xtype : 'combo',
			store : searchDiyArr,
			id : 'searchDiyArr',
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			readOnly : true,
			displayField : "text",
			width : 100,
			value : 'tScoreOrders.code'
		}, "-", {
			xtype : "textfield",
			textLabel : "查询条件",
			id : "searchDiyVal",
			width : 150,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, {
			text : "查询",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});
};

var code = "";
var mask;
var currOrderStatus = "0";

// 对账
function moneyHandle() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Info_Tip("请选择一条积分订单进行操作！");
		return false;
	}
	// 获取选中的充值记录
	var row = grid_info.getSelectionModel().getSelected();
	code = row.get("code");
	var orderType = row.get("type");
	if ("1" == orderType){
		Info_Tip("积分订单号为：" + code + "已用账户余额支付，无法进行对账！");
		return false;
	}
	var orderStatus = row.get("orderStatus");
	currOrderStatus = orderStatus;
	if ("2" == orderStatus || "3" == orderStatus){
		Info_Tip("积分订单号为：" + code + "已被取消，无法进行对账！");
		return false;
	}

	mask = new Ext.LoadMask(Ext.getBody(), {
		msg : '正在对账中...',
		disabled : false,
		store : loadStore
	});
	//mask.show();

	var url = "/mc/order/ScoreOrderServlet.do";
	// 请求网银在线判定是否支付成功
	var loadStore = Ext.Ajax
			.request({
				url : url,
				params : {
					type : 8,
					code : code
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						var v_url = "http://mc.zjtcn.com/module/orders/orders_compare_result.jsp";
						var v_oid = code;
						var v_mid = "20972310";
						var billNo_md5 = data.result.md5Search;
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

function ordersCompareRe(msg) {
	var msgStr = "积分订单号为： " + code + " 的订单" + msg;
	if (msg == "已付款成功") {
		//如果充值订单状态不为1-付款成功，则更新订单状态
		if (!"1" == currOrderStatus){
			//更新订单状态
			var url = "/mc/order/ScoreOrderServlet.do";
			var dataParam = {};
			dataParam["type"] = "9";
			dataParam["code"] = code;
			$.ajax({
				type : "post",
				url : url,
				data : dataParam,
				async : false,
				complete : function(json) {
					var data = eval("(" + json.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
					}
				}
			});
		}
		mask.hide();
		Ext.MessageBox.alert("对账结果", msgStr);
	} else {
		mask.hide();
		Ext.MessageBox.alert("对账结果", msgStr);
	}
	ds.reload();
}

// 查询
function searchlist() {
	var orderStatusVal = Ext.getCmp("orderStatusData").getValue();
	var orderStatus = "";
	if ("-1" == orderStatusVal){
		orderStatus = "1";
		orderStatusVal = "";
	}else if ("" != orderStatusVal){
		orderStatus = "0";
	}
	var orderTypeVal = Ext.getCmp("orderTypeData").getValue();
	var searchDiyName = Ext.getCmp("searchDiyArr").getValue();
	var searchDiyVal = Ext.getCmp("searchDiyVal").getValue();
	var content = "tScoreOrders.orderStatus~" + orderStatusVal + ";tScoreOrders.type~" + orderTypeVal + ";"
			+ searchDiyName + "~" + searchDiyVal + ";tScoreOrders.status~" + orderStatus;
	ds.baseParams["content"] = content;
	ds.load();
};

// 账户明细
function showAccountDetail() {
	window.parent.createNewWidget("accountDetail_list", '查看详细',
			'/module/orders/accountDetail_list.jsp');
}
//发票处理
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
	var orderStatus = rows[0].data["orderStatus"];
	if(orderStatus == "0" || orderStatus == "3"){
		Info_Tip("该会员未付款，不能提供！");
		return;
	}

	var id = rows[0].data["id"];

	Ext.Msg.confirm("确认操作", "确定将发票状态变更为已提供？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/mc/order/ScoreOrderServlet.do',
				params : {
					type : 16,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						if ("nopay" == data.result) {
							Info_Tip("该会员未付款，不能提供！");
							return;
						}else if ("sendInvoince" == data.result) {
							Info_Tip("该订单已提供发票，无需再处理发票！");
							return;
						} else if ("noInvoince" == data.result) {
							Info_Tip("该订单不需要提供发票！");
							return;
						} else {
							Info_Tip("操作成功！");
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
//查看
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
	window.parent.createNewWidget("scoreOrders_detail", '查看详细',
			'/module/orders/scoreOrders_detail.jsp?id=' + id + "&code=" + code);
}
function sendInvoiceRen(value, p, record) {
	var opens = record.data.sendInvoice;
	var invoince = record.data.invoice;
	
	var type = record.data.type;
	var status = record.data.status;
	
	var stName = "";
	if ("2" == invoince){
		
		stName = "无提供";
		if ("1" == status || "2" == type){
			return "<font color='red'>"+stName+"</font>";
		}
		return stName; 
	}
	stName = "";
	if ("1" == opens){
		stName = "已处理";
	}else{
		stName = "未处理";
	}
	if ("1" == status || "2" == type){

		return "<font color='red'>"+stName+"</font>";
	}
	return stName;
}


//导入订单
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
						html : "<a href='" + FileSite + "/doc/ScoreOrders.xls"
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
	    	msg : '上传积分订单处理中.....!',
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
				    url : '/mc/order/ScoreOrderServlet.do?type=19',
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
		
		submitForm();
	} else {
		Info_Tip(msg);
	}
};

// 上传操作
function submitForm(append) {
	
	  Ext.Ajax.request({url:'/mc/order/ScoreOrderServlet.do?type=20',
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
