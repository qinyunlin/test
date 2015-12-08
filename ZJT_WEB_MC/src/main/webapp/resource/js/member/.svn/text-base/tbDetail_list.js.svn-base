var grid_info, ds_info, sel_combo, url="/mc/appMember.do";
var province_db = ["北京","天津","河北","黑龙江","江西","山东","湖北","湖南","广东","广西","重庆","四川","贵州","云南"];
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = ["全部城市"];

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();
	//统计列表中进入明细页面传参及查询处理
	/*var way=getCurArgs("way");
	var degree=getCurArgs("degree");
	var dateTime=getCurArgs("dateTime");
	var type=getCurArgs("type");
	if(way !=null && way !="" && way !="undefined"){
        if(way=="-2"){
        	Ext.getCmp("scoreDetail_type").setValue("2");	
        	Ext.getCmp('way_type').store.loadData(useWayTypeArr);
        }else if(way=="-3"){
        	Ext.getCmp("scoreDetail_type").setValue("1");	
           	Ext.getCmp('way_type').store.loadData(getWayTypeArr);
        }else if ("-4" == way){
        	var way="11,12,13,14";
        	Ext.getCmp("scoreDetail_type").setValue(2);	
        	Ext.getCmp('way_type').store.loadData(useWayTypeArr);
    		Ext.getCmp('way_type').enable();
    		Ext.getCmp("way_type").setValue(way);
        }else{
        	var getScoreWay="1,6,0,5,8,10,15,17,20";
    		if(getScoreWay.indexOf(way)>-1){
    			Ext.getCmp("scoreDetail_type").setValue(1);	
    			Ext.getCmp('way_type').store.loadData(getWayTypeArr);
    		}else{
    			Ext.getCmp("scoreDetail_type").setValue(2);	
    			Ext.getCmp('way_type').store.loadData(useWayTypeArr);
    		}
    		Ext.getCmp('way_type').setValue("全部途径");
    		Ext.getCmp('way_type').enable();
    		Ext.getCmp("way_type").setValue(way);
        }
	}
	if(degree !=null && degree !="" && degree !="undefined"){
		Ext.getCmp("degree_type").setValue(degree);		
	}
	if(dateTime !=null && dateTime !="" && dateTime !="undefined"){
		var startTime=dateTime.split(";")[0];
		var endTime=dateTime.split(";")[1];
		Ext.get("beginDate").dom.value=startTime;
		Ext.get("endDate").dom.value=endTime;
	}
	if(type !=null && type !="" && type !="undefined"){
		if(type=="1"){
			Ext.getCmp("scoreDetail_type").setValue(1);	
			Ext.getCmp('way_type').store.loadData(getWayTypeArr);
			
		}else{
			Ext.getCmp("scoreDetail_type").setValue(2);	
			Ext.getCmp('way_type').store.loadData(useWayTypeArr);
		}
		Ext.getCmp('way_type').setValue("全部途径");
		Ext.getCmp('way_type').enable();
	
	}
	searchlist();
	*/
};
// 右键菜单
var tbar = [{
	xtype : 'combo',
	id : 'province',
	store : pro,
	value:'全部省份',
	triggerAction : 'all',
	readOnly : true,
	width:90,
	listeners : {
		select : function(combo, record, index) {
			var province = combo.getValue();
			if(province == "全部省份") {
				city = ["全部城市"];
			}else{
				city = zhcn.getCity(province).concat();;
				city.unshift("全部城市");
			}
			Ext.getCmp('city').store.loadData(city);
			Ext.getCmp('city').setValue("全部城市");
			Ext.getCmp('city').enable();
			}
		}
	}, 
	{
		xtype : 'combo',
		id : 'city',
		store : city,
		triggerAction : 'all',
		value : '全部城市',
		width:120,
		readOnly : true
	},"-", {
		id : 'way_type',
		name : 'way_type',
		hiddenName : "way_type_input",
		fieldLabel : '全部明细类别',
		store : getTBType,
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '全部明细类别',
		valueField : "value",
		displayField : "text",
		readOnly : true,
		xtype : "combo",
		value : "",
		width : 120
	}, "起始日期：", {
		id : 'beginDate',
		xtype : 'datefield',
		format : 'Y-m-d',
		editable : true,
		maxValue : new Date(),
		emptyText : '请选择'
	}, "截止日期：", {
		id : 'endDate',
		xtype : 'datefield',
		format : 'Y-m-d',
		editable : true,
		maxValue : new Date(),
		emptyText : '请选择'
	},{
	text : "查询",
	id : "search",
	icon : "/resource/images/zoom.png",
	handler : searchlist
	}
];

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : url
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"mobile"},{name:"nickName"},{name:"way"},{name:"notes"},{name:"useTB"},{name:"getTB"},{name:"residueTB"},{name:"createOn"},{name:"province"},{name:"city"}]	
						}),
				baseParams : {
					type : 17,
					content : "",
					pageNo : 1,
					pageSize : 20
				},
				countUrl : url,
				countParams : {
					type : 18
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
							header : '明细类别',
							sortable : true,
							dataIndex : 'way',
							renderer:function(value,meta,record){
								var way = record.get("way");
								return formatWay(way);
							}
						},{
							header : '备注',
							sortable : true,
							dataIndex : 'notes'
						},{
							header : '收入T币',
							sortable : true,
							dataIndex : 'getTB',
							renderer:function(value,meta,record){
								var tb = record.get("getTB");
								return formatTB(tb);
							}
						},{
							header : '支出T币',
							sortable : true,
							dataIndex : 'useTB',
							renderer:function(value,meta,record){
								var tb = record.get("useTB");
								return formatTB(tb);
							}
						},{
							header : 'T币余额',
							sortable : true,
							dataIndex : 'residualTB',
							renderer:function(value,meta,record){
								var tb = record.get("residueTB");
								if (tb == null || "" == tb){
									return "0";
								}
								return tb;
							}
						},{
							header : "变动时间",
							sortable : true,
							dataIndex : "createOn"
						},{
							header : '区域',
							sortable : true,
							renderer:function(value,meta,record){
								var province = record.get("province");
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + "&nbsp;&nbsp;&nbsp;" + city;
							}
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
	ds_info.load();
};


/**
 * 时间比较
 * @param beginDate
 * @param endDate
 * @returns {Boolean}
 */
function compareDate(beginDate,endDate){
	var beginDateArr = beginDate.split("-");
	var endDateArr = endDate.split("-");
	var nowBeginDate = new Date(beginDateArr[0],beginDateArr[1],beginDateArr[2]);
	var nowEndDate =  new Date(endDateArr[0],endDateArr[1],endDateArr[2]);
	if (nowBeginDate > nowEndDate){
		return true;
	}
	return false;
}

/**
 * 正则表达式校验日期格式
 */
function isDate(date){     
	//这里只是校验YYYY-MM-DD格式，如果做年月日精准校验，那就比较麻烦！
    var reg = new RegExp("^[1-2]\\d{3}-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][1-9]||3[0-1])$");    
    return reg.test(date);
}   

// 查询
function searchlist() {
	var temp_query = "";
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		temp_query += "province~" + Ext.getCmp("province").getValue() + ";";
		if(city != "全部城市"){
			temp_query += "city~" + Ext.getCmp("city").getValue()+";";
		}
	}
	
	var way_type =  Ext.getCmp("way_type").getValue();
	temp_query += "way~" + way_type + ";";
	var beginDate = Ext.fly('beginDate').getValue(); //开始日期
	var endDate = Ext.fly('endDate').getValue(); //截止日期
	if ("请选择" != beginDate && "" != beginDate && beginDate != null
			&& "请选择" != endDate && "" != endDate && endDate != null){
		if (compareDate(beginDate, endDate)){
			Ext.MessageBox.alert("提示", "起始日期不能大于截止日期！");
			return false;
		}
	}
	if ("请选择" != beginDate && beginDate != null && "" != beginDate){
		if (!isDate(beginDate)){
			Ext.MessageBox.alert("提示", "起始日期格式不正确！");
			return false;
		}else{
			temp_query += "beginDate~" + beginDate + ";";;
		}
	}
	if ("请选择" != endDate && endDate != null && "" != endDate){
		if (!isDate(endDate)){
			Ext.MessageBox.alert("提示", "截止日期格式不正确！");
			return false;
		}else{
			temp_query += "endDate~" + endDate + ";";;
		}
	}
	ds_info.baseParams["content"] = temp_query;
	ds_info.load();
}

//格式化TB
function formatTB(tb){
	if ("0" == tb || tb == null || "" == tb)
		return "-";
	return tb;
}

function formatWay(way){
	return tb_type[way];
}