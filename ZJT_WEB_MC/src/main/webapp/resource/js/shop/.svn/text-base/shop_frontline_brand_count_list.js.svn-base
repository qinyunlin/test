var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander;
var recordTemp,rowTemp,bodyTemp;
var ds,grid;

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
					province : "",
					viewFrontlineBrandFlag : "1",
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
				}),{
					header : '品牌',
					width:150,
					sortable : true,
					dataIndex : 'brand',
					renderer: function (value, meta, record) {  
					      var brand = record.get('brand');  
					      return brand;
					 }
				},{
					header : '一线品牌地区',
					width:150,
					sortable : true,
					dataIndex : 'frontlineAreas',
					renderer: function (value, meta, record) {  
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null) return "";
					      return frontlineAreas;
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
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null){
					    	  frontlineAreas = "";
					      }
					      return "<a  onclick=\"linkShop('" + frontlineAreas + "','" + brand + "','')\" href='javascript:void(0);'>" + totalCount + "</a>";
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
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null){
					    	  frontlineAreas = "";
					      }
					      return "<a  onclick=\"linkShop('" + frontlineAreas + "','" + brand + "','common')\" href='javascript:void(0);'>" + count + "</a>";
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
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null){
					    	  frontlineAreas = "";
					      }
					      return "<a  onclick=\"linkShop('" + frontlineAreas + "','" + brand + "','good')\" href='javascript:void(0);'>" + goodCount + "</a>";
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
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null){
					    	  frontlineAreas = "";
					      }
					      return "<a  onclick=\"linkShop('" + frontlineAreas + "','" + brand + "','credit')\" href='javascript:void(0);'>" + creditCount + "</a>";
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
					      var frontlineAreas = record.get('frontlineAreas');  
					      if (frontlineAreas == null){
					    	  frontlineAreas = "";
					      }
					      return "<a  onclick=\"linkShop('" + frontlineAreas + "','" + brand + "','ref')\" href='javascript:void(0);'>" + refCount + "</a>";
					}
				}],
				renderTo : "grid",
				border : false,
				loadMask : true,
				bbar : pagetool
			});
	ds.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	ds.on("rowdblclick", function(grid, rowIndex, r) {
		e.preventDefault();
	});
	//ds.load();
}

/**
 * 查询
 */
function searchlist(){
	province = "";
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
	});//从头加载数据
	var viewFrontlineBrandFlag = "1";
	ds.baseParams["province"] = province;
	ds.baseParams["cid"] = cid;
	ds.baseParams["subcid"] = subcid;
	ds.baseParams["viewFrontlineBrandFlag"] = viewFrontlineBrandFlag;
	ds.load();
}

function selectTree(node){
	var selectNode = tree.getNodeById(node.id);
	tree.getSelectionModel().select(selectNode);
	selectNode.expand();
}

function linkShop(frontlineAreas,brand, type){
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
	if(frontlineAreas !=null && frontlineAreas !=""){
		href +="&frontlineAreas="+frontlineAreas;
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

function setFrontlineBrandCount(){
	
}