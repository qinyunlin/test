/**
 * 材料专题分类 
 */
var stuff_zhuanti={
	"节能环保" : ['节能灯', '节电器' ,'过滤器', '水处理器', '换热器'],
	"配电装置" : ['开关', '插座', '配电箱', '电气柜', '变压器', '配电屏'],
	"园林苗木" : ['乔木', '花卉', '地棕', '地被', '盆灌', '地灌', '藤本'],
	"家具" 	   : ['办公家具', '实验室家具', '厨房家具', '餐厅家具', '酒店家具']
};
 //得到所有材料专题分类
 //ext-store-data用到(不包括所有) 数据格式['value','text']
 function getStuff_zhuanti(){
 	var array = [];
	for(var c in stuff_zhuanti){
		array.push(['/' + c + '/', " ├ " + c]);
		for(var z = 0; z < stuff_zhuanti[c].length; z++){
			array.push(['/' + c + '/' + stuff_zhuanti[c][z] + '/', " │  ├ " + stuff_zhuanti[c][z]]);
		}
	}
	return array;
 };
 
  //得到所有材料专题分类
 //ext-store-data用到(包括所有) 数据格式['value','text']
 function getAllStuff_zhuanti(){
 	var array = [];
 	array.push(["", "未分类"]);
	for(var c in stuff_zhuanti){
		array.push(['/' + c + '/', " ├ " + c]);
		for(var z = 0; z < stuff_zhuanti[c].length; z++){
			array.push(['/' + c + '/' + stuff_zhuanti[c][z] + '/', " │  ├ " + stuff_zhuanti[c][z]]);
		}
	}
	return array;
 };