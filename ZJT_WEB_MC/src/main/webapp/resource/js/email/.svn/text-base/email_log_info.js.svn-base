var info_panel;
function buildInfo(id){
	Ext.lib.Ajax.request("post", "/email/EmailSendLogServlet?type=3", {
			success : function(response){
				var jsondata = eval("(" + response.responseText + ")");
				var email_info = jsondata.result;
				var info = new Ext.form.FieldSet({
					title : '邮件日志',
					layout : "table",
					width : 650,
					layoutConfig : {
						columns : 4
					},
					items : [{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "操作人ID："
								}]
					},{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 170,
									readOnly : true,
									value : email_info["operator"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "操作人名称："
								}]
					},{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 170,
									readOnly : true,
									value : email_info["opName"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "模版ID："
								}]
					},{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 170,
									readOnly : true,
									value : email_info["tid"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "模版名称："
								}]
					},{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 170,
									readOnly : true,
									value : email_info["tname"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "邮箱用户ID："
								}]
					},{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 170,
									readOnly : true,
									value : email_info["eid"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "邮箱用户名称："
								}]
					},{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 170,
									readOnly : true,
									value : email_info["ename"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "主题："
								}]
					},{
						colspan : 3,
						autoHeight : true,
						width : 450,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;text-align='right'",
						items : [{
									xtype : "textfield",
									width : 450,
									readOnly : true,
									value : email_info["subject"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "发件邮箱："
								}]
					},{
						colspan : 3,
						autoHeight : true,
						width : 450,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 450,
									readOnly : true,
									value : email_info["fromAddress"]
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "收件邮箱："
								}]
					},{
						colspan : 3,
						autoHeight : true,
						width :450,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "textfield",
									width : 450,
									readOnly : true,
									value : email_info["toAddress"]
								}]
					},{
						colspan : 4,
						layout : 'table',
						autoHeight : true,
						layoutConfig : {
							columns : 2
						},
						items : [{
							width : 100,
							autoHeight : true,
							style : 'vertical-align:top',
							bodyStyle : "position:absolute;top:0;border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
							items : [{
									xtype : "label",
									text : "邮件内容："
								}]
							},{
							width : 450,
							height : 310,
							autoHeight : true,
							autoScroll : true,
							layout : 'form',
							bodyStyle : "border:1px #B5B8C8 solid;background-color: white;min-height:26px;_height:26px;text-align:left;font-size:12px",
							items : [{
								width : 430,
								height : 300,
								html : email_info["content"]
							}]
						}]
					}]
				});
				info_panel = new Ext.form.FormPanel({
					renderTo : 'grid',
					autoWidth : true,
					autoHeight : true,
					padding : 6,
					autoScroll : true,
					frame : true,
					buttonAlign : 'center',
					items : [info,{
						width : 600,
						layout : 'form',
						buttonAlign : 'center',
						buttons : [{
							text : '关闭',
							handler : function(){
								window.parent.Ext.getCmp('center').remove("email_log_info");
							}
						}]
					}]
				});
			},
			failure : function(){
				Ext.Msg.alert("提示", "获取信息失败");
			}
	}, "id=" + id);
};

function init(){
	var id = getCurArgs("id");
	buildInfo(id);
}
Ext.onReady(init);