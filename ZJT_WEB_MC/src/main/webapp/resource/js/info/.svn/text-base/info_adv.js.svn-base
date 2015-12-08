var store, grid;
var infoId = "";
var tagsAll="";
var infoStore, sortStore;
var tempSite = currSite
tempSite.splice(0, 0, ["", "全部"]);
var province_data = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : tempSite
		});
var buildGrid = function() {

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

	// 处理返回的数据
	sortStore.loadRecords = function(o, options, success) {
		if (!o || success === false) {
			if (success !== false) {
				this.fireEvent("load", this, [], options);
			}
			if (options.callback) {
				options.callback
						.call(options.scope || this, [], options, false);
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
	sortStore.on("load", function(){
		sortStore.insert(0, new Ext.data.Record({id: 'ALL', name : '全部'}));
	});
	var sortCombo = new Ext.form.ComboBox({
				id : 'sortCombo',
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
				emptyText : '请选择'
			});
	sortCombo.on('select', function() {
				Ext.getCmp("del").setDisabled(false);
				
				search();
			});

	infoStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/SearchInfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'title', 'tags', 'typename', 'createBy',
								'addTime', 'isHot', 'isTop', 'isAuditing']),
				baseParams : {
					type : 2,
					//content : 'title~;tags~;tpath~/3/',
					blur : 'yes',
					site:'',
					isLock : 1
					//tid : 2
				},
				countUrl : '/SearchInfoContent.do',
				countParams : {
					type : 3
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : 'id'
	});
	grid = new Ext.grid.GridPanel({
				store : infoStore,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '标题',
							dataIndex : 'title',
							width : 250
						}, {
							header : 'Tag标签',
							dataIndex : 'tags'
						}, {
							header : '信息类型',
							dataIndex : 'typename'
						}, {
							header : '发表人',
							dataIndex : 'createBy'
						}, {
							header : '发表时间',
							dataIndex : 'addTime'
						}, {
							header : '热点',
							dataIndex : 'isHot',
							renderer : rederHT
						}, {
							header : '置顶',
							dataIndex : 'isTop',
							renderer : rederHT
						}, {
							header : '已审核',
							dataIndex : 'isAuditing',
							renderer : rederHT
						}],
				bbar : new Ext.ux.PagingToolbar({
							store : infoStore,
							displayInfo : true
						}),
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_MOD"),
							handler : function() {
								edit();
							}
						}, '-', {
							id : 'ComDelete',
							text : '解锁',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/lock_open.png",
							hidden : compareAuth("INFO_CONTENT_RESTORE"),
							handler : function() {
							operateRecord("res");
							}
						}, '-', {
							id : 'del',
							text : '删除',
					        cls : 'x-btn-text-icon',
					        icon : '/resource/images/delete.gif',
					        hidden : compareAuth("INFO_CONTENT_DEL"),
							handler : function() {
							operateRecord("comdel");
							}
						}],
				renderTo : 'grid'
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
						}),{
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
						}]
	});
	
	grid.addListener('rowcontextmenu', rightClickFn);

	var rightClick = new Ext.menu.Menu({
				id : 'rightDelInfo',
				shadom:false,
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_MOD"),
							handler : function() {
								edit();
							}
						},{
							text : '解锁',
							hidden : compareAuth("INFO_CONTENT_RESTORE"),
							handler : function() {
								operateRecord("res");
							}
						}, {
							text : '删除',
							hidden : compareAuth("INFO_CONTENT_DEL"),
							handler : function() {
								operateRecord("comdel");
							}
						}]
			});

	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	}

	/*
	grid.addListener('rowclick', rowClickFn);
	function rowClickFn() {
		grid.getSelectionModel().each(function(rec) {
					infoId = rec.get("id"); // 记录中的字段id
					
					tagsAll=rec.get("tags");
				})
	}
	*/
	
	grid.addListener('rowdblclick', rowDblClick);

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
};

/* 复制 */
var copyCutWin;
var buildCopyCutWin = function() {
	copyCutWin = new Ext.Window({
				el : 'copy_cut_win',
				width : 365,
				height : 160,
				title : '复制',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
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
									})]
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								copyCutInfo();
							}
						}, {
							text : '取消',
							handler : function() {
								copyCutWin.hide();
							}
						}]
			});
};

var showCopyCutWin = function() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择记录！");
		return;
	}
	if (copyCutWin == null) {
		buildCopyCutWin();
		copyCutWin.show();
	} else {
		copyCutWin.show();
	}
};

var copyCutInfo = function() {
	var ids = grid.selModel.selections.keys.toString();
	var data = "id=" + ids;
	data += "&type=15";
	var tid = Ext.fly("tid").getValue();
	var ccTid = Ext.fly("copyCutTid").getValue();
	if (ccTid == "") {
		Ext.MessageBox.alert("提示", "请先选择分类。");
		return;
	} else if (tid == ccTid) {
		Ext.MessageBox.alert("提示", "不能复制到本身的分类。");
		return;
	}
	data += "&tid=" + ccTid;
	var tpath = "";
	sortStore.each(function(s) {
				if (s.data.id == tid) {
					tpath = s.data.path;
				}
			});
	data += "&tpath=" + tpath;
	Ext.lib.Ajax.request('post', '/InfoContent.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "复制成功！");
						infoStore.reload();
					} else {
						Ext.MessageBox.alert("提示", "复制失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};
/* 复制 */

// 还原 / 删除 / 彻底删除
var operateRecord = function(act) {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "id=" + ids;
	var actName = "";
	if (act == "del") {
		data += "&type=5";
		actName = "删除选中的信息";
	} else if (act == "res") {
		data += "&type=7";
		actName = "还原选中的信息";
	} else if (act == "comdel") {
		data += "&type=2";
		actName = "彻底删除选中的信息";
	}
	Ext.MessageBox.confirm("提示", "确定要" + actName + "?", function(btn) {
				if (btn == "yes") {
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (data && data.state == 'success') {
										Ext.Msg.alert('提示',actName+ '成功!');
										infoStore.reload();
									} else {
										Ext.MessageBox.alert("提示", actName
														+ "失败!");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
			});
}

// 修改
function edit() {
	var rows = grid.getSelectionModel().getSelections();
	if(isEmpty(rows)){
		Ext.Msg.alert("提示", "请选择信息");
		return ;
	}
	infoId = rows[0].get("id");
	window.parent.createNewWidget("info_edit" , '修改信息',
			'/module/info/info_edit.jsp?infoId=' + infoId);
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

	if (tid == "") {
		Ext.MessageBox.alert("提示", "请先选择分类！");
		return;
	}
	sortStore.each(function(s) {
				if (s.data.id == tid) {
					tpath = s.data.path;
				}
			});
	if(tpath){
		content += "tpath~" + tpath + ";";
	}
	if (title != "") {
		content += "title~" + title + ";";
	}

	if (tags != "") {
		content += "tags~" + tags + ";";
	}
	infoStore.baseParams["site"] = Ext.getCmp("area_sel").getValue();
	infoStore.baseParams['type'] = 2;
	infoStore.baseParams['isLock'] = 1;
	infoStore.baseParams['blur'] = 'yes';
	infoStore.baseParams['content'] = content;
	infoStore.load();
}

function init() {
	buildGrid();
	Ext.TipSelf.msg('提示', '请先选择分类。');
};

Ext.onReady(function() {
			init();
		});
