var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander,grid3,storeCity,storeProvince;

var recordTemp,rowTemp,bodyTemp;
var province = '';
var type = '';
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全国");

var typeArr = [["","全部类型"],['common', '普通供应商'], ['good', '优质供应商'],['credit','诚信供应商'],['ref','参考供应商']];
var type_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : typeArr
});

Ext.onReady(init);
function init() {
	var bar = new Ext.Toolbar({
		renderTo : "bar",
		items:[{
			text : '材料分类统计',
			icon : "/resource/images/map.png",
			hidden : compareAuth('SHOP_SUBCID_COUNT'),
			handler : function() {
				window.location.reload();
			}
		},{
			text : '品牌统计',
			icon : "/resource/images/map.png",
			hidden : compareAuth('SHOP_BRAND_COUNT'),
			handler : function() {
				window.parent.createNewWidget("shop_brand_count_list", '品牌统计',
						'/module/shop/shop_brand_count_list.jsp');
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
		value:"全国",
		width : 100,
		listeners:{
			'select':searchlist
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
	
	var tbar = new Ext.Toolbar({
		renderTo : "tbar",
		items:[ {
			xtype : "label",
			text : "区域："
		}, comboPro, "-",{
			xtype : "label",
			text : "供应商类型："
		},{
			id : 'type',
			xtype : 'combo',
			mode : 'local',
			readOnly : true,
			triggerAction : 'all',
			store : type_ds,
			valueField : 'value',
			displayField : 'text',
			width : 100,
			value : '',
			listeners:{
				'select':searchlist
			}
		}]
	});
	
	showAllDetail();
};

/**
 * 查询
 */
function searchlist(){
	province = Ext.getCmp("comboPro").getValue();
	type = Ext.getCmp("type").getValue();
	if ("全国" == province) province = '';
	storeProvince.baseParams["province"] = province;
	storeProvince.load();
}


function showDetail(cid){
storeCity = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : '/ep/EpShopCountServlet'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result'
					}, ["province", "cid", "subcid", "totalCount", "totalGoodCount", "totalCreditCount", "totalRefCount", "totalCommonCount",
						"topCount", "topGoodCount", "topCreditCount", "topRefCount", "topCommonCount",
						"middleTopCount", "middleTopGoodCount", "middleTopCreditCount", "middleTopRefCount", "middleTopCommonCount",
						"middleCount", "middleGoodCount", "middleCreditCount", "middleRefCount", "middleCommonCount", 
						"count", "goodCount", "creditCount", "refCount", "commonCount"]),
			baseParams : {
				type : 7,
				cid : cid,
				province : province,
				groupBy:"subcid"
			},
			remoteSort : true
		});
 var grid3 = new Ext.grid.GridPanel({
			id : 'grid_panel1', 
			autoWidth : true,
			autoHeight : true,
			stripeRows : true,
			loadMask : true,
			bodyStyle:'width:98.2%',
			store : storeCity,
			viewConfig : {
				forceFit : true
			},
			columns : [{
				header : '',
				sortable : true,
				dataIndex : 'subcid',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
				      var subcid = store.getAt(rowIndex).get('subcid');  
				      return getSubCidNameBySubcid(subcid, true);  
				 }
			},{
					
					sortable : true,
					dataIndex : 'totalCount',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
					      var totalCount = store.getAt(rowIndex).get('totalCount');
					      var subcid = store.getAt(rowIndex).get('subcid'); 
					      if ("common" == type){ //普通供应商
					    	  totalCount = store.getAt(rowIndex).get('totalCommonCount');
					      }else if ("good" == type){//优质供应商
					    	  totalCount = store.getAt(rowIndex).get('totalGoodCount');
					      }else if ("credit" == type){//诚信
					    	  totalCount = store.getAt(rowIndex).get('totalCreditCount');
					      }else if ("ref" == type){//参考
					    	  totalCount = store.getAt(rowIndex).get('totalRefCount');
					      }
					      return "<a  onclick=\"linkShop('','" + subcid +"','')\" href='javascript:void(0);'>" + totalCount + "</a>"; 
					 }  
					}, {						
						sortable : true,
						dataIndex : 'topCount',
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						      var  topCount = store.getAt(rowIndex).get('topCount');
						      var subcid = store.getAt(rowIndex).get('subcid');
						      if ("common" == type){ //普通供应商
						    	  topCount = store.getAt(rowIndex).get('topCommonCount');
						      }else if ("good" == type){//优质供应商
						    	  topCount = store.getAt(rowIndex).get('topGoodCount');
						      }else if ("credit" == type){//诚信
						    	  topCount = store.getAt(rowIndex).get('topCreditCount');
						      }else if ("ref" == type){//参考
						    	  topCount = store.getAt(rowIndex).get('topRefCount');
						      }
						      return "<a  onclick=\"linkShop('','" + subcid + "','4')\" href='javascript:void(0);'>" + topCount + "</a>"; 
						 }
					}, {						
						sortable : true,
						dataIndex : "middleTopCount",
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
							      var  middleTopCount = store.getAt(rowIndex).get('middleTopCount'); 
							      var subcid = store.getAt(rowIndex).get('subcid');
							      if ("common" == type){ //普通供应商
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopCommonCount');
							      }else if ("good" == type){//优质供应商
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopGoodCount');
							      }else if ("credit" == type){//诚信
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopCreditCount');
							      }else if ("ref" == type){//参考
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopRefCount');
							      }
							      return "<a  onclick=\"linkShop('','" + subcid + "','3')\" href='javascript:void(0);'>" + middleTopCount + "</a>"; 
							 }
					}, {						
						sortable : true,
						dataIndex : "middleCount",
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
							      var  middleCount = store.getAt(rowIndex).get('middleCount');
							      var subcid = store.getAt(rowIndex).get('subcid');
							      if ("common" == type){ //普通供应商
							    	  middleCount = store.getAt(rowIndex).get('middleCommonCount');
							      }else if ("good" == type){//优质供应商
							    	  middleCount = store.getAt(rowIndex).get('middleGoodCount');
							      }else if ("credit" == type){//诚信
							    	  middleCount = store.getAt(rowIndex).get('middleCreditCount');
							      }else if ("ref" == type){//参考
							    	  middleCount = store.getAt(rowIndex).get('middleRefCount');
							      }
							      return "<a  onclick=\"linkShop('','" + subcid + "','2')\" href='javascript:void(0);'>" + middleCount + "</a>";
							 }
					}, {						
						sortable : true,
						dataIndex : "count",
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
							      var  count = store.getAt(rowIndex).get('count'); 
							      var subcid = store.getAt(rowIndex).get('subcid');
							      if ("common" == type){ //普通供应商
							    	  count = store.getAt(rowIndex).get('commonCount');
							      }else if ("good" == type){//优质供应商
							    	  count = store.getAt(rowIndex).get('goodCount');
							      }else if ("credit" == type){//诚信
							    	  count = store.getAt(rowIndex).get('creditCount');
							      }else if ("ref" == type){//参考
							    	  count = store.getAt(rowIndex).get('refCount');
							      }
							      return "<a  onclick=\"linkShop('','" + subcid + "','1')\" href='javascript:void(0);'>" + count + "</a>";
							 }
					}],
			viewConfig : {
				forceFit : true
			},
			renderTo : "city"
		});
 storeCity.on("load",function(){
	 showDetailCountList(recordTemp, bodyTemp, rowTemp);
 });
 
 storeCity.load();
//alert(city);
grid3.on("rowcontextmenu", function(grid, rowIndex, e) {
			e.preventDefault();
			rightClick.showAt(e.getXY());
		});
grid3.on("rowdblclick", function(grid, rowIndex, e) {
			//Rule_win("edit");
	e.preventDefault();
		});
}
function showDetailCountList(record, body, row){
	expander.expandContent(record, body, row);
}

//信息价统计
function showAllDetail() {
	storeProvince = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopCountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:["province", "cid", "subcid", "totalCount", "totalGoodCount", "totalCreditCount", "totalRefCount", "totalCommonCount",
									"topCount", "topGoodCount", "topCreditCount", "topRefCount", "topCommonCount",
									"middleTopCount", "middleTopGoodCount", "middleTopCreditCount", "middleTopRefCount", "middleTopCommonCount",
									"middleCount", "middleGoodCount", "middleCreditCount", "middleRefCount", "middleCommonCount", 
									"count", "goodCount", "creditCount", "refCount", "commonCount"]
						}),
				baseParams : {
					type : 7,
					groupBy : "cid"
				},
				remoteSort : true
			});
	expander = new Ext.ux.grid.RowExpander({
		expandOnDblClick : false,
		tpl : temp,
		expendable : true
	});
	expander.beforeExpand=function(record, body, rowIndex){
		 if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
            if(this.tpl && this.lazyRender){
            	body.innerHTML =$("#city").html();
            	$("#city").html("");
            }
            return true;
        }else{
            return false;
        }
	};
	
	expander.expandRow = function(row){
		 if(typeof row == 'number'){
	            row = this.grid.view.getRow(row);
	        }
		 	bodyTemp = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
	        recordTemp = this.grid.store.getAt(row.rowIndex);
        	var cid = recordTemp.data.cid;
        	rowTemp = row;
        	//showDetail(cid);由于商铺管理列表无二级分类的筛选条件，所以暂时屏蔽该二级分类统计功能
        	//this.expandContent(record, body, row);
	};
	
	expander.expandContent = function(record, body, row){
		if(this.beforeExpand(record, body, row.rowIndex)){
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
	};
		
	var gridProvince = new Ext.grid.GridPanel({
				id : 'grid_panel2',
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,    
				loadMask : true,
				store : storeProvince,
				plugins : [expander],
				viewConfig : {
					forceFit : true
				},
			
				columns : [expander,{
					header : '材料分类',
					sortable : true,
					dataIndex : 'cid',
					renderer:function(data,metadata,record,rowIndex,columnIndex,store){
						metadata.css='x-grid-back-color';
						 var  cid = store.getAt(rowIndex).get('cid');
						 return cid + getStuffName(cid);
					}
				},{
							header : '总数',
							sortable : true,
							dataIndex : 'totalCount',
							style:'',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
								metadata.css='x-grid-back-color';
							      var  totalCount = store.getAt(rowIndex).get('totalCount');  
							      var cid = store.getAt(rowIndex).get('cid');
							      if ("common" == type){ //普通供应商
							    	  totalCount = store.getAt(rowIndex).get('totalCommonCount');
							      }else if ("good" == type){//优质供应商
							    	  totalCount = store.getAt(rowIndex).get('totalGoodCount');
							      }else if ("credit" == type){//诚信
							    	  totalCount = store.getAt(rowIndex).get('totalCreditCount');
							      }else if ("ref" == type){//参考
							    	  totalCount = store.getAt(rowIndex).get('totalRefCount');
							      }
							      return "<a  onclick=\"linkShop('" + cid +"','','')\" href='javascript:void(0);'>" + totalCount + "</a>";
							 }
						}, {
							header : '高档',
							sortable : true,
							dataIndex : 'topCount',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  topCount = store.getAt(rowIndex).get('topCount'); 
							      var cid = store.getAt(rowIndex).get('cid');
							      if ("common" == type){ //普通供应商
							    	  topCount = store.getAt(rowIndex).get('topCommonCount');
							      }else if ("good" == type){//优质供应商
							    	  topCount = store.getAt(rowIndex).get('topGoodCount');
							      }else if ("credit" == type){//诚信
							    	  topCount = store.getAt(rowIndex).get('topCreditCount');
							      }else if ("ref" == type){//参考
							    	  topCount = store.getAt(rowIndex).get('topRefCount');
							      }
							      return "<a  onclick=\"linkShop('" + cid + "','','4')\" href='javascript:void(0);'>" + topCount + "</a>";
							 }
						}, {
							header : "中高档",
							sortable : true,
							dataIndex : "middleTopCount",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  middleTopCount = store.getAt(rowIndex).get('middleTopCount');  
							      var cid = store.getAt(rowIndex).get('cid');
							      if ("common" == type){ //普通供应商
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopCommonCount');
							      }else if ("good" == type){//优质供应商
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopGoodCount');
							      }else if ("credit" == type){//诚信
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopCreditCount');
							      }else if ("ref" == type){//参考
							    	  middleTopCount = store.getAt(rowIndex).get('middleTopRefCount');
							      }
							      return "<a  onclick=\"linkShop('" + cid + "','','3')\" href='javascript:void(0);'>" + middleTopCount + "</a>";  
							 }
						}, {
							header : "中档",
							sortable : true,
							dataIndex : "middleCount",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  middleCount = store.getAt(rowIndex).get('middleCount');
							      var cid = store.getAt(rowIndex).get('cid');
							      if ("common" == type){ //普通供应商
							    	  middleCount = store.getAt(rowIndex).get('middleCommonCount');
							      }else if ("good" == type){//优质供应商
							    	  middleCount = store.getAt(rowIndex).get('middleGoodCount');
							      }else if ("credit" == type){//诚信
							    	  middleCount = store.getAt(rowIndex).get('middleCreditCount');
							      }else if ("ref" == type){//参考
							    	  middleCount = store.getAt(rowIndex).get('middleRefCount');
							      }
							      return "<a  onclick=\"linkShop('" + cid + "','','2')\" href='javascript:void(0);'>" + middleCount + "</a>";  
							 }
						}, {
							header : "普通",
							sortable : true,
							dataIndex : "middleTopCount",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  count = store.getAt(rowIndex).get('count');  
							      var cid = store.getAt(rowIndex).get('cid');
							      if ("common" == type){ //普通供应商
							    	  count = store.getAt(rowIndex).get('commonCount');
							      }else if ("good" == type){//优质供应商
							    	  count = store.getAt(rowIndex).get('goodCount');
							      }else if ("credit" == type){//诚信
							    	  count = store.getAt(rowIndex).get('creditCount');
							      }else if ("ref" == type){//参考
							    	  count = store.getAt(rowIndex).get('refCount');
							      }
							      return "<a  onclick=\"linkShop('" + cid + "','','1')\" href='javascript:void(0);'>" + count + "</a>";  
							 }
						}],
				viewConfig : {
					forceFit : true
				},
				renderTo : "center"
			});
	//storeProvince.setDefaultSort('province', 'desc');   
	storeProvince.load();
	gridProvince.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	gridProvince.on("rowdblclick", function(grid, rowIndex, e) {
				//Rule_win("edit");
		e.preventDefault();
			});
};

function linkShop(cid, subcid, grade){
	var href="/module/enterprise/enterprise_shop_manage.jsp?";
	if(province !=null && province !=""){
		href +="&province="+province;
	}
	if(grade !=null && grade !=""){
		href +="&grade="+grade;
	}
	if(cid !=null && cid !=""){
		href +="&cid="+cid;
	}
	if(subcid !=null && subcid !=""){
		href +="&subcid="+subcid;
	}
	window.parent.createNewWidget("enterprise_shop_manage", '商铺管理',
		href + "&type=" + type);
}

