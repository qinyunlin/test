<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<style>

.title{
font-family:宋体;
font-size:19px;
font-weight:bold;
font-style:normal;
text-decoration:none;
color:#000000;
margin-top:20px;
margin-bottom:20px;
margin-left:8px;
}

#grid{
   margin-top:20px;
}
#grid table tr{
width:auto;
font-family:宋体;font-size:13px;
}
#grid table tr td{
width:160px;
height:30px;
line-height:28px;
text-align:center;
font-family:宋体;font-size:13px;

}
.x-grid-back-color{
   background:#D1D1D1;
}
</style>
<link rel="stylesheet" type="text/css" href="/ext/UI/css/data-view.css" />
<link rel="stylesheet" type="text/css" href="/ext/UI/css/chooser.css" />
<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<link rel="stylesheet" type="text/css" href="/ext/UI/css/TipSelf.css" />
<script type="text/javascript" src="/ext/UI/TipSelf.js"></script>
<script type="text/javascript" src="/ext/UI/DataView-more.js"></script>
<script type="text/javascript" src="/ext/UI/RowExpander.js"></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
<div id="title"></div>
<div id="grid">
<!-- <table>
  <tr>
     <td></td>
     <td>总数</td>
     <td>普通</td>
     <td>中档</td>
     <td>中高档</td>
     <td>高档</td>
  </tr>
  <tr>
    <td id="area"></td>
    <td id="total"  onclick="" style="color:#0000FF;cursor:pointer"></td>
    <td id="ordinary"  onclick=")" style="color:#0000FF;cursor:pointer"></td>
    <td id="midRange"  onclick="" style="color:#0000FF;cursor:pointer"></td>
    <td id="midGrade"  onclick="" style="color:#0000FF;cursor:pointer"></td>
    <td id="highGrade"  onclick="" style="color:#0000FF;cursor:pointer"></td>
    
  </tr>
  
</table> -->

</div>
<div id="center"></div>
<div id="city" >
</div>
               
<script type="text/javascript" src="/resource/js/mat/govPrice_detail_list.js"></script>