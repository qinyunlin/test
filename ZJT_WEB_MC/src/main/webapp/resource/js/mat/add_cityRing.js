
var fs;
var basic_area,guestUnitFieldSet,guestUnitFieldSetYes;

var guestUnitId = 0;
var guestUnitNum = 0;
var provinces=[];
var k=0;
var zhcn = new Zhcn_Select();
Ext.onReady(function() {
	// 初始化表单
	createFormPanel();

});

var cityArea=[["1","华东区"],["2","华南区"],["3","华北区"],["4","华中区"],["5","西部区"]];
var selectFlag = "0";

function delSpan(){
	return "<span style='color: #ff0000; font-family: 宋体; font-size: 13px; font-style: normal; font-weight: bold; text-decoration: none;'>×</span>"
}

// 创建表单
function createFormPanel() {
	//获取所有省份
	var pro = zhcn.getProvince(true);
	var city=[];
	
	//保存左边城市列表
	guestUnitFieldSet = new Ext.form.FieldSet({
		id:'guestUnit',
		name:'guestUnit',
		bodyStyle:"padding-left:0px;border:none;",
		autoHeight : true,
		layout:'column',
		width:200,
		items:[]
	});
	
	//保存已选城市列表
	guestUnitFieldSetYes = new Ext.form.FieldSet({
		id:'guestUnit1',
		name:'guestUnit1',
		bodyStyle:"padding-left:0px;border:none;",
		autoHeight : true,
		layout:'column',
		width:200,
		items:[ {layout : "table",
				bodyStyle :"padding-left:0px;border:none",
		 		 layoutConfig : {
						columns : 2
					 },
					 autoWidth : true,
					 autoHeight : true,
					 items:[{
			width : 60,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;background-color:#DFE8F6;font-size:12px",
			items : [{
						xtype : "label",
						text : "城市"
					}]
		},{
			width : 60,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;background-color:#DFE8F6;font-size:12px",
			items : [{
						xtype : "label",
						text : ""
					}]
		},{
			width : 75,
			autoHeight : true,
			hidden : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;background-color:#DFE8F6;font-size:12px;",
			items : [{
				width : 75,
				xtype : "label",
				text : "材价调差系数"
			}]
		}]}]
	});
	
	//创建fromPanel
	fs = new Ext.form.FormPanel({
		autoHeight : true,
		autoWidth : true,
		layout : "table",
		layoutConfig : {
			columns : 2
		},
		bodyStyle : "border:none;background-color:#DFE8F6;font-size:12px;width:800px;",
		style : 'background-color:#DFE8F6;font-size:12px;width:800px; padding-top:20px;padding-left:30px;',
		renderTo : "addCityRing",
		items : [{
					baseCls : 'x-plain',
					items : [{layout : "table",
					 		layoutConfig : {
								columns : 2
							},
							autoWidth : true,
							bodyStyle : 'background-color:#DFE8F6;',
							items : [		
							{
								width : 90,
								autoHeight : true,
								bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;padding-top:10px;",
								items : [{
											xtype : "label",
											text : "城市圈名称："
										}]
							}, {
								width : 300,
								autoHeight : true,
								bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;padding-top:10px;",
								items : [{
											xtype : "textfield",
											fieldLabel : "城市圈名称",
											id : "name",
											width : 185,
											name : "name",
											allowBlank : false,
											blankText : "请输入城市圈名称",
											 listeners:{  
												 blur:function(obj){
													 isBlur();
												 }
											 }
										}]
							}, /*{
								width : 90,
								autoHeight : true,
								bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;padding-top:10px;",
								items : [{
											xtype : "label",
											text : "选择所选区域："
										}]
							}, {
								width : 185,
								autoHeight : true,
								bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;padding-top:10px;",
								items : [emp_type = new Ext.form.ComboBox({
									        id:"cityArea",
											fieldLabel : "选择所选区域",
											store : cityArea,
											emptyText : "选择所选区域",
											mode : "local",
											triggerAction : "all",
											valueField : "value",
											readOnly : true,
											displayField : "text",
											allowBlank : false
										})]
							},*/ {
								width : 90,
								autoHeight : true,
								bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;padding-top:10px;",
								items : [{
											xtype : "label",
											text : "选择包含城市："
										}]
							}, {
								width : 500,
								autoHeight : true,
								bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;padding-top:10px;",
								items : []
							}	
							]}, {
								layout : "table",
						 		layoutConfig : {
									columns : 1
								},
								autoWidth : true,
								autoHeight : true,
								bodyStyle:"border:none;padding-top:10px;padding-left:30px;",
								items:[
								       {
										autoHeight : true,
										bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;padding-top:10px;",
										items : [ {
											xtype : "label",
											html : "<font color='red'>请注意：更换省份会清除已选择的城市！</font>"
										} ]
								},   
								 new Ext.form.ComboBox({
											store : pro,
											id : "province_sel",
											bodyStyle:"border:none;padding-top:10px;padding-bottom:10px;",
											mode : "local",
											triggerAction : "all",
											valueField : "value",
											value:"请选择省份",
											readOnly : true,
											displayField : "text",
											allowBlank : false,
											listeners : {
												select : function(combo, record, index) {
													createCitySelectArea(combo);
												}
											}
										}),{
											 layout : "table",
									 		 layoutConfig : {
												columns : 3
											 },
											 bodyStyle :"padding-left:0px;border:none;",
											 autoWidth : true,
											 autoHeight : true,
											 items:[guestUnitFieldSet,{
													layout : "form",
													buttonAlign : "center",
													baseCls : 'x-plain',
													buttons : [{
																text : '请选择',
																handler : choose,
																
															}]
												},guestUnitFieldSetYes]
											 }
								]
							},{
								layout : "form",
								buttonAlign : "center",
								baseCls : 'x-plain',
								buttons : [{
											text : '保存',
											handler : saveCityRing,
										}]
							}]
				}]
	});

}

//从左边选择城市圈城市到右边
function choose(){
	
	//得到左边城市列表为已选择状态的值
	var length = guestUnitFieldSet.items.getCount();
	var html="";
	for(var i=1;i<length;i++){
		var id = guestUnitFieldSet.items.itemAt(i).id;
		var name = Ext.fly(id + "_city").dom.checked;
		if(name){
			html+=id+";";	
		}
		
	}
	//每次选择之后初始全选为未选择状态
	$("#guestUnit input[type='checkbox']").each(
			function() {
				$(this).removeAttr("checked");
			});
	$("#checkAll").val("全选");
	
	
	//遍历左侧已选择的城市选择的城市
	var num=html.split(";");
	for(var j=0;j<num.length-1;j++){
		k++;
		var city = Ext.fly(num[j] + "_city").getValue();
		//将城市成左边列表中移除
		guestUnitFieldSet.remove(num[j]);
		guestUnitFieldSet.doLayout();
		
		//创建新的列表项循环添加到右边已选择列表中
		 var inputId = "guestInputy" + k;
	    	
 		 var GuestInputy = new Ext.form.FieldSet({
 			id:inputId,
 			layout:'table',
 			bodyStyle :"padding-left:0px;border:none",
 			border:false,
 			items:[ {layout : "table",
 				bodyStyle :"padding-left:0px;border:none",
			 		 layoutConfig : {
							columns : 3
						 },
						 autoWidth : true,
						 autoHeight : true,
						 items:[{
				width : 60,
				autoHeight : true,
				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
				items : [{
					        id:inputId+"_city",
							xtype : "label",
							text : city
						}]
			},{
				width :40,
				autoHeight : true,
				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px;color:red;corsur:pointer",
				items : [{
					xtype : "label",
					style : "margin-left: 5px;",
					html : '<a href="javascript:void(0);" style="text-decoration:none;" onclick="delCity('+"'"+inputId+"'"+','+"'"+num[j]+"'"+','+"'"+city+"'"+')">' + delSpan() + '</a>' 
				}]
			},{
				width : 75,
				autoHeight : true,
				hidden : true,
				bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textfield",
							id : inputId+"_factor",
							width :70,
							name : "factor"+j,
							allowBlank : false,
							value:"1.00",
							regex : /^0\.[5-9][0-9]|1\.[0-4][0-9]|1\.[0-5]0$/
							
						}]
			}]}]
 		});
 		
   		guestUnitFieldSetYes.add(GuestInputy);
	}
	

   
 	guestUnitFieldSetYes.doLayout();


}

//删除右边选择的城市，将城市还原到左边
function delCity(id,id1,city){
	

	
	//移除右边列表的值
	guestUnitFieldSetYes.remove(id);
	guestUnitFieldSetYes.doLayout();	
	 var province=Ext.getCmp("province_sel").getValue();
	 var cityArea="";
	 var citys=zhcn.getCity(province);
	 for(var i=0;i<citys.length;i++){
		 cityArea +=citys[i]+";";
	 }
	if(cityArea.indexOf(city)>=0){
		//将移除的值返回到左边列表中
	    var GuestInput = new Ext.form.FieldSet({
			id:id1,
			layout:'table',
			bodyStyle :"padding-left:0px;border:none;",
			border:false,
			items:[
			  new Ext.form.Checkbox({
				id : id1+'_city',
				
				boxLabel : city,
				inputValue : city,
				width : 100,
		
		   })]
		});
		guestUnitFieldSet.add(GuestInput);
	    guestUnitFieldSet.doLayout();
	}
	
    
	
}

//保存城市圈设置
function saveCityRing(){
	
	
	var name = Ext.getCmp("name").getValue();
	 if(name ==null || name ==""){
		 alert("城市圈名称不能为空！");
		return;
	 }
	/*var pid = Ext.getCmp("cityArea").getValue();
	 if(pid ==null || pid =="" || pid=="选择所选区域"){
		 alert("城市圈所在区域为必选项！");
		return;
	 }*/
	 var province=Ext.getCmp("province_sel").getValue();
	 if(province == null || province=="" || province =="请选择省份"){
		 alert("请选择城市圈下所包含的城市");
		 return;
	 }
	 
	var length = guestUnitFieldSetYes.items.getCount();
	var cityAndFactor="";
	for(var i=1;i<length;i++){
		 var id = guestUnitFieldSetYes.items.itemAt(i).id;
		 var city = Ext.getCmp(id + "_city").text;
		
		 //var factor=Ext.fly(id + "_factor").getValue();
		 var factor = "1.00";
		 if(factor ==null || factor ==""){
			 alert(city+"：材价系数不能为空！");
			return;
		 }else{
			
			/* if(factor<0.50 || factor >1.50){
				
				 alert("请正确填写系数!必须大于0.50,小于等于1.50");
				 return;
			 }*/
			 var reg= factor.match("/^0\.[5-9][0-9]|1\.[0-4][0-9]|1\.[0-5]0$/");
			 if(!reg){
				 alert("请正确填写系数!必须大于0.50,小于等于1.50且(系数必须保留二位小数)");
				 return;
			 }
		 }
		 cityAndFactor +=city+"~"+factor+";";
	}
	
	if(cityAndFactor == null || cityAndFactor == ""){
		alert("城市圈下没有城市不可保存！");
		return;
	}
	//var contents ="name~"+name+";pid~"+pid + ";province~" + province;
	var contents ="name~" + name + ";province~" + province + ";pid~1";
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '正在处理中.....!',
	        disabled : false,
	        store : store
	      });
	  loadMarsk.show();
	var store=Ext.Ajax.request({
		url : '/cityRingServlet',
		method:'POST',
		params:{
			type:3,
			content:contents,
			cityAndFactor:cityAndFactor
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				
				
				
				//同步城市圈下参考价标题
				Ext.Ajax.request({
					url : '/cityRingServlet',
					method:'POST',
					params:{
						type:10,
						id:json.result,
					},
					success:function(response){
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("城市圈设置成功。", closeWin);
							loadMarsk.hide();
							parent.tab_cityRing_list_iframe.ds.reload();
						}
					},
					failure : function() {
						loadMarsk.hide();
						Warn_Tip();
					}
				});
				
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
	
}

function isBlur(){
	var name = Ext.getCmp("name").getValue();
	if(name == null || name == ""){
		alert("城市圈名称不能为空！");
		return;
	}
	Ext.Ajax.request({
		url : '/cityRingServlet',
		method:'POST',
		params:{
			type:13,
			name:name
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				if(json.result!=null){
					alert("已存在该城市圈！");
					Ext.getCmp("name").setValue("");
					Ext.getCmp("name").focus();
					return;
				}

			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

//初始化城市表
function initArea(){
	var citys=[];
	var areas=[];
	var city="";
	var allAreas="";
	provinces=zhcn.getProvince(true).toString().split(",");
	for(var i=0;i<provinces.length;i++){
		citys=zhcn.getCity(provinces[i]).toString().split(",");
		for(var j=0;j<citys.length;j++){
			areas=zhcn.getArea(citys[j]);
			
			city +=citys[j]+"~"+areas+";";
			/*for(var k=0;k<areas.length;k++){
				allAreas+=provinces[i]+"~"+citys[j]+"~"+areas[k]+";";
			}*/
		}
		allAreas+=provinces[i]+"-"+city+"!";
		city="";
	}

	alert(allAreas);
	Ext.Ajax.request({
		url : '/cityRingServlet',
		method:'POST',
		params:{
			type:11,
			
			allAreas:allAreas
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Info_Tip("城市初始化成功。");

			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

function createCitySelectArea(combo	){
	//每次选择新的省份时先清空之前的城市列表
	  guestUnitFieldSet.removeAll();
	  
	//移除右边列表的值
 	guestUnitFieldSetYes.items.each(function(){
 		var id = this.id;
 		if (id.indexOf("guestInputy") != -1){
 			guestUnitFieldSetYes.remove(id);
 		}
 	});
	 guestUnitFieldSetYes.doLayout();	
	  //guestUnitFieldSetYes.removeAll();
	  
	  selectFlag = "1";
	  
	  //为每一个列表添加全选列
		  var GuestInput = new Ext.form.FieldSet({
			id:"checkAllInput",
			layout:'table',
			bodyStyle :"border:none;",
			border:false,
			items:[new Ext.form.Checkbox({
				bodyStyle :"border:none;",
				id : 'checkAll',
				boxLabel : '全选',
				inputValue : '全选',
				width : 100,
				 listeners:{  
                 afterrender:function(obj){  
                     obj.getEl().dom.onclick = function(){  
                     var ifall = $("#checkAll").val();
                    	if (ifall == "全选") {
                    		
                    		$("#guestUnit input[type='checkbox']").each(
                    				function(i) {
                    					$(this).attr("checked", "true");
                    				});
                    	$("#checkAll").val("取消");
                    	} else {
                    		$("#guestUnit input[type='checkbox']").each(
                    				function() {
                    					$(this).removeAttr("checked");
                    				});
                    		$("#checkAll").val("全选");
                    	}  
                     };  
                 }  
             }  
			})]
		});
   	guestUnitFieldSet.add(GuestInput);
   	
   	//得到省份
	var province = combo.getValue();
	
	//根据省份获取城市
	 city=zhcn.getCity(province);
	 var cityArea="";//保存已经选择的城市圈
	 
	 Ext.Ajax.request({
			url : '/cityRingServlet',
			method:'POST',
			params:{
				type:12,
			},
			success:function(response){
				var json = eval("(" + response.responseText + ")");
				if (getState(json.state, commonResultFunc, json.result)) {
					cityArea=json.result;
					
						 //得到已选列表中的值
						 var length = guestUnitFieldSetYes.items.getCount();
                    	 for(var j=1;j<length;j++){
                    		 var id = guestUnitFieldSetYes.items.itemAt(j).id;
                    		  cityArea += Ext.getCmp(id + "_city").text+" ";
                    	 }
					
					 //遍历城市添加到guestUnitFieldSet列表中
                     for(var i=0;i<city.length;i++){  
                    	  //如果选择的省份中的城市已经包含在已选择的城市圈中那么过滤
                          if(cityArea.indexOf(city[i])<0){
                        
                        	  var inputId = "guestInput" + i;
                      		  var GuestInput = new Ext.form.FieldSet({
                      			id:inputId,
                      			layout:'table',
                      			bodyStyle :"border:none;",
                      			border:false,
                      			items:[new Ext.form.Checkbox({
                      				bodyStyle :"border:none;",
										id : inputId+'_city',
										boxLabel : city[i],
										inputValue : city[i],
										width : 100,
									})]
                      		});
                      		
                       		guestUnitFieldSet.add(GuestInput);
                        	  
                          }else{
                        	  continue;
                          }
                    	
                   	 
                     }
                 	guestUnitFieldSet.doLayout();
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
}

//关闭当前窗口
function closeWin() {
	window.parent.Ext.getCmp('center').remove("add_cityRing");
};