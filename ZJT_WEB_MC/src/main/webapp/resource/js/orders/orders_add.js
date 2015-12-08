var sunshineForm, guestUnitFieldSet,itemType=[],price="",jsondata="",type;

var comboProvinces, comboCities,province,city,selectedStuffStore,ordersItem,pid;

var guestUnitId = 0;
var guestUnitNum = 0;

var zhcn = new Zhcn_Select();
var proStore = zhcn.getProvince(true);
var city = [];

var ordersItemId;

$.fck.config = {
	path : '/resource/plugins/FCKeditor/',
	height : 500,
	width : 750,
	toolbar : 'MCZJTCN'
};

// 设置可选范围
var stuffStore = new Ext.data.ArrayStore({
	data : stuff_code_shop,// 引用stuff_code.js
	fields : [ 'value', 'text' ]
});



selectedStuffStore = new Ext.data.ArrayStore({
    data: [],
    fields: ['value', 'text'],
    proxy: new Ext.data.MemoryProxy(itemType)//必须定义代理,用于赋值
});


Ext.onReady(function() {
	Ext.QuickTips.init();
	init();
});

function init() {
	

/*	new Ext.data.JsonStore({
		   url : '/mc/OrdersItemServlet.do?type=11?province='+province+'&city='+city,//這裏是數據源，這地方我用的ajax映射到後臺的service方法，返回上面的JSON串數據
		   root : 'value',//這裏的value對應上傳JSON串中的value
		   fields : ['name', 'price']//這裏的兩個變量也分別對應上面JSON串中value數組內的key
		  });


		var projectCombo = new Ext.form.ComboBox({   emptyText : "请选择",
		   store : projectStore,
		   valueField : "projectNm",//這是實際的值可以通過getValue()方法取出來
		   displayField : "projectCd",//這是顯示值可以用getRawValue()方法取出來
		   mode : "remote",//這裏是remote代表取得遠程服務器的值，如果爲local則是取得本地的值
		   triggerAction : "all",
		   editable : false,
		   allowBlank : false
		  });*/
	
	
	buildForm();
	$('#introduction').fck();
	$('#purchaseDetail').fck();
	$('#supplierRequirement').fck();
	$('#purchaserRequirement').fck();
}

function buildForm() {
	var defaultProvince = proStore[0];
	var defaultCity = zhcn.getCity(defaultProvince);
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	var city = [];
	var area = [];
	var comboProvinces = new Ext.form.ComboBox({
		id : 'comboProvinces',
		store : pro,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '省',
		listeners : {
			select : function(combo, record, index) {
				comboCities.reset();
				var province = combo.getValue();
				city = zhcn.getCity(province);
				comboCities.store.loadData(city);
				comboCities.enable();

			}
		}

	});
	
	ordersItem=new Ext.form.ComboBox(
			{
				id : 'ordersItem',
				name : 'ordersItem',
				mode : 'local',
				readOnly : true,
				triggerAction : 'all',
				fieldLabel : '选择套餐',
				allowBlank : false,
				value : '请选择',
				width : 180,
				valueField : 'value',
				displayField : 'text',
				store :selectedStuffStore,
				listeners : {
					select : function() {
						var name=Ext.getCmp("ordersItem").getValue(); 
                           for(var i=0;i<jsondata.length;i++){
                        	   if(name==jsondata[i].name){
                        		   Ext.get("itemPrice").dom.value=jsondata[i].price;
                        		   type=jsondata[i].itemType;
                        		   ordersItemId = jsondata[i].id;
                        		   pid=jsondata[i].pid;
                        	   } 
                           }
					}
				}

			})
	var comboCities = new Ext.form.ComboBox({
		id : 'comboCities',
		store : city,
		width : 180,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		hiddenName : 'region',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '市',
		name : 'city'

	});

	sunshineForm = new Ext.form.FormPanel(
			{

				border : false,
				layout : 'table',
				id:'myform',
				layoutConfig : {
					columns : 1
				},
				// layout : 'form',
				width : 750,
				autoHeight : true,
				frame : true,
				buttonAlign : 'left',
				labelAlign : 'right',
				items : [
						{
							xtype : 'textfield',
							inputType : 'hidden',
							id : 'id',
							name : 'id'
						},
						{
							layout : 'table',
							layoutConfig : {
								columns : 3
							},
							items : [ {
								xtype : "fieldset",
								title : "套餐信息",
								width : 700,
								autoHeight : true,
								height : 280,
								layout : "table",
								layoutConfig : {
									columns : 2
								},
								items : [
										{
											layout : 'form',
											labelWidth : 100,
											items : {
												id : 'uid',
												name : 'uid',
												fieldLabel : '会员账号',
												xtype : "textfield",
												allowBlank : false,
												width : 180,
												listeners :{
													blur:function() {
													var uid=Ext.getCmp("uid").getValue();
													if(uid !=null && uid !=""){
														Ext.Ajax.request({
															url : '/mc/Order.do',
															method : 'POST',
															params : {
																type :12,
																uid:uid
															},
															success : function(response) {
																var json = eval("(" + response.responseText + ")");
																if (getState(json.state, commonResultFunc, json.result)) {
																	if(json.result){
																		var data=json.result;
																		Ext.get("comboProvinces").dom.value=data.province;
																		Ext.get("comboCities").dom.value=data.city;
																		Ext.get("eName").dom.value=data.corpName;
																		Ext.get("uName").dom.value=data.trueName;
																		Ext.get("dept").dom.value=data.department;
																		Ext.get("mobile").dom.value=data.mobile;
																		Ext.get("phone").dom.value=data.phone;
																		Ext.get("address").dom.value=data.addr;
																		Ext.get("postCode").dom.value=data.postCode;
																		Ext.get("email").dom.value=data.email;
															
																
																		
																		Ext.Ajax.request({
																			//url : '/mc/OrdersItemServlet.do',
																			url : '/ordersitem/group/OrderGroupServlet.do',
																			method : 'POST',
																			params : {
																				type :11,
																				status : 1
																				//content:"province~"+data.province+";city~"+data.city
																			},success:function(response){
																				var json = eval("(" + response.responseText + ")");
																				if (getState(json.state, commonResultFunc, json.result)) {
																					if(json.result){
																					     jsondata=json.result;
																					    
																			             for(var i=0;i<jsondata.length;i++){
																							var name=[jsondata[i].name,jsondata[i].name];
																							 itemType.push(name);
																						}
																						selectedStuffStore.load(itemType.toString());
																						itemType=[];
																						
																						
																						
																					}
																				}
																			}
																		});
	
																		
																	}else {
																		Ext.MessageBox.alert("提示", "系统没有此会员账号信息，建议先注册。");
																		Ext.getCmp('myform').form.reset();
																	}
																	
																}
															},
															failure : function() {
																Warn_Tip();
															}
														});
													
													}
													
													}
												}
											}
										},
										{
											layout : 'form',
											labelWidth : 100,
											height : 26,
											items : comboProvinces
										},
										{
											layout : 'form',
											labelWidth : 100,
											height : 26,
											items : comboCities
										},
										{
											layout : 'form',
											labelWidth : 100,
											height : 26,
											items : new Ext.form.ComboBox(
													{
														id : 'invoice',
														name : 'invoice',
														mode : 'local',
														readOnly : true,
														triggerAction : 'all',
														fieldLabel : '是否开据发票',
														allowBlank : false,
														value : '否',
														width : 180,
														valueField : 'value',
														displayField : 'text',
														store : new Ext.data.SimpleStore(
																{
																	fields : [
																			'value',
																			'text' ],
																	data : [
																			[
																					'是',
																					'是' ],
																			[
																					'否',
																					'否' ] ]
																})

													})
										},
										{
											layout : 'form',
											labelWidth : 100,

											items : {
												id : 'invoiceInfo',
												name : 'invoiceInfo',
												fieldLabel : '发票信息',
												xtype : "textfield",
												maxLength : 32,
												allowBlank : true,
												width : 180
											}
										},{
											width : 98,
											items : [ {
												xtype : "label",
												fieldLabel : ""
											} ]
										},
										{
											layout : 'form',
											labelWidth : 98,
											height : 26,
											items : ordersItem
										},
										{
											layout : 'form',
											labelWidth : 98,
											height : 26,
											items : {
												id : 'itemPrice',
												name : 'itemPrice',
												fieldLabel : '单价  元/年',
												xtype : "textfield",
												width : 180
											}
										},
										{
											layout : 'form',
											labelWidth : 98,
											height : 26,
											items : new Ext.form.ComboBox(
													{
														id : 'timeLength',
														name : 'timeLength',
														mode : 'local',
														hiddenId : 'typeId',
														hiddenName : 'typeId',
														readOnly : true,
														triggerAction : 'all',
														fieldLabel : '服务时长  /年',
														allowBlank : false,
														value : '请选择',
														width : 180,
														valueField : 'value',
														displayField : 'text',
														store : new Ext.data.SimpleStore(
																{
																	fields : [
																			'value',
																			'text' ],
																	data : [
																			[
																					'1',
																					'1年' ],
																			[
																					'2',
																					'2年' ],
																			[
																					'3',
																					'3年' ],
																			[
																					'4',
																					'4年' ],
																			[
																					'5',
																					'5年' ], ]
																}),
														listeners : {
															select : function() {

																var itemPrice = Ext
																		.get(
																				"itemPrice")
																		.getValue();// 套餐价格
																var timeLength = Ext.getCmp("timeLength").getValue();//服务时长

																if (itemPrice != null
																		|| itemPrice != ""
																		|| timeLength != null
																		|| timeLength != "") {
																	Ext
																			.get("priceAcount").dom.value = itemPrice
																			* timeLength;
																}

															}
														}

													})
										}, {
											layout : 'form',
											labelWidth : 98,
											height : 26,
											items : {
												id : 'priceAcount',
												name : 'priceAcount',
												fieldLabel : '总金额',
												xtype : "textfield",
												width : 180,
												readOnly : false,

											}
										} ],

							} ]
						}, {
							xtype : "fieldset",
							title : "联系信息",
							width : 700,
							autoHeight : true,
							height : 280,
							layout : "table",
							layoutConfig : {
								columns : 2
							},
							items : [ {
								layout : 'form',
								labelWidth : 100,

								items : {
									id : 'eName',
									name : 'eName',
									fieldLabel : '公司名称',
									xtype : "textfield",
									allowBlank : false,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'uName',
									name : 'uName',
									fieldLabel : '联系人',
									xtype : "textfield",
									allowBlank : false,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'dept',
									name : 'dept',
									fieldLabel : '所属部门',
									xtype : "textfield",
									allowBlank : true,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'position',
									name : 'position',
									fieldLabel : '职位',
									xtype : "textfield",
									allowBlank : true,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'phone',
									name : 'phone',
									fieldLabel : '手机号码',
									xtype : "textfield",
									allowBlank : false,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'mobile',
									name : 'mobile',
									fieldLabel : '固定号码',
									xtype : "textfield",
									allowBlank : true,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'postCode',
									name : 'postCode',
									fieldLabel : '邮政编码',
									xtype : "textfield",
									allowBlank : true,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,
								items : {
									id : 'email',
									name : 'email',
									regex : formMsg.emailPatrn,
									regexText : formMsg.emailErrMsg,
									fieldLabel : '电子邮箱',
									xtype : "textfield",
									allowBlank : false,
									width : 180
								}
							}, {
								layout : 'form',
								labelWidth : 100,

								items : {
									id : 'address',
									name : 'address',
									fieldLabel : '联系地址',
									xtype : "textfield",
									allowBlank : false,
									width : 180
								}
							}

							]
						}, {
							layout : 'form',
							labelWidth : 100,
							items : [ {
								xtype : 'textarea',
								id : 'notes',
								fieldLabel : '备注',
								width : 595,
								height : 100
							} ]
						},{
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
						    height:35
						},{
							colspan : 2,
							bodyStyle : "border:none;padding-left:250px;float:left;text-align:center;",
							items : [{
										xtype : "button",
										width : 90,
										text : '提交',
										style:"float:left",
										hidden : compareAuth('PROJ_MOD'),
										handler : save
									},{
										xtype : "button",
										width : 90,
										style:"float:left;padding-left:8px;",
										text : '关闭',
										handler : function() {
											window.parent.Ext.getCmp('center').remove("orders_add");
											
										}
									}]
						}]

			});
	
	
	var sunshineWin = new Ext.Panel({
		frame : true,
		layout : "table",
		width : true,
		autoHeight : true,
		renderTo : "purchaseForm",
		items : [ sunshineForm ]
	});
}

function save() {
	if (!sunshineForm.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}
	var uid = Ext.getCmp("uid").getValue();// 会员账号
	var city = Ext.get("comboCities").getValue(); // 地区
	if(city == "请选择"){
		Ext.MessageBox.alert("提示", "请选择城市");
		return;
	}
    var province = Ext.get("comboProvinces").getValue();
	if(province == "请选择"){
		Ext.MessageBox.alert("提示", "请选择省份");
		return;
	}
	var invoice = Ext.getCmp("invoice").getValue();// 是否发票
	var open="";
    if(invoice == "是"){
    	invoice=1;
    	open ="2"; //未处理
    }else{
    	open ="3"; //无提供
    	invoice=2;
    }
    var invoiceInfo = Ext.getCmp("invoiceInfo").getValue();// 发票信息
    if(invoice == 1 && invoiceInfo == ""){
    	alert("请填写发票信息");
    	return;
    }
    if(invoice == 2)
    	invoiceInfo = "";
	var ordersItem = Ext.getCmp("ordersItem").getValue();// 套餐类型
	if(ordersItem == "请选择"){
		Ext.MessageBox.alert("提示", "请选择套餐");
		return;
	}
	var itemPrice = Ext.get("itemPrice").getValue();// 套餐价格
	var timeLength = Ext.getCmp("timeLength").getValue();// 服务时长
	if(timeLength == "请选择"){
		Ext.MessageBox.alert("提示", "请选择购买时长");
		return;
	}
	timeLength = timeLength * 12;//将年换算为月
	var eName = Ext.getCmp("eName").getValue();// 公司名称
	var uName = Ext.getCmp("uName").getValue();// 联系人dept
	var dept = Ext.getCmp("dept").getValue();// 所属部门
	var position = Ext.getCmp("position").getValue();// 职位
	var phone = Ext.getCmp("phone").getValue();// 手机
	var mobile = Ext.getCmp("mobile").getValue();// 固定电话
	var postCode = Ext.getCmp("postCode").getValue();// 邮政编码
	var email = Ext.getCmp("email").getValue();// 电子邮箱
	var address = Ext.getCmp("address").getValue();// 联系地址
	var notes = Ext.getCmp("notes").getValue();// 备注
	var priceAcount = Ext.getCmp("priceAcount").getValue();// 总金额
	if (parseFloat(priceAcount) < parseFloat("1000")){
		alert("订单总金额不能少于1000元！");
		return false;
	}

	/*var contents = "uid~" + uid + ";city~" + city +";province~"+province+ ";invoice~" + invoice
			+ ";ordersItem~" + ordersItem +";ordersItemType~"+type+ ";itemPrice~" + itemPrice
			+ ";timeLength~" + timeLength + ";eName~"
			+ eName + ";uName~" + uName + ";dept~" + dept + ";email~" + email
			+ ";address~" + address + ";notes~" + notes + ";position~"
			+ position + ";phone~" + phone + ";mobile~" + mobile + ";postCode~"
			+ postCode + ";priceAcount~" + priceAcount + ";type~1"
			+ ";openService~2" + ";sendInvoice~" + open;*/
	var contents = "uid~" + uid + ";city~" + city +";province~"+province+ ";invoice~" + invoice
			+ ";ordersItem~" + ordersItem +";ordersItemType~"+ordersItemId+ ";itemPrice~" + itemPrice
			+ ";timeLength~" + timeLength + ";eName~"
			+ eName + ";uName~" + uName + ";dept~" + dept + ";email~" + email
			+ ";address~" + address + ";notes~" + notes + ";position~"
			+ position + ";phone~" + phone + ";mobile~" + mobile + ";postCode~"
			+ postCode + ";priceAcount~" + priceAcount + ";type~1"
			+ ";openService~2" + ";sendInvoice~" + open+";invoiceInfo~"+invoiceInfo;
	Ext.Ajax.request({
		//url : '/mc/Order.do',
		url : '/ordersitem/group/OrderGroupServlet.do',
		method : 'POST',
		params : {
			//type : 3,
			type : 12,
			content : contents,
			pid:pid
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "添加订单成功", closeWin);
				parent.tab_0208_iframe.ds.reload();
				
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("orders_add");

};




