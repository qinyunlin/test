var zhcn = new Zhcn_Select();
var ds,grid;
var upload_form,win;
var query_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["eid", "企业ID"], ["name", "企业名称"]]
});

Ext.onReady(init);

function init(){
	buildGride();
};

function buildGride(){
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
					url : '/ep/EpShopServlet'
				}),
		reader : new Ext.data.JsonReader({
					root : 'result'
				}, ['id', "eid", "name", "fname", "shopType", "cname",'cid',
						"cname1", "createOn", "createBy", "updateOn","province","city",
						"updateBy", "isLock", "isAudit", "Auditor",
						"validDate", "sort", "manageID", "degree","catalogId"]),
		baseParams : {
			type : 12,
			pageSize : 20,
			pageNo : 1,
			dir:'desc',
			sort:'updateOn',
			diyCondition:'hasUnAuditMat=1 and isLock=0 and isAudit=1',
			content : ''
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
	
	
	
	grid = new Ext.grid.EditorGridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : 'ID',
					sortable : true,
					width : 60,
					dataIndex : 'id',
					hidden : true
				}, {
					header : '企业ID',
					sortable : true,
					width : 50,
					dataIndex : 'eid'
				}, {
					header : '企业名称',
					sortable : true,
					width : 80,
					dataIndex : 'name'
				}, {
					header : '区域',
					sortable : false,
					width : 50,
					renderer:function(value, metaData, record){
						return record.get("province") + " " + record.get("city");
					}
				},{
					header : '创建时间',
					sortable : true,
					width : 80,
					dataIndex : 'createOn'
				},{
					header : '更新人',
					width : 20,
					sortable : true,
					dataIndex : 'updateBy'
				}],
		renderTo : 'grid',
		bbar : pagetool,
		tbar : [{
					text : '查看/修改',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/edit.gif',
					hidden : compareAuth('CORP_SHOP_VIEW'),
					handler : shopDetail
				}, "-", {
					text : '查看未审核材价',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/application_double.png',
					hidden : compareAuth('CORP_SHOP_LOCK'),
					handler : viewUnAuditMaterial
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
					'select':searchList
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
	
	ds.load();
	
}

function viewUnAuditMaterial(){
	
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一个商铺");
		return;
	}
	
	var row = grid.getSelectionModel().getSelected();
	
	window.parent.createNewWidget("mat_fac_detail_u", '未审核材料列表',
			'/module/mat/mat_fac_detail_u.jsp?eid=' + row.get("eid") + "&fname="
					+ row.get("name"));
}

//查看修改商铺
function shopDetail() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一个商铺");
		return;
	}
	
	var row = grid.getSelectionModel().getSelected();
	var eid = row.get("eid");
	window.parent.createNewWidget("shop_edit", '修改商铺信息',
			'/module/enterprise/enterprise_shop_info.jsp?eid=' + eid);
};

function searchList(){
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.getCmp("query_value").getValue();
	
	var content = query_key + "~" + query_value + ";";
	
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		content += "province~" + province;
		
		if(city != "全部城市"){
			content += ";city~" + city;
		}
	}
	
	ds.baseParams['content'] = content;
	ds.load();
	
}
