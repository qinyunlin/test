var ds,grid,type_ask,ds_2,grid_2,pagetool,pagetool_2;
//普通询价右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						id : 'rMenu1',
						text : '删除',
						handler : delask
					}]
		});
//企业询价右键菜单
var rightClick_vip = new Ext.menu.Menu({
			id : 'rightClickCont_vip',
			shadom:false,
			items : [{
						id : 'rMenu2',
						text : '删除',
						handler : delask_vip
					}]
		});

function buildGrid(){
	ds=new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
							url : '/ask/AskServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						},  ["id", "name", "memberID", "createOn", "revNum","updateBy"]),
				baseParams : {
					type :21,
					pageSize:20
				},
				countUrl : '/ask/AskServlet',
				countParams : {
					type : 22
				},
				remoteSort : true					  
	});
	ds_2=new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
							url : '/ep/EpRequestPriceServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						},  ["id", "name", "memberId", "updateOn", "resNum","updateBy"]),
				baseParams : {
					method :"search_del",
					pageSize:20
				},
				countUrl : '/ep/EpRequestPriceServlet',
				countParams : {
					method : "searchCount_del"
				},
				remoteSort : true					  
	});
	var cs = new Ext.grid.CheckboxSelectionModel();
	var cs_2 = new Ext.grid.CheckboxSelectionModel();
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	pagetool_2 = new Ext.ux.PagingToolbar({
				store : ds_2,
				displayInfo : true
			});
	grid=new Ext.grid.GridPanel({
		title:"询价高级管理",
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store:ds,
		tbar:[
			 	{
					text : "切换企业询价",
					icon:"/resource/images/application_double.png",
					handler :function(){
						hideEl("ask_grid");
						ds_2.load();
						Ext.fly("ask_grid_vip").show();
					}
				},"-",
				{
					xtype : "label",
					text : "询价名称："
				}, {
					xtype : "textfield",
					textLabel : "发布人",
					id : "ask_name"
				},
				{
					xtype : "label",
					text : "发布人："
				}, {
					xtype : "textfield",
					textLabel : "发布人",
					id : "ask_user"
				},
				{
					text : "查询",
					id : "search",
					icon:"/resource/images/zoom.png",
					handler : searchlist
				}
			 ],
		columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : 'ID',
							sortable : false,
							width : 20,
							dataIndex : 'id'
						}, {
							header : '名称',
							sortable : false,
							width : 210,
							dataIndex : 'name'
						}, {
							header : '发布人',
							sortable : true,
							width : 20,
							dataIndex : 'memberID'
						}, {
							header : '发布日期',
							sortable : true,
							width : 50,
							dataIndex : 'createOn'
						}, {
							header : '回复数',
							sortable : true,
							width : 16,
							dataIndex : 'revNum'
						},{
							header:"修改人",
							sortable:true,
							width:30,
							dataIndex:"updateBy"
						}],
				viewConfig : {
					forceFit : true
				},
				sm:cs,
				bbar:pagetool,
				renderTo:"ask_grid"
	});
	grid_2=new Ext.grid.GridPanel({
		title:"询价高级管理",
		autoWidth : true,
		autoHeight : true,
		store:ds_2,
		stripeRows : true,
		loadMask : true,
		tbar:[
			 	{
					text : "切换普通询价",
					icon:"/resource/images/application_double.png",
					handler : function(){
						hideEl("ask_grid_vip");
						ds.load();
						Ext.fly("ask_grid").show();		
					}
				},"-",
				{
					xtype : "label",
					text : "询价名称："
				}, {
					xtype : "textfield",
					id : "ask_name_vip"
				},
				{
					xtype : "label",
					text : "发布人："
				}, {
					xtype : "textfield",
					id : "ask_user_vip"
				},{
					xtype : "label",
					text : "企业名称："
				}, {
					xtype : "textfield",
					id : "ask_enterprise_vip"
				},
				{
					text : "查询",
					icon:"/resource/images/zoom.png",
					handler : searchlist_vip
				}
			 ],
		columns : [new Ext.grid.RowNumberer({
									width : 30
								}),{
							header : 'ID',
							sortable : false,
							width : 20,
							dataIndex : 'id'
						}, {
							header : '名称',
							sortable : false,
							width : 210,
							dataIndex : 'name'
						}, {
							header : '发布人',
							sortable : true,
							width : 20,
							dataIndex : 'memberId'
						}, {
							header : '发布日期',
							sortable : true,
							width : 50,
							dataIndex : 'updateOn'
						}, {
							header : '回复数',
							sortable : true,
							width : 16,
							dataIndex : 'resNum'
						},{
							header:"修改人",
							sortable:true,
							width:30,
							dataIndex:"updateBy"
						}],
				viewConfig : {
					forceFit : true
				},
				sm:cs_2,
				bbar:pagetool_2,
				renderTo:"ask_grid_vip"
	});
/*	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0; i < rows.length; i++) {
					ids.push(rows[i].get("id"));
				}
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_2.on("rowcontextmenu", function(grid, rowIndex, e) {
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0; i < rows.length; i++) {
					ids.push(rows[i].get("id"));
				}
				e.preventDefault();
				rightClick_vip.showAt(e.getXY());
			});
	*/
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();
	
				showaskinfo(row.get("id"));

			});
	grid_2.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();

				showaskinfo_vip(row.get("id"));

			});
	ds.load();
	
};

/*--------------逻辑代码-------------*/
function searchlist(){

	ds.baseParams["content"] = "name~" + Ext.fly("ask_name").getValue()
			+ ";memberID~" + Ext.fly("ask_user").getValue();
	ds.load();
};
function searchlist_vip(){
	ds_2.baseParams["name"] = Ext.fly("ask_name_vip").getValue().trim();
	ds_2.baseParams["memberID"] = Ext.fly("ask_name_vip").getValue().trim();
	ds_2.baseParams["corpName"]=Ext.fly("ask_enterprise_vip").getValue().trim();
	ds_2.load();
};

//普通询价删除
function delask(){
	if (ids.length > 0) {
	Ext.MessageBox.confirm("提示","您确定删除该信息吗？",function(op){
		if(op=="yes")	
		{
			Ext.lib.Ajax.request("post", "/ask/AskServlet",
			{
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
			}, "type=2&id="+ids.toString());	
		}
		});
	}else{
		Ext.MessageBox.alert("提示","请选择信息。");	
	}
};
//企业询价删除
function delask_vip(){
	if (ids.length > 0) {
	Ext.MessageBox.confirm("提示","您确定删除该信息吗？",function(op){
		if(op=="yes")	
		{
			Ext.lib.Ajax.request("post", "/ep/EpRequestPriceServlet?method=delete",
			{
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Ext.MessageBox.alert("提示","询价删除成功。");
						ids = [];
						ds_2.reload();
						pagetool.updateInfo();
					}
				},
				failure : function(response) {
					Ext.MessageBox.alert("提示", "非常抱歉，您的操作发生错误。");
				}
			}, "id="+ids.toString());	
		}
		});
	}else{
		Ext.MessageBox.alert("提示","请选择信息。");	
	}
};
//普通询价查看详细
function showaskinfo(id) {
		window.parent.createNewWidget("ask_info", '普通询价信息',
				'/module/ask/ask_info.jsp?id='+id);
};
//企业询价查看详细
function showaskinfo_vip(id) {
		window.parent.createNewWidget("ask_info_vip", '企业询价信息',
				'/module/ask/ask_info_vip.jsp?id='+id);
	};

function init(){
	buildGrid();
};
Ext.onReady(init);