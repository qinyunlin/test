var url = "/yunzhi/AnswerServlet", grid_info, search_combo;
var questionId;
var search_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["content", "回答"],["memberId", "会员ID"],["nickname", "会员昵称"]]
});
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	if (!Ext.isEmpty(getCurArgs("questionId"))) {
		questionId = getCurArgs("questionId");
		getAnswerList();
	}
};
var tbar = [{
			text : '查看/修改',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("YUNZHI_ANSWER_INFO"),
			handler : openAnswerInfo
		}, {
			text : '解锁',
			icon : "/resource/images/application_double.png",
			hidden : compareAuth("YUNZHI_ANSWER_UNLOCK"),
			handler : unLockAnswer
		}, {
			text : '删除',
			icon : "/resource/images/lock_open.png",
			hidden : compareAuth("YUNZHI_ANSWER_DELETE"),
			handler : deleteAnswer
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"aid"},{name:"content"},{name:"approvalCount"},{name:"commentCount"},{name:"gratitudeCount"},{name:"favoriteCount"},{name:"memberId"},{name:"nickname"},{name:"degree"},{name:"createOn"}]	
			}),
	baseParams : {
		type : 3,
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 4
	},
	remoteSort : true
});
var pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "aid",
	singleSelect : true
});
//获取回答列表
function getAnswerList(){
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
				dataIndex : 'aid'
			}, {
				header : '回答',
				sortable : false,
				dataIndex : 'content',
			}, {
				header : '点赞数',
				sortable : false,
				dataIndex : 'approvalCount'
			}, {
				header : '评论数',
				sortable : false,
				dataIndex : 'commentCount',
			},{
				header : '收藏数',
				sortable : false,
				dataIndex : 'favoriteCount',
			},{
				header : '感谢数',
				sortable : false,
				dataIndex : 'gratitudeCount',
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
					value : "content",
					text : "回答",
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
	ds_info.baseParams["questionId"] = questionId;
	ds_info.load();
}
//查询
function searchValuelist(){
	var searchType = search_combo.getValue();
	var searchValue = Ext.fly("searchValue").getValue();
	ds_info.baseParams["content"] = searchType + "~" + searchValue;
	ds_info.load();
}
//查看、修改
function openAnswerInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选回答！");
		return;
	}
	window.parent.createNewWidget("answer_info", '回答查看/修改', '/module/yunzhi/answer_info.jsp?id=' + row.get("aid"));
}
//解锁回答
function unLockAnswer(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选回答！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 9,
			answerId : row.get("aid")
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
//删除回答
function deleteAnswer(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选回答！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 7,
			answerId : row.get("aid")
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

