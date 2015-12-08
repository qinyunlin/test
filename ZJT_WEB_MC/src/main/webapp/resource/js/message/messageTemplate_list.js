var grid_info, ds_info, ds_mem, area_win, fs, query_fs, win, sel_combo;
var area, area1, area2, area_grid, city_grid, areastore, citystore, highContent = {}, form_gov, win_gov;

var ds_temp;
var tree, root;

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();
};

ds_mem = new Ext.data.SimpleStore({
	fields : [ {
		name : 'value'
	}, {
		name : 'text'
	} ],
	data : info_type_combox
});

function buildGirid() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else {

		webArea = parent.currUser_mc.accessStie;
		if (webArea == "ALL") {
			webArea = '全部';
		}
	}
	ds_info = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/message/MessageServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			fields : [ {
				name : "id",
				type : 'int'
			}, {
				name : "title"
			}, {
				name : "triggerCondition"
			}, {
				name : "content"
			}, {
				name : "status"
			}, {
				name : "isLock"
			}, {
				name : "createOn"
			}, {
				name : "createBy"
			}, {
				name : "updateOn"
			}, {
				name : "updateBy"
			} ]
		}),
		baseParams : {
			type : 1,
			content : "status~0;isLock~0",
			pageNo : 1,
			pageSize : 20
		},
		countUrl : '/mc/message/MessageServlet.do',
		countParams : {
			type : 2,
			content : "status~0;isLock~0"
		},
		remoteSort : true
	});
	pagetool = new Ext.ux.PagingToolbar({
		store : ds_info,
		displayInfo : true
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : "id"
	});

	grid_info = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_info,
		sm : sm,
		columns : [
				new Ext.grid.RowNumberer({
					width : 30
				}),
				sm,
				{
					header : 'ID',
					sortable : true,
					hidden : true,
					width : 30,
					dataIndex : 'id'
				},
				{
					width : 300,
					header : '触发条件',
					sortable : false,
					dataIndex : 'triggerCondition',
					renderer : function(value, meta, record) {
						var triggerCondition = record.get("triggerCondition");
						if (triggerCondition != null && "" != triggerCondition) {
							return "<a title='" + triggerCondition
									+ "' style='text-decoration:none;' >"
									+ triggerCondition + "</a>";
						}
						return triggerCondition;
					}
				}, {
					header : "添加时间",
					sortable : true,
					dataIndex : "createOn"
				}, {
					header : "添加人",
					sortable : true,
					dataIndex : "createBy"
				}, {
					header : "修改时间",
					sortable : true,
					dataIndex : "updateOn"
				}, {
					header : "修改人",
					sortable : true,
					dataIndex : "updateBy"
				} ],
		viewConfig : {
			forceFit : true
		},
		tbar : [ {
			text : '添加模板',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/page_add.png',
			handler : addMessageTemplate,
			hidden : compareAuth('MESSAGETEMPLATE_ADD')
		}, "-", {
			text : '查看/修改',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth("MESSAGETEMPLATE_MOD"),
			handler : viewMessageTemplate
		}, "-", {
			text : '锁定模板',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/lock.png',
			hidden : compareAuth("MESSAGETEMPLATE_LOCK"),
			handler : lockMessageTemplate
		}, "-", {
			text : '锁定的模板',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("MESSAGETEMPLATE_VIEW_LOCKLIST"),
			handler : showLockMessageTemplateList
		}],
		bbar : pagetool,
		renderTo : "grid_list_info"
	});

	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
		viewMessageTemplate();
	});
};

// 查询
function searchlist() {
	ds_info.load();
};

function getSelected() {
	var rows = grid_info.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	return ids;
}

/**
 * 添加站内信模板
 */
function addMessageTemplate() {
	window.parent.createNewWidget("messageTemplate_add", '添加模板',
			'/module/message/messageTemplate_add.jsp');
}

/**
 * 查看/修改模板
 */
function viewMessageTemplate(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条模板。");
		return;
	}
	window.parent.createNewWidget("messageTemplate_edit", '查看/修改模板',
			'/module/message/messageTemplate_edit.jsp?listFlag=list&id=' + row.get("id"));
}

/**
 * 锁定模板
 */
function lockMessageTemplate(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条模板。");
		return;
	}
	Ext.Ajax
	.request({
		url : '/mc/message/MessageServlet.do',
		method : 'POST',
		params : {
			type : 5,
			content : "isLock~1",
			id : row.get("id")
		},
		success : function(response) {
			var json = eval("("
					+ response.responseText
					+ ")");
			if (getState(json.state,
					commonResultFunc,
					json.result)) {
				Ext.MessageBox.alert("提示", "成功锁定模板！");
				ds_info.load();
			} 
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

/**
 * 锁定的模板
 */
function showLockMessageTemplateList(){
	window.parent.createNewWidget("messageTemplate_lock_list", '锁定的模板',
			'/module/message/messageTemplate_lock_list.jsp');
}