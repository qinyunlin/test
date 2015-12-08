var ds, grid, ck, pagetool, askds,eid,ename,combox0,
combox1,combox2,combox3,combox4,combox5,
combox6,combox7,combox8,combox9,combox10,
combox11,combox12,combox13,combox14;
var ids = [];// 选择项
var selectinfo,window_note,guestUnitFieldSet,info_panel,guestInput,batch_up;
var isreplyType = {};
var cookie = new ConCom.Cookie();

function init() {
	Ext.QuickTips.init();
	
	 eid = getCurArgs("eid");
	 ename=getCurArgs("ename");
	 bulidIUpFile();

};

Ext.onReady(function() {
			init();
		});
guestUnitFieldSet = new Ext.form.FieldSet({
	id:'guestUnit',
	name:'guestUnit',
	//title:'修改信息',
	layout:'column',
	width:"1400",
	bodyStyle:'min-height:462px;margin-top:5px',
	items:[{
		
		}]
});

var select_title =[
	             ["no", "不上传"], 
	             ["name", "材料名称*"], 
	             ["Spec", "型号规格"], 
	             ["unit", "单位*"], 
	             ["price1", "单价1*"], 
	             ["price2", "单价2"], 
	             ["price3","单价3"], 
	             ["supplyName1", "供应商1*"], 
	             ["supplyName2", "供应商2"], 
	             ["supplyName3", "供应商3"],
	             ["issueDate", "回复日期*"], 
	             ["notes", "备注"], 
	             ["proName", "工程名称"]];
var title_Select=new Ext.data.SimpleStore({
	fields : [{
		name : 'value'
	}, {
		name : 'text'
	}],
//data : [['0', '有效日期'], ['1', '有效天数']],
    data : select_title
})


function bulidIUpFile(){
	batch_up = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'border:none;margin-left:100px;margin-top:10px;',
		fileUpload : true,
		labelWidth : 60,
		buttonAlign : 'right',
		items : [{
			layout : "column",
			bodyStyle : "margin-left:10px;line-height:20px;",
			layoutConfig : {
				columns : 4
			},
			items:[{
				xtype:'label',
				text:'上传文件:',
				style:'margin-right:4px;'
			},{
				xtype : 'textfield',
				inputType : 'file',
				fieldLabel : "上传文件",
				width : 200,
				style:'float:left;',
				allowBlank : false

			},{
				xtype:'button',
				width:80,
				id:'upload',
				height:20,
				style:'float:left;',
				text:"上传",
				handler:function(){
					Ext.getCmp("upload").disable();
					uploadAskPriceFile();
				}
			}]
		}]
	});
	
	
	
	var info_panel = new Ext.Panel({
		border : false,
		frame : true,
		layout : "column",
		bodyStyle : "margin-left:10px;",
		layoutConfig : {
			columns : 1
		},
		renderTo : "ask_grid",
		items :[batch_up]
	
		

	});
}


function buildTable(){
	Ext.Ajax.request({url:'/mc/EpEnterpriseAskPriceServlet',
			method:'POST',
			params:{
				method : "previewEnterprisePrice",
			},
		success:function(response){
			var jsondata=eval("("+response.responseText+")");
			if(getState(jsondata.state, commonResultFunc, jsondata.result)){
				var mem_info = jsondata.result;
				if(mem_info !=null){

					for(var i=0;i<mem_info.length;i++){
						 guestInput = new Ext.form.FieldSet({
						width:"1400",
						layout:'column',
						bodyStyle:'margin-left:12px;margin-bottom:8px;height:20px;maring-top:8px;',
						border:false,
						layoutCongif:{
							columns:16
						},
						items : [{
							width :35,
							autoHeight : true,
							items : [
							         { 
							        	id:"sum"+i,
							        	name:"sum",
							        	xtype : "radio",
										boxLabel : i+1,
										inputValue:i
										
									 }
							        ]
						},{
							width : 85,
						
							// autoHeight : true,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;",
							items : [{
										xtype : "label",
										text : mem_info[i].name
									}]
						}, {
							width : 94,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].spec
									}]
						}, {
							width : 94,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].unit
									}]
						}, {
							width : 94,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].price1
									}]
						}, {
							width : 94,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].price2
									}]
						}, {
							width : 90,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].price3
									}]
						}, {
							width : 90,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].fname1
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].fname2
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].fname3
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].notes
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].proName
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].reqTime
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].r1
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].r2
									}]
						}, {
							width : 88,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
							items : [{
										xtype : "label",
										text :mem_info[i].r3
									}]
						}]
							
					});
					guestUnitFieldSet.add(guestInput);
					}
					guestUnitFieldSet.doLayout();	
					 Ext.getCmp("upload").enable();
		     }
			}
		}
	});
	
	
	
	var tableSet= new Ext.form.FieldSet({
		width:"1500",
		layout:'column',
		bodyStyle:'margin-bottom:8px;height:36px;maring-top:8px;',
		border:false,
		layoutCongif:{
			columns:16
		},
		items : [{
			xtype:"label",
			text:'选择起始导入行号',
			width:55,
			style:'color:red'
			
		},{
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox0",
				name:"comboBox0",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				width : 75,
				displayField : 'text',
				value:"name",
				store :title_Select ,
				listeners: {  
					select: function(ComboBox, record){
						cookie.setCookie("0", record.get('value'), {
							"expireDays" : 1
						});
						check(0,record.get('value'));
						
			       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox1",
				name:"comboBox1",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				width : 75,
				value:"Spec",
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
					select: function(ComboBox, record){
						cookie.setCookie("1", record.get('value'), {
							"expireDays" : 1
						});
						check(1,record.get('value'));
						
			       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox2",
				name:"comboBox2",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				width : 75,
				value:"unit",
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
                   select: function(ComboBox, record){
                	   cookie.setCookie("2", record.get('value'), {
							"expireDays" : 1
						});
						check(2,record.get('value'));
						
			         
			       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox3",
				name:"comboBox3",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				width : 75,
				value:"price1",
				allowBlank : false,
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("3", record.get('value'), {
								"expireDays" : 1
							});
							check(3,record.get('value'));
							
				       }  
				}
				
			})]
		}, {	width : 89,
	
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox4",
				name:"comboBox4",
				mode : 'local',
				readOnly : true,
				width : 75,
				triggerAction : 'all',
				allowBlank : false,
				value:"issueDate",
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("4", record.get('value'), {
								"expireDays" : 1
							});
							check(4,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox5",
				name:"comboBox5",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				value:"supplyName1",
				valueField : 'value',
				displayField : 'text',
				width : 75,
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("5", record.get('value'), {
								"expireDays" : 1
							});
							check(5,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox6",
				name:"comboBox6",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				width : 75,
				value:"no",
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("6", record.get('value'), {
								"expireDays" : 1
							});
							check(6,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox7",
				name:"comboBox7",
				mode : 'local',
				readOnly : true,
				value:"no",
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				width : 75,
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("7", record.get('value'), {
								"expireDays" : 1
							});
							check(7,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox8",
				name:"comboBox8",
				mode : 'local',
				value:"proName",
				readOnly : true,
				triggerAction : 'all',
				width : 75,
				allowBlank : false,
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("8", record.get('value'), {
								"expireDays" : 1
							});
							check(8,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox9",
				name:"comboBox9",
				mode : 'local',
				readOnly : true,
				value:"no",
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				displayField : 'text',
				width : 75,
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("9", record.get('value'), {
								"expireDays" : 1
							});
							check(9,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox10",
				name:"comboBox10",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				displayField : 'text',
				width : 75,
				value:"notes",
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("10", record.get('value'), {
								"expireDays" : 1
							});
							check(10,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox11",
				name:"comboBox11",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				displayField : 'text',
				width : 75,
				value:"no",
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("11", record.get('value'), {
								"expireDays" : 1
							});
							check(11,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox12",
				name:"comboBox12",
				width : 75,
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				value:"no",
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("12", record.get('value'), {
								"expireDays" : 1
							});
							check(12,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox13",
				name:"comboBox13",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				allowBlank : false,
				valueField : 'value',
				value:"no",
				width : 75,
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("13", record.get('value'), {
								"expireDays" : 1
							});
							check(13,record.get('value'));
							
				       }  
				}
				
			})]
		}, {
		
			// autoHeight : true,
			width : 89,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px;margin-left:6px;",
			items : [new Ext.form.ComboBox({
				id:"comboBox14",
				name:"comboBox14",
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				width : 75,
				value:"no",
				allowBlank : false,
				valueField : 'value',
				displayField : 'text',
				store : title_Select,
				listeners: {  
	                   select: function(ComboBox, record){
	                	   cookie.setCookie("14", record.get('value'), {
								"expireDays" : 1
							});
							check(14,record.get('value'));
							
				       }  
				}
				
			})]
		}]
			
	});
	
	
	
	
	info_panel = new Ext.Panel({
		border : false,
		frame : true,
		layout : "column",
		bodyStyle : "margin-left:10px;",
		layoutConfig : {
			columns : 1
		},
		renderTo : "ask_table",
		items :[ tableSet
		,guestUnitFieldSet,{
			layout : 'form',
			width: 600,
			buttonAlign : 'center',
			buttons : [{
				text : '导入',
				id:"daoru",
				handler : function(){
					var loadMarsk = new Ext.LoadMask(document.body, {
						 msg  : '系统正在处理中，请稍后.....',
						 removeMask : true// 完成后移除
					});
					loadMarsk.show();
					upEnterprisePriceExcel();
					loadMarsk.hide();
				}
			},{
				text:'取消',
				handler:closeWin
			}]
		}]
		

	});

}



function uploadAskPriceFile() {
	if (batch_up.getForm().isValid()) {
		
		batch_up.getForm().getEl().dom["accept-charset"] = "UTF-8";
		batch_up.getForm().getEl().dom["accept-charset"] = "UTF-8";
		batch_up.getForm().submit({
				    url : '/mc/EpEnterpriseAskPriceServlet?method=upExcellServlet&fid='+eid,
					method:"post",
					//waitMsg : '上传文件中...',
					success : function(batch_up, o) {
						
					},
					failure : function() {

					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
};



function getResult(flag, msg) {
	if (flag) {
		$("#ask_table").text("");

		 guestUnitFieldSet.removeAll(guestInput);
		 buildTable();
		 defaultSelectTltle();
	
	} else {
		Info_Tip(msg);
	}
};


/**
 * 上传企业询价
 */
function upEnterprisePriceExcel(){
	
    var title="";
	for(var i=0;i<15;i++){
		title += Ext.getCmp("comboBox"+i).getValue();
		
	}
	
	if(title.indexOf("name")==-1){
		alert("材料名称必选字段未选！");
		return;
	}
	if(title.indexOf("unit")==-1){
		alert("单位必选字段未选！");
		return;
	}
	if(title.indexOf("price")==-1){
		alert("单价必选字段未选！");
		return;
	}
	if(title.indexOf("supplyName")==-1){
		alert("供应商必选字段未选！");
		return;
	}
	if(title.indexOf("issueDate")==-1){
		alert("回复日期必选字段未选！");
		return;
	}
	
	if((title.indexOf("price1") !=-1 && title.indexOf("supplyName1")==-1) ){
		alert("单价1与供应商1未对应选择！");
		return;
	}
	if((title.indexOf("price2") !=-1 && title.indexOf("supplyName2")==-1) ){
		alert("单价2与供应商2未对应选择！");
		return;
	}
	if((title.indexOf("price3") !=-1 && title.indexOf("supplyName3")==-1) ){
		alert("单价3与供应商3未对应选择！");
		return;
	}
	if(title.indexOf("price1")==-1){
		alert("必须先选择单价1,才能选择其他单价！");
		return;
	}
	
	if(title.indexOf("supplyName1")==-1){
		alert("必须先选择供应商1,才能选择其他供应商");
		return;
	}
	
	var value0=Ext.getCmp("comboBox0").getValue();
	var value1=Ext.getCmp("comboBox1").getValue();
	var value2=Ext.getCmp("comboBox2").getValue();
	var value3=Ext.getCmp("comboBox3").getValue();
	var value4=Ext.getCmp("comboBox4").getValue();
	var value5=Ext.getCmp("comboBox5").getValue();
	var value6=Ext.getCmp("comboBox6").getValue();
	var value7=Ext.getCmp("comboBox7").getValue();
	var value8=Ext.getCmp("comboBox8").getValue();
	var value9=Ext.getCmp("comboBox9").getValue();
	var value10=Ext.getCmp("comboBox10").getValue();
	var value11=Ext.getCmp("comboBox11").getValue();
	var value12=Ext.getCmp("comboBox12").getValue();
	var value13=Ext.getCmp("comboBox13").getValue();
	var value14=Ext.getCmp("comboBox14").getValue();

	var num=0;
	Ext.select("input[name=sum]").each(function(el) {
		if(Ext.getDom(el).checked == true){
			num=el.getValue();
		}
   
    });
	if(num==0){
	    alert("请选择起始导入行号！");
	    return;
	}
	Ext.getCmp("daoru").disable();
  var content="0~"+value0+";1~"+value1+";2~"+value2+";3~"+value3+";4~"+value4+";5~"+value5+";6~"+value6+";7~"+value7
  +";8~"+value8+";9~"+value9+";10~"+value10+";11~"+value11+";12~"+value12+";13~"+value13+";14~"+value14;
 
			  Ext.Ajax.request({url:'/mc/EpEnterpriseAskPriceServlet',
					method:'POST',
					params:{
						method : "upExcellEpResponsePrice",
						content:content,
						eid:eid,
						ename:ename,
						num:num
					},
				success:function(response){
					var jsondata=eval("("+response.responseText+")");
					if(getState(jsondata.state, commonResultFunc, jsondata.result)){
						var r = /^\+?[1-9][0-9]*$/; //正整数
					 
						if(r.test(jsondata.result)){
							Ext.getCmp("daoru").enable();
							alert("本次同步"+jsondata.result+"条询价！");
							
							if (parent.tab_0504_iframe){
							    parent.tab_0504_iframe.ds.reload();
						    }
							clearCookie();
						    closeWin();
							
						}else{
							Ext.getCmp("daoru").enable();
						  resultException(jsondata.result);
						}
					
						
					}
				}
			  });

  
}
function  resultException(mag){
	var exceptionMsg = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [{
							xtype : 'textarea',
							//fieldLabel : "上传文件",
							width : 350,
							value:mag,
							style:"min-height:300px;",
							allowBlank : false,
							autoHeight : true,

						}],
				buttons : [{
							text : '确定',
							handler : function() {
								win.close();
							}
						}]
			});
	win = new Ext.Window({
				title : '错误提示',
				closeAction : "close",
				width : 500,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [exceptionMsg]
			});
	win.show();
}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("ask_material_price_preview");
};


function check(v,name){
	var num=0;
	var title="";
	if(v==0){
		num=1;
	}
    for(var i=num ;i<15   ;i++){
    	
    	if(i==v){
    		continue;
    	}
	   	if(name == Ext.getCmp("comboBox"+i).getValue() && name !="no"){
	   		alert("该列已经存在！请重新选择");
	   		cookie.setCookie(""+v+"", "");
	   		Ext.getCmp("comboBox"+v).setValue("no");
	        return;
	   	}
    }
	for(var j=0;j<15;j++){
		title += Ext.getCmp("comboBox"+j).getValue();
	}

/*	if((name =="price1" && title.indexOf("supplyName1")==-1) || 
		(name =="price2" && title.indexOf("supplyName2")==-1) ||
		(name =="price3" && title.indexOf("supplyName3")==-1)){
		alert("请选择单价对应的供应商！");
		return;
	}
	
	if((name =="supplyName1" && title.indexOf("price1")==-1) || 
			(name =="supplyName2" && title.indexOf("price2")==-1) ||
			(name =="supplyName3" && title.indexOf("price3")==-1)){
			alert("请选择供应商对应的供应商报价！");
			return;
	}*/
	
	
	

}


//默认加载头部信息
function defaultSelectTltle(){
	 if(cookie.getCookie("0")!=null && cookie.getCookie("0") !=""){
		    Ext.getCmp("comboBox0").setValue(cookie.getCookie("0"));
	 }
	 if(cookie.getCookie("1")!=null && cookie.getCookie("1") !=""){
		    Ext.getCmp("comboBox1").setValue(cookie.getCookie("1"));
	 }
	 if(cookie.getCookie("2")!=null && cookie.getCookie("2") !=""){
		    Ext.getCmp("comboBox2").setValue(cookie.getCookie("2"));
	 }
	 if(cookie.getCookie("3")!=null && cookie.getCookie("3") !=""){
		    Ext.getCmp("comboBox3").setValue(cookie.getCookie("3"));
	 }
	 if(cookie.getCookie("4")!=null && cookie.getCookie("4") !=""){
		    Ext.getCmp("comboBox4").setValue(cookie.getCookie("4"));
	 }
	 if(cookie.getCookie("5")!=null && cookie.getCookie("5") !=""){
		    Ext.getCmp("comboBox5").setValue(cookie.getCookie("5"));
	 }
	 if(cookie.getCookie("6")!=null && cookie.getCookie("6") !=""){
		    Ext.getCmp("comboBox6").setValue(cookie.getCookie("6"));
	 }
	 if(cookie.getCookie("7")!=null && cookie.getCookie("7") !=""){
		    Ext.getCmp("comboBox7").setValue(cookie.getCookie("7"));
	 }
	 if(cookie.getCookie("8")!=null && cookie.getCookie("8") !=""){
		    Ext.getCmp("comboBox8").setValue(cookie.getCookie("8"));
	 }
	 if(cookie.getCookie("2")!=null && cookie.getCookie("2") !=""){
		    Ext.getCmp("comboBox9").setValue(cookie.getCookie("9"));
	 }
	 if(cookie.getCookie("10")!=null && cookie.getCookie("10") !=""){
		    Ext.getCmp("comboBox10").setValue(cookie.getCookie("10"));
	 }
	 if(cookie.getCookie("11")!=null && cookie.getCookie("11") !=""){
		    Ext.getCmp("comboBox11").setValue(cookie.getCookie("11"));
	 }
	 if(cookie.getCookie("12")!=null && cookie.getCookie("12") !=""){
		    Ext.getCmp("comboBox12").setValue(cookie.getCookie("12"));
	 }
	 if(cookie.getCookie("13")!=null && cookie.getCookie("13") !=""){
		    Ext.getCmp("comboBox13").setValue(cookie.getCookie("13"));
	 }
	 if(cookie.getCookie("14")!=null && cookie.getCookie("14") !=""){
		    Ext.getCmp("comboBox14").setValue(cookie.getCookie("14"));
	 }
}

//清空cookie
function clearCookie(){
	cookie.setCookie("0", "");
	cookie.setCookie("1", "");
	cookie.setCookie("2", "");
	cookie.setCookie("3", "");
	cookie.setCookie("4", "");
	cookie.setCookie("5", "");
	cookie.setCookie("6", "");
	cookie.setCookie("7", "");
	cookie.setCookie("8", "");
	cookie.setCookie("9", "");
	cookie.setCookie("10", "");
	cookie.setCookie("11", "");
	cookie.setCookie("12", "");
	cookie.setCookie("13", "");
	cookie.setCookie("14", "");
}




