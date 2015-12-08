var act_add_form;
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
var city = [];

var buildFormPanel = function(){
	act_add_form = new Ext.form.FormPanel({
			frame : true,
			labelAlign : 'right',
			renderTo : 'act_add',
			layout : 'column',
			items : [{
				columnWidth : .05,
				html : '&nbsp;'
			},{
				border : true,
				columnWidth : .65,
				layout : 'form',
				buttonAlign : 'center',
				items : [{
					columnWidth : .65,
					layout : 'column',
					items : [{
						columnWidth : .5,
						height : 'auto',
						title : '基本信息',
						layout : 'form',
						xtype : 'fieldset',
						items :[{
							layout : 'form',
							items : [{
								id : 'actName',
								name : 'actName',
								width : 200,
								xtype : 'textfield',
								allowBlank : false,
								fieldLabel : '活动名称'
							},{
								id : 'contactPhone',
								name : 'contactPhone',
								width : 200,
								xtype : 'textfield',
								allowBlank : false,
								fieldLabel : '联系电话'
							},{
								id : 'bussinessPhone',
								name : 'bussinessPhone',
								width : 200,
								xtype : 'textfield',
								allowBlank : false,
								fieldLabel : '会务电话'
							},{
								id : 'fax',
								name : 'fax',
								width : 200,
								xtype : 'textfield',
								allowBlank : false,
								fieldLabel : '传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;真'
							},{
								id : 'province',
								xtype : 'combo',
								store : pro,
								width : 200,
								valueField : "value",
								displayField : "text",
								mode : 'local',
								forceSelection : true,
								emptyText : '请选择',
								editable : false,
								triggerAction : 'all',
								allowBlank : false,
								readOnly : true,
								fieldLabel : '选择省份',
								listeners : {
									select : function(combo, record, index) {
										var comboCities = Ext.getCmp("city");
										comboCities.reset();
										var province = combo.getValue();
										city = zhcn.getCity(province);
										comboCities.store.loadData(city);
										comboCities.enable();
									}
								}						
							},{
								id : 'city',
								xtype : 'combo',
								store : city,
								valueField : "value",
								displayField : "text",
								mode : 'local',
								forceSelection : true,
								emptyText : '请选择',
								hiddenName : 'region',
								editable : false,
								triggerAction : 'all',
								allowBlank : false,
								readOnly : true,
								fieldLabel : '选择城市',
								name : 'region',
								disabled : true,
								width : 200
							},{
								id : 'actTime',
								name : 'actTime',
								width:200,
								xtype : 'datefield',
								allowBlank : false,
								format : 'Y-m-d',
								editable : false,
								fieldLabel : '活动时间'
							}]
						}]
					},{
						columnWidth : .01,
						html : '&nbsp;'						
					},{
						columnWidth : .49,
						xtype : 'fieldset',
						width : 120,
						height: 219,
						title : '活动LOGO',
						items : [{
							layout : 'form',
							items : [{
								html : '<img id="picPath" src="" width="390px" height="160px" />'
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
				},{
					title:'活动介绍',
					items:[{
							xtype : 'htmleditorself',
							id : 'actIntroduce',
							name : 'actIntroduce',
							width : 805,
							height : 400,
							allowBlank : false,
							requestURL : "http://ftp.concom.cn",
							requestType : 'RS_INFO',
							fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
						}]
				},{
					title:'采购清单',
					items:[{
							xtype : 'htmleditorself',
							id : 'bugDetail',
							name : 'bugDetail',
							width : 805,
							height : 400,
							allowBlank : false,
							requestURL : "http://ftp.concom.cn",
							requestType : 'RS_INFO',
							fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
						}]
				},{
					title:'流程安排',
					items:[{
							xtype : 'htmleditorself',
							id : 'process',
							name : 'process',
							width : 805,
							height : 400,
							allowBlank : false,
							requestURL : "http://ftp.concom.cn",
							requestType : 'RS_INFO',
							fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
						}]
				},{
					title:'线路地图',
					items:[{
							xtype : 'htmleditorself',
							id : 'map',
							name : 'map',
							width : 805,
							height : 400,
							allowBlank : false,
							requestURL : "http://ftp.concom.cn",
							requestType : 'RS_INFO',
							fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
						}]
				}],
				buttons : [{
					text : '提交',
					handler : function(){
						act_submit();
					}
				},{
					text : '重置',
					handler : function(){
						act_add_form.form.reset();
					}
				}]
			},{
				columnWidth : .3,
				html : '&nbsp;'
			}]
		});
}

var act_submit = function(){
	if(act_add_form.form.isValid()){
		//活动LOGO图片验证
		var picPath = Ext.fly("picPath").dom.src.split('/');
		picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
		if (picPath.lastIndexOf('/') == picPath.length - 1
				|| picPath.lastIndexOf('.jsp') == picPath.length - 4) {
			picPath = "";
		}
		if(picPath == ''){
			Ext.MessageBox.alert("提示", "请上传活动LOGO图片");
			return;
		}
		
		//活动介绍验证
		var actIntroduce = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("actIntroduce").getValue()).replace(/&nbsp;/g, ""));
		if(actIntroduce == ''){
			Ext.MessageBox.alert("提示", "请输入活动介绍！");
			return;
		}
		//采购清单验证
		var bugDetail = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("bugDetail").getValue()).replace(/&nbsp;/g, ""));
		if(bugDetail == ''){
			Ext.MessageBox.alert("提示", "请输入采购清单！");
			return;
		}
		//流程安排验证
		var process = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("process").getValue()).replace(/&nbsp;/g, ""));
		if(process == ''){
			Ext.MessageBox.alert("提示", "请输入流程安排！");
			return;
		}
		//线路地图验证
		var map = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("map").getValue()).replace(/&nbsp;/g, ""));
		if(map == ''){
			Ext.MessageBox.alert("提示", "请输入线路地图！");
			return;
		}
		
		actIntroduce = Ext.fly("actIntroduce").getValue().replace(/&nbsp;/g,"");
		bugDetail = Ext.fly("bugDetail").getValue().replace(/&nbsp;/g,"");
		process = Ext.fly("process").getValue().replace(/&nbsp;/g,"");
		map = Ext.fly("map").getValue().replace(/&nbsp;/g,"");
		
		var actName = Ext.fly("actName").getValue();
		var contactPhone = Ext.fly("contactPhone").getValue();
		var bussinessPhone = Ext.fly("bussinessPhone").getValue();
		var fax = Ext.fly("fax").getValue();
		var province = Ext.fly("province").getValue();
		var city = Ext.fly("city").getValue();
		var actTime = Ext.fly("actTime").getValue();
		
		var data = {};
		data["content"] = "actName~" + actName + ";contactPhone~" + contactPhone + ";bussinessPhone~" + bussinessPhone +
			";fax~" + fax + ";province~" + province + ";city~" + city + ";actTime~" + actTime + ";picPath~" + picPath;
		data["type"] = 10;
		data["actIntroduce"] = actIntroduce;
		data["process"] = process;
		data["map"] = map;
		data["bugDetail"] = bugDetail;
			
		Ext.Ajax.request({
			url : '/act/ActivityInfoServlet',
			method : 'POST',
			params : data,
			success : function(response){
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.MessageBox.alert("提示", "操作成功！");
						window.parent.Ext.getCmp('center').remove("act_add");						
					}
			},
			failure : function(){
				Warn_Tip();
			}
		});
	}
}

var showUploadIWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;

};

var init = function() {
	Ext.QuickTips.init(true);
	buildFormPanel();
};

Ext.onReady(init);