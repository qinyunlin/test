var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander;
var recordTemp,rowTemp,bodyTemp;
var ds,grid;
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
var refTreeFlag = true;
//pro.unshift("全国");

var bar = new Ext.Toolbar({
	items:[{
		text : '材料分类统计',
		icon : "/resource/images/map.png",
		hidden : compareAuth('SHOP_SUBCID_COUNT'),
		handler : function() {
			window.parent.createNewWidget("shop_subcid_count_list", '材料分类统计',
					'/module/shop/shop_subcid_count_list.jsp');
		}
	},{
		text : '品牌统计',
		icon : "/resource/images/map.png",
		hidden : compareAuth('SHOP_BRAND_COUNT'),
		handler : function() {
			window.location.reload();
		}
	},{
		text : '区域统计',
		icon : "/resource/images/map.png",
		hidden : compareAuth('SHOP_AREA_COUNT'),
		handler : function() {
			window.parent.createNewWidget("shop_area_count_list", '区域统计',
					'/module/shop/shop_area_count_list.jsp');
		}
	}]
});

var comboPro = new Ext.form.ComboBox({
	id : "comboPro",
	store : pro,
	value:"广东",
	width : 100,
	listeners:{
		'select':function(){
			refTreeFlag = true;
			searchlist();
		}
	},
	valueField : "value",
	displayField : "text",
	mode : 'local',
	forceSelection : true,
	emptyText : '',
	editable : false,
	triggerAction : 'all',
	allowBlank : false,
	readOnly : true
});

Ext.onReady(init);
function init() {
	//buildGrid();
};

//品牌统计列表
function buildGrid(){
	//ds = new Ext.data.Store({
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopCountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:["id", "province", "cid", "subcid", "brand", "frontlineAreas", "totalCount","count","goodCount","creditCount","refCount"]
						}),
				baseParams : {
					type : 8,
					pageNo : 1,
					pageSize : 20,
					province : "广东",
					groupBy : "brand"
				},
				countUrl : '/ep/EpShopCountServlet',
				countParams : {
					type : 11
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true
	});
	grid = new Ext.grid.GridPanel({
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoScroll: true,
				//height : parseInt(parent.Ext.get("tab_shop_brand_count_list_iframe").getHeight()) - 4,
				autoHeight : true,
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				autoExpandColumn : 'common',
				frame : true,
				columns : [new Ext.grid.RowNumberer({
					width : 30
				}),sm,{
					header : '品牌',
					width:150,
					sortable : true,
					dataIndex : 'brand',
					renderer: function (value, meta, record) {  
					      var brand = record.get('brand');  
					      return brand;
					 }
				},{
					header : '一线品牌',
					width:80,
					sortable : true,
					dataIndex : 'frontlineAreas',
					renderer: function (value, meta, record) {  
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null || frontlineAreas.indexOf(province) == -1) return "";
					      return "√";
					 }
				},
				{
					header : '总数',
					width:120,
					sortable : true,
					dataIndex : 'totalCount',
					renderer: function (value, meta, record) {  
					      var totalCount = record.get('totalCount');
					      var brand = record.get('brand'); 
					      return "<a  onclick=\"linkShop('" + brand + "','')\" href='javascript:void(0);'>" + totalCount + "</a>";
					 }  
				}, 
				{	
					header : '普通供应商',
					width:120,
					sortable : true,
					dataIndex : 'count',
					renderer: function (value, meta, record) {  
					      var  count = record.get('count');
					      var brand = record.get('brand');
					      return "<a  onclick=\"linkShop('" + brand + "','common')\" href='javascript:void(0);'>" + count + "</a>";
					 }
				}, 
				{			
					header : '优质供应商',
					width:120,
					sortable : true,
					dataIndex : "goodCount",
					renderer: function (value, meta, record) {  
					      var  goodCount = record.get('goodCount'); 
					      var brand = record.get('brand');
					      return "<a  onclick=\"linkShop('" + brand + "','good')\" href='javascript:void(0);'>" + goodCount + "</a>";
					}
				}, 
				{		
					header : '诚信供应商',
					width:120,
					sortable : true,
					dataIndex : "creditCount",
					renderer: function (value, meta, record) {  
					      var  creditCount = record.get('creditCount');
					      var brand = record.get('brand');
					      return "<a  onclick=\"linkShop('" + brand + "','credit')\" href='javascript:void(0);'>" + creditCount + "</a>";
					}
				}, 
				{
					header : '参考供应商',
					width:120,
					sortable : true,
					dataIndex : "refCount",
					renderer: function (value, meta, record) {  
					      var  refCount = record.get('refCount'); 
					      var brand = record.get('brand');
					      return "<a  onclick=\"linkShop('" + brand + "','ref')\" href='javascript:void(0);'>" + refCount + "</a>";
					}
				}],
				renderTo : "grid",
				border : false,
				loadMask : true,
				tbar : bar,
				bbar : pagetool
			});
	var tbar1 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items:[ {
			text : '查看全国',
			icon : "/resource/images/map.png",
			hidden : compareAuth('SHOP_SUBCID_COUNT'),
			handler : function() {
				window.parent.createNewWidget("shop_frontline_brand_count_list", '全国品牌统计',
						'/module/shop/shop_frontline_brand_count_list.jsp?province=全国&frontFlag=1');
			}
		},{
			text : '设置/取消一线品牌',
			icon : "/resource/images/map.png",
			hidden : compareAuth('SHOP_FRONTLINE_BRAND_SETTING'),
			handler : setFrontlineArea
		},{
			xtype : "checkbox",
			textLabel : "仅查看一线品牌",
			id : "viewFrontlineBrand",
			width : 20,
			enableKeyEvents : true,
			listeners : {
				afterrender:function(obj){  
					 obj.getEl().dom.onclick = function(){ 
						refTreeFlag = false;
						searchlist();
					 }
				}
			}
		}, {
			xtype : "label",
			html : "<span id='frontlineBrandCount'>仅查看一线品牌</span>"
		}]
	});
	
	var tbar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items:[ {
			xtype : "label",
			text : "区域："
		}, comboPro]
	});
	ds.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	ds.on("rowdblclick", function(grid, rowIndex, r) {
		e.preventDefault();
	});
	//ds.load();
	//setFrontlineBrandCount();
}

function setFrontlineBrandCount(){
	province = Ext.getCmp("comboPro").getValue();
	if ("全国" == province) province = '';

	var data = {};
	data["type"] = 11;
	data["province"] = province;
	data["viewFrontlineBrandFlag"] = "1";
	data["cid"] = cid;
	data["subcid"] = subcid;
	data["groupBy"] = "brand";
	Ext.Ajax.request({
		url:'/ep/EpShopCountServlet',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				$("#frontlineBrandCount").html("仅查看一线品牌(" + data.result + ")");
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}

/**
 * 查询
 */
function searchlist(){
	province = Ext.getCmp("comboPro").getValue();
	if ("全国" == province) province = '';
	
	if (refTreeFlag){
		var node = tree.getSelectionModel().getSelectedNode();
		tree.loader.baseParams["province"] = province;
		var treeLoad = tree.getLoader();
		treeLoad.load(root, function(){
			if (node != null && "undefined" != node){
				if (4 == node.id.length){ //二级节点需要先展开一级节点
					var cidNode = tree.getNodeById(node.parentNode.id);
					tree.getSelectionModel().select(cidNode);
					cidNode.expand(true, true, function(){
						var selectNode = tree.getNodeById(node.id);
						tree.getSelectionModel().select(selectNode);
					}, null);
				}
				selectTree(node);
			}
		});
	}
	//从头加载数据
	var viewFrontlineBrandObj = document.getElementById("viewFrontlineBrand");
	var viewFrontlineBrandFlag = "0";
	if (viewFrontlineBrandObj.checked){
		viewFrontlineBrandFlag = "1";
	}
	ds.baseParams["province"] = province;
	ds.baseParams["cid"] = cid;
	ds.baseParams["subcid"] = subcid;
	ds.baseParams["viewFrontlineBrandFlag"] = viewFrontlineBrandFlag;
	ds.load();
	setFrontlineBrandCount();
}

function selectTree(node){
	var selectNode = tree.getNodeById(node.id);
	tree.getSelectionModel().select(selectNode);
	selectNode.expand();
}

function linkShop(brand, type){
	var href="/module/enterprise/enterprise_shop_manage.jsp?";
	if(brand !=null && brand !=""){
		href +="&brand="+brand;
	}
	if(cid !=null && cid !=""){
		href +="&cid="+cid;
	}
	if(subcid !=null && subcid !=""){
		href +="&subcid="+subcid;
	}
	if(type !=null && type !=""){
		href +="&type="+type;
	}
	if(province !=null && province !=""){
		href +="&province="+province;
	}
	window.parent.createNewWidget("enterprise_shop_manage", '商铺管理',
		href);
}


function buildView() {
	var view = new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [/*{
			region : 'north',
			height : 25,
			tbar : [bar]
		},*/ {
			region : 'west',
			width : 250,
			split : true,
			autoScroll : true,
			items : tree
		}, {
			region : 'center',
			items : grid
		} ]
	});
};

/**
 * 设置/取消一线品牌
 */
function setFrontlineArea(){
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length == 0){
		Ext.MessageBox.alert("提示","请选择一条信息！");
		return;
	}
	var ids = [];//id集合
	var brands = [];//品牌集合
	var hasCount = 0;//已设置当前省份一线品牌数量
	var noCount = 0;//未设置当前省份一线品牌数量
	for ( var i = 0; i < rows.length; i++) {
		var frontlineAreas = rows[i].get("frontlineAreas");
		if (frontlineAreas == null){
			frontlineAreas = "";
		}
		if (frontlineAreas.indexOf(province) == -1){
			hasCount += 1;
		}else{
			noCount += 1;
		}
		ids.push(rows[i].get('id'));
		brands.push(rows[i].get("brand"));
	}
	if (hasCount != rows.length && noCount != rows.length){
		Ext.MessageBox.alert("提示","请选择一种状态的品牌信息！");
		return;
	}
	var msg = "取消";
	var isSet = "0";//取消
	if (hasCount > 0){ //设置
		isSet = "1";
		msg = "设置";
	}
	Ext.Ajax.request({
		url : '/ep/EpShopCountServlet',
		params : {
			type : 12,
			province : province,
			ids : ids.toString(),
			brands : brands.toString(),
			cid : cid,
			subcid : subcid,
			isSet : isSet
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				Ext.MessageBox.alert('提示', msg + '成功！');
				ds.load();
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	});
}

