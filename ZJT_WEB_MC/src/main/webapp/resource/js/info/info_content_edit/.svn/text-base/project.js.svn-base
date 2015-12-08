
/* 显示相关项目 */
var initRelatedPro = function() {
	// 项目资讯才可以添加相关项目
	relatedProStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/InfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'name']),
				baseParams : {
					id : infoId,
					type : 10
				},
				remoteSort : true
			});
	relatedProStore.load();
	var relateGridPanel = new Ext.grid.GridPanel({
				store : relatedProStore,
				loadMask : true,
				height : 180,
				autoScroll : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '项目名称',
							dataIndex : 'name',
							width : 200
						}],
				viewConfig : {
					forceFit : true
				},
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				tbar : [{
							text : '新增',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							handler : function() {
								showRelatedProWin();
							}
						}, '-', {
							id : 'del',
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : function() {
								delRelationPro();
							}
						}],
				listeners : {
					rowclick : {
						fn : function() {
							this.getSelectionModel().each(function(rec) {
										infoPid = rec.get("id");
									})
						}
					}
				}
			});
	Ext.getCmp("relatedProFs").add(relateGridPanel)
	Ext.getCmp("relatedProFs").doLayout()
}
/* end 显示相关项目 */

/* 显示相关项目 */
var buildRelatedProWin = function() {
	proStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'code', 'name', 'buildDate']),
				baseParams : {
					method : 'search'
				},
				countUrl : '/project/ProjectServlet',
				countParams : {
					method : 'searchCount'
				},
				remoteSort : true
			});
	proStore.load();
	relatedProWin = new Ext.Window({
		el : 'related_pro_win',
		width : 550,
		height : 500,
		title : '选择相关项目',
		layout : 'column',
		border : false,
		frame : true,
		buttonAlign : 'center',
		labelAlign : 'right',
		closeAction : 'hide',
		bodyStyle : 'padding: 15px',
		items : [new Ext.grid.GridPanel({
					store : proStore,
					loadMask : true,
					autoScroll : true,
					height : 400,
					width : 500,
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								header : '项目编号',
								dataIndex : 'code'
							}, {
								header : '项目名称',
								dataIndex : 'name',
								width : 240
							}, {
								header : '立项日期',
								dataIndex : 'buildDate'
							}],
					bbar : new Ext.ux.PagingToolbar({
								store : proStore,
								displayInfo : true
							}),
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					tbar : [new Ext.form.ComboBox({
								id : 'kwType',
								name : 'kwType',
								mode : 'local',
								readOnly : true,
								triggerAction : 'all',
								anchor : '90%',
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : [['0', '项目编号'],
													['1', '项目名称']]
										}),
								valueField : 'value',
								displayField : 'text',
								width : 80,
								emptyText : '项目名称'
							}), {
						id : 'keyword',
						xtype : 'textfield'
					}, {
						text : '查询',
						cls : 'x-btn-text-icon',
						icon : '/resource/images/zoom.png',
						handler : function() {
							proStore.baseParams = {};
							if (Ext.get("kwType").dom.value == "项目名称") {
								proStore.baseParams["method"] = "search";
								proStore.baseParams["name"] = Ext
										.get("keyword").dom.value;
							} else if (Ext.get("kwType").dom.value == "项目编号") {
								proStore.baseParams["method"] = "search";
								proStore.baseParams["code"] = Ext
										.get("keyword").dom.value;
							}
							proStore.load();
						}
					}],
					listeners : {
						rowclick : {
							fn : function() {
								this.getSelectionModel().each(function(rec) {
											pid = rec.get("id");
										})
							}
						}
					}
				})],
		buttons : [{
			text : '确定',
			handler : function() {
				if (pid == null) {
					Ext.MessageBox.alert("提示", "请选择项目!");
					return;
				}
				var data = "";
				data += "id=" + infoId;
				data += "&pid=" + pid;
				data += "&type=8";
				Ext.lib.Ajax.request('post', '/InfoContent.do', {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							pid = null;
							relatedProWin.hide();
							relatedProStore.load();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				}, data);
			}
		}, {
			text : '取消',
			handler : function() {
				relatedProWin.hide();
			}
		}]
	});
}

var showRelatedProWin = function() {
	if (relatedProWin == null) {
		buildRelatedProWin();
		relatedProWin.show();
	} else {
		relatedProWin.show();
	}
};
/* end 显示相关项目 */








/* 去除相关项目 */
var delRelationPro = function() {
	Ext.MessageBox.confirm("提示", "确定要去除相关项目?", function(btn) {
				if (btn == "yes") {
					var data = "";
					data += "id=" + infoId;
					data += "&pid=" + infoPid;
					data += "&type=9";
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									if (infoPid == null) {
										Ext.MessageBox.alert("提示", "请先选择项目！");
										return;
									}
									var data = eval("(" + response.responseText
											+ ")");
									if (data && data.state == 'success') {
										infoPid = null;
										relatedProStore.load();
									} else {
										Ext.MessageBox.alert("提示", "删除相关项目失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
			});
};
/* end 去除相关项目 */


// 查看相关项目
function linkProject() {
	var tagsAll = Ext.fly("tags").dom.value;
	if (isEmpty(tagsAll)) {
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空, 无相关项目");
		return;
	}
	window.parent
			.createNewWidget("link_project", '相关项目',
					'/module/project/project_manage.jsp?tagsAll=' + tagsAll
							+ "&link=1");
};