var ds, grid, ck, pagetool;
var ids = [];// 选择项
var selectinfo,query_fs;
var tagsAll = "";
var webArea = "";

var stageStore, buildTypeStore;
var stageMap, buildTypeMap;
var stageCombo, buildTypeCombo;
var zhcn = new Zhcn_Select();
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			items : [{
						id : 'rMenu1',
						text : '查看/修改',
						hidden : compareAuth('PROJ_VIEW'),
						handler : prjDetail
					}, {
						id : 'rMenu3',
						text : '锁定',
						hidden : compareAuth('PROJ_LOCK'),
						handler : lockPrj
					}, {
						id : 'rMenu4',
						text : '添加项目',
						hidden : compareAuth('PROJ_ADD'),
						handler : addProject
					}]
		});
var buildGrid = function() {

	
	
	// 省份城市级联选择
	var pro =  zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = [];
	var area=[];
	var comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				width : 90,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:"全部省份",
				editable : false,
				triggerAction : 'all',
				allowBlank : true,
				readOnly : true,
				fieldLabel : '省',
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						if(province =="全部省份")
						{
						   city=["全部城市"];
						}
						else
						{
							city=zhcn.getCity(province);
							city.unshift("全部城市");
						}
						
						comboCities.store.loadData(city);
						comboCities.enable();
						
					}
				}

			});
	var comboCities = new Ext.form.ComboBox({
				id : 'comboCities',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value : '全部城市',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				allowBlank : true,
				readOnly : true,
				fieldLabel : '市',
				name : 'region'
			});

	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id", "name", "tags", "province","region" ,"stage", "type",
								"buildType", "investment", "updateOn"]),
				baseParams : {
					method : 'search',
					content : "webProvince~" + webArea,
					pageSize : 20,
					page : 1,
					isreply : true,
					isFocus:0
				},
				countUrl : '/project/ProjectServlet',
				countParams : {
					method : 'searchCount'
				},
				remoteSort : true
			});
	ds.setDefaultSort("updateOn", "DESC");
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	// var url = "/ask/AskServlet?type=7&isreply=false&content=webProvince~"
	// + webArea;
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	// var cs = new xg.CheckboxSelectionModel();// 带checkbox选择
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
							hidden : true
						}, {
							header : '项目名称',
							sortable : true,
							dataIndex : 'name',
							width : 160
						}, {
							header : '省份',
							sortable : true,
							dataIndex : 'province',
							width : 40
						}, {
							header : '城市',
							sortable : true,
							dataIndex : 'region',
							width : 40
						}, {
							header : 'Tag标签',
							sortable : true,
							dataIndex : 'tags',
							width : 45
						}, {
							header : '建筑类型',
							sortable : true,
							dataIndex : 'buildType',
							width : 45
						}, {
							header : '项目阶段',
							sortable : true,
							dataIndex : 'stage',
							forceFit : true,
							width : 85
						}, {
							header : '项目类型',
							sortable : true,
							dataIndex : 'type',
							width : 45
						}, {
							header : '投资额（万元）',
							sortable : true,
							dataIndex : 'investment',
							width : 70
						}, {
							header : '更新时间',
							sortable : true,
							dataIndex : 'updateOn',
							forceFit : true
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : [{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('PROJ_VIEW'),
							handler : prjDetail
						}, '-', {
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth('PROJ_LOCK'),
							handler : lockPrj
						}, {
							text : '添加项目',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('PROJ_ADD'),
							handler : addProject
						}, {
							id : 'bj_menuItem',
							text : '标签相关信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							style : 'display: none;',
							handler : linkInfo
						}],
				bbar : pagetool,
				renderTo : 'project_grid'
			});
	query_fs = new Ext.FormPanel({
				title : '',
				bodyStyle : 'border:none',
				items : [{
							layout : 'column',
							bodyStyle : 'border:none;background-color:#D1DFF0',
							items : [{
								xtype : "radio",
								boxLabel : "重点项目",
								inputValue : "1",
								name : "proType",
								handler:searchlist
							}, {
								xtype : "radio",
								boxLabel : "普通项目",
								inputValue : "0",
								name : "proType",
								checked:true
							}]
						}]
			});		
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : ["省份", comboProvinces, "城市", comboCities, "项目类型", {
					xtype : "combo",
					id : 'type',
					hiddenId : 'typeId',
					hiddenName : 'typeId',
					fieldLabel : "项目类型",
					store : new Ext.data.SimpleStore({
								fields : ["value", "text"],
								data : [['', '全部'], ['新建', '新建'], ['改建', '改建'],
										['扩建', '扩建']]
							}),
					valueField : 'value',
					displayField : 'text',
					triggerAction : "all",
					mode : 'local',
					width : 80,
					emptyText : '全部',
					listeners : {
						"select" : function(buildTypeCombo, record, index) {
							searchlist();
						}
					}
				}, "-", ck = new Ext.form.ComboBox({
							fieldLabel : "分类",
							emptyText : "请选择",
							mode : "local",
							triggerAction : "all",
							transform : "query_con",
							hiddenName : "query_con_val"
						}), {
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
				}, query_fs]
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
	grid.on("click", function(e) {
				var rows = grid.getSelectionModel().getSelections();
				if (rows.length == 1 && !isEmpty(rows[0].get("tags"))) {
					showEl("bj_menuItem");
				} else {
					hideEl("bj_menuItem");
				}
			});
	if (!isEmpty(getCurArgs("link"))) {
		ck.setValue("tags");
		if (!isEmpty(tagsAll)) {
			Ext.fly("searchtitle").dom.value = tagsAll;
			ds.baseParams["content"] = "tags~" + tagsAll;
			ds.load();
		}
	} else {
		ds.load();
	}
};
// 添加项目
function addProject() {
	window.parent.createNewWidget("project_add", '添加项目',
			'/module/project/project_add.jsp');
};
// 相关信息
function linkInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	tagsAll = row.get("tags");
	if (isEmpty(tagsAll)) {
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空,没有相关信息");
		return;
	}
	window.parent.createNewWidget("link_info", '相关信息',
			'/module/info/info_manage.jsp?link=1&tagsAll=' + tagsAll);
};
// 相关图片
function picInfo() {

	window.parent.createNewWidget("link_info", '相关图片',
			'/module/project/info_link.jsp?tagsAll=' + tagsAll);
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
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var con = "id=" + ids.toString() + "&isLock=1";
	Ext.MessageBox.confirm("提示", "您确定要锁定选中的项目吗?", function(op) {
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
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/project/ProjectServlet", {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("锁定成功。");
										ds.reload();
										pagetool.updateInfo();
									}
								},
								failure : function(response) {
									Ext.MessageBox
											.alert("提示", "非常抱歉，您的操作发生错误。");
								}
							}, "method=delete&id=" + ids);
				}
				ids = [];
			});
};

// 查询信息
function searchlist() {
	var isfocus=query_fs.form.findField('proType').getGroupValue();
	var province=Ext.fly("comboProvinces").getValue();
	var city=Ext.fly("comboCities").getValue();
	var type = Ext.fly("typeId").getValue();
	ds.baseParams["content"] = "type~" + type + ";"
			+ Ext.fly("query_con_val").getValue() + "~"
			+ Ext.fly("searchtitle").getValue();
	if(province !="全部省份")
	{
        ds.baseParams["province"] = province;
	}
	ds.baseParams["isFocus"]=isfocus;
	if(city!="全部城市")
	{
	   ds.baseParams["region"] = city;
	}
	ds.baseParams["method"] = "search";
	ds.load();
};

// 查看详细信息
function showprojectedit(id) {
	window.parent.createNewWidget("project_edit", '修改项目信息',
			'/module/project/project_edit.jsp?id=' + id);
};
