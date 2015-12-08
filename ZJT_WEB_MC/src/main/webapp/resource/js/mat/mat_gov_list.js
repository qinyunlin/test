Ext.onReady(init);
var currProvince = getCurArgs("province");
var currCity = getCurArgs("city");
var currTown = getCurArgs("town");
var currDate = getCurArgs("date");
function init() {
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '请先选择地区。');
	buildGrid();
};
var grid, ds, area, area1, area2, win, up_fs, area3, area4, area5;
var flag_conf = true;// 暂时屏蔽信息：下载信息价，上传PDF
var zhcn = new Zhcn_Select();
// 右键菜单

var ra_season, ra_month;
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						text : "查看",
						hidden : compareAuth('GOV_VIEW'),
						handler : getInfo
					}, {
						id : 'rMenu1',
						text : '修改',
						hidden : compareAuth('GOV_MOD'),
						handler : function() {
							editGov();
						}
					}, {
						id : 'rMenu2',
						text : '删除',
						hidden : compareAuth('GOV_DEL'),
						handler : function() {
							delGov();
						}
					}]
		});
var pro = zhcn_pro_db;
var pro_code_array = zhcn.getProvince(true);

var city = [];
var city_area = [];
function buildGrid() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/GovMatTitle.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "title", "issueDate", "updateOn", "reMark"]),
				baseParams : {
					province : currProvince,
					area : currTown,
					issueDate : currDate,
					type : 6
				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '标题',
							sortable : false,
							dataIndex : 'title'
						}, {
							header : '发布时间',
							sortable : false,
							dataIndex : 'issueDate'
						}, {
							header : '更新时间',
							sortable : false,
							dataIndex : 'updateOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : "查看",
							hidden : compareAuth('GOV_VIEW'),
							handler : getInfo,
							icon : "/resource/images/book_open.png"
						}, {
							text : "修改",
							hidden : compareAuth('GOV_MOD'),
							handler : editGov,
							icon : "/resource/images/edit.gif"
						}, {
							text : "删除",
							hidden : compareAuth('GOV_DEL'),
							handler : delGov,
							icon : "/resource/images/delete.gif"
						}, {
							text : "信息价标准文档",
							handler : downForm,
							icon : "/resource/images/page_link.png"
						}, {
							text : "下载信息价",
							hidden : compareAuth("GOV_DOWNLOAD"),
							handler : downExcel_submit,
							icon : "/resource/images/page_excel.png"
						}, {
							text : "上传信息价",
							hidden : compareAuth("GOV_UPLOAD"),
							handler : uploadExcel,
							icon : "/resource/images/page_add.png"
						},{
							text : "更新分类统计数",
							handler : updateTypeCount,
							icon : "/resource/images/ruby_gear.png"
						},{
							text : "信息价统计",
							hidden : compareAuth("GOVPRICE_DETAIL_LIST"),
							handler : showGovPriceDetail,
							icon : "/resource/images/edit.gif"
						}],
				renderTo : 'mat_grid'
			});
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							text : "区域选择："
						}, area = new Ext.form.ComboBox({
									fieldLabel : "省",
									id : 'province_combo',
									store : pro,
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									displayField : "text"
								}), area1 = new Ext.form.ComboBox({
									fieldLabel : "市",
									id : 'city_combo',
									store : city,
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									disabled : true,
									displayField : "text"
								}), area2 = new Ext.form.ComboBox({
									fieldLabel : "区",
									store : city_area,
									id : 'area_combo',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									disabled : true,
									displayField : "text"
								}), {
							text : "查询",
							handler : searchlist,
							icon : "/resource/images/zoom.png"
						}]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				getInfo();
			});
	area.on("select", function(combobox) {
				var province = combobox.getValue();
				city = zhcn.getCity(province);
				area1.store.loadData(city);
				area1.reset();
				area2.reset();
				area1.enable();
			});
	area1.on("select", function(combobox) {
				var ci = combobox.getValue();
				city_area = zhcn.getArea(ci)
				area2.store.loadData(city_area);
				area2.reset();
				area2.enable();
			});
	
	Ext.getCmp("province_combo").setValue(currProvince);
	city = zhcn.getCity(currProvince);
	area1.store.loadData(city);
	area1.reset();
	area2.reset();
	area1.enable();
	Ext.getCmp("city_combo").setValue(currCity);
	city_area = zhcn.getArea(currCity);
	area2.store.loadData(city_area);
	area2.reset();
	area2.enable();
	Ext.getCmp("area_combo").setValue(currTown);
	ds.load();
};

//更新分类统计数
function updateTypeCount(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	
	var id = row.get("id");
	if(id == "" || id == null){
		Info_Tip("请选择一条信息。");
		return;
	}
    
    Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=7", {
        success: function(response){
            Info_Tip("更新分类统计数成功.");
        },
        failure: function(){
            Warn_Tip();
        }
    }, "id=" + id);
	
}

// edit op
function editGov() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var title = row.get("title");
	var reMark = row.get("reMark");
	var panel = new Ext.Panel({
				layout : "form",
				border : false,
				labelWidth : 80,
				labelAlign : 'right',
				items : [{
							xtype : 'textfield',
							fieldLabel : "信息价标题",
							id : "title_edit",
							width : 220,
							value : title
						},{
							id:'note',
							xtype : 'textarea',
							fieldLabel:'信息价备注',
							name : 'note',
							width : 280,
							height:120,
							value:reMark,
							maxLength : 800
						}]
			});
	// 上传PDF暂时屏蔽
	up_fs = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none',
				fileUpload : true,
				items : {
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : "PDF文件"

				},
				buttons : [{
							text : '上传',
							handler : function() {
								uploadPDF(row.get("id"))
							}
						}]
			});
	win = new Ext.Window({
				title : "修改信息价",
				closeAction : "close",
				bodyStyle : 'padding:6px',
				layout : 'fit',
				items : [panel],
				draggable : true,
				modal : true,
				width : 400,
				height : 250,
				buttons : [{
							text : "修改",
							handler : function() {
								saveEdit(row.get("id"))
							}
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]

			});
	win.show();
};

// save edit info
function saveEdit(id) {
	var title = Ext.fly("title_edit").getValue();
	var reMark = Ext.fly("note").getValue();
	
	if (!validateInput["t"](title, 100, "标题"))
		return;
	Ext.Msg.confirm("提示", "您确定要修改该信息价?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=3", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("信息价修改成功.");
										ds.reload();
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + id + "&content=title~" + title + ";reMark~" + reMark);
				}
			});

};

// upload PDF
function uploadPDF(id) {
	if (up_fs.getForm().isValid()) {
		up_fs.getForm().submit({
					url : '/GovMaterialPDFServlet?type=1&id=' + id,
					waitMsg : '上传文件中...',
					success : function(up_fs, response) {
						var json = eval("(" + response.response.responseText
								+ ")")
						if (json.result == "success")
							Info_Tip("上传成功。");
						win.close();
					},
					failure : function(up_fs, response) {
						var json = eval("(" + response.response.responseText
								+ ")")
						if (json.result == "failed")
							Info_Tip("上传失败。");

					}
				});
	}
};

// del op
function delGov() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.Msg.confirm("提示", "您确定要删除该信息价?", function(op) {
		if (op == "yes") {
			Ext.MessageBox.confirm("确认操作", "您确认要删除所选择的信息吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=2", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("信息价删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + row.get("id") + "&province=" + Ext.fly("province_combo").getValue());
				}
			});
		}
	});

};

// down excel area
function downExcel() {
	up_fs = new Ext.form.FormPanel({
				layout : 'form',
				autoWidth : true,
				height : 110,
				bodyStyle : 'padding:6px;',
				items : [{
					fieldLabel : "请选择信息价地区(省、市、区)",
					bodyStyle : 'border:none',
					items : [{
								layout : "column",
								bodyStyle : "border:none;margin:6px auto;",
								items : [area3 = new Ext.form.ComboBox({
													fieldLabel : "省",
													id : 'province_combo_1',
													store : pro,
													emptyText : "请选择",
													mode : "local",
													triggerAction : "all",
													valueField : "value",
													readOnly : true,
													allowBlank : false,
													displayField : "text"
												}),
										area4 = new Ext.form.ComboBox({
													fieldLabel : "市",
													id : 'city_combo_1',
													store : city,
													emptyText : "请选择",
													mode : "local",
													triggerAction : "all",
													valueField : "value",
													readOnly : true,
													disabled : true,
													allowBlank : false,
													displayField : "text"
												}),
										area5 = new Ext.form.ComboBox({
													fieldLabel : "区",
													store : city_area,
													id : 'area_combo_1',
													emptyText : "请选择",
													mode : "local",
													triggerAction : "all",
													valueField : "value",
													readOnly : true,
													disabled : true,
													allowBlank : false,
													displayField : "text"
												})]
							}]
				}, {
					fieldLabel : "选择时间",
					bodyStyle : 'border:none',
					items : [{
						layout : 'column',
						bodyStyle : 'border:none',
						items : [ra_season = new Ext.form.Radio({
											xtype : 'radio',
											inputValue : '1',
											name : 'ra_type',
											boxLabel : '季度',
											id : 'ra_season',
											listeners : {
												"check" : function(ra_season,
														checked) {
													if (checked) {
														showEl("date_area");
														hideEl("month_input");
														showEl("year_input");
														showEl("season_input");
													}
												}
											}
										}), ra_month = new Ext.form.Radio({
											xtype : 'radio',
											inputValue : '2',
											name : 'ra_type',
											boxLabel : '月份',
											id : 'ra_month',
											listeners : {
												"check" : function(ra_month,
														checked) {
													if (checked) {
														showEl("date_area");
														hideEl("season_input");
														showEl("year_input");
														showEl("month_input");
													}
												}
											}
										}), {
									id : 'date_area',
									bodyStyle : 'border:none',
									layout : 'column',
									items : [{
												id : "year_input",
												xtype : 'combo',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : year_array
											}, {
												xtype : 'combo',
												id : 'season_input',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : season_array

											}, {
												id : 'month_input',
												xtype : 'combo',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : month_array
											}]
								}]
					}]
				}]
			});
	win = new Ext.Window({
				title : '下载信息价',
				width : 660,
				draggable : true,
				modal : true,
				height : 180,
				items : [up_fs],
				buttons : [{
							text : '下载',
							handler : downExcel_submit
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	area3.on("select", function(combobox) {
				var province = combobox.getValue();
				city = zhcn.getCity(province);
				area4.store.loadData(city);
				area5.reset();
				area4.reset();
				area5.enable();

			})
	area4.on("select", function(combobox) {
				var ci = combobox.getValue();
				city_area = zhcn.getArea(ci)
				area5.store.loadData(city_area);
				area5.reset();
				area5.enable();

			})
	hideEl("date_area");
};
// down Excel /MaterialDownload.do
function downExcel_submit() {
	var issuDate;

	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var up_fs = new Ext.FormPanel();
	issuDate = row.get('issueDate').slice(0, 10);
	var addr = "";
	if (Ext.fly("city_combo").getValue() == Ext.fly("area_combo").getValue())
		addr = Ext.fly("city_combo").getValue();
	else
		addr = Ext.fly("city_combo").getValue()
				+ Ext.fly("area_combo").getValue();
	var condition = "?type=gov";
	condition += "&province=" + encodeURI(encodeURI(Ext.fly("province_combo").getValue()));
	condition += "&diff=issuedate~" + issuDate + "~" + issuDate
			+ "~DIFF_BETWEEN&content=isGov~1;addr~" + encodeURI(encodeURI(addr));
	document.uplogoform.action = '/MaterialDownload.do' + condition;
	document.uplogoform.submit();

};

// down form
function downForm() {
	window.location.href = FileSite + '/doc/gov_price_sample.xls';
};

// upload excel
function uploadExcel() {
	var panel = new Ext.Panel({
		layout : "form",
		bodyStyle : 'border:none;padding:6px;',
		items : [{
			fieldLabel : "上传文件必需按照此格式",
			html : "<img src='/resource/images/format.jpg?time=20100530'  width='749' height='133'/>"
		}, {
			fieldLabel : "请选择信息价地区(省、市、区)",
			bodyStyle : 'border:none',
			items : [{
						layout : "column",
						bodyStyle : "border:none;margin:6px auto;",
						items : [area3 = new Ext.form.ComboBox({
											fieldLabel : "省",
											id : 'province_combo_1',
											store : pro,
											emptyText : "请选择",
											mode : "local",
											triggerAction : "all",
											valueField : "value",
											readOnly : true,
											displayField : "text"
										}), area4 = new Ext.form.ComboBox({
											fieldLabel : "市",
											id : 'city_combo_1',
											store : city,
											emptyText : "请选择",
											mode : "local",
											triggerAction : "all",
											valueField : "value",
											readOnly : true,
											disabled : true,
											displayField : "text"
										}), area5 = new Ext.form.ComboBox({
											fieldLabel : "区",
											store : city_area,
											id : 'area_combo_1',
											emptyText : "请选择",
											mode : "local",
											triggerAction : "all",
											valueField : "value",
											readOnly : true,
											disabled : true,
											displayField : "text"
										})]
					}]
		}, {
			fieldLabel : "选择时间",
			bodyStyle : 'border:none',
			items : [{
						layout : 'column',
						bodyStyle : 'border:none',
						items : [ra_season = new Ext.form.Radio({
											xtype : 'radio',
											inputValue : '1',
											name : 'ra_type',
											boxLabel : '季度',
											id : 'ra_season',
											listeners : {
												"check" : function(ra_season,
														checked) {
													if (checked) {
														showEl("season_area");
														hideEl("month_input");

													}
												}
											}
										}), ra_month = new Ext.form.Radio({
											xtype : 'radio',
											inputValue : '2',
											name : 'ra_type',
											boxLabel : '月份',
											id : 'ra_month',
											checked : true,
											listeners : {
												"check" : function(ra_month,
														checked) {
													if (checked) {
														showEl("month_input");
														hideEl("season_area");
													}
												}
											}
										}), {
									id : "year_input",
									xtype : 'combo',
									width : 80,
									mode : "local",
									triggerAction : "all",
									allowBlank : false,
									store : year_array,
									value : '2012'
								}, {
									id : 'season_area',
									width : 80,
									bodyStyle : 'border:none',
									items : [{
												xtype : 'combo',
												width : 80,
												id : 'season_input',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : season_array

											}]
								}, {
									id : 'month_area',
									width : 80,
									bodyStyle : 'border:none',
									items : [{
												id : 'month_input',
												width : 80,
												xtype : 'combo',
												mode : "local",
												allowBlank : false,
												triggerAction : "all",
												store : month_array
											}]
								}]
					}]
		}, {
			fieldLabel : '上传文件标题',
			xtype : 'textfield',
			id : 'title_input',
			allowBlank : false

		}]
	});
	up_fs = new Ext.form.FormPanel({
				layout : "form",
				//height :80,
				autoHeight:true,
				fileUpload : true,
				// autoHeight:true,
				bodyStyle : 'border:none;',
				items : [{
							fieldLabel : '上传文件选择',
							css : 'margin-top:2px;',
							xtype : 'textfield',
							inputType : 'file',
							id : 'file_upload',
							regex : /(.xls|.XLS)$/,
							regexText : '上传文件格式须为xls',
							allowBlank : false
						},
					     {
						fieldLabel : '备注',
			            xtype : 'textarea',
			            id : 'desc',
			            width:350,
			            height:100
						}]
			});
	win = new Ext.Window({
				title : '上传信息价',
				width : 880,
				draggable : true,
				modal : true,
				autoHeight : true,
				autoScroll : true,
				items : [panel, up_fs],
				buttons : [{
							text : '上传',
							handler : upfile
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	area3.on("select", function(combobox) {
				var province = combobox.getValue();
				city = zhcn.getCity(province);
				area4.store.loadData(city);
				area5.reset();
				area4.reset();
				area4.enable();
			})
	area4.on("select", function(combobox) {
				var ci = combobox.getValue();
				city_area = zhcn.getArea(ci)
				area5.store.loadData(city_area);
				area5.reset();
				area5.enable();

			})
	hideEl("season_area");
};

// search
function searchlist() {
	ds.baseParams["province"] = Ext.fly("province_combo").getValue();
	ds.baseParams["area"] = Ext.fly("area_combo").getValue();
	ds.load();
};

// upload file
function upfile() {
	var issuDate;
	
	if(Ext.fly("province_combo_1").getValue() == "请选择"){
		Info_Tip("请选择省份。");
		return;
	}
	if(Ext.fly("city_combo_1").getValue() == "请选择"){
		Info_Tip("请选择城市。");
		return;
	}
	if(Ext.fly("area_combo_1").getValue() == "请选择"){
		Info_Tip("请选择地区。");
		return;
	}
	
	// debugger
	if (Ext.isEmpty(Ext.fly("year_input").getValue())) {
		Info_Tip("请输入年份。");
		return;
	}
	if (Ext.fly("ra_season").dom.checked == true) {
		issuDate = Ext.fly("year_input").getValue() + "-"
				+ Ext.getCmp("season_input").getValue() + "-15";
		if (Ext.isEmpty(Ext.getCmp("season_input").getValue())) {
			Info_Tip("请输入季度。");
			return;
		}
	} else {
		issuDate = Ext.fly("year_input").getValue() + "-"
				+ Ext.fly("month_input").getValue() + "-05";
		if (Ext.isEmpty(Ext.fly("month_input").getValue())) {
			Info_Tip("请输入月份。");
			return;
		}
	}
	var title = encodeURI(encodeURI(Ext.fly("title_input").getValue()));
	if (Ext.isEmpty(title)) {
		Info_Tip("请输入上传文件标题。");
		return;
	}
	if (Ext.fly("file_upload").getValue() == "") {
		Info_Tip("上传文件不能为空。");
		return;
	}
	var desc = encodeURI(encodeURI(Ext.fly("desc").getValue()));//steven添加备注字段
	var province = encodeURI(encodeURI(Ext.fly("province_combo_1").getValue()));
	var city = encodeURI(encodeURI(Ext.fly("city_combo_1").getValue()));
	area = encodeURI(encodeURI(Ext.fly("area_combo_1").getValue()));
	if (Ext.isEmpty(area))
		area = city;
	var condition = "?province=" + province + "&area=" + city + "&county="
			+ area + "&issueDate=" + issuDate + "&title=" + title+"&mark="+desc;
	if (up_fs.getForm().isValid()) {
		up_fs.getForm().submit({
					url : '/GovMaterialUpload.do'+condition,
					waitMsg : '上传文件中...',
					success : function(up_fs, o) {
						// msg('Success', 'Processed file "'+o.result.file+'" on
						// the server');
					},
					failure : function() {

					}
				});
	} else
		Info_Tip("上传文件格式有误。");
};

var getResult = function(flag, msg) {
	if (flag) {
		alert("上传成功");
		Ext.MessageBox.hide();
		ds.baseParams["province"] = Ext.fly("province_combo_1").getValue();
		ds.baseParams["area"] = Ext.fly("area_combo_1").getValue();
		Ext.fly('province_combo').dom.value = (Ext.fly("province_combo_1").getValue());
		Ext.fly("city_combo").dom.value = (Ext.fly("city_combo_1").getValue());
		Ext.fly("area_combo").dom.value = (Ext.fly("area_combo_1").getValue());
		ds.load();
		win.close();
	} else {
		up_fs.getForm().reset();
		Ext.MessageBox.hide();
		if(msg.indexOf("downloadPath:") != -1){
			Ext.MessageBox.alert("分类检查","上传信息价中存在二级分类无法匹配的材料！请导出查看！", function(){
				window.open(msg.replace("downloadPath:", ""));
			});
		}else{
			alert(msg);
		}
	}
};

// 查看详细
function getInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息");
		return;
	}
	var id = row.get("id");
	var issueDate = row.get("issueDate");
	var title = row.get("title");
	var addr = "";
	if (Ext.fly("area_combo").getValue() != Ext.fly("city_combo").getValue()) {
		addr = Ext.fly("city_combo").getValue()
				+ Ext.fly("area_combo").getValue();
	} else {
		addr = Ext.fly("city_combo").getValue();
	}
	window.parent.createNewWidget("mat_gov_detail", '信息价详情',
			'/module/mat/mat_gov_detail.jsp?date=' + issueDate.slice(0, 10)
					+ "&province=" + Ext.fly("province_combo").getValue()
					+ "&addr=" + addr + "&title=" + title + "&tid=" + id);
};

/**
 * 查看信息价统计
 */
function showGovPriceDetail(){
	window.parent.createNewWidget("govPrice_detail", '信息价统计',
			'/module/mat/govPrice_detail_list.jsp');
}
