Ext.onReady(init);
var panel, fs, win_fs, win;
function init() {
	Ext.QuickTips.init();
	buildPanel();
	getConfig();
};

function buildPanel() {
	var fieldSet1 = new Ext.form.FieldSet({
				title : '基本操作设置',
				autoWidth : true,
				autoHeight : true,
				layout : 'form',
				items : [{

							layout : 'table',
							layoutConfig : {
								columns : 3
							},
							items : [{
								width : 100,
								html : "&nbsp;",
								border : false
							},{
								xtype : 'checkbox',
								id : 'isTip',
								name : 'isTip',
								inputValue : '1',
								width : 30,
								checked:true,
								listeners : {
									"focus" : function() {
										Ext.fly("isTip").dom.checked = !Ext.fly("isTip").dom.checked;
										saveBaseOp("tip");
										return false;
									}
								}
							},{
								xtype : 'label',
								text : '是否显示指导提示',
								style : 'text-algin : left;'
							}]
						}, {
							layout : 'table',
							layoutConfig : {
								columns : 3
							},
							colspan : 2,
							items : [{
										layout : 'form',
										items : {
											xtype : 'textfield',
											fieldLabel : '默认访问目录',
											id : 'DEF_DIR',
											name : 'DEF_DIR',
											style : 'cursor:pointer',
											readOnly : true,
											width : 220
										}
									}, {
										xtype : 'hidden',
										id : 'DEF_DIR_HIDDEN'
									}, {
										xtype : 'button',
										text : '设置默认访问目录',
										handler : function() {
											showDirarea();

										}
									}]
						}]
			});

	fs = new Ext.FormPanel({
				frame : true,
				autoWidth : true,
				bodyStyle : 'padding:6px',
				height : parent.Ext.get("tab_person_view_config_iframe")
						.getHeight(),
				layout : 'form',
				items : [fieldSet1]
			});
	panel = new Ext.Panel({
				layout : 'form',
				autoWidth : parent.Ext.get("tab_person_view_config_iframe")
						.getWidth(),
				height : parent.Ext.get("tab_person_view_config_iframe")
						.getHeight(),
				renderTo : 'panel',
				labelAlign : 'right',
				buttonAlign : 'right',
				items : fs
			});
};

// 默认访问目录设置
function showDirarea() {
	var tree = Ext.tree;
	var treeLoader = new tree.TreeLoader({
				dataUrl : '/mc/AdminRoleServlet.do?type=14'
			});

	/* 修改treeLoader返回的数据 */
	treeLoader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		json = json.slice(json.indexOf("["), json.lastIndexOf("]") + 1);
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
				for (var j = 0; j < o[i].children.length; j++) {
					o[i].children[j].text = o[i].children[j].title;
				}
				o[i].text = o[i].title;
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

	treePanel = new tree.TreePanel({
				animate : true,
				autoScroll : true,
				loader : treeLoader,
				height : parent.Ext.get("tab_person_view_config_iframe")
						.getHeight()
						/ 2,
				autoWidth : true,
				containerScroll : true,
				rootVisible : false,
				useArrows : true,
				border : true
			});

	var root = new tree.AsyncTreeNode({
				text : '系统',
				draggable : false,
				id : "0"
			});

	treePanel.setRootNode(root);
	root.expand(false, true);
	treePanel.on("click", function(node) {
				if (node.isLeaf()) {
					Ext.fly("DEF_DIR").dom.value = node.text;
					Ext.fly("DEF_DIR_HIDDEN").dom.value = "id=" + node.id
							+ ";src=" + node.attributes["src"] + ";title="
							+ node.text;
					Ext.getCmp("set_btn").setDisabled(false);
				}
				else
					Ext.getCmp("set_btn").setDisabled(true);
			})
	win = new Ext.Window({
				title : '设置默认访问目录',
				modal : true,
				width : 260,
				autoHeight : true,
				items : treePanel,
				buttons : [{
					id : 'set_btn',
					text : '设置',
					disabled : true,
					handler : function() {
						var node = treePanel.getSelectionModel()
								.getSelectedNode();
						if (Ext.isEmpty(node)) {
							Info_Tip("请选择目录。");
							return;
						}
						saveBaseOp('dir');
					}
				}]
			})
	win.show();
};

// 信息会员搜索保存
function saveGov() {
	if (win_fs.getForm().isValid()) {
		setUpCondition(fs.getForm());
		dateSetup(Ext.fly("createOn#start"), Ext.fly("createOn#end"),
				"createOn");
		// debugger;
		win_fs.form.findField('memType').getGroupValue();
	} else
		Info_Tip();
};

// 基本操作设置保存
function saveBaseOp(op1) {
	Ext.Msg.confirm("确认操作", "您确认要保存该设置吗？", function(op) {
		if (op == "yes") {
			var name = "";
			var value = "";
			var type = 1;
			var id = "";
			switch (op1) {
				case "tip" :
					name = "isTip";
					value = Ext.fly("isTip").dom.checked == true ? 1 : 0
					break;
				case "dir" :
					name = "DEF_DIR";
					// var temp = Ext.fly("DEF_DIR").getValue().split("/");
					// temp = "/" + temp.slice(3).join().replace(/,/g, "/");
					value = Ext.fly("DEF_DIR_HIDDEN").getValue();
					break;
			}

			Ext.Ajax.request({
				url : '/mc/MemberProfileServlet',
				params : {
					type : 5,
					cid : 1,
					name : name,
					site : 'MC'
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						if (jsondata.result != null) {
							type = 3;
							id = jsondata.result["id"];
						}
						Ext.Ajax.request({
									url : '/mc/MemberProfileServlet',
									params : {
										type : type,
										cid : 1,
										name : name,
										value : value,
										id : id
									},
									success : function(response) {
										var jsondata = eval("("
												+ response.responseText + ")");
										if (getState(jsondata.state,
												commonResultFunc,
												jsondata.result)) {
											Info_Tip("基本操作设置成功.");
											if(op1 != "tip")
												win.close();
											/*
											if (op1 == "tip")
												parent.getPersonConfig_Base(true);
											else{
												win.close();
												parent.getPersonConfig_Base(false);
											}
											*/
										}
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
		}
		else{
			Ext.fly("isTip").dom.checked = !Ext.fly("isTip").dom.checked;
		}
	});

};

// 获取配置详情
function getConfig() {
	Ext.Ajax.request({
		url : '/mc/MemberProfileServlet',
		params : {
			type : 6,
			cid : 1,
			site : "MC"
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var len = jsondata.result.length;
				var data = jsondata.result;
				for (var i = 0; i < len; i++) {
					if (data[i]["name"].indexOf("is") == -1) {
						var temp = data[i]["content"].split(";");
						var name = temp[2].split('=');
						var src = temp[1].split('=');
						Ext.fly(data[i]["name"]).dom.value = name[1];
						Ext.fly("DEF_DIR_HIDDEN").dom.value = src[1];
					} else {
						Ext.fly(data[i]["name"]).dom.checked = data[i]["content"] == 1
								? true
								: false;
					}
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
};