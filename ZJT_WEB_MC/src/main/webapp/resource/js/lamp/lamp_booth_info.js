var url = "/mc/lampManageServlet.do", num, areaId, boothId, arrBoothNum, boothNum_combo, pannel, lampBoothJson = "", boothNum_old, eid_old;
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	areaId = getCurArgs("areaId");
	num = getCurArgs("num");
	arrBoothNum = new Array();
	for(var i=1; i<=num; i++){
		arrBoothNum.push(i);
	}
	boothId = getCurArgs("boothId");
	if (boothId == "undefined" || boothId == null || boothId == "")
		createFormPanel();
	else
		showUpdateLampBooth();
};
//创建表单
function createFormPanel() {
	pannel = new Ext.FormPanel({
		title : "<img src='/resource/images/book_open.png' />添加企业展位",
		autoHeight : true,
		border : false,
		applyTo : "detail",
		autoScroll : true,
		bodyStyle : {
			background : '#DFE8F6'
		},
		items : [new Ext.form.FieldSet({
			title : "",
			layout : "table",
			layoutConfig : {
				columns : 1
			},
			viewConfig : {
				forceFit : true
			},
			bodyStyle : {
				background : '#DFE8F6'
			},
			items : [{
				autoHeight : true,
				bodyStyle : "border:none;background-color:#DFE8F6;",
				items : [{
							xtype : "hidden",
							id : "logo",
							value : lampBoothJson == "" ? "" : lampBoothJson.result["logo"],
						}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin:0px 0px 0px 50px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "label",
								html : "&nbsp;&nbsp;&nbsp;<span style='color:red;'>*</span>企业LOGO："
							}]
				}, {
					bodyStyle : "margin-right:5px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : 'label',
								html : "<img id='picPath' src='/resource/images/def_info.jpg' width='90' height='30' />" +
										"<br />" +
										"<input type='button' value='上传图片' onclick='showPic()' />" +
										"<br />" +
										"选择公司的Logo,仅支持JPG,JPEG,PNG,GIF格式"+
										"<br />" +
										"推荐图片分辨率大小：90*30像素，图片大小请不要超过300K"
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '&nbsp;&nbsp;&nbsp;<span style="color:red;">*</span>企业ID：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "eid",
								width : 500,
								maxLength : 300,
								allowBlank : false,
								value : lampBoothJson == "" ? "" : lampBoothJson.result["eid"],
								listeners : {
									"change" : function(field,newValue,oldValue) {
										if(newValue != eid_old)
											getShopInfo();
									}
								}
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
							html : '&nbsp;&nbsp;&nbsp;<span style="color:red;">*</span>联系人：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "contact",
								width : 500,
								maxLength : 300,
								allowBlank : false,
								value : ""
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '<span style="color:red;">*</span>联系方式：&nbsp;&nbsp;<span style="color:red;">手机，电话，至少填一项</span>',
								xtype : 'label'
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "mobile",
								width : 500,
								maxLength : 300,
								value : ""
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "phone",
								width : 500,
								maxLength : 300,
								value : ""
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '<span style="color:red;">*</span>展出产品：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : 'radio',
								boxLabel : "显示店铺最新几条",
								id : "facMaterial_0",
								name : "facMaterial",
								inputValue : "0",
								listeners : {
									check : function() {
										Ext.get("facMaterialIds").dom.value = "";
									}
								}
							},{
			    				xtype : "numberfield",
			    				id : "topNum",
			    				value : (lampBoothJson == "" || lampBoothJson.result["topNum"] == "0") ? "" : lampBoothJson.result["topNum"],
			    				minValue : 1,
			    				maxValue : 30,
								allowNegative : false,
								allowDecimals : false,
			    				style : "margin-bottom:10px;"
			    			},{
								xtype : 'radio',
								boxLabel : "自定义",
								id : "facMaterial_1",
								name : "facMaterial",
								inputValue : "1",
								listeners : {
									check : function() {
										Ext.get("topNum").dom.value = "";
									}
								}
							},{
								xtype : "textarea",
								id : "facMaterialIds",
								width : 300,
								value : lampBoothJson == "" ? "" : ((lampBoothJson.result["facMaterialIds"] == null || lampBoothJson.result["facMaterialIds"] == "") ? "" : lampBoothJson.result["facMaterialIds"] + ";"),
								emptyText : "请以此方式输入（最多30个）：212782;256508;"
			    			}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '&nbsp;宣传视频：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "video",
								width : 500,
								maxLength : 300,
								value : lampBoothJson == "" ? "" : lampBoothJson.result["video"],
								blankText : "请输入视频地址..."
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '&nbsp;选择位号：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : boothNum_combo = new Ext.form.ComboBox({
						id : "boothNumItem",
						store : arrBoothNum,
						mode : "local",
						triggerAction : "all",
						displayField : "text",
						valueField : "value",
						value : lampBoothJson == "" ? "请选择" : lampBoothJson.result["boothNum"],
						width : 80,
						listeners: {  
							select: function(ComboBox, record){
								var num = ComboBox.getValue();
								if(num != boothNum_old)
									checkBoothNumExist(num);
					       }  
						}
					})
				}]
			},{
				autoHeight : true,
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:30px 0px 0px 200px;font-weight:bold;",
				items : [{
							xtype : "tbbutton",
							text : "保存",
							width : 100,
							handler : save
						}]
			}]
		})]
	});
}
function save(){
	var query = "areaId~"+areaId+";";
	var eid = Ext.fly("eid").getValue();
	if(eid == ""){
		Ext.MessageBox.alert("提示", "企业ID不能为空。");
		return;
	}
	query += "eid~"+eid+";";
	var logo = Ext.fly("logo").getValue();
	if(logo == ""){
		Ext.MessageBox.alert("提示", "企业LOGO不能为空。");
		return;
	}
	query += "logo~"+logo+";";
	var contact = Ext.fly("contact").getValue();
	if(contact == ""){
		Ext.MessageBox.alert("提示", "联系人不能为空。");
		return;
	}
	query += "contact~"+contact+";";
	var mobile = Ext.fly("mobile").getValue();
	var phone = Ext.fly("phone").getValue();
	if(mobile == "" && phone == ""){
		Ext.MessageBox.alert("提示", "手机，电话，至少填一项。");
		return;
	}
	query += "mobile~"+mobile+";phone~"+phone+";";
	var radioRacMaterial = pannel.form.findField('facMaterial').getGroupValue();
	if(radioRacMaterial == null || radioRacMaterial == "" || radioRacMaterial.length == 0){
		Ext.MessageBox.alert("提示", "请选择展出产品。");
		return;
	}
	var facMaterialIds = "";
	if(radioRacMaterial == "0"){
		var topNum = Ext.fly("topNum").getValue();
		if(topNum == ""){
			Ext.MessageBox.alert("提示", "显示店铺最新产品不能为空。");
			return;
		}
		query += "topNum~"+topNum+";";
	}else{
		facMaterialIds = Ext.fly("facMaterialIds").getValue();
		if(facMaterialIds == ""){
			Ext.MessageBox.alert("提示", "自定义展出产品不能为空。");
			return;
		}
		var exp = /^[0-9\;]+$/;
		if(!exp.test(facMaterialIds)){
			Ext.MessageBox.alert("提示", "请以此方式输入自定义展出产品：212782;256508;");
			return;
		}
		if(facMaterialIds.endsWith(";"))
			facMaterialIds = facMaterialIds.substring(0,facMaterialIds.lastIndexOf(";"));
	}
	query += "video~"+Ext.fly("video").getValue()+";";
	var boothNum = boothNum_combo.getValue();
	if(boothNum == "请选择"){
		Ext.MessageBox.alert("提示", "请选择位号。");
		return;
	}
	query += "boothNum~"+boothNum;
	var type = 8;
	if(boothId != "undefined" && boothId != null && boothId != ""){
		type = 9;
		query += ";boothId~"+boothId+";eid_old~"+eid_old+";boothNum_old~"+boothNum_old;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : type,
			facMaterialIds : facMaterialIds,
			content : query
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result != null && jsondata.result.length != 0){
					Ext.MessageBox.alert("提示", jsondata.result);
					return;
				}
				Info_Tip("操作成功!");
				closeWin();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//显示修改相片区域
function showPic() {
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.callbackFn = 'upload_callback';
	FileUpload_Ext.initComponent("推荐图片分辨率大小：100*100像素，图片大小请不要超过300K");
}
//上传图片回调函数
function upload_callback() {
	Ext.get("logo").dom.value = FileUpload_Ext.callbackMsg;
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + FileUpload_Ext.callbackMsg;
}
function checkShopExist(eid){
	Ext.Ajax.request({
		url : url,
		async : false,
		params : {
			type : 11,
			content : "areaId~"+areaId +";eid~"+eid
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result != "0"){
					Ext.MessageBox.alert("提示", "该展区下已存在该企业。");
					Ext.get("eid").dom.value = "";
					return;
				}
				getShopInfo();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function getShopInfo(){
	var eid = Ext.fly("eid").getValue();
	if(eid == ""){
		Ext.MessageBox.alert("提示", "企业ID不能为空。");
		return;
	}
	Ext.Ajax.request({
		url : "/ep/EpShopServlet",
		params : {
			type : 3,
			eid : eid
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				if(data.result == null){
					Ext.MessageBox.alert("提示", "企业ID不存在。");
					return;
				}
				Ext.get("contact").dom.value = data["result"].contact;
				Ext.get("mobile").dom.value = data["result"].mobile;
				Ext.get("phone").dom.value = data["result"].phone;
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//检测位号是否已被占用
function checkBoothNumExist(boothNum){
	Ext.Ajax.request({
		url : url,
		async : false,
		params : {
			type : 10,
			content : "areaId~"+areaId +";boothNum~"+boothNum
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result != "0"){
					Ext.MessageBox.alert("提示", "选择的位号已被占用。");
					return;
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function closeWin() {
	window.parent.tab_lamp_booth_list_iframe.ds_info.reload();
	window.parent.Ext.getCmp('center').remove("lamp_booth_info");
}
function showUpdateLampBooth(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 12,
			boothId : boothId
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				lampBoothJson = jsondata;
				boothNum_old = jsondata.result["boothNum"];
				eid_old = jsondata.result["eid"];
				createFormPanel();
				Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + jsondata.result["logo"];
				if(jsondata.result["topNum"] != null && jsondata.result["topNum"] != "")
					Ext.fly("facMaterial_0").dom.checked = "checked";
				if(jsondata.result["facMaterialIds"] != null && jsondata.result["facMaterialIds"] != "")
					Ext.fly("facMaterial_1").dom.checked = "checked";
				getShopInfo();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}