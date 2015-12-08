var url = "/mc/wenkuServlet.do", id, pannel;
Ext.onReady(init);
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
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:15px 0px 0px 50px;font-weight:bold;",
				items : [{
							xtype : "label",
							html : '<h3><b class="ic '+getWenkuIcon(data.result["suffix"])+'"></b><a href="javascript:void(0);" onclick="downloadDocs()">'+data.result["name"]+'</a></h3>'
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
				bodyStyle : "margin:0px 0px 0px 50px;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					autoHeight : true,
					bodyStyle : "padding-left:10px;background-color:#DFE8F6;border:none;line-height:40px;text-align:right;",
					items : [{
								xtype : "label",
								text : "审核不通过理由："
							}]
				}, {
					autoHeight : true,
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "label",
								text : data.result["auditLog"]
							}]
				},{
					autoHeight : true,
					bodyStyle : "padding-left:10px;background-color:#DFE8F6;border:none;line-height:40px;text-align:right;",
					items : [{
								xtype : "label",
								text : "审核人："
							}]
				}, {
					autoHeight : true,
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "label",
								text : data.result["auditor"]
							}]
				}]
			},{
				autoHeight : true,
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:30px 0px 0px 100px;font-weight:bold;",
				items : [{
							xtype : "tbbutton",
							text : "关闭",
							width : 100,
							handler : closeWin
						}]
			}]
		})]
	});
}
function closeWin() {
	window.parent.Ext.getCmp('center').remove("document_info_nopass");
}
function downloadDocs(){
	window.document.exportform.action = "/WenkuDocDownloadServlet?id="+id;
	window.document.exportform.submit();
}