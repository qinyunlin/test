var sunshineForm, guestUnitFieldSet;

var comboProvinces,comboCities;

var guestUnitId = 0;
var guestUnitNum = 0;

var zhcn = new Zhcn_Select();
var proStore = zhcn.getProvince(true);
var city = [];

$.fck.config = {
		path : '/resource/plugins/FCKeditor/',
		height : 500,
		width : 750,
		toolbar : 'MCZJTCN'
};

//设置可选范围
var stuffStore = new Ext.data.ArrayStore({
    data: cid_db,//引用stuff_code.js
    fields: ['value', 'text']
});

var selectedStuffStore = new Ext.data.ArrayStore({
    data: [],//引用stuff_code.js
    fields: ['value', 'text']
});

Ext.onReady(function() {
	Ext.QuickTips.init();
	init();
});

function init(){
	buildForm();
	$('#introduction').fck();
	$('#purchaseDetail').fck();
	$('#supplierRequirement').fck();
	$('#purchaserRequirement').fck();
}

function buildForm(){
	var defaultProvince = proStore[0];
	var defaultCity = zhcn.getCity(defaultProvince);
	
	guestUnitFieldSet = new Ext.form.FieldSet({
			id:'guestUnit',
			name:'guestUnit',
			title:'参与企业',
			layout:'column',
			width:750,
			items:[{
					columnWidth:'.09',
					xtype : 'button',
					text : '新添参与企业',
					hidden : compareAuth('CORP_MOD'),
					handler : addGuest
				},{
					columnWidth:'.91'
				}]
	});
	
	
	sunshineForm = new Ext.form.FormPanel({
		id : 'sunshineForm',
		frame : true,
		layout : 'form',
		width:820,
		border : false,
		buttonAlign : "left",
		labelWidth : 120,
		labelAlign : 'right',
		items : [{
			layout:'column',
			items:[{
					columnWidth:.45,
					xtype:'fieldset',
					layout:'form',
					title:'基本信息',
					items:[{
							xtype : 'textfield',
							fieldLabel : '活动标题',
							id : 'title',
							name : 'title',
							width : 220,
							allowBlank : false,
							blankText:"不能为空，请正确填写"
						}, {
							xtype : 'textfield',
							fieldLabel : '举办单位',
							id : 'holdUnit',
							name : 'holdUnit',
							width : 220,
							allowBlank : false,
							blankText:"不能为空，请正确填写"
						}, {
							xtype : 'textfield',
							fieldLabel : '举办地址',
							id : 'holdAddr',
							name : 'holdAddr',
							width : 220,
							allowBlank : false,
							blankText:"不能为空，请正确填写"
						}, {
							xtype : 'textfield',
							fieldLabel : '联系电话',
							id : 'phone',
							name : 'phone',
							width : 220,
							allowBlank : false,
							blankText:"不能为空，请正确填写"
						}, {
							xtype : 'datefield',
							fieldLabel : '开始时间',
							format: 'Y-m-d',
							id : 'startTime',
							name : 'startTime',
							width : 220,
							readOnly:true,
							minValue:new Date(),
							allowBlank : false,
							blankText:"日期不能为空",
							listeners:{
								select : function(){
									var startTime = Ext.getCmp('startTime').getValue();
									Ext.getCmp('endTime').setValue("");
									Ext.getCmp('endTime').enable("true");
									Ext.getCmp('endTime').setMinValue(startTime);
								}
							}
						}, {
							xtype : 'datefield',
							fieldLabel : '结束时间',
							disabled:true,
							format: 'Y-m-d',
							id : 'endTime',
							name : 'endTime',
							width : 220,
							readOnly:true,
							allowBlank : false,
							blankText:"日期不能为空"
						}, {
							xtype : 'combo',
							id : 'province',
							name : 'province',
							store : proStore,
							value : defaultProvince,
							width : 220,
							fieldLabel : '所在省份',
							valueField : "value",
							displayField : "text",
							mode : 'local',
							forceSelection : true,
							editable : false,
							triggerAction : 'all',
							allowBlank : false,
							readOnly : true,
							blankText:"不能为空，请正确填写",
							allowBlank : false,
							listeners : {
								select : function(combo, record, index) {
									var province = combo.getValue();
								    city = zhcn.getCity(province);
									Ext.getCmp("city").store.loadData(city);
									Ext.getCmp("city").setValue(city[0]);
								}
							}
						}, {
							xtype : 'combo',
							id : 'city',
							name : 'city',
							width : 220,
							store : defaultCity,
							value : defaultCity[0],
							valueField : "value",
							displayField : "text",
							mode : 'local',
							forceSelection : true,
							hiddenName : 'region',
							editable : false,
							triggerAction : 'all',
							readOnly : true,
							fieldLabel : '所在城市',
							name : 'region',
							allowBlank : false,
							blankText:"不能为空，请正确填写"
						}, {
							xtype : 'textfield',
							fieldLabel : '序列号',
							id : 'orderCode',
							name : 'orderCode',
							width : 220
						}]
				},{
					columnWidth:.02,
					html:'&nbsp;'
				},{
					columnWidth:.45,
					title:'标题图片',
					xtype:'fieldset',
					width : 450,
					height : 270,
					layout:'form',
					items:[{
							layout : 'form',
							items : [{
									html : '<img id="picPath" src="" width="200px" height="150px" />'
								}, {
									layout : 'table',
									items : [{
												xtype : "button",
												text : '上传',
												handler : function() {
													showUploadIWin();
												}
											}, {
												xtype : "button",
												text : '取消',
												handler : function() {
													Ext.fly("picPath").dom.src = "";
				
												}
									}]
							}]
						}]
				}]
		},guestUnitFieldSet,{
			xtype:'fieldset',
			width:750,
			layout:'table',
			title:'活动介绍',
			items:[{
					xtype : 'textarea',
					id : 'introduction',
					width : 730,
					height : 300
				}]
		},{
			xtype:'fieldset',
			title:'采购范围',
			width:750,
			layout:'table',
			labelAlign:'center',
			items:[{
				xtype: 'itemselector',
				id : 'purchaseRange',
		        name: 'purchaseRange',
		        fieldLabel: '采购范围',
		        imagePath: '/ext/resource/images/default/multiselect/',//图片位置
		        multiselects: [{
		            width: 250,
		            height: 200,
		            store: stuffStore,
		            displayField: 'text',
		            valueField: 'value',
		            legend: '可选择范围'
		        }, {
		            id: 'selectedTypes',
		            width: 250,
		            height: 200,
		            store: selectedStuffStore,
		            displayField: 'text',
		            valueField: 'value',
		            tbar: [{
		                text: 'clear',
		                handler: function(){
		                    sunshineForm.getForm().findField('purchaseRange').reset();
		                }
		            }],
		            legend: '已选择范围'
		        }]
			}]
		},{
			xtype:'fieldset',
			width:750,
			layout:'table',
			title:'采购清单',
			items:[{
					xtype : 'textarea',
					id : 'purchaseDetail',
					width : 730,
					height : 300
				}]
		},{
			xtype:'fieldset',
			layout:'table',
			width:750,
			title:'供应商要求',
			items:[{
					xtype : 'textarea',
					id : 'supplierRequirement',
					width : 730,
					height : 300
				}]
		},{
			xtype:'fieldset',
			layout:'table',
			width:750,
			title:'采购商要求',
			items:[{
					xtype : 'textarea',
					id : 'purchaserRequirement',
					width : 730,
					height : 300
				}]
		}],
		buttons : [{
					text : '保存',
					handler:save
					
				}, {
					text : '重置',
					handler:function(){
						sunshineForm.form.reset();
					}
				}]
	});


	var sunshineWin = new Ext.Panel({
		frame : true,
		layout : "table",
		width:true,
		autoHeight:true,
		renderTo : "purchaseForm",
		items : [sunshineForm]
	});
}

function save(){
	
	if(!sunshineForm.form.isValid()){
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}
	
	var title = Ext.getCmp("title").getValue();
	var holdUnit = Ext.getCmp("holdUnit").getValue();
	var holdAddr = Ext.getCmp("holdAddr").getValue();
	var phone = Ext.getCmp("phone").getValue();
	var startTime = Ext.get("startTime").getValue();
	var endTime = Ext.get("endTime").getValue();
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	var orderCode = Ext.getCmp("orderCode").getValue();
	
	var guestUnit = "";
	
	var picPath = Ext.fly("picPath").dom.src.split('/');
	picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
	if (picPath.lastIndexOf('/') == picPath.length - 1
			|| picPath.lastIndexOf('.jsp') == picPath.length - 4) {
		picPath = "";
	}
	
	var length = guestUnitFieldSet.items.getCount() - 2;
	for(var i=0;i<length;i++){
		var id = guestUnitFieldSet.items.itemAt(i + 2).id;
		var name = Ext.fly(id + "_name").getValue();
		if(!name){
			Ext.MessageBox.alert("提示","参与企业不能为空");
			return;
		}
		
		guestUnit += name + ",";
	}
	
	var purchaseRange = Ext.getCmp("purchaseRange").getValue();
	var purchaseDetail = $.fck.content('purchaseDetail', '');
	var supplierRequirement = $.fck.content('supplierRequirement', '');
	var purchaserRequirement = $.fck.content('purchaserRequirement', '');
	var introduction = $.fck.content('introduction', '');
	
	var contents = "title~" + title + ";holdUnit~" + holdUnit + ";holdAddr~" + holdAddr + ";phone~" + phone
				+ ";startTime~" + startTime + ";endTime~" + endTime + ";province~" + province + ";city~" + city + ";guestUnit~"
				+ guestUnit + ";purchaseRange~" + purchaseRange 
				+ ";picPath~" + picPath + ";orderCode~"+orderCode;
	Ext.Ajax.request({
		url : '/sunshinePurchase.do',
		method:'POST',
		params:{
			type:3,
			content:contents,
			introduction:introduction,
			supplierRequirement:supplierRequirement,
			purchaserRequirement:purchaserRequirement,
			purchaseDetail:purchaseDetail
			
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "活动添加成功",closeWin);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
	
}

function showUploadIWin() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

function up_file_back() {
	Ext.fly("url").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
function up_flash_back() {
	Ext.fly("urlF").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;

};

function addGuest(){
	guestUnitId++
	guestUnitNum++;
	
	var inputId = "guestInput" + guestUnitId;
	var GuestInput = new Ext.form.FieldSet({
		id:inputId,
		columnWidth:.5,
		layout:'form',
		border:false,
		items:[{
				fieldLabel:'企业名称',
				id:inputId+'_name',
				xtype:'textfield',
				width:220
			}],
		buttons:[{
					xtype : 'button',
					text : '删除参与企业',
					handler : function(b) {
						delGuest(inputId);
					}
				}]
	});
	guestUnitFieldSet.add(GuestInput);
	guestUnitFieldSet.doLayout();
}

function delGuest(id){
	guestUnitFieldSet.remove(Ext.getCmp(id));
	guestUnitFieldSet.doLayout();
}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("sunshinePurchaseAdd");
};
