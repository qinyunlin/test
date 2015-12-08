var temp = new Ext.Template('<p><b>备注:</b>{province}</p><br>');
var expander,storeScoreDetaileByDegree,storeScoreDetailCountByYear,storeScoreDetailCountByEnterprise;
var year="2014";
var recordTemp,rowTemp,bodyTemp;

Ext.onReady(init);
function init() {
	scoreCountAll();
	ScoreDetailCountByEnterprise();
	ScoreDetailCountByYear();
	ScoreDetailCountByDegree();
};



function scoreCountAll() {
	
	var bar = new Ext.Toolbar({
		renderTo : "title",
		items:[{
			text : '个人积分明细',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("scoreDetail_list", '个人积分明细',
				'/module/member/scoreDetail_list.jsp');
			}
		},{
			text : '企业积分明细',
			icon : "/resource/images/map.png",
			handler : function() {
				window.parent.createNewWidget("scoreDetail_list_enterprise", '企业积分明细',
				'/module/member/scoreDetail_list_enterprise.jsp');
			}
		}]
	});
	/*Ext.lib.Ajax.request("post","/score/ScoreDetailCountServlet?type=3",{
		  
	    success : function(response) {
				var json = eval("(" + response.responseText
						+ ")");
				if (getState(json.state, commonResultFunc,
						json.result)) {
					
				
					var html="<tr><td></td><td>总数</td><td>普通会员</td><td>正式信息会员</td></tr>";
					for(var i=0;i<json.result.length;i++){
						if(json.result[i].title=="系统中当前积分总数"){
							html+='<tr><td>'+json.result[i].title+'</td> <td   onclick="" style="color:#0000FF;">'+(parseInt(json.result[i].freeScore)+parseInt(json.result[i].formalScore))+'</td><td  style="color:#0000FF;">'+json.result[i].freeScore+'</td><td   style="color:#0000FF;">'+json.result[i].formalScore+'</td></tr>';
						}
						if(json.result[i].title=="用户历史获取积分总数"){
							html+='<tr><td>'+json.result[i].title+'</td> <td   onclick="" style="color:#0000FF;cursor:pointer"><a href="javascript:void(0);" onclick="linkScoreDetail('+null+','+null+','+null+','+"'"+1+"'"+')" >'+(parseInt(json.result[i].freeScore)+parseInt(json.result[i].formalScore))+'</a></td><td  style="color:#0000FF;cursor:pointer"><a href="javascript:void(0);" onclick="linkScoreDetail('+null+','+"'"+1+"'"+','+null+','+"'"+1+"'"+')" >'+json.result[i].freeScore+'</a></td><td   style="color:#0000FF;cursor:pointer"><a href="javascript:void(0);" onclick="linkScoreDetail('+null+','+"'"+3+"'"+','+null+','+"'"+1+"'"+')" >'+json.result[i].formalScore+'</a></td></tr>';
						}
						if(json.result[i].title=="用户历史使用积分总数"){
							html+='<tr><td>'+json.result[i].title+'</td> <td   onclick="" style="color:#0000FF;cursor:pointer"><a href="javascript:void(0);" onclick="linkScoreDetail('+null+','+null+','+null+','+"'"+2+"'"+')" >'+(parseInt(json.result[i].freeScore)+parseInt(json.result[i].formalScore))+'</a></td><td  style="color:#0000FF;cursor:pointer"><a href="javascript:void(0);" onclick="linkScoreDetail('+null+','+"'"+1+"'"+','+null+','+"'"+2+"'"+')" >'+json.result[i].freeScore+'</a></td><td   style="color:#0000FF;cursor:pointer"><a href="javascript:void(0);" onclick="linkScoreDetail('+null+','+"'"+3+"'"+','+null+','+"'"+2+"'"+')" >'+json.result[i].formalScore+'</a></td></tr>';
						}
						if(json.result[i].title=="用户当前冻结积分总数"){
							html+='<tr><td>'+json.result[i].title+'</td> <td   onclick="" style="color:#0000FF;">'+(parseInt(json.result[i].freeScore)+parseInt(json.result[i].formalScore))+'</td><td  style="color:#0000FF;">'+json.result[i].freeScore+'</td><td   style="color:#0000FF;">'+json.result[i].formalScore+'</td></tr>';
						}
						
					}
					$("#titleName").html(html);
				}

			},
			failure : function() {
				Warn_Tip();
			}
		});
    
	});*/
	Ext.lib.Ajax.request("post","/score/ScoreDetailCountServlet?type=6",{
		success:function(response){
			var json = eval("(" + response.responseText
					+ ")");
			if (getState(json.state, commonResultFunc,
					json.result)) {
				var html="";
				for(var i=0;i<json.result.length;i++){
					html += '<option value="'+json.result[i].statisticsMonth+'">'+json.result[i].statisticsMonth+'</option>';
					
				}
			
				//html +="<option value='2013'>2013</value>";
				$("#year2").html(html);
				$("#year2").val(year);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
	
	Ext.lib.Ajax.request("post","/score/ScoreDetailCountServlet?type=4",{
		success:function(response){
			var json = eval("(" + response.responseText
					+ ")");
			if (getState(json.state, commonResultFunc,
					json.result)) {
				var html="";
				for(var i=0;i<json.result.length;i++){
					html += '<option value="'+json.result[i].statisticsMonth+'">'+json.result[i].statisticsMonth+'</option>';
					
				}
			
				//html +="<option value='2013'>2013</value>";
				$("#year").html(html);
				$("#year1").html(html);
				$("#year").val(year);
				$("#year1").val(year);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
	$("#year2").change(function() {

		year=$("#year2").val();
		$("#center2").html("");
		ScoreDetailCountByEnterprise();
		
		
    });
	
	$("#year").change(function() {

		year=$("#year").val();
		$("#center").html("");
		ScoreDetailCountByYear();
		
		
    });
	$("#year1").change(function() {

		year=$("#year1").val();
		$("#center1").html("");
		ScoreDetailCountByDegree();	
    });
};


//得到正式会员积分统计
function ScoreDetailCountByYear() {
	 storeScoreDetailCountByYear = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/score/ScoreDetailCountServlet'
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
					type : 5,
					year :year,
					degree:3
				},
				remoteSort : false
			});
		
	 new Ext.grid.GridPanel({
				id : 'grid_panel2',
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,    
				loadMask : true,
				store : storeScoreDetailCountByYear,
				//plugins : [expander],
				viewConfig : {
					forceFit : true
				},
				columns : [/*expander,*/{
					header : '途径',
					sortable : false,
					dataIndex : 'way',
					renderer:function(data,metadata,record,rowIndex,columnIndex,store){
						//metadata.css='x-grid-back-color';
						var  way= store.getAt(rowIndex).get('way');  
						 if(way==0){
							 way="询价学堂签到";
						 }
						 if(way==1){
							 way="询价回复";
						 }
						 if(way==3){
							 way="询价";
						 }
						 if(way==4){
							 way="兑换礼品";
						 }
						 if(way==5){
							 way="注册赠送";
						 }
						 if(way==6){
							 way="套餐赠送";
						 }
						 if(way==8){
							 way="返回积分";
						 }
						 if(way==15){
							 way="购买积分";
						 }
						 if(way==17){
							 way="活动赠送";
						 }
						 if(way==-1){
							metadata.css='x-grid-back-color';
							 way="存量总分";
						 }
						 if(way == -2){
							 metadata.css='x-grid-back-color1';
							 way ="消费总分";
						 }
						 if(way==-3){
							 metadata.css='x-grid-back-color1';
							 way="获取总分";
						 }
						 if(way == -4){
							 way="收藏";
						 }
						 
						 /*if(way=="-1"){
					    	  metadata.css='x-grid-back-color';
					    	 
					     }*/
						 if(way==16){
							 way="下载材价";
						 }
						 if(way==21)
							 way = "文库签到";
						 if(way==23)
							 way = "分享文档";
						 if(way==22)
							 way = "下载文档";
						 if(way==25)
							 way = "手机绑定赠送";
						 return way;
					}
				},{
					header : year+'-01',
					sortable : false,
					dataIndex : year+'-01',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
					      var  months01= store.getAt(rowIndex).get(year+'-01');  
					      var datetime=year+"-01-01"+";"+year+"-01-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months01;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months01==undefined){
					    	  return 0;
					      }else{
					    	  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months01+'</a>';  
					      }
					 }
				}, {
					header : year+'-02',
					sortable : false,
					dataIndex : year+'-02',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
						  var  months02= store.getAt(rowIndex).get(year+'-02');
						  var datetime=year+"-02-01"+";"+year+"-02-30";
						  var  way= store.getAt(rowIndex).get('way'); 
						    if(way==-1){
						    	 metadata.css='x-grid-back-color';
						    	  return months02;
						      }
						    if(way == -2 || way ==-3){
						    	  metadata.css='x-grid-back-color1';
						      }
						  if(months02==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months02+'</a>';  
						  }
						  //gridWay.getColumnModel().setColumnHeader(3,year+'-02');
					     
					  
					 }
				}, {
					header : year+'-03',
					sortable : false,
					dataIndex : year+'-03',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
						  var  months03= store.getAt(rowIndex).get(year+'-03'); 
					      var datetime=year+"-03-01"+";"+year+"-03-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months03;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
						  if(months03==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">'+months03+'</a>';  
						  }
					      
					  
					 }
				}, {
					header : year+'-04',
					sortable : false,
					dataIndex : year+'-04',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
					      var  months04= store.getAt(rowIndex).get(year+'-04');  
					      var datetime=year+"-04-01"+";"+year+"-04-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months04;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months04==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months04+'</a>'; 
						  }
					  
					 }
				}, {
					header : year+'-05',
					sortable : false,
					dataIndex : year+'-05',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months05= store.getAt(rowIndex).get(year+'-05'); 
					      var datetime=year+"-05-01"+";"+year+"-05-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months05;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months05==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months05+'</a>';  
						  }
					 }
				
					
				}, {
					header : year+'-06',
					sortable : false,
					dataIndex : year+'-06',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months06= store.getAt(rowIndex).get(year+'-06');  
					      var datetime=year+"-06-01"+";"+year+"-06-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months06;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months06==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months06+'</a>';  
						  }
					 }
				
					
				}, {
					header : year+'-07',
					sortable : false,
					dataIndex : year+'-07',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months07= store.getAt(rowIndex).get(year+'-07'); 
					      var datetime=year+"-07-01"+";"+year+"-07-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months07;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months07==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months07+'</a>';  
						  }
					 }
				
					
				}, {
					header : year+'-08',
					sortable : false,
					dataIndex : year+'-08',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months08= store.getAt(rowIndex).get(year+'-08');  
					      var datetime=year+"-08-01"+";"+year+"-08-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months08;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months08==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months08+'</a>';  
						  }
					 }
				
					
				}, {
					header : year+'-09',
					sortable : false,
					dataIndex : year+'-09',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months09= store.getAt(rowIndex).get(year+'-09'); 
					      var datetime=year+"-09-01"+";"+year+"-09-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months09;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months09==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months09+'</a>';  
						  }
					 }
				
					
				}, {
					header : year+'-10',
					sortable : false,
					dataIndex : year+'-10',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months10= store.getAt(rowIndex).get(year+'-10'); 
					      var datetime=year+"-10-01"+";"+year+"-10-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months10;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months10==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months10+'</a>';  
						  }
					 }
				
					
				}, {
					header : year+'-11',
					sortable : false,
					dataIndex : year+'-11',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months11= store.getAt(rowIndex).get(year+'-11');  
					      var datetime=year+"-11-01"+";"+year+"-11-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months11;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months11==undefined){
							  return 0;
						  }else{
					            return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months11+'</a>';  
						  }
					 }
					
				}, {
					header : year+'-12',
					sortable : false,
					dataIndex : year+'-12',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months12= store.getAt(rowIndex).get(year+'-12'); 
					      var  way= store.getAt(rowIndex).get('way'); 
					      var datetime=year+"-12-01"+";"+year+"-12-31";
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months12;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months12==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months12+'</a>';  
						  }
					 }
				
					
				}, {
					header : '全年合计',
					sortable : false,
					dataIndex : '',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months12= store.getAt(rowIndex).get(year+'-12');
					      var  months11= store.getAt(rowIndex).get(year+'-11'); 
					      var  months10= store.getAt(rowIndex).get(year+'-10'); 
					      var  months09= store.getAt(rowIndex).get(year+'-09'); 
					      var  months08= store.getAt(rowIndex).get(year+'-08'); 
					      var  months07= store.getAt(rowIndex).get(year+'-07'); 
					      var  months06= store.getAt(rowIndex).get(year+'-06'); 
					      var  months05= store.getAt(rowIndex).get(year+'-05'); 
					      var  months04= store.getAt(rowIndex).get(year+'-04'); 
					      var  months03= store.getAt(rowIndex).get(year+'-03'); 
					      var  months02= store.getAt(rowIndex).get(year+'-02'); 
					      var  months01= store.getAt(rowIndex).get(year+'-01'); 
					      var yearScore=parseInt(months01)+parseInt(months02)+parseInt(months03)+parseInt(months04)
					      +parseInt(months05)+parseInt(months06)+parseInt(months07)+parseInt(months08)+parseInt(months09)
					      +parseInt(months10)+parseInt(months11)+parseInt(months12);
					      var datetime=year+"-01-01"+";"+year+"-12-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return yearScore;
					      }
					      
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+3+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +yearScore+'</a>';  
					   
					      
					  
					 }
				
					
				}],
				viewConfig : {
					forceFit : true
				},
				renderTo : "center"
			});
	storeScoreDetailCountByYear.load();

};








//得到普通会员积分明细统计
function ScoreDetailCountByDegree() {
	 storeScoreDetailCountByYear = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/score/ScoreDetailCountServlet'
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
					type : 5,
					year :year,
					degree:1
				},
				remoteSort : false
			});

	  new Ext.grid.GridPanel({
			id : 'grid_panel2',
			autoWidth : true,
			autoHeight : true,
			stripeRows : true,    
			loadMask : true,
			store : storeScoreDetailCountByYear,
			viewConfig : {
				forceFit : true
			},
			columns : [{
				header : '途径',
				sortable : false,
				dataIndex : 'way',
				renderer:function(data,metadata,record,rowIndex,columnIndex,store){
					var  way= store.getAt(rowIndex).get('way');  
					 if(way==0){
						 way="询价学堂签到";
					 }
					 if(way==8){
						 way="返回积分";
					 }
					 if(way==1){
						 way="询价回复";
					 }
					 if(way==2){
						 way="兑换服务天数";
					 }
					 if(way==3){
						 way="询价";
					 }
					 if(way==4){
						 way="兑换礼品";
					 }
					 if(way==5){
						 way="注册赠送";
					 }
					 if(way==6){
						 way="套餐赠送";
					 }
					 if(way==15){
						 way="购买积分";
					 }
					 if(way==17){
						 way="活动赠送";
					 }
					 if(way==20){
						 way="优惠服务";
					 }
					 if(way==21)
						 way = "文库签到";
					 
					 if(way==22)
						 way = "下载文档";
					 
					 if(way==23)
						 way = "分享文档";
					 
					 if(way==25)
						 way = "手机绑定赠送";
					 
					 if(way==-1){
						 metadata.css='x-grid-back-color';
						 way="存量总分";
					 }
					 if(way == -2){
						 metadata.css='x-grid-back-color1';
						 way ="消费总分";
					 }
					 if(way==-3){
						 metadata.css='x-grid-back-color1';
						 way="获取总分";
					 }
					 if(way == -4){
						 way="收藏";
					 }
					 return way;
				}
			},{
				header : year+'-01',
				sortable : false,
				dataIndex : year+'-01',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
				      var  months01= store.getAt(rowIndex).get(year+'-01');  
				      var datetime=year+"-01-01"+";"+year+"-01-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months01;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months01==undefined){
				    	  return 0;
				      }else{
				    	  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months01+'</a>';  
				      }
				 }
			}, {
				header : year+'-02',
				sortable : false,
				dataIndex : year+'-02',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
					  var  months02= store.getAt(rowIndex).get(year+'-02');
					  var datetime=year+"-02-01"+";"+year+"-02-30";
					  var  way= store.getAt(rowIndex).get('way'); 
					    if(way==-1){
					    	 metadata.css='x-grid-back-color';
					    	  return months02;
					      }
					    if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					  if(months02==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months02+'</a>';  
					  }
					  //gridWay.getColumnModel().setColumnHeader(3,year+'-02');
				     
				  
				 }
			}, {
				header : year+'-03',
				sortable : false,
				dataIndex : year+'-03',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
					  var  months03= store.getAt(rowIndex).get(year+'-03'); 
				      var datetime=year+"-03-01"+";"+year+"-03-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months03;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
					  if(months03==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">'+months03+'</a>';  
					  }
				      
				  
				 }
			}, {
				header : year+'-04',
				sortable : false,
				dataIndex : year+'-04',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
				      var  months04= store.getAt(rowIndex).get(year+'-04');  
				      var datetime=year+"-04-01"+";"+year+"-04-30";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months04;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months04==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months04+'</a>'; 
					  }
				  
				 }
			}, {
				header : year+'-05',
				sortable : false,
				dataIndex : year+'-05',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months05= store.getAt(rowIndex).get(year+'-05'); 
				      var datetime=year+"-05-01"+";"+year+"-05-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months05;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months05==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months05+'</a>';  
					  }
				 }
			
				
			}, {
				header : year+'-06',
				sortable : false,
				dataIndex : year+'-06',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months06= store.getAt(rowIndex).get(year+'-06');  
				      var datetime=year+"-06-01"+";"+year+"-06-30";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months06;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months06==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months06+'</a>';  
					  }
				 }
			
				
			}, {
				header : year+'-07',
				sortable : false,
				dataIndex : year+'-07',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months07= store.getAt(rowIndex).get(year+'-07'); 
				      var datetime=year+"-07-01"+";"+year+"-07-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months07;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months07==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months07+'</a>';  
					  }
				 }
			
				
			}, {
				header : year+'-08',
				sortable : false,
				dataIndex : year+'-08',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months08= store.getAt(rowIndex).get(year+'-08');  
				      var datetime=year+"-08-01"+";"+year+"-08-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months08;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months08==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months08+'</a>';  
					  }
				 }
			
				
			}, {
				header : year+'-09',
				sortable : false,
				dataIndex : year+'-09',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months09= store.getAt(rowIndex).get(year+'-09'); 
				      var datetime=year+"-09-01"+";"+year+"-09-30";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months09;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months09==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months09+'</a>';  
					  }
				 }
			
				
			}, {
				header : year+'-10',
				sortable : false,
				dataIndex : year+'-10',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months10= store.getAt(rowIndex).get(year+'-10'); 
				      var datetime=year+"-10-01"+";"+year+"-10-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months10;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months10==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months10+'</a>';  
					  }
				 }
			
				
			}, {
				header : year+'-11',
				sortable : false,
				dataIndex : year+'-11',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months11= store.getAt(rowIndex).get(year+'-11');  
				      var datetime=year+"-11-01"+";"+year+"-11-30";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months11;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months11==undefined){
						  return 0;
					  }else{
				            return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months11+'</a>';  
					  }
				 }
				
			}, {
				header : year+'-12',
				sortable : false,
				dataIndex : year+'-12',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months12= store.getAt(rowIndex).get(year+'-12'); 
				      var  way= store.getAt(rowIndex).get('way'); 
				      var datetime=year+"-12-01"+";"+year+"-12-31";
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return months12;
				      }
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      if(months12==undefined){
						  return 0;
					  }else{
						  return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months12+'</a>';  
					  }
				 }
			
				
			}, {
				header : '全年合计',
				sortable : false,
				dataIndex : '',
				renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
				      var  months12= store.getAt(rowIndex).get(year+'-12');
				      var  months11= store.getAt(rowIndex).get(year+'-11'); 
				      var  months10= store.getAt(rowIndex).get(year+'-10'); 
				      var  months09= store.getAt(rowIndex).get(year+'-09'); 
				      var  months08= store.getAt(rowIndex).get(year+'-08'); 
				      var  months07= store.getAt(rowIndex).get(year+'-07'); 
				      var  months06= store.getAt(rowIndex).get(year+'-06'); 
				      var  months05= store.getAt(rowIndex).get(year+'-05'); 
				      var  months04= store.getAt(rowIndex).get(year+'-04'); 
				      var  months03= store.getAt(rowIndex).get(year+'-03'); 
				      var  months02= store.getAt(rowIndex).get(year+'-02'); 
				      var  months01= store.getAt(rowIndex).get(year+'-01'); 
				      var yearScore=parseInt(months01)+parseInt(months02)+parseInt(months03)+parseInt(months04)
				      +parseInt(months05)+parseInt(months06)+parseInt(months07)+parseInt(months08)+parseInt(months09)
				      +parseInt(months10)+parseInt(months11)+parseInt(months12);
				      var datetime=year+"-01-01"+";"+year+"-12-31";
				      var  way= store.getAt(rowIndex).get('way'); 
				      if(way==-1){
				    	  metadata.css='x-grid-back-color';
				    	  return yearScore;
				      }
				      
				      if(way == -2 || way ==-3){
				    	  metadata.css='x-grid-back-color1';
				      }
				      return '<a  onclick="linkScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+1+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +yearScore+'</a>';  
				   
				      
				  
				 }
			
				
			}],
			viewConfig : {
				forceFit : true
			},
			renderTo : "center1"
		});
	storeScoreDetailCountByYear.load();


};



//跳转积分明细页面公共方法
function linkScoreDetail(way,degree,dateTime,type){
	var href="/module/member/scoreDetail_list.jsp?";
	if(way != null && way != ""){
		href += "&way="+way;
	}
	if(degree != null && degree !=""){
		href += "&degree="+degree;
	}
	if(dateTime != null && dateTime !=""){
		href += "&dateTime="+dateTime;
	}
	if(type != null && type !=""){
		href += "&type="+type;
	}
	window.parent.createNewWidget("scoreDetail_list", '积分明细', href);
}
//得到正式会员积分统计
function ScoreDetailCountByEnterprise() {
	storeScoreDetailCountByEnterprise = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/score/ScoreDetailCountServlet'
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
					type : 7,
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
				store : storeScoreDetailCountByEnterprise,
				//plugins : [expander],
				viewConfig : {
					forceFit : true
				},
				columns : [/*expander,*/{
					header : '途径',
					sortable : false,
					dataIndex : 'way',
					renderer:function(data,metadata,record,rowIndex,columnIndex,store){
						//metadata.css='x-grid-back-color';
						var  way= store.getAt(rowIndex).get('way');  
						 if(way==0){
							 way="询价学堂签到";
						 }
						 if(way==3){
							 way="询价";
						 }
						 if(way==4){
							 way="兑换礼品";
						 }
						 if(way ==5)
							 way="注册赠送";
						 if(way==6){
							 way="套餐赠送";
						 }
						 if(way==8){
							 way="返回积分";
						 }
						 if(way==15){
							 way="购买积分";
						 }
						 if(way==17){
							 way="活动赠送";
						 }
						 if(way==-1){
							metadata.css='x-grid-back-color';
							 way="存量总分";
						 }
						 if(way == -2){
							 metadata.css='x-grid-back-color1';
							 way ="消费总分";
						 }
						 if(way==-3){
							 metadata.css='x-grid-back-color1';
							 way="获取总分";
						 }
						 if(way == -4){
							 way="收藏";
						 }
						 if(way==16){
							 way="下载材价";
						 }
						 if(way==21)
							 way = "文库签到";
						 if(way==22)
							 way = "下载文档";
						 if(way==25)
							 way = "手机绑定赠送";
						 return way;
					}
				},{
					header : year+'-01',
					sortable : false,
					dataIndex : year+'-01',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
					      var  months01= store.getAt(rowIndex).get(year+'-01');  
					      var datetime=year+"-01-01"+";"+year+"-01-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months01;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months01==undefined){
					    	  return 0;
					      }else{
					    	  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months01+'</a>';  
					      }
					 }
				}, {
					header : year+'-02',
					sortable : false,
					dataIndex : year+'-02',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
						  var  months02= store.getAt(rowIndex).get(year+'-02');
						  var datetime=year+"-02-01"+";"+year+"-02-30";
						  var  way= store.getAt(rowIndex).get('way'); 
						    if(way==-1){
						    	 metadata.css='x-grid-back-color';
						    	  return months02;
						      }
						    if(way == -2 || way ==-3){
						    	  metadata.css='x-grid-back-color1';
						      }
						  if(months02==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months02+'</a>';  
						  }
						  //gridWay.getColumnModel().setColumnHeader(3,year+'-02');
					 }
				}, {
					header : year+'-03',
					sortable : false,
					dataIndex : year+'-03',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
						  var  months03= store.getAt(rowIndex).get(year+'-03'); 
					      var datetime=year+"-03-01"+";"+year+"-03-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months03;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
						  if(months03==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">'+months03+'</a>';  
						  }
					 }
				}, {
					header : year+'-04',
					sortable : false,
					dataIndex : year+'-04',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) {  
						//metadata.css='x-grid-back-color';
					      var  months04= store.getAt(rowIndex).get(year+'-04');  
					      var datetime=year+"-04-01"+";"+year+"-04-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months04;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months04==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months04+'</a>'; 
						  }
					 }
				}, {
					header : year+'-05',
					sortable : false,
					dataIndex : year+'-05',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months05= store.getAt(rowIndex).get(year+'-05'); 
					      var datetime=year+"-05-01"+";"+year+"-05-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months05;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months05==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months05+'</a>';  
						  }
					 }
				}, {
					header : year+'-06',
					sortable : false,
					dataIndex : year+'-06',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months06= store.getAt(rowIndex).get(year+'-06');  
					      var datetime=year+"-06-01"+";"+year+"-06-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months06;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months06==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months06+'</a>';  
						  }
					 }
				}, {
					header : year+'-07',
					sortable : false,
					dataIndex : year+'-07',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months07= store.getAt(rowIndex).get(year+'-07'); 
					      var datetime=year+"-07-01"+";"+year+"-07-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months07;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months07==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months07+'</a>';  
						  }
					 }
				}, {
					header : year+'-08',
					sortable : false,
					dataIndex : year+'-08',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months08= store.getAt(rowIndex).get(year+'-08');  
					      var datetime=year+"-08-01"+";"+year+"-08-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months08;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months08==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months08+'</a>';  
						  }
					 }
				}, {
					header : year+'-09',
					sortable : false,
					dataIndex : year+'-09',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months09= store.getAt(rowIndex).get(year+'-09'); 
					      var datetime=year+"-09-01"+";"+year+"-09-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months09;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months09==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months09+'</a>';  
						  }
					 }
				}, {
					header : year+'-10',
					sortable : false,
					dataIndex : year+'-10',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months10= store.getAt(rowIndex).get(year+'-10'); 
					      var datetime=year+"-10-01"+";"+year+"-10-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months10;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months10==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months10+'</a>';  
						  }
					 }
				}, {
					header : year+'-11',
					sortable : false,
					dataIndex : year+'-11',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months11= store.getAt(rowIndex).get(year+'-11');  
					      var datetime=year+"-11-01"+";"+year+"-11-30";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months11;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months11==undefined){
							  return 0;
						  }else{
					            return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months11+'</a>';  
						  }
					 }
				}, {
					header : year+'-12',
					sortable : false,
					dataIndex : year+'-12',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months12= store.getAt(rowIndex).get(year+'-12'); 
					      var  way= store.getAt(rowIndex).get('way'); 
					      var datetime=year+"-12-01"+";"+year+"-12-31";
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return months12;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      if(months12==undefined){
							  return 0;
						  }else{
							  return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +months12+'</a>';  
						  }
					 }
				}, {
					header : '全年合计',
					sortable : false,
					dataIndex : '',
					renderer: function (data, metadata, record, rowIndex, columnIndex, store) { 
						//metadata.css='x-grid-back-color';
					      var  months12= store.getAt(rowIndex).get(year+'-12');
					      var  months11= store.getAt(rowIndex).get(year+'-11'); 
					      var  months10= store.getAt(rowIndex).get(year+'-10'); 
					      var  months09= store.getAt(rowIndex).get(year+'-09'); 
					      var  months08= store.getAt(rowIndex).get(year+'-08'); 
					      var  months07= store.getAt(rowIndex).get(year+'-07'); 
					      var  months06= store.getAt(rowIndex).get(year+'-06'); 
					      var  months05= store.getAt(rowIndex).get(year+'-05'); 
					      var  months04= store.getAt(rowIndex).get(year+'-04'); 
					      var  months03= store.getAt(rowIndex).get(year+'-03'); 
					      var  months02= store.getAt(rowIndex).get(year+'-02'); 
					      var  months01= store.getAt(rowIndex).get(year+'-01'); 
					      var yearScore=parseInt(months01)+parseInt(months02)+parseInt(months03)+parseInt(months04)
					      +parseInt(months05)+parseInt(months06)+parseInt(months07)+parseInt(months08)+parseInt(months09)
					      +parseInt(months10)+parseInt(months11)+parseInt(months12);
					      var datetime=year+"-01-01"+";"+year+"-12-31";
					      var  way= store.getAt(rowIndex).get('way'); 
					      if(way==-1){
					    	  metadata.css='x-grid-back-color';
					    	  return yearScore;
					      }
					      if(way == -2 || way ==-3){
					    	  metadata.css='x-grid-back-color1';
					      }
					      return '<a  onclick="linkEnterpriseScoreDetail('+"'"+store.getAt(rowIndex).get('way')+"'"+','+"'"+datetime+"'"+','+null+')" href="javascript:void(0)">' +yearScore+'</a>';  
					 }
				}],
				viewConfig : {
					forceFit : true
				},
				renderTo : "center2"
			});
	 storeScoreDetailCountByEnterprise.load();
};
//跳转积分明细页面公共方法
function linkEnterpriseScoreDetail(way,dateTime,type){
	var href="/module/member/scoreDetail_list_enterprise.jsp?";
	if(way != null && way != ""){
		href += "&way="+way;
	}
	if(dateTime != null && dateTime !=""){
		href += "&dateTime="+dateTime;
	}
	if(type != null && type !=""){
		href += "&type="+type;
	}
	window.parent.createNewWidget("scoreDetail_list_enterprise", '企业积分明细', href);
}