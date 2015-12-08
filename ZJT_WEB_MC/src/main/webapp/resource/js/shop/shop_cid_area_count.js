var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander,grid3,storeCity;

var recordTemp,rowTemp,bodyTemp;

Ext.onReady(init);
function init() {
	EpShopCountAll();
	EpShopCountByCidAll();
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

function EpShopCountByCid(cid){

storeCity = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : '/ep/EpShopCountServlet'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result'
					}, ["total", "ordinary", "midRange", "midGrade", "highGrade","cname","cid","province"]),
			baseParams : {
				type : 6,
				cid:cid.toString()
			},
			remoteSort : false
		});
 var grid3 = new Ext.grid.GridPanel({
			autoWidth : true,
			autoHeight : true,
			stripeRows : true,
			loadMask : true,
			bodyStyle:'width:99.2%',
			store : storeCity,
			viewConfig : {
				forceFit : true
			},
			columns : [{
				header : '',
				sortable : true,
				dataIndex : 'province'
			},{
				sortable : true,
				dataIndex : 'total',
				renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
				      var  total= storeCity.getAt(rowIndex).get('total');  
				      var province= storeCity.getAt(rowIndex).get('province');
				      return '<a onclick="linkShop('+"'"+province+"'"+','+null+','+"'"+cid+"'"+')" href="#">' +total+'</a>';  
				  
				 }
			}, {
				sortable : true,
				dataIndex : 'ordinary',
				renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
					      var  ordinary= storeCity.getAt(rowIndex).get('ordinary');  
					      var province= storeCity.getAt(rowIndex).get('province');
					      return '<a  onclick="linkShop('+"'"+province+"'"+','+"'"+1+"'"+','+"'"+cid+"'"+')" href="#">' +ordinary+'</a>';  
					  
					 }
			}, {
				sortable : true,
				dataIndex : "midRange",
				renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
				      var  midRange= storeCity.getAt(rowIndex).get('midRange');  
				      var province= storeCity.getAt(rowIndex).get('province');
				      return '<a  onclick="linkShop('+"'"+province+"'"+','+"'"+2+"'"+','+"'"+cid+"'"+')" href="#">' +midRange+'</a>';  
				  
				  
				 }
			}, {
				sortable : true,
				dataIndex : "midGrade",
				renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
				      var  midGrade= storeCity.getAt(rowIndex).get('midGrade');  
				      var province= storeCity.getAt(rowIndex).get('province');
				      return '<a  onclick="linkShop('+"'"+province+"'"+','+"'"+3+"'"+','+"'"+cid+"'"+')" href="#">' +midGrade+'</a>';  
				  
				 }
			}, {
				sortable : true,
				dataIndex : "highGrade",
				renderer: function (data, metadata, record, rowIndex, columnIndex, storeCity) {  
				      var  highGrade= storeCity.getAt(rowIndex).get('highGrade');  
				      var province= storeCity.getAt(rowIndex).get('province');
				      return '<a  onclick="linkShop('+"'"+province+"'"+','+"'"+4+"'"+','+"'"+cid+"'"+')" href="#">' +highGrade+'</a>';  
				  
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

}
function showCityCountList(record, body, row){
	expander.expandContent(record, body, row);
}
//得到省份商铺统计
function EpShopCountByCidAll() {
	var storeProvince = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopCountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"total",type:'int'},{name:"ordinary",type:'int'},{name:"midRange",type:'int'},{name:"midGrade",type:'int'},{name:"highGrade",type:'int'},{name:"cname"},{name:"cid"}]
						}),
				baseParams : {
					type : 5
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
	
        	rowTemp = row;
        	EpShopCountByCid(recordTemp.data.cid);
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
					header : '行业',
					sortable : false,
					dataIndex : 'cname',
					renderer:function(data,metadata,record,rowIndex,columnIndex,store){
						metadata.css='x-grid-back-color';
						 var  cname= store.getAt(rowIndex).get('cname');  
						 return cname;
					}
				},{
							header : '总数',
							sortable : true,
							dataIndex : 'total',
							renderer: function (data, metadata, record, rowIndex, columnIndex, storeProvince) {  
								metadata.css='x-grid-back-color';
							      var  total= storeProvince.getAt(rowIndex).get('total');  
							      var  cid= storeProvince.getAt(rowIndex).get('cid');  
							      return '<a onclick="linkShop('+null+','+null+','+"'"+cid+"'"+')" href="#" >' +total+'</a>';  
							  
							 }
						}, {
							header : '普通',
							sortable : true,
							dataIndex : 'ordinary',
							renderer: function (data, metadata, record, rowIndex, columnIndex, storeProvince) {  
								metadata.css='x-grid-back-color';
								      var  ordinary= storeProvince.getAt(rowIndex).get('ordinary');  
								      var  cid= storeProvince.getAt(rowIndex).get('cid');  
								      return '<a  onclick="linkShop('+null+','+"'"+1+"'"+','+"'"+cid+"'"+')" href="#" >' +ordinary+'</a>';  
								  
								 }
						}, {
							header : "中档",
							sortable : true,
							dataIndex : "midRange",
							renderer: function (data, metadata, record, rowIndex, columnIndex, storeProvince) {  
								metadata.css='x-grid-back-color';
							      var  midRange= storeProvince.getAt(rowIndex).get('midRange');  
							      var  cid= storeProvince.getAt(rowIndex).get('cid');  
							      return '<a  onclick="linkShop('+null+','+"'"+2+"'"+','+"'"+cid+"'"+')" href="#" >' +midRange+'</a>';  
							  
							 }
						}, {
							header : "中高档",
							sortable : true,
							dataIndex : "midGrade",
							renderer: function (data, metadata, record, rowIndex, columnIndex, storeProvince) { 
								metadata.css='x-grid-back-color';
							      var  midGrade= storeProvince.getAt(rowIndex).get('midGrade');  
							      var  cid= storeProvince.getAt(rowIndex).get('cid');  
							      return '<a  onclick="linkShop('+null+','+"'"+3+"'"+','+"'"+cid+"'"+')" href="#" >' +midGrade+'</a>';  
							  
							 }
						}, {
							header : "高档",
							sortable : true,
							dataIndex : "highGrade",
							renderer: function (data, metadata, record, rowIndex, columnIndex, storeProvince) {  
								metadata.css='x-grid-back-color';
							      var  highGrade= storeProvince.getAt(rowIndex).get('highGrade');  
							      var  cid= storeProvince.getAt(rowIndex).get('cid');  
							      return '<a  onclick="linkShop('+null+','+"'"+4+"'"+','+"'"+cid+"'"+')" href="#" >' +highGrade+'</a>';  
							  
							 }
							
						}],
				viewConfig : {
					forceFit : true
				},
				renderTo : "center"
			});
	storeProvince.load();


};

function linkShop(province,grade,cid){
	var href="/module/enterprise/enterprise_shop_manage.jsp?";
	if(province !=null && province !=""){
		href +="&province="+province;
	}
	if(cid !=null && cid !=""){
		href +="&cid="+cid;
	}
	if(grade !=null && grade !=""){
		href +="&grade="+grade;
	}
		window.parent.createNewWidget("enterprise_shop_manage", '商铺管理',
		href);
	
	
}

