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
							url : '/SearchInfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ['id', 'title', 'tags', 'typename', 'createBy',
								'addTime', 'isHot', 'isTop']),
				baseParams : {
					type : 6,
					tags : tagsAll,
					pageSize : 20,
					page : 1,
					isreply : true
				},
				countUrl : '/SearchInfoContent.do',
				countParams : {
					type : 3,
					blur : 'yes',
					content : "tags~"+tagsAll

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
							header : '标题',
							dataIndex : 'title',
							width : 250
						}, {
							header : 'Tag标签',
							dataIndex : 'tags'
						}, {
							header : '信息类型',
							dataIndex : 'typename'
						}, {
							header : '发表人',
							dataIndex : 'createBy'
						}, {
							header : '发表时间',
							dataIndex : 'addTime'
						}, {
							header : '热点',
							dataIndex : 'isHot'
						}, {
							header : '置顶',
							dataIndex : 'isTop'
						}],
		viewConfig : {
			forceFit : true
		},
		sm : cs,
		tbar : [ck = new Ext.form.ComboBox({
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
				}],
		bbar : pagetool,
		renderTo : 'info_grid'
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
// 添加文章
function addInfo() {
	window.parent.createNewWidget("info_add", '添加信息',
			'/module/info/info_add.jsp');
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
	ds.baseParams["type"] = "11";
	ds.load();
};

// 查看详细信息
function showprojectedit(id) {
	window.parent.createNewWidget("project_edit", '修改项目信息',
			'/module/project/project_edit.jsp?id=' + id);
};
