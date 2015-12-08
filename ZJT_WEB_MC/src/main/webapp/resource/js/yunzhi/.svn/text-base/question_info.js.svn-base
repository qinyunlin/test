var url = "/yunzhi/QuestionServlet", id, pannel;
var topicIds = [];
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	if (!Ext.isEmpty(getCurArgs("id"))) {
		id = getCurArgs("id");
		getQuestionInfo(id);
		
	}
};
//Returns true if the passed value is found in the
//array.  Returns false if it is not.
Array.prototype.inArray = function (value)
{
 var i;
 for (i=0; i < this.length; i++) {
     // Matches identical (===), not just similar (==).
     if (this[i] === value) {
         return true;
     }
 }
 return false;
};
Array.prototype.indexOf = function(val) {              
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) return i;  
    }  
    return -1;  
};  
Array.prototype.remove = function(val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
};  
function getQuestionInfo(id){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 5,
			qId : id
		},
		async: false,
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				createFormPanel(jsondata);
				initRelateTopic(id);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
var template = new Ext.Template('');
//创建表单
function createFormPanel(data) {
	pannel = new Ext.FormPanel({
		title : "问题查看/修改",
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
							html : "<span style='font-weight:bold;'>发布人信息：</span>"
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
								text : '回答数：' + data.result["answerCount"],
								xtype : 'label'
							}]
				}, {
					bodyStyle : "margin-right:16px;background-color:#DFE8F6;border:none;line-height:40px;",
					items : [{
						text : '发布时间：' + data.result["createOn"],
						xtype : 'label'
					}]
				}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "label",
							html : "<span style='font-weight:bold;'>提问：</span>"
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "textfield",
							id : "qName",
							width : 500,
							maxLength : 300,
							allowBlank : false,
							value : data.result["qName"]
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:20px;",
				items : [{
							xtype : "label",
							html : "<span style='color:red;'>问题字数请大于5个字</span>"
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "label",
							html : "<span style='font-weight:bold;'>问题说明：</span>"
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : 'htmleditorself',
							fieldLabel : '问题说明',
							id : 'qDesc',
							value : data.result["qDesc"],
							width : 556,
							height : 200,
							requestURL : "http://ftp.zjtcn.com",
							requestType : 'RS_INFO',
							fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "label",
							html : "<span style='font-weight:bold;'>选择话题：</span>"
						}]
			},{
				autoHeight : true,
				bodyStyle : "margin:0px 0px 0px 50px;border:none;min-height:40px;_height:40px;font-size:12px;background-color:#DFE8F6;line-height:40px;",
				items : [{
							xtype : "label",
							html : '<div class="ss_ht_box clearfix">'
							   	+'<ul id="selectedTopic" class="ss_ht_inline" style="display:;">'
							    +'</ul>'
							      +'<input id="topicName" name="" type="text"  placeholder="搜索话题" value=""/>'
							+'</div>'
							+'<div class="ss_ht_wrap">'
							        	+'<ul class="ac_renderer" style="display:none;">'
							            +'</ul>'
							+'</div>'
						}]
			},{
				autoHeight : true,
				bodyStyle : "border:none;min-height:40px;_height:40px;font-size:18px;background-color:#DFE8F6;line-height:40px;margin:30px 0px 0px 100px;font-weight:bold;",
				items : [{
							xtype : "tbbutton",
							text : "保存",
							width : 100,
							handler : save,
							hidden : compareAuth("YUNZHI_GUESTION_UPDATE"),
						}]
			}]
		})]
	});
}
function save(){
	
	var qName = Ext.fly("qName").getValue().trim();
	if(qName.length<=5){
		Ext.Msg.alert('提示','问题字数请大于5个字！');
		return;
	}
	var qDesc = Ext.fly("qDesc").getValue();
	if(topicIds.length==0){
		Ext.Msg.alert('提示','至少选择一个话题！');
		return;
	}
	var contents = "qName~"+qName+";qDesc~"+qDesc+";topicIds~"+topicIds.toString();
	Ext.Ajax.request({
		url : url,
		params : {
			type : 6,
			qId : id,
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


$("#topicName").live('keyup',function(e){
	var tname = Ext.fly("topicName").getValue().trim();
	if(tname==""){
		$(".ac_renderer").hide();
		return;
		console.log("topic's name 为空"+tname);
	}
	getTopics(tname);
 }); 

function getTopics(tname) {
	var contents = "tname~"+tname;
	Ext.Ajax.request({
		url : "/yunzhi/TopicServlet",
		params : {
			type : 1,
			pageNo : 1,
			pageSize : 10,
			content : contents,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				createTopicTips(jsondata.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};
function createTopicTips(data){
	var tname = Ext.fly("topicName").getValue().trim();
	$(".ac_renderer").empty();
	if(data.length>0){
		var topicNames = [];
		$(".ac_renderer").show();
		for(var i=0;i<data.length;i++){
			$(".ac_renderer").append('<li class="clearfix" onclick="selectTopic(this)" tip="'+data[i].topicId+'~'+data[i].tname+'">'
                	+'<div class="img_tx">'+convertPicPath(data[i].picPath)+'</div>'
                	+'<div class="ht_jj t_sl">'
                	+'<p>'+data[i].tname+'</p>'
                	+'   <p class="ht_gzdr">'+data[i].attentionCount+'人关注</p>'
                	+' </div>'
                	+'</li>');
			topicNames.push(data[i].tname);
		}
		if(tname != "" && !topicNames.inArray(tname)){
			//<li class="clearfix czht">创建 <b>造价知识造价知造价知识</b> 话题</li>
			$(".ac_renderer").append('<li class="clearfix czht">创建 <b>'+tname+'</b> 话题</li>');
		}
	}else{
		if(tname != ""){
			$(".ac_renderer").show();
			//<li class="clearfix czht">创建 <b>造价知识造价知造价知识</b> 话题</li>
			$(".ac_renderer").append('<li class="clearfix czht">创建 <b>'+tname+'</b> 话题</li>');
		}
	}
}
function convertPicPath(picPath){
	if(Ext.isEmpty(picPath)){
		return '<img src="http://mc.zjtcn.com/resource/images/yunzhi/moren_toux.gif"/>';
	}else{
		return '<img src="http://ftp.zjtcn.com'+picPath+'"/>';
	}
	
}
function selectTopic(obj){
	if(topicIds.length >=5){
		$(".ac_renderer").empty();
		$(".ac_renderer").hide();
		$("#topicName").val('');
		Ext.Msg.alert('提示','最多可选5个话题！');
		return;
	}
	var datas = $(obj).attr("tip").split("~");
	var topId = datas[0];
	var tname = datas[1];
	if(!topicIds.inArray(topId)){
		topicIds.push(topId);
		$("#selectedTopic").append('<li><span>'+tname+'</span><a href="javascript:void(0)" onclick="deleteTopic(this,'+topId+')" class="close"></a></li>');
	}
	$(".ac_renderer").empty();
	$(".ac_renderer").hide();
	$("#topicName").val('');
}
function deleteTopic(obj,topicId){
	$(obj).parent("li").remove();
	if(topicIds.inArray(topicId.toString())){
		topicIds.remove(topicId);
	}
}
//创建新话题
$(".clearfix.czht").live("click",function(){
	if(topicIds.length >=5){
		$(".ac_renderer").empty();
		$(".ac_renderer").hide();
		$("#topicName").val('');
		Ext.Msg.alert('提示','最多可选5个话题！');
		return;
	}
	var tname = $(this).find("b").html();
	var contents = "name~"+tname;
	Ext.Ajax.request({
		url : "/yunzhi/TopicServlet",
		params : {
			type : 10,
			content : contents,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var topId = jsondata.result.id;
				var tname = jsondata.result.name;
				if(!topicIds.inArray(topId)){
					topicIds.push(topId);
					$("#selectedTopic").append('<li><span>'+tname+'</span><a tip="456" href="javascript:void(0)" onclick="deleteTopic(this,'+topId+')" class="close"></a></li>');
				}
				$(".ac_renderer").empty();
				$(".ac_renderer").hide();
				$("#topicName").val('');
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
});
$("li.clearfix").live("hover",function(){
	$(this).toggleClass("bg");
});
$("body").live("click",function(){
	$(".ac_renderer").empty();
	$(".ac_renderer").hide();
});
function initRelateTopic(qid){
	Ext.Ajax.request({
		url : "/yunzhi/QuestionServlet",
		params : {
			type : 10,
			qId : qid,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var datas = jsondata.result;
				for(var i=0;i<datas.length;i++){
					var topId = datas[i].id;
					var tname =  datas[i].name;
					if(!topicIds.inArray(topId)){
						topicIds.push(topId);
					  $("#selectedTopic").append('<li><span>'+tname+'</span><a tip="456" href="javascript:void(0)" onclick="deleteTopic(this,'+topId+')" class="close"></a></li>');
					}
				}
				$(".ac_renderer").empty();
				$(".ac_renderer").hide();
				//$("#topicName").val('');
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}