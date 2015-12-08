var url = "/yunzhi/TopicServlet", id, pannel;
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	if (!Ext.isEmpty(getCurArgs("id"))) {
		id = getCurArgs("id");
		getTopicInfo(id);
	}
};
function getTopicInfo(id){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 5,
			topicId : id
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
		title : "话题查看/修改",
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
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "label",
							html : "<span style='font-weight:bold;'>创建人信息：</span>"
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
								text : '会员昵称：' + data.result["nickname"],
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
					columns : 3
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '关注人数：' + data.result["attentionCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '问题数：' + data.result["questionCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						text : '创建时间：' + data.result["createOn"],
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
								html : '话题：',
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
								value : data.result["tname"]
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
								text : "描述：",
								xtype : 'label'
							}]
				}, {
					bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								xtype : "textarea",
								id : "content",
								fieldLabel : "简介",
								width : 500,
								maxLength : 500,
								emptyText : "",
								value : data.result["content"]
							}]
				}]
			},{
				autoHeight : true,
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:30px 0px 0px 100px;font-weight:bold;",
				items : [{
							xtype : "tbbutton",
							text : "保存",
							width : 100,
							handler : save,
							hidden : compareAuth("YUNZHI_TOPIC_UPDATE")
						}]
			}]
		})]
	});
}
function save(){
	var name = Ext.fly("name").getValue();
	if(Ext.isEmpty(name)){
		Ext.Msg.alert('提示', '话题名称不能为空！');
		return;
	}
	var content = Ext.fly("content").getValue();
	var contents = "name~"+name+";content~"+content;
	Ext.Ajax.request({
		url : url,
		params : {
			type : 6,
			topicId : id,
			content : contents,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("保存成功!");
				
				$.ajax({
					url : "http://yunzhi.zjtcn.com/topic/synchronousTopic.json?topicId="+id,
					type : "GET",
					beforeSend : function(XMLHttpRequest) {// 提交之前的处理代码放在此处,可空着
					},
					success : function(data) {
					},
					error : function(data) {
					}
				});
				
				
				
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
