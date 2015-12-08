var ds, grid;
var pro = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : cur_website
		});

//begin add by heyang 2012-09-06 for 增加省份
var curProvince = getUser_WenProvince_c().getAt(0).data.text;
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var tempsite = cur_website.splice(0, 0, ["ALL", "全部"]);

var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];
//end add by heyang 2012-09-06 for 增加省份

// 右键菜单
var rightClick = new Ext.menu.Menu({
			shadow : false,
			id : 'rightClickCont',
			items : [{
						id : 'rMenu2',
						text : '查看详情',
						hidden : compareAuth("ASK_VIEW"),
						handler : showaskinfo
					}, {
						id : 'rMenu1',
						text : '解锁',
						hidden : compareAuth("ASK_UNLOCK"),
						handler : unlock
					}, {
						id : 'rMenu0',
						text : '删除',
						hidden : compareAuth("ASK_ADMIN_DEL"),
						handler : del
					}]
		});
var buildGrid = function() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ask/AskPriceServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, [{name:"id",type:'int'}, {name:"name"}, {name:"spec"}, {name:"memberID"}, {name:"createOn"},
						    {name:"province"},{name:"city"},{name:"addr"}]),
				baseParams : {
					type : 4,
					isLock : 1,
					pageSize : 20,
					searchPass : 1
				},
				countUrl : '/ask/AskPriceServlet.do',
				countParams : {
					type : 5,
					isLock : 1,
					searchPass : 1
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});

	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : true,
							width : 30,
							dataIndex : 'id'
						}, {
							header : '名称',
							sortable : false,
							width : 200,
							dataIndex : 'name'
						}, {
							header : '型号规格',
							sortable : false,
							width : 200,
							dataIndex : 'spec'
						}, {
							header : '发布人',
							sortable : false,
							width : 80,
							dataIndex : 'memberID'
						}, {
							header : '发布日期',
							sortable : true,
							width : 100,
							dataIndex : 'createOn'
						}, {
							header : '区域',
							sortable : false,
							dataIndex : 'addr'
							/*renderer:function(value,meta,record){
								var province = record.get("province");
								alert(province);
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + " " + city;
							}*/
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '查看详情',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("ASK_VIEW"),
							handler :showaskinfo /*function() {
								var rec = grid.getSelectionModel()
										.getSelected();
								showaskinfo(rec.data.id);
							}*/
						}, '-', {
							text : '解锁',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/lock_open.png",
							hidden : compareAuth("ASK_UNLOCK"),
							handler : unlock
						}, '-', {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							hidden : compareAuth("ASK_ADMIN_DEL"),
							handler : del
						}],
				bbar : pagetool,
				renderTo : 'ask_grid'
			});
	var tbar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
					xtype : 'combo',
					id : 'province',
					store : pro,
					triggerAction : 'all',
					emptyText : '请选择省',
					readOnly : true,
					width : 90,
					listeners : {
						select : function(combo, record, index) {
							/*var province = combo.getValue();
							if(province == "全部省份") {
								city = ["全部城市"];
							}else{
								city = zhcn.getCity(province).concat();;
								city.unshift("全部城市");
							}
							
							Ext.getCmp('city').store.loadData(city);
							Ext.getCmp('city').setValue("全部城市");
							Ext.getCmp('city').enable();*/
						}
					}
				},/* 
					{
					xtype : 'combo',
					id : 'city',
					store : city,
					triggerAction : 'all',
					emptyText : '请选择城市',
					readOnly : true,
					width : 120,
					disabled : true
				},*/"-",/*{
							xtype : 'label',
							text : '站点:'
						}, new Ext.form.ComboBox({
									store : pro,
									emptyText : "请选择",
									id : 'area_sel',
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									displayField : "text",
									allowBlank : false,
									// value : tempzhcn[0],
									listeners : {
										'select' : function(combo) {
											ds.baseParams["province"] = combo.value;
											ds.load();
										}
									}
								})*/
				{
					xtype : "textfield",
					id : "searchname",
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
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();

				selectinfo = row.get("id");
				showaskinfo(selectinfo);

			});
	ds.load();
};
function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};
Ext.onReady(function() {
			init();
		});

// 查看详细信息
function showaskinfo() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length == 1){
		var row = grid.getSelectionModel().getSelected();
		/*if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}*/
		/*window.parent.createNewWidget("ask_info", '普通询价信息',
				'/module/ask/ask_info.jsp?id=' + row.get("id"));*/
		window.parent.createNewWidget("ask_locked", '锁定询价信息',
				'/module/ask/ask_detail.jsp?lockPage=1&id=' + row.get("id"));
	}else{
		Ext.MessageBox.alert("提示", "请勾选一条询价！");
	}
	
};

// 解锁
function unlock() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	//begin update by heyang 2012-09-06 for 选择多条或者未选中进行解锁时进行提示 
	//if (ids.length > 0) {
	if (ids.length == 1) {
	//end update by heyang 2012-09-06 for 选择多条或者未选中进行解锁时进行提示 
		Ext.MessageBox.confirm("提示", "您确定解锁选中的信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskPriceServlet.do", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("解锁成功。");
							ds.reload();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				}, "type=12&isLock=0&id=" + grid.getSelectionModel().getSelected().get("id"));
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请一条选择信息。");
	}
};

// 删除
function del() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	//begin update by heyang 2012-09-06 for 选择多条或者未选中进行删除时进行提示 
	//if (ids.length > 0) {
	if (ids.length == 1) {
	//end update by heyang 2012-09-06 for 选择多条或者未选中进行删除时进行提示
		Ext.MessageBox.confirm("提示", "您确定删除选中的信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskPriceServlet.do", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("删除成功。");
							ds.reload();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				}, "type=13&id=" + grid.getSelectionModel().getSelected().get("id"));
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请一条选择信息。");
	}
}

//begin add by heyang for 2012-09-06
//查询信息
function searchlist() {
	// if (Ext.isEmpty(Ext.getCmp("area_sel").getValue())) {
	// Info_Tip("请选择区域。");
	// return;
	// }
	//ds.baseParams["province"] = Ext.getCmp("province").getValue();
	/*ds.baseParams["content"] = "name~" + Ext.fly("searchname").getValue() + ";memberID~"
			+ Ext.fly("searchuser").getValue() + ";corpName~"
			+ Ext.fly("corpName").getValue();*/
	ds.baseParams["content"] = "name~" + Ext.fly("searchname").getValue();
	var province = Ext.getCmp("province").getValue();
	//var city = Ext.getCmp("city").getValue();
	
	if(province != "全部省份"){
		ds.baseParams["content"] += ";addr~" + province;
		/*if(city != "全部城市") {
			ds.baseParams["content"] += ";city~" + city;
		}*/
	}
	
	//ds.baseParams["isreply"] = ck.getValue();
	ds.load();
};
//end add by heyang for 2012-09-06