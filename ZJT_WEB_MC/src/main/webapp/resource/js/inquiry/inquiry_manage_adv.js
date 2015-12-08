var ds, grid, ck, pagetool, reply_ds, reply_grid;
var ids = [];// 选择项
var selectinfo;
var win, fs;
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						text : '解锁',
						hidden : compareAuth('FDBCK_MOD'),
						handler : function() {
							showaskinfo('list');
						}
					}, {
						text : '删除',
						hidden : compareAuth('FDBCK_DEL'),
						handler : function() {
							delask('list');
						}
					}]
		});
var fd_store = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : '/inquiry/OpinionTypeServlet'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result'
					}, ['id', 'name']),
			baseParams : {
				type : 1
			},
			remoteSort : true
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/OpinionServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id",  "channel", "content", "linkman", "phone",
							"email", "createOn", "isAudit", "ipAddr","createBy","province","city","isReply"]),
				baseParams : {
					type : 10,
					page : 1,
					pageSize : 20,
					cid : '1',
					content : 'isLock~1'
				},
				countUrl : '/OpinionServlet.do',
				countParams : {
					type : 11
				},
				remoteSort : true
			});
	/*
	 * var sm = new Ext.grid.RowSelectionModel({ singleSelect : false });//
	 * 是否支持多行选择
	 */

	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	// var cs = new xg.CheckboxSelectionModel();// 带checkbox选择
	var sm = new Ext.grid.CheckboxSelectionModel();
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
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '内容',
							sortable : false,
							dataIndex : 'channel',
							width : parent.Ext.fly("tab_0802_iframe")
									.getWidth()
									* 0.6,
							renderer : renderContent
						}, {
							header : '联系人/联系电话/邮箱',
							dataIndex : 'linkman',
							sortable : true,
							width : parent.Ext.fly("tab_0802_iframe")
									.getWidth()
									* 0.2,
							renderer : renderLinkman

						}, {
							header : '状态',
							sortable : true,
							width : parent.Ext.fly("tab_0802_iframe")
									.getWidth()
									* 0.2,
							dataIndex : 'isAudit',
							renderer : renderisAudit
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '解锁',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock_open.png',
							hidden : compareAuth('FDBCK_UNLOCK'),
							handler : function() {
								unlock();
							}
						}, {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							hidden : compareAuth('FDBCK_DEL'),
							handler : function() {
								delask();
							}
						}],
				bbar : pagetool,
				renderTo : 'inquiry_grid',
				view : new Ext.ux.grid.BufferView({
							// custom row height
							rowHeight : 10,
							// render rows as they come into viewable area.
							scrollDelay : true
						})
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	
	ds.load();
	function renderContent(value, p, record) {
		var trimtext = new cycleTrim();
		var temp = trimtext.cycleTrim(record.data.content, 50);
		var province = record.data.province;
		if(province ==null){
			province="";
		}
		var city = record.data.city;
		if(city ==null){
		   city="";
		}
		trimtext.init();
		return String.format('<b>地区：</b>{0}<br><b>分类：</b>{1}<br/><b>详细描述：</b>{2}', province+" "+city, value, temp);;
	};
	function renderLinkman(value, p, record) {
		return String.format('<b>联系人：{0}</b><br/>联系电话：{1}<br/>邮箱：{2}',
				value == null ? "" : value, record.data.phone == null
						? ""
						: record.data.phone, record.data.email == null
						? ""
						: record.data.email);
	};
	function renderisAudit(value, p, record) {
		if(record.data.createBy=="游客"){
			return String.format('<b>发布时间：</b>{0}<br/><b>IP地址：</b>{1}<br/>',
					record.data.createOn.slice(0, 10),
					record.data.ipAddr == null ? "" : record.data.ipAddr	
		           );
		}else{
			return String.format('<b>发布时间：</b>{0}<br/><b>会员：</b>{1}<br/>',
					record.data.createOn.slice(0, 10),
					record.data.createBy== null ? "" : record.data.createBy	
		           );
		}
	}
};

function init() {
	buildGrid();
	Ext.TipSelf.msg('提示', '双击列表可查看回复信息。');
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除信息
function delask() {
	var rows = grid.getSelectionModel().getSelections();

					if (Ext.isEmpty(rows)) {
						Info_Tip("请选择信息。");
						return;
					}
	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					var ids = [];
					for (var i = 0; i < rows.length; i++) {
						ids.push(rows[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/OpinionServlet.do',
								params : {
									type : 2,
									id : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("删除成功。");

										ds.reload();

									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};

// 解锁信息
function unlock() {
	Ext.Msg.confirm("确认操作", "您确认要解锁选中的信息吗？", function(op) {
				if (op == "yes") {

					var rows = grid.getSelectionModel().getSelections();

					if (Ext.isEmpty(rows)) {
						Info_Tip("请选择信息。");
						return;
					}
					var ids = [];
					for (var i = 0; i < rows.length; i++) {
						ids.push(rows[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/OpinionServlet.do',
								params : {
									type : 8,
									id : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};
// 查询信息
function searchlist() {
	ds.baseParams["content"] = "content~" + Ext.fly('searchtitle').getValue()
			+';isLock~1';
	ds.load();
};




