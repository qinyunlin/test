var url = "/mc/appMember.do", grid_info, ds_info;
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();

};

// 右键菜单
var tbar = [{
			text : '打开',
			icon : "/resource/images/book_open.png",
//			hidden : compareAuth("MEM_VIEW"),
			handler : openAppMember
		}, {
			text : '删除',
			icon : "/resource/images/delete.gif", 
//			hidden : compareAuth("MEM_LOCK"),
			handler : delAppMember
		}, {
			text : '解锁',
			icon : "/resource/images/lock_open.png",
//			hidden : compareAuth("MEM_RENEW"),
			handler : unlockAppMember
		}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : url
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"memberId"},{name:"mobile"},{name:"nickName"},{name:"corpName"},{name:"loginNum",type:'int'},{name:"createOn"}]	
						}),
				baseParams : {
					type : 4,
					pageNo : 1,
					pageSize : 20
				},
				countUrl : '/mc/appMember.do',
				countParams : {
					type : 5
				},
				remoteSort : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "memberId",
				singleSelect : true
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
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '手机号',
							sortable : false,
							dataIndex : 'mobile'
						}, {
							header : '会员昵称',
							sortable : false,
							dataIndex : 'nickname'
						}, {
							header : '公司名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : "登录次数",
							sortable : true,
							width : 70,
							dataIndex : "loginNum"
						},{
							header : "注册日期",
							sortable : true,
							dataIndex : "createOn"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});

	ds_info.load();
};


//打开
function openAppMember(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	window.parent.createNewWidget("member_app_info", "APP会员信息","/module/member/member_app_info.jsp?memberId=" + row.get("memberId"));
}
//解锁
function unlockAppMember(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	Ext.Msg.confirm("提示", "确定对该用户解除锁定吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 3,
					content : "isLock~0;memberId~"+row.get("memberId")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)){
						Info_Tip("操作成功!");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}
//T币明细
function delAppMember(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条！");
		return;
	}
	Ext.Msg.confirm("提示", "确定删除该用户吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 6,
					memberId : row.get("memberId")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)){
						Info_Tip("操作成功!");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}