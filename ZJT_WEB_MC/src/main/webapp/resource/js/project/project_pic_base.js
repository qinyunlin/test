var ImageDetail = function(config) {
	this.config = config;
}
var img_detail = {
	requestUrl : "",
	store : null,
	win : null,
	id : ''
};
ImageDetail.prototype = {
	lookup : {},
	show : function(el, callback) {
		if (!this.win) {
			this.initTemplates();
			this.store = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : this.config.url
								}),
						reader : new Ext.data.JsonReader({
									root : 'result'
								}, ['name', 'path', "id", 'upTime',
										'description']),
						baseParams : {
							method : this.config.method,
							pid : this.config.pid
						}
					});
			this.store.load();
			img_detail.id = this.config.pid;
			img_detail.store = this.store;
			var formatSize = function(data) {
				if (data.size < 1024) {
					return data.size + " bytes";
				} else {
					return (Math.round(((data.size * 10) / 1024)) / 10) + " KB";
				}
			};
			img_detail.requestUrl = this.config.url;
			var formatData = function(data) {
				data.shortName = data.name.ellipse(15);
				data.sizeString = formatSize(data);
				if (data.path != null && data.path != "") {
					data.path = data.path.split(".");
					data.path = data.path[0] + "_160." + data.path[1];
				}
				data.changePath = FileSite + data.path;
				data.dateString = data.upTime.slice(0, 10);
				this.lookup[data.id] = data;
				return data;
			};

			this.view = new Ext.DataView({
						tpl : this.thumbTemplate,
						singleSelect : true,
						overClass : 'x-view-over',
						itemSelector : 'div.thumb-wrap',
						emptyText : '<div style="padding:10px;">没有图片符合要求...</div>',
						store : this.store,
						listeners : {
							'dblclick' : {
								fn : this.doCallback,
								scope : this
							},
							'loadexception' : {
								fn : this.onLoadException,
								scope : this
							},
							'beforeselect' : {
								fn : function(view) {
									return view.store.getRange().length > 0;
								}
							}
						},
						prepareData : formatData.createDelegate(this)
					});

			var cfg = {
				title : '选择图片',
				id : 'img-chooser-dlg',
				layout : 'border',
				minWidth : 500,
				minHeight : 460,
				modal : true,
				closeAction : 'close',
				border : false,
				items : [{
							id : 'img-chooser-view',
							region : 'center',
							autoScroll : true,
							items : this.view
						}],
				buttons : [{

							text : '删除图片',
							handler : function() {
								this.delImg();
							},
							scope : this
						}, {

							text : '添加图片',
							handler : this.showUpload,
							scope : this
						}, {
							id : 'ok-btn',
							text : '设置标题图片',
							handler : this.doCallback,
							scope : this
						}, {
							text : '关闭',
							handler : function() {
								this.win.close();
							},
							scope : this
						}],
				keys : {
					key : 27, // Esc key
					handler : function() {
						this.win.close();
					},
					scope : this
				}
			};
			Ext.apply(cfg, this.config);
			this.win = new Ext.Window(cfg);
		}

		this.reset();
		this.win.show(el);
		this.callback = callback;
		this.animateTarget = el;

	},

	initTemplates : function() {
		this.thumbTemplate = new Ext.XTemplate(
				'<tpl for=".">',
				'<div class="thumb-wrap" id="{id}">',
				'<div class="thumb"><img src="{changePath}" title="{name}"></div>',
				'<span>{shortName}</span></div>', '</tpl>');
		this.thumbTemplate.compile();

	},

	reset : function() {
		if (this.win.rendered) {
			Ext.getCmp('filter').reset();
			this.view.getEl().dom.scrollTop = 0;
		}
		this.view.store.clearFilter();
		this.view.select(0);
	},
	showUpload : function() {
		img_detail.win = new Ext.Window({
					title : '上传文件',
					modal : true,
					width : 320,
					autoHeight : true,
					labelWidth : 60,
					closeAction : 'close',
					bodyStyle : 'padding:6px;',
					layout : 'form',
					items : [{
								fieldLabel : '图片名称',
								xtype : 'textfield',
								id : 'file_title_input',
								allowBlank : false,
								width : 200
							}, {
								fieldLabel : '图片描述',
								xtype : 'textarea',
								id : 'file_desc_input',
								allowBlank : false,
								width : 200,
								height : 80
							}],
					buttons : [{
								text : '上传',
								handler : function() {
									var name = Ext.fly("file_title_input")
											.getValue();
									var desc = Ext.fly("file_desc_input")
											.getValue();
									if (Ext.isEmpty(name)) {
										Info_Tip("图片名称不能为空。");
										return;
									}
									if (Ext.isEmpty(desc)) {
										Info_Tip("图片描述不能为空。");
										return;
									}
									this.uploadImg();
								},
								scope : this
							}]
				});
		img_detail.win.show();
	},

	doCallback : function() {
		var selNode = this.view.getSelectedNodes()[0];
		var lookup = this.lookup;
		var data = lookup[selNode.id];
		var obj = this.config;
		var win = this;
		Ext.Msg.confirm("确认操作", "请问你要设置该图片为标题图片吗？", function(op) {
					if (op == 'yes') {
						Ext.Ajax.request({
									url : obj["url"],
									params : {
										method : 'setFlagPic',
										id : data['id']
									},
									success : function(response) {
										var jsondata = eval("("
												+ response.responseText + ")");
										if (getState(jsondata.state,
												commonResultFunc,
												jsondata.result)) {
											Ext.MessageBox.alert("提示",
													"标题图片设置成功。", function() {
														window.location
																.reload();
													});
											win.win.close();
										}
									},
									failure : function() {
										Warn_Tip();
									}
								});
					}
				});
	},

	onLoadException : function(v, o) {
		this.view
				.getEl()
				.update('<div style="padding:10px;">Error loading images.</div>');
	},
	uploadImg : function() {
		FileUpload_Ext.clearConfig();
		FileUpload_Ext.requestId = this.config.pid;
		FileUpload_Ext.requestType = "RS_PROJ";
		FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
		FileUpload_Ext.callbackFn = "pro_upload_pic";
		FileUpload_Ext.initComponent();
	},
	delImg : function() {
		var obj = this;
		Ext.Msg.confirm("确认操作", "您确认要删除选中的图片吗？", function(op) {
					if (op == 'yes') {
						var selNode = obj.view.getSelectedNodes()[0];
						var lookup = obj.lookup;
						var data = lookup[selNode.id];
						Ext.Ajax.request({
									url : obj.config.url,
									params : {
										method : 'delete',
										id : data['id']
									},
									success : function(response) {
										var jsondata = eval("("
												+ response.responseText + ")");
										if (getState(jsondata.state,
												commonResultFunc,
												jsondata.result)) {
											Info_Tip("图片删除成功。");
											img_detail.store.reload();
										}
									},
									failure : function() {
										Warn_Tip();
									}
								});
					}
				})
	}
};

String.prototype.ellipse = function(maxLength) {
	if (this.length > maxLength) {
		return this.substr(0, maxLength - 3) + '...';
	}
	return this;
};
function pro_upload_pic() {
	var path = FileUpload_Ext.callbackMsg;
	var size = FileUpload_Ext.fileSize;
	var name = Ext.fly("file_title_input").getValue();
	var desc = Ext.fly("file_desc_input").getValue();
	Ext.Ajax.request({
				url : img_detail.requestUrl,
				params : {
					method : 'add',
					path : path,
					pid : img_detail.id,
					name : name,
					desc : desc
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						img_detail.store.reload();
						img_detail.win.close();
					}

				},
				failure : function() {
					Warn_Tip();
				}
			});
};