var store, grid;
var infoId = "";
var tagsAll = "";
var infoStore, sortStore;
var sortCombo, site_form, site, tempwebSite = [];

var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var tempSite = currSite
tempSite.splice(0, 0, ["", "全部"]);
var province_data = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : tempSite
		});
var buildGrid = function() {
	//获取栏目的层级数据
	sortStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/InfoContentType.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'name', 'owner', 'path', 'pid', 'type',
								'amount', 'createBy', 'isLeaf']),
				baseParams : {
					type : 1
				},
				remoteSort : true
			});

	// 处理栏目返回的数据，显示栏目的层级关系.
	sortStore.loadRecords = function(o, options, success) {
		if (!o || success === false) {
			if (success !== false) {
				this.fireEvent("load", this, [], options);
			}
			if (options.callback) {
				options.callback.call(options.scope || this, [], options, false);
			}
			return;
		}
		var r = o.records, t = o.totalRecords || r.length;
		if (!options || options.add !== true) {

			if (this.pruneModifiedRecords) {
				this.modified = [];
			}
			for (var i = 0, len = r.length; i < len; i++) {
				/* 处理name */
				var name = "";
				var mark = "";
				var a = r[i].data.path.split("/");
				if (a.length == 3) {
					name = " ├ " + r[i].data.name;
				} else {
					for (var j = 3; j < a.length; j++) {
						mark += " │ ";
					}
					name = mark + " ├ " + r[i].data.name;
					mark = "";
				}
				r[i].data.name = name;
				/* end 处理name */
				r[i].join(this);
			}
			if (this.snapshot) {
				this.data = this.snapshot;
				delete this.snapshot;
			}
			this.data.clear();
			this.data.addAll(r);
			this.totalLength = t;
			this.applySort();
			this.fireEvent("datachanged", this);
		} else {
			this.totalLength = Math.max(t, this.data.length + r.length);
			this.add(r);
		}
		this.fireEvent("load", this, r, options);
		if (options.callback) {
			options.callback.call(options.scope || this, r, options, true);
		}
	}
	sortStore.on("load", function() {
				sortStore.insert(0, new Ext.data.Record({
									id : 'ALL',
									name : '全部'
								}));
			});
	sortStore.load();

	sortCombo = new Ext.form.ComboBox({
				id : 'sortCombo',
				width:'380',
				hiddenId : 'tid',
				hiddenName : 'tid',
				store : sortStore,
				typeAhead : true,
				mode : 'remote',
				triggerAction : 'all',
				valueField : "id",
				displayField : "name",
				readOnly : true,
				fieldLabel : '分类',
				emptyText : '全部'
			});

	sortCombo.on('select', function() {
				search();
			});
	infoStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/SearchInfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'tid', 'title', 'tags', 'typename', 'createBy',
								'addTime', 'isHot', 'isTop', 'webSite', 'sort',
								'eid', 'ename', 'gd', 'gx', 'cn', 'sc']),
				baseParams : {
					type : 2,
					blur : 'yes',
					isAuditing : 1,
					site : province_data.getAt(0).data.value
				},
				countUrl : '/SearchInfoContent.do',
				countParams : {
					type : '3'
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				store : infoStore,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm,{
							header : '资讯ID',
							sortable : true,
							dataIndex : 'id'
						}, {
							header : '标题',
							sortable : true,
							dataIndex : 'title',
							width : 420
						}, {
							header : 'Tag标签',
							sortable : true,
							dataIndex : 'tags'
						}, {
							header : '信息类型',
							sortable : true,
							dataIndex : 'typename'
						}, {
							header : '关联企业ID',
							sortable : true,
							dataIndex : 'eid'
						}, {
							header : '关联企业名称',
							sortable : true,
							dataIndex : 'ename'
						}, {
							header : '排序',
							sortable : true,
							dataIndex : 'sort',
							editor : {
								xtype : 'numberfield',
								allowDecimals : false,
								allowBlank : false
							}
						}, {
							header : '发表人',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '发表时间',
							sortable : true,
							width : 135,
							dataIndex : 'addTime'
						}, {
							header : '热点',
							sortable : true,
							dataIndex : 'isHot',
							width : 40,
							renderer : rederHT
						}, {
							header : '置顶',
							sortable : true,
							dataIndex : 'isTop',
							width : 40,
							renderer : rederHT
						}, {
							header : '显示站点',
							width : 40,
							dataIndex : 'webSite',
							renderer : function(v, column, data) {
								tempwebSite=[];
								for (site in newsSite_name) {
									if (data.data[site] != "0")
										tempwebSite.push(changeNewSite(site,
												data.data[site]));
								}
								return tempwebSite.toString();
							}
						}],
				bbar : new Ext.ux.PagingToolbar({
							store : infoStore,
							displayInfo : true
						}),
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				renderTo : 'grid'
			});
	var tbar = new Ext.Toolbar({
				id : 'tbar1',
				renderTo : grid.tbar,
				items : [{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								edit();
							}
						}, {
							id : 'del',
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, '-', {
							id : 'copycut',
							text : '复制/移动',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/copy.png',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : function() {
								showCopyCutWin();
							}
						}, '-', {
							text : '添加信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								add();
							}
						}, '-', {
							id : 'bj_menuItem',
							text : '标签相关项目',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							style : 'display: none',
							handler : linkProject
						}, {
							id : 'sh_menuItem',
							text : '审核',
							cls : 'x-btn-text-icon',
							style : 'display: none',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							icon : '/resource/images/add.gif',
							handler : examine
						}]
			});

	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [new Ext.form.ComboBox({
							store : province_data,
							emptyText : "请选择",
							id : 'area_sel',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							allowBlank : false,
							value : province_data.getAt(0).data.value
						}), {
					xtype : "label",
					text : "分类："
				}, sortCombo, {
					xtype : "label",
					text : "标题："
				}, {
					xtype : "textfield",
					id : "title",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, {
					xtype : "label",
					text : "Tag标签:"
				}, {
					xtype : "textfield",
					id : "tags",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, '-', {
					text : '查询',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/zoom.png',
					id : "search",
					handler : search
				}, '-', {
					xtype : "label",
					text : "审核状态："
				}, new Ext.form.ComboBox({
							id : 'exStatus',
							name : 'exStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '已审核'], ['1', '未审核']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '0',
							listeners : {
								select : {
									fn : function() {
										var sortComboText = Ext
												.fly("sortCombo").getValue();
										if (sortComboText == "请选择") {
											Ext.MessageBox.alert("提示",
													"请先选择分类！");
											Ext.fly("exStatus").dom.value = "已审核";
											return;
										}
										if (Ext.fly("exStatus").dom.value == '已审核') {
											// Ext.fly("tbar1").show();
											// hideEl('tbar2');
											hideEl("sh_menuItem");
										} else {
											// hideEl('tbar1');
											// Ext.fly("tbar2").show();
											showEl("sh_menuItem");
										}
										search();
									}
								}
							}
						})]
	});

	grid.addListener('rowcontextmenu', rightClickFn);
	grid.on('beforeedit', function(e) {
				if (!compareAuth("INFO_CONTENT_SORT"))
					return true;
				else
					return false;
			});
	grid.on("afteredit", function(e) {
		var data = {};
		data["content"] = e.field + "~" + e.record.data[e.field];
		data["id"] = e.record.get("id");
		Ext.Ajax.request({
			method : 'post',
			url : "/InfoContent.do?type=3",
			params : data,
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改排序成功！");
					infoStore.reload();
				} else {
					Info_Tip("修改排序成功！");
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	});
	var showDelInfo = new Ext.menu.Menu({
				id : 'rightDelInfo',
				shadom : false,
				items : [{
							handler : function() {
								operateRecord("res");
							},
							text : '还原'
						}, {
							id : 'ComDelete',
							handler : function() {
								operateRecord("comdel");
							},
							text : '还原成功'
						}]
			});

	// 右键菜单
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : edit
						}, {
							text : '锁定',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '复制/移动',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : showCopyCutWin
						}, {
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}]
			});
	var rightClick2 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_MOD"),
							handler : edit
						}, {
							text : '锁定',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '复制/移动',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : showCopyCutWin
						}, {
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}, {
							id : 'sh_item',
							text : '审核',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							handler : function() {
								examine();
							}
						}]
			});
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		if (Ext.fly("exStatus").dom.value == "已审核")
			rightClick1.showAt(e.getXY());
		else
			rightClick2.showAt(e.getXY());
	}
	grid.addListener('celldblclick', function(grid, rowIndex, columnIndex, e) {
				if (columnIndex == 7 && !compareAuth("INFO_CONTENT_SORT")) {
					return;
				} else
					edit();
			});
	// grid.addListener('rowdblclick', rowDblClick);
	grid.on("click", function(e) {
				var rows = grid.getSelectionModel().getSelections();
				if (rows.length == 1 && !isEmpty(rows[0].get("tags"))) {
					showEl("bj_menuItem");
				} else {
					hideEl("bj_menuItem");
				}
			});
	function rowDblClick(grid, rowIndex, e) {
		edit();
	}

	function rederHT(value) {
		var html;
		if (value == 1) {
			html = "是";
		} else if (value = 0) {
			html = "";
		} else {
			html = "否";
		}
		return html;
	};

	if (!isEmpty(getCurArgs("link"))) {
		if (!isEmpty(tagsAll)) {
			Ext.fly("tags").dom.value = tagsAll;
			infoStore.baseParams['content'] = 'tags~' + tagsAll;
			infoStore.load();
		}
	}
	// 对信息价区域显示做预处理
	// infoStore.on("load", function(store, option) {
	// // debugger;
	// var data = store.reader.jsonData.result;
	// var len = data.length;
	// var site = null;
	// var webSite = [];
	// for (var i = 1; i < len; i++) {
	// webSite = [];
	// for (site in newsSite_name) {
	// if (data[i][site] != "0")
	// webSite.push(changeNewSite(site, data[i][site]));
	// }
	// data[i]["webSite"] = webSite.toString();
	// }
	// });
	infoStore.load();
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
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "";
	data += "id=" + ids;
	data += "&type=" + 4;
	data += "&content=isAuditing~1";
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
}

// 添加文章
function add() {
	window.parent.createNewWidget("info_add", '添加信息',
			'/module/info/info_add.jsp');
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
	window.parent
			.createNewWidget("link_project", '相关项目',
					'/module/project/project_manage.jsp?tagsAll=' + tagsAll
							+ "&link=1");

};
// 修改
function edit() {
	var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	infoId = rows[0].get("id");
	tid = rows[0].get("tid");
	window.parent.createNewWidget("info_edit", '修改信息',
			'/module/info/info_edit.jsp?infoId=' + infoId + "&tid=" + tid);
};

// 查找
function search() {
	infoId = "";
	infoStore.baseParams = {};
	var title = Ext.fly("title").getValue();
	var tags = Ext.fly("tags").getValue();
	var content = "";
	var tpath = "";
	var tid = Ext.fly("tid").getValue();
	sortStore.each(function(s) {
				if (s.data.id == tid) {
					tpath = s.data.path;
				}
			});
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
	// var li = Ext.fly("list").dom.value;
	if (es == "已审核")
		infoStore.baseParams['isAuditing'] = 1;
	else if (es == "未审核")
		infoStore.baseParams['isAuditing'] = 0;
	infoStore.baseParams['type'] = 2;
	/*
	 * var li = "列表"; if (es == "已审核" && li == "列表") {
	 * infoStore.baseParams['type'] = 2; } else if (es == "未审核" && li == "列表") {
	 * infoStore.baseParams['type'] = 3; infoStore.countParams['type'] = 5; }
	 * else if (es == "" && li == "已删除列表") { infoStore.baseParams['type'] = 6;
	 * infoStore.countParams['type'] = 7; } if
	 * (Ext.isEmpty(Ext.fly("area_sel").getValue())) { Info_Tip("请选择区域。");
	 * return; }
	 */
	infoStore.baseParams["site"] = Ext.getCmp("area_sel").getValue();
	infoStore.baseParams['blur'] = 'yes';
	infoStore.baseParams['content'] = content;
	infoStore.load();
}

function init() {
	tagsAll = getCurArgs("tagsAll");
	if (isEmpty(tagsAll)) {
		tagsAll = "";
	}
	// getUserWebSite();
	buildGrid();

	// Ext.TipSelf.msg('提示', '请先选择分类。');
};

Ext.onReady(function() {
			init();
		});
