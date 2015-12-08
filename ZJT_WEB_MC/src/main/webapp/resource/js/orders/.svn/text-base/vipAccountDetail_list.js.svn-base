var ds, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet, upload_form;
var win_orders;

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
		}, [ "id", "code", "memberId", "floatAmount", "accountBalance", "note",
				"status", "type", "createOn", "createBy","eid" ]),
		baseParams : {
			type : 19,
			pageSize : pageSize,
			pageNo : 1
		},
		countUrl : '/mc/order/RechargeOrderServlet.do',
		countParams : {
			type : 20
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
		tbar : [ /*{
			text : '对账',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/book_open.png',
			handler : moneyHandle,
			hidden : compareAuth("ORDERS_DETAIL")
		}, "-", {
			text : '账户明细',
			icon : "/resource/images/book_edit.png",
			handler : showAccountDetail,
			hidden : compareAuth("ORDERS_EDIT")
		} */],

		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '流水号',
			sortable : true,
			dataIndex : 'code'
		}, {
			header : '创建时间',
			sortable : true,
			dataIndex : 'createOn'
		}, {
			header : '企业ID',
			sortable : false,
			dataIndex : 'eid'
		}, {
			header : '名称',
			sortable : false,
			dataIndex : 'note'
		}, {
			width : 120,
			header : '收入(元)',
			sortable : false,
			dataIndex : 'floatAmount',
			renderer : showIncome
		}, {
			header : '支出(元)',
			sortable : false,
			dataIndex : 'floatAmount',
			renderer : showCost
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
		// showAccountDetail();
	});

	function showIncome(value, p, record) {
		var type = record.data.type; // (0-充值，1-支付(购买套餐)...)
		var floatAmount = record.data.floatAmount;
		if (floatAmount == null || "" == floatAmount) {
			return "";
		}
		if ("0" == type) {
			return floatAmount;
		}
		return "";
	}
	
	function showCost(value, p, record) {
		var type = record.data.type; // (0-充值，1-支付(购买套餐)...)
		var floatAmount = record.data.floatAmount;
		if (floatAmount == null || "" == floatAmount) {
			return "";
		}
		if ("1" == type || "2" == type) {
			return "-" + floatAmount;
		}
		return "";
	}

	// 默认第一次打开的时候加载数据
	ds.load();

	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [ {
			xtype : "label",
			text : "企业ID："
		}, {
			xtype : "textfield",
			textLabel : "查询条件",
			id : "eidVal",
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

// 查询
function searchlist() {
	var eidVal = Ext.getCmp("eidVal").getValue();
	var content = "vipspace.tVipAccountDetail.eid~" + eidVal;
	ds.baseParams["content"] = content;
	ds.load();
};
