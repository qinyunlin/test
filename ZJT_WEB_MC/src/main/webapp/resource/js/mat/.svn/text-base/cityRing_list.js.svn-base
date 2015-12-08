Ext.onReady(init);
var grid, ds,  pagesize = 30;
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");

function init() {
	buildGrid();

	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '双击信息可以显示备注详细，再次双击可以编辑列表信息。');
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : [{
				id : 'rMenu1',
				icon:'/resource/images/add.gif',
				text : '添加城市圈',
				handler : addCityRing
			}, {
				id : 'rMenu2',
				text : '查看/修改',
				handler:gotoUpdatePage
			}, {
				id : 'rMenu3',
				text : '删除',
				handler:del_sel

			}]
});


function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/cityRingServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","code","province", "name", "cityAndFactor"]),
				baseParams : {
					type : 1,
					page : 1,
					pageSize : pagesize,
					content :"isDeleted~0",
					
				},
				countUrl : '/cityRingServlet',
				countParams : {
					type : 2
				},
				remoteSort : true,
				timeout : 2 * 60 * 1000
			});
	/*ds.setDefaultSort("createOn", "DESC");*/

	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});


	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		autoScroll : true,
		store : ds,
		loadMask : true,
		viewConfig : {
			forceFit : true
		},
		sm : sm,

		autoHeight : true,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : 'id',
					sortable : false,
					dataIndex : 'id',
					hidden : true
				}, {
					header:'城市圈号',
					sortable:true,
					dataIndex:'code',
					width:10
					
				},{
					header : '省',
					sortable : true,
					dataIndex : 'province',
					width:15
				},{
					header : '城市圈',
					sortable : true,
					dataIndex : 'name',
					width:15
				
				}, {
					header : '包含城市',
					sortable : false,
					dataIndex : 'cityAndFactor',				
		
					renderer : function(value, meta, record) {
						var cityOrFactor = record.get("cityAndFactor");
						var citys =cityOrFactor.split(";");
						var city="";
						for(var i=0;i<citys.length-1;i++){
							city+=citys[i].split("~")[0]+";";
						}
						return city;
					}
				}],
		renderTo : 'cityRing_grid',
		bbar : pagetool,
		tbar : [{
					text : '添加城市圈',
					icon : '/resource/images/add.gif',
					handler : addCityRing
				}, '-', {
					text : '查看/修改',
					icon : '/resource/images/edit.gif',
					handler :gotoUpdatePage
					
				}, '-', {
					text : '删除',
					icon : '/resource/images/delete.gif',
					handler : del_sel,
				}]
	});
	
	
	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
			xtype : 'combo',
			id : 'province',
			store : pro,
			triggerAction : 'all',
			emptyText : '请选择省',
			readOnly : true,
			width:90
		},'-',{
			         stype:'label',
			         text:'城市圈名称'
		        },{
					xtype : 'textfield',
					fieldLabel : '名称',
					id : 'name',
					width: 140,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},{
					text : '查询',
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	
	
	
	ds.load();


	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
};

//添加城市圈
function addCityRing(){
	window.parent.createNewWidget("add_cityRing", '添加城市圈','/module/mat/add_cityRing.jsp');
}
//跳转到查看/修改
function gotoUpdatePage(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一条信息");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var id = row.get("id");
	window.parent.createNewWidget("cityRing_detail", '查看/修改','/module/mat/cityRing_detail.jsp?id='+id);
}


// 删除城市圈
function del_sel() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一条信息");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var id = row.get("id");
	var province = row.get("province");
	
	Ext.MessageBox.confirm("确认操作", "确定删除该城市圈？", function(o) {
				if (o == "yes") {
					 var loadMarsk = new Ext.LoadMask(document.body, {
					    	msg : '正在处理中.....!',
					        disabled : false,
					        store : store
					      });
					  loadMarsk.show();
					var store=Ext.lib.Ajax.request("post", '/cityRingServlet?type=6', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										
										
										//同步城市圈下参考价标题
										Ext.Ajax.request({
											url : '/cityRingServlet',
											method:'POST',
											params:{
												type:10,
												id:id,
											},
											success:function(response){
												var json = eval("(" + response.responseText + ")");
												if (getState(json.state, commonResultFunc, json.result)) {
													Info_Tip("删除成功。");
													 loadMarsk.hide();
													 ds.reload();
												}
											},
											failure : function() {
												loadMarsk.hide();
												Warn_Tip();
											}
										});
										
										
										 
										/*//同步城市圈下参考价标题
										Ext.lib.Ajax.request("post", '/cityRingServlet?type=10', {
											success : function(response) {
												
											}
										});*/
									}else{
										loadMarsk.hide();
									}
								},
								failure : function() {
									loadMarsk.hide();
									Warn_Tip();
								}
							}, "id=" + id + "&province=" + province);
				}
			});

};


function searchlist(){
	var province = Ext.getCmp("province").getValue();
	if (province == null || "请选择省" == province || "全部省份" == province){
		province = "";
	}
	var name = Ext.getCmp("name").getValue();
	var content = "isDeleted~0";
    if(name != null && name != ""){
    	content += ";name~" + name;
    }
    if ("" != province){
    	content += ";province~" + province;
    }
    ds.baseParams["content"] = content;
	ds.reload();
}

