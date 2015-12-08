/*
 * 非标材料分类
 */
 var stuff_feibiao=[["装饰","装饰"],["机电","机电"],["安防","安防"],["市政","市政"]];
 
 //得到非标分类(包括所有)
 function getAllStuff_feibiao(){
 	var array = [];
 	array.push(['', '未分类']);
 	for(var i = 0; i < stuff_feibiao.length; i++)
 		array.push([stuff_feibiao[i][1],stuff_feibiao[i][1]]);
 	return array;
 };
 
  //得到非标分类(不包括所有)
 function getStuff_feibiao(){
 	return stuff_feibiao;
 };