Ext.onReady(init);
var ds, grid, ask_panel, reply_panel, ask_info, id;
function init() {
	if (getCurArgs("id"))
		id = getCurArgs("id");
	else {
		Info_Tip("非法访问。");
		return;
	}
	getAskInfo();
	buildReplyArea();
};
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu1',
						text : '删除',
						handler : del_answer
					}]
		});
function getAskInfo() {
	Ext.lib.Ajax.request("post", "/QuestionServlet?method=getQuestion", {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			ask_info = data.result;
			ask_panel = new Ext.FormPanel({
				autoHeight : true,
				border : false,
				bodyStyle : {
					background : '#DFE8F6'
				},
				applyTo : "askinfo_grid",
				autoScroll : true,
				items : [new Ext.form.FieldSet({
					title : '答疑详细信息',
					layout : "table",
					bodyStyle : {
						background : '#DFE8F6'
					},
					layoutConfig : {
						columns : 1
					},
					viewConfig : {
						forceFit : true
					},
					items : [{
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;font-size:12px;background-color:#DFE8F6;line-height:26px;",
						items : [{
									xtype : "label",
									html : "<font color='red'>标题：</font>" + ask_info["title"]
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;font-size:12px;background-color:#DFE8F6;line-height:26px;",
						items : [{
									xtype : "label",
									html : "<font color='red'>内容：</font>" + ask_info["content"]
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;font-size:12px;background-color:#DFE8F6;line-height:26px;",
						items : [{
									xtype : "label",
									html : "<font color='red'>提问人：</font>" + ask_info["author"]
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;font-size:12px;background-color:#DFE8F6;line-height:26px;",
						items : [{
									xtype : "label",
									html : "<font color='red'>单位：</font>" + ask_info["corpName"]
								}]
					}, {
						autoHeight : true,
						layout : 'table',
						layoutConfig : {
							columns : 4
						},
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;background-color:#DFE8F6;;line-height:26px;",
						items : [{
							width : 100,
							bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:26px;",
							items : [{
										text : '阅读数：' + ask_info["hits"],
										xtype : 'label'
									}]
						}, {
							width : 100,
							bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:26px;",
							items : [{
										text : '回复数：' + ask_info["revNum"],
										xtype : 'label'
									}]
						}, {
							width : 150,
							bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:26px;",
							items : [{
								text : '发布时间：'
										+ ask_info["createOn"].slice(0, 10),
								xtype : 'label'
							}]
						}, {
							width : 100,
							bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;vertical-align:middle;line-height:26px;",
							items : [{
										text : '锁定此信息',
										xtype : 'button',
										bodyStyle : 'vertical-align:middle',
										handler : del_ask
									}]
						}]
					}]
				})]
			});
		},
		failure : function() {
		}
	}, "id=" + id);
};

function buildReplyArea() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/QuestionServlet?method=getByAnswer'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "author", "createOn", "content", "title"]),
				baseParams : {
					id : id
				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : false
			});// 是否支持多行选择
	grid = new Ext.grid.GridPanel({
				store : ds,
				autoHeight : true,
				autoWidth : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '删除信息',
							handler : del_answer,
							icon : '/resource/images/delete.gif'
						}],
				columns : [new Ext.grid.RowNumberer(), {
					header : '',
					dataIndex : 'title',
					width : parent.Ext.fly('tab_question_list_detail_iframe')
							.getWidth() * 0.8 - 35,
					renderer : renderContent
				}, {
					header : '',
					dataIndex : 'createOn',
					width : parent.Ext.fly('tab_question_list_detail_iframe')
							.getWidth() * 0.2 - 35,
					renderer : renderDate
				}],
				view : new Ext.ux.grid.BufferView({
							rowHeight : 10
						})

			});
	var panel2 = new Ext.FormPanel({
				layout : "fit",
				autoWidth : true,
				border : false,
				autoHeight : true,
				bodyStyle : {
					background : '#DFE8F6'
				},
				items : [new Ext.form.FieldSet({
							title : "回复信息",
							autoHeight : true,
							autoScroll : true,
							items : [grid]
						})],
				applyTo : "reply_area"
			});
	ds.load();
	function renderContent(value, p, record) {
		var trimtext = new cycleTrim();
		var temp = trimtext.cycleTrim(record.data.content, 60);
		return String.format('<b>标题：{0}</b><br/>内容：{1}', value, temp);
	}
	function renderDate(value, p, record) {
		return String.format('回复日期：{0}<br/>回复人：{1}', value.slice(0, 10),
				record.data.author);
	}
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
};

// 删除问题信息
function del_ask() {
	Ext.MessageBox.confirm("操作确认", "您确认要锁定该信息吗？", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", "/QuestionServlet?method=lock", {
						success : function(response) {
							var json = eval("(" + response.responseText + ")");
							if (getState(json.state, commonResultFunc,
									json.result)) {
								Ext.MessageBox.alert("温馨提示", "锁定成功。",
										function() {
											window.parent.Ext
													.getCmp('center')
													.remove("question_list_detail");
										})

							}
						},
						failure : function() {
							Warn_Tip();
						}
					}, "id=" + id)
		}
	});

};

// 删除回复信息
function del_answer() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.MessageBox.confirm("操作确认", "您确认要删除该信息吗？", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/QuestionServlet?method=delRev", {
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
							}, "id=" + row.get("id") + "&pid=" + id)
				}
			});

};