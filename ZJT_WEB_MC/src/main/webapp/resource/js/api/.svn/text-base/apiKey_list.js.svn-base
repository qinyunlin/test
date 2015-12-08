var grid_info, ds_info, source_store, area_win, fs, query_fs, win, sel_combo;
var area, area1, area2, area_grid, city_grid, areastore, citystore, highContent = {}, form_gov, win_gov;

var ds_temp;
var tree, root;
var email_grid;
var emailWin = null;

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();
};

// 右键菜单
var tbar = [{
			text : '添加',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("API_KEY_ADD"),
			handler : addSource
		},{
			text : '修改',
			icon : "/resource/images/edit.gif",
			hidden : compareAuth("API_KEY_EDIT"),
			handler : updateSource
		},{
			text : '删除',
			icon : "/resource/images/delete.gif",
			hidden : compareAuth("API_KEY_DEL"),
			handler : delSource
		}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/api.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
						}, ["id","corpName","ename","effectDate","key","createOn","createBy","updateOn","updateBy"]),
				baseParams : {
					type : 1,
					pageNo : 1
				},
				countUrl : '/mc/api.do',
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
							header : '软件商(中文)',
							sortable : false,
							width:100,
							dataIndex : 'corpName'
						},{
							header : '软件商(英文)',
							sortable : false,
							width:100,
							dataIndex : 'ename'
						},{
							header : '有效期',
							sortable : true,
							dataIndex : 'effectDate',
							width:60,
							hidden : false,
							renderer:function(value,meta,record){
								var effectDate = record.get("effectDate");
								return effectDate.split(" ")[0];
							}
						},{
							header : '授权码',
							sortable : false,
							width:250,
							dataIndex : 'key',
							renderer:function(value,meta,record){
								var key = record.get("key");
								return "<span title='" + key + "'>" + key + "</span>";
							}
						},{
							header : '创建时间',
							sortable : true,
							width:80,
							dataIndex : 'createOn'
						},{
							header : '创建人',
							sortable : false,
							width:50,
							dataIndex : 'createBy'
						},{
							header : '更新时间',
							sortable : true,
							width:80,
							dataIndex : 'updateOn'
						},{
							header : '更新人',
							sortable : false,
							width:50,
							dataIndex : 'updateBy'
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
					store : [ [ "corpName", "软件商(中文)" ],[ "ename", "软件商(英文)" ], [ "`key`", "授权码" ]],
					triggerAction : 'all',
					readOnly : true,
					width : 100,
					value : "corpName",
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-", {
					xtype : "textfield",
					id : "source_val",
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

//查询
function searchlist() {
	var source_type = Ext.getCmp("source_type").getValue();
	var source_val = Ext.getCmp("source_val").getValue();
	ds_info.baseParams["content"] = source_type + "~" + source_val;
	ds_info.load();
};

var addPanel,addWin;
function addSource(){
	addPanel = new Ext.Panel(
			{
				renderTo : "source_panel",
				layout : "table",
				border : false,
				id : "source_add",
				layoutConfig : {
					columns : 2
				},
				items : [{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "软件商(中文)："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "corpName",
						xtype : "textfield"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "软件商(英文)："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "ename",
						xtype : "textfield"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "有效期："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						id : 'effectDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						editable : false,
						minValue : new Date(),
						value: new Date(), 
						emptyText : '请选择'
					}]
				}]
			});
	
	addWin = new Ext.Window({
		id : "add_win",
		title : '添加信息',
		closeAction : "close",
		width : 660,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ addPanel ],
		buttons : [{
			text : '确定',
			handler : saveSource
		}, {
			text : '关闭',
			handler : function() {
				addWin.close();
			}
		}]
	});
	addWin.show();
}


var upPanel,upWin;
function updateSource(){
	var rows = grid_info.getSelectionModel().getSelections();
	if (rows.length != 1){
		Ext.MessageBox.alert("提示","请选择一条信息！");
		return;
	}
	var row = grid_info.getSelectionModel().getSelected();
	upPanel = new Ext.Panel(
			{
				renderTo : "source_panel",
				layout : "table",
				border : false,
				id : "up_source_add",
				layoutConfig : {
					columns : 2
				},
				items : [{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "软件商(中文)："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "up_corpName",
						xtype : "textfield",
						value : row.get("corpName")
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "软件商(英文)："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "up_ename",
						xtype : "textfield",
						value : row.get("ename")
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "有效期："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						id : 'up_effectDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						editable : false,
						minValue : new Date(),
						value: row.get("effectDate").split(" ")[0], 
						emptyText : '请选择'
					}]
				}]
			});
	
	upWin = new Ext.Window({
		id : "up_win",
		title : '修改信息',
		closeAction : "close",
		width : 660,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ upPanel ],
		buttons : [{
			text : '确定',
			handler : upSource
		}, {
			text : '关闭',
			handler : function() {
				upWin.close();
			}
		}]
	});
	upWin.show();
}

/**
 * 删除
 */
function delSource(){
	var rows = grid_info.getSelectionModel().getSelections();
	if (rows.length != 1){
		Ext.MessageBox.alert("提示","请选择一条信息！");
		return;
	}
	Ext.Msg.confirm("警告","确定删除当前信息？",function(p){
	  	if(p=="yes"){
	  		var row = grid_info.getSelectionModel().getSelected();
	  		var data = {};
	  		data["type"] = "5";
	  		data["id"] = row.get("id");
	  		Ext.Ajax.request({
	  			url : '/mc/api.do',
	  			params : data,
	  			success : function(response) {
	  				var data = eval("(" + response.responseText + ")");
	  				if (getState(data.state, commonResultFunc, data.result)) {
	  					ds_info.load();
	  					Info_Tip("删除成功!");
	  				}
	  			},
	  			failure : function() {
	  				Warn_Tip();
	  			}
	  		});
	  	}
	  	else{
	  		return false;
	  	}
	});
}

/**
 * 添加
 * @returns
 */
function saveSource(){
	var corpName = Ext.getCmp("corpName").getValue();
	var ename = Ext.getCmp("ename").getValue();
	var effectDate = Ext.getCmp("effectDate").getValue();
	if (corpName == null || "" == corpName ||
		ename == null || "" == ename || 
		effectDate == null || "" == effectDate){
		Ext.MessageBox.alert("提示","请填写必要信息！");
		return;
	}
	//保存
	var data = {};
	data["type"] = "3";
	data["corpName"] = corpName;
	data["ename"] = ename;
	var date = new Date(effectDate);
	data["effectDate"] = date.format("Y-m-d");
	Ext.Ajax.request({
		url : '/mc/api.do',
		params : data,
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				ds_info.load();
				Info_Tip("添加成功!");
				Ext.getCmp("add_win").close();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}


/**
 * 修改
 * @returns
 */
function upSource(){
	var rows = grid_info.getSelectionModel().getSelections();
	if (rows.length != 1){
		Ext.MessageBox.alert("提示","请选择一条信息！");
		return;
	}
	var row = grid_info.getSelectionModel().getSelected();
	var id = row.get("id");
	var corpName = Ext.getCmp("up_corpName").getValue();
	var ename = Ext.getCmp("up_ename").getValue();
	var effectDate = Ext.getCmp("up_effectDate").getValue();
	if (corpName == null || "" == corpName
			|| ename == null || "" == corpName
			|| effectDate == null || "" == effectDate){
		Ext.MessageBox.alert("提示","请填写必要信息！");
		return;
	}
	
	var date = new Date(effectDate);
	var curr_effectDate = date.format("Y-m-d");
	var old_corpName = row.get("corpName");
	var old_ename = row.get("ename");
	var old_effectDate = row.get("effectDate").split(" ")[0];
	if (corpName == old_corpName
			&& ename == old_ename
			&& curr_effectDate == old_effectDate){
		Ext.MessageBox.alert("提示","数据无变化，无需保存！");
		return;
	}
	//保存
	var data = {};
	data["type"] = "4";
	data["id"] = id;
	data["corpName"] = corpName;
	data["ename"] = ename;
	data["effectDate"] = curr_effectDate;
	Ext.Ajax.request({
		url : '/mc/api.do',
		params : data,
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				ds_info.load();
				Info_Tip("修改成功!");
				Ext.getCmp("up_win").close();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
