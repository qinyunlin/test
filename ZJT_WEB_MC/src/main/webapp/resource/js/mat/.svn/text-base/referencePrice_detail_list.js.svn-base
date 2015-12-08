var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander,grid3,storeCity;

var recordTemp,rowTemp,bodyTemp;

Ext.onReady(init);
function init() {
	showAllDetail();
};


function showDetail(province,city){
storeCity = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : '/material/MaterialServlet.do'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result'
					}, ["id", "province", "city", "town", "year","month","status","createOn","createBy"]),
			baseParams : {
				type : 14,
				content : "province~" + province + ";city~" + city
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
				dataIndex : ''
			},{
					
					sortable : true,
					dataIndex : 'year',
					renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
					      var  year = storeCity.getAt(rowIndex).get('year');  
					      return year;  
					 }  
						
					}, {						
						sortable : true,
						dataIndex : 'month',
						renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
						      var  month = storeCity.getAt(rowIndex).get('month');  
						      return month;  
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
grid3.on("rowdblclick", function(grid, rowIndex, r) {
			//Rule_win("edit");
		});
}
function showDetailCountList(record, body, row){
	expander.expandContent(record, body, row);
}

//信息价统计
function showAllDetail() {
	var storeProvince = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/material/MaterialServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"province"},{name:"city"},{name:"town"},{name:"year",type:'int'},{name:"month",type : "int"},{name:"status",type:"int"},{name:"createOn"},{name:"createBy"}]
						}),
				baseParams : {
					type : 14,
					totalFlag : 1
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
        	var province = recordTemp.data.province;
        	var city = recordTemp.data.city;
        	var town = recordTemp.data.town;
        	rowTemp = row;
        	showDetail(province,city,town);
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
						 var  province = store.getAt(rowIndex).get('province');  
						 var  city = store.getAt(rowIndex).get('city');  
						 return province + "-" + city;
					}
				},{
							header : '年份',
							sortable : true,
							dataIndex : 'year',
							style:'',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
								metadata.css='x-grid-back-color';
							      var  year = store.getAt(rowIndex).get('year');  
							      return year;  
							  
							 }
						}, {
							header : '月份',
							sortable : true,
							dataIndex : 'month',
							renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
								metadata.css='x-grid-back-color';
							      var  month = store.getAt(rowIndex).get('month');  
							      return month;  
							  
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


