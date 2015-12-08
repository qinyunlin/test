var ds, grid, ck, pagetool, askds, ds_mem;
var ids = [];// 选择项
var selectinfo, window_note;
var isreplyType = {};
var curProvince = getUser_WenProvince_c().getAt(0).data.text;
var area_store = new Ext.data.SimpleStore({
	fields : [ 'value', 'text' ],
	data : eval("(" + getUserWeb() + ")")
});
var tempsite = cur_website.splice(0, 0, [ "ALL", "全部" ]);
var siteSelect = new Zhcn_Selectcity();
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];

var statusArr = [ [ -2, "全部状态" ], [ 2, "待解决" ], [ 3, "已解决" ], [ -1, "已过期" ] ];
var memberTypeArr = [ [ '', "全部会员" ], [ 1, "普通会员" ], [ 3, "正式信息会员" ],[8, "云造价会员"] ];
var searchDiyArr = [[ "tAskPrice.id", "询价ID" ], [ "tAskPrice.name", "材料名称" ], [ "tMember.corpName", "公司名称" ], [ "tMember.memberID", "发布人" ] ];

// begin add by heyang 2012-09-06 for 会员类型
ds_mem = new Ext.data.SimpleStore({
	fields : [ {
		name : 'value'
	}, {
		name : 'text'
	} ],
	data : info_type_combox
});
// end add by heyang 2012-09-06 for 会员类型
// 右键菜单
var rightClick = new Ext.menu.Menu({
	shadow : false,
	id : 'rightClickCont',
	items : [ {
		id : 'rMenu7',
		text : '回复',
		hidden : compareAuth("ASK_VIEW"),
		handler : function() {
			var rows = grid.getSelectionModel().getSelections();
			var ids = [];
			for ( var i = 0; i < rows.length; i++) {
				ids.push(rows[i].get('id'));
			}
			if (ids.length == 1) {
				var rec = grid.getSelectionModel().getSelected();
				openReplyWeb(rec.data.id,rec.data.province,rec.data.city);
			} else {
				Ext.MessageBox.alert("提示", "请勾选一条询价！");
			}
		}
	}, {
		id : 'rMenu2',
		text : '查看详情',
		hidden : compareAuth("ASK_VIEW"),
		handler : showaskinfo
	}, {
		id : 'rMenu1',
		text : '未审核询价',
		hidden : compareAuth("ASK_PRICE_UNAUDITED_LIST"),
		handler : openUnauditedAskPrice
	}, {
		id : 'rMenu6',
		text : '审核不通过询价',
		hidden : compareAuth("ASK_PRICE_NOPASS_LIST"),
		handler : openNopassAskPrice
	},/* {
		id : 'rMenu4',
		text : '未审核回复',
		handler : openUnauditedAskReply,
		hidden : compareAuth('ASK_REPLY_UNAUDITED_LIST')
	},*/ {
		id : 'rMenu8',
		text : '审核不通过回复',
		handler : openNopassAskReply,
		hidden : compareAuth('ASKREPLY_NOPASS_LIST')
	}, {
		id : 'rMenu3',
		text : '锁定的询价',
		hidden : compareAuth("ASK_PRICE_LOCKED_LIST"),
		handler : openLockedAskPrice
	},{
		id : 'rMenu5',
		text : '锁定',
		hidden : compareAuth("ASK_LOCK"),
		handler : lockask
	} ]
});
var buildGrid = function() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.accessStie.split(",")[0];
	} else
		webArea = parent.currUser_mc.accessStie;

	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			// url : '/ask/AskServlet'
			url : '/ask/AskPriceServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "corpName", "name", "spec", "memberID", "degree",
				"createOn", "revNum", "province", "city", "score", "validDate",
				"isDateOut", "status", "isTop", "nickName" ]),
		baseParams : {
			// type : 6,
			type : 27,
			isLock : 0,
			pageSize : 20,
			isreply : -1,
			searchPass : 1,
			province : curProvince
		},
		countUrl : '/ask/AskPriceServlet.do',
		countParams : {
			// type : 7,
			type : 28,
			isLock : 0,
			searchPass : 1
		},
		remoteSort : true
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});

	pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true

	});
	// var sm = new xg.CheckboxSelectionModel();// 带checkbox选择

	grid = new xg.GridPanel({
		store : ds,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoHeight : true,
		sm : sm,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : true,
			width : 38,
			dataIndex : 'id'
		}, {
			header : '名称',
			sortable : false,
			width : 200,
			dataIndex : 'name',
			renderer : function(value, meta, record) {
				var name = record.get("name");
				var isTop = record.get("isTop");
				if("1" == isTop){
					return "<img src='/resource/images/u13_isTop.gif' width='16' height='16' style='vertical-align:middle;' title='推荐询价' />" + name;
				}
				return name;
			}
		}, {
			header : '型号规格',
			sortable : false,
			width : 80,
			dataIndex : 'spec'
		}, {
			header : '公司名称',
			sortable : false,
			width : 100,
			dataIndex : 'corpName'
		}, {
			header : '发布人',
			sortable : false,
			width : 50,
			dataIndex : 'memberID'
		}, {
			header : '发布人昵称',
			sortable : false,
			width : 100,
			dataIndex : 'nickName'
		}, {
			header : '发布人类型',
			sortable : false,
			width : 50,
			dataIndex : 'degree',
			renderer : showDegree
		}, {
			header : '询价状态',
			sortable : false,
			width : 50,
			renderer : function(value, meta, record) {
				var status = record.get("status");
				var isDateOut = record.get("isDateOut");
				if (status == '3') {
					return "已解决";
				} else {
					if (isDateOut == '1') {
						return "已过期";
					} else if (status == '2') {
						return "待解决";
					}
				}
				return "待解决";
			}
		}, {
			header : '发布日期',
			sortable : true,
			width : 100,
			dataIndex : 'createOn'
		}, {
			header : '到期日期',
			sortable : true,
			width : 100,
			dataIndex : 'validDate'
		}, {
			header : '悬赏',
			sortable : true,
			width : 30,
			dataIndex : 'score'
		}, {
			header : '回复数',
			sortable : true,
			width : 30,
			dataIndex : 'revNum'
		}, {
			header : '区域',
			sortable : false,
			width : 40,
			dataIndex : 'province',
			renderer : function(value, meta, record) {
				var province = record.get("province");
				var city = record.get("city");
				if (province == null) {
					return "";
				}
				return province + " " + city;
			}
		} ],
		viewConfig : {
			forceFit : true
		},
		tbar : [ {
			text : '查看详情',// '打开',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth("ASK_VIEW"),
			handler : function() {
				var rows = grid.getSelectionModel().getSelections();
				var ids = [];
				for ( var i = 0; i < rows.length; i++) {
					ids.push(rows[i].get('id'));
				}
				if (ids.length == 1) {
					var rec = grid.getSelectionModel().getSelected();
					showaskinfo(rec.data.id);
				} else {
					Ext.MessageBox.alert("提示", "请勾选一条询价！");
				}
			}
		}, '-', {
			text : '未审核询价',// '导出',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			handler : openUnauditedAskPrice,// exportaskinfo,
			hidden : compareAuth('ASK_PRICE_UNAUDITED_LIST')
		}, '-', {
			text : '审核不通过询价',// '删除',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("ASK_PRICE_NOPASS_LIST"),
			handler : openNopassAskPrice
		}, /*'-', {
			text : '未审核回复',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("ASK_REPLY_UNAUDITED_LIST"),
			handler : openUnauditedAskReply
		},*/ '-', {
			text : '审核不通过回复',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("ASKREPLY_NOPASS_LIST"),
			handler : openNopassAskReply
		}, '-', {
			text : '锁定的询价',// '删除',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("ASK_PRICE_LOCKED_LIST"),
			handler : openLockedAskPrice
		}, '-', {
			text : '锁定',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/lock.png',
			hidden : compareAuth("ASK_LOCK"),
			handler : lockask
		}, '-', {
			text : '导出',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/application_double.png',
			handler : exportaskinfo,
			hidden : compareAuth('ASK_ADMIN_EXPORT')
		},'-',{
			text : '重新审核不通过',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/arrow_redo.png',
			handler : returnNoAudit,
			hidden : compareAuth('ASK_AUDIT')
		},'-',{
			text : '推荐',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			handler : setTop,
			hidden : compareAuth('ASK_PRICE_RECOMMEND')
		},'-',{
			text : '取消推荐',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			handler : cancleTop,
			hidden : compareAuth('ASK_PRICE_RECOMMEND_CANCEL')
		},'-',{
			text : '生成单个询价页面',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			handler : create_oneAskPrice_html,
			hidden : compareAuth('CREATE_ONEASKPRICE_HTML')
		},'-',{
			text : '导入回复',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			handler : exportAskReply,
			hidden : compareAuth('ASKREPLY_ADMIN_IMPORT')
		}],
		bbar : pagetool,
		renderTo : 'ask_grid'
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		var row = grid.getSelectionModel().getSelected();

		selectinfo = row.get("id");
		showaskinfo(selectinfo);

	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
			xtype : 'combo',
			id : 'province',
			store : pro,
			triggerAction : 'all',
			emptyText : '请选择省',
			readOnly : true,
			width : 90,
			listeners : {
				select : function(combo, record, index) {
					/*var province = combo.getValue();
					if (province == "全部省份") {
						city = [ "全部城市" ];
					} else {
						city = zhcn.getCity(province).concat();
						;
						city.unshift("全部城市");
					}

					Ext.getCmp('city').store.loadData(city);
					Ext.getCmp('city').setValue("全部城市");
					Ext.getCmp('city').enable();*/
				}
			}
		}, /*{
			xtype : 'combo',
			id : 'city',
			store : city,
			triggerAction : 'all',
			emptyText : '请选择城市',
			readOnly : true,
			width : 120,
			disabled : true
		},*/ "-", ck = new Ext.form.ComboBox({
			emptyText : "请选择",
			mode : "local",
			triggerAction : "all",
			store : askDateRange,
			width : 100,
			value : '-1',
			readOnly : true,
			listeners : {
				"select" : function(combo) {
					isreplyType["name"] = combo.lastSelectionText;
					isreplyType["days"] = combo.getValue();
					countTodayAsk();
					searchlist();
				}
			}
		}), "-", {
			id : 'info_type',
			name : 'info_type',
			hiddenName : "info_type_input",
			fieldLabel : '会员类型',
			// store : ds_mem,
			store : memberTypeArr,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			emptyText : '请选择会员类型',
			valueField : "value",
			displayField : "text",
			readOnly : true,
			xtype : "combo",
			value : "",
			width : 120
		}, "-", {
			id : 'askPirce_state',
			emptyText : '请选择状态',
			fieldLabel : '询价状态',
			valueField : "value",
			store : statusArr,
			readOnly : true,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			valueField : "value",
			displayField : "text",
			value : "",
			xtype : "combo",
			width : 100
		}, "-", {
			id : 'askPirce_search',
			//emptyText : '请选择查询条件',
			fieldLabel : '查询条件',
			valueField : "value",
			store : searchDiyArr,
			readOnly : true,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			valueField : "value",
			displayField : "text",
			value : "",
			xtype : "combo",
			width : 120,
			value : "tAskPrice.name" //设置默认选项
		}, "-",{
			xtype : "textfield",
			textLabel : "查询条件",
			id : "searchVal",
			width : 150,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}/* "-", {
			xtype : "label",
			text : "询价ID："
		}, {
			xtype : "textfield",
			textLabel : "名称",
			id : "searchId",
			width : 80,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, "-", {
			xtype : "label",
			text : "名称："
		}, {
			xtype : "textfield",
			textLabel : "名称",
			id : "searchname",
			width : 120,
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
			text : '公司名称：'
		}, {
			xtype : "textfield",
			id : 'corpName',
			width : 120,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, {
			xtype : "label",
			text : "发布人："
		}, {
			xtype : "textfield",
			textLabel : "发布人",
			width : 120,
			id : "searchuser",
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}*/, {
			text : "查询",
			id : "search",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		} ]
	});
	// Ext.getCmp("area_sel").setValue(pro.getAt(0).data.value);
	ds.load();
	// debugger;
};

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

Ext.onReady(function() {
	init();
});

var otherReasonTextDefault = false;
function doEnabled() {
	var isChecked = document.getElementById("checkbox12").checked;
	var otherReasonText = document.getElementById("otherReasonText");
	if (isChecked) {
		otherReasonText.disabled = false;
		otherReasonText.focus();
		if (!otherReasonTextDefault && otherReasonText.value == "请输入自定义理由!") {
			otherReasonText.value = "";
			otherReasonTextDefault = true;
		}
	} else {
		otherReasonText.disabled = true;
	}
}

/*-----------------逻辑业务--------------*/
//重新审核不通过
function returnNoAudit(){
	var rows = grid.getSelectionModel().getSelections();
	if(rows.length < 1){
		Ext.MessageBox.alert("提示","请选择至少一条询价");
		return;
	}
	
	var ids = [];
	for(var i=0;i<rows.length;i++){
		ids.push(rows[i].get("id"));
	}
	
	Ext.MessageBox.confirm("提示","审核为不通过后将会返还用户积分！确定审核不通过？", function(o){
		if(o == "yes"){
			showNoPassWin(ids);
		}
	});
}

/**
 * 验证询价不通过理由是否合法
 * @param reason
 * @returns {Boolean}
 */
function checkAppReason(reason,ids){
	if (reason.length == 0){
		otherReasonTextDefault = false;
		Ext.MessageBox
		.alert(
				"提示",
				"询价不通过理由不能为空！",function(btn){
					if ("ok" == btn || "cancel" == btn){
						showNoPassWin(ids);
					}
				});
		return false;
	}else if (reason.length > 200){
		otherReasonTextDefault = false;
		Ext.MessageBox
		.alert(
				"提示",
				"询价不通过理由不能超过200字，请调整之后再进行提交！",function(btn){
					if ("ok" == btn || "cancel" == btn){
						showNoPassWin(ids);
					}
				});
		return false;
	}
	return true;
}

/**
 * 审核不通过
 * @param ids
 */
function showNoPassWin(ids){
	Ext.MessageBox.show({
		title : '提示',
		msg : "<span style='line-height:40px;'>请选择不通过理由：</span><p>"
			+ "<input type='radio' id='checkbox1' name='checkbox' value='您好！非常抱歉，该材料需要提供图纸或图片，请通过附件上传后重新发布！如有疑问请联系客服：020-38974866，谢谢！' checked onclick='doEnabled();' />&nbsp;您好！非常抱歉，该材料需要提供图纸或图片，请通过附件上传后重新发布！如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox2' name='checkbox' value='您好！非常抱歉，您提供的图纸与所询材料不符或者图纸太模糊，请您确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' />&nbsp;您好！非常抱歉，您提供的图纸与所询材料不符或者图纸太模糊，请您确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox3' name='checkbox' value='您好！非常抱歉，由于没有提供详细的材料规格，型号，用途等必备参数，厂商无法报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，由于没有提供详细的材料规格，型号，用途等必备参数，厂商无法报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox4' name='checkbox' value='您好！非常抱歉，您填写的材料名称太模糊或不正确，厂商无法报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，您填写的材料名称太模糊或不正确，厂商无法报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox5' name='checkbox' value='您好！非常抱歉，您提供的材料名称与规格型号无法匹配，无法提供报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，您提供的材料名称与规格型号无法匹配，无法提供报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox6' name='checkbox' value='您好！非常抱歉，该型号规格的材料暂无供应厂家，无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，该型号规格的材料暂无供应厂家，无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox7' name='checkbox' value='您好！非常抱歉，该材料型号规格厂商已经停产或没有生产该规格型号！无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，该材料型号规格厂商已经停产或没有生产该规格型号！无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox8' name='checkbox' value='您好！非常抱歉，您询的对象不属于建材！如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，您询的对象不属于建材！如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox9' name='checkbox' value='您好！非常抱歉，内容属于无效信息！如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，内容属于无效信息！如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox10' name='checkbox' value='您好！非常抱歉，内容中包含违规信息！如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，内容中包含违规信息！如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox11' name='checkbox' value='您好！非常抱歉，纯人工费用及加工、安装、台班类费用不属于询价范围，请您上www.zjtcn.com相关频道查阅，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，纯人工费用及加工、安装、台班类费用不属于询价范围，请您上www.zjtcn.com相关频道查阅，如有疑问请联系客服：020-38974866，谢谢！<br/>"
			+ "<input type='radio' id='checkbox12' name='checkbox' value='' onclick='doEnabled();' />&nbsp;其他(不超过200字)<p>"
			+ "<textarea rows='5' cols='10' id='otherReasonText' value='请输入自定义理由!' disabled='disabled' style='width:550px;' >请输入自定义理由!</textarea>",
		width : 600,
		prompt : false,
		// id :
		// 'otherReasonText',
		// value :
		// "请输入自定义理由!",
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(btn,text) {
			var appReasonText = "";
			var otherCheckObj = document
					.getElementById("checkbox12");
			if (otherCheckObj.checked){
				appReasonText = document.getElementById("otherReasonText").value;
				//appReasonText = document.getElementById("otherReasonText").innerHTML;
			}else{
				var radioArr = document.getElementsByName("checkbox");
				 for(var i = 0; i < radioArr.length; i ++){
					 if(radioArr[i].checked){
						appReasonText = radioArr[i].value;
						break;
					}		
				 }
			}
			if ("ok" == btn) {
				//验证理由不能为空，且字数不能超过200字
				if (!checkAppReason(appReasonText,ids)){
					return false;
				}
				doReturnNoAudit(ids, appReasonText);
			}
			otherReasonTextDefault = false;
		}
	});
}

function doReturnNoAudit(ids,appReasonText){
	Ext.Ajax.request({
		url:'/ask/AskPriceServlet.do',
		method:'POST',
		params:{
			type:'33',
			id:ids.toString(),
			status:1,
			notes:appReasonText
		},
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				if(data.result){
					Ext.MessageBox.alert("提示",data.result);
				}else{
					Ext.MessageBox.alert("提示","操作成功");
				}
				ds.reload();
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}

// 锁定询价
function lockask() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	// begin update by heyang 2012-09-06 for 选择多条或者未选中进行锁定时进行提示
	// if (ids.length > 0) {
	if (ids.length == 1) {
		// end update by heyang 2012-09-06 for 选择多条或者未选中进行锁定时进行提示
		Ext.MessageBox.confirm("提示", "您确定锁定选中的信息吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskServlet",
						{
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									Info_Tip("锁定成功。");
									ids = [];
									ds.reload();
								}
							},
							failure : function(response) {
								Warn_Tip();
							}
						}, "type=21&id=" + ids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择一条信息。");
	}

};
// 删除询价
function delAsk() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	var memberids = [];
	for ( var i = 0; i < rows.length; i++) {
		if (rows[i].get('revNum') > 0) {
			Ext.MessageBox.alert("提示", "不能删除已回复的询价。");
			return;
		}
		ids.push(rows[i].get('id'));
		memberids.push(rows[i].get('memberID'));
	}
	if (ids.length != memberids.length) {
		Ext.MessageBox.alert("提示", "选择的数据有误，请联系技术人员。");
		return;
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除询价并返还用户询价数吗？", function(op) {
			if (op == "yes") {
				Ext.lib.Ajax.request("post", "/ask/AskServlet",
						{
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (getState(data.state, commonResultFunc,
										data.result)) {
									Info_Tip("操作成功。");
									ids = [];
									ds.reload();
								}
							},
							failure : function(response) {
								Warn_Tip();
							}
						}, "type=27&id=" + ids.toString() + "&memberid="
								+ memberids.toString());
			}
		});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}
}

// 查询信息
function searchlist() {
	//获取查询字段名
	var searchDiyName = Ext.getCmp("askPirce_search").getValue();
	//获取查询条件
	var searchDiyVal = Ext.getCmp("searchVal").getValue();
	ds.baseParams["content"] =  searchDiyName + "~" + searchDiyVal;
	var province = Ext.getCmp("province").getValue();
	//var city = Ext.getCmp("city").getValue();
	var status = Ext.getCmp("askPirce_state").getValue();
	var degree = Ext.getCmp("info_type").getValue();
	ds.baseParams["degree"] = degree;

	if (province != "全部省份") {
		ds.baseParams["content"] += ";tAskPrice.province~" + province;
		/*if (city != "全部城市") {
			ds.baseParams["content"] += ";tAskPrice.city~" + city;
		}*/
	}

	if (status == "" || status == "-2") { // 查询全部
		ds.baseParams["queryByDate"] = "";
		ds.baseParams["searchPass"] = "1";
		ds.baseParams["status"] = "";
	} else {
		if (status == "-1") {// 查询过期
			ds.baseParams["queryByDate"] = "1";
			ds.baseParams["searchPass"] = "1";
			ds.baseParams["status"] = "";
		} else {
			ds.baseParams["content"] += ";tAskPrice.status~" + status;
			ds.baseParams["queryByDate"] = "";
			ds.baseParams["searchPass"] = "";
			ds.baseParams["status"] = "";
		}
	}

	ds.baseParams["isreply"] = ck.getValue();
	//查询未回复的，则只查询未解决询价：status-2
	if ("0" == ck.getValue() 
		|| "-1" == ck.getValue() 
		|| "-3" == ck.getValue() 
		|| "-7" == ck.getValue()
		|| "-30" == ck.getValue()){
		ds.baseParams["status"] = "2";
	}
	ds.load();
};

// 查看详细信息
function showaskinfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	/*
	 * window.parent.createNewWidget("ask_info", '普通询价信息',
	 * '/module/ask/ask_info.jsp?id=' + row.get("id"));
	 */
	window.parent.createNewWidget("ask_detail", '普通询价信息',
			'/module/ask/ask_detail.jsp?id=' + row.get("id"));
};

// 统计今天未回复询价数量
function countTodayAsk() {
	var temp = "未回复";
	if (isreplyType["days"] == undefined || isreplyType["days"] == null) {
		isreplyType["days"] = -1;
		isreplyType["name"] = "今天"
	} else {
		if (isreplyType["days"] == "")
			temp = "";
	}

	Ext.Ajax.request({
		url : '/ask/AskServlet',
		params : {
			type : 7,
			isLock : 0,
			isreply : isreplyType["days"],
			province : curProvince
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.TipSelf.msg('提示', isreplyType["name"]// + temp
						+ '询价数量：' + data.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

// 统计今天和所有未回复询价的数量
function CountTodayAndMore() {
	var today = "";
	var more = "";
	Ext.Ajax.request({
		url : '/ask/AskPriceServlet.do',
		params : {
			// type : 7,
			type : 5,
			isreply : -1,
			isLock : 0,
			status : 0,
			province : curProvince
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				today = data.result;
			}
			Ext.Ajax.request({
				url : '/ask/AskPriceServlet.do',
				params : {
					// type : 7,
					type : 5,
					isreply : 0,
					isLock : 0,
					status : 0,
					province : curProvince
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						more = data.result;
						/*
						 * Ext.TipSelf.msg('提示', '<p>今天未回复询价数量：' + today + '</p><p>所有未回复询价数量：' +
						 * more + "</p>");
						 */
						Ext.TipSelf.msg('提示', '<p>今天未审核询价数量：' + today
								+ '</p><p>所有未审核询价数量：' + more + "</p>");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		},
		failure : function() {
			Warn_Tip();
		}
	});

};

function getReply() {
	var data;
	var id = Ext.getCmp("note_id").getValue();
	;
	var reply_text = "还未对该留言进行回复！";
	// 取得数据
	Ext.Ajax.request({
		url : '/AskMessageServlet',
		params : {
			type : 6,
			id : id,
			page : 1,
			pageNo : 1
		},
		success : function(response) {
			data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				if (data.result.length == 0) {
					Ext.getCmp("reply_text").setValue(reply_text);
				} else
					var length = data.result.length - 1;
				if (!Ext.isEmpty(data.result))
					Ext.getCmp("reply_text").setValue(
							data.result[length].content);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

// 生成弹出窗口
function seeReply() {
	var rows = grid.getSelectionModel().getSelected();
	var id;
	if (!rows) {
		Ext.MessageBox.alert("提示", "请选择信息。");
		return;
	}
	id = rows.get("id");
	// 取得数据
	Ext.Ajax.request({
		url : '/AskMessageServlet',
		params : {
			type : 7,
			sid : id,
			page : 1,
			pageNo : 1
		},
		success : function(response) {
			data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				if (data.result.length < 1) {
					Ext.MessageBox.alert("提示", "该询价没有留言！");
					return false;
				}
				Ext.getCmp("note_note").setValue(data.result[0].content);
				Ext.getCmp("note_phone").setValue(data.result[0].phone);
				Ext.getCmp("note_linkman").setValue(data.result[0].linkman);
				Ext.getCmp("note_id").setValue(data.result[0].id);
				window_note.show();
				getReply();
			} else {
				Ext.MessageBox.alert("提示", "获取数据失败！");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

	var form = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		layout : 'absolute',
		url : 'save-form.php',
		defaultType : 'textfield',

		items : [ {
			x : 0,
			y : 5,
			xtype : 'label',
			text : '联&nbsp;系&nbsp;人:'
		}, {
			id : 'note_linkman',
			readOnly : true,
			x : 60,
			y : 0,
			name : 'to',
			xtype : 'textfield',
			anchor : '100%' // anchor width by percentage
		}, {
			x : 0,
			y : 30,
			xtype : 'label',
			text : '联系电话:'
		}, {
			id : 'note_phone',
			readOnly : true,
			x : 60,
			y : 30,
			name : 'to',
			xtype : 'textfield',
			anchor : '100%' // anchor width by percentage
		}, {
			x : 0,
			y : 55,
			xtype : 'label',
			text : '留　　言:'
		}, {
			id : 'note_note',
			readOnly : true,
			x : 60,
			y : 55,
			name : 'to',
			xtype : 'textarea',
			height : 60,
			anchor : '100%' // anchor width by percentage
		}, {
			x : 0,
			y : 130,
			xtype : 'label',
			text : '回　　复:'
		}, {
			id : 'reply_text',
			x : 60,
			y : 130,
			height : 60,
			xtype : 'textarea',
			name : 'msg',
			anchor : '100%' // anchor width and height
		}, {
			id : "note_id",
			hidden : true
		} ]
	});

	window_note = new Ext.Window({
		title : '查看留言',
		width : 500,
		height : 300,
		minWidth : 300,
		minHeight : 200,
		layout : 'fit',
		modal : true,
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : form,

		buttons : [ {
			text : '提交',
			handler : function() {
				submitNoteReply();
			}
		}, {
			text : '取消',
			handler : function() {
				window_note.close();
				return false;
			}
		} ]
	});

};

function submitNoteReply() {
	var id = grid.getSelectionModel().getSelected().get('id');
	var mid = grid.getSelectionModel().getSelected().get('memberID');
	var pid = Ext.getCmp("note_id").getValue();
	var contents = Ext.getCmp("reply_text").getValue();
	if (Ext.isEmpty(contents) || contents == "还未对该留言进行回复！") {
		Info_Tip("没有任何内容可以提交！");
		return false;
	}
	var content = "linkman~" + Ext.getCmp("note_linkman").getValue()
			+ ";phone~" + Ext.getCmp("note_phone").getValue() + ";content~"
			+ contents;
	Ext.Ajax.request({
		url : '/AskMessageServlet',
		params : {
			type : 2,
			sid : id,
			content : content,
			// contents : contents,
			mid : mid,
			pid : pid
		},
		success : function(response) {
			data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.MessageBox.alert("提示", "提交成功！");
				window_note.close();

			} else {
				Ext.MessageBox.alert("提示", "回复失败！");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

}

// 创建循环任务对象
var task = {
	run : CountTodayAndMore,
	interval : 1000 * 60 * 5
// 循环时间5分钟
};

// 创建循环任务
var taskRunner = new Ext.util.TaskRunner();
taskRunner.start(task);

// 导出询价信息
function exportaskinfo() {

	var province = Ext.fly("province").getValue().trim();
	//var name = Ext.fly("searchVal").getValue().trim();
	//var memberID = Ext.fly("searchuser").getValue().trim();
	var isreply = ck.getValue();
	//var corpName = Ext.getCmp("corpName").getValue().trim();
	if ((isreply && isreply == "1" || isreply == "") || (!isreply)) {
		Ext.MessageBox.alert("提示", "已回复询价不能导出！");
		return;
	}
	//目前只导出所有未回复的：isreply = 0;
	isreply = 0;
	
	
	window.document.exportform.action = "/AskPriceExportServlet?isLock=0&status=2&province=" + province + "&isreply="
			+ isreply;
	window.document.exportform.submit();
};

// begin add by heyang 2012-09-06 for 未审核询价
function openUnauditedAskPrice() {
	window.parent.createNewWidget("ask_price_unaudited", '未审核询价',
			'/module/ask/ask_price_unaudited.jsp');
}
// end add by heyang 2012-09-06 for 未审核询价

// begin add by heyang 2012-09-06 for 未审核回复
function openUnauditedAskReply() {
	window.parent.createNewWidget("ask_reply_unaudited", '未审核回复',
			'/module/ask/ask_reply_unaudited.jsp');
}
// end add by heyang 2012-09-06 for 未审核回复

// begin add by heyang 2012-09-06 for 锁定的询价
function openLockedAskPrice() {
	window.parent.createNewWidget("ask_price_locked", '锁定的询价',
			'/module/ask/ask_price_locked.jsp');
}
// end add by heyang 2012-09-06 for 锁定的询价

function openNopassAskPrice(){
	window.parent.createNewWidget("ask_price_nopass_list", '审核不通过询价',
	'/module/ask/ask_price_nopass_list.jsp');
}

/**
 * 审核不通过回
 */
function openNopassAskReply() {
	window.parent.createNewWidget("ask_reply_nopass_list", '审核不通过回复',
			'/module/ask/ask_reply_nopass_list.jsp');
}

function setTop(){
	var row = grid.getSelectionModel().getSelected();
	var id = row.get("id");
	var isTop = row.get("isTop");
	if(checkSelected() || "1" == isTop){
		Ext.MessageBox
		.alert(
				"提示",
				"请勾选一条询价!");
		return false;
	}
	Ext.MessageBox
	.show({
		title : '提示',
		msg : "确认在首页推荐此询价？",
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text){
			if ("ok" == btn){
				submitTop(id,"1");
			}
		}}
	);
}

function cancleTop(){
	var row = grid.getSelectionModel().getSelected();
	var id = row.get("id");
	var isTop = row.get("isTop");
	if(checkSelected() || "0" == isTop){
		Ext.MessageBox
		.alert(
				"提示",
				"请勾选一条被推荐询价！");
		return false;
	}
	Ext.MessageBox
	.show({
		title : '提示',
		msg : "确认取消此询价的首页推荐？",
		prompt : false,
		width : 200,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text){
			if ("ok" == btn){
				submitTop(id,"0");
			}
		}}
	);
	
}


//生成单个询价详情页面
function create_oneAskPrice_html(){
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	
	  var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '生成所有站点静态页面处理中.....!',
	        disabled : false,
	        store : store
	      });
	      loadMarsk.show();
	    var store=Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=15&askId='+ids.toString(), {
				success : function(response) {
						var data = eval("(" + response.responseText + ")");
						
						if (getState(data.state, commonResultFunc,data.result)) {
							 loadMarsk.hide();
							Ext.Msg.alert('生成单个询价学堂模板静态页面成功！');
						} 
					},
					failure : function() {
						Ext.Msg.alert('警告', '生成单个询价学堂模板静态页面失败！');
					}
				});
	
}



function submitTop(id,isTop){
	Ext.lib.Ajax
	.request(
			"post",
			"/ask/AskPriceServlet.do?type=34",
			{
				success : function(
						response) {
					var data = eval("("
							+ response.responseText
							+ ")");
					if (getState(
							data.state,
							commonResultFunc,
							data.result)) {
						if ("1" == isTop){
							var topResult = data.result;
							if ("1" == topResult){
								Ext.MessageBox
								.alert(
										"提示",
										"最多推荐五位！已推荐五位，请取消原有推荐后再操作！");
							}else{
								Ext.MessageBox
								.alert(
										"提示",
										"已成功推荐该询价!");
								ds.reload();
							}
						}else{
							Ext.MessageBox
							.alert(
									"提示",
									"该条询价成功取消推荐!");
							ds.reload();
						}
					}
				}
			},
			"id=" + id + "&isTop=" + isTop);
}

function checkSelected(){
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length != 1){
		return true;
	}
	return false;
}

/**
 * 打开对应询价的前台回复页面
 */
function openReplyWeb(id,province,city){
	var cityWeb = "http://";
	var province = siteSelect.getSite(province);
	cityWeb += province + ".zjtcn.com";
	cityWeb += "/ask_info/" + id + ".html";
	window.open(cityWeb);
}

/**
 * 批量导入回复
 */
function exportAskReply(){
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
				items : {
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				}
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '导入普通询价',
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
				uploadFile();
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


function uploadFile(){
if (upload_form.getForm().isValid()) {
//	var loadMarsk = new Ext.LoadMask(window.parent.document.body, {    
//	    msg:'上传文件中，请稍候......',  
//	});
//	win.hide();
//	loadMarsk.show();
	upload_form.getForm().getEl().dom["accept-charset"] = "UTF-8";
	upload_form.getForm().submit({
				    url : '/AskPriceExportServlet?method=batchToUploadAskReply',
					method:"post",
					waitMsg : '上传文件中...',
					success : function(batch_up, o) {
						var returnInfo = o.result;
					
						if (getState(returnInfo.state,
								commonResultFunc, returnInfo.result)) {
							
							var r = /^\+?[1-9][0-9]*$/; //正整数
							var sucNum = returnInfo.result.split(";")[0];
							var askIdAppVal = returnInfo.result.split(";")[1];
							if(r.test(sucNum)){
								//loadMarsk.hide();
								win.close();
								Ext.MessageBox
								.alert(
										"提示",
										"本次共上传" + sucNum + "条普通询价！");
								//alert("本次共上传"+returnInfo.result+"条普通询价！");
								ds.reload();
								//请求生成静态页面
								var url = "/ask/AskPriceServlet.do";
								var dataParam = {};
								dataParam["type"] = "53";
								dataParam["askIdAppVal"] = askIdAppVal;
								$
										.ajax({
											type : "post",
											url : url,
											async : true,//true可执行后面的js，无需等到ajax返回再执行
											data : dataParam,
											complete : function(json) {
												var data = eval("(" + json.responseText + ")");
												if (getState(data.state, commonResultFunc, data.result)) {} 
											}
										});
								//发送询价回复站内信
								var sendMsgDataParam = {};
								sendMsgDataParam["type"] = "55";
								sendMsgDataParam["askIdAppVal"] = askIdAppVal;
								$
								.ajax({
									type : "post",
									url : url,
									async : true,//true可执行后面的js，无需等到ajax返回再执行
									data : sendMsgDataParam,
									complete : function(json) {
										var data = eval("(" + json.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {} 
									}
								});
							}else{
								//loadMarsk.hide();
								//win.close();
								ds.reload();
								resultException(returnInfo.result);
							}
							
						} 

					},
					failure : function() {
						//loadMarsk.hide();
						win.close();
					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
}

function  resultException(mag){
	var exceptionMsg = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [{
							xtype : 'textarea',
							//fieldLabel : "上传文件",
							width : 350,
							value:mag,
							style:"min-height:300px;",
							allowBlank : false,
							autoHeight : true,

						}],
				buttons : [{
							text : '确定',
							handler : function() {
								win.close();
							}
						}]
			});
	win = new Ext.Window({
				title : '错误提示',
				closeAction : "close",
				width : 500,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [exceptionMsg]
			});
	win.show();
}
