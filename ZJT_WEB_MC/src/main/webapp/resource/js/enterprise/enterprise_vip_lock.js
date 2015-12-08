Ext.onReady(init);
var grid, ds;
var pageSize = 20;

function init() {
	buildGrid();
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : [ {
		id : 'rMenu1',
		text : '解锁',
		hidden : compareAuth('VIP_EP_UNLOCK'),
		handler : epVipUnLock
	}, {
		id : 'rMenu2',
		text : '彻底删除',
		hidden : compareAuth('VIP_EP_DEL'),
		handler : delVipEp
	} ]
});

function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/vip/VipEpAccountServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "eid", "ename", "degree", "isLock", "createOn", "createBy",
				"updateOn", "updateBy", "beginDate", "endDate", "askCount",
				"totalAskCount", "materialCount", "residueMaterialCount",
				"collectMaterialCount", "facCount", "residueFacCount",
				"collectFacCount", "memberCount", "residueAskCount",
				"uploadMaterialCount", "uploadFacCount", "notes" ]),
		baseParams : {
			type : 1,
			page : 1,
			content : "isLock~1",
			pageSize : pageSize
		},
		countUrl : '/mc/vip/VipEpAccountServlet.do',
		countParams : {
			type : 2,
			content : "isLock~1"
		},
		remoteSort : true
	});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true,
		pageSize : pageSize
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	grid = new Ext.grid.EditorGridPanel({
		store : ds,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoHeight : true,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '企业ID',
			sortable : true,
			width : 100,
			dataIndex : 'eid'
		}, {
			header : '名称',
			sortable : false,
			width : 240,
			dataIndex : 'ename'
		}, {
			header : '创建时间',
			sortable : true,
			dataIndex : 'createOn'
		}, {
			header : '更新人',
			sortable : false,
			dataIndex : 'updateBy'
		}, {
			header : '更新时间',
			sortable : true,
			dataIndex : 'updateOn'
		} ],
		tbar : [ {
			text : "解锁",
			hidden : compareAuth('CORP_UNLOCK'),
			icon : "/resource/images/lock_open.png",
			handler : epVipUnLock
		}, "-", {
			text : "彻底删除",
			hidden : compareAuth('CORP_DEL'),
			icon : "/resource/images/delete.gif",
			handler : delVipEp
		} ],
		bbar : pagetool,
		renderTo : 'grid'
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
			xtype : "label",
			text : "查询类型："
		}, {
			xtype : 'combo',
			id : 'queryName',
			store : [ [ "eid", "企业ID" ], [ "ename", "企业名称" ] ],
			triggerAction : 'all',
			readOnly : true,
			width : 90,
			value : "ename",
			listeners : {
				select : function(combo, record, index) {
					searchlist();
				}
			}
		}, "-", {
			xtype : "label",
			text : "关键字："
		}, {
			xtype : "textfield",
			id : "queryValue",
			fieldLabel : "关键字",
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, "-", {
			text : "查询",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		// showEnterpriseEditInfo();
	});
};

function searchlist() {
	var query = Ext.getCmp("queryName").getValue() + "~"
			+ Ext.getCmp("queryValue").getValue() + ";islock~1";
	ds.baseParams["content"] = query;
	ds.load();
}

/**
 * 解锁VIP企业
 */
function epVipUnLock() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length == 1) {
		Ext.MessageBox.confirm("确认操作", "您确定要解锁选中的VIP企业吗?", function(op) {
			if (op == "yes") {
				Ext.Ajax
						.request({
							url : "/mc/vip/VipEpAccountServlet.do",
							params : {
								type : 5,
								ids : ids,
								isLock : "0"
							},
							success : function(response) {
								var json = eval("(" + response.responseText
										+ ")");
								if (getState(json.state, commonResultFunc,
										json.result)) {
									Info_Tip("解锁成功。");
									ds.load();
								}
							},
							failure : function() {
								Warn_Tip();
							}
						});
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请至少选择一条VIP企业信息！");
	}
}

// 删除VIP企业
function delVipEp() {
	var sels = grid.getSelectionModel().getSelections();
	var mids = [];
	for ( var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("id"));
	}
	if (mids.length < 1) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "您确定要删除您选中的VIP企业吗?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", "/mc/vip/VipEpAccountServlet.do?type=6&isDel=1", {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("删除成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "ids=" + mids)
		}
	});
}