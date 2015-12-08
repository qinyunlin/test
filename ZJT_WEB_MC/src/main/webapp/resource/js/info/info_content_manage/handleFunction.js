//重新生成内容页面
function buildContentPage() {
	var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	infoId = rows[0].get("id");
	Ext.lib.Ajax.request('post', 'http://mc.zjtcn.com/servlet/GenHtmlServlet', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc,data.result)) {
						window.open(data.result["htmlNetPath"]);
					} 
				},
				failure : function() {
					Ext.Msg.alert('警告', '刷新栏目首页失败。');
				}
			}, "type=content&contentId="+infoId);	
}

//预览内容页面
/*已去除，栏目内容是没有预览功能的
function contentPreView(){
	var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	infoId = rows[0].get("id");
	window.open("/servlet/CMSPreViewServlet?type=content&contentId="+infoId);
}
*/
// 修改
function edit() {
	var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	infoId = rows[0].get("id");
	var tid = rows[0].get("tid");
	window.parent.createNewWidget("info_content_edit", '修改信息','/module/info/info_content_edit.jsp?infoId=' + infoId +'&tid=' + tid);
};

// 查找
function search() {
	infoId = "";
	infoStore.baseParams = {};
	var title = Ext.fly("title").getValue();
	var tags  = Ext.fly("tags").getValue();
	var province=Ext.fly("province").getValue();
	var city=Ext.fly("city").getValue();
	
	var content = "";
	if(province !="全部省份")
	{
	   content += "province~"+province+";";
	}
	if(city != "全部城市" && city !="请选择城市")
	{
	   content += "city~"+city+";";
	}
	var tpath = tPathGlobal;
	var tid = tidGlobal;
	if (tpath) {
		content += "tpath~" + tpath + ";";
	}
	if (title != "") {
		content += "title~" + title + ";";
	}

	if (tags != "") {
		content += "tags~" + tags + ";";
	}

	var es = Ext.fly("exStatus").getValue();
	if (es == "已审核")
		content += "isAuditing~" + 1 + ";"
	else if (es == "未审核")
		content += "isAuditing~" + 0 + ";"
	
	var hot   = Ext.fly("hotStatus").getValue();
	if (hot == "非热点")
		content += "isHot~" + 0 + ";"
	else if (hot == "热点")
		content += "isHot~" + 1 + ";"
	else if (hot == "全部")
		content += "isHot~;"

	var top   = Ext.fly("topStatus").getValue();
	if (top == "非置顶")
		content += "isTop~" + 0 + ";"
	else if (top == "置顶")
		content += "isTop~" + 1 + ";"
	else if (top == "全部")
		content += "isTop~;"
					
	infoStore.baseParams['type'] = 2;
	
	infoStore.baseParams["site"] = '';
	infoStore.baseParams['blur'] = 'yes';
	infoStore.baseParams['content'] = content;
	infoStore.load();
}

// 还原 / 删除 / 彻底删除
var operateRecord = function(act) {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "id=" + ids.toString();
	var actName = "";
	if (act == "del") {
		data += "&type=5";
		actName = "锁定选中信息";
	} else if (act == "res") {
		data += "&type=7";
		actName = "还原选中信息";
	} else if (act == "comdel") {
		data += "&type=6";
		actName = "彻底删除选中信息";
	}
	Ext.MessageBox.confirm("提示", "确定要" + actName + "?", function(btn) {
				if (btn == "yes") {
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Ext.Msg.alert('提示', '锁定成功!');
										infoStore.reload();
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
			});
}

var examine = function() {
	var ids = grid.selModel.selections.keys.toString();
	var eidObj = grid.getSelectionModel().getSelected().get("eid");
	var eids = "";
	//审核企业商铺相关信息，需更新商铺
	if(eidObj){
		eids = eidObj.toString();
	}
	
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	
	var data = "";
	data += "id=" + ids;
	data += "&type=" + 4;
	data += "&content=isAuditing~1";
	data += "&nodePath=" + curr_node_path;//当前栏目类型(企业案例、荣誉资质审核通过之后需要赠送诚信积分)
	
	Ext.lib.Ajax.request('post', '/InfoContent.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "审核成功！");
						infoStore.reload();
					} else {
						Ext.MessageBox.alert("提示", "审核失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};



//取消置顶
var disableTop = function() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "";
	data += "id=" + ids;
	data += "&type=" + 18;
	data += "&content=isTop~1";
	Ext.lib.Ajax.request('post', '/InfoContent.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "取消置顶成功！");
						infoStore.reload();
					} else {
						Ext.MessageBox.alert("提示", "取消置顶失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
}
var disableHot = function (){
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "";
	data += "id=" + ids;
	data += "&type=" + 17;
	data += "&content=isHot~1";
	Ext.lib.Ajax.request('post', '/InfoContent.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "取消热点成功！");
						infoStore.reload();
					} else {
						Ext.MessageBox.alert("提示", "取消热点失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
}
// 添加文章
function add() {
	var tid = tidGlobal;
	window.parent.createNewWidget("info_content_add", '添加信息','/module/info/info_content_add.jsp?tid='+tid);
};
// 相关项目
function linkProject() {
	var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	tagsAll = rows[0].get("tags");
	if (isEmpty(tagsAll)) {
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空, 无相关项目");
		return;
	}
	// 查看相关项目
	window.parent.createNewWidget("link_project", '相关项目','/module/project/project_manage.jsp?tagsAll=' + tagsAll+ "&link=1");

};

/* 复制 */
var copyCutWin;
var buildCopyCutWin = function() {
	site_form = new Ext.form.FormPanel({
				autoWidth : true,
				layout : 'fit',
				frame : true,
				items : {
					layout : 'form',
					items : new Ext.form.FieldSet({
								title : '站点显示',
								layout : 'table',
								layoutConfig : {
									columns : 4
								},
								labelWidth : 50,
								items : Sites_checkbox()
							})
				}
			});
	copyCutWin = new Ext.Window({
				// el : 'copy_cut_win',
				width : parent.Ext.get("tab_0602_iframe").getWidth() / 2,
				height : parent.Ext.get("tab_0602_iframe").getHeight() / 2,
				autoScroll : true,
				title : '复制/移动',
				layout : 'form',
				border : true,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'close',
				bodyStyle : 'padding: 10px',
				items : [{
							layout : 'form',
							labelAlign : 'right',
							bodyStyle : 'padding: 20px',
							items : [new Ext.form.ComboBox({
												id : 'copyCutCom',
												hiddenId : 'copyCutTid',
												hiddenName : 'copyCutTid',
												store : sortStore,
												typeAhead : true,
												mode : 'remote',
												triggerAction : 'all',
												valueField : "id",
												displayField : "name",
												readOnly : true,
												fieldLabel : '将信息复制到分类',
												emptyText : '请选择'
											}), site_form, {
										id : 'isCopyForm',
										xtype : 'form',
										layout : 'form',
										bodyStyle : "border:none;",
										items : [{
													xtype : 'radio',
													boxLabel : '复制',
													inputValue : '1',
													name : 'isCopy',
													checked : true
												}, {
													xtype : 'radio',
													boxLabel : '移动',
													inputValue : '0',
													name : 'isCopy'
												}]
									}]
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								copyCutInfo();
							}
						}, {
							text : '取消',
							handler : function() {
								copyCutWin.close();
							}
						}]
			});
	copyCutWin.show();
};

var showCopyCutWin = function() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	buildCopyCutWin();

};

var copyCutInfo = function() {
	var ids = grid.selModel.selections.keys.toString();
	var tid = Ext.fly("tid").getValue();
	var ccTid = Ext.fly("copyCutTid").getValue();
	if (ccTid == "") {
		Ext.MessageBox.alert("提示", "请先选择分类。");
		return;
	} else if (tid == ccTid) {
		Ext.MessageBox.alert("提示", "不能复制到本身的分类。");
		return;
	}
	var tpath = "";
	var typeName = "";
	var sites = [];
	var siteform = site_form.getForm().items;
	var len = siteform.length;
	for (var i = 0; i < len; i++) {
		if (siteform.map[siteform.keys[i]].checked == true)
			sites.push(siteform.keys[i] + "~1");
		else
			sites.push(siteform.keys[i] + "~0");
	}
	sites = sites.join().replace(/,/g, ";");
	sortStore.each(function(s) {
				if (s.data.id == tid) {
					tpath = s.data.path;
				}
				if (s.data.id == ccTid) {
					typeName = s.data.name;
				}
			});
	var isCopy = Ext.getCmp("isCopyForm").form.findField('isCopy').getGroupValue();
	if (isCopy == "1") {
		Ext.Msg.alert("温馨提示", "您选择的是复制操作。请在复制的目标分类的未审核列表中查找。", function() {
					Ext.Ajax.request({
								url : '/InfoContent.do',
								params : {
									type : 6,
									id : ids,
									tid : ccTid,
									content : sites,
									isCopy : isCopy
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Ext.MessageBox.alert("提示", "已成功复制到"
														+ typeName
														+ ",请到该分类未审核信息中审核!");
										copyCutWin.close();
										infoStore.reload();
									} else {
										Ext.MessageBox.alert("提示", "复制失败！");
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				});
	} else {
		Ext.Ajax.request({
					url : '/InfoContent.do',
					params : {
						type : 6,
						id : ids,
						tid : ccTid,
						content : sites,
						isCopy : isCopy
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Ext.MessageBox.alert("提示", "已成功复制到" + typeName
											+ ",请到该分类未审核信息中审核!");
							copyCutWin.close();
							infoStore.reload();
						} else {
							Ext.MessageBox.alert("提示", "复制失败！");
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	}
};
/* 复制 */