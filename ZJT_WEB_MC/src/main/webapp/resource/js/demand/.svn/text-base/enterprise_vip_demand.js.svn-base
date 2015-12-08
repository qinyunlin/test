// 省份城市级联选择
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = ["全部城市"];
var city_area = [];
Ext.onReady(init);
var grid, ds, win, pageSize = 20, state_ck, fs, stuff_type, zaojia_type, his_grid, ds2,comboProvinces,comboCities;
//供应一级分类store
var cname_1_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_gongqiu_1()
});
//供求二级分类store
var cname_2_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : []
});
//供求分类()
var cname_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_gongqiu()
});
//非标分类(包括所有)
var cname1_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_feibiao()
});
//非标分类(不包括所有)
var cname1_ds1 = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getStuff_feibiao()
});
function init() {
	Ext.QuickTips.init();
	buildGrid();
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu3',
						text : '查看/修改',
						hidden : compareAuth('DEMAND_ADMIN_VIEW'),
						handler : function() {
							getInfo('edit');
						}
					},{
						id : 'rMenu6',
						text : '添加求购',
						hidden : true,
						handler : function() {
							getInfo('add')
						}
					}, {
						id : 'rMenu7',
						text : '批量修改',
						hidden : compareAuth('DEMAND_ADMIN_MOD'),
						handler : batchEdit
					},{
						id : 'rMenu1',
						text : '审核',
						hidden: compareAuth('DEMAND_ADMIN_AUDIT'),
						handler : passop
					}, {
						id : 'rMenu2',
						text : '锁定',
						hidden:compareAuth('DEMAND_ADMIN_LOCK'),
						handler : lockop
					}, {
						id : 'rMenu5',
						text : '查看记录',
						hidden : true,
						handler : getAttCount
					},{
						id : 'rMenu8',
						text : '推荐/取消推荐',
						hidden:compareAuth('DEMAND_ADMIN_ISRECOMMEND'),
						handler : isRecommended
					}]
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpDemandServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "title", "pname", "ename", "name", "spec",
								"startTime", "endTime", "isAudit", "updateBy",
								"isLock", "attCount", 'createBy',"province","city", 'cname', 'cname1',
								'content','isRecommended']),
				baseParams : {
					page : 1,
					type : 14,
					isLock:0,
					pageSize : pageSize
				},
				countUrl : '/ep/EpDemandServlet',
				countParams : {
					type : 13
				},
				remoteSort : true
			});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var del_store = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['','所有'],["1", "未审核"], ["2", "已审核"]]
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
				viewConfig : {
					forceFit : true
				},
				sm : cm,
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
							dataIndex:"title",
							renderer :function(value, meta, record) {				
								var name = record.get("title");
								var isRecommended = record.get("isRecommended");					
								if("1" == isRecommended){
									name = "<img src='/resource/images/u13_isTop.gif' title='推荐参考材价' width='16' height='16' style='vertical-align:middle;' />" + name;
								}			
								return name;
							}
						}, {
							header : '项目名称',
							sortable : false,
							dataIndex : 'pname'
						}, {
							header : '企业名称',
							sortable : false,
							width : 150,
							dataIndex : 'ename'
						}, {
							header : '采购名称',
							sortable : false,
							width : 160,
							dataIndex : 'name',
							renderer : function(v) {
								return "<font style='color:red'>" + v
										+ "</font>";
							}
						}, {
							header : '型号规格',
							sortable : false,
							width : 160,
							dataIndex : 'spec'
						}, {
							header : '供求分类',
							sortable : true,
							dataIndex : 'cname',
							renderer : changeCname
						}, {
							header : '非标分类',
							sortable : true,
							dataIndex : 'cname1'
						}, {
							header : '地区',
							sortable : false,
							width : 60,
							renderer : renProvince
						}, {
							header : '开始时间',
							sortable : false,
							width : 60,
							dataIndex : 'startTime',
							renderer : trimDate
						}, {
							header : '结束时间',
							sortable : false,
							width : 60,
							dataIndex : 'endTime',
							renderer : trimDate
						}, {
							header : '审核状态',
							sortable : false,
							width : 50,
							dataIndex : 'isAudit',
							renderer : setAudit
						}, /*{
							header : '已删除',
							sortable : false,
							width : 40,
							dataIndex : 'isDeleted',
							renderer : changeDeleted
						},*/ {
							header : '修改人',
							sortable : false,
							width : 60,
							dataIndex : 'updateBy'
						}, {
							header : '添加人',
							sortable : false,
							width : 60,
							dataIndex : 'createBy'
						}, {
							header : '查看记录',
							sortable : false,
							width : 50,
							dataIndex : 'attCount'
						}],
				bbar : pagetool,
				tbar : [{
							text : '查看/修改',
							icon : "/resource/images/edit.gif",
							hidden: compareAuth('DEMAND_ADMIN_VIEW'),
							handler : function() {
								getInfo('edit');
							}
						},{
							text : '添加求购',
							icon : "/resource/images/add.gif",
							hidden : true,
							handler : function() {
								getInfo('add');
							}
						}, {
							text : '批量修改',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('DEMAND_ADMIN_MOD'),
							handler : batchEdit
						}, {
							text : '审核',
							icon : "/resource/images/tick.png",
							hidden: compareAuth('DEMAND_ADMIN_AUDIT'),
							handler : passop
						}, {
							text : '锁定',
							icon : "/resource/images/lock.png",
							hidden: compareAuth('DEMAND_ADMIN_LOCK'),
							handler : lockop
						}, {
							text : '查看记录',
							icon : "/resource/images/book_open.png",
							hidden : true,
							handler : getAttCount
						},{
							
							text : '推荐/取消推荐',
							icon : "/resource/images/tick.png",
							hidden:compareAuth('DEMAND_ADMIN_ISRECOMMEND'),
							handler : isRecommended
						}],
				renderTo : 'grid'
			});
	var searchPanel = new Ext.Panel({
		id : 'searchPanel',
		title : '',
		layout : 'table',
		border: false,
		bodyStyle : 'background:transparent;',
		layoutConfig : {
				columns : 2
			},
		items : [{
			xtype : 'panel',
			width:800,
			border: false,
			layout : 'table',
			layoutConfig : {
				columns : 1
			},
			bodyStyle : 'background:transparent;',
			items : [{
				layout : 'column',
				width: 800,
				border : false,
				bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
				items : [{
					style : 'line-height:22px;',
					xtype : 'label',
					text : '项目名称：'
				}, {
					xtype : 'textfield',
					id : 'pro_name',
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				}, {
					style : 'line-height:22px;',
					xtype : 'label',
					text : '采购名称：'
				}, {
					xtype : 'textfield',
					id : 'demand_name',
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				}, {
					style : 'line-height:22px;',
					xtype : 'label',
					text : '企业名称：'
				}, {
					xtype : 'textfield',
					id : 'demand_ename',
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				}, {
					style : 'line-height:22px;',
					xtype : 'label',
					text : '非标分类：'
				}, {
					xtype : 'combo',
					xtype : 'combo',
					width : 80,
					store : cname1_ds,
					id : 'input_cname1',
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					valueField : 'value',
					displayField : 'text',
					value : '',
					emptyeText : '请选择'
				}]
			}, {
				layout : 'column',
				width: 800,
				border : false,
				bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
				items : [{
					style : 'line-height:22px;',
					xtype : 'label',
					text : '供求一级分类：'
				},{
					xtype : 'combo',
					id : 'input_cname_1',
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					store : cname_1_ds,
					valueField : 'value',
					displayField : 'text',
					value : '',
					listeners : {
						'select' : function(){
							var cname_1 = Ext.fly('input_cname_1').getValue();
							var cname_2 = Ext.getCmp('input_cname_2');
							if(cname_1 == "所有"){
								cname_2_ds.removeAll();
								cname_2.setDisabled(true);
							}
							else{
								cname_2.setDisabled(false);
								cname_2_ds.loadData(getAllStuff_gongqiu_2(cname_1));
							}
							cname_2.setValue("");
						}
					}
				}, {
					style : 'line-height:22px;',
					xtype : 'label',
					text : '供求二级分类：'
				}, {
					xtype : 'combo',
					id : 'input_cname_2',
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					store : cname_2_ds,
					valueField : 'value',
					displayField : 'text',
					disabled : true,
					emptyText : '请选择'
				}, {
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				}, state_ck = new Ext.form.ComboBox({
					mode : "local",
					store : del_store,
					triggerAction : "all",
					valueField : 'value',
					displayField : 'text',
					fieldLabel : '审核状态',
					value : "",
					width:80,
					listeners:{
						"select":function(){
							searchlist();
						}
					}
				}),{
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				},  {
					xtype : 'button',
					text : '查询',
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
			}]
		}]
	});
	
	function renProvince(value, p, record) {
		return record.data.city;
	}
	
	
	
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [searchPanel/*{
							layout : 'form',
							labelWidth : 50,
							xtype : 'container',
							items : {
								xtype : 'textfield',
								fieldLabel : '项目名称',
								id : 'pro_name',
								enableKeyEvents : true,
								listeners : {
									"keyup" : function(tf, e) {
										if (e.getKey() == e.ENTER) {
											searchlist();
										}
									}
								}
							}
						}, "-", {
							layout : 'form',
							labelWidth : 50,
							xtype : 'container',
							items : {
								xtype : 'textfield',
								fieldLabel : '采购名称',
								id : 'demand_name',
								enableKeyEvents : true,
								listeners : {
									"keyup" : function(tf, e) {
										if (e.getKey() == e.ENTER) {
											searchlist();
										}
									}
								}
							}
						}, "-", {
							layout : 'form',
							labelWidth : 50,
							xtype : 'container',
							items : {
								xtype : 'textfield',
								fieldLabel : '企业名称',
								id : 'demand_ename',
								enableKeyEvents : true,
								listeners : {
									"keyup" : function(tf, e) {
										if (e.getKey() == e.ENTER) {
											searchlist();
										}
									}
								}
							}
						}, "-", {
							layout : 'form',
							labelWidth : 50,
							xtype : 'container',
							items : [state_ck = new Ext.form.ComboBox({
										mode : "local",
										store : del_store,
										triggerAction : "all",
										valueField : 'value',
										displayField : 'text',
										fieldLabel : '审核状态',
										value : "",
										width:80,
										listeners:{
											"select":function(){
												searchlist();
											}
										}
									})]
						}, "-", {
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}*/]
			});
	grid.on("rowdblclick", function() {
				getInfo('edit');
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
};

function searchlist() {
	var cname_1 = Ext.getCmp("input_cname_1").getValue();
	var cname_2 = Ext.getCmp("input_cname_2").getValue();
	var cname = "";
	if(cname_1 != "")
		cname = "/" + cname_1;
	if(cname_2 != "")
		cname = cname + "/" + cname_2;
	if(cname != "")
		cname = cname + "/";
		
	var cname1 = Ext.getCmp("input_cname1").getValue();
	var query = "pname~" + Ext.fly('pro_name').getValue() + ";name~"
			+ Ext.fly('demand_name').getValue() + ";ename~"
			+ Ext.fly('demand_ename').getValue() + ";cname~" + cname
			+ ";cname1~" + cname1;
	ds.baseParams["isAudit"] = state_ck.getValue();		
	ds.baseParams["content"] = query;
	ds.countParams["content"] = query;
	ds.load();
};

// 添加/修改 求购
function addDemand(obj_info, op) {
	var btn_text;
	if (op == "add") {
		btn_text = "添加";
		fs = new Ext.form.FormPanel({
			layout : 'form',
			labelWidth : 60,
			height : parent.Ext.fly('tab_1202_iframe').getHeight()/2,
			autoScroll:true,
			autoWidth : true,
			bodyStyle : 'padding:6px',
			items : [{
						xtype : 'textfield',
						fieldLabel : '标题',
						width:250,
						id : 'd_title',
						allowBlank : false,
						maxLength : 200
					},{
						xtype : 'textfield',
						fieldLabel : '采购材料',
						width : 250,
						id : 'd_name',
						allowBlank : false,
						maxLength : 250
					}, {
						xtype : 'textfield',
						fieldLabel : '型号规格',
						width : 250,
						id : 'd_spec',
						allowBlank : false,
						maxLength : 400
					}, {
						xtype : 'textfield',
						width : 250,
						fieldLabel : '单位',
						id : 'd_unit',
						allowBlank : false,
						maxLength : 100
					}, {
						xtype : 'numberfield',
						width : 250,
						fieldLabel : '数量',
						id : 'd_amount',
						allowBlank : false,
						maxLength : 100,
						regex : /^\d+$/,
						allowNegative : false,
						allowDecimals : false,
						regexText : "请正确填写数量"
					}, stuff_type = new Ext.form.ComboBox({
								store : Ext.stuff.code,
								width : 250,
								mode : "local",
								id : 'stuff_type',
								triggerAction : "all",
								valueField : 'value',
								displayField : 'text',
								fieldLabel : '材料分类',
								value : '1'
							}), zaojia_type = new Ext.form.ComboBox({
								store : ["建筑工程", "装饰装修", "安装工程", "市政工程", "园建绿化"],
								mode : "local",
								width : 250,
								triggerAction : "all",
								fieldLabel : '造价专业',
								value : '建筑工程'
							}), {
						xtype : 'textfield',
						width : 250,
						fieldLabel : '联系人',
						id : 'd_person',
						allowBlank : false,
						maxLength : 100,
						value : parent.currUser_mc.uname

					}, {
						xtype : 'textfield',
						fieldLabel : '联系方式',
						width : 250,
						id : 'd_phone',
						allowBlank : false,
						maxLength : 100,
						allowBlank : false,
						regex : formMsg.phonecurrency,
						regexText : formMsg.phoneErrMsg
					}, {
						xtype : 'textfield',
						fieldLabel : '公司名称',
						width : 250,
						id : 'd_ename',
						allowBlank : false,
						maxLength : 100
					}, {
						xtype : 'textfield',
						fieldLabel : '项目名称',
						width : 250,
						id : 'd_pname',
						allowBlank : false,
						maxLength : 250
					}, {
						xtype : 'datefield',
						fieldLabel : '开始时间',
						width : 250,
						id : 'd_starttime',
						format : "Y-m-d",
						readOnly : true,
						allowBlank : false
					}, {
						xtype : 'datefield',
						width : 250,
						fieldLabel : '结束时间',
						format : "Y-m-d",
						id : 'd_endtime',
						readOnly : true,
						allowBlank : false
					}, {
						xtype : 'textarea',
						width : 250,
						fieldLabel : '备注',
						id : 'd_notes',
						maxLength : 400
					}]
		});
	} else if (op == "edit") {
		btn_text = "修改";
		var path = "";
		if (obj_info['photo'] != null && obj_info['photo'] != "") {
			path = obj_info['photo'].split(".");
			path = path[0] + "_230." + path[1];
		} else {
			path = "/ep/default/eplogo.jpg";
		}
		fs = new Ext.form.FormPanel({
			layout : 'form',
			height : parent.Ext.fly('tab_1202_iframe').getHeight()/2,
			autoScroll:true,
			autoWidth:true,
			bodyStyle : 'padding:6px;',
			labelWidth : 80,
			labelAlign : 'right',
			items : [{
						layout : 'column',
						bodyStyle : 'border:none;',
						items : [{
							layout : 'form',
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							items:[{
								xtype : 'textfield',
								fieldLabel : '标题',
								width:164,
								id : 'd_title',
								name : 'title',
								allowBlank : false,
								maxLength : 200
							}, {
								xtype : 'textfield',
								fieldLabel : '采购材料',
								width : 164,
								id : 'd_name',
								name : 'name',
								allowBlank : false,
								maxLength : 164
							}, {
								xtype : 'textfield',
								fieldLabel : '型号规格',
								width : 164,
								id : 'd_spec',
								name : 'spec',
								allowBlank : false,
								maxLength : 400
							}, {
								xtype : 'textfield',
								width : 164,
								fieldLabel : '单位',
								id : 'd_unit',
								name : 'unit',
								allowBlank : false,
								maxLength : 100
							}, {
								xtype : 'textfield',
								width : 164,
								fieldLabel : '数量',
								id : 'd_amount',
								name : 'amount',
								allowBlank : false,
								maxLength : 100
							}, stuff_type = new Ext.form.ComboBox({
										store : Ext.stuff.code,
										width : 164,
										mode : "local",
										id : 'stuff_type',
										name : 'cid',
										triggerAction : "all",
										valueField : 'value',
										displayField : 'text',
										fieldLabel : '材料分类'
		
							}), {
								xtype : 'combo',
								store : cname_ds,
								width : 164,
								id : 'd_cname',
								name : 'cname',
								mode : "local",
								triggerAction : 'all',
								fieldLabel : '供求分类',
								valueField : "value",
								displayField : "text",
								emptyText : '请选择',
								readOnly : true
							}, {
								xtype : 'combo',
								store : cname1_ds1,
								width : 164,
								id : 'd_cname1',
								name : 'cname1',
								mode : 'local',
								triggerAction : 'all',
								fieldLabel : '非标分类',
								valueField : 'value',
								displayField : 'text',
								emptyText : '请选择',
								readOnly : true
							}, zaojia_type = new Ext.form.ComboBox({
										store : ["建筑工程", "装饰装修", "安装工程", "市政工程", "园建绿化"],
										mode : "local",
										width : 164,
										name : 'specialty',
										triggerAction : "all",
										fieldLabel : '造价专业'
		
									}), {
								xtype : 'textfield',
								width : 164,
								fieldLabel : '联系人',
								id : 'd_person',
								name : 'linkman',
								allowBlank : false,
								maxLength : 100
		
							}]
					}, {
						columnWidth : 0.5,
						ayout : 'form',
						bodyStyle : 'border:none;',
						labelAlign : 'right',
						items : [{
							bodyStyle : 'border:1px solid #ccc;',
							width : 230,
							height:230,
							html : "<img id='photo' width='230' height='230'  src='"
										+ FileSite + path + "'/>"
						}, {
							xtype : 'button',
							text : '更新图片',
							handler : showUploadImgWin
						}]
					}]
				}, {
					layout : 'column',
					bodyStyle : 'border:none;',
					items : [{
						layout : "form",
						bodyStyle : 'border:none;',
						columnWidth : 0.5,
						labelWidth : 80,
						items : [ {
							xtype : 'textfield',
							fieldLabel : '联系电话',
							width : 164,
							id : 'd_phone',
							name : 'phone',
							allowBlank : false,
							maxLength : 100,
							allowBlank : false,
							regex : formMsg.phonecurrency,
							regexText : formMsg.phoneErrMsg
						},{
								xtype : 'textfield',
								fieldLabel : 'QQ',
								width : 164,
								id : 'd_qq',
								name : 'qq',
								allowBlank : true,
								maxLength : 50,
								regex : formMsg.qqMsnPatrn,
								regexText : formMsg.qqMsnMsg
							}, {
								xtype : 'textfield',
								fieldLabel : '电子邮箱',
								width:164,
								id : 'd_email',
								name : 'email',
								allowBlank : true,
								maxLength : 50,
								regex : formMsg.emailPatrn,
								regexText : formMsg.emailErrMsg
							}, {
								xtype : 'textfield',
								fieldLabel : '项目名称',
								width : 164,
								name : 'pname',
								id : 'd_pname',
								maxLength : 164
							}, {
								xtype : 'datefield',
								fieldLabel : '开始时间',
								width : 164,
								id : 'd_starttime',
								name : 'startTime',
								format : "Y-m-d",
								readOnly : true
						}]
					},{
						layout : "form",
						bodyStyle : 'border:none;',
						columnWidth : 0.5,
						labelWidth : 55,
						items : [{
							xtype : 'textfield',
							fieldLabel : 'MSN',
							width:164,
							id : 'd_msn',
							name : 'msn',
							allowBlank : true,
							maxLength : 50,
							regex : formMsg.qqMsnPatrn,
							regexText : formMsg.qqMsnMsg
						} ,{
								xtype : 'textfield',
								fieldLabel : '传真',
								width:164,
								id : 'd_fax',
								name : 'fax',
								allowBlank : true,
								maxLength : 50,
								regex : formMsg.faxPatrn,
								regexText : formMsg.faxMsg
							},  comboProvinces = new Ext.form.ComboBox({
								id : 'comboProvinces',
								store : pro,
								value:"全部省份",
								width : 70,
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
										    city = zhcn.getCity(province).concat();
										    city.unshift("全部城市");
									    }
										
										comboCities.store.loadData(city);

										comboCities.enable();
									}
								},

								valueField : "value",
								displayField : "text",
								mod:'local',
								forceSelection : true,
								emptyText : '',
								editable : false,
								triggerAction : 'all',
								allowBlank : false,
								readOnly : true,
								width:163,
								fieldLabel : '所在省份',
							}),

							 comboCities = new Ext.form.ComboBox({
								id : 'comboCities',
								store : city,
								value:'全部城市',
								valueField : "value",
								displayField : "text",
								mode : 'local',
								forceSelection : true,
								emptyText : '',
								hiddenName : 'region',
								editable : false,
								triggerAction : 'all',
								readOnly : true,
								name : 'region',
								disabled : true,
								allowBlank : false,
								width : 163,
								fieldLabel : '所在城市'
							}),
							{
								xtype : 'datefield',
								width : 164,
								fieldLabel : '结束时间',
								format : "Y-m-d",
								id : 'd_endtime',
								name : 'endTime',
								readOnly : true
							}
						]
					}]
			},{
				xtype : "textarea",
				fieldLabel : '备注',
				id : "d_content",
				name : 'content',
				width :420
			}]
		});
	}

	win = new Ext.Window({
				title : btn_text + '求购信息',
				width : 600,
				autoHeight : true,
				items : [fs],
				modal : true,
				buttonAlign : 'right',
				buttons : [{
							text : btn_text,
							hidden : op == "edit" ? compareAuth('DEMAND_ADMIN_MOD') : compareAuth('DEMAND_ADMIN_VIEW'),
							handler : function() {
								saveDemand(op);
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	if (obj_info) {
		fs.getForm().setValues(obj_info);
		Ext.fly("d_starttime").dom.value = obj_info["startTime"] ? obj_info["startTime"].slice(0, 10) : "";
		Ext.fly("d_endtime").dom.value = obj_info["endTime"] ? obj_info["endTime"].slice(0, 10) : "";
		Ext.fly("comboProvinces").dom.value = obj_info["province"];
		Ext.fly("comboCities").dom.value = obj_info["city"];
	}
};

//批量修改
function batchEdit(){
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var kind_ds = new Ext.data.ArrayStore({
		fields : ['value', 'text'],
		data : [['cname', '供求分类'], ['cname1', '非标分类']]
	});
	fs = new Ext.form.FormPanel({
		layout : 'form',
		height : 70,
		autoScroll:true,
		autoWidth:true,
		bodyStyle : 'padding:6px;',
		labelAlign : 'right',
		labelWidth : 60,
		items : [{
			fieldLabel : '分类名称',
			xtype : 'combo',
			store : kind_ds,
			id : 't_kind',
			emptyText : "请选择",
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			displayField : "text",
			readOnly : true,
			value : 'cname',
			listeners : {
				select : function(){
					var value = Ext.getCmp('t_kind').getValue();
					switch(value){
						case 'cname' :
							hideEl('t_cname1_form');
							showEl('t_cname_form');
							break;
						case 'cname1' :
							hideEl('t_cname_form');
							showEl('t_cname1_form');
							break;
						default : 
							break;
					}
				}
			}
		}, {
			layout : 'form',
			labelAlign : 'right',
			labelWidth : 60,
			border : false,
			id : 't_cname_form',
			items : {
				fieldLabel : '供求分类',
				xtype : 'combo',
				store : cname_ds,
				id : 't_cname',
				emptyText : "请选择",
				mode : "local",
				triggerAction : "all",
				valueField : "value",
				displayField : "text",
				readOnly : true
			}
		}, {
			layout : 'form',
			labelAlign : 'right',
			labelWidth : 60,
			border : false,
			id : 't_cname1_form',
			items : {
				fieldLabel : '非标分类',
				xtype : 'combo',
				store : cname1_ds1,
				id : 't_cname1',
				emptyText : "请选择",
				mode : "local",
				triggerAction : "all",
				valueField : "value",
				displayField : "text",
				readOnly : true
			}
		}]
	});
	win = new Ext.Window({
				title : '批量修改供求信息',
				width : 280,
				items : [fs],
				modal : true,
				autoHeight : true,
				buttonAlign : 'right',
				buttons : [{
							text : '修改',
							hidden: compareAuth('SUPPLY_ADMIN_MOD'),
							handler : function() {
								saveDemand('batchEdit');
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}],
				listeners : {
					show : function(){
						hideEl('t_cname1_form');
					}
				}
			});
	win.show();	
};

// 添加/修改 求购信息
function saveDemand(op) {
	var params = "";
	var tip = "";
	var query = "content=";
	if (fs.getForm().isValid()) {
		if(op == "add" || op == "edit"){
			var ispass = Date.parse(Ext.fly("d_endtime").getValue().replace(/-/g, "/"))
			- Date.parse(Ext.fly("d_starttime").getValue().replace(/-/g, "/"))
			if (ispass < 0) {
				Info_Tip("结束时间必须大于开始时间。");
				return;
			}
			var photo = Ext.fly("photo").dom.src.split('/');
			photo = "/" + photo.slice(3).toString().replace(/,/g, "/");
			query += "title~" + fs.getForm().items.map["d_title"].getValue()
					+ ";pname~" + fs.getForm().items.map["d_pname"].getValue()
					+ ";content~" + fs.getForm().items.map["d_content"].getValue()
					+ ";linkman~" + fs.getForm().items.map["d_person"].getValue()
					+ ";phone~" + fs.getForm().items.map["d_phone"].getValue()
					+ ";startTime~" + Ext.fly("d_starttime").getValue()
					+ ";endTime~" + Ext.fly("d_endtime").getValue() + ";name~"
					+ fs.getForm().items.map["d_name"].getValue() + ";unit~"
					+ fs.getForm().items.map["d_unit"].getValue() + ";spec~"
					+ fs.getForm().items.map["d_spec"].getValue() + ";amount~"
					+ fs.getForm().items.map["d_amount"].getValue() + ";cid~"
					+ stuff_type.getValue() + ";specialty~"
					+ zaojia_type.getValue() + ";cname~"
					+ Ext.getCmp("d_cname").getValue() + ";cname1~"
					+ Ext.getCmp('d_cname1').getValue() + ";qq~"
					+ fs.getForm().items.map["d_qq"].getValue() + ";msn~"
					+ fs.getForm().items.map['d_msn'].getValue() + ";email~"
					+ fs.getForm().items.map["d_email"].getValue() + ";fax~"
					+ fs.getForm().items.map["d_fax"].getValue()
					+ ";photo~" + photo+";province~"+Ext.fly("comboProvinces").getValue()+";city~"+Ext.fly("comboCities").getValue();
		}
		if (op == "add") {
			params = "type=1";
			tip = "求购信息添加成功。";
		} else if (op == "edit") {
			params = "type=3&id=" + grid.getSelectionModel().getSelected().get("id");
			tip = "修改求购信息成功。"
		}
		else if (op == 'batchEdit'){
			var ctype = Ext.getCmp("t_kind").getValue();
			var cname = "";
			switch(ctype){
				case 'cname':
					cname = Ext.getCmp("t_cname").getValue();
					break;
				case 'cname1':
					cname = Ext.getCmp("t_cname1").getValue();
					break;
				default:
					break;
			}
			var row = grid.getSelectionModel().getSelections();
			var ids = [];
			for (var i = 0; i < row.length; i++) {
				ids.push(row[i].get('id'));
			}
			params = "type=17&id=" + ids.toString() + "&ctype=" + ctype + "&cname=" + cname;
			tips = "修改信息成功!";
		}
		if (op == "add") {
			Ext.lib.Ajax.request("post", "/ep/EpDemandServlet", {
						success : function(response) {
							var json = eval("(" + response.responseText + ")");
							if (getState(json.state, commonResultFunc,
									json.result)) {
								Info_Tip(tip);
								ds.reload();
								win.close();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					}, query + "&" + params);
		} else if (op == "edit") {
				Ext.lib.Ajax.request("post", "/ep/EpDemandServlet", {
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip(tip);
							ds.reload();
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				}, query + "&" + params);
		}else if(op == 'batchEdit'){
			Ext.lib.Ajax.request("post", "/ep/EpDemandServlet", {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip(tips);
						win.close();
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, params);
		}
	} else {
		Ext.Msg.alert("提示", "请按照要求填写内容!");
		return;
	}
};



// 获取详细信息
function getInfo(op) {
	if (op == "add") {
		addDemand(null, op)
	} else if (op == "edit") {
		var row = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
		Ext.lib.Ajax.request("post", "/ep/EpDemandServlet", {
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							var data = json.result;
							for(var v in data){
								data[v] = data[v] ? data[v] : "";
							}
							addDemand(data, op)
						}
					},
					failure : function() {
						Warn_Tip();
					}
				}, "type=20&id=" + row.get("id"));
	}
};
// 审核
function passop() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var ids = [];
	for (var i = 0; i < row.length; i++) {
		ids.push(row[i].get('id'));
	}
	Ext.Msg.confirm("提示", "您确定要审核该信息?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/ep/EpDemandServlet?type=15",
							{
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + ids.toString() + "&isAudit=2");
				}
			});

};

// 锁定
function lockop() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择信息。");
		return;
	}
	var ids = [];
	for (var i = 0; i < row.length; i++) {
		ids.push(row[i].get('id'));
	}
	Ext.lib.Ajax.request("post", "/ep/EpDemandServlet?type=2", {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("操作成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "id=" + ids.toString() + "&isLock=1");
};



//审核
function isRecommended() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var isAudit=row[0].get('isAudit');
	if(parseInt(isAudit)!=2){
		Info_Tip("只能推荐审核通过的信息。");
		return;
	}
	var isRecommended=row[0].get('isRecommended');
	var html="您确定要推荐该信息";
	if(parseInt(isRecommended)==1){
		isRecommended=0;
		html="您确定要取消推荐该信息吗？";
	}else{
		isRecommended=1;
	}
	var ids = [];
/*	for (var i = 0; i < row.length; i++) {*/
		ids.push(row[0].get('id'));
	//}
	Ext.Msg.confirm("提示", html, function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/ep/EpDemandServlet?type=32",
							{
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + ids.toString()+"&isRecommend="+isRecommended);
				}
			});

};

// 查看记录
function getAttCount() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var id = row.get("id");
	ds2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpDemandServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "fname", "linkman", "phone", "num",
								"lastTime"]),
				baseParams : {
					page : 1,
					type : 9,
					id : id
				},
				remoteSort : true
			});
	ds2.load();

	his_grid = new Ext.grid.GridPanel({
				title : '查看记录',
				store : ds2,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '单位名称',
							sortable : false,
							width : 150,
							dataIndex : 'fname'
						}, {
							header : '联系人',
							sortable : false,
							width : 150,
							dataIndex : 'linkman'
						}, {
							header : '联系方式',
							sortable : false,
							width : 160,
							dataIndex : 'phone'
						}, {
							header : '查看次数',
							sortable : false,
							dataIndex : 'num'
						}, {
							header : '最近查看时间',
							sortable : false,
							dataIndex : 'lastTime',
							renderer : trimDate
						}]
			});
	win = new Ext.Window({
				title : '查看求购信息',
				width : 680,
				//height : parent.Ext.fly('tab_0303_iframe').getHeight() / 2,
				height : 300,
				modal : true,
				items : [his_grid],
				buttons : [{
							text : '关闭',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};
//上传图片
//显示上传图片窗口
var showUploadImgWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};
function upload_fn() {
	Ext.fly("photo").dom.src = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;

};

/* end 上传图片 */
//供求分类
function changeCname(v){
	if(v){
		var array = v.split('/');
		if(array.length > 1)
			return array[array.length-2];
	}
	return "";
};
function setAudit(v) {
	if (!isEmpty(v)) {
		if (v == "2")
			return "已审核";
		else
			return "<font style='color:red'>未审核</font>";
	} else
		return "<font style='color:red'>未审核</font>";
};