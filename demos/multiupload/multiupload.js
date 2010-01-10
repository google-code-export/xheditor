var swfu,selQueue=[],arrUrl=[],allSize=0,uploadSize=0;
function formatBytes(bytes) {
	var s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
	var e = Math.floor(Math.log(bytes)/Math.log(1024));
	return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
}
function removeAllFiles()
{
	var file;
	for(i in selQueue)
	{
		file=selQueue[i];
		swfu.cancelUpload(file.id);
		delete selQueue[file.id];
		$('#'+file.id).remove();
	}
	allSize=0;
	$('#controlBtns').hide();
}
function startUploadFiles()
{
	if(swfu.getStats().files_queued)
	{
		$('#controlBtns').hide();
		swfu.startUpload();
	}
	else alert('上传前请先添加文件');
}
function setFileState(file,txt)
{
	$('#'+file.id+'_state').text(txt);
}
function fileQueued(file)//队列添加成功
{
	if(selQueue.length==0)$('#controlBtns').show();
	selQueue[file.id]=file;
	allSize+=file.size;
	$('#listBody').append('<tr id="'+file.id+'"><td>'+file.name+'</td><td>'+formatBytes(file.size)+'</td><td id="'+file.id+'_state">就绪</td></tr>');
}
function fileQueueError(file, errorCode, message)//队列添加失败
{
	var errorName='';
	switch (errorCode)
	{
		case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
			errorName = "只能同时上传 "+this.settings.file_upload_limit+" 个文件";
			break;
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			errorName = "选择的文件超过了当前大小限制："+this.settings.file_size_limit;
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			errorName = "零大小文件";
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			errorName = "文件扩展名必需为："+this.settings.file_types_description+" ("+this.settings.file_types+")";
			break;
		default:
			errorName = "未知错误";
			break;
	}
	alert(errorName);
}
function uploadStart(file)//单文件上传开始
{
	setFileState(file,'上传中…');
}
function uploadProgress(file, bytesLoaded, bytesTotal)//单文件上传进度
{
	var percent=Math.ceil((uploadSize+bytesLoaded)/allSize*100);
	$('#progressBar span').text(percent+'% ('+formatBytes(uploadSize+bytesLoaded)+' / '+formatBytes(allSize)+')');
	$('#progressBar div').css('width',percent+'%');
}
function uploadSuccess(file, serverData)//单文件上传成功
{
	var data;
	try{eval("data=" + serverData);}catch(ex){};
	if(data.err!=undefined&&data.msg!=undefined)
	{
		uploadSize+=file.size;
		var url=data.msg;
		setFileState(file,'上传成功');
		arrUrl.push(url);
	}
	else setFileState(file,'上传失败！');
}
function uploadError(file, errorCode, message)//单文件上传错误
{
	setFileState(file,'上传失败！');
}
function uploadComplete(file)//文件上传周期结束
{
	if(swfu.getStats().files_queued)swfu.startUpload();
	else uploadAllComplete();
}
function uploadAllComplete()//全部文件上传成功
{
	var strUrl=arrUrl.join('|');
	strUrl='!'+strUrl;
	callback(strUrl);
}