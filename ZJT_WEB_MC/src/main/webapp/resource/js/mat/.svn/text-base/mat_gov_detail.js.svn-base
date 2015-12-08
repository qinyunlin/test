Ext.onReady(init);
var tid, grid, ds, win, title, issueDate, province, city, town, addr;

var subcidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : []
});

function init() {
	tid = getCurArgs("tid");
	title = getCurArgs("title");
	issueDate = getCurArgs("date");
	province = getCurArgs("province");
	city = getCurArgs("city");
	town = getCurArgs("town");
	addr = getCurArgs("addr");
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '双击信息可以编辑列表信息。');
	buildGrid();
};
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/AdvSearchMaterialForBaselib'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "issueDate", "priceM", "priceShow",
								"spec", "unit", "code10", "brand", "code",
								"notes","isGov","nid","cid","subcid"]),
				baseParams : {
					// diff : "issuedate~" + issueDate + "~~DIFF_AMOUNT",
					province : province,
					type : "gov_ex",
					page : 1,
					pageSize : 30,
					content : "isGov~1;addr~" + addr + ";issuedate~" + issueDate
				},
				countUrl : '/CountMaterialForBaselib',
				countParams : {
					types : 4
				},
				remoteSort : true,
				timeout:2*60*1000
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});

	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '期刊编码',
							sortable : false,
							dataIndex : 'code',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '2010国标编码',
							sortable : false,
							dataIndex : 'code10',
							editor : {
								xtype : 'textfield'
							}
						},{
							header : '本地分类编码',
							sortable : false,
							dataIndex : 'nid',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '国标二级分类编码',
							sortable : true,
							dataIndex : 'subcid',
							renderer : function(v) {
								if (!v) {
									return "";
								}
								var subCidName = getSubCidNameBySubcid(v, true);
								if (subCidName) {
									return subCidName;
								}
								return v;
							},
							editor : {
								xtype : 'combo',
								mode : 'local',
								store : '',
								editable : false,
								triggerAction : 'all',
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						},
						{
							header : '名称',
							sortable : false,
							dataIndex : 'name',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '型号',
							sortable : false,
							dataIndex : 'spec',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '单位',
							sortable : false,
							dataIndex : 'unit',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '品牌',
							sortable : false,
							dataIndex : 'brand',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '中价',
							sortable : false,
							dataIndex : 'priceM',
							editor : {
								xtype : 'numberfield'
							}
						}, {
							header : '价格显示',
							sortable : false,
							dataIndex : 'priceShow',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '发布时间',
							sortable : false,
							dataIndex : 'issueDate',
							renderer : trimDate
							
						}, {
							header : '备注',
							sortable : false,
							dataIndex : 'notes',
							editor : {
								xtype : 'textfield'
							}
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : 'grid',
				tbar : [{
					text : "下载信息价",
					hidden : compareAuth("GOV_DOWNLOAD"),
					handler : downExcel_submit,
					icon : "/resource/images/page_excel.png"
				},{
					text : "删除信息价",
					hidden : compareAuth('GOV_DEL'),
					handler : delGov,
					icon : "/resource/images/delete.gif"
				},{
					text : "更新分类统计数",
					handler : updateTypeCount,
					icon : "/resource/images/ruby_gear.png"
				},{
					text : "编制说明",
					hidden : compareAuth("GOV_REMARK"),
					handler : updateRemark,
					icon : "/resource/images/edit.gif"
				}]
			});
	// ds.on('update', function(thisds, record) {
	// saveInfo_list(record.get('id'), record.data);
	//
	// }, ds);

		
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
			style : 'line-height:22px;',
			xtype : "label",
			html : "<font color='red'><B>" + title + "</B></font>&nbsp;&nbsp;&nbsp;材料名称："
		}, {
			xtype : 'textfield',
			id : 'macName',
			width : 100
		}, {
			text : "查询",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		}]
	});
	
	// search
	function searchlist() {
		var name = Ext.fly("macName").getValue();
		ds.baseParams["province"] = province;
		ds.baseParams["type"] = "gov_ex";
		ds.baseParams["content"] = "isGov~1;addr~" + addr + ";issuedate~" + issueDate +";name~" + name;
		ds.load();
	};
	
	
	
	grid.on('beforeedit', function(e){
		if(!compareAuth('GOV_MOD')){
			if (e.field == 'subcid') {
				var ed = this.colModel.getCellEditor(e.column, e.row);
				ed.field.store = subcidStore;
				subcidStore.loadData(getSubCidNameArrayBySubcid(e.value));
			}
			return true;
		}else
			return false;
	});
	grid.on("validateedit", function(e) {
//				if (compareAuth('GOV_MOD')) {
//					Info_Tip("您没有权限进行此操作。");
//					grid.stopEditing();
//					ds.reload();
//					return;
//				}
				grid.stopEditing();
				if (e.value.length == 0 && !e.record.data[e.field]) {
					return false;
				}
				switch (e.field) {
					case 'code' :
					case 'code10' :
						if (e.value.gblen() > 50) {
							Ext.Msg.alert("提示", "编码长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'name' :
						if (e.value.length == 0) {
							Ext.Msg.alert("提示", "名称不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						} else if (e.value.length > 50) {
							Ext.Msg.alert("提示", "名称长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'spec' :
						if (e.value.length == 0) {
							Ext.Msg.alert("提示", "型号不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (e.value.gblen() > 100) {
							Ext.Msg.alert("提示", "型号长度不能大于100。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'unit' :
						if (e.value.length == 0) {
							Ext.Msg.alert("提示", "单位不能空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (e.value.gblen() > 50) {
							Ext.Msg.alert("提示", "单位长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'brand' :
						if (e.value.gblen() > 50) {
							Ext.Msg.alert("提示", "品牌长度不能大于50。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'priceShow' :
						if (e.value.gblen() > 100) {
							Ext.Msg.alert("提示", "价格显示长度不能大于100。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'notes' :
						if (e.value.gblen() > 500) {
							Ext.Msg.alert("提示", "备注长度不能大于500。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case "cid":
						if(isNaN(e.value)){
							Ext.Msg.alert("提示","国家一级分类编码只能为数字。");
							return false;
						}
						break;
				}
			});

	grid.on("afteredit", function(e) {
				if (compareAuth('GOV_MOD'))
					return;
				saveInfo_list(e.record.id, e.record.data);
			});

	ds.load();
};

function changeNull(v) {
	if (Ext.isEmpty(v)) {
		return "";
	}
	return v;
}
// 保存修改
function saveInfo_list(thisid, data) {
	var subcid = data["subcid"];
	var cid = "";
	if(subcid && subcid.length == 4){
		cid = subcid.substring(0, 2);
	}
	
	var content = "code~" + changeNull(data["code"]) + ";code10~"
			+ changeNull(data["code10"]) + ";name~" + changeNull(data["name"])
			+ ";spec~" + changeNull(data["spec"]) + ";unit~"
			+ changeNull(data["unit"]) + ";brand~" + changeNull(data["brand"])
			+ ";priceM~" + changeNull(data["priceM"]) + ";priceShow~"
			+ changeNull(data["priceShow"]) + ";notes~"
			+ changeNull(data["notes"]) + ";isGov~" + changeNull(data["isGov"])+ ";cid~" + cid + ";subCid~"+changeNull(data["subcid"])+";nid~"+changeNull(data["nid"]);
	Ext.Ajax.request({
				url : '/GovMaterial.do',
				params : {
					id : thisid,
					tid : tid,
					title: title,
					content : content,
					type : 1,
					city : city,
					province : province,
					town : town,
					issueDate : issueDate
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {

						Info_Tip("修改材料成功。");
						ds.reload();

					}

				},
				failure : function() {
					Warn_Tip();
				}
			})
};

//down Excel /MaterialDownload.do
function downExcel_submit() {
	var up_fs = new Ext.FormPanel();
	var condition = "?type=gov";
	condition += "&province=" + encodeURI(encodeURI(province));
	condition += "&city=" + encodeURI(encodeURI(city));
	condition += "&town=" + encodeURI(encodeURI(town));
	condition += "&title=" + encodeURI(encodeURI(title));
	condition += "&issueDate=" + issueDate;
	condition += "&diff=issuedate~" + issueDate + "~" + issueDate
			+ "~DIFF_BETWEEN&content=isGov~1;addr~" + encodeURI(encodeURI(addr));
	document.uplogoform.action = '/MaterialDownload.do' + condition;
	document.uplogoform.submit();
};

var loadMarsk,loadStore;
//del op
function delGov() {
	Ext.Msg.confirm("提示", "您确定要删除该期\"" + title + "\"信息价?", function(op) {
		if (op == "yes") {
			loadMarsk = new Ext.LoadMask(document.body, {
		    	msg : "正在删除\"" + title + "\"信息价...",
		        disabled : false,
		        store : loadStore
		      });
			loadMarsk.show();
			loadStore = Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=15", {
						success : function(response) {
							var jsondata = eval("("
									+ response.responseText + ")");
							if (getState(jsondata.state,
									commonResultFunc, jsondata.result)) {
								
								var data={};
								data["town"]=town;
								data["issueDate"]=issueDate;
								$.ajax({
									type : 'POST',
									url : '/GovMatTitle.do?type=22',
									async : false,
									data : data,
									complete : function(response) {
										var data = eval("(" + response.responseText + ")");
										
									}
								});
								
								
								
								//Info_Tip("信息价删除成功。");
								 Ext.MessageBox.alert("提示", "信息价删除成功。",closeWin);
								 
								
							}
							loadMarsk.hide();
							loadStore = null;
						},
						failure : function() {
							loadMarsk.hide();
							loadStore = null;
							Warn_Tip();
						}
					}, "province=" + province + "&city=" + city + "&town=" + town + "&issueDate=" + issueDate);
		}
	});
};

//更新分类统计数
function updateTypeCount(){
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在更新分类统计数...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=19", {
        success: function(response){
        	loadMarsk.hide();
			loadStore = null;
            Info_Tip("更新分类统计数成功.");
        },
        failure: function(){
        	loadMarsk.hide();
			loadStore = null;
            Warn_Tip();
        }
    }, "province=" + province + "&city=" + city + "&town=" + town + "&issueDate=" + issueDate);
	
}

function closeWin(){
	if (window.parent.tab_0401_iframe){
		window.parent.tab_0401_iframe.ds.reload();
	}
	window.parent.Ext.getCmp('center').remove("mat_gov_detail");
}

/**
 * 编制说明
 * @returns {Boolean}
 */
function updateRemark(){
	var data = {};
	data["type"] = "20";
	data["province"] = province;
	data["city"] = city;
	data["town"] = town;
	data["issueDate"] = issueDate;
	$.ajax({
		type : 'POST',
		url : '/GovMatTitle.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			showRemark(data.result);
		}
	});
}

function showRemark(govTitle){
	var remark = "";
	if (govTitle != null){
		remark = govTitle["reMark"];
	}
	var view_win = new Ext.Window({
		title : '编制说明',
		closeAction : "close",
		y : "30",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [
		  {
			  html :"<textarea id='gov_title' rows='6' cols='80'>" + remark + "</textarea>"
		  }
		],
		buttons : [ {
			text : '保存',
			handler : function() {
				remark = $("#gov_title").val();
				Ext.Ajax.request({
					url:'/GovMatTitle.do?type=21&id=' + govTitle["id"] + "&remark=" + remark,
					method:'POST',
					success:function(o){
						var data = eval("(" + o.responseText + ")");
						if (getState(data.state, commonResultFunc,
								data.result)) {
							Ext.MessageBox.alert("提示", "编制说明保存成功！");
							view_win.close();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				});
			}
		},{
			text : '关闭',
			handler : function() {
				view_win.close();
			}
		} ]
	});
	view_win.show();
}