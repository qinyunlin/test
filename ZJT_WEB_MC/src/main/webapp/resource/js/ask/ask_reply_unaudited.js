var ds, grid, ck, pagetool, askds;
var ids = [];// 选择项
var selectinfo, window_note;
var isreplyType = {};
var curProvince = getUser_WenProvince_c().getAt(0).data.text;
var area_store = new Ext.data.SimpleStore({
	fields : [ 'value', 'text' ],
	data : eval("(" + getUserWeb() + ")")
});
var tempsite = cur_website.splice(0, 0, [ "ALL", "全部" ]);

var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];

// 右键菜单
var rightClick = new Ext.menu.Menu({
	shadow : false,
	id : 'rightClickCont',
	items : [ {
		id : 'rMenu2',
		text : '审核',
		hidden : compareAuth("ASK_REP_VIEW"),// compareAuth("ASK_VIEW"),
		handler : showaskinfo
	} ]
});
var buildGrid = function() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.accessStie.split(",")[0];
	} else
		webArea = parent.currUser_mc.accessStie;

	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/ask/AskPriceServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "pid", "corpName", "name", "spec", "memberID", "degree",
				"createOn", "revNum", "area", "addr", "province", "city","state" ]),
		baseParams : {
			type : 6,
			pageSize : 20,
			status : 0,
			province : curProvince
		},
		countUrl : '/ask/AskPriceServlet.do',
		countParams : {
			type : 7,
			status : 0
		},
		remoteSort : true
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});

	pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true

	});
	// var sm = new xg.CheckboxSelectionModel();// 带checkbox选择

	grid = new xg.GridPanel({
		store : ds,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoHeight : true,
		sm : sm,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : true,
			width : 30,
			dataIndex : 'id'
		}, {
			header : '名称',
			sortable : false,
			width : 100,
			dataIndex : 'name'
		}, {
			header : '型号规格',
			sortable : false,
			width : 200,
			dataIndex : 'spec'
		}, {
			header : '回复人',
			sortable : false,
			width : 80,
			dataIndex : 'memberID'
		}, {
			header : '回复日期',
			sortable : true,
			width : 100,
			dataIndex : 'createOn'
		}, {
			header : '报价地区',
			sortable : false,
			width : 100,
			dataIndex : 'addr',/*
								 * renderer:function(value,meta,record){ var
								 * province = record.get("province"); var city =
								 * record.get("city"); if(province == null){
								 * return ""; } return province + " " + city; }
								 */
		} ],
		viewConfig : {
			forceFit : true
		},
		tbar : [ {
			text : '审核',// '打开',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth("ASK_REP_VIEW"),// compareAuth("ASK_VIEW"),
			handler : function() {
				var rows = grid.getSelectionModel().getSelections();
				var ids = [];
				for ( var i = 0; i < rows.length; i++) {
					ids.push(rows[i].get('id'));
				}
				if (ids.length == 1) {
					var rec = grid.getSelectionModel().getSelected();
					showaskinfo(rec.data.id);
				} else {
					Ext.MessageBox.alert("提示", "请勾选一条询价！");
				}
			}
		} ],
		bbar : pagetool,
		renderTo : 'ask_grid'
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		var row = grid.getSelectionModel().getSelected();

		selectinfo = row.get("id");
		showaskinfo(selectinfo);

	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
			xtype : 'combo',
			id : 'province',
			store : pro,
			triggerAction : 'all',
			emptyText : '请选择省',
			readOnly : true,
			width : 90,
			listeners : {
				select : function(combo, record, index) {
					var province = combo.getValue();
					/*
					 * if(province == "全部省份") { city = ["全部城市"]; }else{ city =
					 * zhcn.getCity(province).concat();; city.unshift("全部城市"); }
					 * 
					 * Ext.getCmp('city').store.loadData(city);
					 * Ext.getCmp('city').setValue("全部城市");
					 * Ext.getCmp('city').enable();
					 */
				}
			}
		},
		/*
		 * { xtype : 'combo', id : 'city', store : city, triggerAction : 'all',
		 * emptyText : '请选择城市', readOnly : true, width : 120, disabled : true },
		 */"-", {
			xtype : "textfield",
			textLabel : "名称",
			id : "searchname",
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, /*
			 * "-", ck = new Ext.form.ComboBox({ emptyText : "请选择", mode :
			 * "local", triggerAction : "all", store : askDateRange, width :
			 * 100, value : '-1', readOnly : true, listeners : { "select" :
			 * function(combo) { isreplyType["name"] = combo.lastSelectionText;
			 * isreplyType["days"] = combo.getValue(); countTodayAsk();
			 * searchlist(); } } }),"-", { xtype : "label", text : "名称：" }, {
			 * xtype : "textfield", textLabel : "名称", id : "searchname",
			 * enableKeyEvents : true, listeners : { "keyup" : function(tf, e) {
			 * if (e.getKey() == e.ENTER) { searchlist(); } } } }, { xtype :
			 * 'label', text : '公司名称：' }, { xtype : "textfield", id :
			 * 'corpName', enableKeyEvents : true, listeners : { "keyup" :
			 * function(tf, e) { if (e.getKey() == e.ENTER) { searchlist(); } } } }, {
			 * xtype : "label", text : "发布人：" }, { xtype : "textfield",
			 * //textLabel : "发布人", id : "searchuser", enableKeyEvents : true,
			 * listeners : { "keyup" : function(tf, e) { if (e.getKey() ==
			 * e.ENTER) { searchlist(); } } } },
			 */{
			text : "查询",
			id : "search",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});
	// Ext.getCmp("area_sel").setValue(pro.getAt(0).data.value);
	ds.load();

	// debugger;
};

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

Ext.onReady(function() {
	init();
});

/*-----------------逻辑业务--------------*/
// 锁定询价
function lockask() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定锁定选中的信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskServlet",
						{
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									Info_Tip("锁定成功。");
									ids = [];
									ds.reload();
								}
							},
							failure : function(response) {
								Warn_Tip();
							}
						}, "type=21&id=" + ids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}

};
// 删除询价
function delAsk() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	var memberids = [];
	for ( var i = 0; i < rows.length; i++) {
		if (rows[i].get('revNum') > 0) {
			Ext.MessageBox.alert("提示", "不能删除已回复的询价。");
			return;
		}
		ids.push(rows[i].get('id'));
		memberids.push(rows[i].get('memberID'));
	}
	if (ids.length != memberids.length) {
		Ext.MessageBox.alert("提示", "选择的数据有误，请联系技术人员。");
		return;
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除询价并返还用户询价数吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskServlet",
						{
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									Info_Tip("操作成功。");
									ids = [];
									ds.reload();
								}
							},
							failure : function(response) {
								Warn_Tip();
							}
						}, "type=27&id=" + ids.toString() + "&memberid="
								+ memberids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}
}

// 查询信息
function searchlist() {
	// if (Ext.isEmpty(Ext.getCmp("area_sel").getValue())) {
	// Info_Tip("请选择区域。");
	// return;
	// }
	// ds.baseParams["province"] = Ext.getCmp("province").getValue();
	/*
	 * ds.baseParams["content"] = "name~" + Ext.fly("searchname").getValue() +
	 * ";memberID~" + Ext.fly("searchuser").getValue() + ";corpName~" +
	 * Ext.fly("corpName").getValue();
	 */
	// ds.baseParams["content"] = "name~" + Ext.fly("searchname").getValue();
	ds.baseParams["content"] = "tAskReply.name~"
			+ Ext.fly("searchname").getValue();
	var province = Ext.getCmp("province").getValue();
	// var city = Ext.getCmp("city").getValue();

	if (province != "全部省份") {
		// ds.baseParams["content"] += ";province~" + province;
		ds.baseParams["content"] += ";addr~" + province;
		/*
		 * if(city != "全部城市") { ds.baseParams["content"] += ";city~" + city; }
		 */
	}

	// ds.baseParams["isreply"] = ck.getValue();
	ds.load();
};

// 查看详细信息
function showaskinfo() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length == 1) {
		var row = grid.getSelectionModel().getSelected();
		/*
		 * if (Ext.isEmpty(row)) { Info_Tip("请选择一条信息。"); return; }
		 */
		window.parent.createNewWidget("ask_reply_toexamine", '审核回复',
				'/module/ask/ask_reply_toexamine.jsp?id=' + row.get("id")
						+ "&pid=" + row.get("pid") + "&province="
						+ row.get("province") + "&city=" + row.get("city") + "&currStatus=" + row.get("state"));
	} else {
		Ext.MessageBox.alert("提示", "请选择一条信息。");
	}
};

// 统计今天未回复询价数量
function countTodayAsk() {
	var temp = "未回复";
	if (isreplyType["days"] == undefined || isreplyType["days"] == null) {
		isreplyType["days"] = -1;
		isreplyType["name"] = "今天"
	} else {
		if (isreplyType["days"] == "")
			temp = "";
	}

	Ext.Ajax.request({
		url : '/ask/AskServlet',
		params : {
			type : 7,
			isLock : 0,
			isreply : isreplyType["days"],
			province : curProvince
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.TipSelf.msg('提示', isreplyType["name"]// + temp
						+ '询价数量：' + data.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

// 统计今天和所有未回复询价的数量
function CountTodayAndMore() {
	var today = "";
	var more = "";
	Ext.Ajax.request({
		url : '/ask/AskServlet',
		params : {
			type : 7,
			isreply : -1,
			isLock : 0,
			province : curProvince
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				today = data.result;
			}
			Ext.Ajax.request({
				url : '/ask/AskServlet',
				params : {
					type : 7,
					isreply : 0,
					isLock : 0,
					province : curProvince
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						more = data.result;
						Ext.TipSelf.msg('提示', '<p>今天未回复询价数量：' + today
								+ '</p><p>所有未回复询价数量：' + more + "</p>");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		},
		failure : function() {
			Warn_Tip();
		}
	});

};

function getReply() {
	var data;
	var id = Ext.getCmp("note_id").getValue();
	;
	var reply_text = "还未对该留言进行回复！";
	// 取得数据
	Ext.Ajax.request({
		url : '/AskMessageServlet',
		params : {
			type : 6,
			id : id,
			page : 1,
			pageNo : 1
		},
		success : function(response) {
			data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				if (data.result.length == 0) {
					Ext.getCmp("reply_text").setValue(reply_text);
				} else
					var length = data.result.length - 1;
				if (!Ext.isEmpty(data.result))
					Ext.getCmp("reply_text").setValue(
							data.result[length].content);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

// 生成弹出窗口
function seeReply() {
	var rows = grid.getSelectionModel().getSelected();
	var id;
	if (!rows) {
		Ext.MessageBox.alert("提示", "请选择信息。");
		return;
	}
	id = rows.get("id");
	// 取得数据
	Ext.Ajax.request({
		url : '/AskMessageServlet',
		params : {
			type : 7,
			sid : id,
			page : 1,
			pageNo : 1
		},
		success : function(response) {
			data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				if (data.result.length < 1) {
					Ext.MessageBox.alert("提示", "该询价没有留言！");
					return false;
				}
				Ext.getCmp("note_note").setValue(data.result[0].content);
				Ext.getCmp("note_phone").setValue(data.result[0].phone);
				Ext.getCmp("note_linkman").setValue(data.result[0].linkman);
				Ext.getCmp("note_id").setValue(data.result[0].id);
				window_note.show();
				getReply();
			} else {
				Ext.MessageBox.alert("提示", "获取数据失败！");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

	var form = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		layout : 'absolute',
		url : 'save-form.php',
		defaultType : 'textfield',

		items : [ {
			x : 0,
			y : 5,
			xtype : 'label',
			text : '联&nbsp;系&nbsp;人:'
		}, {
			id : 'note_linkman',
			readOnly : true,
			x : 60,
			y : 0,
			name : 'to',
			xtype : 'textfield',
			anchor : '100%' // anchor width by percentage
		}, {
			x : 0,
			y : 30,
			xtype : 'label',
			text : '联系电话:'
		}, {
			id : 'note_phone',
			readOnly : true,
			x : 60,
			y : 30,
			name : 'to',
			xtype : 'textfield',
			anchor : '100%' // anchor width by percentage
		}, {
			x : 0,
			y : 55,
			xtype : 'label',
			text : '留　　言:'
		}, {
			id : 'note_note',
			readOnly : true,
			x : 60,
			y : 55,
			name : 'to',
			xtype : 'textarea',
			height : 60,
			anchor : '100%' // anchor width by percentage
		}, {
			x : 0,
			y : 130,
			xtype : 'label',
			text : '回　　复:'
		}, {
			id : 'reply_text',
			x : 60,
			y : 130,
			height : 60,
			xtype : 'textarea',
			name : 'msg',
			anchor : '100%' // anchor width and height
		}, {
			id : "note_id",
			hidden : true
		} ]
	});

	window_note = new Ext.Window({
		title : '查看留言',
		width : 500,
		height : 300,
		minWidth : 300,
		minHeight : 200,
		layout : 'fit',
		modal : true,
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : form,

		buttons : [ {
			text : '提交',
			handler : function() {
				submitNoteReply();
			}
		}, {
			text : '取消',
			handler : function() {
				window_note.close();
				return false;
			}
		} ]
	});

};

function submitNoteReply() {
	var id = grid.getSelectionModel().getSelected().get('id');
	var mid = grid.getSelectionModel().getSelected().get('memberID');
	var pid = Ext.getCmp("note_id").getValue();
	var contents = Ext.getCmp("reply_text").getValue();
	if (Ext.isEmpty(contents) || contents == "还未对该留言进行回复！") {
		Info_Tip("没有任何内容可以提交！");
		return false;
	}
	var content = "linkman~" + Ext.getCmp("note_linkman").getValue()
			+ ";phone~" + Ext.getCmp("note_phone").getValue() + ";content~"
			+ contents;
	Ext.Ajax.request({
		url : '/AskMessageServlet',
		params : {
			type : 2,
			sid : id,
			content : content,
			// contents : contents,
			mid : mid,
			pid : pid
		},
		success : function(response) {
			data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.MessageBox.alert("提示", "提交成功！");
				window_note.close();

			} else {
				Ext.MessageBox.alert("提示", "回复失败！");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

// 创建循环任务对象
/*
 * var task = { run : CountTodayAndMore, interval : 1000 * 60 * 5 // 循环时间5分钟 };
 */

// 创建循环任务
/*
 * var taskRunner = new Ext.util.TaskRunner(); taskRunner.start(task);
 */

// 导出询价信息
function exportaskinfo() {

	var province = Ext.fly("province").getValue().trim();
	var city = Ext.fly("city").getValue().trim();
	var name = Ext.fly("searchname").getValue().trim();
	var memberID = Ext.fly("searchuser").getValue().trim();
	var isreply = ck.getValue();
	var corpName = Ext.getCmp("corpName").getValue().trim();

	if ((isreply && isreply == "1" || isreply == "") || (!isreply)) {
		Ext.MessageBox.alert("提示", "已回复询价不能导出！");
		return;
	}

	window.document.exportform.action = "/AskPriceExportServlet?isLock=0&name="
			+ name + "&memberID=" + memberID + "&corpName=" + corpName
			+ "&province=" + province + "&city~" + city + "&isreply=" + isreply;
	window.document.exportform.submit();
};

/**
 * 重新加载列表
 */
function dsReload(){
	ds.reload();
}
