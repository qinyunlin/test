var store, grid;
var infoId = "";
var tagsAll = "";
var infoStore, sortStore;
var sortCombo, site_form, site, tempwebSite = [];

var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var tempSite = currSite
tempSite.splice(0, 0, ["", "全部"]);
var province_data = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : tempSite
		});
var buildGrid = function() {
	infoStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/TemplateBase.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'temp_id', 'parent_id', 'ename', 'cname', 'type',
								'page_url', 'suffix', 'photo_url', 'content', 'note',
								'add_user', 'add_time', 'del_flag', 'modify_user', 'modify_time', 'version']),
				baseParams : {
					type : 8,
					temp_id : tempID,
					pageSize : 20
				},
				countUrl : '/TemplateBase.do',
				countParams : {
					type : '11',
					cata_id : tempID
				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : infoStore,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '英文名称',
							sortable : true,
							width : 40,
							dataIndex : 'ename'
						}, {
							header : '中文名称',
							sortable : true,
							width : 40,
							dataIndex : 'cname'
						}, {
							header : '模板类型',
							sortable : true,
							width : 40,
							dataIndex : 'type',
							renderer : rederHT
						}, {
							header : '备注',
							sortable : true,
							dataIndex :'note',
							width : 40,
						}, {
							header : '添加人',
							sortable : true,
							dataIndex :'add_user',
							width : 40
						}, {
							header : '添加时间',
							sortable : true,
							dataIndex :'add_time',
							width : 40
						}, {
							header : '修改人',
							sortable : true,
							dataIndex :'modify_user',
							width : 40
						}, {
							header : '修改时间',
							sortable : true,
							dataIndex :'modify_time',
							width : 40
						}],
				bbar : new Ext.ux.PagingToolbar({
							store : infoStore,
							displayInfo : true
						}),
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				renderTo : 'grid'
			});
	var tbar = new Ext.Toolbar({
				id : 'tbar1',
				renderTo : grid.tbar,
				items : [{
							text : '查看历史版本信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								edit();
							}
						}]
			});
	function rederHT(value) {
		var html;
		if (value == 1) {
			html = "单页模板";
		} else if (value == 2) {
			html = "多页模板";
		} else if (value == 3) {
			html = "专题模板";
		} else if (value == 4) {
			html = "分页模板";
		} else {
			html = "";
		}
		return html;
	};

	grid.addListener('rowcontextmenu', rightClickFn);
//	grid.on('beforeedit', function(e) {
//				if (!compareAuth("INFO_CONTENT_SORT"))
//					return true;
//				else
//					return false;
//			});
//	grid.on("afteredit", function(e) {
//		var data = {};
//		data["content"] = e.field + "~" + e.record.data[e.field];
//		data["id"] = e.record.get("id");
//		Ext.Ajax.request({
//			method : 'post',
//			url : "/InfoContent.do?type=3",
//			params : data,
//			success : function(response) {
//				var jsondata = eval("(" + response.responseText + ")");
//				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
//					Info_Tip("修改排序成功！");
//					infoStore.reload();
//				} else {
//					Info_Tip("修改排序成功！");
//				}
//			},
//			failure : function() {
//				Warn_Tip();
//			}
//		});
//	});

	// 右键菜单
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看历史版本信息',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : edit
						}]
			});
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
			rightClick1.showAt(e.getXY());
	}
	grid.addListener('celldblclick', function(grid, rowIndex, columnIndex, e) {
				if (columnIndex == 7 && !compareAuth("INFO_CONTENT_SORT")) {
					return;
				} else
					edit();
			});
	// grid.addListener('rowdblclick', rowDblClick);
//	grid.on("click", function(e) {
//				var rows = grid.getSelectionModel().getSelections();
//				if (rows.length == 1 && !isEmpty(rows[0].get("tags"))) {
//					showEl("bj_menuItem");
//				} else {
//					hideEl("bj_menuItem");
//				}
//			});
	function rowDblClick(grid, rowIndex, e) {
		edit();
	}

	if (!isEmpty(getCurArgs("link"))) {
		if (!isEmpty(tagsAll)) {
			Ext.fly("tags").dom.value = tagsAll;
			infoStore.baseParams['content'] = 'tags~' + tagsAll;
			infoStore.load();
		}
	}
	infoStore.load();
};

// 查看历史版本信息
function edit() {
	var rows = grid.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	Id = rows.data.id;
	tempID = rows.data.temp_id;
	parentID = rows.data.parent_id;
	window.parent.createNewWidget("template_history", '历史模板',
			'/module/info/template_edit.jsp?Id=' + Id + '&tempID=' + tempID + '&parentID=' + parentID + '&marking=2');
};

function init() {
	Id = getCurArgs("Id");
	tempID = getCurArgs("tempID");
	parentID = getCurArgs("parentID");
	buildGrid();
};

Ext.onReady(function() {
			init();
		});
