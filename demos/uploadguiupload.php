<script type="text/javascript">
var url;

//下面两个代码流程，请根据具体项目情况选择其中一个并删除另外一个

//非跨域流程
url='test2.zip';//非跨域允许直接传输JSON对象
callbackDelay();
function callbackDelay(){
	if(window.callback)callback(url);
	else setTimeout(callbackDelay,1);
}
//跨域流程
/*
url='"test.zip"';//跨域只能传输JSON格式的字符串
callback(url);
function callback(v){
	window.name=escape(v);
	window.location='http://<?php echo $_POST['editorhost'];?>/xheditorproxy.html';//这个文件最好是一个0字节文件，如果无此文件也会正常工作
}
*/
</script>