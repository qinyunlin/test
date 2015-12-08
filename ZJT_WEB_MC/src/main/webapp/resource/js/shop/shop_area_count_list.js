var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander,grid3,storeCity,storeProvince;

var recordTemp,rowTemp,bodyTemp;
var curr_cid = '';
var cid = getCidNameArray();
cid.unshift(["全部一级分类","全部一级分类"]);

var cid_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : cid
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
				window.parent.createNewWidget("shop_subcid_count_list", '材料分类统计',
						'/module/shop/shop_subcid_count_list.jsp');
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
				window.location.reload();
			}
		}]
	});
	
	var comboCid = new Ext.form.ComboBox({
		id : "comboCid",
		store : cid_ds,
		value:"全部一级分类",
		width : 180,
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
			text : "材料分类："
		}, comboCid]
	});
	
	showAllDetail();
};

/**
 * 查询
 */
function searchlist(){
	curr_cid = Ext.getCmp("comboCid").getValue();
	if ("全部一级分类" == curr_cid) curr_cid = '';
	storeProvince.baseParams["cid"] = curr_cid;
	storeProvince.load();
}


function showDetail(province){
storeCity = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : '/ep/EpShopCountServlet'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result'
					}, ["province", "cid", "subcid", "grade","totalCount","count","goodCount","creditCount","refCount"]),
			baseParams : {
				type : 9,
				province : province,
				cid : curr_cid,
				groupBy:"grade"
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
				dataIndex : 'grade',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
				      var grade = store.getAt(rowIndex).get('grade');  
				      if ("4" == grade){
				    	  return "高档";
				      }else if ("3" == grade){
				    	  return "中高档";
				      }else if ("2" == grade){
				    	  return "中档";
				      }
				      return "普通";
				 }
			},{
					
					sortable : true,
					dataIndex : 'totalCount',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
					      var totalCount = store.getAt(rowIndex).get('totalCount');
					      var grade = store.getAt(rowIndex).get('grade'); 
					      return "<a  onclick=\"linkShop('" + province + "','','" + grade + "')\" href='javascript:void(0);'>" + totalCount + "</a>"; 
					 }  
					}, {						
						sortable : true,
						dataIndex : 'count',
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						      var  count = store.getAt(rowIndex).get('count');
						      var grade = store.getAt(rowIndex).get('grade');
						      return "<a  onclick=\"linkShop('" + province + "','common','" + grade + "')\" href='javascript:void(0);'>" + count + "</a>"; 
						 }
					}, {						
						sortable : true,
						dataIndex : "goodCount",
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
							      var  goodCount = store.getAt(rowIndex).get('goodCount'); 
							      var grade = store.getAt(rowIndex).get('grade');
							      return "<a  onclick=\"linkShop('" + province + "','good','" + grade + "')\" href='javascript:void(0);'>" + goodCount + "</a>"; 
							 }
					}, {						
						sortable : true,
						dataIndex : "creditCount",
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
							      var  creditCount = store.getAt(rowIndex).get('creditCount');
							      var grade = store.getAt(rowIndex).get('grade');
							      return "<a  onclick=\"linkShop('" + province + "','credit','" + grade + "')\" href='javascript:void(0);'>" + creditCount + "</a>";
							 }
					}, {						
						sortable : true,
						dataIndex : "refCount",
						renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
							      var  refCount = store.getAt(rowIndex).get('refCount'); 
							      var grade = store.getAt(rowIndex).get('grade');
							      return "<a  onclick=\"linkShop('" + province + "','ref','" + grade + "')\" href='javascript:void(0);'>" + refCount + "</a>";
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
							fields:["province", "cid", "subcid", "grade","totalCount","count","goodCount","creditCount","refCount"]
						}),
				baseParams : {
					type : 9,
					groupBy : "province"
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
        	var province = recordTemp.data.province;
        	rowTemp = row;
        	showDetail(province);
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
					header : '区域-省/直辖市',
					sortable : true,
					dataIndex : 'province',
					renderer:function(data,metadata,record,rowIndex,columnIndex,store){
						metadata.css='x-grid-back-color';
						 var province = store.getAt(rowIndex).get('province');
						 return province;
					}
				},{
							header : '总数',
							sortable : true,
							dataIndex : 'totalCount',
							style:'',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
								metadata.css='x-grid-back-color';
							      var  totalCount = store.getAt(rowIndex).get('totalCount');  
							      var province = store.getAt(rowIndex).get('province');
							      return "<a  onclick=\"linkShop('" + province +"','','')\" href='javascript:void(0);'>" + totalCount + "</a>";
							 }
						}, {
							header : '普通供应商',
							sortable : true,
							dataIndex : 'count',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  count = store.getAt(rowIndex).get('count'); 
							      var province = store.getAt(rowIndex).get('province');
							      return "<a  onclick=\"linkShop('" + province + "','common','')\" href='javascript:void(0);'>" + count + "</a>";
							 }
						}, {
							header : "优质供应商",
							sortable : true,
							dataIndex : "goodCount",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  goodCount = store.getAt(rowIndex).get('goodCount');  
							      var province = store.getAt(rowIndex).get('province');
							      return "<a  onclick=\"linkShop('" + province + "','good','')\" href='javascript:void(0);'>" + goodCount + "</a>";  
							 }
						}, {
							header : "诚信供应商",
							sortable : true,
							dataIndex : "creditCount",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  creditCount = store.getAt(rowIndex).get('creditCount');
							      var province = store.getAt(rowIndex).get('province');
							      return "<a  onclick=\"linkShop('" + province + "','credit','')\" href='javascript:void(0);'>" + creditCount + "</a>";  
							 }
						}, {
							header : "参考供应商",
							sortable : true,
							dataIndex : "refCount",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  refCount = store.getAt(rowIndex).get('refCount');  
							      var province = store.getAt(rowIndex).get('province');
							      return "<a  onclick=\"linkShop('" + province + "','ref','')\" href='javascript:void(0);'>" + refCount + "</a>";  
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

function linkShop(province, type, grade){
	var href="/module/enterprise/enterprise_shop_manage.jsp?";
	if(province !=null && province !=""){
		href +="&province="+province;
	}
	if(grade !=null && grade !=""){
		href +="&grade="+grade;
	}
	if(curr_cid !=null && curr_cid !=""){
		href +="&cid="+curr_cid;
	}
	if(type !=null && type !=""){
		href +="&type="+type;
	}
	window.parent.createNewWidget("enterprise_shop_manage", '商铺管理',
		href);
}

