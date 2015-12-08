var ds, grid, ck, pagetool;
var ids = [];// 选择项
var selectinfo;
var webArea = "";
var tagsAll="";
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu1',
						text : '删除',
						handler : delask
					}, {
						id : 'rMenu2',
						text : '锁定',
						handler : lockPrj
					}]
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id", "name","tags","province", "stage", "type",
								"buildType", "investment", "updateOn"]),
				baseParams : {
					method : 'listProject',
					content : "webProvince~" + webArea+";tags~"+tagsAll,
					pageSize : 20,
					page : 1,
					isreply : true
				},
				countUrl : '/project/ProjectServlet',
				countParams : {
					method : 'getProjectCount',
					content : "webProvince~" + webArea+";tags~"+tagsAll

				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});// 是否支持多行选择
	// var url = "/ask/AskServlet?type=7&isreply=false&content=webProvince~"
	// + webArea;
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	var cs = new xg.CheckboxSelectionModel();// 带checkbox选择
	grid = new xg.GridPanel({
		store : ds,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoHeight : true,
		columns : [new Ext.grid.RowNumberer({
							width : 40
						}), {
					header : 'ID',
					sortable : true,
					dataIndex : 'id',
					width : 40
				}, {
					header : '项目名称',
					sortable : true,
					dataIndex : 'name',
					width : 180
				}, {
					header : '地区',
					sortable : true,
					dataIndex : 'province',
					width : 40
				}, {
					header : 'Tag标签',
					sortable : true,
					dataIndex : 'tags',
					width : 80
				}, {
					header : '项目阶段',
					sortable : true,
					dataIndex : 'stage',
					forceFit:true
				}, {
					header : '项目类型',
					sortable : true,
					dataIndex : 'type',
					width : 40
				}, {
					header : '建筑类别',
					sortable : true,
					dataIndex : 'buildType',
					width : 40
				}, {
					header : '投资额',
					sortable : true,
					dataIndex : 'investment',
					width : 60
				}, {
					header : '更新时间',
					sortable : true,
					dataIndex : 'updateOn',
					forceFit:true
				}],
		viewConfig : {
			forceFit : true
		},
		sm : cs,
		tbar : [{
					text : '查看/修改',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/edit.gif',
					handler : prjDetail
				}, "-", {
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/delete.gif',
					handler : function() {
						var rec = grid.getSelectionModel().getSelected();
						Ext.MessageBox.confirm("提示", "您确定删除该信息吗？",
								function(op) {
									if (op == "yes") {
										Ext.lib.Ajax.request("post",
												"/project/ProjectServlet", {
													success : function(response) {
														var data = eval("("
																+ response.responseText
																+ ")");
														if (getState(
																data.state,
																commonResultFunc,
																data.result)) {
															Ext.MessageBox.alert("提示", "删除成功。");
															ids = [];
															ds.reload();
														}
													},
													failure : function(response) {
														Ext.MessageBox
																.alert("提示",
																		"非常抱歉，您的操作发生错误。");
													}
												}, "method=delete&id="
														+ rec.data.id);
									}
								});
					}
				}, '-', {
					text : '锁定',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/delete.gif',
					handler : lockPrj
				}, {
					text : '添加项目',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/add.gif',
					handler : addProject
				}, {
					text : '相关信息',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/add.gif',
					handler : linkInfo
				}],
		bbar : pagetool,
		renderTo : 'project_grid'
	});
	
	var bar = new Ext.Toolbar({
			renderTo : grid.tbar,
			items : [ck = new Ext.form.ComboBox({
			                fieldLabel : '分类',
							emptyText : "请选择",
							mode : "local",
							triggerAction : "all",
							transform : "query_con",
							hiddenName : "query_con_val"
						}), "-", {
					xtype : "label",
					text : "关键字："
				}, {
					xtype : "textfield",
					textLabel : "关键字",
					id : "searchtitle"
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0; i < rows.length; i++) {
					ids.push(rows[i].get("id"));
				}
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		var row = grid.getSelectionModel().getSelected();
		// alert(row.get("code"));
		selectinfo = row.get("id");
		showprojectedit(selectinfo);
			// new newwin();
		});
	ds.load();
};
// 添加项目
function addProject() {
	window.parent.createNewWidget("project_add", '添加项目',
			'/module/project/project_add.jsp');
};
//相关信息
function linkInfo(){
	window.parent.createNewWidget("link_info",'相关信息','/module/project/info_link.jsp');
};
// 查看/修改
function prjDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	showprojectedit(thisid);
};
// 锁定
function lockPrj() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	var con = "id=" + thisid + "&isLock=1";
	Ext.MessageBox.confirm("确认操作", "您确定要锁定该用户吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/project/ProjectServlet?method=lock", {
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
							}, con)
				}
			})
};
function init() {
	tagsAll = getCurArgs("tagsAll");
	
	buildGrid();
	
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除信息
function delask() {
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/project/ProjectServlet", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							alert("删除成功。");
							ids = [];
							ds.reload();
							pagetool.updateInfo();
						}
					},
					failure : function(response) {
						Ext.MessageBox.alert("提示", "非常抱歉，您的操作发生错误。");
					}
				}, "type=2&id=" + ids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}

};

// 查询信息
function searchlist() {
	ds.baseParams["content"] = Ext.fly("query_con_val").getValue() + "~"
			+ Ext.fly("searchtitle").getValue();
	ds.baseParams["method"] = "search";
	ds.load();
};

// 查看详细信息
function showprojectedit(id) {
	window.parent.createNewWidget("project_edit", '修改项目信息',
			'/module/project/project_edit.jsp?id=' + id);
};
