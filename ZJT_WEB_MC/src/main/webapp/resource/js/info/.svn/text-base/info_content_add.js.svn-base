var info_add_form;
var uploadIWin, uploadFWin;
var zhcn = new Zhcn_Select();
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var empWin = null;
var emp_grid, emp_ds;
var emp_type_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : emp_type_array
		});
var emp_query_key_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["eid", "企业ID"], ["name", "企业名称"], ["fname", "企业简称"],
					["area", "所在地区"]]
		});
var buildFormPanel = function() {
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

			    		// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = [];
	var city_area = [];
	comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				width : 100,
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						if(province =="全部省份")
						{
							city=["全部城市"];
							
					    }
					    else
					    {
						    city = zhcn.getCity(province);
					    }
						comboCities.store.loadData(city);
						comboCities.enable();
					}
				},

				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部省份',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				readOnly : true,
				fieldLabel : '请选择省份'
			});

	comboCities = new Ext.form.ComboBox({
				id : 'comboCities',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部城市',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				fieldLabel : '选择城市',
				name : 'region',
				disabled : true,
				allowBlank : false,
				width : 100

			});
			
			
			
	sortCombo = new Ext.form.ComboBox({
				id : 'sortCombo',
				width : 180,
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
				allowBlank : false,
				emptyText : '请选择'
			});

	var cardPanel = new Ext.Panel({
		id : 'cardPanel',
		layout : 'card',
		activeItem : 0,
		frame : true,
		autoHeight : true,
		width : '100%',
		defaults : {
			bodyStyle : 'padding:5px'
		},
		items : [{
			id : 'cp1',
			title : '正常发表记录',
			items : [{
						xtype : "fieldset",
						title : "内容",
						colspan : 3,
						autoHeight : true,
						items : [{
									layout : 'table',
									labelAlign : 'top',
									items : [{
												xtype : 'textarea',
												id : 'acontent',
												width : '100%',
												height : 500,
												requestURL : "http://ftp.zjtcn.com",
												requestType : 'RS_INFO',
												fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
											}]
								}]
					}]
		}, {
			id : 'cp2',
			title : '使用网页链接',
			layout : 'table',
			layoutConfig : {
				columns : 3
			},
			defaults : {
				bodyStyle : 'padding:2px 2px'
			},
			items : [{
						html : '网页链接：'
					}, {
						layout : 'column',
						items : {
							id : 'address',
							name : 'address',
							xtype : "textfield",
							width : 400
						}
					}]
		}, {
			id : 'cp3',
			title : '使用上传文件',
			layout : 'table',
			layoutConfig : {
				columns : 4
			},
			defaults : {
				bodyStyle : 'padding:2px 2px'
			},
			items : [{
						html : '上传文件：'
					}, {
						layout : 'column',
						items : {
							id : 'url',
							name : 'url',
							xtype : "textfield",
							readOnly : true,
							width : 400
						}
					}, {
						layout : 'column',
						defaults : {
							bodyStyle : 'padding-top:10px;'
						},
						items : {
							id : 'title',
							name : 'title',
							text : '上传',
							xtype : "button",
							handler : function() {
								showUploadFWin();
							}
						}
					}, {
						html : '<span style="color: #FF0000">支持格式:txt|doc|xls|zip|rar|jpg|gif|htm|mht|</span>'
					}]
		}, {
			id : 'cp4',
			title : '上传 ',
			layout : 'table',
			layoutConfig : {
				columns : 4
			},
			defaults : {
				bodyStyle : 'padding:2px 2px'
			},
			items : [{
						html : '上传FLASH：'
					}, {
						layout : 'column',
						items : {
							id : 'urlF',
							name : 'urlF',
							xtype : "textfield",
							readOnly : true,
							width : 300
						}
					}, {
						layout : 'column',
						defaults : {
							bodyStyle : 'padding-top:10px;'
						},
						items : {
							id : 'title',
							name : 'title',
							text : '上传',
							xtype : "button",
							handler : function() {
								showUploadFlashWin();
							}
						}
					}, {
						html : '<span style="color: #FF0000">支持格式:swf</span>'
					}]
		}]
	})

	info_add_form = new Ext.form.FormPanel({
		width : '100%',
		border : false,
		layout : 'table',
		layoutConfig : {
			columns : 3
		},
		frame : true,
		buttonAlign : 'left',
		labelAlign : 'right',
		autoHeight : true,
		items : [{
			columnWidth : .49,
			xtype : "fieldset",
			title : "基本信息",
			width : 400,
			height : 420,
			layout : 'form',
			items : [{
						layout : 'form',
						items : new Ext.form.ComboBox({
									id : 'issueType',
									width : 200,
									name : 'issueType',
									mode : 'local',
									hiddenId : 'issueTypeId',
									hiddenName : 'issueTypeId',
									readOnly : true,
									triggerAction : 'all',
									allowBlank : false,
									fieldLabel : '发表类型',
									emptyText : '请选择',
									store : new Ext.data.SimpleStore({
												fields : ['value', 'text'],
												data : [['1', '正常发表记录'],
														['2', '使用网页链接'],
														['3', '使用上传文件'],
														['4', '上传FLASH']]
											}),
									valueField : 'value',
									displayField : 'text',
									emptyText : '请选择',
									value : '1',
									listeners : {
										select : {
											fn : function() {
												var i = Ext.fly("issueTypeId").getValue();
												Ext.getCmp("cardPanel").layout.setActiveItem("cp" + i);
												if (i != "1")
													hideEl("summary_btn");
												else
													showEl("summary_btn");
											}
										}
									}
								})
					}, {
						layout : 'form',
						items : {
							id : 'tags',
							name : 'tags',
							fieldLabel : 'Tag标签',
							xtype : "textfield",
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'title',
							name : 'title',
							fieldLabel : '文章标题',
							xtype : "textfield",
							allowBlank : false,
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'subTitle',
							name : 'subTitle',
							fieldLabel : '文章副标题',
							xtype : "textfield",
							width : 200,
							tooltip:'用于首页显示'
						}
					}, {
						layout : 'form',
						items : {
							xtype:'label',
							style:'margin-left:90px;line-height:20px;',
							html:'<font style="color:red;text-align:center;">副标题用于首页整齐显示，网编需要经常用到。</font>'
						}
					}, {
						layout : 'form',
						items : {
							id : 'source',
							name : 'source',
							fieldLabel : '来源',
							xtype : "textfield",
							width : 200
						}
					}, {
						layout : 'table',
						layoutConfig : {
							columns : 2
						},
						items : [{
									layout : 'form',
									items : {
										id : 'eid',
										name : 'eid',
										fieldLabel : '关联企业ID',
										readOnly : true,
										xtype : 'textfield',
										width : 200
									}
								}, {
									style : 'margin-top:-5px;margin-left:5px;',
									xtype : 'button',
									text : '设置',
									handler : openEmpWin
								}]
					}, {
						layout : 'form',
						items : {
							id : 'ename',
							name : 'ename',
							fieldLabel : '关联企业名称',
							xtype : 'textfield',
							readOnly : true,
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'sort',
							name : 'sort',
							fieldLabel : '排序',
							xtype : 'numberfield',
							readOnly : compareAuth("INFO_CONTENT_SORT"),
							width : 50,
							allowDecimals : false,
							allowBlank : false,
							value : 0
						}
					}, {
						layout : 'column',
						bodyStyle : 'text-align:right',
						items : [{
									text : "是否置顶:",
									xtype : "label",
									width : 100
								}, {
									layout : 'column',

									items : [new Ext.form.Radio({
														id : 'isTop1',
														fieldLabel : '是否置顶',
														boxLabel : '是',
														inputValue : '1',
														width : 50,
														name : 'isTop'

													}), new Ext.form.Radio({
														id : 'isTop0',
														boxLabel : '否',
														inputValue : '0',
														name : 'isTop',
														width : 50,
														checked : true
													})]
								}]
					}, {
						layout : 'column',
						bodyStyle : 'text-align:right',
						items : [{
									text : "是否热点:",
									xtype : "label",
									width : 100
								}, {
									layout : 'column',

									items : [new Ext.form.Radio({
														id : 'isHot1',
														fieldLabel : '是否热点',
														boxLabel : '是',
														inputValue : '1',
														width : 50,
														name : 'isHot'

													}), new Ext.form.Radio({
														id : 'isHot0',
														boxLabel : '否',
														inputValue : '0',
														name : 'isHot',
														width : 50,
														checked : true
													})]
								}]
					}, {
					layout : 'form',
					items : comboProvinces
					}, {
						layout : 'form',
						items : comboCities
					}]
		}, {
			columnWidth : .02
		}, {
			columnWidth : .49,
			xtype : "fieldset",
			title : "标题图片",
			width : 400,
			height : 420,
			items : [{
				layout : 'form',
				items : [{
					html : '<img id="picPath" src="" width="200px" height="150px" />'
				}, {
					layout : 'table',
					items : [{
								xtype : "button",
								text : '上传',
								handler : function() {
									showUploadIWin();
								}
							}, {
								xtype : "button",
								text : '取消',
								handler : function() {
									Ext.fly("picPath").dom.src = "";

								}
							}]
				}]
			}]
		}, {
			colspan : 3,
			autoHeight : true,
			items : cardPanel
		}, {
			xtype : "fieldset",
			title : "内容摘要",
			autoHeight : true,
			frame : true,
			colspan : 3,
			items : [{
				layout : 'column',
				labelAlign : 'top',
				items : [{
					id : 'summary_btn',
					xtype : "button",
					text : '从内容提取',
					handler : function() {
						var contentFck = $.fck.content('acontent', '');
						var acontent   = contentFck.replace(/&nbsp;/g, "");
						Ext.fly("summary").dom.value = acontent.length < 101
								? acontent
								: acontent.substring(0, 100);
					}
				}, {
					xtype : 'textarea',
					id : 'summary',
					width : 750,
					height : 100
				}]
			}]
		}],
		buttons : [{
					id:'copyAddInfo',
					text : '复制提交',
					handler : copyAddInfo
				},{
					text : '重置',
					handler : function() {
						info_add_form.form.reset();
					}
				}, {
					text : '关闭',
					handler : function() {
						closeWin();
					}
				}]
	});
	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'column',
				renderTo : 'info_add',
				items : [{
							columnWidth : .01,
							html : '&nbsp;'
						}, {
							columnWidth : .9,
							items : [info_add_form]

						}, {
							width : 200,
							items : [selectTree]
						}]
			});
};
/* 打开关联企业窗口 */
var openEmpWin = function() {
	emp_ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					content : "islock~0",
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9
				},
				remoteSort : true
			});
	emp_ds.setDefaultSort('createOn', 'DESC');
	var cm = new Ext.grid.CheckboxSelectionModel({});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : emp_ds,
				displayInfo : true
			});
	emp_grid = new Ext.grid.GridPanel({
				store : emp_ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : 300,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 100,
							dataIndex : 'name'
						}, {
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [new Ext.form.ComboBox({
									id : 'emp_type',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : emp_type_ds,
									width : 80,
									valueField : "value",
									displayField : "text",
									readOnly : true,
									value : '0'
								}), "-", new Ext.form.ComboBox({
									id : 'emp_query_key',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : emp_query_key_ds,
									width : 80,
									valueField : "value",
									displayField : 'text',
									readOnly : true,
									value : 'eid'
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchKey",
							width : 150,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchEmpList();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchEmpList
						}],
				bbar : pagetool
			});
	empWin = new Ext.Window({
				title : '企业列表',
				layout : 'fit',
				width : 600,
				height : 360,
				border : false,
				modal : true,
				frame : true,
				labelAlign : 'right',
				closeAction : 'close',
				items : [emp_grid],
				buttons : [{
							text : '确定',
							handler : function() {
								setLinkEmp();
							}
						}, {
							text : '取消',
							handler : function() {
								empWin.close();
							}
						}]
			});
	empWin.show();
	emp_ds.load();
};

Ext.onReady(init);