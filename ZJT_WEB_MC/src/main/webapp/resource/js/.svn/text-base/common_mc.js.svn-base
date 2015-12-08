var webProvince_sel = "广东";
var currUser_mc;// 后台用户对象
var currUser_mc_auth;// 后台用户权限对象
var webArea = "";// 会员访问区域
var FileSite = "http://ftp.zjtcn.com";// 文件系统域名
Ext.BLANK_IMAGE_URL = '/ext/resource/images/default/s.gif';
var WHITE_BORDER = "border:none;background-color:white;";
var date = new Date();
var now = date.format("Y-m-d");
function isEmpty(v) {
	if ((v || "") == "")
		return true;
	else
		return false;
};
var contant = {
	success : "success",
	failure : "failed",
	nologin : "nologin",
	noauth : "auth",
	failureMsg : "对不起，获取数据失败!",
	nologinMsg : "对不起，您尚未登录！",
	noauthMsg : "对不起，您的权限不足!",
	noaccess : "非法状态"
};
function getState(state, funcObj, result) {
	var func = function() {
	};
	if (funcObj && funcObj[state])
		func = funcObj[state] || func;
	switch (state) {
		case contant.success :
			func();
			return true;
			break;
		case contant.failure :
			msg = result;
			func(result);
			return false;
			break;
		case contant.nologin :
			msg = contant.nologinMsg;
			goTO(window.location.href);
			return false;
			break;
		case contant.noauth :
			msg = contant.noauthMsg;
			func();
			return false;
			break;
		default :
			msg = contant.noaccess;
			return false;
	}
};

// 返回数据的通用处理函数
var commonResultFunc = {};
commonResultFunc[contant.noauth] = function() {
	Ext.MessageBox.alert("错误提示", contant.noauthMsg);
	return false;
}
commonResultFunc[contant.nologin] = function() {
	Ext.MessageBox.alert("错误提示", contant.nologinMsg)
	goTO(window.location.href);
	return;
}
commonResultFunc[contant.failure] = function(result) {
	if (result)
		Ext.MessageBox.alert("错误提示", result);
	else
		Ext.MessageBox.alert("错误提示", contant.failureMsg);
}

// 获取URL参数
function getCurArgs(argName) {
	var args = new Object();
	var query = location.search.substring(1); // Get query string
	var pairs = query.split("&"); // Break at ampersand
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('='); // Look for "name=value"
		if (pos == -1)
			continue; // If not found, skip
		var argname = pairs[i].substring(0, pos); // Extract the name
		var value = pairs[i].substring(pos + 1); // Extract the value
		value = decodeURIComponent(value); // Decode it, if needed
		args[argname] = value; // Store as a property
	}
	if ((argName || "") == "")
		return args; // Return the object,you can use it by this method:
	// "getCurArgs()["xx"]" or "getCurArgs().xx"
	else
		return args[argName]; // return the element,you can use it by this
	// method: getCurArgs("xx")
}

// Html to Text
// 调用方法: String s="<div>test</div>"; s.toText()返回"test"
String.prototype.toText = function() {
	var tmpDiv = document.createElement("div");
	tmpDiv.innerHTML = this;
	var tmpTxt;
	if (document.all) {
		tmpTxt = tmpDiv.innerText;
	} else {
		tmpTxt = tmpDiv.textContent;
	}
	tmpDiv = null;
	return tmpTxt;
}

function showDegree(v) {
	var t = "";
	switch (parseInt(v)) {
		case 11 :
			t = "注册未审核信息会员";
			break;
		case 1 :
			//t = "试用信息会员";
			t = "普通会员";
			break;
		case 12 :
			t = "注册未审核厂商会员";
			break;
		case 2 :
			t = "试用厂商会员";
			break;
		case 3 :
			t = "正式信息会员";
			break;
		case 4 :
			t = "正式厂商会员";
			break;
		case 5 :
			t = "赠送会员";
			break;
		case 6 :
			t = "持卡会员";
			break;
		case 7 :
			t = "试用云造价会员";
			break;
		case 8 :
			t = "云造价会员";
			break;
		case 9 :
			t = "企业会员";
			break;
		case 10:
			t = "正式采购会员";
			break;
		case 13:
			t = "试用采购会员";
			break;
	}
	return t;
};
// 信息会员下拉选择项
var info_type_combox = [['', '所有'], ['1', '试用信息会员'], ['3', '正式信息会员'],
		['5', '赠送会员'], ['6', '持卡会员'], ['7', '内部会员'], ['8', 'VIP信息会员'],
		['9', '企业会员']];
var info_type_combox_common = [['1', '试用信息会员'], ['3', '正式信息会员'], ['5', '赠送会员'],
		['6', '持卡会员'], ['7', '内部会员']];
// 厂商会员下拉选择项
var fac_type_combox = [['', '所有'], ['2', '试用厂商会员'], ['4', '正式厂商会员']];
// 统计会员下拉选择项
var memberDegree_combo = [['', '所有'], ['1', '试用信息会员'], ['3', '正式信息会员'],
		['5', '赠送会员'], ['6', '持卡会员'], ['7', '试用云造价会员'], ['8', '云造价会员'],
		['9', '企业会员'], ['2', '试用厂商会员'], ['4', '正式厂商会员']];

// 统计登录选项
var loginnum_combo = [['all', '总登录次数'], ['lastweek', '上周登录次数'],
		['thisweek', '本周登录次数'], ['lastmonth', '上月登录次数'],
		['thismonth', '本月登录次数']];
// 企业类型
var emp_type_array = [["0", "所有类型"], ["1", "建材厂商"], ["2", "政府机构"],
		["3", "中介服务"], ["4", "施工单位"], ["5", "业主单位"], ["6", "设计单位"],
		["7", "其它单位"]];

function EnterpriseDegree(v) {
	if (v) {
		switch (parseInt(v)) {
			case 1 :
				return "建材厂商";
				break;
			case 2 :
				return "政府机构";
				break;
			case 3 :
				return "中介服务";
				break;
			case 4 :
				return "施工单位";
				break;
			case 5 :
				return "业主单位";
				break;
			case 6 :
				return "设计单位";
				break;
			case 7 :
				return "其它单位";
				break;
			default :
				return "未分类";
		}
	}
};

var EnterpriseType = [["1", "建材厂商"], ["2", "政府机构"], ["3", "中介服务"],
		["4", "施工单位"], ["5", "业主单位"], ["6", "设计单位"], ["7", "其它单位"]];

function changesearchtimes(v) {
	if (!isEmpty(v)) {
		if (v == "-1")
			return "无限制";
	}
};
function changeAudit(v) {
	if (!isEmpty(v)) {
		if (v == "1")
			return "已审核";
		else
			return "<font style='color:red'>未审核</font>";
	} else
		return "<font style='color:red'>未审核</font>";
};


function changeEnter(v) {

	if (!isEmpty(v)) {
		if (v == "1")
			return "已入围";
		else
			return "<font style='color:red'>未入围</font>";
	} else
		return "<font style='color:red'>未入围</font>";
};


function changeReply(v)
{
    if(!isEmpty(v)){
       if(v=="1"){
         return "招募";
       }else if(v=="2"){
         return "项目";
       }else{
         return "阳光采购";
       }
       
    }
};
function changeLock(v) {
	if (!isEmpty(v)) {
		if (v == "0")
			return "正常";
		else
			return "<font style='color:red'>已锁定</font>";
	} else
		return "<font style='color:red'>已锁定</font>";
};
function changeDeleted(v) {
	if (!isEmpty(v)) {
		if (v == "0")
			return "否";
		else
			return "<font style='color: red'>是</font>";
	} else
		return "<font style='color:red'>否</font>";
};
function trimDate(v) {
	if (!isEmpty(v)) {
		return v.slice(0, 10);
	} else
		return "";
};


function startDate(v) {
	if (!isEmpty(v)) {
		return v.substring(0,16);
	} else
		return "";
};

function showAskTotal(v,v1){
	if(v && v1){
		
		return (v-v1).toString();
	}
	return "0";
}

function emailStatus(v){
	if(!isEmpty(v)){
		if(v=="1"){
			return "已验证";
		}else{
			return "未验证";
		}
	}else{
		return "未验证";
	}
	
}


//订单状态
function ordersStatusRen(v){
	if(!isEmpty(v)){
		var stName = "";
		if (v == "1") {
			stName = "未付款";
		} else if (v == "2") {
			stName = "已付款";
		} else if (v == "3") {
			stName = "取消";
		}
		return stName;
	}
}

//发票状态
function sendInvoiceRen(v){
	if(!isEmpty(v)){
		var stName = "";
		if (v == "1") {
			stName = "已提供";
		} else if (v == "2") {
			stName = "未提供";
		}
		return stName;
	}
}

//开通状态
function openServiceRen(v){
	if(!isEmpty(v)){
		var stName = "";
		if (v == "1") {
			stName = "已开通";
		} else if (v == "2") {
			stName = "未开通";
		}
		return stName;
	}
}

// 警告提示
var Warn_Tip = function(v) {
	if (Ext.isEmpty(v))
		Ext.MessageBox.alert("错误提示", "非常抱歉，您的信息暂时无法提交到服务器，请稍候再试...");
	else
		Ext.MessageBox.alert("错误提示", v);
};
// 温馨提示
var Info_Tip = function(v, op) {
	if (v) {
		if (op)
			Ext.MessageBox.alert("温馨提示", v, op);
		else
			Ext.MessageBox.alert("温馨提示", v);
	} else
		Ext.MessageBox.alert("温馨提示", "请填写必要信息。");
};

// 验证输入
var validateInput = {};
// 检查最大长度
validateInput["f"] = function(v, num, info) {
	if (v != null && v != undefined) {
		if (v.gblen() > parseInt(num)) {
			Info_Tip(info + "内容太多，请精简。");
			return false;
		} else
			return true;
	} else
		return false;
};
// 检查最大长度+非空
validateInput["t"] = function(v, num, info) {
	if ((v || "") != "") {
		if (v.length < 1) {
			Info_Tip("请输入" + info + ".");
			return false;
		}
		if (v.gblen() > parseInt(num)) {
			Info_Tip(info + "内容太多，请精简。");
			return false;
		} else
			return true;
	} else
		return false;
};

// combox年份数组
var year_array = [['2013','2013'],['2012','2012'],['2011','2011'],['2010', '2010'], ['2009', '2009'], ['2008', '2008'],
		['2007', '2007'], ['2006', '2006'], ['2005', '2005'], ['2004', '2004']];
// 季度数组
var season_array = [['03', '第一季度'], ['06', '第二季度'], ['09', '第三季度'],
		['12', '第四季度']];
// 月份数组
var month_array = [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
		['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'],
		['11', '11'], ['12', '12']];

/*
 * 读取服务返回权限
 */
var getAuthCode = function() {
	var ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/files/authcode.json"
						}),
				reader : new Ext.data.JsonReader({
							root : "result"
						}, []),
				autoLoad : true
			}).on("load", function(store, records) {
				currUser_mc_auth = store;
			});
};
/*
 * 比较权限 return true/false
 */
function compareAuth(v) {
	var auth = "";
	if (currUser_mc_auth) {
		this.currUser_mc_auth = currUser_mc_auth;
	} else {
		this.currUser_mc_auth = parent.currUser_mc_auth;
	}
	if (currUser_mc) {
		this.currUser_mc = currUser_mc;
	} else {
		this.currUser_mc = parent.currUser_mc;
	}
	// debugger;
	for (var i = 0; i < this.currUser_mc_auth.getCount(); i++) {
		var rec = this.currUser_mc_auth.getAt(i);
		if (!Ext.isEmpty(rec.json[v])) {
			auth = rec.json[v];
			break;
		}
	}
	if (this.currUser_mc.auth.indexOf(auth) == -1)

		return true;// 找不到返回false
	else
		return false;// 找到返回true
};

// 隐藏元素
var hideEl = function(el) {
	Ext.fly(el).setVisibilityMode(Ext.Element.DISPLAY);
	Ext.fly(el).setVisible(false);
};

// 显示元素
var showEl = function(el) {
	Ext.fly(el).setVisibilityMode(Ext.Element.DISPLAY);
	Ext.fly(el).setVisible(true);
};

// 地区配对
var areaAccess = {
	pricem : '全国',
	p1 : "广东",
	p2 : "广西",
	p3 : "北京",
	p4 : "上海"
};

// 材料档次
var changeMatGrade = function(v) {
	switch (v) {
		case "1" :
			return "普通";
			break;
		case "2" :
			return "中等";
			break;
		case "3" :
			return "高等";
			break;
		case "4" :
			return "豪华";
	}
};

// 主材区域
var MainMatArea = [["中国", "中国"], ["广东", "广东"], ["网材网", "网材网"], ["深圳", "深圳"],["天津","天津"]];

// 前台已有站点
var webSite = [["cn", "中国"], ["gd", "广东"], ["gx", "广西"], ["sz", "深圳"],
		["wcw", "网材网"], ["tj", "天津"], ["sc", "四川"], ["hlj", "黑龙江"],
		["nmg", "内蒙古"]];
// 已有站点
var currSite = [["中国", "中国"], ["MC", "后台"], ["广东", "广东"], ["广西", "广西"],
		["深圳", "深圳"], ["网材网", "网材网"], ["天津", "天津"], ["四川", "四川"],
		["黑龙江", "黑龙江"], ["内蒙古", "内蒙古"]];
// 当前站点
var cur_website = [["中国", "中国"], ["网材网", "网材网"], ["广东", "广东"], ["广西", "广西"],
		["深圳", "深圳"], ["四川", "四川"]];
// 配置信息价可访问区域
var cur_site = [["广东", "广东"], ["广西", "广西"], ["四川", "四川"], ["北京", "北京"],
		["上海", "上海"], ["黑龙江", "黑龙江"], ["重庆", "重庆"], ["湖南", "湖南"]];

// 自定义时间验证(结束之间必须大于开始时间)
Ext.apply(Ext.form.VTypes, {

			daterange : function(val, field) {

				var date = field.parseDate(val);

				if (!date) {
					return;
				}

				if (field.startDateField
						&& (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
								.getTime()))) {

					var start = Ext.getCmp(field.startDateField);

					start.setMaxValue(date);

					start.validate();

					this.dateRangeMax = date;

				}

				else if (field.endDateField
						&& (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
								.getTime()))) {

					var end = Ext.getCmp(field.endDateField);

					end.setMinValue(date);

					end.validate();

					this.dateRangeMin = date;

				}

				/*
				 * 
				 * Always return true since we're only using this vtype to set
				 * the
				 * 
				 * min/max allowed values (these are tested for after the vtype
				 * test)
				 * 
				 */

				return true;

			}
		});

var changeLevel = function(v) {
	var temp = "无排名";
	switch (v) {
		case "50" :
			temp = "一级";
			break;
		case "40" :
			temp = "二级";
			break;
		case "30" :
			temp = "三级";
			break;
		case "20" :
			temp = "四级";
			break;
		case "10" :
			temp = "五级";
			break;
		case "0" :
			temp = "六级";
			break;

	}
	return temp;
};

// 权限替换勾选
function changeTake(v) {
	if (v)
		return "<div><span class='take_img' ></span>";
	else
		return "";
};

// 获得用户访问区域生成可选数组
function getUserWeb() {
	var area ;
	try{
		area = parent.currUser_mc.accessStie;
	}catch(e){
		area = currUser_mc.accessStie;
	}
	if (!Ext.isEmpty(area)) {
		var userWeb = "["
		if (area.indexOf(",") != -1) {
			var temp = area.split(",") || area.split(",");
			for (var i = 0; i < temp.length; i++) {
				userWeb += "['" + temp[i] + "','" + temp[i] + "'],"
			}
			userWeb = userWeb.slice(0, userWeb.lastIndexOf(","));
		} else
			userWeb += "['" + area + "','" + area + "']";
		userWeb += "]";
		return userWeb;
	} else
		return "[]";
};

// 日期比较封装
function dateSetup(date1, date2, field, sign) {
	var text = field + sign;
	if (date1 == "" && date2 != "")
		text += "~" + date2 + "~DIFF_EQUAL_LESS";
	else if (date1 != "" && date2 == "")
		text += date1 + "~~DIFF_EQUAL_GREATER";
	else if (date1 != "" && date2 != "")
		text += date1 + "~" + date2 + "~DIFF_BETWEEN";
	else
		text = "";
	return text;
};

// 拼装自定义搜索条件
function setUpCondition(obj) {
	this.obj = obj.getForm();
	var keys = [];
	var param = [];
	var text = "";
	var len = this.obj.items.keys.length;
	for (var i = 0; i < len; i++) {
		if (this.obj.items.keys[i].indexOf("#") == -1
				&& this.obj.items.keys[i].indexOf("$") == -1
				&& this.obj.items.keys[i].indexOf("&") == -1)// 当元素id存在#,$,&时则不进行添加
			keys.push(this.obj.items.keys[i]);
		if (this.obj.items.keys[i].indexOf("#") != -1
				&& this.obj.items.keys[i].indexOf("$") == -1
				&& this.obj.items.keys[i].indexOf("&") == -1)// 当元素存在$,&时不进行添加
			param.push(this.obj.items.keys[i].slice(0, this.obj.items.keys[i]
							.lastIndexOf("#")));
	}

	for (var i = 0; i < param.length; i++) {
		// if (this.obj.items.map[param[i] + "#"].xtype == "radio") {
		// text += param[i]
		// + '='
		// + obj.form
		// .findField(this.obj.items.map[param[i] + "#"].name)
		// .getGroupValue() + ";";
		// } else
		text += param[i] + '=' + this.obj.items.map[param[i] + "#"].getValue()
				+ ";";
	}
	text = text.slice(0, text.lastIndexOf(";")) + "#";
	for (var i = 0; i < keys.length; i++) {
		// if (this.obj.items.map[keys[i]].xtype == "radio") {
		// text += param[i]
		// + '='
		// + obj.form.findField(this.obj.items.map[keys[i]].name)
		// .getGroupValue() + ";";
		// } else
		text += keys[i] + '=' + this.obj.items.map[keys[i]].getValue() + ";";
	}
	// text = text.slice(0, text.lastIndexOf(";"));
	return text;
};

// 解析搜索器文本
function decodeSearchcontent(v) {
	var returnObj = [];
	var contents = "";
	if ((v || "") != "") {
		if (v.indexOf("#") != -1) {
			var text = v.split("#");
			var params = text[0];
			contents = text[1];

			params = params.toString().split(";");
			var param = {};

			for (var i = 0; i < params.length; i++) {
				if (params[i] != null || params[i] != undefined
						|| params[i] != "")
					param[params[i].split("=")[0]] = params[i].split("=")[1];
			}
			returnObj.push(param);// 参数对象
			contents = contents.split(";");
			var content = {};
			for (var i = 0; i < contents.length; i++) {
				if (contents[i] != null || contents[i] != undefined
						|| contents[i] != "")
					content[contents[i].split("=")[0]] = contents[i].split("=")[1];
			}
			returnObj.push(content);// content对象
			returnObj.push(text[1]);// content文本
		} else {
			contents = v.split(";");
			var content = {};
			for (var i = 0; i < contents.length; i++) {
				if (contents[i] != null || contents[i] != undefined
						|| contents[i] != "")
					content[contents[i].split("=")[0]] = contents[i].split("=")[1];
			}
			returnObj.push(content);// content对象
			returnObj.push(v);// content文本
		}
		return returnObj;
	} else
		Info_Tip("解析时传入参数失败，请联系开发人员。");

};

// 解析比较日期
function decodeDate(v, field, isParam) {
	var dateObj = {};

	if (v) {
		var temp = v.split("~");
		if (isParam) {
			dateObj[temp[0] + "&start"] = temp[1];
			dateObj[temp[0] + "&end"] = temp[2];
		} else {

			dateObj[field + "&start"] = temp[0];
			dateObj[field + "&end"] = temp[1];
		}
	} else
		dateObj = "";
	return dateObj;
};

// 询价时间段
var askDateRange = [['1', '已回复'], ['0', '所有未回复'], ['-1', '今天未回复'],
		['-3', '3天内未回复'], ['-7', '一周未回复'], ['-30', '30天未回复'], ['', '全部']];

// 相关单位类型
var departmentType = [['1', '甲方单位'], ['2', '设计单位'], ['3', '施工单位'],
		['4', '监理单位']];
// 相关单位类型转换
var changeDepartment = function(v) {
	switch (v) {
		case "1" :
			return "甲方单位";
			break;
		case "2" :
			return "设计单位";
			break;
		case "3" :
			return "施工单位";
			break;
		case "4" :
			return "监理单位";
			break;
	}
};

// 审核状态
var AuditType = [['', '所有'], ['1', '已审核'], ['0', '未审核']];

// 循环截断
var cycleTrim = function() {
};
cycleTrim.prototype = {
	temp_trim : '',
	cycleTrim : function(v, num) {
		var str_trim = "";
		if (v != null) {
			v = v.replace(/\n/g, "");
			if (v.length > num) {
				this.temp_trim += v.slice(0, num) + "<br/>";
				str_trim = v.slice(num);
				if (str_trim.length > num)
					this.cycleTrim(str_trim, num);
				else
					this.temp_trim += str_trim;
			} else
				this.temp_trim = v;
			return this.temp_trim;
		} else
			return "";
	},
	init : function() {
		this.temp_trim = '';
	}
};
// 去除空格导致？
var del_space = function(v) {
	if ((v || "") != "") {
		var temp = encodeURI(v);
		v = temp.replace(/(%C2%A0)/g, "");
		return decodeURI(v);
	} else
		return " ";

};

// 处理特殊符号
var handlerSpec = function(v) {
	if ((v || "") != "") {
		v = v.toString();
		v = v.replace(/,/g, "，");
		v = v.replace(/;/g, "；");
		v = v.replace(/~/g, "～");
		v = v.replace(/'/g, "‘");
		v = v.replace(/"/g, "”");
		return v;
	} else {
		return " ";
	}
};

// 标签类型
var label_type = [['1', '常量'], ['2', '变量']];

// 获取会员访问地区_包括全国
var getUser_WenProvince = function() {
	var zhcn = new Zhcn_Select();
	var temp = '';
	if (currUser_mc1 = undefined) {
		temp = currUser_mc.accessStie;
	} else {
		temp = parent.currUser_mc.accessStie;
	}

	if (temp == "ALL") {
		var pro = new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : cur_website
				});
	} else {
		var pro = new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : eval("(" + getUserWeb() + ")")
				});
	}
	return pro;
};

// 获取会员访问地区
var getUser_WenProvince_c = function() {
	var zhcn = new Zhcn_Select();
	var temp = '';
	if (currUser_mc != undefined) {
		temp = currUser_mc.accessStie;
	} else {
		temp = parent.currUser_mc.accessStie;
	}

	if (temp == "ALL") {
		var pro = new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : cur_website
				});
		var record = new Ext.data.Record({
					value : 'ALL',
					text : '全部'
				});
		pro.add(record);
	} else {
		var pro = new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : eval("(" + getUserWeb() + ")")
				});
	}
	return pro;
};

// 获取访问站点
var getAccessSite = function(bol) {
	if (!bol) {
		if (currUser_mc != undefined) {
			temp = currUser_mc.accessStie;
		} else {
			temp = parent.currUser_mc.accessStie;
		}
		if (temp == "ALL") {
			var pro = cur_website;
			pro.splice(0, 0, ["", "全部"]);
		} else {
			var pro = new Ext.data.ArrayStore({
						fields : ['value', 'text'],
						data : eval("(" + getUserWeb() + ")")
					});
		}
	} else {
		var pro = cur_website;
		pro.splice(0, 0, ["", "全部"]);
	}
	return pro;
};

// 转换访问区域
var changeWebProvince = function(v) {
	if ((v || "") != "") {
		if (v == "全国")
			return "全国";
		else
			return v;
	} else
		return "";
};
// 转换访问站点
var changeSite = function(v) {
	if ((v || "") != "") {
		if (v == "ALL")
			return "全部";
		else
			return v;
	} else
		return "";
};

function getUserWebSite() {
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else {
		webArea = parent.currUser_mc.webProvince;
		if (webArea == "全国")
			webArea = "广东";
	}
};

// 软件设置
var soft_Ware = [["", "无"], ["yeeda", "易达"]];

// 企业联系人
// 格式name:value,phone:value,mobile:value|name:value,phone:value,mobile:value
function readLinkMan(str) {
	if (!str)
		return null;
	var linkmans = [];
	var temps = str.split("|");
	for (var i = 0; i < temps.length; i++) {
		if (temps[i].indexOf(":") == -1) {
			continue;
		}
		var nodes = temps[i].split(",");
		var linkman = {};
		for (var j = 0; j < nodes.length; j++) {
			if (nodes[j].indexOf(":") == -1)
				continue;
			var pairs = nodes[j].split(":");
			linkman[pairs[0]] = pairs[1] ? pairs[1] : "";
		}
		linkmans.push(linkman);
	}
	return linkmans;
};

/**
 * 内容组装
 * 
 * @param arrays
 *            要进行组装的字段
 * @param type
 *            要进行组装的类型 暂只指支持纯文本输入，不包括radio,checkbox等输入
 */
function getPackData(arrays, type) {
	if (Ext.isEmpty(arrays)) {
		Info_Tip("请设组装内容的字段");
		return;
	}
	if (Ext.isEmpty(type)) {
		Info_Tip("请设组装内容的类型");
		return;
	}
	var len = arrays.length;
	switch (type) {
		case "content" :
			var content = "";
			for (var i = 0; i < len; i++) {
				content += arrays[i] + "~" + Ext.getCmp(arrays[i]).getValue()
						+ ";";
			}
			content = content.slice(0, content.lastIndexOf(";"));
			return content;
			break;
		case "param" :
			var param = "";
			for (var i = 0; i < len; i++) {
				param += arrays[i] + "=" + Ext.getCmp(arrays[i]).getValue()
						+ "&";
			}
			param = param.slice(0, param.lastIndexOf("&"));
			return param;
			break;

	}
};

/**
 * 通过form的key与map获取内容 form里的子项必须设置id
 * 
 * @param form
 *            目标控件
 * @param type
 *            组装数据的类型 content;param
 * @param isBlank
 *            是否获取控件的空值
 * @param isShow
 *            获取控件的值 true：获取可见控件的值 false 获取不可见控件的值
 */
function getDataPack_form(form, type, isBlank, isShow) {
	if (Ext.isEmpty(form)) {
		Info_Tip("请传入form");
		return;
	}
	if (Ext.isEmpty(type)) {
		Info_Tip("请传入type");
		return;
	}
	var thisform = form.items;
	var len = thisform.length;
	var d = data_Type(type)["d"];
	var e = data_Type(type)["e"];
	var content = [];
	if (isBlank) {
		if (isShow == true) {
			for (var i = 0; i < len; i++) {
				if (thisform.map[thisform.keys[i]].isVisible() == true)
					content[content.length] = thisform.keys[i] + d
							+ thisform.map[thisform.keys[i]].value;
			}
		} else if (isShow == false) {
			for (var i = 0; i < len; i++) {
				if (thisform.map[thisform.keys[i]].isVisible() == false)
					content[content.length] = thisform.keys[i] + d
							+ thisform.map[thisform.keys[i]].value;
			}
		} else {
			for (var i = 0; i < len; i++) {
				content[content.length] = thisform.keys[i] + d
						+ thisform.map[thisform.keys[i]].value;
			}
		}
	} else {
		if (isShow == true) {
			for (var i = 0; i < len; i++) {
				if (!Ext.isEmpty(thisform.map[thisform.keys[i]].value)
						&& thisform.map[thisform.keys[i]].isVisible() == true) {
					content[content.length] = thisform.keys[i] + d
							+ thisform.map[thisform.keys[i]].value;
				}
			}
		} else if (isShow == false) {
			for (var i = 0; i < len; i++) {
				if (!Ext.isEmpty(thisform.map[thisform.keys[i]].value)
						&& thisform.map[thisform.keys[i]].isVisible() == false) {
					content[content.length] = thisform.keys[i] + d
							+ thisform.map[thisform.keys[i]].value;
				}
			}
		} else {

			for (var i = 0; i < len; i++) {
				if (!Ext.isEmpty(thisform.map[thisform.keys[i]].value))
					content[content.length] = thisform.keys[i] + d
							+ thisform.map[thisform.keys[i]].value;
			}
		}
	}
	return content.join().replace(/,/g, e);
};

/**
 * 以默认form.getValues(true)的方式获取数据 缺陷是获取select的显示值
 * 
 * @param form
 * @param type
 *            content;param
 */
function getDataPake_default(form, type) {
	if (Ext.isEmpty(form)) {
		Info_Tip("请传入form");
		return;
	}
	if (Ext.isEmpty(type)) {
		Info_Tip("请传入type");
		return;
	}
	switch (type) {
		case "content" :
			return decodeURI(form.getValues(true)).replace(/=/g, "~").replace(
					/&/g, ";");
		case "param" :
			return decodeURI(form.getValues(true));
		default :
			return "";
	}
};

/**
 * 根据field在form内查找值
 * 
 * @param form
 * @param fields
 *            array
 * @param type
 *            content;param
 */
var getDataPake_field = function(form, fields, type) {
	var obj = data_Type();
	var content = [];
	for (var i = 0; i < fields.length; i++) {
		content.push(fields[i]
				+ obj["d"]
				+ ((Ext.isEmpty(comp_Type(form.items.map[fields[i]])) == true)
						? ""
						: comp_Type(form.items.map[fields[i]])));
	}
	return content.join().replace(/,/g, obj["e"]);
};

/**
 * 根据获取控件类型,返回值
 * 
 * @param compoment
 */
function comp_Type(comp) {
	var type = comp.xtype;
	switch (type) {
		case "textarea" :
			return comp.getValue();
			break;
		default :
			return comp.value;

	}
};
// 参数类型选择
function data_Type(type) {
	var v = {};
	switch (type) {
		case "content" :
			v["d"] = "~";
			v["e"] = ";";
			break;
		case "param" :
			v["d"] = "=";
			v["e"] = "&";
			break;
		default :
			v["d"] = "~";
			v["e"] = ";";
	}
	return v;
};

/**
 * 自定义验证非空
 * 
 * @param form
 * @param isShow
 *            验证哪种控件 true:只验证可见控件 false:全部验证
 */
var validateForm = function(form, isShow) {
	var thisform = form.items;
	var len = thisform.length;
	var bol=false;
	for (var i = 0; i < len; i++) {
		if (isShow) {
			if (thisform.map[thisform.keys[i]].isVisible() == true) {
				if (Ext.isEmpty(comp_Type(thisform.map[thisform.keys[i]])))
					bol= true;
			}
		} else {
			if (Ext.isEmpty(comp_Type(thisform.map[thisform.keys[i]])))
				bol= true;
		}
	}
	return bol;
};

/*
 * 
 * 
 * 
 * size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key, value)
 * 向MAP中增加元素（key, value) remove(key) 删除指定KEY的元素，成功返回True，失败返回False get(key)
 * 获取指定KEY的元素值VALUE，失败返回NULL element(index)
 * 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL containsKey(key)
 * 判断MAP中是否含有指定KEY的元素 containsValue(value) 判断MAP中是否含有指定VALUE的元素 values()
 * 获取MAP中所有VALUE的数组（ARRAY） keys() 获取MAP中所有KEY的数组（ARRAY）
 * 
 * 
 * 
 */
function Map() {
	this.elements = new Array();

	// 获取MAP元素个数
	this.size = function() {
		return this.elements.length;
	};

	// 判断MAP是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	};

	// 删除MAP所有元素
	this.clear = function() {
		this.elements = new Array();
	};

	// 向MAP中增加元素（key, value)
	this.put = function(_key, _value) {
		this.elements.push({
					key : _key,
					value : _value
				});
	};

	// 删除指定KEY的元素，成功返回True，失败返回False
	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	// 获取指定KEY的元素值VALUE，失败返回NULL
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	};

	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	};

	// 判断MAP中是否含有指定KEY的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	// 判断MAP中是否含有指定VALUE的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	// 获取MAP中所有VALUE的数组（ARRAY）
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	};

	// 获取MAP中所有KEY的数组（ARRAY）
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	};
};

// 生成已有站点checkbox
function Sites_checkbox() {
	var len = webSite.length;
	var tempObj = [];
	for (var i = 0; i < len; i++) {
		var sites = webSite[i].toString().split(",");
		tempObj.push({
					layout : 'form',
					bodyStyle : "border:none;",
					width : 140,
					items : {
						xtype : "checkbox",
						id : sites[0],
						boxLabel : sites[1],
						name : 'curSite',
						inputValue : (sites[1].toString().indexOf("-") != -1)
								? (sites[1].split("-")[1])
								: sites[1]
					}
				});
	}
	return tempObj;
};
// 生成区域checkbox
function province_checkbox() {
	var zhcn = new Zhcn_Select();
	var provinces = zhcn.getProvince(true);
	var len = provinces.length;
	var tempObj = [];
	for (var i = 0; i < len; i++) {
		tempObj.push({
					layout : 'form',
					bodyStyle : "border:none;",
					items : {
						xtype : "checkbox",
						boxLabel : provinces[i],
						name : 'webProvince_checkbox',
						inputValue : provinces[i]
					}
				});
	}
	return tempObj;
};

/**
 * 拼装数组 输入参数格式 ["xx","xx"] 输出格式 [["xx"],["xx"]]
 */
function setArray_array(array) {
	var len = array.length;
	var array_fa = [];
	var array_sub = null;
	for (var i = 0; i < len; i++) {
		array_sub = [];
		array_sub.push(array[i]);
		array_fa.push(array_sub);
	}
	return array_fa;
};
/**
 * 拼装数组
 * 
 * @param obj
 * @return [["",""],["",""]]
 */
function serArray_obj(obj) {
	var temp = [];
	for (var i in obj) {
		temp.push([i, obj[i]]);
	}
	return temp;
};

// 新闻已有站点标识
var newsSite = ["gd", "gx", "cn", "sz", "sc"];
var newsSite_name = {
	"gd" : "广东",
	"gx" : "广西",
	"cn" : "中国",
	"sz" : "深圳",
	"sc" : "四川"
};
// 转换已有站点标识
function changeNewSite(sign, v) {
	if (sign && v) {
		if (v == "1")
			return newsSite_name[sign];
		else
			return "";
	}
};

// zjt积分计划配置项
var jifenConfig = {
	"mod_Ask" : 2000,
	"mod_Mat" : 2000,
	"mod_Proj" : 2000,
	"mod_Sup" : 100,
	"mod_Sup_Cat" : 2,
	"mod_Sys" : 2,
	"mod_Users" : 5
};

var jf_type = {
	"0" : "自定义规则",
	"1" : "系统自动应用的规则",
	"2" : "手动操作的规则",
	"3" : "兑换积分的规则"
};

/**
 * 关闭标签页
 * 
 * @param id
 *            标签id
 */
function closeTab(id) {
	if (parent.Ext.getCmp("center")) {
		parent.Ext.getCmp('center').remove(id);
	} else
		Ext.getCmp('center').remove(id);
};

/**
 * 获取图片相对路径
 * 
 * @param path
 * @param size
 *            80;160;230
 * @param isSite
 *            是否加ftp站点
 */
var getImgUrl = function(path, size, isSite) {
	if (Ext.isEmpty(path)) {
		Info_Tip("请输入图片路径");
		return;
	}
	var temp = path.split("/");
	var url = temp.slice(3).join();
	url = url.slice(0, url.lastIndexOf("."));
	var ext = path.slice(path.lastIndexOf(".") + 1);
	url = url.replace(/,/g, "/");
	var returnVal = "";
	switch (size) {
		case "80" :
			returnVal = "/" + url + "_80." + ext;
			break;
		case "160" :
			returnVal = "/" + url + "_160." + ext;
			break;
		case "230" :
			returnVal = "/" + url + "_230." + ext;
			break;
		default :
			returnVal = "/" + url + "." + ext;
	}
	if (isSite)
		return FileSite + returnVal;
	else
		return returnVal;

};

// 操作类型判定
function typeSel(v) {
	switch (v) {
		case "mod" :
			return "修改";
			break;
		case "del" :
			return "删除";
			break;
		default :
			return "";
	}
};

//显示商铺等级 degree:0 一级 星级商铺
function shopDegree(v){
	var shop = ["星级","黄金","钻石","皇冠"];
	var degree = ["一","二","三","四","五"];
	var i = v;
	parseInt(i)>20?i=20:i=i;
	parseInt(i)<0?i=0:i=i;
	var show = "";
	if(i==0){
		show = "没有等级";
	}
	else{
		show = degree[i%5==0?4:i%5-1]+"级"+shop[parseInt((i)/5)];
	}
	return show;
}

function getRegSite(){
	return [['造价通','造价通'],['网材网','网材网']];
}
//根据文档后缀取样式
function getWenkuIcon(suffix){
	if(suffix.indexOf("doc") != -1)
		return "ic_word";
	else if(suffix.indexOf("ppt") != -1)
		return "ic_ppt";
	else if(suffix.indexOf("xls") != -1)
		return "ic_excel";
	else if(suffix.indexOf("pot") != -1)
		return "ic_pot";
	else if(suffix.indexOf("pps") != -1)
		return "ic_pps";
	else if(suffix.indexOf("rtf") != -1)
		return "ic_rtf";
	else if(suffix.indexOf("bmp") != -1)
		return "ic_bmp";
	else if(suffix.indexOf("gif") != -1)
		return "ic_gif";
	else if(suffix.indexOf("jpg") != -1)
		return "ic_jpg";
	else if(suffix.indexOf("tif") != -1)
		return "ic_tif";
	else if(suffix.indexOf("png") != -1)
		return "ic_png";
	else if(suffix.indexOf("wps") != -1)
		return "ic_wps";
	else if(suffix.indexOf("et") != -1)
		return "ic_et";
	else if(suffix.indexOf("dps") != -1)
		return "ic_dps";
	else if(suffix.indexOf("pdf") != -1)
		return "ic_pdf";
	else if(suffix.indexOf("txt") != -1)
		return "ic_txt";
	else
		return "";
}
