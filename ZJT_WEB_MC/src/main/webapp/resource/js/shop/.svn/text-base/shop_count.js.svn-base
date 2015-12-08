var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander,grid3,storeCity;

var recordTemp,rowTemp,bodyTemp;

Ext.onReady(init);
function init() {
	EpShopCountAll();
	EpShopCountByProvince();
};

// 得到全部商铺统计
function EpShopCountAll() {
	
	var bar = new Ext.Toolbar({
		renderTo : "title",
		items:[{
			text : '按区域-档次统计',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("shop_count", '区域统计商铺档次',
						'/module/shop/shop_count.jsp');
			}
		},{
			text : '按区域-行业-档次统计',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("shop_area_cid_count", '区域+行业统计商铺档次',
						'/module/shop/shop_area_cid_count.jsp');
			}
		},'-',{
			text : '按行业-区域-档次统计',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("shop_cid_area_count", '行业+区域统计商铺档次',
						'/module/shop/shop_cid_area_count.jsp');
			}
		}]
	});
	Ext.lib.Ajax.request("post","/ep/EpShopCountServlet?type=1",{
		  
	    success : function(response) {
				var json = eval("(" + response.responseText
						+ ")");
				if (getState(json.state, commonResultFunc,
						json.result)) {
					for(var i=0;i<json.result.length;i++){
						$("#area").html(json.result[i].area);
						$("#ordinary").html(json.result[i].ordinary);
						$("#midRange").html(json.result[i].midRange);
						$("#midGrade").html(json.result[i].midGrade);
						$("#highGrade").html(json.result[i].highGrade);
						$("#total").html(json.result[i].total);
					}
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
};

function EpShopCountByCity(city,province){

storeCity = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : '/ep/EpShopCountServlet'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result'
					}, ["total", "ordinary", "midRange", "midGrade", "highGrade","city"]),
			baseParams : {
				type : 3,
				city:city.toString()
			},
			remoteSort : false
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
				dataIndex : 'city'
			},{
					
					sortable : true,
					dataIndex : 'total',
					renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
					      var  total= storeCity.getAt(rowIndex).get('total');  
					      return '<a onclick="linkShop('+"'"+province+"'"+','+null+','+"'"+storeCity.getAt(rowIndex).get('city')+"'"+')" href="#">' +total+'</a>';  
					  
					 }  
						
					}, {						
						sortable : true,
						dataIndex : 'ordinary',
						renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
						      var  ordinary= storeCity.getAt(rowIndex).get('ordinary');  
						      return '<a  onclick="linkShop('+"'"+province+"'"+','+"'"+1+"'"+','+"'"+storeCity.getAt(rowIndex).get('city')+"'"+')" href="#">' +ordinary+'</a>';  
						  
						 }
					}, {						
						sortable : true,
						dataIndex : "midRange",
						renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
							      var  midRange= storeCity.getAt(rowIndex).get('midRange');  
							      return '<a onclick="linkShop('+"'"+province+"'"+','+"'"+2+"'"+','+"'"+storeCity.getAt(rowIndex).get('city')+"'"+')" href="#">' +midRange+'</a>';  
							  
							 }
					}, {						
						sortable : true,
						dataIndex : "midGrade",
						renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
						      var  midGrade= storeCity.getAt(rowIndex).get('midGrade');  
						      return '<a onclick="linkShop('+"'"+province+"'"+','+"'"+3+"'"+','+"'"+storeCity.getAt(rowIndex).get('city')+"'"+')" href="#">' +midGrade+'</a>';  
						  
						 }
					}, {						
						sortable : true,
						dataIndex : "highGrade",
						renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
						      var  highGrade= storeCity.getAt(rowIndex).get('highGrade');  
						      return '<a  onclick="linkShop('+"'"+province+"'"+','+"'"+4+"'"+','+"'"+storeCity.getAt(rowIndex).get('city')+"'"+')" href="#">' +highGrade+'</a>';  
						  
						 }
						
					}],
			viewConfig : {
				forceFit : true
			},
			renderTo : "city"
		});
 storeCity.on("load",function(){
	 showCityCountList(recordTemp, bodyTemp, rowTemp);
 });
 
 storeCity.load();
//alert(city);
grid3.on("rowcontextmenu", function(grid, rowIndex, e) {
			e.preventDefault();
			rightClick.showAt(e.getXY());
		});
grid3.on("rowdblclick", function(grid, rowIndex, r) {
			//Rule_win("edit");
		});
}
function showCityCountList(record, body, row){
	expander.expandContent(record, body, row);
}
//得到省份商铺统计
function EpShopCountByProvince() {
	var storeProvince = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopCountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"total",type:'int'},{name:"ordinary",type:'int'},{name:"midRange",type:'int'},{name:"midGrade",type:'int'},{name:"highGrade",type:'int'},{name:"province"}]
						}),
				baseParams : {
					type : 2
				},
				remoteSort : false
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
	        var zhcn = new Zhcn_Select();
        	var city=zhcn.getCity(recordTemp.data.province);
        	var province=recordTemp.data.province;
        	rowTemp = row;
        	EpShopCountByCity(city,province);
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
					header : '地区',
					sortable : false,
					dataIndex : 'province',
					renderer:function(data,metadata,record,rowIndex,columnIndex,store){
						metadata.css='x-grid-back-color';
						 var  province= store.getAt(rowIndex).get('province');  
						 return province;
					}
				},{
							header : '总数',
							sortable : true,
							dataIndex : 'total',
							style:'',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
								metadata.css='x-grid-back-color';
							      var  total= store.getAt(rowIndex).get('total');  
							      return '<a onclick="linkShop('+"'"+store.getAt(rowIndex).get('province',"")+"'"+','+null+')" href="#" >' +total+'</a>';  
							  
							 }
						}, {
							header : '普通',
							sortable : true,
							dataIndex : 'ordinary',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  ordinary= store.getAt(rowIndex).get('ordinary');  
							      return '<a  onclick="linkShop('+"'"+store.getAt(rowIndex).get('province')+"'"+','+"1"+')" href="#">' +ordinary+'</a>';  
							  
							 }
						}, {
							header : "中档",
							sortable : true,
							dataIndex : "midRange",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  midRange= store.getAt(rowIndex).get('midRange');  
							      return '<a  onclick="linkShop('+"'"+store.getAt(rowIndex).get('province')+"'"+','+"2"+')" href="#">' +midRange+'</a>';  
							  
							 }
						}, {
							header : "中高档",
							sortable : true,
							dataIndex : "midGrade",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  midGrade= store.getAt(rowIndex).get('midGrade');  
							      return '<a  onclick="linkShop('+"'"+store.getAt(rowIndex).get('province')+"'"+','+"3"+')" href="#">' +midGrade+'</a>';  
							  
							 }
						}, {
							header : "高档",
							sortable : true,
							dataIndex : "highGrade",
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  highGrade= store.getAt(rowIndex).get('highGrade');  
							      return '<a  onclick="linkShop('+"'"+store.getAt(rowIndex).get('province')+"'"+','+"4"+')" href="#">' +highGrade+'</a>';  
							  
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
	gridProvince.on("rowdblclick", function(grid, rowIndex, r) {
				//Rule_win("edit");
			});

};

function linkShop(province,grade,city){
	var href="/module/enterprise/enterprise_shop_manage.jsp?";
	if(province !=null && province !=""){
		href +="&province="+province;
	}
	if(city !=null && city !=""){
		href +="&city="+city;
	}
	if(grade !=null && grade !=""){
		href +="&grade="+grade;
	}
		window.parent.createNewWidget("enterprise_shop_manage", '商铺管理',
		href);
	
	
}

