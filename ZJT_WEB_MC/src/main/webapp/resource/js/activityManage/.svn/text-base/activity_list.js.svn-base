var url = "/mc/activityManageServlet.do", grid_info, addActivity_win, aid, activityJson = "";
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	getActivityList();

};
var tbar = [{
			text : '添加活动',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("ACTIVITY_MANAGE_ADD"),
			handler : function(){
				showAddActivity("add");
			}
		}, {
			text : '修改活动',
			icon : "/resource/images/edit.gif", 
			hidden : compareAuth("ACTIVITY_MANAGE_EDIT"),
			handler : showUpdateActivity
		},/*{
			text : '删除活动',
			icon : "/resource/images/delete.gif",
			//hidden : compareAuth("MEM_RENEW"),
			//handler : showKeep
		},*/{
			text : "查看礼品",
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("ACTIVITY_MANAGE_VIEW"),
			handler : openActivityGift
		},{
			text : '开放',
			icon : "/resource/images/drop-yes.gif",
			hidden : compareAuth("ACTIVITY_MANAGE_UPDATE_STATE"),
			handler : function(){
				updateActivityState(0);
			}
		}, {
			text : '关闭',
			icon : "/resource/images/cross.png",
			hidden : compareAuth("ACTIVITY_MANAGE_UPDATE_STATE"),
			handler : function(){
				updateActivityState(1);
			}
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id",type:'int'},{name:"title"},{name:"startTime"},{name:"endTime"},{name:"createBy"},{name:"createOn"},{name:"updateBy"},{name:"updateOn"},{name:"state", type:'int'}]	
			}),
	baseParams : {
		type : 1,
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
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
	dataIndex : "id",
	singleSelect : true
});
//获取活动列表
function getActivityList(){
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
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : '活动主题',
					sortable : false,
					dataIndex : 'title'
				}, {
					header : '开始时间',
					sortable : false,
					dataIndex : 'startTime',
					renderer:function(v,meta,record){
						return record.get("startTime").replace(/(-)/g, "-").slice(0, 10);
					}
				}, {
					header : '结束时间',
					sortable : false,
					dataIndex : 'endTime',
					renderer:function(v,meta,record){
						return record.get("endTime").replace(/(-)/g, "-").slice(0, 10);
					}
				}, {
					header : '创建人',
					sortable : false,
					dataIndex : 'createBy'
				}, {
					header : '创建日期',
					sortable : false,
					dataIndex : 'createOn'
				}, {
					header : '更新人',
					sortable : false,
					dataIndex : 'updateBy'
				}, {
					header : '更新日期',
					sortable : false,
					dataIndex : 'updateOn'
				},{
					header : "活动状态",
					sortable : false,
					dataIndex:"state",
					renderer:function(v,meta,record){
						var state = record.get("state");
						if(state == 0)
							return "<span style='color:red;'>打开</span>";
						return "关闭";
					}
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
					xtype : "label",
					text : "活动主题："
				}, {
					xtype : "textfield",
					textLabel : "活动主题",
					id : "searchtitle",
					width : 220,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchTitlelist();
							}
						}
					}
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchTitlelist
				}]
	});
	ds_info.load();
}
//显示添加活动弹出窗口
function showAddActivity(type){
	if(type == "add")
		activityJson = "";
	var fs = new Ext.form.FormPanel({
		labelAlign : 'left',
		labelWidth : 90,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : 250,
		layoutConfig : {
			columns : 1
		},
		bodyStyle : 'padding:6px',
		items : [{
			layout : 'form',
			bodyStyle : 'border:none;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "活动主题",
				id : "title",
				name : "title",
				maxLength : 50,
				allowBlank : false,
				value : activityJson == "" ? "" : activityJson.result["title"]
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;',
			items : {
				xtype : 'datefield',
				width : 200,
				fieldLabel : "开始时间",
				emptyText : '请选择',
				format : 'Y-m-d',
				id : "startTime",
				readOnly : false,
				allowBlank : false,
				value : activityJson == "" ? "" : (activityJson.result["startTime"] ? trimDate(activityJson.result["startTime"]) : "")
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;',
			items : {
				xtype : 'datefield',
				width : 200,
				fieldLabel : "结束时间",
				emptyText : '请选择',
				format : 'Y-m-d',
				id : "endTime",
				readOnly : false,
				allowBlank : false,
				value : activityJson == "" ? "" : (activityJson.result["endTime"] ? trimDate(activityJson.result["endTime"]) : "")
			}
		},{
			layout : 'form',
			bodyStyle : 'border:none;',
			items : {
				xtype : "textarea",
				width : 400,
				fieldLabel : "活动说明",
				id : "content",
				maxLength : 500,
				allowBlank : false,
				name : "content",
				value : activityJson == "" ? "" : activityJson.result["content"]
			}
		}]
	});
	addActivity_win = new Ext.Window({
		title : (type == "add" ? "添加" : "修改") + "活动",
		modal : true,
		width : 600,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs],
		buttons : [{
					text : type == "add" ? "添加" : "修改",
					handler : addOrUpdateActivity
				}, {
					text : '取消',
					handler : function() {
						addActivity_win.close();
					}
				}]
	});
	addActivity_win.show();
}
function showUpdateActivity(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	Ext.Ajax.request({
		url : url,
		params : {
			type : 10,
			aid : id
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				aid = jsondata.result["id"];
				activityJson = jsondata;
				showAddActivity("update");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//添加或修改活动
function addOrUpdateActivity(){
	var type = 11;
	var query = "";
	if(aid != null && aid != ""){
		type = 12;
		query += "id~" + aid +";";
	}
	var title = Ext.fly("title").getValue();
	if(title == ""){
		Ext.MessageBox.alert("提示", "活动主题不能为空。");
		return;
	}
	var startTime = Ext.fly("startTime").getValue();
	if(startTime == "" || startTime == "请选择"){
		Ext.MessageBox.alert("提示", "开始时间不能为空。");
		return;
	}
	var endTime = Ext.fly("endTime").getValue();
	if(endTime == "" || endTime == "请选择"){
		Ext.MessageBox.alert("提示", "结束时间不能为空。");
		return;
	}
	var content = Ext.fly("content").getValue();
	if(content == ""){
		Ext.MessageBox.alert("提示", "活动说明不能为空。");
		return;
	}
	query += "title~" + title + ";";
	query += "startTime~" + startTime + ";";
	query += "endTime~" + endTime + ";";
	query += "content~" + content;
	Ext.Ajax.request({
		url : url,
		params : {
			type : type,
			content : query
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				aid = "";
				Info_Tip("操作成功。");
				addActivity_win.close();
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//打开或关闭活动
function updateActivityState(state){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	Ext.Ajax.request({
		url : url,
		params : {
			type : 3,
			aid : id,
			state : state
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("修改成功。");
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//查询
function searchTitlelist(){
	var title = Ext.fly("searchtitle").getValue();
	ds_info.baseParams["content"] = "title~" + title;
	ds_info.countParams["content"] = "title~" + title;
	ds_info.load();
}
//查看礼品
function openActivityGift(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	window.parent.createNewWidget("activity_gift_list", '查看礼品', '/module/activityManage/activity_gift_list.jsp?aid=' + id + "&title=" +row.get("title") + "&state=" + row.get("state"));
}