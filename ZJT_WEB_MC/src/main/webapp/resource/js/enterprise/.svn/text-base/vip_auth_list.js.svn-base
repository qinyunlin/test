var grid_info, ds_info, ds_mem, area_win, fs, query_fs, win, sel_combo;
var area, area1, area2, area_grid, city_grid, areastore, citystore, highContent = {}, form_gov, win_gov;

var ds_temp;
var tree, root;
var email_grid;
var emailWin = null;
// 添加权限
var fs;
win;

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
// 右键菜单
var tbar = [ {
	text : '添加权限',
	icon : "/resource/images/book_open.png",
	hidden : compareAuth("VIP_AUTH_ADD"),
	handler : showAddAuth
}, {
	text : '删除权限',
	icon : '/resource/images/delete.gif',
	hidden : compareAuth("VIP_AUTH_DEL"),
	handler : delAuth
} ];

var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : tbar
});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/vip/EpVipServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			fields : [ {
				name : "id",
				type : 'int'
			}, {
				name : "code"
			}, {
				name : "name"
			}, {
				name : "desc"
			} ]
		}),
		baseParams : {
			type : 1,
			pageNo : 1,
			pageSize : 20
		},
		countUrl : '/mc/vip/EpVipServlet.do',
		countParams : {
			type : 2
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
		viewConfig : {
			forceFit : true
		},
		tbar : tbar,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			width : 50,
			header : '编号',
			sortable : false,
			dataIndex : 'code'
		}, {
			header : 'id',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			width : 80,
			header : '权限名称',
			sortable : true,
			dataIndex : 'name'
		}, {
			width : 300,
			header : '描述',
			sortable : true,
			dataIndex : 'desc'
		} ],
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});

	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
};

/**
 * 添加权限
 */
function showAddAuth() {
	fs = new Ext.form.FormPanel({
		autoWidth : true,
		height : 130,
		bodyStyle : 'padding:6px',
		labelWidth : 60,
		layout : 'form',
		items : [ {
			xtype : 'textfield',
			id : 'code_input',
			fieldLabel : '权限码',
			allowBlank : false,
			maxLength : 6
		}, {
			xtype : 'textfield',
			id : 'name_input',
			fieldLabel : '权限名称',
			allowBlank : false,
			maxLength : 48
		},/* {
			xtype : 'textfield',
			id : 'field_input',
			fieldLabel : '标识',
			allowBlank : false,
			maxLength : 48
		},*/ {
			xtype : 'textfield',
			id : 'desc_input',
			fieldLabel : '描述',
			maxLength : 400
		} ]
	});
	win = new Ext.Window({
		title : '添加权限',
		width : 360,
		autoHeight : true,
		modal : true,
		items : fs,
		buttonAlign : 'right',
		buttons : [ {
			text : '保存',
			handler : addAuth
		}, {
			text : '取消',
			handler : function() {
				win.close()
			}
		} ]
	});
	win.show();

}

//添加权限
function addAuth() {
	if (fs.getForm().isValid()) {
		var content = "code~" + fs.getForm().items.map["code_input"].getValue()
				+ ";name~" + fs.getForm().items.map["name_input"].getValue()
				+ ";desc~"
				+ fs.getForm().items.map["desc_input"].getValue();
		Ext.Ajax.request({
			url : '/mc/vip/EpVipServlet.do',
			params : {
				type : 3,
				content : content
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("保存成功。");
					win.close();
					ds_info.reload();
				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();
};

/**
 * 删除权限
 */
function delAuth() {
	var ids = getSelected();
	if (ids.length == 0) {
		Ext.MessageBox.alert("提示", "请勾选需要删除的权限！");
		return false;
	}
	Ext.MessageBox.show({
		title : '删除权限',
		msg : "确定要删除勾选的权限?",
		// width : 600,
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(btn, text) {
			if ("ok" == btn) {
				Ext.lib.Ajax.request("post", "/mc/vip/EpVipServlet.do?type=4",
						{
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									Ext.MessageBox.alert("提示", "删除权限成功！");
									ds_info.reload();
								}
							}
						}, "ids=" + ids);
			}
		}
	});
}

function getSelected() {
	var rows = grid_info.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	return ids;
}
