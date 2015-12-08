Ext.onReady(init);
var ds, grid;
var query_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["eid", "企业ID"], ["name", "企业名称"]]
});
var zhcn = new Zhcn_Select();

function init(){
	bulidGrid();
};


function bulidGrid(){
	var rightClick = new Ext.menu.Menu({
		id : 'rightClick',
		items : [{
			text : '查看/修改',
			hidden : compareAuth('CORP_SHOP_VIEW'),
			handler : shopDetail
		},{
			text : '解锁',
			hidden : compareAuth('CORP_SHOP_UNLOCK'),
			handler : unLockShop
		}]
	});
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/ep/EpShopServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		},['id', "eid", "name","createOn","updateBy", "isLock", "isAudit","province","city"]),
		baseParams : {
			type : 12,
			pageSize : 20,
			pageNo : 1,
			content : 'isLock~1'
		},
		countUrl : '/ep/EpShopServlet',
		countParams : {
			type : 13
		},
		remoteSort : true
	});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		columns : [
			new Ext.grid.RowNumberer({
				width : 30
			}), sm, {
				header : 'ID',
				sortable : false,
				width : 60,
				dataIndex : 'id',
				hidden : true
			},{
				header : '企业ID',
				sortable : true,
				width : 80,
				dataIndex : 'eid'
			},{
				header : '企业名称',
				sortable : true,
				width : 100,
				dataIndex : 'name'
			},{
				header:'区域',
				sortable:false,
				width:80,
				renderer:function(value, metaData, record){
					return record.get("province") + " " + record.get("city");
				}
			},{
				header : '创建时间',
				sortable : true,
				width : 100,
				dataIndex : 'createOn'
			},{
				header : '更新人',
				width : 80,
				sortable : true,
				dataIndex : 'updateBy'
			}],
		renderTo : 'grid',
		bbar : pagetool,
		tbar : [{
			id : 'rMenu1',
			text : '查看/修改',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth('CORP_SHOP_VIEW'),
			handler : shopDetail
		},"-",{
			text : '解锁',
			cls : 'x-btn-text-icon',
			icon : "/resource/images/lock_open.png",
			hidden : compareAuth('CORP_SHOP_UNLOCK'),
			handler : unLockShop
		}]
	});
	
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = ["全部城市"];
	comboProvinces = new Ext.form.ComboBox({
				id : 'province',
				store : pro,
				width : 100,
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
						    city = zhcn.getCity(province).concat();
						    city.unshift("全部城市");
					    }
						comboCities.store.loadData(city);
						comboCities.enable();
						searchList();
					}
				},

				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部省份',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				readOnly : true,
				fieldLabel : '请选择省份'
			});

	comboCities = new Ext.form.ComboBox({
				id : 'city',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部城市',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				fieldLabel : '选择城市',
				name : 'region',
				disabled : true,
				allowBlank : false,
				width : 100,
				listeners:{
					"select":searchList
				}

			});
	
	
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
					xtype : "combo",
					id : 'query_key',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 100,
					store : query_ds,
					value : 'name'
				}, "-", {
					id : 'query_value',
					xtype : 'textfield',
					width : 100
				}, "-", {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchList
				}, "-", "省份", comboProvinces, "城市", comboCities]
	});
	
	
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		shopDetail();
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e){
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	ds.load();
};

//打开查看修改页面
function shopDetail(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var eid = row.get("eid");
	window.parent.createNewWidget("shop_edit", '修改商铺信息',
			'/module/enterprise/enterprise_shop_info.jsp?eid=' + eid);
};
//解锁
function unLockShop(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择商铺");
		return;
	}
	var ids = [];
	for(var i = 0; i < sels.length; i++){
		ids.push(sels[i].get("eid"));
	}
	Ext.MessageBox.confirm("确认操作", "您确定要解锁选中的商铺吗?", function(op) {
		if(op == "yes"){
			Ext.lib.Ajax.request("post", '/ep/EpShopServlet', {
				success : function(response){
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,jsondata.result)){
						Info_Tip("操作成功!");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "type=9&id=" + ids);
		}
	});
};

//搜索
function searchList(){
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.fly("query_value").getValue();
	
	var content = "isLock~1;" + query_key + "~" + query_value;
	
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		content += ";province~" + province;
		
		if(city != "全部城市"){
			content += ";city~" + city;
		}
	}
	
	ds.baseParams['content'] = content;
	ds.load();
};