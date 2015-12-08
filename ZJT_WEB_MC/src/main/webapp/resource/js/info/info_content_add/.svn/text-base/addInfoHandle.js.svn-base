
/* 添加信息 */
var addInfo = function(nodeCheck) {
	if (!info_add_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写表单!");
		return;
	}
	var typename = nodeCheck.text;
	var tid      = nodeCheck.id;	
	var tpath    = nodeCheck.tpath;
	
	var title = Ext.fly("title").getValue();
	if (title == "") {
		Ext.MessageBox.alert("提示", "请输入文章标题！")
		return;
	}

        // shawn添加，默认摘要为空时自动添加摘要;
	if (Ext.fly("summary").dom.value.length <= 0) {
		var acontent = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("acontent").getValue()).replace(/&nbsp;/g, ""));
		Ext.fly("summary").dom.value = acontent.length < 101
				? acontent
				: acontent.substring(0, 100);
	}
	// *******************************

	var eid = Ext.fly("eid").getValue();
	var ename = Ext.fly("ename").getValue();
	var sort = Ext.fly("sort").getValue();
	var source = Ext.fly("source").getValue();
	//从FCKEDITOR编辑器中获取数据
	var contentFck = $.fck.content('acontent', '');
	//var contentFck = "test";
	var summary = Ext.fly("summary").getValue();
	var issueType = Ext.fly("issueType").getValue();
	var tags = Ext.fly("tags").getValue();
	var isTop = info_add_form.form.findField("isTop").getGroupValue();
	var isHot = info_add_form.form.findField("isHot").getGroupValue();
	var picPath = Ext.fly("picPath").dom.src.split('/');
	picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
	if (picPath.lastIndexOf('/') == picPath.length - 1
			|| picPath.lastIndexOf('.jsp') == picPath.length - 4) {
		picPath = "";
	}
	
	var subTitle=Ext.get("subTitle").getValue().trim();
	if(Ext.isEmpty(subTitle))
		subTitle=title;
	//站点的概念去掉
	var sites = "cn~1";
	if (getCurArgs("addNote")) {
		tpath = getCurArgs("tpath");
		tid = getCurArgs("tid");
	}
	
	var province = Ext.get("comboProvinces").getValue();
	var city = Ext.get("comboCities").getValue();
	
	var data = {};
	data["province"]=province;
	data["area"] = city;
	
	if (issueType == "正常发表记录") {
		if (contentFck == "") {
			Ext.MessageBox.alert("提示", "请输入内容！");
			return;
		}
		data["desc"] = contentFck;
		data["content"] = "issueType~1;summary~" + summary + ";title~" + title
				+ ";isHot~" + isHot + ";source~" + source + ";isTop~" + isTop
				+ ";tid~" + tid + ";typename~" + typename + ";tpath~" + tpath
				+ ";tags~" + tags + ";eid~" + eid + ";picPath~" + picPath
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
	} else if (issueType == "使用网页链接") {
		var address = Ext.fly("address").getValue();
		if (address == "") {
			Ext.MessageBox.alert("提示", "请输入网页链接！");
			return;
		}
		data["content"] = "issueType~2;summary~" + summary + ";url~" + address
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;

	} else if (issueType == "使用上传文件") {
		var url = Ext.fly("url").getValue().split("/");

		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Ext.MessageBox.alert("提示", "请先上传文件！");
			return;
		}

		data["content"] = "issueType~3;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
	} else if (issueType == "上传FLASH") {

		var url = Ext.fly("urlF").getValue().split("/");

		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Ext.MessageBox.alert("提示", "请先上传FLASH文件！");
			return;
		}
		data["content"] = "issueType~4;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
	}
	data["type"] = 15;
	submit(data);
};
var operatorMark = "copyAdd";
function copyAddInfo(){
	var checkNode = selectTree.getChecked();
	//如果用户没有选择需要操作的目录，则提醒用户
	if(checkNode.length==0){
		Info_Tip("请至少要选择一个栏目！");
		return;
	}
	operatorMark = "copyAdd";
	//hideButton();
	addInfo(checkNode[0]);	
}
function shareAddInfo(){
	var checkNode = selectTree.getChecked();
	//如果用户没有选择需要操作的目录，则提醒用户
	if(checkNode.length==0){
		Info_Tip("请至少要选择一个栏目！");
		return;
	}
	operatorMark = "shareAdd";
	hideButton();
	addInfo(checkNode[0]);
}
/* end 添加信息 */

var submit = function(data) {
	Ext.Ajax.request({
		method : 'post',
		url : '/InfoContent.do',
		params : data,
		timeout : 1000 * 60 * 5,
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				//获取返回的内容ID
				var contentId = data.result;
				//dealAddContent(contentId);
				var iframe;
				if (getCurArgs("addNote"))
					iframe = parent.tab_0608_iframe;
				else {
					iframe = parent.tab_0608_iframe;
					//iframe.Ext.fly("sortCombo").dom.value = Ext.fly("sortCombo").getValue();
					//iframe.Ext.fly("tid").dom.value = Ext.fly("tid").getValue();
				}
				iframe.Ext.getCmp("exStatus").setValue('1');
				iframe.showEl("sh_menuItem");
				iframe.search();
				Ext.MessageBox.alert("提示", "添加信息成功,请审核！", closeWin);

			} else {
				 Ext.MessageBox.alert("提示", "添加信息失败!");
				 showButton();
			}
		},
		failure : function() {
			 Warn_Tip();
			 showButton();
		}

	});
}
//进行复制和共享操作
function dealAddContent(contentId) {
	var type = -1;
	if(operatorMark == "copyAdd"){
		type = 12;
	}
	if(operatorMark == "shareAdd"){
		type = 14;
	}
	Ext.Ajax.request({
			url : '/InfoContent.do',
			params : {
				type : type,
				id : contentId,
				tid : getCids(),
				content : ''
			}
		});
}
//获取选中的分类，去掉第一个已经添加的分类信息
function getCids() {
	var checkNode = selectTree.getChecked();
	var cids = [];
	for(var i=1;i<checkNode.length;i++){
		cids.push(checkNode[i].id);
	}
	return cids.toString();
}
//隐藏操作按钮
function hideButton() {
	Ext.fly("copyAddInfo").hide();
	//Ext.fly("shareAddInfo").hide();
}
//显示操作按钮
function showButton() {
	Ext.fly("copyAddInfo").show();
	//Ext.fly("shareAddInfo").show();
}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("info_content_add");
};