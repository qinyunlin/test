var grid, ds, win, upload_form;

//var rMaterialType = [ [ '', "全部参考材价" ], [ '0', "有效参考材价" ], [ '1', "无效参考材价" ],['-1',"无参考价"] ];
var rMaterialType = [ [ '', "全部参考材价" ], [ '0', "有效参考材价" ], [ '-1', "无效参考材价" ],['1',"已删除参考价"] ];
var opFlag = false;
var opMsg = "";
var changeContent = "";
var loadMarsk,loadStore;
var map = null;

Ext.onReady(function() {
	init();
	//年份赋值 为今年 下一年 和上一年
    year_array = [[new Date().getFullYear()+1,new Date().getFullYear()+1],
	                  [new Date().getFullYear(),new Date().getFullYear()],
	                  [new Date().getFullYear()-1,new Date().getFullYear()-1]
		          		];
	Ext.QuickTips.init();
});

function init() {
	buildGrid();
};

function reBindGridData(){
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var r_columnItems =  [
							new Ext.grid.RowNumberer({
								width : 30
							}),
							sm,
							{
								header : 'ID',
								sortable : false,
								dataIndex : 'id',
								hidden : true
							},
							{
								width : 70,
								header : '参考材价编码',
								sortable : true,
								dataIndex : 'bianma',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var bianma = record.get("bianma");
									if ("1" == isDeleted) {
										return "<font color='red'>" + bianma
												+ "</font>";
									}
									return bianma;
								}
							},
							{
								width : 80,
								header : '二级分类',
								sortable : true,
								dataIndex : 'subCid',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var subCid = record.get("subCid");
									// var subName = getSubCidNameBySubcid(subCid);
									var subName = getSubCidNameBySubcid(subCid,
											true);
									if (subName == null) {
										return "";
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + subName
												+ "</font>";
									}
									return subName;
								}
							},
							{
								width : 60,
								header : '材料名称',
								sortable : false,
								dataIndex : 'name',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var name = record.get("name");
									/*var isPriceMaterial = record
											.get("isPriceMaterial");*/
									var isTop = record.get("isTop");
									//造价通7.0版以后所有的参考材价都是价格行情材料
									/*if (isPriceMaterial == "1") {
										name = "<span class='icon_cx_box'>" + name
												+ "</font>";
									}*/
									if("1" == isTop){
										name = "<img src='/resource/images/u13_isTop.gif' title='推荐参考材价' width='16' height='16' style='vertical-align:middle;' />" + name;
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + name
												+ "</font>";
									}
									return name;
								}
							},
							{
								width : 100,
								header : '型号规格',
								sortable : false,
								dataIndex : 'spec',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var spec = record.get("spec");
									if (spec == null) {
										spec = "";
									}
									if ("1" == isDeleted) {
										return "<span title='" + spec
												+ "'><font color='red'>" + spec
												+ "</font></span>";
									}
									return "<span title='" + spec + "'>" + spec
											+ "</span>";
								}
							},
							{
								width : 30,
								header : '单位',
								sortable : false,
								dataIndex : 'unit',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var unit = record.get("unit");
									if (unit == null) {
										unit = "";
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + unit
												+ "</font>";
									}
									return unit;
								}
							},
							{
								width : 60,
								header : '参考价',
								sortable : false,
								dataIndex : 'price',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var price = record.get("price");
									if (price == null || parseFloat(price) == 0) {
										//price = "0.0000";
										return "";
									}
									//按原规则计算出来的价格，如在100以下则四舍五入到小数点后两位；如在100及100以上则四舍五入到整数。
									var rPrice = price;
									if (parseFloat(price) >= 100){
										rPrice = parseInt(Math.round(price));
									}else{
										//rPrice = Math.round(price).toFixed(2);
										rPrice = parseFloat(price).toFixed(2);
									}
									
									if ("1" == isDeleted) {
										return "<font color='red'>" + rPrice
												+ "</font>";
									}
									return rPrice;
								}
							}/*
							{
								width : 80,
								header : '参考供应商',
								sortable : false,
								dataIndex : 'suppliers',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var suppliers = record.get("suppliers");
									if (suppliers == null || "" == suppliers) {
										return "";
									}
									var supArrs = suppliers.split(";");
									var supApp = "";
									for ( var i = 0; i < supArrs.length; i++) {
										var sups = supArrs[i].split("~");
										// var supName = sups[1];
										var supName = sups[1]; // 取供应商简称
										if (sups.length == 5) {
											supName = sups[4];
										}
										var price = sups[2];
										supApp += supName + " " + price + ";";
									}
									var returnSup = "";
									if (supApp.lastIndexOf(";") != -1) {
										returnSup = supApp.substring(0, supApp
												.lastIndexOf(";"));
									}
									if ("1" == isDeleted) {
										return "<span title='" + returnSup
												+ "'><font color='red'>"
												+ returnSup + "</font></span>";
									}
									return "<span title='" + returnSup + "'>"
											+ returnSup + "</span>";
								}
							},*/];
	
	var province = ds.baseParams["province"];
	var cid = ds.baseParams["cid"];
	//if (province != null && "" != province && cid != null && "" != cid) {
	/*if (province != null && "" != province) {
		//if (cid != null && "" != cid){
			diffRatio = getDiffRatioByProvinceAndCid(province,cid);
			if (diffRatio != null){
				var content = diffRatio["content"];
				if (content != ""){
					var contentArr = content.split(";");
					for (var m = 0, n = contentArr.length; m < n; m ++){
						var contentVal = contentArr[m];
						var cityId = contentVal.split(":")[0];
						var cityRatio = contentVal.split(":")[1];
						var cityName = getCityNameById(cityId);
						r_columnItems.push({
							width : 80,
							header : cityName,
							sortable : false,
							dataIndex : cityRatio,//改行请勿轻易改动，否则会造成数据错乱
							renderer : function(value, meta, record) {
								var price = record.get("price");
								if (price == null || "" == price) return "0.0000";
								var returnVal = parseFloat(price) * parseFloat(this.dataIndex);
								return returnVal.toFixed(4);
						}
						});
					}
				}
			}
			if (cityRingList != null){
				//for (var m = 0, n = cityRingList.length; m < n; m ++){
				for (var m = 0, n = currProCityList.length; m < n; m ++){
					var cityRing = currProCityList[m];
					var cityName = cityRing["name"];
					var currCityId = cityRing["id"];
					var currPro = cityRing["province"];
					if (province != currPro) continue;
					r_columnItems.push({
						width : 60,
						header : cityName,
						sortable : false,
						dataIndex : currCityId,//改行请勿轻易改动，否则会造成数据错乱
						renderer : function(value, meta, record) {
							var subcid = record.get("subCid");
							if (subcid == null || "" == subcid){
								return "";
							}
							var cid = subcid.substring(0,2);
							var price = record.get("price");
							if (price == null || parseFloat(price) == 0){
								return "";
							}
							var isDeleted = record.get("isDeleted");
							var diffRatio = getDiffRatioByProvinceAndCid(province, cid);
							var content = diffRatio["content"];
							if (content != null && content != ""){
								var contentArr = content.split(";");
								for (var m = 0, n = contentArr.length; m < n; m ++){
									var contentVal = contentArr[m];
									var cityId = contentVal.split(":")[0];
									var cityRatio = contentVal.split(":")[1];
									if (this.dataIndex == cityId){
										var returnVal = parseFloat(price) * parseFloat(cityRatio);
										if ("1" == isDeleted) {
											return "<font color='red'>" + returnVal.toFixed(4)
													+ "</font>";
										}
										var rPrice = returnVal;
										if (parseFloat(returnVal) >= 100){
											rPrice = parseInt(Math.round(returnVal));
										}else{
											//rPrice = Math.round(returnVal).toFixed(2);
											rPrice = parseFloat(returnVal).toFixed(2);
										}
										return rPrice;
									}
								}
							}
							var rPrice = price;
							if (parseFloat(price) >= 100){
								//rPrice = parseInt(Math.round(price));
								rPrice = parseInt(price);
							}else{
								//rPrice = Math.round(price).toFixed(2);
								rPrice = parseFloat(price).toFixed(2);
							}
							if ("1" == isDeleted) {
								return "<font color='red'>" + rPrice
										+ "</font>";
							}
							return rPrice;
					}
					});
				}
			}
		//}
	}*/
	
	r_columnItems.push({
		width : 80,
		header : '来源',
		sortable : true,
		dataIndex : 'fromBy',
		renderer : function(value, meta, record) {
			var isDeleted = record.get("isDeleted");
			var fromBy = record.get("fromBy");
			if (fromBy == null){
				fromBy = "";
			}
			if (fromBy.lastIndexOf(";") == (fromBy.length - 1) && fromBy.lastIndexOf(";") != -1){
				fromBy = fromBy.substring(0, fromBy.lastIndexOf(";"));
			}
			if ("1" == isDeleted) {
				return "<font color='red'>" + fromBy
						+ "</font>";
			}
			return fromBy;
		}
	},
/*						{
		width : 50,
		header : '更新人',
		sortable : true,
		dataIndex : 'updateBy',
		renderer : function(value, meta, record) {
			var isDeleted = record.get("isDeleted");
			var updateBy = record.get("updateBy");
			if ("1" == isDeleted) {
				return "<font color='red'>" + updateBy
						+ "</font>";
			}
			return updateBy;
		}

	},
*/						{
		width : 100,
		header : '更新时间',
		sortable : true,
		dataIndex : 'updateOn',
		renderer : function(value, meta, record) {
			var isDeleted = record.get("isDeleted");
			var updateOn = record.get("updateOn");
			if ("1" == isDeleted) {
				return "<font color='red'>" + updateOn
						+ "</font>";
			}
			return updateOn;
		}
	} );
	
	//重新绑定grid
	grid.reconfigure(ds, new Ext.grid.ColumnModel(r_columnItems));
	ds.load();
}

function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/material/MaterialServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "code", "subCid", "name", "spec", "unit", "suppliers",
				"price", "cityCircleId", "cityCircleName", "hisCount",
				"isDeleted", "isPriceMaterial", "createOn", "createBy",
				"updateOn", "updateBy","fromBy","bianma","code2013","province","features","isTop", "cHisRatios","lastPrice" ]),
		baseParams : {
			type : 1,
			page : 1,
			pageSize : 20,
			content : "isDeleted~0" //默认显示有效参考价
		},
		countUrl : '/material/MaterialServlet.do',
		countParams : {
			type : 2
		},
		remoteSort : true
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true,
		pageSize : 20
	});

	var r_columnItems =  [
							new Ext.grid.RowNumberer({
								width : 30
							}),
							sm,
							{
								header : 'ID',
								sortable : false,
								dataIndex : 'id',
								hidden : true
							},
							{
								width : 80,
								header : '参考材价编码',
								sortable : true,
								dataIndex : 'bianma',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var bianma = record.get("bianma");
									if ("1" == isDeleted) {
										return "<font color='red'>" + bianma
												+ "</font>";
									}
									return bianma;
								}
							},
							{
								width : 80,
								header : '二级分类',
								sortable : true,
								dataIndex : 'subCid',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var subCid = record.get("subCid");
									if (subCid == null || "" == subCid) {
										return "";
									}
									// var subName = getSubCidNameBySubcid(subCid);
									var subName = getSubCidNameBySubcid(subCid,
											true);
									if (subName == null || "" == subName) {
										return "";
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + subName
												+ "</font>";
									}
									return subName;
								}
							},
							{
								width : 60,
								header : '材料名称',
								sortable : false,
								dataIndex : 'name',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var name = record.get("name");
									var isPriceMaterial = record
											.get("isPriceMaterial");
									if (isPriceMaterial == "1") {
										name = "<span class='icon_cx_box'>" + name
												+ "</font>";
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + name
												+ "</font>";
									}
									return name;
								}
							},
							{
								width : 100,
								header : '型号规格',
								sortable : false,
								dataIndex : 'spec',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var spec = record.get("spec");
									if (spec == null) {
										spec = "";
									}
									if ("1" == isDeleted) {
										return "<span title='" + spec
												+ "'><font color='red'>" + spec
												+ "</font></span>";
									}
									return "<span title='" + spec + "'>" + spec
											+ "</span>";
								}
							},
							{
								width : 50,
								header : '单位',
								sortable : false,
								dataIndex : 'unit',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var unit = record.get("unit");
									if (unit == null) {
										unit = "";
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + unit
												+ "</font>";
									}
									return unit;
								}
							},
							{
								width : 80,
								header : '参考价',
								sortable : false,
								dataIndex : 'price',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var price = record.get("price");
									if (price == null) {
										price = "0.0000";
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + price
												+ "</font>";
									}
									return price;
								}
							},/*
							{
								width : 80,
								header : '参考供应商',
								sortable : false,
								dataIndex : 'suppliers',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var suppliers = record.get("suppliers");
									if (suppliers == null || "" == suppliers) {
										return "";
									}
									var supArrs = suppliers.split(";");
									var supApp = "";
									for ( var i = 0; i < supArrs.length; i++) {
										var sups = supArrs[i].split("~");
										// var supName = sups[1];
										var supName = sups[1]; // 取供应商简称
										if (sups.length == 5) {
											supName = sups[4];
										}
										var price = sups[2];
										supApp += supName + " " + price + ";";
									}
									var returnSup = "";
									if (supApp.lastIndexOf(";") != -1) {
										returnSup = supApp.substring(0, supApp
												.lastIndexOf(";"));
									}
									if ("1" == isDeleted) {
										return "<span title='" + returnSup
												+ "'><font color='red'>"
												+ returnSup + "</font></span>";
									}
									return "<span title='" + returnSup + "'>"
											+ returnSup + "</span>";
								}
							},*/{
								width : 120,
								header : '来源',
								sortable : true,
								dataIndex : 'fromBy',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var fromBy = record.get("fromBy");
									if (fromBy == null){
										fromBy = "";
									}
									if (fromBy.lastIndexOf(";") == (fromBy.length - 1) && fromBy.lastIndexOf(";") != -1){
										fromBy = fromBy.substring(0, fromBy.lastIndexOf(";"));
									}
									if ("1" == isDeleted) {
										return "<font color='red'>" + fromBy
												+ "</font>";
									}
									return fromBy;
								}
							},
						/*						{
								width : 50,
								header : '更新人',
								sortable : true,
								dataIndex : 'updateBy',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var updateBy = record.get("updateBy");
									if ("1" == isDeleted) {
										return "<font color='red'>" + updateBy
												+ "</font>";
									}
									return updateBy;
								}

							},
						*/						{
								width : 100,
								header : '更新时间',
								sortable : true,
								dataIndex : 'updateOn',
								renderer : function(value, meta, record) {
									var isDeleted = record.get("isDeleted");
									var updateOn = record.get("updateOn");
									if ("1" == isDeleted) {
										return "<font color='red'>" + updateOn
												+ "</font>";
									}
									return updateOn;
								}
							} ];
	
	grid = new Ext.grid.GridPanel(
			{
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : r_columnItems,
				viewConfig : {
					forceFit : true
				},
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [
						{
							text : '查看/修改',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_VIEW") || compareAuth("REFERENCEMATERIALPRICE_EDIT"),
							handler : viewReferenceMaterialPriceDetail
						},
						'-',
						/*{
							text : '同步参考价',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("SYNCH_REFERENCEMATERIALPRICE"),
							handler : sysReferenceMaterialPrice
						},
						'-',
						{
							text : '设置/取消行情材料',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("PRICEMATERIAL_SET_OR_CANCLE"),
							handler : setPriceMaterial
						},
						'-',*/
						/*{
							text : '设置城市圈',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("CITYCIRCLE_SET"),
							handler : setCityCircle
						},
						'-',
						{
							text : '设置调差系数',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_SET_DIFFRATIO"),
							handler : setDiffRatio
						},
						'-',*/
						{
							text : '测算',
							tooltip : '勾选材料后点击则测算所选，不勾选材料点击则测算全部！',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_CALC"),
							handler : calcRefMatPrice
						},
						'-',
						{
							text : '发布',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_PUBLISH"),
							handler : release
						},
						'-',
						{
							text : '发布价管理',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_PUBLISH_MANAGE"),
							handler : releaseManage
						},
						'-',
						{
							text : '设置/取消推荐',
							tooltip : '勾选未推荐的参考材价则是推荐，勾选已推荐的参考材价则是取消推荐！',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_SET_TOP"),
							handler : setTop
						},
						'-',
						{
							//text : '导出参考材料',
							text : '导出报价',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_EXPORT"),
							handler : exportReferenceMaterialPrice
						},
						'-',
						{
							//text : '导入参考材料',
							text : '导入报价',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_IMPORT"),
							handler : function() {
								importReferenceMaterialPrice(false);
							}
						}/*,
						'-',
						{
							text : '导出价格行情材料',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("REFERENCEMATERIALPRICE_ISPRICEMATERIAL_EXPORT"),
							handler : exportisPriceMaterialReferenceMaterialPrice
						}, '-', {
							text : '导入价格行情材料',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("MATERIALPRICE_IMPORT"),
							handler : function() {
								importReferenceMaterialPrice(true);
							}
						} */]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		// rightClick.showAt(e.getXY());
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		viewReferenceMaterialPriceDetail();
	});
	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
			xtype : "label",
			text : "类型选择："
		}, {
			xtype : 'combo',
			id : 'rMaterial_status',
			hiddenName : "rMaterial_status_input",
			store : rMaterialType,
			typeAhead : true,
			mode : 'local',
			fieldLabel : '参考材价类别',
			triggerAction : 'all',
			valueField : "value",
			displayField : "text",
			emptyText : '全部参考材价',
			value : "0",
			width : 120,
			readOnly : true,
			listeners : {
				select : function(combo, record, index) {
					searchlist();
				}
			}
		}, '-', {
			xtype : "label",
			text : "名称："
		}, {
			xtype : 'textfield',
			fieldLabel : '名称',
			id : 'name',
			width : 140,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, '-', {
			xtype : "label",
			text : "型号规格："
		}, {
			xtype : 'textfield',
			fieldLabel : '型号规格',
			id : 'spec',
			width : 140,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, '-', {
			xtype : "label",
			text : "参考材价编码："
		}, {
			xtype : 'textfield',
			fieldLabel : '参考材价编码',
			id : 'bianma',
			width : 140,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, {
			text : '查询',
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});

};

/**
 * 查询
 */
function searchlist() {
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	var rMaterialStatus = Ext.getCmp("rMaterial_status").getValue();
	var name = Ext.getCmp("name").getValue();
	var spec = Ext.fly("spec").getValue();
	var bianma = Ext.fly("bianma").getValue();
	// ds.baseParams["rMaterialStatus"] = rMaterialStatus;
	ds.baseParams["content"] = "name~" + name + ";spec~" + spec + ";bianma~"
			+ bianma + ";isDeleted~" + rMaterialStatus;
	ds.load();
};

/**
 * 查看
 */
function viewReferenceMaterialPriceDetail() {
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Info_Tip("请选择一条参考价材料！");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("rMaterialPrice_detial", '查看修改材料',
			'/module/mat/rMaterialPrice_detail.jsp?id=' + row.get("id"));
}

/**
 * 同步参考材料
 */
function sysReferenceMaterialPrice() {
	if (opFlag) {
		Ext.MessageBox.alert("提示", opMsg + "操作正在进行中，不能进行其它操作！");
		return false;
	}
	var cityCircleId = ds.baseParams["cityCircleId"];
	var param = "";
	// 考虑到海量的数据，同步时只能同步某一城市圈下的参考材价
	if (cityCircleId == null || "" == cityCircleId) {
		Ext.MessageBox.alert("提示", "请选择一个城市圈再进行同步！");
		return false;
	}
	param = "cityCircleId=" + cityCircleId;
	Ext.MessageBox.show({
		title : '提示',
		msg : '同步参考价可能需要花费几分钟的时间，请问是否要同步参考价？',
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(btn, text) {
			if ("ok" == btn) {
				var loadMarsk = new Ext.LoadMask(document.body, {
					msg : '同步参考价正在处理中.....!',
					disabled : false,
					store : loadStore
				});
				// loadMarsk.show();
				opFlag = true;
				opFlag = false;
				opMsg = "同步参考价";
				var loadStore = Ext.lib.Ajax.request("post",
						"/material/MaterialServlet.do?type=7&" + param, {
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									Ext.MessageBox.alert("提示", "已同步！");
									loadMarsk.hide();
									opFlag = false;
									ds.reload();
								}
							}
						}, "");
			} else {
				opFlag = false;
			}
		}
	});
}

/**
 * 设置/取消行情材料
 */
function setPriceMaterial() {
	if (opFlag) {
		Ext.MessageBox.alert("提示", opMsg + "操作正在进行中，不能进行其它操作！");
		return false;
	}
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length <= 0) {
		Info_Tip("请至少选择一条参考材价信息！");
		return;
	}
	var message = "";
	var pMaterialStatus = 0;
	var returnMsg = "";
	var ids = [];
	var isPrices = [];
	var status = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
		isPrices.push(rows[i].get("isPriceMaterial"));
		status.push(rows[i].get("isDeleted"));
	}

	if (status.toString().indexOf("1") >= 0) {
		Info_Tip("不可对无效的参考材价进行此操作！");
		return;
	}
	if (isPrices.toString().indexOf("0,1") < 0) {
		if (isPrices.toString().indexOf("1") >= 0) {
			message = "确定取消该行情材料吗？";
			returnMsg = "行情材料取消成功！";

		} else {
			message = "确定将勾选的材料设置为价格行情吗？";
			pMaterialStatus = 1;
			returnMsg = "行情材料设置成功！";
		}
		Ext.MessageBox.confirm("确认操作", message, function(o) {
			if (o == "yes") {
				var loadMarsk = new Ext.LoadMask(document.body, {
					msg : '正在处理中.....!',
					disabled : false,
					store : store
				});
				loadMarsk.show();
				var store = Ext.lib.Ajax.request("post",
						'/material/MaterialServlet.do?type=8', {
							success : function(response) {
								var jsondata = eval("(" + response.responseText
										+ ")");
								if (getState(jsondata.state, commonResultFunc,
										jsondata.result)) {
									loadMarsk.hide();
									Info_Tip(returnMsg);
									ds.reload();
								}else{
									loadMarsk.hide();
								}
							},
							failure : function() {
								loadMarsk.hide();
								Warn_Tip();
							}
						}, "id=" + ids.toString() + "&pMaterialStatus="
								+ pMaterialStatus);
			}
		});

	} else {
		alert("请选择一种状态的参考材价！");
		return;
	}

}

/**
 * 设置城市圈
 */
function setCityCircle() {
	window.parent.createNewWidget("cityRing_list", '设置城市圈',
			'/module/mat/cityRing_list.jsp');
}

function showMsg(msg){
//	alert(msg);
	Ext.MessageBox.alert("提示",msg);
}

/**
 * 导出全部参考材价
 */
function exportReferenceMaterialPrice() {
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份再进行导出！");
		return false;
	}
	var rows = grid.getSelectionModel().getSelections();
	var bianmas = [];
	for ( var i = 0; i < rows.length; i++) {
		var bianma = rows[i].get("bianma");
		var isDeleted = rows[i].get("isDeleted");
		if ("1" == isDeleted) continue;
		if (bianma == null || "" == bianma) continue;
		bianmas.push(bianma);
	}
	
	if (rows.length > 0 && bianmas.length == 0){
		Ext.MessageBox.alert("提示", "参考材价编码为空的无法导出报价！");
		return false;
	}
	
	var param = "";
	var cid = ds.baseParams["cid"];
	if (cid != null && "" != cid) {
		param += "&cid=" + cid;
	}
	if (bianmas.length > 0){
		param += "&bianmas=" + bianmas.toString();
	}
	$("#content").val("province~" + province);
	window.document.exportform.action = "/material/MaterialServlet.do?type=9"
		+ param;
	window.document.exportform.submit();
	
}

/**
 * 导出已经设置为价格行情材料
 */
function exportisPriceMaterialReferenceMaterialPrice() {
	var cityCircleId = ds.baseParams["cityCircleId"];
	if (cityCircleId == null || "" == cityCircleId) {
		Ext.MessageBox.alert("提示", "请选择一个城市圈再进行导出！");
		return false;
	}
	var param = "cityCircleId=" + cityCircleId;
	window.document.exportform.action = "/material/MaterialServlet.do?type=15&"
		+ param;
	window.document.exportform.submit();
}

/**
 * 导入
 */
function importReferenceMaterialPrice(isPrice) {
	/*var cityCircleId = ds.baseParams["cityCircleId"];
	if (cityCircleId == null || "" == cityCircleId) {
		Ext.MessageBox.alert("提示", "请选择一个城市圈再进行导入！");
		return false;
	}*/
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [ {
				// columnWidth : 0.5,
				layout : 'form',
				bodyStyle : 'border:none;',
				items : /*{
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				}*/[{
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				},
				{
					columnWidth : 0.5,
					layout : 'form',
					bodyStyle : 'border:none;',
					items : {
						bodyStyle : 'border:none;',
						html : "<a href='" + FileSite + "/doc/refMatPrice.xls"
								+ "' >标准文档下载</a>"
					}
				} ]
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入参考价材料',
		closeable : true,
		width : 400,
		height : 120,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : function() {
				uploadFile(isPrice);
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

function uploadFile(isPrice) {
	if (upload_form.getForm().isValid()) {
		upload_form
				.getForm()
				.submit(
						{
							url : '/material/MaterialServlet.do?type=10&isPrice='
									+ isPrice
									+ '&cityCircleId='
									+ ds.baseParams["cityCircleId"],
							waitMsg : '上传文件中...',
							success : function(upload_form, o) {
								var returnInfo = o.result;
								if (getState(returnInfo.state,
										commonResultFunc, returnInfo.result)) {
									//Info_Tip("导入参考价材料信息成功,已同步更新参考价材料信息和供应商材料信息！");
									Info_Tip("导入报价成功！");

									win.close();
									ds.reload();
								} else {
									Ext.MessageBox.hide();
									win.close();
									var exceptionMsg = new Ext.form.FormPanel(
											{
												layout : 'form',
												bodyStyle : 'border:none;background-color:min-height:400px;',
												fileUpload : true,
												labelWidth : 60,
												buttonAlign : 'right',
												items : [ {
													xtype : 'textarea',
													// fieldLabel : "上传文件",
													width : 380,
													value : returnInfo.result,
													style : "min-height:300px;",
													allowBlank : false,
													autoHeight : true
												} ],
												buttons : [ {
													text : '确定',
													handler : function() {
														win1.close();
													}
												} ]
											});
									var win1 = new Ext.Window({
										title : '错误提示',
										closeAction : "close",
										width : 500,
										autoHeight : true,
										bodyStyle : 'padding:6px',
										draggable : true,
										modal : true,
										items : [ exceptionMsg ]
									});
									win1.show();
								}
							},
							failure : function() {
							}
						});
	} else
		Info_Tip("请正确填写信息。");
}

/**
 * 设置调差系数
 * @returns {Boolean}
 */
function setDiffRatio(){
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份再进行调差系数设置！");
		return false;
	}
	//showSettingDiffRatio(province);
	map = new Map();
	settingDiffRatio(province);
}

/**
 * 设置调差系数
 * @returns {Boolean}
 */
function settingDiffRatio(province){
	var fieldArr = [ "id", "province", "cid", "content"]; 
	for (var i = 0,j = currProCityList.length; i < j; i ++){
		var cityRing = currProCityList[i];
		var cityId = cityRing["id"];
		fieldArr.push(cityId);
	}
	
	var setting_store = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/material/MaterialServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, fieldArr),
		baseParams : {
			type : 40,
			page : 1,
			//pageSize : 20,
			pageSize : 100,
			content : "province~" + province
		},
		countUrl : '/material/MaterialServlet.do',
		countParams : {
			type : 30
		},
		remoteSort : true
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	
	var pagetool = new Ext.ux.PagingToolbar({
		store : setting_store,
		displayInfo : true,
		pageSize : 20
	});
	
	var columnsItem = [ new Ext.grid.RowNumberer({
		width : 30
	}), {
		header : 'ID',
		sortable : false,
		dataIndex : 'id',
		hidden : true
	}, {
		width : 250,
		header : '材料分类',
		sortable : true,
		dataIndex : 'cid',
		renderer : function(value, meta, record) {
			var cid = record.get("cid");
			var cName = getStuffName(cid);
			if (cName == null) return cid;
			return cid + cName;
		}
	}];
	
	if (cityRingList != null){
		//for (var i = 0,j = cityRingList.length; i < j; i ++){
		for (var i = 0,j = currProCityList.length; i < j; i ++){
			var cityRing = currProCityList[i];
			var cityName = cityRing["name"];
			var cityId = cityRing["id"];
			columnsItem.push({
				width : 120,
				header : cityName,
				sortable : false,
				dataIndex : cityId,
				editor : {
					xtype : 'numberfield'
				}
			});
		}
	}
	
	var setting_grid = new Ext.grid.EditorGridPanel({
		id : "setting_grid",
		store : setting_store,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		//autoHeight : true,
		height : 550,
		autoScroll : true,
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		columns : columnsItem,
		listeners: {
			"beforeedit":function(e) {
				return true;
			},
			"validateedit":function(e) {
				if (e.value.length == 0 && !e.record.data[e.field]) {
					return false;
				}
				if (e.value.length == 0) {
					Info_Tip("调差系数不能为空！", function() {
						setting_grid.startEditing(e.row, e.column);
					});
					return false;
				}
				if (parseFloat(e.value) < 0.5 || parseFloat(e.value) > 1.5){
					Info_Tip("调差系数只能在0.50-1.50之间！", function() {
						setting_grid.startEditing(e.row, e.column);
					});
					return false;
				}
				return true;
			
			},
			"afteredit":function(e) {
				var record = e.record;
				var upContent = "";
				for (var i = 0,j = currProCityList.length; i < j; i ++){
					var cityRing = currProCityList[i];
					var cityId = cityRing["id"];
					if (e.field == cityId) continue;
					
					var ratio = record.get(cityId);
					upContent += cityId + ":" + parseFloat(ratio).toFixed(2) + ";";
				}
			    upContent += e.field + ":" + parseFloat(e.value).toFixed(2);
				var key = e.record.id;
				var value = upContent;
				map.put(key, value);
			}
        },
		bbar : pagetool
	});
	
	var setting_win = new Ext.Window({
		title : '设置调差系数-' + province,
		closeAction : "close",
		y : "0",
		width : 680,
		autoWidth : false,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ setting_grid ],
		buttons : [ {
			text : '保存',
			hidden:compareAuth('REFERENCEMATERIALPRICE_SET_DIFFRATIO'),
			handler : function() {
				updateDiffRatio(setting_win,setting_store);
			}
		} ]
	});
	setting_win.show();
	setting_store.load();
}

/**
 * 设置调差系数
 * @returns {Boolean}
 */
function showSettingDiffRatio(province){
	/*var data = {};
	data["type"] = "1";
	data["content"] = "province~" + province;
	$.ajax({
		type : 'POST',
		url : '/cityRingServlet',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			cityRingList = data.result;
		}
	});*/
	var fieldArr = [ "id", "province", "cid", "content", "createOn", "createBy"]; 
	for (var i = 0,j = currProCityList.length; i < j; i ++){
		var cityRing = currProCityList[i];
		var cityId = cityRing["id"];
		fieldArr.push(cityId);
	}
	
	var setting_store = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/material/MaterialServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, fieldArr),
		baseParams : {
			type : 29,
			page : 1,
			pageSize : 20,
			content : "province~" + province
		},
		countUrl : '/material/MaterialServlet.do',
		countParams : {
			type : 30
		},
		remoteSort : true
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	
	var pagetool = new Ext.ux.PagingToolbar({
		store : setting_store,
		displayInfo : true,
		pageSize : 20
	});
	
	var columnsItem = [ new Ext.grid.RowNumberer({
		width : 30
	}), {
		header : 'ID',
		sortable : false,
		dataIndex : 'id',
		hidden : true
	}, {
		width : 250,
		header : '材料分类',
		sortable : true,
		dataIndex : 'cid',
		renderer : function(value, meta, record) {
			var cid = record.get("cid");
			var cName = getStuffName(cid);
			if (cName == null) return cid;
			return cid + cName;
		}
	}];
	
	if (cityRingList != null){
		//for (var i = 0,j = cityRingList.length; i < j; i ++){
		for (var i = 0,j = currProCityList.length; i < j; i ++){
			var cityRing = currProCityList[i];
			var cityName = cityRing["name"];
			var cityId = cityRing["id"];
			columnsItem.push({
				width : 120,
				header : cityName,
				sortable : false,
				dataIndex : cityId,//改行请勿轻易改动，否则会造成数据错乱
				renderer : function(value, meta, record) {
					//var cid = record.get("cid");
					var content = record.get("content");
					if (content == null) return "0.00";
					var contentArr = content.split(";");
					for (var m = 0, n = contentArr.length; m < n; m ++){
						var cityContent = contentArr[m];
						var currCityId = cityContent.split(":")[0];
						if (this.dataIndex == currCityId){
							var cityRatio = parseFloat(cityContent.split(":")[1]);
							return cityRatio.toFixed(2);
						}
					}
					return "0.00";
			},editor : {
				xtype : 'numberfield'
			}
			});
		}
	}
	
	var setting_grid = new Ext.grid.EditorGridPanel({
		id : "setting_grid",
		store : setting_store,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoHeight : true,
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		columns : columnsItem,
		listeners: {
			"beforeedit":function(e) {
				e.value = "11111";
				return true;
			},
			"validateedit":function(e) {
				if (e.value.length == 0 && !e.record.data[e.field]) {
					return false;
				}
				if (e.value.length == 0) {
					Info_Tip("调差系数不能为空！", function() {
						setting_grid.startEditing(e.row, e.column);
					});
					return false;
				}
				if (parseFloat(e.value) < 0.5 || parseFloat(e.value) > 1.5){
					Info_Tip("调差系数只能在0.50-1.50之间！", function() {
						setting_grid.startEditing(e.row, e.column);
					});
					return false;
				}
				return true;
			
			},
			"afteredit":function(e) {
				var row = setting_grid.getSelectionModel().getSelected();
			    var currContent = row.data["content"];
			    var upContent = "";
			    if (currContent != null && "" != currContent){
			    	var contentArr = currContent.split(";");
			    	for (var k = 0, l = contentArr.length; k < l; k ++){
			    		var contentVal = contentArr[k];
			    		if (contentVal != null && "" != contentVal){
			    			var contentValArr = contentVal.split(":");
			    			var currCityId = contentValArr[0];
			    			var currCityRatio = parseFloat(contentValArr[1]).toFixed(2);
			    			if (currCityId != e.field){
			    				upContent += currCityId + ":" + currCityRatio + ";";
			    			}
			    		}
			    	}
			    }
			    upContent += e.field + ":" + parseFloat(e.value).toFixed(2);
			    row.data["content"] = upContent;
				var key = e.record.id;
				var value = upContent;
				map.put(key, value);
				console.log(e);
				setting_grid.view.refresh();
			}
        },
		bbar : pagetool
	});
	
	var setting_win = new Ext.Window({
		title : '设置调差系数-' + province,
		closeAction : "close",
		y : "0",
		width : 680,
		autoWidth : false,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ setting_grid ],
		buttons : [ {
			text : '保存',
			hidden:compareAuth('REFERENCEMATERIALPRICE_SET_DIFFRATIO'),
			handler : function() {
				updateDiffRatio(setting_win,setting_store);
			}
		} ]
	});
	setting_win.show();
	setting_store.load();
	
	
	/*setting_grid.on('beforeedit', function(e) {
		if (!compareAuth('FAC_MOD')) {
			return true;
		} else {
			return false;
		}
	});
	
	setting_grid.on("validateedit", function(e) {
		if (e.value.length == 0 && !e.record.data[e.field]) {
			return false;
		}
		if (e.value.length == 0) {
			Info_Tip("调差系数不能为空！", function() {
				setting_grid.startEditing(e.row, e.column);
			});
			return false;
		}
		if (parseFloat(e.value) < 0.5 || parseFloat(e.value) > 1.5){
			Info_Tip("调差系数只能在0.50-1.50之间！", function() {
				setting_grid.startEditing(e.row, e.column);
			});
			return false;
		}
		return true;
	});
	
	//单元格编辑之后保存
	setting_grid.on("afteredit", function(e) {
		if (compareAuth('VIP_OFFLINE_ASKPRICE_DEL')) {
			return;
		}
		//editChange( + ":" + e.field + ":" + editVal);
	    var row = setting_grid.getSelectionModel().getSelected();
	    var currContent = row.data["content"];
	    var upContent = "";
	    if (currContent != null && "" != currContent){
	    	var contentArr = currContent.split(";");
	    	for (var k = 0, l = contentArr.length; k < l; k ++){
	    		var contentVal = contentArr[k];
	    		if (contentVal != null && "" != contentVal){
	    			var contentValArr = contentVal.split(":");
	    			var currCityId = contentValArr[0];
	    			var currCityRatio = parseFloat(contentValArr[1]).toFixed(2);
	    			if (currCityId != e.field){
	    				upContent += currCityId + ":" + currCityRatio + ";";
	    			}
	    		}
	    	}
	    }
	    upContent += e.field + ":" + parseFloat(e.value).toFixed(2);
	    row.data["content"] = upContent;
		var key = e.record.id;
		var value = upContent;
		map.put(key, value);
		console.log(e);
		setting_grid.view.refresh(); 
	});*/
}

/**
 * 保存调差系数结果
 */
function updateDiffRatio(setting_win,setting_store){
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份再进行调差系数设置！");
		return false;
	}
	var changeContent = "";
	for (var i = 0, j = map.elements.length; i < j; i ++) {
		var key = map.elements[i].key;
		var value = map.elements[i].value;
		changeContent += key + "-" + value + "~";
	}
	if (changeContent == null || changeContent == ""){
		Ext.MessageBox.alert("提示", "调差系数无变化，无需保存！");
		return false;
	}
	if (changeContent.lastIndexOf("~") != -1){
		changeContent = changeContent.substring(0,changeContent.lastIndexOf("~"));
	}
	var data = {};
	data["type"] = "31";
	data["changeContent"] = changeContent;
	data["province"] = province;
	loadMarsk = new Ext.LoadMask("setting_grid", {
    	msg : "正在设置调差系数中...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url:'/material/MaterialServlet.do',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				map = null;
				loadMarsk.hide();
				loadStore = null;
				loadData(province);
				loadCurrProCityList(province);
				reBindGridData();
				Ext.MessageBox.alert("提示", "调差系数修改成功,如需查看最新参考价格，请重新打开参考材价库页面,前台造价通参考价需要手动测算之后才能同步显示！",function(){
					//setting_store.load();
					//reBindGridData();
					//reload();
					setting_win.close();
				});
			}else{
				loadMarsk.hide();
			}
		},
		failure : function(response) {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

/**
 * 测算
 */
function calcRefMatPrice(){
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份再进行测算！");
		return false;
	}
	var rows = grid.getSelectionModel().getSelections();
	var bianmas = [];//参考材料编码:二级分类编码
	var cHisRatios = []; 
	for ( var i = 0; i < rows.length; i++) {
		var bianma = rows[i].get("bianma");
		var subcid = rows[i].get("subCid");
		if (subcid == null || "" == subcid) continue;
		var currHisRatios = rows[i].get("cHisRatios") == null ? "" : rows[i].get("cHisRatios");
		var lastPrice = rows[i].get("lastPrice") == null ? "" : rows[i].get("lastPrice");
		var isDeleted = rows[i].get("isDeleted");
		if ("1" == isDeleted) continue;
		if (bianma == null || "" == bianma) continue;
		
		bianmas.push(bianma + ":" + subcid + ":" + lastPrice);
		cHisRatios.push(bianma + "~" + currHisRatios);
	}
	
	if (rows.length > 0 && bianmas.length == 0){
		Ext.MessageBox.alert("提示", "请选择有效的参考材价进行测算！");
		return false;
	}
	
	var cid = ds.baseParams["cid"];
	
	var data = {};
	data["type"] = "32";
	data["province"] = province;
	if (bianmas.length > 0){
		data["bianmas"] = bianmas.toString();
	}
	if (cHisRatios.length > 0){
		data["cHisRatios"] = cHisRatios.toString();
	}
	if (cid != null && "" != cid){
		data["cid"] = cid;
	}
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在测算参考材价...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url:'/material/MaterialServlet.do',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				loadMarsk.hide();
				loadStore = null;
				Ext.MessageBox.alert("提示", "测算完成！",reload);
			}else{
				loadMarsk.hide();
			}
		},
		failure : function(response) {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

/**
 * 设置取消推荐（最多设置6条）
 * @returns {Boolean}
 */
function setTop(){
	if(!checkSelected()){
		Ext.MessageBox
		.alert(
				"提示",
				"请勾选一条参考材价!");
		return false;
	}
	var province = ds.baseParams["province"];
	var row = grid.getSelectionModel().getSelected();
	var id = row.get("id");
	var isTop = row.get("isTop");
	if ("0" == isTop){
		if (province == null || "" == province) {
			Ext.MessageBox.alert("提示", "请选择一个省份再进行推荐！");
			return false;
		}
		var price = row.get("price");
		var subcid = row.get("subCid");
		if (price == null || "" == price || parseFloat(price) == 0 || "1" == row.get("isDeleted")
				|| subcid == null || "" == subcid){
			Ext.MessageBox.alert("提示", "请选择一条有效参考材价进行推荐！");
			return false;
		}
	}
	var topFlag = "1"; //1推荐
	var msgTips = "是否设置推荐？";
	var sucMsg = "已成功推荐该参考材价！";
	if ("1" == isTop){
		msgTips = "是否取消推荐？";
		topFlag = "0";
		sucMsg = "该条参考材价成功取消推荐！";
	}
	Ext.MessageBox
	.show({
		title : '提示',
		msg : msgTips,
		prompt : false,
		buttons : {
			"ok" : "是",
			"cancel" : "否"
		},
		multiline : false,
		fn : function(
				btn,
				text){
			if ("ok" == btn){
				submitTop(id, topFlag, sucMsg);
			}
		}}
	);
}

/**
 * 设置/取消推荐
 * @param id
 * @param isTop
 */
function submitTop(id, isTop, sucMsg){
	var data = {};
	data["type"] = "33";
	data["id"] = id;
	data["content"] = "isTop~" + isTop;
	data["topFlag"] = "1"; //设置推荐标识，后台根据该标识判断当前省份设置的推荐总条数，每个省份推荐数不能超过6条
	data["province"] = ds.baseParams["province"];
	var tipMsg = "正在设置推荐中...";
	if ("0" == isTop){
		tipMsg = "正在取消推荐中...";
	}
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : tipMsg,
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
		params : data,
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				loadMarsk.hide();
				loadStore = null;
				Ext.MessageBox
				.alert(
						"提示",
						sucMsg,reload);
			}else{
				loadMarsk.hide();
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}

	});
}

//发布参考材价
function release() {
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	var panel = new Ext.Panel({
		layout : "form",
		bodyStyle : 'border:none;padding:6px;',
		items : [{
						layout : 'table',
						bodyStyle : 'border:none',
						layoutConfig : {
							columns : 5
						 },
						 autoWidth : true,
						 autoHeight : true,
						items : [{width : 40,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;;font-size:12px",
							items : [{
								
								xtype : 'label',
								width : 40,
							    text:'标题:'
							}]}, {
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [{
								id : "year_input",
								xtype : 'combo',
								width : 85,
								mode : "local",
								triggerAction : "all",
								allowBlank : false,
								store : year_array,
								editable : false,
								value : new Date().getFullYear()
							}]
						},  {
							width : 15,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [{
								xtype:'label',
								text:'年'
							}]
						},  {
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [ {
								id : 'month_input',
								width : 85,
								xtype : 'combo',
								mode : "local",
								allowBlank : false,
								triggerAction : "all",
								store : month_array,
								editable : false,
								value :new Date().getMonth()+1
							     
							}]
						},  {
							width : 60,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [{
								xtype:'label',
								text:'月参考价'
							}]
						
					}]
		},{
			layout : 'column',
			bodyStyle : 'border:none;margin-top:10px;',
			autoWidth : true,
			autoHeight : true,
		    items:[{
					width : 40,
					autoHeight : true,
					height:20,
					bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
					items : [{
						xtype:'label',
						text:'备注：'
					}]
				
			},{
				width : 400,
				autoHeight : true,
				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
				items : [{
					 xtype : 'textarea',
			            id : 'desc',
			            width:350,
			            height:100
				}]
			
		}]
		}]
	});

	win = new Ext.Window({
				title : '发布',
				width :500,
				draggable : true,
				modal : true,
				autoHeight : true,
				autoScroll : true,
				items : [panel],
				buttons : [{
							text : '确定',
							handler : save
						}, {
							text : '取消',
							style:"margin-right:160px;",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
}


//保存信息
function save(){
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	var year = Ext.getCmp("year_input").getValue();
	if(year == null && year ==""){
		alert("年份不能为空");
		return;
	}
	var month = Ext.getCmp("month_input").getValue();
	if(month == null && month ==""){
		alert("月份不能为空");
		return;
	}
	var issueDate=year+"-"+"0"+month+"-05";
	var notes = Ext.getCmp("desc").getValue();
	Ext.Ajax.request({
			url : '/material/MaterialServlet.do',
			method:'POST',
		params:{
		type:46,
		title:year+"年"+month+"月份参考价",
		province:province,
		issueDate:issueDate,
		notes:notes
	},
	success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				if ("1" == json.result){ //覆盖
					Ext.MessageBox
							.show({
								title : '发布',
								msg : "当前存在此批次参考价！是否确认则覆盖此批次参考价？",
								width : 250,
								prompt : false,
								buttons : {
									"ok" : "确定",
									"cancel" : "取消"
								},
								multiline : false,
								fn : function(
										btn,
										text) {
									if ("ok" == btn) {
										submitToPublish(year,month,province,issueDate,notes,"1");
									}
								}
						});
				}else{ //新发布
					submitToPublish(year,month,province,issueDate,notes,"1");
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

/**
 * 确认发布
 */
function submitToPublish(year, month, province, issueDate, notes, submitFlag){
	win.close();
	var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '正在发布中.....!',
	        disabled : false,
	        store : store
	      });
	  loadMarsk.show();
	var store=Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
	method:'POST',
	params:{
		type:46,
		title:year+"年"+month+"月份参考价",
		province:province,
		issueDate:issueDate,
		notes:notes,
		submitFlag : submitFlag
	},
	success:function(response){
		var json = eval("(" + response.responseText + ")");
		if (getState(json.state, commonResultFunc, json.result)) {
			loadMarsk.hide();
			store = null;
			Info_Tip("发布成功。");
			ds.baseParams["province"] = province;
				ds.load();
			}else{
				loadMarsk.hide();
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

/**
 * 发布管理
 */
function releaseManage(){
	window.parent.createNewWidget("reference_price_manage", '发布价管理',
			'/module/mat/reference_price_manage.jsp');
}

function checkSelected(){
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length != 1){
		return false;
	}
	return true;
}

/**
 * 重新加载
 */
function reload(){
	ds.load();
}

function buildView() {
	var view = new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [ {
			region : 'west',
			width : 200,
			split : true,
			autoScroll : true,
			items : tree
		}, {
			region : 'center',
			items : grid
		} ]
	});
};

