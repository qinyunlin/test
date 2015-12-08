var url = "/mc/wenkuServlet.do", id, firstItem_combo, secondItem_combo, pannel, show_win,secondItemStore;
Ext.onReady(init);
var firstItemStore = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: url
    }),
    reader: new Ext.data.JsonReader({
    	root: 'result',
    	fields:["id","title"]
    }),
    baseParams : {
		type : 3,
		content : "pid~0"
	},
	remoteSort : true
});
firstItemStore.load();
function init() {
	Ext.QuickTips.init(true);
	if (!Ext.isEmpty(getCurArgs("id"))) {
		id = getCurArgs("id");
		getDocumentInfo(id);
	}
};
function getDocumentInfo(id){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 4,
			id : id
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				createFormPanel(jsondata);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//创建表单
function createFormPanel(data) {
	secondItemStore = new Ext.data.Store({
	    proxy: new Ext.data.HttpProxy({
	        url: url
	    }),
	    reader: new Ext.data.JsonReader({
	    	root: 'result',
	    	fields:["id","title"]
	    }),
	    baseParams : {
			type : 3,
			content : "pid~"+data.result["typePid"]
		},
		remoteSort : true
	});
	secondItemStore.load();
	pannel = new Ext.FormPanel({
		title : "文档信息",
		autoHeight : true,
		border : false,
		bodyStyle : {
			background : '#DFE8F6'
		},
		applyTo : "detail",
		autoScroll : true,
		items : [new Ext.form.FieldSet({
			title : "",
			layout : "table",
			bodyStyle : {
				background : '#DFE8F6'
			},
			layoutConfig : {
				columns : 1
			},
			viewConfig : {
				forceFit : true
			},
			items : [{
				autoHeight : true,
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:15px 0px 0px 50px;",
				items : [{
							xtype : "label",
							html : '<h3 style="font-weight:bold;"><b class="ic '+getWenkuIcon(data.result["suffix"])+'"></b><a href="javascript:void(0);" onclick="downloadDocs()">'+data.result["name"]+'</a></h3>&nbsp;&nbsp;<a href="javascript:void(0);" onclick="previewDocs()">预览</a>'
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "label",
							html : "<span style='font-weight:bold;'>上传人信息：</span>"
						}]
			}, {
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 3
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '会员ID：' + data.result["memberId"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '会员昵称：' + data.result["nickName"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						text : '会员类型：' + showDegree(data.result["degree"]),
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
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '<span style="color:red;">*</span>标题：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "name",
								width : 500,
								maxLength : 300,
								allowBlank : false,
								value : data.result["name"]
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
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : "简介：",
								xtype : 'label'
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textarea",
								id : "description",
								fieldLabel : "简介",
								width : 500,
								maxLength : 500,
								emptyText : "选填，最多200汉字",
								value : data.result["description"]
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 3
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '<span style="color:red;">*</span>分类：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : firstItem_combo = new Ext.form.ComboBox({
						id : "firstItem",
						store : firstItemStore,
						mode : "local",
						triggerAction : "all",
						valueField : "id",
						displayField : "title",
						value : data.result["typePid"],
						text : data.result["pidTitle"],
						width : 180,
						listeners:{
							select : function(combo, record, index) {
								secondItem_combo.clearValue();
								secondItemStore.proxy = new Ext.data.HttpProxy({url:url+"?type=3&content=pid~"+combo.getValue()});
								secondItemStore.load();
								Ext.get("secondItem").dom.value = "请选择";
					        }
						}
					})
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : secondItem_combo = new Ext.form.ComboBox({
						id : "secondItem",
						store : secondItemStore,
						mode : "local",
						triggerAction : "all",
						valueField : "id",
						displayField : "title",
						value : data.result["typeId"],
						text : data.result["typeTitle"],
						width : 180
					})
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : "关键字：",
								xtype : 'label'
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textfield",
								id : "keyword",
								width : 500,
								emptyText : "选填，多个关键字用“;”隔开",
								maxLength : 500,
								value : data.result["keyword"]
							}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 3
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								html : '<span style="color:red;">*</span>会员价：',
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:15px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "numberfield",
								id : "score",
								width : 100,
								allowBlank : false,
								value : data.result["score"],
								minValue : 0,
								allowNegative : false,
								allowDecimals : false
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						text : '请输入≥0的整数',
						xtype : 'label'
					}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "margin:0px 0px 0px 100px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : 'checkbox',
								boxLabel : "同意提供云造价会员优惠（8折，折后价取整）",
								id : "vipScore",
								inputValue : "1",
								checked : parseInt(data.result["isSpecial"]) > 0 ? true : false
							}]
				},{
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						text : '勾选本项，文档可被推荐给本站VIP会员，有利于获得更多下载量',
						xtype : 'label'
					}]
				}]
			},{
				autoHeight : true,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:30px 0px 0px 100px;",
				items : [{
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						xtype : "tbbutton",
						text : "通过",
						width : 100,
						handler : function(){
							var callBackFun = function(){
								auditDocument_yes();
							}
							save(callBackFun);
						}
					}]
				}, {
					bodyStyle : "padding-left: 50px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						xtype : "tbbutton",
						text : "不通过",
						width : 100,
						handler : function(){
							auditDocument_no_show();
						}
					}]
				}]
			}]
		})]
	});
	Ext.get("firstItem").dom.value = data.result["pidTitle"];
	Ext.get("secondItem").dom.value = data.result["typeTitle"];
}

//审核通过/不通过
function auditDocument_yes(callBackFun){
	Ext.Msg.confirm("提示", "确定审核通过？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 5,
					content : "state~1;ids~"+id
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Ext.Msg.alert("提示","已审核通过，确定后关闭页面！",function(){
							closeWin();
							parent.tab_document_list_noaudit_iframe.ds_info.reload();
						});
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}

//审核通过/不通过
function auditDocument_no_show(){
	var fs_show = new Ext.form.FormPanel({
		labelAlign : 'left',
		labelWidth : 90,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : 250,
		layoutConfig : {
			columns : 1
		},
		bodyStyle : 'padding:6px',
		items : [{
			layout : 'table',
			bodyStyle : 'border:none;width:500;padding:5px;',
			layoutConfig : {
				columns : 1
			},
			items : [{//单选按钮组
				id: 'auditLogGroup',
	            xtype: 'fieldset',
	            title: '请选择不通过理由：',
	            autoHeight:true,
	            defaultType: 'radio',
	            hideLabels: true,
	            items: [
	                {boxLabel: '您好！抱歉，内容中包含违规信息！如有疑问请联系客服：400-888-9639，谢谢！', name: 'auditLog', inputValue: '您好！抱歉，内容中包含违规信息！如有疑问请联系客服：400-888-9639，谢谢！'},
	                {boxLabel: '您好！抱歉，内容属于无效信息！如有疑问请联系客服：400-888-9639，谢谢！', name: 'auditLog', inputValue: '您好！抱歉，内容属于无效信息！如有疑问请联系客服：400-888-9639，谢谢！' },
	                {boxLabel: '其他', name: 'auditLog', inputValue: '其他' },
	                {
	    				xtype : "textfield",
	    				id : "reason",
	    				maxLength : 255,
	    				value : "",
	    				emptyText : "请输入自定义理由"
	    			}
	            ]
	        }]
		}]
	});
	show_win = new Ext.Window({
		title : "",
		modal : true,
		width : 600,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs_show],
		buttons : [{
					text : "确定",
					handler : function(){
						var auditLog = fs_show.form.findField("auditLog").getGroupValue();
						if(auditLog == "其他"){
							if(Ext.fly("reason").getValue().length == 0){
								alert("请输入自定义理由！");
								return;
							}else
								auditLog = Ext.fly("reason").getValue();
						}
						var callBackFun = function(){
							auditDocument_no(auditLog);
						}
						save(callBackFun);
					}
				}, {
					text : '取消',
					handler : function() {
						show_win.close();
					}
				}]
	});
	show_win.show();
	
}
function auditDocument_no(auditLog){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 5,
			content : "state~2;ids~"+id+";auditLog~"+auditLog
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				show_win.close();
				Ext.Msg.alert("提示","已审核不通过，确定后关闭页面！",function(){
					closeWin();
					parent.tab_document_list_noaudit_iframe.ds_info.reload();
				});
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}


function save(callBackFun){
	var name = Ext.fly("name").getValue();
	var description = Ext.fly("description").getValue();
	var typeId = secondItem_combo.getValue();
	if(typeId == "请选择")
		typeId = 0;
	var typePid = firstItem_combo.getValue();
	if(typePid == "请选择")
		typePid = 0;
	if(typePid == 0){
		Info_Tip("请选择栏目一级分类!");
		return;
	}
	var keyword = Ext.fly("keyword").getValue();
	var score = Ext.fly("score").getValue();
	var vipScore = pannel.form.findField("vipScore").getValue() == true ? 1: score;
	var isSpecial = 0;
	if(vipScore == 1){
		vipScore = parseInt(score * 0.8);
		isSpecial = 1;
	}
	var contents = "name~"+name+";typeId~"+typeId+";typePid~"+typePid+";score~"+score+";vipScore~"+vipScore+";isSpecial~"+isSpecial;
	Ext.Ajax.request({
		url : url,
		async : false,
		params : {
			type : 12,
			id : id,
			content : contents,
			keywords : keyword,
			description : description
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				callBackFun();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function closeWin() {
	window.parent.Ext.getCmp('center').remove("document_info_noaudit");
}
function downloadDocs(){
	window.document.exportform.action = "/WenkuDocDownloadServlet?id="+id;
	window.document.exportform.submit();
}
function previewDocs(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 20,
			id : id
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result.indexOf(".pdf") != -1)
					window.parent.createNewWidget("document_info_preview", '文档预览', '/module/wenku/document_info_preview.jsp?filePath=' + jsondata.result);
				else
					window.open(jsondata.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}