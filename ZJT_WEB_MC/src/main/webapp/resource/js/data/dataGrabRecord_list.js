var grid_info, ds_info, source_store, area_win, fs, query_fs, win, sel_combo;
var area, area1, area2, area_grid, city_grid, areastore, citystore, highContent = {}, form_gov, win_gov;

var ds_temp;
var tree, root;
var email_grid;
var emailWin = null;

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	loadSource();
	buildGirid();
};

function loadSource(){
	var data = {};
	data["type"] = "7";
	$.ajax({
		type : 'POST',
		url : '/mc/DataGrabServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			var result = "";
			if (data.result != null) {
				result = data.result;
			}
			source_store = new Ext.data.SimpleStore({
				fields : ['value','text'],
				data : result
			});

		}
	});
}

// 右键菜单
var tbar = [{
			text : '来源管理',
			icon : "/resource/images/edit.gif",
			hidden : compareAuth("DATA_GRAB_SOURCE_LIST"),
			handler : showSource
		},{
			text : '材料打包下载',
			icon : "/resource/images/application_double.png",
			hidden : compareAuth("DATA_GRAB_DOWNLOAD"),
			handler : downloadData
		}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/DataGrabServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
						}, ["id","name","symbol", "shopCount", "matCount", "downloadUrl","createOn","createBy","updateOn","updateBy"]),
				baseParams : {
					type : 1,
					pageNo : 1
				},
				countUrl : '/mc/DataGrabServlet.do',
				countParams : {
					type : 2
				},
				remoteSort : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});

	grid_info = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm,{
									header : 'ID',
									sortable : false,
									dataIndex : 'id',
									hidden : true
								},{
							header : '来源',
							sortable : false,
							dataIndex : 'name',
							renderer : function(value, meta, record) {
								var name = record.get("name");
								var downloadUrl = record.get("downloadUrl");
								if (downloadUrl != null && "" != downloadUrl){
									return "<span style='float:left;'><img src='/resource/images/download.png'></span>" + name;
								}
								return name;
							}
						},{
							header : '标识',
							sortable : true,
							dataIndex : 'symbol',
							hidden : false
						}, {
							header : '供应商数',
							sortable : true,
							dataIndex : 'shopCount',
							hidden : false
						},{
							header : '材料数',
							sortable : true,
							dataIndex : 'matCount'
						},{
							header : '抓取时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
			
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
					xtype : 'combo',
					id : 'source_type',
					store : source_store,
					value:'所有来源',
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					width:90,
					valueField : 'value',
                    displayField : 'text',
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-", {
					xtype : "textfield",
					id : "name",
					width : 130,
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

	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

};

// 查询
function searchlist() {
	var symbol = Ext.getCmp("source_type").getValue();
	var name = Ext.getCmp("name").getValue();
	ds_info.baseParams["content"] = "symbol~" + symbol + ";name~" + name;
	ds_info.load();
};

function showSource(){
	window.parent.createNewWidget("dataGrabSource_list", '来源管理',
	'/module/data/dataGrabSource_list.jsp');
}

/**
 * 数据打包下载
 * @returns {Boolean}
 */
function downloadData(){
	var rows = grid_info.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Ext.MessageBox.alert("提示", "请勾选一条信息！");
		return false;
	}
	var row = grid_info.getSelectionModel().getSelected();
	var downloadUrl = row.get("downloadUrl");
	if (downloadUrl == null || "" == downloadUrl){
		Ext.MessageBox.alert("提示", "该数据暂不提供下载！");
		return false;
	}
	window.location.href = "http://ftp.zjtcn.com/material/" + downloadUrl;
}
