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
			text : '添加来源',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("DATA_GRAB_SOURCE_ADD"),
			handler : addSource
		},{
			text : '删除来源',
			icon : "/resource/images/delete.gif",
			hidden : compareAuth("DATA_GRAB_SOURCE_DEL"),
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
							url : '/mc/DataGrabServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
						}, ["id","name","symbol","url","createOn","createBy"]),
				baseParams : {
					type : 5,
					pageNo : 1
				},
				countUrl : '/mc/DataGrabServlet.do',
				countParams : {
					type : 6
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
							header : '来源名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '标识',
							sortable : false,
							dataIndex : 'symbol',
							hidden : false
						},{
							header : '网址',
							sortable : false,
							dataIndex : 'url'
						},{
							header : '添加时间',
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
			
	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

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
						html : "来源名称："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "name",
						xtype : "textfield"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "标识："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "symbol",
						xtype : "textfield"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "网址："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					width:250,
					items : [ {
						width:200,
						id : "url",
						xtype : "textfield"
				  }]
				}]
			});
	
	addWin = new Ext.Window({
		id : "add_win",
		title : '添加来源',
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

/**
 * 删除来源
 */
function delSource(){
	var rows = grid_info.getSelectionModel().getSelections();
	if (rows.length != 1){
		Ext.MessageBox.alert("提示","请选择一条信息！");
		return;
	}
	Ext.Msg.confirm("警告","确定删除当前来源？",function(p){
	  	if(p=="yes"){
	  		var row = grid_info.getSelectionModel().getSelected();
	  		var data = {};
	  		data["type"] = "4";
	  		data["id"] = row.get("id");
	  		Ext.Ajax.request({
	  			url : '/mc/DataGrabServlet.do',
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
 * 添加来源
 * @returns
 */
function saveSource(){
	var name = Ext.getCmp("name").getValue();
	var symbol = Ext.getCmp("symbol").getValue();
	var url = Ext.getCmp("url").getValue();
	if (name == null || "" == name
			|| symbol == null || "" == symbol
			|| url == null || "" == url){
		Ext.MessageBox.alert("提示","请填写必要信息！");
		return;
	}
	if (!isURL(url)){
		Ext.MessageBox.alert("提示","网址格式错误！");
		return;
	}
	//保存
	var data = {};
	data["type"] = "3";
	data["content"] = "name~" + name + ";symbol~" + symbol + ";url~" + url;
	Ext.Ajax.request({
		url : '/mc/DataGrabServlet.do',
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

function isURL(url){ 
	var reg = /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/; 
    return reg.test(url);
} 