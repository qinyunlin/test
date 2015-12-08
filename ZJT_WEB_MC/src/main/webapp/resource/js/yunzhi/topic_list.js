var url = "/yunzhi/TopicServlet", grid_info, search_combo;
var search_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["tname", "话题名称"],["memberId", "会员ID"],["nickname", "会员昵称"]]
});

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	getTopicList();
	
};
var tbar = [{
			text : '查看/修改',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("YUNZHI_TOPIC_INFO"),
			handler : openTopicInfo
		}, {
			text : '锁定的话题',
			icon : "/resource/images/application_double.png",
			hidden : compareAuth("YUNZHI_TOPIC_LIST_LOCK"),
			handler : openLockTopicList
		}, {
			text : '锁定',
			icon : "/resource/images/lock_open.png",
			hidden : compareAuth("YUNZHI_TOPIC_LOCK"),
			handler : lockTopic
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"topicId"},{name:"tname"},{name:"memberId"},{name:"nickname"},{name:"degree"},{name:"createOn"},{name:"attentionCount"},{name:"questionCount"}]	
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
var pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "topicId",
	singleSelect : true
});
//获取活动列表
function getTopicList(){
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
					header : '编码',
					sortable : false,
					dataIndex : 'topicId'
				}, {
					header : '话题名称',
					sortable : false,
					dataIndex : 'tname',
				}, {
					header : '关注人数',
					sortable : false,
					dataIndex : 'attentionCount'
				}, {
					header : '问题数',
					sortable : false,
					dataIndex : 'questionCount',
				},{
					header : '会员ID',
					sortable : false,
					dataIndex : 'memberId'
				},{
					header : "会员昵称",
					sortable : false,
					dataIndex:"nickname"
				},{
					header : "会员类型",
					sortable : false,
					dataIndex:"degree",
					renderer : showDegree
				},{
					header : "创建时间",
					sortable : false,
					dataIndex:"createOn",
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list"
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [
		         search_combo = new Ext.form.ComboBox({
					store : search_type,
					mode : "local",
					triggerAction : "all",
					valueField : "value",
					displayField : "text",
					value : "tname",
					text : "话题名称",
					width : 80
		
				}),{
					xtype : "textfield",
					id : "searchValue",
					width : 220,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchValuelist();
							}
						}
					}
				},'-', {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchValuelist
				}]
	});
	ds_info.load();
}
//查询
function searchValuelist(){
	var searchType = search_combo.getValue();
	var searchValue = Ext.fly("searchValue").getValue();
	ds_info.baseParams["content"] = searchType + "~" + searchValue + ";";
	ds_info.load();
}
//查看、修改
function openTopicInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选话题！");
		return;
	}
	window.parent.createNewWidget("topic_info", '话题查看/修改', '/module/yunzhi/topic_info.jsp?id=' + row.get("topicId"));
}
//锁定的话题
function openLockTopicList(){
	window.parent.createNewWidget("topic_list_lock", '锁定的话题', '/module/yunzhi/topic_list_lock.jsp');
}
//锁定
function lockTopic(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选话题！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type :8,
			topicId : row.get("topicId")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("锁定成功!");
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

