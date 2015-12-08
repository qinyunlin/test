var url = "/yunzhi/AnswerServlet", pannel;
var id;
var keyword="";
var store;
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	if (!Ext.isEmpty(getCurArgs("id"))) {
		id = getCurArgs("id");
		getAnswerInfo();
		getComments();
		showTipForSearch();
	}
};
$("#searchBtn").live("click",function(){
	keyword = $("#keyword").val();
	if(keyword==$("#keyword").attr("tip")){
		keyword="";
	}
	searchComment();
});

/**
 * 搜索框鼠标提示
 */
function showTipForSearch(){
	$("#keyword").val('输入昵称或评论内容搜索...');
	$("#keyword").focus(function(){
		if($("#keyword").val() == $("#keyword").attr("tip")){	

			$("#keyword").val("");
			$("#keyword").keydown(function(e){
		    	if(e.keyCode==13){
		    		keyword=$("#keyword").val();
		    		searchComment();
		    	}
			 }); 
		}
	});
	$("#keyword").blur(function(){
		if($("#keyword").val()==""){
			$("#keyword").val('输入昵称或评论内容搜索...');
	
		}
	});
	
}
function delComment(cid){
		/*Ext.Msg.alert('提示','评论id为 '+cid);
		return;*/
	Ext.Ajax.request({
		url : '/yunzhi/CommentServlet',
		params : {
			type : 3,
			id : cid,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				 store.load();
				Info_Tip("删除评论成功!");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function searchComment(){
   store.baseParam["keyword"] = keyword;
   store.countParam["keyword"] = keyword;
   store.load();
}
function getComments() {
	store = new DataStore({
        url : '/yunzhi/CommentServlet',
        baseParam : {
            type : 1,
            pageSize : 10,
            keyword:'',
            answerId : id
        },
        isShowImg : false,
        bindType : 'template',
        template : 'templatebody',
        templateObj : 'listbody',
        countUrl : "/yunzhi/CommentServlet",
        countParam : {
            type : 2,
            keyword:'',
            answerId : id
        },
        callback : 'page'
    });   
	
	store.commentTypeUtil=function(v){
		if(v!=null && v!=""){
			if(v=="REPLY"){
				return '<span style="margin-left:10px;">回复</span> <a href="javascript:void(0)" class="link-name">@{replyWhoNmae}</a>';
			}else if(v=="COMMONS"){
				return '';
			}
		}
		return "";
	};
	store.compareAuthUtil=function(v){
		//有些权限返回false，即不隐藏
		var flag = compareAuth("YUNZHI_COMMENT_DELETE");
		if(!flag){
			return '';
		}
		return "none";
	};
	store.load();
};


//分页回到函数
function page() {
	new StorePage({ "showBoxId":"page", "type":"1","store":store});
	if(store.data["count"]=="0"){
		$("#com_search_tips").css("display","block");
	}else{
		$("#com_search_tips").css("display","none");;
	}
};
function getAnswerInfo(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 5,
			answerId : id
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
		title : "回答查看/修改",
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
							html : "<span style='font-weight:bold;'>回答人信息：</span>"
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
					columns : 5
				},
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '点赞数：' + data.result["approvalCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '评论数：' + data.result["commentCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '收藏数：' + data.result["favoriteCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
								text : '感谢数：' + data.result["gratitudeCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						text : '回答时间：' + data.result["createOn"],
						xtype : 'label'
					}]
				}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;text-align:left;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				//bodyStyle : "background-color:#DFE8F6;border:none;line-height:40px;",
				items : [{
							xtype : 'htmleditorself',
							fieldLabel : '回答内容',
							id : 'content',
							value : data.result["content"],
							width : 556,
							height : 200,
							requestURL : "http://ftp.zjtcn.com",
							requestType : 'RS_INFO',
							fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
						}]
			},{
				autoHeight : true,
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:30px 0px 0px 100px;font-weight:bold;",
				items : [{
							xtype : "tbbutton",
							text : "保存",
							width : 100,
							handler : save,
							hidden : compareAuth("YUNZHI_ANSWER_UPDATE")
						}]
			}]
		})]
	});
}
function save(){
	var content = Ext.fly("content").getValue();
	if(Ext.isEmpty(content)){
		Ext.Msg.alert('提示','回答内容不能为空！');
		return;
	}
	var contents = "content~"+content;
	Ext.Ajax.request({
		url : url,
		params : {
			type : 6,
			answerId : id,
			content : contents,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("保存成功!");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
