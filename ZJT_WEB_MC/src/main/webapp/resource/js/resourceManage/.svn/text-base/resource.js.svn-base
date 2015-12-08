var tree;
var grid;
var ds;
var isUsed = 0;
var res_id = '0';
var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0001',
				draggable : false,
				text : '资源管理'
			});
	tree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/ResCatalog.do?type=1'
						}),
				root : root,
				border : false,
				animate : true,
				autoScroll : true,
				containerScroll : true
			});

	/* 修改返回的数据 */
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth" || o.state == "nologin") {
				Ext.MessageBox.alert('提示', o.result);
				o = [];
			}
			node.beginUpdate();
			for (var i = 0, len = o.length; i < len; i++) {

				o[i].text = o[i].cname;
				o[i].id = o[i].cata_id;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}else{
					o[i].leaf = false;
				}
				
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [node]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	tree.on('click', function(node) {
		node.expand();
		node.select();
		res_id = node.id;
		ds.proxy = new Ext.data.HttpProxy({
			url : '/WebRes.do?type=1'
		});
		ds.load({
					params : {
						id : node.id
					}
				});
		node.expand();
	});
	root.expand();
	root.select();
}
var buildGrid = function(){
		ds = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : '/WebRes.do?type=1'
				}),
		reader : new Ext.data.JsonReader({
					root : 'result'
				}, ['id', 'res_id', 'cname','available','reason','file_type','file_url','file_size','modify_user', 'modify_time'])
	});
	var sm = new Ext.grid.RowSelectionModel({
			singleSelect : true
		});
	var cm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : 'id'
		});
	grid = new Ext.grid.EditorGridPanel({
			store : ds,
			sm : sm,
			viewConfig : {
				forceFit : true
			},
			columns : [new Ext.grid.RowNumberer(), cm, {
						header : '资源名称',
						width : 20,
						sortable : true,
						dataIndex : 'cname',
						editor : new Ext.form.TextField()
					}, {
						header : '大小（单位：KB）',
						width :20,
						sortable : true,
						dataIndex : 'file_size'
					},{
						header : '类型',
						width : 20,
						sortable : true,
						dataIndex : 'file_type'
					},{
						header : '是否可用',
						width : 20,
						sortable : true,
						dataIndex : 'available',
						renderer:function(value){
							if(value=='1')
								return '可用';
							return '不可用';
						}
					}, {
						header : '不可用的原因',
						width : 20,
						sortable : true,
						dataIndex : 'reason'
					}, {
						header : '资源地址',
						width : 20,
						sortable : true,
						dataIndex : 'file_url',
						renderer:function(value){
							return '<a href="#" onclick="copyToClipboard(\''+value+'\')">复制地址</a>';
						}
					}, {
						header : '预览',
						width : 20,
						sortable : true,
						dataIndex : 'file_url',
						renderer:function(value){
							var strFilter = ['jpeg','gif','jpg','png','bmp','pic'];
							var stu = value.substr(value.lastIndexOf('.')+1);
							for(var i=0; i<strFilter.length; i++){
								if(strFilter[i]==stu)
									return '<a href="'+value+'" title="点击查看原图" target="_blank"><img src="'+value+'" style="width:120px; height:50px;"></a>';
							}
							return '<a href="'+value+'">点击打开</a>';
						}
					}, 
					
					{
						header : '修改时间',
						width : 30,
						sortable : true,
						dataIndex : 'modify_time'
					}, {
						header : '创建人',
						width : 10,
						sortable : true,
						dataIndex : 'modify_user'
					}],
			bbar : new Ext.ux.PagingToolbar({
						store : ds,
						displayInfo : true
					}),
			border : false,
			selModel : new Ext.grid.RowSelectionModel()
		});

	grid.on('afteredit', function(e) {
		if (e.record.data.cname == "") {
			Ext.Msg.alert("提示", "分类名称不能为空！", function() {
						Ext.fly(this).focus();
					});
			return;
		}
		Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request('post', '/WebRes.do', {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {
											var node = tree.getSelectionModel().getSelectedNode();
											if(!node.isLeaf()){
												node = node.findChild('id',
															e.record.data.cata_id);
											}	
											if (node) {
												node.setText(e.record.data.cname);
											}
											ds.reload();
											 Ext.MessageBox.alert("提示",
											 "修改成功！");
										} else {
											Ext.MessageBox.alert("提示", "修改失败！");
										}
									},
									failure : function() {
										Ext.Msg.alert('警告', '操作失败。');
									}
								}, "id=" + e.record.data.id + "&type=5&cname="
										+ e.record.data.cname);
					}
				});
	});
}
var buildLayout = function(){
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[{
				region:'west',
				width:180,
				items:tree,
				split:true
				},
		       {
				region:'center',
				layout:'border',
				items:[
				       {
				    	   region : 'north',
				    	   height: 25,
				    	   tbar : [{
								text : '转移',
								cls : 'x-btn-text-icon',
								icon : '/resource/images/add.gif',
								hidden : true
							}, '-', {
								text : '新增',
								cls : 'x-btn-text-icon',
								icon : '/resource/images/add.gif',
								hidden : false,
								handler: showAddType
							}, '-', {
								text : '删除',
								cls : 'x-btn-text-icon',
								icon : '/resource/images/delete.gif',
								handler: del,
								hidden : false
							},'->', '双击表格可以修改资料']
				       },
				       {
				    	   region:'center',
				    	   layout:'fit',
				    	   items: grid
				       }
				       ]
				}]
	});
}
var addTypeWin;
var addTypeForm;
FileUpload_Ext.clearConfig();
FileUpload_Ext.requestType = "RS_INFO";
FileUpload_Ext.callbackFn = "up_file_back";
FileUpload_Ext.fileType = /txt|doc|xls|zip|rar|jpg|gif|htm|html|mht/;
function uploadFileResult(flag, msg, fn,size) {
	if (flag) {
		FileUpload_Ext.callbackMsg = msg;
		FileUpload_Ext.fileSize=size;
		if (fn == undefined || fn == null || fn == "")
			Info_Tip("上传成功。", upload_fn);
		else
			Info_Tip("上传成功。", eval(fn));
	} else {
		Info_Tip(msg);
	}
}
function up_file_back() {
	Ext.fly("url").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
	Ext.fly("file_size").dom.value = Math.floor(FileUpload_Ext.fileSize/1024);
};

		var buildAddType = function(){
			var template = new Ext.Template('<form id="uploadform" name="uploadform" target="uploadtarget" method="post" enctype="multipart/form-data" >'
					+ '<div style="margin:0 auto;"><input type="file" name="file_input" id="file_input"/></div>'
					+ '<iframe  frameborder="0" id="uploadtarget" name="uploadtarget" src="" width="0" height="0"></iframe></form>');
			addTypeForm = new Ext.form.FormPanel({
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				frame : true,
				labelAlign : 'right',
				height : 150,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : [{
								id : 'cname',
								fieldLabel : '资源名称',
								name : 'cname',
								xtype : "textfield",
								width: 200	
							},{
								id:'url',
								name:'url',
								fieldLabel : '本地资源地址',
								xtype:'textfield',
								readOnly:true,
								width: 200
								},
								{
									id:'web',
									fieldLabel : '下载资源地址',
									items:[{
										layout:'column',
										items:[{
											id:'web_url',
											name:'web_url',
											xtype:'textfield',
											width: 205
										},{
											xtype:'button',
											text:'下载资源',
											style:'margin-left:5px;',
											handler:function(){
											
											var sURL = Ext.fly("web_url").dom.value;
											if(sURL==""){
												Ext.Msg.alert('提示','下载资源地址不能为空！');
												return;
											}												
											
											Ext.lib.Ajax.request('post', '/ResType.do', {
												success : function(response) {
													var data = eval("(" + response.responseText + ")");
													if(data.status=="success"){
														Ext.Msg.alert('提示',"下载成功！");
														var path = data.data.filePath;
														Ext.fly("file_size").dom.value = Math.floor(data.data.size/1024);
														Ext.fly("url").dom.value = "http://ftp.zjtcn.com"+path;														
														Ext.fly("cname").dom.value = path.substr(path.lastIndexOf('/')+1);
														isUsed = 1;
													}else{
														Ext.Msg.alert('提示',data.result);
													}
											},
											failure : function() {
												Ext.Msg.alert('警告', '操作失败。');
											}
										},"type=2&rstype=RS_INFO&url=http://ftp.zjtcn.com/file/CommonDownload"
										+"&sURL="+sURL)
										}
										}]
									}]
									},{
										id:'upload',
										fieldLabel:'上传资源',
										items:[{
											layout:'column',
											items:[template,{
												xtype:'button',
												text:'上传资源',
												style:'margin-left:5px;',
												handler:function(){
												isUsed = 1;
												var path = Ext.fly("file_input").dom.value;
												Ext.fly("cname").dom.value = path.substr(path.lastIndexOf('/')+1);
												FileUpload_Ext.submitAction();
												}
											}]
										}]
									},{
								id : 'file',
								fieldLabel : '资源大小',
								items:[{
									layout:'column',
									items:[{
										id : 'file_size',
										name : 'file_size',
										xtype : "textfield",
										readOnly:true,
										width: 175
									},{
										id : 'file_unit',
										xtype:'textfield',
										value:'KB',
										readOnly:true,
										width: 30
									}]
								}]
								
							}]							
						}]
			});
			
			addTypeWin = new Ext.Window({
				width : 450,
				height :225,
				title : '上传资源',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				modal : true,
				items : [{
							columnWidth : 1,
							items : {
								items : addTypeForm
							}
						}],
				buttons : [{
							text : '保存信息',
							handler : function() {
								add(addTypeForm.getForm().getEl().dom.cname.value,
										addTypeForm.getForm().getEl().dom.file_size.value,
										isUsed,
										addTypeForm.getForm().getEl().dom.url.value);
							}
						}, {
							text : '取消',
							handler : function() {
								addTypeWin.hide();
							}
						}],
				listeners : {
					"hide" : function(){
						addTypeForm.getForm().reset();
					}
				}
			});
		}
		var showAddType = function() {
			if(res_id==0){
				Ext.Msg.alert('提示', '请选择要添加的节点。');
				return;
			}
			if (addTypeWin == null) {
				buildAddType();
				addTypeWin.show();
			} else {
				addTypeWin.show();
			}
		};	
		
		var add = function(cname,size,available,url){
			var reason = "";
			if (available == 0){
				reason ="资源下载或者上传失败，请重新下载或者上传！"
			}
			if(cname==""||url==""||size==""){
				Ext.Msg.alert('提示', '信息不能为空！');
				return;
			}
			Ext.lib.Ajax.request('post', '/WebRes.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc,
									data.result)) {
						ds.load({	
								params : {
								id : res_id
								}
						});
						addTypeForm.getForm().reset(); 
						addTypeWin.hide();
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			},"type=3&id="+res_id+"&cname="+cname+"&available="+available+"&url="+url+"&size="+size+"&reason="+reason)
		}
	
		// 删除资源
		var del = function() {
			var id;
			var rec = grid.getSelectionModel().getSelected();
			if (isEmpty(rec)) {
				Ext.Msg.alert("提示", "请选择要删除的资源");
				return;
			}
			if (rec) {
				id = rec.data.id;
			}
			Ext.Msg.confirm("提示", "您确定要删除该资源?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request('post', '/WebRes.do', {
								success : function(response) {
									var data = eval("(" + response.responseText + ")");
									if (getState(data.state, commonResultFunc,
													data.result)) {
										Ext.Msg.alert("提示","分类删除成功!");				
										ds.load({
											params : {
												id : rec.data.res_id
											}
										});
									} 
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, "id=" + id + "&type=4");
				}
			});
		};

		
		//复制内容到剪切板
		function copyToClipboard(txt) {
			if(window.clipboardData) {
			window.clipboardData.clearData();
			window.clipboardData.setData("Text", txt);
			} else if(navigator.userAgent.indexOf("Opera") != -1) {
			window.location = txt;
			} else if (window.netscape) {
			try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch (e) {
			alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
			}
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if (!clip)
			return;
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans)
			return;
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var len = new Object();
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			var copytext = txt;
			str.data = copytext;
			trans.setTransferData("text/unicode",str,copytext.length*2);
			var clipid = Components.interfaces.nsIClipboard;
			if (!clip)
			return false;
			clip.setData(trans,null,clipid.kGlobalClipboard);
			alert("复制成功！")
			}
			}
		
	var init = function() {
		buildTree();
		buildGrid();
		ds.load({
			params : {
				id : '0001'
			}
		});
		buildLayout();
	};

	Ext.onReady(init);