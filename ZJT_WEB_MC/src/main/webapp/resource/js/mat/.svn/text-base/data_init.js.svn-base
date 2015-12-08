var grid_info, ds_info;

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();
};

// 右键菜单
var tbar = [{
			text : '初始化城市圈省份',
			icon : "/resource/images/edit.gif",
			handler : function(){
				initData("crPro");
			}
		}, {
			text : '初始化参考材价库省份',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				initData("rmPro");
			}
		}, {
			text : '初始化参考材价库基础编码(禁用)',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				Ext.Msg.alert("提示", "亲, 暂时禁用哦~");
				return false;
				initData("rmCode");
			}
		}, {
			text : '初始化供应商材料基础编码',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				initData("fmCode");
			}
		}, {
			text : '初始化历史参考材价库基础编码',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				initData("hisCode");
			}
		}, {
			text : '初始化调差系数',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				initData("diffRatio");
			}
		}, {
			text : '初始化造价通参考价编码(禁用)',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				Ext.Msg.alert("提示", "亲, 暂时禁用哦~");
				return false;
				initData("zjtRefPrice");
			}
		},{
			text : '初始化造价通参考价城市圈ID',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				initData("zjtPriceCity");
			}
		}, {
			text : '历史参考价旧数据迁移',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				initData("moveHisMatPirce");
			}
		}, {
			text : '一键初始化(不支持)',
			icon : '/resource/images/edit.gif', 
			handler : function(){
				Ext.Msg.alert("提示", "亲, 暂时不支持哦~");
				return false;
				//initData(null,true);
			}
		}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ask/AskPriceServlet.do?type=35'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"eid"},{name:"memberID"},{name:"memberType"},{name:"degree"},{name:"trueName"},{name:"corpName"},{name:"createOn"},{name:"validDate"},{name:"province"},{name:"city"},{name:"loginNum"},{name:"lastTime"},{name:"webProvince"},{name:"webArea"},{name:"score",type:'int'},{name:"ipAddr"},{name:"askTotal",type:'int'},{name:"inquiryNum",type:'int'},{name:"status",type:'int'},{name:"surplusINum",type:'int'},{name:"currScore",type:'int'},{name:"useScore",type:'int'},{name:"role",type:'int'},{name:"updateOn"},{name:"nickName"}]	
						}),
				baseParams : {
					type : 35,
					pageNo : 1,
					validDate : 0,
					memberType : 0,
					pageSize : 20
				},
				countUrl : '/ask/AskPriceServlet.do',
				countParams : {
					type : 36,
					role : 1
				},
				remoteSort : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});

	grid_info = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : 'eid',
							sortable : false,
							dataIndex : 'EID',
							hidden : true
						},{
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						},{
							header : '会员昵称',
							sortable : true,
							dataIndex : 'nickName'
						}, {
							header : '公司名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '所属城市',
							sortable : true,
							renderer:function(value,meta,record){
								var province = record.get("province");
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + " " + city;
							}
						},{
							header : "设置日期",
							sortable : true,
							dataIndex : "updateOn"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
			
	//ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

};

var loadMarsk,loadStore;
function initData(flag,autoFlag){
	if ("crPro" == flag){
		initCrPro(autoFlag);
	}else if ("rmPro" == flag){
		initRmPro(autoFlag);
	}else if ("rmCode" == flag){
		initRmCode(autoFlag);
	}else if ("fmCode" == flag){
		initFmCode(autoFlag);
	}else if ("hisCode" == flag){
		initHisCode(autoFlag);
	}else if ("diffRatio" == flag){
		initDiffRatio(autoFlag);
	}else if ("zjtRefPrice" == flag){
		initZjtRefPrice(autoFlag);
	}else if ("zjtPriceCity" == flag){
		initZjtPriceCity(autoFlag);
	}else if ("moveHisMatPirce" == flag){
		moveHisMatPirce(autoFlag);
	}
}

function initCrPro(autoFlag){
	var msg = "正在初始化城市圈省份.....!";
	if (autoFlag){
		msg = "第一步，正在初始化城市圈省份.....!";
	}
	loadStore = sendData("crPro","rmPro",autoFlag,msg);
}

function initRmPro(autoFlag){
	var msg = "正在初始化参考材价库省份.....!";
	if (autoFlag){
		msg = "第二步，正在初始化参考材价库省份.....!";
	}
	loadStore = sendData("rmPro","rmCode",autoFlag,msg);
}

function initRmCode(autoFlag){
	var msg = "正在初始化参考材价库基础编码.....!";
	if (autoFlag){
		msg = "第三步，正在初始化参考材价库基础编码.....!";
	}
	loadStore = sendData("rmCode","fmCode",autoFlag,msg);
}

function initFmCode(autoFlag){
	var msg = "正在初始化供应商材料基础编码.....!";
	if (autoFlag){
		msg = "第四步，正在初始化供应商材料基础编码.....!";
	}
	loadStore = sendData("fmCode","hisCode",autoFlag,msg);
}

function initHisCode(autoFlag){
	var msg = "正在初始化历史参考材价库基础编码.....!";
	if (autoFlag){
		msg = "第五步，正在初始化历史参考材价库基础编码.....!";
	}
	loadStore = sendData("hisCode","diffRatio",autoFlag,msg);
}

function initDiffRatio(autoFlag){
	var msg = "正在初始化调差系数.....!";
	if (autoFlag){
		msg = "第六步，正在初始化调差系数.....!";
	}
	loadStore = sendData("diffRatio","zjtRefPrice",autoFlag,msg);
} 

function initZjtRefPrice(autoFlag){
	var msg = "正在初始化造价通参考价编码.....!";
	if (autoFlag){
		msg = "第七步，正在初始化造价通参考价编码.....!";
	}
	loadStore = sendData("zjtRefPrice","zjtPriceCity",autoFlag,msg);
} 

function initZjtPriceCity(autoFlag){
	var msg = "正在初始化造价通参考价城市圈ID.....!";
	if (autoFlag){
		msg = "第八步，正在初始化造价通参考价城市圈ID.....!";
	}
	loadStore = sendData("zjtPriceCity","moveHisMatPirce",autoFlag,msg);
}

function moveHisMatPirce(autoFlag){
	var msg = "正在迁移历史参考价旧数据.....!";
	if (autoFlag){
		msg = "第九步，正在迁移历史参考价旧数据.....!";
	}
	loadStore = sendData("moveHisMatPirce","over",autoFlag,msg);
} 

function sendData(flag,nextFlag,autoFlag,msg){
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : msg,
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.lib.Ajax.request("post", '/material/MaterialServlet.do?type=28', {
		success : function(response) {
			var jsondata = eval("("
					+ response.responseText + ")");
			if (getState(jsondata.state,
					commonResultFunc, jsondata.result)) {
				loadMarsk.hide();
				if (autoFlag){
					if ("rmPro" == nextFlag){
						initRmPro(true);
					}else if ("rmCode" == nextFlag){
						initRmCode(true);
					}else if ("fmCode" == nextFlag){
						initFmCode(true);
					}else if ("hisCode" == nextFlag){
						initHisCode(true);
					}else if ("diffRatio" == nextFlag){
						initDiffRatio(true);
					}else if ("zjtRefPrice" == nextFlag){
						initZjtRefPrice(true);
					}else if ("zjtPriceCity" == nextFlag){
						initZjtPriceCity(true);
					}else if ("moveHisMatPirce" == nextFlag){
						moveHisMatPirce(true);
					}else if ("over" == nextFlag){
						Ext.Msg.alert("提示", "数据初始化已全部完成！");
					}
				}else{
					Ext.Msg.alert("提示", "数据初始化已完成！");
				}
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}
	}, "flag=" + flag);
}
