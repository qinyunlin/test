Ext.onReady(init);
var fs, ds, id, nodeText, ds1, grid1, grid2, eid_ds, email_list1, email_list2;
function init() {
	Ext.QuickTips.init(true);
	id = getCurArgs('id');
	nodeText = decodeURI(getCurArgs('nodeText'));
	if (id == null || id == undefined) {
		Info_Tip("非法访问。", closeWin);
		return;
	}
	buildForm();
	bindInfo();
};

function closeWin() {
	window.parent.Ext.getCmp('center').remove("email_template_detail");
};
function buildForm() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailLabelServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', 'labelName', 'isLock']),
				baseParams : {
					type : 7
				},
				remoteSort : true
			});
	ds.load();
	var input_form = new Ext.form.FieldSet({

		width : 800,
		autoHeight : true,
		padding : 6,
		layout : 'column',
		items : [new Ext.form.FieldSet({
			title : '邮件信息配置',
			width : 780,
			autoHeight : true,
			padding : 6,
			labelAlign : 'right',
			labelWidth : 60,
			layout : 'form',
			items : [{
				xtype : 'label',
				text : "当前邮件分类:" + nodeText,
				name : 'cname',
				style : 'font-weight:bold;height:26px;padding-left:8px;line-height:26px;'
			}, {
				xtype : 'textfield',
				fieldLabel : '信件名称',
				id : 'email_name',
				name : 'name',
				maxLength : 80,
				width : 656,
				allowBlank : false

			}, {
				xtype : 'textfield',
				fieldLabel : '信件主题',
				name : 'subject',
				id : 'email_subject',
				maxLength : 80,
				width : 656,
				allowBlank : false

			}, {
				layout : 'column',
				items : [{
							columnWidth : 0.45,
							layout : 'form',
							items : {

								xtype : 'combo',
								fieldLabel : '标签内容',
								id : 'email_label',
								store : ds,
								readOnly : true,
								valueField : 'labelName',
								displayField : 'name',
								triggerAction : 'all',
								width : 260

							}
						}, {
							columnWidth : 0.4,
							layout : 'form',
							items : {

								xtype : 'button',
								text : '插入标签',
								handler : function() {
									Ext.getCmp('email_content')
											.insertAtCursor("${"
													+ Ext.getCmp('email_label')
															.getValue() + "}");
								}
							}
						}]
			}, {
				xtype : 'label',
				style : 'color:red;text-align:left;padding-left:10px;height:26px;line-height:26px;',
				text : '选择标签后，点击插入标签，将会为您在信件内容光标处添加上标签的内容标识。此标识将会为您替换你所需要的内容，请不要更改。',
				allowBlank : false,
				width : 616

			}, {
				xtype : 'htmleditorself',
				fieldLabel : '信件内容',
				id : 'email_content',
				name : 'content',
				allowBlank : false,
				width : 656,
				height : 600,
				requestURL : "http://ftp.zjtcn.com",
				requestType : 'RS_INFO',
				fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/

			}]
		})]
	});
	fs = new Ext.FormPanel({
		autoWidth : true,
		height : parent.Ext.fly('tab_email_template_detail_iframe').getHeight(),
		padding : 6,
		autoScroll : true,
		frame : true,
		buttonAlign : 'center',
		items : [input_form,{
			layout : 'form',
			width : 800,
			buttonAlign : 'center',
			buttons : [{
					text : '修改',
					hidden : compareAuth('EMAIL_TEMP_MOD'),
					handler : saveInfo
				}, {
					id : 'sendBtn',
					text : '发送邮件',
					style : 'display:none',
					hidden : compareAuth('EMAIL_TEMP_SEND'),
					handler : showEmailArea
				}]
		}],
		renderTo : 'panel'	
	});
};

// 绑定数据
function bindInfo() {
	Ext.Ajax.request({
				url : '/email/EmailTemplateServlet',
				params : {
					type : 4,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						fs.getForm().setValues(data.result);
						if(data.result["isLock"] != "1")
							showEl("sendBtn");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 保存修改的内容
function saveInfo() {
	Ext.Msg.confirm("确认操作", "您确认要保存现有的修改吗？", function(op) {
		if (op == "yes") {
			if (fs.getForm().isValid()) {
				var content = "name~"
						+ fs.getForm().items.map["email_name"].getValue()
						+ ";subject~"
						+ fs.getForm().items.map["email_subject"].getValue();
				Ext.Ajax.request({
					url : '/email/EmailTemplateServlet',
					params : {
						type : 3,
						content : content,
						desc : fs.getForm().items.map["email_content"]
								.getValue(),
						id : id
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("修改成功。", closeWin);
							window.parent.tab_1101_iframe.ds.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			} else
				Info_Tip();
		} else
			bindInfo();
	});
};

// 发送邮件区域
function showEmailArea() {
	eid_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["name", "id"]),
				baseParams : {
					type : 9
				},
				remoteSort : true
			});
	eid_ds.load();
	ds1 = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["memberID", "trueName", "corpName"]),
				baseParams : {
					method : "searchPaged",
					validDate : 1,
					pageNo : 1
				},
				countUrl : '/mc/Member.do',
				countParams : {
					type : 6,
					method : 'searchCount'
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds1,
				displayInfo : true
			});
	ds2 = new Ext.data.Store();
	email_list1 = {
		xtype : 'container',
		columnWidth : 0.6,
		height : parent.Ext.fly('tab_email_template_detail_iframe').getHeight()
				/ 2,
		items : grid1 = new Ext.grid.GridPanel({
					title : '查询列表',
					ddGroup : 'secondGridDDGroup',
					autoWidth : true,
					autoScroll : true,
					store : ds1,
					height : parent.Ext.fly('tab_email_template_detail_iframe')
							.getHeight()
							/ 2,
					viewConfig : {
						forceFit : true
					},
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								header : '会员ID',
								sortable : false,
								dataIndex : 'memberID'
							}, {
								header : '会员名称',
								sortable : false,
								dataIndex : 'trueName'
							}, {
								header : '企业名称',
								sortable : false,
								dataIndex : 'corpName'
							}],
					enableDragDrop : true,
					stripeRows : true,
					tbar : [{
								xtype : 'label',
								text : '搜索类型:'
							}, {
								xtype : "combo",
								store : [["memberID", "会员ID"],
										["corpName", "企业名称"],
										["trueName", "会员姓名"]],
								hiddenName : "query_type",
								mode : "local",
								width : 80,
								triggerAction : "all",
								fieldLabel : "查询类型",
								value : "memberID"
							}, {
								xtype : 'textfield',
								id : 'input_value',
								enableKeyEvents : true,
								listeners : {
									"keyup" : function(tf, e) {
										if (e.getKey() == e.ENTER) {
											searchMem();
										}
									}
								}

							}, {
								text : '查询',
								icon : "/resource/images/zoom.png",
								handler : searchMem
							}],
					bbar : pagetool,
					listeners : {
						"rowdblclick" : function() {
							openInfo();
						}
					}
				})
	};
	email_list2 = {
		xtype : 'container',
		columnWidth : 0.4,
		height : parent.Ext.fly('tab_email_template_detail_iframe').getHeight()
				/ 2,
		items : grid2 = new Ext.grid.GridPanel({
					title : '发送邮件名单',
					ddGroup : 'firstGridDDGroup',
					autoWidth : true,
					autoScroll : true,
					store : ds2,
					height : parent.Ext.fly('tab_email_template_detail_iframe')
							.getHeight()
							/ 2,
					viewConfig : {
						forceFit : true
					},
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								header : '会员ID',
								sortable : false,
								dataIndex : 'memberID'
							}, {
								header : '会员名称',
								sortable : false,
								dataIndex : 'trueName'
							}],
					enableDragDrop : true,
					stripeRows : true,
					tbar : [{
								text : '查看会员详细',
								icon : '/resource/images/edit.gif',
								handler : openInfo
							}],
					listeners : {
						"rowdblclick" : function() {
							openInfo();
						}
					}
				})
	};
	win = new Ext.Window({
				title : '发送邮件配置',
				width : 800,
				autoHeight : true,
				modal : true,
				layout : 'column',
				items : [email_list1, email_list2],
				buttons : [{
							xtype : 'label',
							text : '发送邮件帐户：'
						}, {
							xtype : 'combo',
							id : 'eid',
							store : eid_ds,
							triggerAction : "all",
							valueField : 'id',
							readOnly : true,
							displayField : 'name'
						}, {
							text : '发送',
							handler : function() {
								sentEmail(id);
							}
						}]

			});
	win.show();
	var firstGridDropTargetEl = grid1.getView().scroller.dom;
	var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
				ddGroup : 'firstGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid1.store.add(records);
					grid1.store.sort('trueName', 'ASC');
					return true;
				}
			});

	var secondGridDropTargetEl = grid2.getView().scroller.dom;
	var secondGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
				ddGroup : 'secondGridDDGroup',
				notifyDrop : function(ddSource, e, data) {
					var records = ddSource.dragData.selections;
					Ext.each(records, ddSource.grid.store.remove,
							ddSource.grid.store);
					grid2.store.add(records);
					// grid2.store.sort('trueName', 'ASC');
					return true;
				}
			});
};

function searchMem() {
	var query_type = Ext.fly("query_type").getValue();
	ds1.baseParams["content"] = query_type + "~"
			+ Ext.fly("input_value").getValue();
	ds1.load();
};

// 发送邮件
function sentEmail(thisid) {
	if (fs.getForm().isValid()) {
		var content = "name~" + fs.getForm().items.map["email_name"].getValue()
				+ ";subject~"
				+ fs.getForm().items.map["email_subject"].getValue();
		Ext.Ajax.request({
			url : '/email/EmailTemplateServlet',
			params : {
				type : 3,
				content : content,
				desc : fs.getForm().items.map["email_content"].getValue(),
				id : id
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					window.parent.tab_1101_iframe.ds.reload();
					Ext.Msg.confirm("确认操作", "您确认要给发送名单内的会员发送邮件吗?",
							function(op) {
								if (op == 'yes') {
									var len = grid2.store.data.items.length;
									var ids = [];
									for (var i = 0; i < len; i++) {
										ids.push(grid2.store.data.items[i]
												.get('memberID'));
									}
									if (ids.length < 1) {
										Info_Tip("请在发送名单内添加会员。");
										return;
									}
									Ext.Ajax.request({
												url : '/email/EmailTemplateServlet',
												params : {
													type : 7,
													mid : ids.toString(),
													eid : Ext.getCmp('eid')
															.getValue(),
													id : thisid
												},
												success : function(response) {
													var data = eval("("
															+ response.responseText
															+ ")");
													if (getState(data.state,
															commonResultFunc,
															data.result)) {
														Info_Tip("邮件已发送...");
														win.close();
													}
												},
												failure : function() {
												}
											});
								}
							});
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();

};
// 打开
function openInfo() {
	var row = grid1.getSelectionModel().getSelected()
			|| grid2.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择会员");
		return;
	}
	var id = row.get("memberID");
	window.parent.createNewWidget("member_info", '会员信息',
			'/module/member/member_info.jsp?id=' + id);
};