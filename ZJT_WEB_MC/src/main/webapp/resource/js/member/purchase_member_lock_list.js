var ds, grid, ck, pagetool, askds;
var ids = [];// 选择项
var selectinfo;
var webArea = "";
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu3',
						text : '打开',
						hidden : compareAuth('PURCHASE_MEM_VIEW'),
						handler : function() {
							showmemberinfo();
						}
					}, {
						id : 'rMenu1',
						text : '删除',
						hidden : compareAuth('PURCHASE_MEM_DELETE'),
						handler : function() {
							delmember();
						}
					}, {
						id : 'rMenu2',
						text : '解锁',
						hidden : compareAuth('PURCHASE_MEM_UNLOCK'),
						handler : function() {
							restoremember();
						}
					}]
		});
var buildGrid = function() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else {
		webArea = parent.currUser_mc.webProvince;
		if (webArea == "广东") {
			webArea = '中国';
		}
	}
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id", "memberID", "degree", "trueName", "corpName",
								"loginNum", "createOn", "validDate", "EID"]),
				baseParams : {
					method : 'searchPaged',
					degree : "10,13",
					isLock : 1,
					pageSize : 20,
					pageNo : 1,
					validDate : 0,
					province : webArea
				},
				countUrl : '/mc/Member.do',
				countParams : {
					//degree : "10,13",
					//isLock : 1,
					method : 'searchCount'
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	/*
	 * var sm = new Ext.grid.RowSelectionModel({ singleSelect : false });//
	 * 是否支持多行选择
	 */
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	grid = new xg.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : true,
							width : 50,
							dataIndex : 'memberID'
						}, {
							header : 'eid',
							sortable : false,
							dataIndex : 'EID',
							hidden : true
						}, {
							header : '会员等级',
							sortable : true,
							width : 50,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '会员名称',
							sortable : false,
							width : 70,
							dataIndex : 'trueName'
						}, {
							header : '公司名称',
							sortable : false,
							width : 200,
							dataIndex : "corpName"
						}, {
							header : '登陆次数',
							sortable : true,
							width : 30,
							dataIndex : 'loginNum'
						}, {
							header : '注册日期',
							sortable : true,
							width : 70,
							dataIndex : 'createOn'
						}, {
							header : '有效期限',
							sortable : true,
							width : 70,
							dataIndex : 'validDate'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [/*new Ext.form.ComboBox({
									store : getRegSite(),
									emptyText : "请选择",
									id : 'area_sel',
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									displayField : "text",
									allowBlank : false,
									value : '造价通',
									width : 80,
									listeners : {
										"select" : function(combo) {
//											debugger;
											ds.baseParams["site_sel"]=combo["lastSelectionText"];
											ds.reload();
										}
									}
								}),*/ {
							text : '打开',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('MEM_VIEW'),
							handler : function() {
								var rec = grid.getSelectionModel()
										.getSelected();
								showmemberinfo();
							}
						}, '-', {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							hidden : compareAuth('MEM_DEL'),
							handler : delmember
						}, "-", {
							text : '解锁',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/lock_open.png",
							hidden : compareAuth('MEM_UNLOCK'),
							handler : restoremember
						}, "->", {
							xtype : "label",
							text : "已锁定会员列表",
							style : "font-weight:bold;padding-right:10px;"
						}],
				bbar : pagetool,
				renderTo : 'member_adv_grid'
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {

				showmemberinfo();

			});

	ds.load();
};

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除会员窗口
var delmember = function() {
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert("提示", "请选择数据。");
		return;
	}
	if (rows.length > 1) {
		Ext.MessageBox.alert("提示", "操作不提供批量操作，请选择一条信息");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("memberID"));
	}
	Ext.Msg.confirm('会员删除', '您确定要删除所选中的会员?', function(btn, text) {
				if (btn == 'yes') {
					Ext.lib.Ajax.request("post", "/mc/Member.do", {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										alert("删除成功。");
										ds.reload();
										pagetool.updateInfo();
									}
								},
								failure : function(response) {
									Ext.MessageBox
											.alert("提示", "非常抱歉，您的操作发生错误。");
								}
							}, "method=delete&id=" + ids.toString());
				}
			});
};

// 还原会员
var restoremember = function() {
	var row = grid.getSelectionModel().getSelections();

	if (Ext.isEmpty(row)) {
		Ext.MessageBox.alert("提示", "请选择数据。");
	} else {
		var mids = [];
		for (var i = 0; i < row.length; i++) {
			mids.push(row[i].get("memberID"));
		}
		Ext.MessageBox.confirm("提示", "您确定要还原该会员吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/mc/Member.do", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("还原成功");
							ds.reload();
							pagetool.updateInfo();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				}, "method=unLock&mid=" + mids.toString());
			}
		});
	}
};

// 查看会员详细信息
function showmemberinfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Ext.MessageBox.alert("提示", "请选择数据。");
	} else {
		mid = row.get("memberID");
		window.parent.createNewWidget("purchase_member_info", '采购会员信息',
				'/module/member/purchase_member_info.jsp?id=' + mid);
	}
};
