var ds, grid, ck, pagetool, reply_ds, reply_grid,cur_user_id;
var ids = [];// 选择项
var selectinfo;
var win, fs;
/*var storeCurrSite=currSite;
storeCurrSite.unshift(["","所有"]);*/


var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("所有省");
var ReplyType=[[-1,'所有回复状态'],[0,'未回复'],[1,'已回复']];



// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{

						text : '添加回复',
						hidden : compareAuth('FDBCK_ADDREPLY'),
						handler : addReply
					}/*, {

						text : '审核通过',
						hidden : compareAuth('FDBCK_MOD'),
						handler : function() {
							passop("list");
						}
					}*/, {
						text : '修改/查看回复',
						hidden : compareAuth('FDBCK_MOD'),
						handler : function() {
							showaskinfo('list');
						}
					}, {
						text : '锁定',
						hidden : compareAuth('FDBCK_LOCK'),
						handler : function() {
							lock('list');
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
	fd_store.load();
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/OpinionServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id",  "title", "content", "linkman", "phone",
								"email", "createOn", "isAudit", "ipAddr","createBy","province","city","isReply"]),
				baseParams : {
					type : 10,
					page : 1,
					pageSize : 20,
					cid : '1',
					content : 'isLock~0'
				},
				countUrl : '/OpinionServlet.do',
				countParams : {
					type : 11
				},
				remoteSort : true
			});
	ds.setDefaultSort("createOn", "DESC");
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
							dataIndex : 'title',
							width : parent.Ext.fly("tab_0801_iframe")
									.getWidth()
									* 0.6,
							renderer : renderContent
						}, {
							header : '联系人/联系电话/邮箱',
							dataIndex : 'linkman',
							sortable : true,
							width : parent.Ext.fly("tab_0801_iframe")
									.getWidth()
									* 0.2,
							renderer : renderLinkman

						}, {
							header : '状态',
							sortable : true,
							width : parent.Ext.fly("tab_0801_iframe")
									.getWidth()
									* 0.2,
							dataIndex : 'isAudit',
							renderer : renderisAudit
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '添加回复',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('FDBCK_ADDREPLY'),
							handler : addReply
						}, /*{
							text : '审核通过',
							icon : "/resource/images/tick.png",
							hidden : compareAuth('FDBCK_MOD'),
							handler : function() {
								passop("list");
							}
						},*/ {
							text : '修改/查看回复',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('FDBCK_MOD'),
							handler : function() {
								showaskinfo('list');
							}
						}, {
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth('FDBCK_LOCK'),
							handler : function() {
								lock('list');
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
				items : [ new Ext.form.ComboBox({
									fieldLabel : "站点选择",
									name : "area",
									id : "area",
									store : pro,
									mode : "local",
									triggerAction : "all",
									readOnly : true,
									width : 80,
									emptyText : '所有省',
									listeners : {
										"select" : function(){
											searchlist();
										}
									}
						})/*,{
							text : '反馈类型：',
							xtype : 'label'
						}, ck = new Ext.form.ComboBox({
									fieldLabel : "分类",
									emptyText : "请选择",
									fieldLabel : '反馈类型',
									id : 'cid_type',
									mode : 'local',
									triggerAction : "all",
									store : fd_store,
									valueField : "id",
									displayField : "name",
									width : 80,
									listeners : {
										"select" : function(combo) {
											searchlist();
										}
									}
								})*/, {
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
							xtype : 'label',
							text : '回复状态：'
						}, {
							xtype : 'combo',
							id : 'replyType',
							store : ReplyType,
							triggerAction : "all",
							width : 120,
							value : '-1',
							listeners : {
								"select" : function(){
									searchlist();
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
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		showaskinfo('list');
			});
	ds.load();
	function renderContent(value, p, record) {
		if(value==null){
			value="";
		}
		var trimtext = new cycleTrim();
		var temp = trimtext.cycleTrim(record.data.content, 50);
		//var webSite = record.data.webSite;
		var province = record.data.province;
		if(province ==null){
			province="";
		}
		var city = record.data.city;
		if(city ==null){
		   city="";
		}
		trimtext.init();
		return String.format('<b>地区：</b>{0}<br><b>问题：</b>{1}<br/><b>详细描述：</b>{2}', province+" "+city, value, temp);
	};
	function renderLinkman(value, p, record) {
		return String.format('<b>联系人：</b>{0}<br/><b>联系电话：</b>{1}<br/><b>邮箱：</b>{2}',
				value == null ? "" : value, record.data.phone == null
						? ""
						: record.data.phone, record.data.email == null
						? ""
						: record.data.email);
	};
	function renderisAudit(value, p, record) {
		if(record.data.createBy=="游客"){
			return String.format('<b>发布时间：</b>{0}<br/><b>回复状态：</b>{1}<br/><b>IP地址：</b>{2}<br/>',
					record.data.createOn.slice(0, 10),
					changeReply(record.data.isReply),
					record.data.ipAddr == null ? "" : record.data.ipAddr	
		           );
		}else{
			return String.format('<b>发布时间：</b>{0}<br/><b>回复状态：</b>{1}<br/><b>会员：</b>{2}<br/>',
					record.data.createOn.slice(0, 10),
					changeReply(record.data.isReply),
					record.data.createBy== null ? "" : record.data.createBy	
		           );
		}
	
	}
	// ck.setValue(1);
};

function init() {
	getPersonInfo();
	buildGrid();
	Ext.TipSelf.msg('提示', '双击列表可查看回复信息。');
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 锁定信息
function lock() {
	var rows = grid.getSelectionModel().getSelections();

					if (Ext.isEmpty(rows)) {
						Info_Tip("请选择信息。");
						return;
					}
					var ids = [];
					for (var i = 0; i < rows.length; i++) {
						ids.push(rows[i].get('id'));
					}
	Ext.Msg.confirm("确认操作", "您确认要锁定选中的信息吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/OpinionServlet.do',
								params : {
									type : 7,
									id : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("锁定成功。");

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

function changeReply(v){
	if(v=="1"){
		return '已回复';
	}
	
	if(v=="0"){
		return '<font color="red">未回复</font>';
	}
}

// 查询信息
function searchlist() {
	var cid = 1;
	/*
	if (!Ext.isEmpty(ck.getValue()))
		cid = ck.getValue();*/
	var province = "";

	if(Ext.fly("area").getValue() != "所有省" ){
		province = Ext.getCmp("area").getValue();
	}

	var isReply=Ext.getCmp('replyType').getValue();
	if(isReply!="-1"){
		ds.baseParams["replyType"] = isReply;
	}else{
		ds.baseParams["replyType"] = "";
	}
	ds.baseParams["cid"] = cid;
	ds.baseParams["content"] = "content~" + Ext.fly('searchtitle').getValue()
			+ ';isLock~0'
			+ ";province~" + province;

	ds.load();
};

// 查看详细信息
function showaskinfo(op) {
	if (op == "list") {
		listEdit();
	} else {
		replyEdit();
	}
};

// 审核
function passop(opt) {
	if (opt == "list")
		var rows = grid.getSelectionModel().getSelections();
	else
		var rows = reply_grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择信息。");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	Ext.Msg.confirm("确认操作", "您确认要审核选中的信息吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/OpinionServlet.do',
								params : {
									type : 6,
									isAudit : 1,
									id : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										if (opt == "list")
											ds.reload();
										else
											reply_ds.reload();

									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};

// 添加回复
function addReply() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	if(row.get('isReply')=="1"){
		Info_Tip("该反馈已经回复过，不可进行此操作");
		return;
	}
	fs = new Ext.form.FormPanel({
				layout:'table',
				border : false,
				layoutConfig : {
					columns :1
				},
				items:[{
						layout : "table",
						width:300,
						height:20,
						border : false,
						// autoWidth : true,
						layoutConfig : {
							columns : 2
						},
						style:'margin:8px;',
						items:[{
							xtype:'label',
							text:'回复人:'
						},{
							xtype:'label',
							text:cur_user_id+"（产品经理）"
						}]
					},{
						layout : "table",
						width : 300,
						height:20,
						style:'margin-left:8px;margin-bottom:8px;',
						border : false,
						// autoWidth : true,
						layoutConfig : {
							columns : 2
						},
						items:[{
							xtype:'label',
							text:'回复时间:'
						},{
							xtype:'label',
							text:(new Date()).toLocaleString()
						}]
					},{
						id:"replyContent",
						xtype:"textarea",
						width:340,
						height:240,
						style:'margin-left:10px;'
						
					}
				]
			});
	win = new Ext.Window({
				title : '回复内容',
				width : 400,
				autoHeight : true,
				modal : true,
				items : fs,
				buttonAlign : 'right',
				buttons : [{
							text : '回复',
							handler : function() {
								saveReply(row.get('id'));
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

function saveReply(thisid) {
	if (fs.getForm().isValid()) {
		var content = "content~"
				+ Ext.getCmp("replyContent").getValue() + ';cid~'
				+ 1;
		Ext.Ajax.request({
					url : '/OpinionServlet.do',
					params : {
						type : 9,
						content : content,
						id : thisid
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("回复成功。");
							ds.reload();
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

/*// 查看回复
function showReplyArea() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息.");
		return;
	}
	reply_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/OpinionServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ["id", "channel", "content", "linkman", "phone",
								"email", "createOn", "isAudit", "ipAddr"]),
				baseParams : {
					type : 5,
					id : row.get('id')
				},
				remoteSort : true
			});
	reply_grid = new Ext.grid.GridPanel({
				store : reply_ds,
				autoWidth : true,
				height : parent.Ext.fly("tab_0801_iframe").getHeight() * 0.5,
				viewConfig : {
					forceFit : true
				},
				columns : [{
							header : 'id',
							dataIndex : 'id',
							hidden : true
						}, {
							header : '回复内容',
							dataIndex : 'content',
							renderer:renderContent,
							width:380
						}, {
							header : '回复人',
							dataIndex : 'linkman',
							renderer:renderLinkman,
							width:120
						}, {
							header : '审核状态',
							dataIndex : 'createOn',
							renderer:renderisAudit,
							width:140
						}],
				tbar : [{
							text : '审核通过',
							icon : "/resource/images/tick.png",
							hidden : compareAuth('FDBCK_AUDIT'),
							handler : function() {
								passop('reply');
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
				view : new Ext.ux.grid.BufferView({
							// custom row height
							rowHeight : 10,
							// render rows as they come into viewable area.
							scrollDelay : true
						})
			});
	win = new Ext.Window({
				width : 680,
				autoHeight : true,
				modal : true,
				items : reply_grid,
				buttons : [{
							text : '关闭',
							handler : function() {
								win.close();
							}
						}]
			});
	reply_ds.load();
	reply_ds.on('load', function(record) {
				if (record.data.length < 1)
					Info_Tip("该信息无回复信息。");
				else
					win.show();
			});

	function renderContent(value, p, record) {
		var trimtext = new cycleTrim();
		var temp = trimtext.cycleTrim(value, 24);
		trimtext.init();
		return String.format('<b>信息内容：</b>{0}', temp);
	};
	function renderLinkman(value, p, record) {
		return String.format('<b>回复人：</b>{0}',
				value == null ? "" : value);
	};
	function renderisAudit(value, p, record) {
		return String.format('<b>回复时间：</b>{0}<br/><b>审核状态：</b>{1}<br/><b>IP地址：</b>{2}',
				record.data.createOn.slice(0, 10),
				changeAudit(record.data.isAudit),
				record.data.ipAddr == null ? "" : record.data.ipAddr);
	}
};
*/
// 反馈信息修改
function listEdit() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息.");
		return;
	}
	if(row.get('isReply')=="0"){
		Info_Tip("该反馈未回复不可进行此操作！");
		return;
	}
	fs = new Ext.form.FormPanel({
		layout:'table',
		border : false,
		layoutConfig : {
			columns :1
		},
		items:[{
				layout : "table",
				width:300,
				height:20,
				border : false,
				// autoWidth : true,
				layoutConfig : {
					columns : 2
				},
				style:'margin:8px;',
				items:[{
					xtype:'label',
					text:'回复人:'
				},{
					id:"memberid",
					xtype:'label',
				}]
			},{
				layout : "table",
				width : 300,
				height:20,
				style:'margin-left:8px;margin-bottom:8px;',
				border : false,
				// autoWidth : true,
				layoutConfig : {
					columns : 2
				},
				items:[{
					xtype:'label',
					text:'回复时间:'
				},{
					id:"createOn",
					xtype:'label',
					
				}]
			},{
				id:"replyContent1",
				xtype:"textarea",
				width:340,
				height:240,
				style:'margin-left:10px;'
				
			}
		]
	});
	win = new Ext.Window({
				title : '修改信息',
				modal : true,
				width : 400,
				autoHeight : true,
				items : fs,
				buttons : [{
							text : '修改',
							handler : function() {
								saveEditInfo(row.get('id'));
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	bindInfo(row.get('id'));
};

// 回复信息修改
function replyEdit() {

};

//获取个人信息
function getPersonInfo() {
	Ext.lib.Ajax.request("post", "/account/UserLogin.do", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data) {
						currUser_mc = data.result;
						// Ext.fly("area_show").dom.innerHTML =
						// data.result.currArea;
						cur_user_id = currUser_mc.uid;
					}

				},
				failure : function() {
					Warn_Tip();
				}
			}, "method=isLogin");

};



// 保存修改信息
function saveEditInfo(thisid) {
	
		var content = "content~"+Ext.getCmp('replyContent1').getValue();
		Ext.Ajax.request({
					url : '/OpinionServlet.do',
					params : {
						type : 13,
						id : thisid,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("修改成功。");
							ds.reload();
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	
};

// 绑定信息
function bindInfo(thisid) {
	Ext.Ajax.request({
				url : '/OpinionServlet.do',
				params : {
					type : 12,
					id : thisid
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						
                          var memberid=json.result['memberid'];
                          var createOn=json.result['createOn'];
                          createOn=createOn.substring(0,16);
                          var replyContent=json.result['content'];
                          Ext.getCmp("memberid").setText(memberid+"（产品经理）");
                          Ext.getCmp("createOn").setText(createOn);
                          Ext.getCmp("replyContent1").setValue(replyContent);
						/*if (field == "listfs") {
							Ext.getCmp("cid").setValue(json.result['cid']);
						}
						Ext.getCmp(field).getForm().setValues(json.result);*/
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 删除信息
function delask() {
	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					var rows = reply_grid.getSelectionModel().getSelections();
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
									type : 2,
									id : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										reply_ds.reload();
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};
