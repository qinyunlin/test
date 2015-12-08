
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
	var isCopy = Ext.getCmp("isCopyForm").form.findField('isCopy')
			.getGroupValue();
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