var info_add_form, relatedProListPanel, relatedProPanel, sendListPanel, sendPanel;
var uploadIWin, uploadFWin, relatedProWin;
var infoId, infoPid, pid;
var relatedProStore, proStore, sortStore, sendStore, eidStore, site_form;
var eidWin = null;
var empWin = null;
var emp_grid, emp_ds;
var zhcn = new Zhcn_Select();
var emp_type_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : emp_type_array
		});

	
var buildFormPanel = function() {

	var cardPanel = new Ext.Panel({
		id : 'cardPanel',
		layout : 'card',
		activeItem : 0,
		frame : true,
		autoHeight : true,
		width : 803,
		defaults : {
			bodyStyle : 'padding:5px'
		},
		items : [{
			id : 'cp1',
			title : '正常发表记录',
			items : [{
						xtype : "fieldset",
						title : "内容",
						width : 780,
						colspan : 3,
						items : [{
									layout : 'table',
									labelAlign : 'top',
									items : [{
												xtype : 'textarea',
												id : 'acontent',
												width : 750,
												height : 510,
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
			title : '上传FLASH',
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
								showUploadFlashWin();
							}
						}
					}, {
						html : '<span style="color: #FF0000">支持格式:swf</span>'
					}]
		}]
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
			
			
	site_form = new Ext.form.FormPanel({
				width : 820,
				colspan : 3,
				frame : true,
				items : {
					layout : 'form',
					items : new Ext.form.FieldSet({
								title : '站点显示',
								layout : 'column',
								labelWidth : 40,
								items : Sites_checkbox()
							})
				}
			});
	info_add_form = new Ext.form.FormPanel({
		border : false,
		layout : 'table',
		layoutConfig : {
			columns : 2
		},
		frame : true,
		width : 820,
		buttonAlign : 'left',
		labelAlign : 'right',
		items : [{
			columnWidth : .5,
			xtype : "fieldset",
			title : "基本信息",
			width : 400,
			height : 420,
			layout : 'form',
			items : [{
				layout : 'form',
				items : new Ext.form.ComboBox({
							id : 'issueType',
							width : 180,
							name : 'issueType',
							mode : 'local',
							hiddenId : 'issueTypeId',
							hiddenName : 'issueTypeId',
							readOnly : true,
							triggerAction : 'all',
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
							emptyText : '正常发表记录',
							listeners : {
								select : {
									fn : function() {
										var i = Ext.fly("issueTypeId")
												.getValue();
										Ext.getCmp("cardPanel").layout
												.setActiveItem("cp" + i);
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
					tooltip : '用于首页显示'
				}
			}, {
				layout : 'form',
				items : {
					id : 'url',
					name : 'url',
					fieldLabel : '文章访问路径',
					xtype : "textfield",
					width : 200,
					readOnly:true
				}
			}, {
				layout : 'form',
				items : {
					xtype : 'label',
					style : 'margin-left:90px;line-height:20px;',
					html : '<font style="color:red;text-align:center;">副标题用于首页整齐显示，网编需要经常用到。</font>'
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
			columnWidth : .49,
			layout:'form',
			items : [{
				xtype : "fieldset",
				title : "标题图片",
				width : 400,
				height : 340,
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
			},{
				xtype : "fieldset",
				title : "图片库",
				height:71,
				widht : 400,
				items : [{
					xtype :'button',
					text : '图片库上传',
					handler : function(){
						showUploadBaseWin();
					}
				}]
			}]
		}, {
			colspan : 2,
			width : 803,
			items : cardPanel
		}, {
			xtype : "fieldset",
			title : "内容摘要",
			width : 780,
			colspan : 3,
			items : [{
				layout : 'column',
				labelAlign : 'top',
				items : [{
					id : "summary_btn",
					xtype : "button",
					text : '从内容提取',
					handler : function() {// trim
						var acontent = Ext.util.Format.trim(Ext.util.Format
								.stripTags($.fck.content('acontent', ''))
								.replace(/&nbsp;/g, ""));
						
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
					text : '提交',
					handler : updateInfo,
					hidden : compareAuth("INFO_CONTENT_MOD")
				}, {
					text : '重置',
					handler : function() {
						info_add_form.form.reset();
					}
				}, {
					text : '查看相关项目',
					handler : linkProject
				}, {
					text : '关闭',
					handler : function() {
						window.parent.Ext.getCmp('center').remove("info_content_edit");
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

/* 初始化数据 */
var initInfo = function() {
	var data = "";
	data = "type=1&id=" + infoId;
	Ext.lib.Ajax.request('post', '/SearchInfoContent.do', {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (json && json.state == 'success') {
						json = json.result;
						info_add_form.getForm().setValues(json);
						if (json["eid"] != null)
							Ext.get("eid").dom.value = json["eid"];
						if (json["ename"] != null)
							Ext.get("ename").dom.value = json["ename"];
						if (json['sort'] != null)
							Ext.get("sort").dom.value = json["sort"];
                        if(json['province']!=null)
                            Ext.get("comboProvinces").dom.value=json["province"];
                        if(json['city'] !=null)
                            Ext.get("comboCities").dom.value=json["city"];
						if (json["title"] == null)
							Ext.get("title").dom.value = "";
						else
							Ext.get("title").dom.value = json["title"];
						if(json['url'] != null)
							Ext.get("url").dom.value=json["url"];
						else
							Ext.get("url").dom.value="";
						if (json["source"] == null)
							json["source"] = "";
						else
							Ext.get("source").dom.value = json["source"];
						if (json["tags"] == null)
							json["tags"] = "";
						else
							Ext.get("tags").dom.value = json["tags"];
						if (json["isTop"] == "1") {
							Ext.get("isTop1").dom.checked = true
						} else {
							Ext.get("isTop0").dom.checked = true
						}
						if (json["isHot"] == "1") {
							Ext.get("isHot1").dom.checked = true
						} else {
							Ext.get("isHot0").dom.checked = true
						}
						if (json["picPath"] != null) {
							oriPicPath = FileUpload_Ext.requestURL
									+ json["picPath"];
							Ext.get("picPath").dom.src = oriPicPath;
						}

						var siteform = site_form.getForm().items;
						var len = siteform.length;

						for (var i = 0; i < len; i++) {
							if (json[siteform.keys[i]] == "1") {
								Ext.getCmp(siteform.keys[i]).setValue(true);
								// siteform.map[siteform.keys[i]].checked =
								// true;
							}
						}
						if (json["issueType"] == "1") {
							if (json["summary"] != null)
								Ext.get("summary").dom.value = json["summary"];
							else
								Ext.get("summary").dom.value = "";
							// initInfoCon();
							if (json["content"] == null)
								Ext.getCmp("acontent").setValue("");
							else
								Ext.getCmp("acontent").setValue(json["content"]);
						} else if (json["issueType"] == "2") {
							Ext.get("issueType").dom.value = "使用网页链接";
							Ext.get("address").dom.value = json["url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp2");
						} else if (json["issueType"] == "3") {
							Ext.get("issueType").dom.value = "使用上传文件";
							Ext.get("url").dom.value = FileUpload_Ext.requestURL + json["url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp3");
						} else if (json["issueType"] == "4") {
							Ext.get("issueType").dom.value = "上传FLASH";
							Ext.get("urlF").dom.value = FileUpload_Ext.requestURL + json["url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp4");
						}
						Ext.get("tid_temp").dom.value  = json["tid"];
						Ext.get("path_temp").dom.value = json["tpath"];
						Ext.get("typename_temp").dom.value = json["typename"];
						
						Ext.get("summary").dom.value = json["summary"];
						Ext.lib.Ajax.request('post', '/InfoContent.do', {
							success:function(response){
									var json1 = eval("(" + response.responseText + ")");
									var result =  json1["result"];
									areaArray = [];
									var areaData = json["area"];
									if(areaData!=null){
										for(var i=0;i<result.length;i++){
											var temp = areaData.substring(i,i+1);
											if(temp==1)
												areaArray.push(result[i].cataName);
										}
										
										Ext.get("areaSelected").dom.innerHTML = areaArray.toString();
									}
							}
						},"type=19");
						
						Ext.lib.Ajax.request('post', '/InfoContent.do', {
							success:function(response){
									var json1 = eval("(" + response.responseText + ")");
									var result =  json1["result"];
									professionalArray = [];
									var areaData = json["spec"];
									if(areaData!=null){
										for(var i=0;i<result.length;i++){
											var temp = areaData.substring(i,i+1);
											if(temp==1)
												professionalArray.push(result[i].cataName);
										}
										
										Ext.get("professionalSelect").dom.innerHTML = professionalArray.toString();
									}
							}
						},"type=20");
						
						Ext.lib.Ajax.request('post', '/InfoContent.do', {
							success:function(response){
									var json1 = eval("(" + response.responseText + ")");
									var result =  json1["result"];
									tradeArray = [];
									var areaData = json["indu"];
									if(areaData!=null){
										for(var i=0;i<result.length;i++){
											var temp = areaData.substring(i,i+1);
											if(temp==1)
												tradeArray.push(result[i].cataName);
										}
										
										Ext.get("tradeSelected").dom.innerHTML = tradeArray.toString();
									}
							}
						},"type=21");
						
						//通过定时器的方式给异步树赋值
						//taskRunner.start(tidChooseTask);
					} else {
						alert("获取信息失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};

/* 上传图片库 */
var view, chooser;
var showUploadBaseWin = function() {
	chooser = new ImageDetail({
				url : '/InfoContent.do',
				width : 780,
				height : 470,
				type : 25,
				cid : infoId,
			});
	chooser.show();
};

/* 修改内容 */
var updateInfo = function() {
	if (!info_add_form.getForm().isValid()) {
		Info_Tip("请按照要求填写表单!");
		return;
	}
	/**
	var checkNode = selectTree.getChecked();
	//如果用户没有选择需要操作的目录，则提醒用户
	if(checkNode.length!=1){
		Info_Tip("请选择内容所属的栏目！");
		return;
	}
	**/
	var tid   = Ext.get("tid_temp").dom.value;
	var tpath = Ext.get("path_temp").dom.value;
	var typename = Ext.get("typename_temp").dom.value;
	
	var title = Ext.fly("title").getValue();
	if (title == "") {
		Info_Tip("请选择文章标题！")
		return;
	}
	var picPath = Ext.fly("picPath").dom.src.split('/');
	picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
	if (picPath.lastIndexOf('/') == picPath.length - 1
			|| picPath.lastIndexOf('.jsp') == picPath.length - 4) {
		picPath = "";
	}

	/** ******************shawn添加，默认摘要为空时自动添加摘要;********************** */
	if (Ext.fly("summary").dom.value.length <= 0) {
		var acontent = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("acontent").getValue()).replace(/&nbsp;/g, ""));
		Ext.fly("summary").dom.value = acontent.length < 101
				? acontent
				: acontent.substring(0, 100);
	}
	// *******************************

	var eid = Ext.fly("eid").getValue();
	var ename = Ext.fly("ename").getValue();
	var sort = Ext.fly("sort").getValue();
	var source = Ext.fly("source").getValue();
	var acontent = $.fck.content('acontent', '');
	var summary = Ext.fly("summary").getValue();
	var issueType = Ext.fly("issueType").getValue();
	var isTop = info_add_form.form.findField("isTop").getGroupValue();
	var isHot = info_add_form.form.findField("isHot").getGroupValue();
	var tags = Ext.fly("tags").getValue();
	var eids = [];
	var type = "16";
	var province=Ext.get("comboProvinces").getValue();
	var area = Ext.get("comboCities").getValue();
	
	//var spec = Ext.get("professionalSelect").dom.innerHTML;
	//var indu = Ext.get("tradeSelected").dom.innerHTML;
	var subTitle = Ext.get("subTitle").getValue().trim();
	if (Ext.isEmpty(subTitle))
		subTitle = " ";
	//站点的选择，目前不采用这种办法	
	var sites = [];
	sites = sites.join().replace(/,/g, ";");

	if (issueType == "正常发表记录") {
		if (acontent.toText() == "") {
			Ext.MessageBox.alert("提示", "请输入内容！");
			return;
		}

		var data = {};
		data["desc"] = acontent;
		data["id"] = infoId;
		data["type"] = type;
		data["province"]=province;
		data["area"] = area;
		//data["spec"] = spec;
		//data["indu"] = indu;
		data["content"] = "issueType~1;summary~" + summary + ";title~" + title
				+ ";isHot~" + isHot + ";source~" + source + ";isTop~" + isTop
				+ ";tid~" + tid + ";typename~" + typename + ";tpath~" + tpath
				+ ";tags~" + tags + ";eid~" + eid + ";ename~" + ename
				+ ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
		if (type == 8) {
			data["eids"] = eids.toString();
		}
		refer(data, '修改信息');
	} else if (issueType == "使用网页链接") {
		var address = Ext.fly("address").getValue();
		if (address == "") {
			Info_Tip("请输入网页链接！");
			return;
		}
		var data = {};
		data["content"] = "issueType~2;summary~" + summary + ";url~" + address
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
		data["id"] = infoId;
		data["type"] = type;
		data["area"] = area;
		data["province"]=province;
		//data["spec"] = spec;
		//data["indu"] = indu;
		if (type == 8) {
			data["eids"] = eids.toString();
		}
		refer(data, '修改信息');
	} else if (issueType == "使用上传文件") {
		var url = Ext.fly("url").getValue().split("/");
		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Info_Tip("请先上传文件！");
			return;
		}
		var data = {};
		data["content"] = "issueType~3;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
		data["id"] = infoId;
		data["type"] = type;
		data["province"]=province;
		data["area"] = area;
		//data["spec"] = spec;
		//data["indu"] = indu;
		if (type == 8) {
			data["eids"] = eids.toString();
		}
		refer(data, '修改信息');
	} else if (issueType == "上传FLASH") {
		var url = Ext.fly("urlF").getValue().split("/");
		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Info_Tip("请先上传FLASH文件！");
			return;
		}
		var data = {};
		data["content"] = "issueType~4;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle + ";picPath~" + picPath;
		data["id"] = infoId;
		data["type"] = type;
		data["province"]=province;
		data["area"] = area;
		//data["spec"] = spec;
		//data["indu"] = indu;
		if (type == 8) {
			data["eids"] = eids.toString();
		}

		refer(data, '修改信息');
	}
};
var refer = function(data, msg) {

	Ext.Ajax.request({
				method : 'post',
				url : "/InfoContent.do",
				params : data,
				timeout : 1000 * 60 * 5,
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {			
						//window.parent.tab_info_content_edit_iframe.search();
						Ext.MessageBox.alert("提示", msg + "成功！", closeWin);	
					} else {
						Info_Tip(msg + "失败！");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
}
/* end 更新项目 */

function searchlist() {
	var query = Ext.fly("query_type").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~0";
	eidStore.baseParams["content"] = query;
	eidStore.countParams["content"] = query;
	eidStore.load();
};
function addFckEditor() {
	$.fck.config = {
		path : '/resource/plugins/FCKeditor/',
		height : 500,
		width : 750,
		toolbar : 'MCZJTCN'
	};
	$('#acontent').fck();
}

function closeWin() {
	window.parent.Ext.getCmp('center').remove("info_content_edit");
};
var init = function() {
	infoId = getCurArgs("infoId");
	Ext.QuickTips.init(true);
	buildFormPanel();	
	initInfo();
	addFckEditor();
	Ext.TipSelf.msg('提示', '填写标签可自动关联标签相同的项目。');
};
Ext.onReady(init);