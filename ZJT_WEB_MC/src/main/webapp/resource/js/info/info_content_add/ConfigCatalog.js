var area_grid,area_ds;
areaArray = [];
tradeArray = [];
professionalArray = [];
function initCatalog(queryType, countType, type){
	area_ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/InfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["cataName"]),
				baseParams : {
					page : 1,
					type : queryType,
					content : "",
					pageSize : 1000
				},
				countUrl : '/InfoContent.do',
				countParams : {
					type : countType
				}				
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "cataName"
			});	
			
	area_grid = new Ext.grid.GridPanel({
				store : area_ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : 300,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'cataName',
							hidden : true
						}, {
							header : '分类名称',
							sortable : true,
							width : 60,
							dataIndex : 'cataName'
						}],
				viewConfig : {
					forceFit : true
				}
			});
	areaWin = new Ext.Window({
				title : '分类名称列表',
				layout : 'fit',
				width : 600,
				height : 360,
				border : false,
				modal : true,
				frame : true,
				labelAlign : 'right',
				closeAction : 'close',
				items : [area_grid],
				buttons : [{
							text : '确定',
							handler : function() {
								AddCatalog(type);
							}
						}, {
							text : '取消',
							handler : function() {
								areaWin.close();
							}
						}]
			});
	
	//在加载完数据之后，选中已经选择的项
	area_ds.on("load",function(){
		if(type == 'areaSelected' && !Ext.isEmpty(areaArray)){
			selectRecord(areaArray);
		}
		if(type == 'tradeSelected' && !Ext.isEmpty(tradeArray)){
			selectRecord(tradeArray);
		}
		if(type == 'professionalSelect' && !Ext.isEmpty(professionalArray)){
			selectRecord(professionalArray);
		}
	},this,{delay:30});
}

//在列表中默认选择已经选择的项
var selectRecord = function(array){
	selectedArray = [];
	for(var i=0;i<array.length;i++){
		area_ds.each(function(record){
			if(record.data.cataName == array[i]){
				selectedArray.push(record);
			}
		});
	}
	area_grid.getSelectionModel().selectRecords(selectedArray, true);
}

//区域分类窗口
var openAreaWin = function() {
	initCatalog(19,22,"areaSelected");
	areaWin.show();
	area_ds.load();
};

//行业分类窗口
var openTradeWin = function(){
	initCatalog(21,24,"tradeSelected");
	areaWin.show();
	area_ds.load();
}

//专业分类窗口
var openProfessionalWin = function(){
	initCatalog(20,23,"professionalSelect");
	areaWin.show();
	area_ds.load();
}

//添加分类
function AddCatalog(type) {
	var rows = area_grid.getSelectionModel().getSelections();
	if(Ext.isEmpty(rows)){
		Ext.MessageBox.alert("提示", "请选择至少一条记录");
	}
	if(type == 'areaSelected'){
		areaArray = [];
		for(var i=0;i<rows.length;i++){
			areaArray.push(rows[i].get("cataName"));
		}
		Ext.get(type).dom.innerHTML = areaArray.toString();
	}
	
	if(type == 'professionalSelect'){
		professionalArray = [];
		for(var i=0;i<rows.length;i++){
			professionalArray.push(rows[i].get("cataName"));
		}
		Ext.get(type).dom.innerHTML = professionalArray.toString();
	}
	
	if(type == 'tradeSelected'){
		tradeArray = [];
		for(var i=0;i<rows.length;i++){
			tradeArray.push(rows[i].get("cataName"));
		}
		Ext.get(type).dom.innerHTML = tradeArray.toString();
	}
	
	areaWin.close();
}
