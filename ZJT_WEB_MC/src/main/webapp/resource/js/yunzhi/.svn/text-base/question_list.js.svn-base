var url = "/yunzhi/QuestionServlet", grid_info, search_combo;
var search_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["qName", "问题名称"],["relateTopicNames","关联话题"],["memberId", "会员ID"],["nickname", "会员昵称"]]
});

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	getQuestionList();
};
var tbar = [{
			text : '查看/修改',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("YUNZHI_GUESTION_INFO"),
			handler : openQuestionInfo
		}, {
			text : '查看回答',
			icon : "/resource/images/application_double.png", 
			hidden : compareAuth("YUNZHI_ANSWER_LIST"),
			handler : openAnswerList
		},{
			text : '锁定的问题',
			icon : "/resource/images/application_double.png",
			hidden : compareAuth("YUNZHI_GUESTION_LIST_LOCK"),
			handler : openLockQuestionList
		}, {
			text : '锁定',
			icon : "/resource/images/lock_open.png",
			hidden : compareAuth("YUNZHI_GUESTION_LOCK"),
			handler : lockQuestion
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"qId"},{name:"qName"},{name:"relateTopicNames"},{name:"relateTopicIds"},{name:"qDesc"},{name:"createOn"},{name:"attentionCount"},{name:"answerCount"},{name:"memberId"},{name:"nickname"},{name:"degree"}]	
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
	dataIndex : "qId",
	singleSelect : true
});

function getQuestionList(){
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
					dataIndex : 'qId'
				}, {
					header : '问题名称',
					sortable : false,
					dataIndex : 'qName',
				}, {
					header : '关联话题',
					sortable : false,
					dataIndex : 'relateTopicNames'
				}, {
					header : '关注人数',
					sortable : false,
					dataIndex : 'attentionCount'
				}, {
					header : '回答数',
					sortable : false,
					dataIndex : 'answerCount',
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
					value : "qName",
					text : "问题名称",
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
//查看修改
function openQuestionInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选问题！");
		return;
	}
	window.parent.createNewWidget("question_info", '问题查看/修改', '/module/yunzhi/question_info.jsp?id=' + row.get("qId"));
}
//查看回答列表
function openAnswerList(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选问题！");
		return;
	}
	window.parent.createNewWidget("question_answer_list", '查看回答', '/module/yunzhi/answer_list.jsp?id=' + row.get("qId"));
}
//锁定的问题
function openLockQuestionList(){
	window.parent.createNewWidget("question_list_lock", '锁定的问题', '/module/yunzhi/question_list_lock.jsp');
}
//锁定
function lockQuestion(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选问题！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 8,
			qId : row.get("qId")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("操作成功!");
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

