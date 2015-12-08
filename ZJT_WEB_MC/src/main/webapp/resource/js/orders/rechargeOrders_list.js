var ds, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, upload_form;
var win_orders;

// 订单状态
var orderStatusData = [ [ '', '全部状态' ], [ '1', '充值成功' ], [ '0', '未付款' ], [ '2', '订单取消' ], [ '3', '7天未付款' ],[ '-1', '已删除' ]];
// 查询条件
var searchDiyArr = [ [ 'tRechargeOrders.code', '订单编号' ],
		[ 'tRechargeOrders.memberId', '会员帐号' ], [ 'tMember.trueName', '联系人' ] ];

// 初始化界面
Ext.onReady(function() {
	buildGirid();
});

// 生成列表
function buildGirid() {

	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/order/RechargeOrderServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		}, [ "id", "code", "memberId", "money", "orderStatus", "status",
				"createOn", "createBy", "paymentOn", "trueName", "corpName" ]),
		baseParams : {
			type : 1,
			pageSize : pageSize,
			pageNo : 1
		},
		countUrl : '/mc/order/RechargeOrderServlet.do',
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
		tbar : [{
			text : '个人充值订单',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("rechargeOrders_list", '个人充值订单',
				'/module/orders/rechargeOrders_list.jsp');
			}
		},{
			text : '企业充值订单',
			icon : "/resource/images/map.png",
			hidden : compareAuth('VIP_EP_RECHARGE_DETAIL'),
			handler : function() {
				window.parent.createNewWidget("vipRechargeOrders_list", '企业充值订单',
				'/module/orders/vipRechargeOrders_list.jsp');
			}
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
			sortable : true,
			dataIndex : 'code',
			renderer : function(value, p, record) {
				var code = record.get("code");
				var status = record.get("status");
				if ("1" == status){
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
				if ("1" == status){
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
				if ("1" == status){
					return "<font color='red'>" + corpName + "</font>";
				}
				return corpName;
			}
		}, {
			header : '联系人',
			sortable : false,
			dataIndex : 'trueName',
			renderer : function(value, p, record) {
				var trueName = record.get("trueName");
				var status = record.get("status");
				if ("1" == status){
					return "<font color='red'>" + trueName + "</font>";
				}
				return trueName;
			}
		}, {
			width : 120,
			header : '充值金额(元)',
			sortable : true,
			dataIndex : 'money',
			renderer : function(value, p, record) {
				var money = record.get("money");
				var status = record.get("status");
				if ("1" == status){
					return "<font color='red'>" + money + "</font>";
				}
				return money;
			}
		}, {
			header : '下单时间',
			sortable : true,
			dataIndex : 'createOn',
			renderer : function(value, p, record) {
				var createOn = record.get("createOn");
				var status = record.get("status");
				if ("1" == status){
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
				if ("1" == status){
					return "<font color='red'>" + paymentOn + "</font>";
				}
				return paymentOn;
			}
		}, {
			header : '订单状态',
			sortable : false,
			dataIndex : 'orderStatus',
			renderer : orderStatus
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
		//showAccountDetail();
	});

	function orderStatus(value, p, record) {
		var orderStatus = record.data.orderStatus;
		var status = record.data.status;
		var returnVal = "未付款";
		if ("1" == orderStatus) {
			returnVal = "充值成功";
		}else if ("2" == orderStatus){
			returnVal = "订单取消";
		}else if ("3" == orderStatus){
			returnVal = "7天未付款";
		}
		if ("1" == status){
			return "<font color='red'>" + returnVal + "</font>";
		}
		return returnVal;
	}

	// 默认第一次打开的时候加载数据
	ds.load();
	
	var tbar1 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [ {
			text : '对账',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/book_open.png',
			handler : moneyHandle,
			hidden : compareAuth("RECHARGE_RECONCILIATION")
		}, "-", {
			text : '账户明细',
			icon : "/resource/images/book_edit.png",
			handler : showAccountDetail,
			hidden : compareAuth("RECHARGE_ACCOUNTDETAIL")
		} ]
	});

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
			value : 'tRechargeOrders.code'
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
		Info_Tip("请选择一条充值订单进行操作！");
		return false;
	}
	// 获取选中的充值记录
	var row = grid_info.getSelectionModel().getSelected();
	code = row.get("code");
	var orderStatus = row.get("orderStatus");
	currOrderStatus = orderStatus;
	//if ("1" == orderStatus){
		//Info_Tip("充值订单号为：" + code + "已付款成功，无需进行对账！");
		//return false;
	//}
	if ("2" == orderStatus || "3" == orderStatus){
		Info_Tip("充值订单号为：" + code + "已被取消，无法进行对账！");
		return false;
	}

	mask = new Ext.LoadMask(Ext.getBody(), {
		msg : '正在对账中...',
		disabled : false,
		store : loadStore
	});
	//mask.show();

	var url = "/mc/order/RechargeOrderServlet.do";
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
	var msgStr = "充值订单号为： " + code + " 的充值订单" + msg;
	if (msg == "已付款成功") {
		//如果充值订单状态不为1-付款成功，则更新订单状态
		if (!"1" == currOrderStatus){
			//更新订单状态
			var url = "/mc/order/RechargeOrderServlet.do";
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
	var searchDiyName = Ext.getCmp("searchDiyArr").getValue();
	var searchDiyVal = Ext.getCmp("searchDiyVal").getValue();
	var content = "tRechargeOrders.orderStatus~" + orderStatusVal + ";"
			+ searchDiyName + "~" + searchDiyVal + ";tRechargeOrders.status~" + orderStatus;
	ds.baseParams["content"] = content;
	ds.load();
};

// 账户明细
function showAccountDetail() {
	window.parent.createNewWidget("accountDetail_list", '查看详细',
			'/module/orders/accountDetail_list.jsp');
}
