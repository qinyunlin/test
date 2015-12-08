var year="2014", url = "/mc/appMember.do";

Ext.onReady(init);
function init() {
	getAppMemberStatisticsYear();
	getAppMemberStatistics();
	getAskReplyStatisticsYear();
	getAskReplyStatistics();
	getReplyCommentStatisticsYear();
	getReplyCommentStatistics();
	getTBStatisticsYear();
	getTBStatistics();
};

function getAppMemberStatisticsYear(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 24,
			year : year
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				var yearJson = jsondata.result;
				var html = "";
				for(var i=0;i<yearJson.length;i++){
					html += '<option value="'+yearJson[i].month+'">'+yearJson[i].month+'</option>';
					
				}
				$("#year0").html(html);
				$("#year0").val(year);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

function getAppMemberStatistics(){
	var statisticsStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : url
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					fields:[{name:"type",type:'int'},{name:year+"-01",type:'int'},{name:year+"-02",type:'int'}
					        ,{name:year+"-03",type:'int'},{name:year+"-04",type:'int'},{name:year+"-05",type:'int'}
					        ,{name:year+"-06",type:'int'},{name:year+"-07",type:'int'},{name:year+"-08",type:'int'}
					        ,{name:year+"-09",type:'int'},{name:year+"-10",type:'int'},{name:year+"-11",type:'int'}
					        ,{name:year+"-12",type:'int'}]
				}),
		baseParams : {
			type : 25,
			year :year
		},
		remoteSort : false
	});
	new Ext.grid.GridPanel({
		id : 'grid_panel0',
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		store : statisticsStore,
		viewConfig : {
			forceFit : true
		},
		columns : [{
			header : '',
			sortable : false,
			dataIndex : 'type',
			renderer:function(data,metadata,record,rowIndex,columnIndex,store){
				var type = store.getAt(rowIndex).get('type');  
				 if(type == 0)
					 type = "所有会员";
				 else
					 type = "实名认证会员";
				 return type;
			}
		},{
			header : year+'-01',
			sortable : false,
			dataIndex : year+'-01'
		}, {
			header : year+'-02',
			sortable : false,
			dataIndex : year+'-02'
		}, {
			header : year+'-03',
			sortable : false,
			dataIndex : year+'-03'
		}, {
			header : year+'-04',
			sortable : false,
			dataIndex : year+'-04'
		}, {
			header : year+'-05',
			sortable : false,
			dataIndex : year+'-05'
		}, {
			header : year+'-06',
			sortable : false,
			dataIndex : year+'-06'
		}, {
			header : year+'-07',
			sortable : false,
			dataIndex : year+'-07'
		}, {
			header : year+'-08',
			sortable : false,
			dataIndex : year+'-08'
		}, {
			header : year+'-09',
			sortable : false,
			dataIndex : year+'-09'
		}, {
			header : year+'-10',
			sortable : false,
			dataIndex : year+'-10'
		}, {
			header : year+'-11',
			sortable : false,
			dataIndex : year+'-11'
		}, {
			header : year+'-12',
			sortable : false,
			dataIndex : year+'-12'
		}],
		viewConfig : {
			forceFit : true
		},
		renderTo : "center0"
	});
	statisticsStore.load();
}
function getAskReplyStatisticsYear(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 26,
			year : year
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				var yearJson = jsondata.result;
				var html = "";
				for(var i=0;i<yearJson.length;i++){
					html += '<option value="'+yearJson[i].month+'">'+yearJson[i].month+'</option>';
					
				}
				$("#year1").html(html);
				$("#year1").val(year);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

function getAskReplyStatistics(){
	var statisticsStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : url
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					fields:[{name:"type",type:'int'},{name:year+"-01",type:'int'},{name:year+"-02",type:'int'}
					        ,{name:year+"-03",type:'int'},{name:year+"-04",type:'int'},{name:year+"-05",type:'int'}
					        ,{name:year+"-06",type:'int'},{name:year+"-07",type:'int'},{name:year+"-08",type:'int'}
					        ,{name:year+"-09",type:'int'},{name:year+"-10",type:'int'},{name:year+"-11",type:'int'}
					        ,{name:year+"-12",type:'int'}]
				}),
		baseParams : {
			type : 27,
			year :year
		},
		remoteSort : false
	});
	new Ext.grid.GridPanel({
		id : 'grid_panel1',
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		store : statisticsStore,
		viewConfig : {
			forceFit : true
		},
		columns : [{
			header : '',
			sortable : false,
			dataIndex : 'type',
			renderer:function(data,metadata,record,rowIndex,columnIndex,store){
				var type = store.getAt(rowIndex).get('type');  
				 if(type == 0)
					 type = "所有回复";
				 else
					 type = "最佳回复";
				 return type;
			}
		},{
			header : year+'-01',
			sortable : false,
			dataIndex : year+'-01'
		}, {
			header : year+'-02',
			sortable : false,
			dataIndex : year+'-02'
		}, {
			header : year+'-03',
			sortable : false,
			dataIndex : year+'-03'
		}, {
			header : year+'-04',
			sortable : false,
			dataIndex : year+'-04'
		}, {
			header : year+'-05',
			sortable : false,
			dataIndex : year+'-05'
		}, {
			header : year+'-06',
			sortable : false,
			dataIndex : year+'-06'
		}, {
			header : year+'-07',
			sortable : false,
			dataIndex : year+'-07'
		}, {
			header : year+'-08',
			sortable : false,
			dataIndex : year+'-08'
		}, {
			header : year+'-09',
			sortable : false,
			dataIndex : year+'-09'
		}, {
			header : year+'-10',
			sortable : false,
			dataIndex : year+'-10'
		}, {
			header : year+'-11',
			sortable : false,
			dataIndex : year+'-11'
		}, {
			header : year+'-12',
			sortable : false,
			dataIndex : year+'-12'
		}],
		viewConfig : {
			forceFit : true
		},
		renderTo : "center1"
	});
	statisticsStore.load();
}
function getReplyCommentStatisticsYear(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 28,
			year : year
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				var yearJson = jsondata.result;
				var html = "";
				for(var i=0;i<yearJson.length;i++){
					html += '<option value="'+yearJson[i].month+'">'+yearJson[i].month+'</option>';
					
				}
				$("#year2").html(html);
				$("#year2").val(year);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function getReplyCommentStatistics(){
	var statisticsStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : url
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					fields:[{name:"type",type:'int'},{name:year+"-01",type:'int'},{name:year+"-02",type:'int'}
					        ,{name:year+"-03",type:'int'},{name:year+"-04",type:'int'},{name:year+"-05",type:'int'}
					        ,{name:year+"-06",type:'int'},{name:year+"-07",type:'int'},{name:year+"-08",type:'int'}
					        ,{name:year+"-09",type:'int'},{name:year+"-10",type:'int'},{name:year+"-11",type:'int'}
					        ,{name:year+"-12",type:'int'}]
				}),
		baseParams : {
			type : 29,
			year :year
		},
		remoteSort : false
	});
	new Ext.grid.GridPanel({
		id : 'grid_panel2',
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		store : statisticsStore,
		viewConfig : {
			forceFit : true
		},
		columns : [{
			header : '',
			sortable : false,
			dataIndex : 'type',
			renderer:function(data,metadata,record,rowIndex,columnIndex,store){
				var type = store.getAt(rowIndex).get('type');  
				 if(type == 0)
					 type = "有用";
				 else
					 type = "不准";
				 return type;
			}
		},{
			header : year+'-01',
			sortable : false,
			dataIndex : year+'-01'
		}, {
			header : year+'-02',
			sortable : false,
			dataIndex : year+'-02'
		}, {
			header : year+'-03',
			sortable : false,
			dataIndex : year+'-03'
		}, {
			header : year+'-04',
			sortable : false,
			dataIndex : year+'-04'
		}, {
			header : year+'-05',
			sortable : false,
			dataIndex : year+'-05'
		}, {
			header : year+'-06',
			sortable : false,
			dataIndex : year+'-06'
		}, {
			header : year+'-07',
			sortable : false,
			dataIndex : year+'-07'
		}, {
			header : year+'-08',
			sortable : false,
			dataIndex : year+'-08'
		}, {
			header : year+'-09',
			sortable : false,
			dataIndex : year+'-09'
		}, {
			header : year+'-10',
			sortable : false,
			dataIndex : year+'-10'
		}, {
			header : year+'-11',
			sortable : false,
			dataIndex : year+'-11'
		}, {
			header : year+'-12',
			sortable : false,
			dataIndex : year+'-12'
		}],
		viewConfig : {
			forceFit : true
		},
		renderTo : "center2"
	});
	statisticsStore.load();
}
function getTBStatisticsYear(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 30,
			year : year
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				var yearJson = jsondata.result;
				var html = "";
				for(var i=0;i<yearJson.length;i++){
					html += '<option value="'+yearJson[i].month+'">'+yearJson[i].month+'</option>';
					
				}
				$("#year3").html(html);
				$("#year3").val(year);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function getTBStatistics(){
	var statisticsStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : url
				}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					fields:[{name:"way",type:'int'},{name:year+"-01",type:'int'},{name:year+"-02",type:'int'}
					        ,{name:year+"-03",type:'int'},{name:year+"-04",type:'int'},{name:year+"-05",type:'int'}
					        ,{name:year+"-06",type:'int'},{name:year+"-07",type:'int'},{name:year+"-08",type:'int'}
					        ,{name:year+"-09",type:'int'},{name:year+"-10",type:'int'},{name:year+"-11",type:'int'}
					        ,{name:year+"-12",type:'int'}]
				}),
		baseParams : {
			type : 30,
			year :year
		},
		remoteSort : false
	});
	new Ext.grid.GridPanel({
		id : 'grid_panel3',
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		store : statisticsStore,
		viewConfig : {
			forceFit : true
		},
		columns : [{
			header : '',
			sortable : false,
			dataIndex : 'way',
			renderer:function(data,metadata,record,rowIndex,columnIndex,store){
				var way = store.getAt(rowIndex).get('way');  
				 if(way == 0)
					 way = "赚取";
				 else
					 way = "提现";
				 return way;
			}
		},{
			header : year+'-01',
			sortable : false,
			dataIndex : year+'-01'
		}, {
			header : year+'-02',
			sortable : false,
			dataIndex : year+'-02'
		}, {
			header : year+'-03',
			sortable : false,
			dataIndex : year+'-03'
		}, {
			header : year+'-04',
			sortable : false,
			dataIndex : year+'-04'
		}, {
			header : year+'-05',
			sortable : false,
			dataIndex : year+'-05'
		}, {
			header : year+'-06',
			sortable : false,
			dataIndex : year+'-06'
		}, {
			header : year+'-07',
			sortable : false,
			dataIndex : year+'-07'
		}, {
			header : year+'-08',
			sortable : false,
			dataIndex : year+'-08'
		}, {
			header : year+'-09',
			sortable : false,
			dataIndex : year+'-09'
		}, {
			header : year+'-10',
			sortable : false,
			dataIndex : year+'-10'
		}, {
			header : year+'-11',
			sortable : false,
			dataIndex : year+'-11'
		}, {
			header : year+'-12',
			sortable : false,
			dataIndex : year+'-12'
		}],
		viewConfig : {
			forceFit : true
		},
		renderTo : "center3"
	});
	statisticsStore.load();
}