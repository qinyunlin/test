
function getCids(checkNode) {
	var cids = [];
	for(var i=0;i<checkNode.length;i++){
		cids.push(checkNode[i].id);
	}
	return cids.toString();
}
function copyContent() {
	var checkNode = selectTree.getChecked();
	//如果用户没有选择需要操作的目录，则提醒用户
	if(checkNode.length==0){
		Info_Tip("请至少要选择一个栏目！");
		return;
	}
	var ids = grid.selModel.selections.keys;
	//如果没有选择内容，是提醒用户
	if(ids.length==0){
		Info_Tip("请至少要选择一个内容数据！");
		return;
	}
	Ext.Msg.alert("温馨提示", "您选择的是复制操作。请在复制的目标分类的未审核列表中查找。", function() {
					Ext.Ajax.request({
								url : '/InfoContent.do',
								params : {
									type : 12,
									id : ids.toString(),
									tid : getCids(checkNode),
									content : ''
								},
								success : function(response) {
									var data = eval("(" + response.responseText+ ")");
									if (getState(data.state, commonResultFunc,data.result)) {
										Ext.MessageBox.alert("提示", "已成功复制到指定栏目,请到该栏目未审核信息中审核!");
										search();
									} else {
										Ext.MessageBox.alert("提示", "复制失败！");
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				});
}

function cutContent() {
	var checkNode = selectTree.getChecked();
	//如果用户没有选择需要操作的目录，则提醒用户
	if(checkNode.length==0){
		Info_Tip("请至少要选择一个栏目！");
		return;
	}
	var ids = grid.selModel.selections.keys;
	//如果没有选择内容，是提醒用户
	if(ids.length==0){
		Info_Tip("请至少要选择一个内容数据！");
		return;
	}
	Ext.Msg.alert("温馨提示", "您选择的是剪切操作。请在剪切的目标分类的未审核列表中查找。", function() {
					Ext.Ajax.request({
								url : '/InfoContent.do',
								params : {
									type : 13,
									id : ids.toString(),
									tid : getCids(checkNode),
									content : ''
								},
								success : function(response) {
									var data = eval("(" + response.responseText+ ")");
									if (getState(data.state, commonResultFunc,data.result)) {
										Ext.MessageBox.alert("提示", "已成功剪切到指定栏目,请到该栏目未审核信息中审核!");
										search();
									} else {
										Ext.MessageBox.alert("提示", "剪切失败！");
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				});
}

function shareContent() {
	var checkNode = selectTree.getChecked();
	//如果用户没有选择需要操作的目录，则提醒用户
	if(checkNode.length==0){
		Info_Tip("请至少要选择一个栏目！");
		return;
	}
	var ids = grid.selModel.selections.keys;
	//如果没有选择内容，是提醒用户
	if(ids.length==0){
		Info_Tip("请至少要选择一个内容数据！");
		return;
	}
	Ext.Msg.alert("温馨提示", "您选择的是共享操作。请在共享的目标分类的未审核列表中查找。", function() {
					Ext.Ajax.request({
								url : '/InfoContent.do',
								params : {
									type : 14,
									id : ids.toString(),
									tid : getCids(checkNode),
									content : ''
								},
								success : function(response) {
									var data = eval("(" + response.responseText+ ")");
									if (getState(data.state, commonResultFunc,data.result)) {
										Ext.MessageBox.alert("提示", "已成功共享到指定栏目,请到该栏目未审核信息中审核!");
										search();
									} else {
										Ext.MessageBox.alert("提示", "共享失败！");
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				});
}