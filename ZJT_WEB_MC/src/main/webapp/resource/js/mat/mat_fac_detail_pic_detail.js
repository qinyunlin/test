var ImageDetail = function(config) {
	this.config = config;
}
var img_detail = {
	requestUrl : "",
	mid : '',
	store : null,
	win : null,
	id : '',
	config : null
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
								}, ['name', 'path', "id", 'upTime', 'description']),
						baseParams : {
							type : 4,
							fid : this.config.id
						}
					});
			this.store.load();
			img_detail.config = this.config;
			img_detail.id = this.config.id;
			img_detail.store = this.store;
			var formatSize = function(data) {
				if (data.size < 1024) {
					return data.size + " bytes";
				} else {
					return (Math.round(((data.size * 10) / 1024)) / 10) + " KB";
				}
			};
			img_detail.requestUrl = this.config.url;
			img_detail.mid = this.config.mid;
			var formatData = function(data) {
				data.shortName = data.name != null ? data.name.ellipse(15) : "";
				data.sizeString = formatSize(data);
				if(data.path!=null&&data.path!=""){
					data.path=data.path.split(".");
					data.path=data.path[0]+"_160."+data.path[1];
				}
				data.changePath = FileSite + data.path;
				data.dateString = data.upTime.slice(0, 10);
				//新增描述
				if(data.description)
					data.shortDescription = data.description.length > 50 ? 
						Ext.util.Format.ellipsis(data.description, 50) + "..." : data.description;
				else
					data.shortDescription = "";
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
				minWidth : 520,
				minHeight : 300,
				modal : true,
				closeAction : 'close',
				border : false,
				items : [{
							id : 'img-chooser-view',
							region : 'center',
							width : "100%",
							autoScroll : true,
							items : this.view

						}],
				buttons : [{

							text : '为该材料上传图片',
							handler : this.showUpload,
							scope : this
						}, {
							id : 'ok-btn',
							text : '设置材料图片',
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
				'<span style="text-align:left;float:left;">名称：</span><span style="text-align:left;float:left;">{shortName}</span>',
				'<div class="x-clear"></div>',
				'<span style="text-align:left;float:left;">描述：</span><span style="display:block;text-align:left;float:left;height:30px;">{shortDescription}</span></div>',
				'</tpl>');
		this.thumbTemplate.compile();

	},
	showUpload : function() {
		img_detail.win = new Ext.Window({
					title : '上传文件',
					modal : true,
					width : 320,
					autoHeight : true,
					labelWidth : 70,
					labelAlign : 'right',
					bodyStyle : 'padding:6px;',
					layout : 'form',
					items : {
						fieldLabel : '图片名称',
						xtype : 'textfield',
						id : 'file_title_input'
					},
					buttons : [{
						text : '下一步',
						handler : function() {
							if (Ext.isEmpty(Ext.fly("file_title_input")
									.getValue())) {
								Ext.MessageBox.alert("提示", "图片名称不能为空");
								return;
							}
							this.uploadImg();
						},
						scope : this
					}]
				});
		img_detail.win.show();
	},

	reset : function() {
		if (this.win.rendered) {
			Ext.getCmp('filter').reset();
			this.view.getEl().dom.scrollTop = 0;
		}
		this.view.store.clearFilter();
		this.view.select(0);
	},

	doCallback : function() {
		var selNode = this.view.getSelectedNodes()[0];
		var lookup = this.lookup;
		var data = lookup[selNode.id];
		var obj = this.config;
		var win = this.win;
		var pathArray = data['path'].split(".");	
		pathArray[0] = pathArray[0].substring(0, pathArray[0].lastIndexOf("_160"));
		var path1 = pathArray[0] + "." + pathArray[1];
		var path2 = pathArray[0] + "_230." + pathArray[1];
		Ext.Msg.confirm("确认操作", "请问你要为选中的材料设置该图片为材料图片吗？", function(op) {
			if (op == 'yes') {
				Ext.Ajax.request({
					url : obj["url"],
					params : {
						type : 3,
						path : path1,
						mid : obj["mid"]
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc,
								jsondata.result)) {
							Ext.fly("mat_img").dom.src = FileSite
									+ path2;
							Info_Tip("材料图片设置成功。");
							//ds.reload();
							win.close();
						}
					},
					failure : function() {
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
		FileUpload_Ext.requestId = this.config.id;
		FileUpload_Ext.requestType = "RS_EP";
		FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
		FileUpload_Ext.callbackFn = "mat_upload_pic";
		FileUpload_Ext.initComponent();
	}
};

String.prototype.ellipse = function(maxLength) {
	if (this.length > maxLength) {
		return this.substr(0, maxLength - 3) + '...';
	}
	return this;
};
function mat_upload_pic() {
	var path = FileUpload_Ext.callbackMsg;
	var size = FileUpload_Ext.fileSize;
	Ext.Ajax.request({
		url : img_detail.requestUrl,
		params : {
			type : 3,
			path : path,
			mid : img_detail.mid
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {

				Ext.Ajax.request({
							url : img_detail.requestUrl,
							params : {
								type : 1,
								fid : img_detail.id,
								path : path,
								name : Ext.fly("file_title_input").getValue()
							},
							success : function(response) {
								img_detail.store.reload();
								img_detail.win.close();
								//ds.reload();
								path = path.split(".");
								path = path[0].toString().slice(0,path[0].lastIndexOf("_")) + "_230."
										+ path[1].toString();
								Ext.fly("mat_img").dom.src = FileUpload_Ext.requestURL
										+ path;
								// img_detail.config.row.data['topPhoto']
								// = path;

							},
							failure : function() {
								Warn_Tip();
							}
						});
			}

		},
		failure : function() {
			Warn_Tip();
		}
	});
};