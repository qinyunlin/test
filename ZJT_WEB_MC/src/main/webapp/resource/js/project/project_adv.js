var ds, grid, ck, pagetool;
var ids = [];// 选择项
var selectinfo;
var webArea = "";
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu1',
						text : '删除',
						hidden : compareAuth("PROJ_DEL"),
						handler : delask
					}, {
						id : 'rMenu2',
						text : '解锁',
						hidden : compareAuth("PROJ_UNLOCK"),
						handler : unLock
					}]
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet?isLock=1'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id", "name", "province", "stage", "type",
								"buildType", "investment", "updateOn"]),
				baseParams : {
					method : 'search',
					pageSize : 20,
					isreply : true
				},
				countUrl : '/project/ProjectServlet?isLock=1',
				countParams : {
					method : 'searchCount'

				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : 'id'
	});
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
		sm : sm,
		columns : [new Ext.grid.RowNumberer({
							width : 40
						}), sm, {
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
					header : '项目阶段',
					sortable : true,
					dataIndex : 'stage',
					forceFit:true
				}, {
					header : '项目类型',
					sortable : true,
					width : 50,
					dataIndex : 'type'
				}, {
					header : '建筑类别',
					sortable : true,
					dataIndex : 'buildType',
					forceFit:true
				}, {
					header : '投资额',
					sortable : true,
					dataIndex : 'investment',
					forceFit:true
				}, {
					header : '更新时间',
					sortable : true,
					dataIndex : 'updateOn',
					forceFit:true
				}],
		viewConfig : {
			forceFit : true
		},
		tbar : [{
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/delete.gif',
					hidden : compareAuth("PROJ_DEL"),
					handler : delask
				}, "-", {
					text : "解锁",
					icon : "/resource/images/lock_open.png",
					hidden : compareAuth("PROJ_UNLOCK"),
					handler : unLock
				}],
		bbar : pagetool,
		renderTo : 'project_grid'
	});
	var bar = new Ext.Toolbar({
		renderTo: grid.tbar,
		items : [ck = new Ext.form.ComboBox({
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
					id : "searchtitle",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e){
							if(e.getKey() == e.ENTER){
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
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		var row = grid.getSelectionModel().getSelected();
		// alert(row.get("code"));
		selectinfo = row.get("id");
		showprojectedit(selectinfo);
			// new newwin();
		});
	ds.load();
};
// 解锁项目
function unLock() {
	var ids = [];
	var rows = grid.getSelectionModel().getSelections();
	if(!isEmpty(rows)){
		for (var i = 0; i < rows.length; i++) {
			ids.push(rows[i].get("id"));
		}
	}
	if(ids.length == 0){
		Ext.Msg.alert("提示", "请选择项目");
		return ;
	}
	Ext.MessageBox.confirm("确认操作", "您确定要解锁您选中的项目吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/project/ProjectServlet?method=lock", {
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("解锁成功。");
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + ids.toString() + "&isLock=0")
				}
			})
};
function init() {
	buildGrid();
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除信息
function delask() {
	var ids = [];
	var rows = grid.getSelectionModel().getSelections();
	if(!isEmpty(rows)){
		for (var i = 0; i < rows.length; i++) {
			ids.push(rows[i].get("id"));
		}
	}
	if(ids.length == 0){
		Ext.Msg.alert("提示", "请选择项目");
		return ;
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/project/ProjectServlet", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Ext.Msg.alert("提示", "删除成功。");
							ids = [];
							ds.reload();
							pagetool.updateInfo();
						}
					},
					failure : function(response) {
						Ext.MessageBox.alert("提示", "非常抱歉，您的操作发生错误。");
					}
				}, "method=delete&id=" + ids.toString());
			}
			ids = [];
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
	window.parent.createNewWidget("project_edit", '项目信息',
			'/module/project/project_edit.jsp?id=' + id);
};
