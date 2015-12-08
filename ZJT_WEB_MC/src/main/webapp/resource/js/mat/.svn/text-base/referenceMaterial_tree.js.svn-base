var root,count="全部";
Ext.onReady(init);
var subcid = "";// 选中的二级分类ID
var upload_form;
var cityRingList = null;
var diffRatioList = null;
var currProCityList = null;

function init() {
	createArea();
	loadData(null);
};

function createArea(){
	Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
		params : {
			type : 2,
			content : "isDeleted~0"
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				count +="("+jsondata.result+")";
				//getData();
				buildTree();
				buildView();
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
}

//获得材料分类数据
function getData() {
	Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
		params : {
			type : 25
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				select_ds = "[";
				var len = jsondata.result.length;
				for ( var i = 0; i < len; i++) {
					
					select_ds += "['" + jsondata.result[i]["id"] + "','"
							+jsondata.result[i]["name"] + "','"+ jsondata.result[i]["govSum"]+"'],";
					
				}
				select_ds = select_ds.slice(0, select_ds.lastIndexOf(","));
				select_ds += "]";
				select_ds = select_ds.replace(/\s/g, "");
				select_ds = eval(select_ds);
				buildTree();
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
};

//创建材料分类树
function buildTree() {
	// 异步根节点
	root = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : count
	});
	// 树型控件
	tree = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/material/MaterialServlet.do?type=25'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:10px;',
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true
		//rootVisible : false
	});

	// 重新装配树型数据
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth") {
				Info_Tip("对不起，您暂时不能进行此操作。");
				o = [];
			} else if (o.state == "nologin") {
				Info_Tip("对不起，还未登录。");
				o = [];
			}
			node.beginUpdate();
			for ( var i = 0, len = o.length; i < len; i++) {
				var nodeName = o[i].name;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
					if ("-1" == nodeName){
						nodeName = "其它分类";
					}else{
						nodeName = getStuffName(nodeName);
					}
					if (nodeName.length > 8){
						nodeName = nodeName.substring(0, 8) + "...";
					}
				}
				
				/*if(o[i].isDeleted==1){
					o[i].text = "<font color='red'>" + nodeName +"("+o[i].govSum+")" + "</font>";
				}else{
					o[i].text = nodeName + "("+o[i].govSum+")";
				}*/
				o[i].text = nodeName + "("+o[i].govSum+")";
				
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [ node ]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	
	tree.on('beforeexpandnode', function(node) {
		node.select();
		if(!node.isLeaf()){
			var text = node.text.substring(0,node.text.indexOf("("));
			if(text != "全部"){
				loadCurrProCityList(node.id);
			}
		}
	});
	
	tree.on('beforecollapse', function(node) {
		//currProCityList = null;
	});

	// 点击节点事件
	tree.on('click', function(node) {
		//node.expand();
		node.select();
		if (node.isExpanded() && !node.isLeaf()){//true,展开
			var text = node.text.substring(0,node.text.indexOf("("));
			if(text=="全部"){
				ds.baseParams["province"] = "";
				ds.baseParams["cid"] = "";
				currProCityList = null;
				node.expand();
			}
			node.collapse();
			//currProCityList = null;
			return;
		}
		if(node.isLeaf()){
	           //node.id;
				id = node.id;
				ds.baseParams["province"] = node.parentNode.id;
				if ("-1" == node.id){ //其它分类(subcid='')
					ds.baseParams["cid"] = "-1";
				}else{
					ds.baseParams["cid"] = node.id.split("-")[1];
				}
				//ds.baseParams["isDeleted"] = "0";//默认加载有效参考材价
				loadCurrProCityList(node.parentNode.id);
				reBindGridData();
				//ds.load();
			}else{
				id = "ext-gen1";
				var text = node.text.substring(0,node.text.indexOf("("));
				if(text=="全部"){
					ds.baseParams["province"] = "";
					ds.baseParams["cid"] = "";
					currProCityList = null;
					node.expand();
					return;
				}
				ds.baseParams["cid"] = "";
				ds.baseParams["province"] = node.id;
				loadCurrProCityList(node.id);
				//ds.baseParams["isDeleted"] = "0";//默认加载有效参考材价
				reBindGridData();
				/*if(text=="全部"){
					ds.baseParams["cityCircleId"] =  "";
					ds.load();
				}*/
			}
			node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};

function loadData(province){
	var crData = {};
	//crData["type"] = "1";
	crData["type"] = "9";
	var crContent = "isDeleted~0";
	if (province != null && "" != province){
		crContent += ";province~" + province;
	}
	crData["content"] = crContent;
	$.ajax({
		type : 'POST',
		url : '/cityRingServlet',
		async : false,
		data : crData,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			cityRingList = data.result;
		}
	});
	var drData = {};
	drData["type"] = "29";
	drData["byUtil"] = "1";
	if (province != null && "" != province){
		drData["province"] = province;
	}
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : drData,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			diffRatioList = data.result;
		}
	});
}

function loadCurrProCityList(province){
	if (province == null || "" == province || cityRingList == null) currProCityList = null;
	currProCityList = [];
	for (var i = 0,j = cityRingList.length; i < j; i ++){
		var cityRing = cityRingList[i];
		var currPro = cityRing["province"];
		if (province == currPro){
			currProCityList.push(cityRing);
		}
	}
}

function getCityNameById(cityId){
	if (cityRingList == null || cityId == null || "" == cityId) return "";
	for (var i = 0,j = cityRingList.length; i < j; i ++){
		var cityRing = cityRingList[i];
		var cityName = cityRing["name"];
		var currCityId = cityRing["id"];
		if (cityId == currCityId) return cityName;
	}
}

function getDiffRatioByProvinceAndCid(province, cid){
	if (diffRatioList == null || province == null || "" == cid) return null;
	for (var i = 0,j = diffRatioList.length; i < j; i ++){
		var dr = diffRatioList[i];
		if (province == dr["province"] && cid == dr["cid"]) return dr;
	}
	return null;
}

