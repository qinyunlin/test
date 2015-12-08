Ext.onReady(init);
var zhcn = new Zhcn_Select();
var eid,ds, grid, panel,memberid,id;
//商铺类型
var shop_type_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getShop_type()
});

var enType = [["2", "政府机构"], ["3", "中介服务"],
      		["4", "施工单位"], ["5", "业主单位"], ["6", "设计单位"], ["7", "其它单位"]];

		
function init(){
	eid = getCurArgs("eid");
	buildForm();
	getShopInfo();
};

function getShopInfo(){
	Ext.lib.Ajax.request("post", "/ep/EpShopServlet?type=24&eid=" + eid,{
		success : function(response){
			var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)){
				Ext.getCmp('date_i').setValue(data.result["effectDate"].split(" ")[0]);	//有效日期
				Ext.getCmp('name').setValue(data.result["ename"]);	//公司名称
				Ext.getCmp('regAddress').setValue(data.result["regAddress"]);	//注册地址
				Ext.getCmp('regCapital').setValue(data.result["regCapital"]);	//注册资本
				Ext.getCmp('regTime').setValue(data.result["regTime"].split(" ")[0]);	//成立时间
				Ext.getCmp('regNum').setValue(data.result["regNum"]);	//注册号
				Ext.getCmp('regOffice').setValue(data.result["regOffice"]);	//登记机关
				Ext.getCmp('startTime').setValue(data.result["startTime"].split(" ")[0]);	//营业期限-开始时间
				Ext.getCmp('endTime').setValue(data.result["endTime"].split(" ")[0]);//营业期限-结束时间
				Ext.getCmp('corpn').setValue(data.result["corpn"]);//营业期限-法人代表
				Ext.getCmp('enterpriseType').setValue(data.result["enterpriseType"]);//营业期限-企业类型
				Ext.getCmp('businessScope').setValue(data.result["businessScope"]);//营业期限-经营范围
				
				//获取认证人信息
				Ext.lib.Ajax.request("post", "/ep/EpShopServlet?type=29&eid=" + eid,{
					success : function(result){
						var returnData = eval("(" + result.responseText + ")");
							if (getState(returnData.state, commonResultFunc, returnData.result)){
								if (returnData.result != null){
									Ext.getCmp('contact').setText(returnData["result"].contact);
									Ext.getCmp('sex').setText(returnData["result"].sex);
									Ext.getCmp('department').setText(returnData["result"].department);
								    var phone = returnData["result"].phone;
								    var mobile = returnData["result"].mobile;
								    if(phone !=null && phone !=""){
								    	Ext.getCmp('phone').setText(phone);
								    }
								    if(mobile !=null && mobile !=""){
								    	Ext.getCmp('phone').setText(mobile);
								    }
								    if(phone !=null && mobile !=null && phone !="" &&  mobile !="")
								    	Ext.getCmp('phone').setText(mobile+"/"+phone);
								}
							}
					},
					failure : function() {
						Warn_Tip();
					}
				});		
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};
function buildForm(){
	var nextYear = new Date();
	nextYear.setFullYear(date.getFullYear() + 1);
	panel = new Ext.form.FieldSet({
		border:true,
		width : 600,
		height:500,
		layout : 'form',
		bodyStyle : "min-height:100px;border:none;background-color:#DFE8F6;font-size:12px;",
		items:[{
		        	border : false,
		    		layout : 'table',
		    		layoutConfig : {
		    			columns : 2
		    		},
		    		height:700,
		    		autoHeight : true,
		    		buttonAlign : 'left',
		    		labelAlign : 'right',
		    		items:[{columnWidth : 1,
		    				width : 300,
		    				autoHeight : true,
		    				layout : 'form',
	    					labelWidth:70,
		    				items:[{
		    					xtype : "combo",
		    					id : 'pass_type',
		    					store : new Ext.data.SimpleStore({
		    								fields : [{
		    											name : 'value'
		    										}, {
		    											name : 'text'
		    										}],
		    								//data : [['0', '有效日期'], ['1', '有效天数']],
		    								data : [['0','当日起一年'],['1','本年12月31日'],['2','明年12月31日'],['3','指定日期']]
		    							}),
		    					mode : 'local',
		    					triggerAction : 'all',
		    					readOnly : true,
		    					width:200,
		    					valueField : "value",
		    					displayField : "text",
		    					fieldLabel : "审核类型",
		    					emptyText : '请选择审核类型',
		    					hiddenName: 'date_type',
		    					disabled : true,
		    					value : '0',
		    					listeners : {
		    						select : function(ComboBox, record) {
		    							if(record.get('value') == '0'){
		    								var date = new Date();
		    								date.setFullYear(date.getFullYear() + 1);
		    								Ext.getCmp("date_i").setValue(date);
		    								
		    								Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
		    								Ext.fly("date_area").setVisible(false);
		    							}else if(record.get("value") == "1"){
		    								var date = new Date();
		    								date.setMonth(11,31);
		    								Ext.getCmp("date_i").setValue(date);
		    								
		    								Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
		    								Ext.fly("date_area").setVisible(false);
		    							}else if(record.get("value") == "2"){
		    								var date = new Date();
		    								date.setFullYear(date.getFullYear() + 1);
		    								date.setMonth(11, 31);
		    								Ext.getCmp("date_i").setValue(date);
		    								
		    								Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
		    								Ext.fly("date_area").setVisible(false);
		    							}else{
		    								Ext.getCmp("date_i").setValue(new Date());
		    								Ext.fly("date_area").setVisible(true);
		    							}
		    						}
		    					}
		    				},{
		    					id : "date_area",
		    					layout : 'table',
		    					layoutConfig : {
		    						columns : 2
		    					},
		    					bodyStyle : "border:none;background-color:#CED9E7",
		    					items : [{
		    								layout : "form",
		    								bodyStyle : "border:none;background-color:#CED9E7",
		    								items : [{
		    											xtype : 'datefield',
		    											emptyText : '请选择日期',
		    											fieldLabel : "有效日期",
		    											format : 'Y-m-d',
		    											name : 'validDate',
		    											id : "date_i",
		    											value:nextYear,
		    											disabled : true,
		    											readOnly : true
		    										}]
		    							}, {
		    								xtype : 'label',
		    								html : '<font color="red">(不包含此日期)'
		    							}]
		    				},{
		    					layout : 'form',
		    					width : 300,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[{xtype:'label',text:'*',style:'margin-left:12px;color:red;'},{xtype:'label',text:'公司名称:'},
			   		    			         {
		    						id : 'name',
		    						xtype : 'textfield',
		    						width:200,
		    						fieldLabel: '公司名称',
		    						allowBlank : false,
		    						style:'margin-left:4px;'
			   		    			}]
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'注册地址:'},
			   		    			   {id : 'regAddress',
			    						xtype : 'textfield',
			    						width:200,
			    						allowBlank : false,
			    						fieldLabel: '注册地址',
			    						style:'margin-left:4px;'}]
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 285,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :4
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'注册资本:'},
			   		    			  {
				    						id : 'regCapital',
				    						xtype : 'textfield',
				    						width:180,
				    						allowBlank : false,
				    						fieldLabel: '注册资本',
				    						style:'margin-left:4px;',
				    						vtype: 'alphanum' 
				    					
				    						
				    					},{
				    						xtype:'label',text:'万元',style:'color:red;width:20px'
				    					}]
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'成立时间:'},
			   		    			new Ext.form.DateField({
										   id : 'regTime',
										   name : 'regTime',
										   fieldLabel : '成立时间',
										   emptyText : '请选择',
										   readOnly : true,
										   format : 'Y-m-d',
										   width : 200,
										   style:'margin-left:4px;'
									     })]
		    						
		    					} ]	
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'注册号:'},
			   		    			{
				    						id : 'regNum',
				    						xtype : 'textfield',
				    						width:200,
				    						allowBlank : false,
				    						fieldLabel: '注册号: ',
				    						style:'margin-left:16px;'
				    					}]
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'登记机关:'},
			   		    			{
				    						id : 'regOffice',
				    						xtype : 'textfield',
				    						width:200,
				    						allowBlank : false,
				    						fieldLabel: '登记机关',
				    						style:'margin-left:4px;'
				    					}]
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					border : false,
		    					autoHeight : true,
		    					
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :6
			   		    			},
			   		    		
		    						items:[{
		    							   width:70,
				   		    				autoHeight : true,
				   		    				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
				   		    				items : [{xtype:'label',text:'*',style:'color:red;'},{
				   		    							xtype : "label",
				   		    							text : "营业期限:  "
				   		    						}]
				   		    			
		    							
		    						        },{
		    						        	width:5
		    						        },
		    							     new Ext.form.DateField({
											   id : 'startTime',
											   name : 'startTime',
											   fieldLabel : '开始时间',
											   emptyText : '请选择',
											   readOnly : true,
											   format : 'Y-m-d',
											   width : 95
										     }),{
			    							    width:10,
					   		    				autoHeight : true,
					   		    				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:center;font-size:12px",
					   		    				items : [{
					   		    							xtype : "label",
					   		    							text : "-"
					   		    						}]
					   		    			
			    							
			    						      },new Ext.form.DateField({
											       id : 'endTime',
											       name : 'endTime',
											       fieldLabel : '结束时间',
											       emptyText : '请选择',
											       readOnly : true,
											       format : 'Y-m-d',
											       width : 95
										})
		    						]
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'法人代表:'},
			   		    			{
				    						id : 'corpn',
				    						xtype : 'textfield',
				    						allowBlank : false,
				    						width:200,
				    						fieldLabel: '法人代表',
				    						style:'margin-left:4px;'
				    					}]
		    						
		    					}]
		    				}, {
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					labelWidth:70,
		    					labelAlign:'right',
		    					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'企业类型:'},
			   		    			{
				    						id : 'enterpriseType',
				    						xtype : 'textfield',
				    						allowBlank : false,
				    						width:200,
				    						fieldLabel: '企业类型',
				    						style:'margin-left:4px;'
				    					}]
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						layout : "table",
			    			 		 border : false,
			   		    			 layoutConfig : {
			   		    				columns :3
			   		    			},items:[
			   		    			   {xtype:'label',text:'*',style:'margin-left:12px;color:red;'},
			   		    			   {xtype:'label',text:'经营范围:'},
			   		    			{
				    						id : 'businessScope',
				    						xtype : 'textarea',
				    						width:200,
				    						allowBlank : false,
				    						fieldLabel: '经营范围',
				    						style:'margin-left:4px;'
				    					}]
		    						
		    					}]
		    				}]
		    		}]
		        },{
		    			xtype : "fieldset",
		    			title : "认证申请人信息",
		    			bodyStyle : "border:none;min-height:18px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    			items:[
		    			       {
		    			    	 layout : "table",
		    			 		border : false,
		   		    		     frame : true,
		   		    			 layoutConfig : {
		   		    				columns : 1
		   		    			},
		   		    		
		   		    			items : [{
		   		    				width : 240,
		   		    				autoHeight : true,
		   		    				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
		   		    				items : [{
		   		    							xtype : "label",
		   		    							text : "申请人: "
		   		    						},{
		   		    							xtype : "label",
		   		    							id:"contact",
		   		    							text : ""
		   		    						},{
		   		    							style:"margin-left:8px;",
		   		    							xtype : "label",
		   		    							id:"sex",
		   		    							text : ""
		   		    						}]
		   		    			},{
		   		    				width : 240,
		   		    				autoHeight : true,
		   		    				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
		   		    				items : [{
		   		    							xtype : "label",
		   		    							text : "职位: "
		   		    						},{
		   		    							xtype : "label",
		   		    							id:"department",
		   		    							text : ""
		   		    						}]
		   		    			},{
		   		    				width : 240,
		   		    				autoHeight : true,
		   		    				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
		   		    				items : [{
		   		    							xtype : "label",
		   		    							text : "联系方式: "
		   		    						},{
		   		    							xtype : "label",
		   		    							id:"phone",
		   		    							text : ""
		   		    						}]
		   		    			}]
		   		    		
		    			       }
		    			       
		    			       ]
		        }]
	});	

	
	grid = new Ext.form.FormPanel({
		frame : true,
		autoWidth : true,
		height : "100%",
		align : "center",
		bodyStyle : "background-color:#DFE8F6",
		renderTo : 'grid',
		items : [{
			xtype : 'toolbar',
			items : [{
				text : '查看/修改认证信息',
				icon : "/resource/images/book_open.png",
		
			}]
		},panel,{
			layout : 'form',
			width: 600,
			buttonAlign : 'center',
			buttons : [{
				text : '修改',
				handler : saveInfo
				
			}]
		}]
	});

	Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
	//Ext.fly("date_area").setVisible(false);
};
//审核诚信商铺信息
function createPic(){
	var validDate = Ext.fly("date_i").getValue(); //有效日期
	var name=Ext.fly("name").getValue();//公司名称
	var regAddress=Ext.fly("regAddress").getValue();//注册地址
	var regCapital=Ext.fly("regCapital").getValue();//注册资本
	var regTime=Ext.fly("regTime").getValue();//成立时间
	var regNum=Ext.fly("regNum").getValue();//注册号
	var regOffice=Ext.fly("regOffice").getValue();//登记机关
	var startTime=Ext.fly("startTime").getValue();//营业期限-开始时间
	var endTime=Ext.fly("endTime").getValue();//营业期限-结束时间
	var businessScope=Ext.fly("businessScope").getValue();//经营范围
	var corpn=Ext.fly("corpn").getValue();//法人代表
	var enterpriseType = Ext.fly("enterpriseType").getValue();//企业类型
	if(isEmpty(name) || isEmpty(name) ||isEmpty(regAddress) ||isEmpty(regCapital) ||isEmpty(regTime) ||isEmpty(regNum) 
			||isEmpty(regOffice) ||isEmpty(startTime) ||isEmpty(endTime) ||isEmpty(businessScope)||isEmpty(corpn)){
		this.focus();
		Ext.MessageBox.alert("提示", "请填写完整信息!");
		return;
	}
	if (isEmpty(validDate)) {
		Ext.MessageBox.alert("提示", "有效日期不能为空!");
		return;
	}
    var content="name~"+name+";regAddress~"+regAddress+";regCapital~"+regCapital+";regTime~"
                 +regTime+";regNum~"+regNum+";regOffice~"+regOffice+";startTime~"+startTime
                 +";endTime~"+endTime+";businessScope~"+businessScope+";corpn~"+corpn+";enterpriseType~"+enterpriseType;
	query = "eid=" + eid + "&validDate=" + validDate +"&content="+content;
	
	Ext.lib.Ajax.request("post","/ep/EpShopServlet?type=30",{
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,jsondata.result)) {
						//诚信商铺信息修改成功，则生成对应的认证证书
						//...to do
						Ext.MessageBox.alert("提示", "修改成功",closeWin);
					}
				},
				failure : function() {
					Warn_Tip();
				}
	},query);
};

var numReg = /^\d+$/;
function saveInfo(){
	var validDate = Ext.fly("date_i").getValue(); //有效日期
	var name=Ext.fly("name").getValue();//公司名称
	var regAddress=Ext.fly("regAddress").getValue();//注册地址
	var regCapital=Ext.fly("regCapital").getValue();//注册资本
	var regTime=Ext.fly("regTime").getValue();//成立时间
	var regNum=Ext.fly("regNum").getValue();//注册号
	var regOffice=Ext.fly("regOffice").getValue();//登记机关
	var startTime=Ext.fly("startTime").getValue();//营业期限-开始时间
	var endTime=Ext.fly("endTime").getValue();//营业期限-结束时间
	var businessScope=Ext.fly("businessScope").getValue();//经营范围
	var corpn=Ext.fly("corpn").getValue();//法人代表
	var enterpriseType = Ext.fly("enterpriseType").getValue();//企业类型
	if(isEmpty(name) || isEmpty(name) ||isEmpty(regAddress) ||isEmpty(regCapital) ||isEmpty(regTime) ||isEmpty(regNum) 
			||isEmpty(regOffice) ||isEmpty(startTime) ||isEmpty(endTime) ||isEmpty(businessScope)||isEmpty(corpn)){
		this.focus();
		Ext.MessageBox.alert("提示", "请填写完整信息!");
		return;
	}
	if (isEmpty(validDate)) {
		Ext.MessageBox.alert("提示", "有效日期不能为空!");
		return;
	}
	if (compareDate(startTime, endTime)){
		Ext.MessageBox.alert("提示", "营业期限起始日期不能大于截止日期！");
		return false;
	}
	if (!numReg.test(regCapital)){
		Ext.MessageBox.alert("提示", "注册资本只能是数字！");
		return false;
	}
	if (!numReg.test(regNum)){
		Ext.MessageBox.alert("提示", "注册号只能是数字！");
		return false;
	}
    var content="regAddress~"+regAddress+";regCapital~"+regCapital+";regTime~"
                 +regTime+";regNum~"+regNum+";regOffice~"+regOffice+";startTime~"+startTime
                 +";endTime~"+endTime+";businessScope~"+businessScope+";corpn~"+corpn+";enterpriseType~"+enterpriseType;
	query = "name=" + name + "&eid=" + eid + "&validDate=" + validDate +"&content="+content;
	
	Ext.lib.Ajax.request("post","/ep/EpShopServlet?type=30",{
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,jsondata.result)) {
						var data = jsondata.result;
						//诚信商铺信息修改成功，则生成对应的认证证书
						if (data != null){
							createPic(data);
						}
						Ext.MessageBox.alert("提示", "修改成功",closeWin);
					}
				},
				failure : function() {
					Warn_Tip();
				}
	},query);
}

function createPic(data){
	/*Ext.lib.Ajax.request("post","http://ftp.zjtcn.com/file/AutoCreatePic?" + data,{
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc,jsondata.result)) {
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});*/
	//document.forms["form"].action = "http://ftp.zjtcn.com/file/AutoCreatePic?" + data;
	//$("#h_eid").val(data);
	//document.forms["form"].submit();
	$.ajax({
		type : "post",
		url : "http://ftp.zjtcn.com/file/AutoCreatePic",
		data : data,
		complete : function(json) {
			/*var data = eval("(" + json.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				
			}*/
			return false;
		}
	});
}

/**
 * 时间比较
 * @param beginDate
 * @param endDate
 * @returns {Boolean}
 */
function compareDate(beginDate,endDate){
	var beginDateArr = beginDate.split("-");
	var endDateArr = endDate.split("-");
	var nowBeginDate = new Date(beginDateArr[0],beginDateArr[1],beginDateArr[2]);
	var nowEndDate =  new Date(endDateArr[0],endDateArr[1],endDateArr[2]);
	if (nowBeginDate > nowEndDate){
		return true;
	}
	return false;
}

function closeWin() {
	if (window.parent.tab_credit_shop_list_iframe){
		window.parent.tab_credit_shop_list_iframe.ds.reload();
	}
	window.parent.Ext.getCmp('center').remove("credit_shop_detail");
};


//查看商铺信息
function empDetail() {
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?eid='
					+ eid);
};



var showUploadIWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_EP";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

function upload_fn() {
	Ext.get("logo").dom.src = FileUpload_Ext.requestURL+FileUpload_Ext.callbackMsg;

};

