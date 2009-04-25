/*!
 * xhEditor - WYSIWYG XHTML Editor
 * @requires jQuery v1.3.2(fixed)
 * 
 * @author Yanis.Wang<yanis.wang@gmail.com>
 * @site http://pirate9.com/
 * @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
 * 
 * @Version: 0.9.1 build 090425
 */
(function($){
$.fn.xhEditor=function(bInit,options)
{
	return this.each(function(){
		if(this.tagName.toLowerCase()!='textarea')return;
		if(bInit)//初始化
		{
			if(!this.xhEditor)
			{
				var editor=new $.xhEditor(this,options);
				if(editor.init())this.xhEditor=editor;			
				else editor=null;	
			}
		}
		else//卸载
		{
			if(this.xhEditor)
			{
				this.xhEditor.remove();
				this.xhEditor=null;
			}
		}
	});
}
var xCount=0,isIE=$.browser.msie,isMozilla=$.browser.mozilla,isSafari=$.browser.safari,bShowPanel=false;
var _jPanel,_jCntLine,_jPanelButton;
var baseURL,jsURL;
baseURL=window.location.href.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]*$/, '');
baseURL+= '/';
var script=$('script[src$=xheditor.js]');
if(script.size()==1)
{
	jsURL=script[0].src.replace(/[\?#].*$/, '').replace(/(^|[\/\\])[^\/]*$/, '');
	if(jsURL!='')jsURL+= '/';
}
var specialKeys={ 27: 'esc', 9: 'tab', 32:'space', 13: 'return', 8:'backspace', 145: 'scroll', 
          20: 'capslock', 144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'del',
          35:'end', 33: 'pageup', 34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down', 
          112:'f1',113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 
          120:'f9', 121:'f10', 122:'f11', 123:'f12' };
var itemColors=['#FFFFFF','#E5E4E4','#D9D8D8','#C0BDBD','#A7A4A4','#8E8A8B','#827E7F','#767173','#5C585A','#000000','#FEFCDF','#FEF4C4','#FEED9B','#FEE573','#FFED43','#F6CC0B','#E0B800','#C9A601','#AD8E00','#8C7301','#FFDED3','#FFC4B0','#FF9D7D','#FF7A4E','#FF6600','#E95D00','#D15502','#BA4B01','#A44201','#8D3901','#FFD2D0','#FFBAB7','#FE9A95','#FF7A73','#FF483F','#FE2419','#F10B00','#D40A00','#940000','#6D201B','#FFDAED','#FFB7DC','#FFA1D1','#FF84C3','#FF57AC','#FD1289','#EC0078','#D6006D','#BB005F','#9B014F','#FCD6FE','#FBBCFF','#F9A1FE','#F784FE','#F564FE','#F546FF','#F328FF','#D801E5','#C001CB','#8F0197','#E2F0FE','#C7E2FE','#ADD5FE','#92C7FE','#6EB5FF','#48A2FF','#2690FE','#0162F4','#013ADD','#0021B0','#D3FDFF','#ACFAFD','#7CFAFF','#4AF7FE','#1DE6FE','#01DEFF','#00CDEC','#01B6DE','#00A0C2','#0084A0','#EDFFCF','#DFFEAA','#D1FD88','#BEFA5A','#A8F32A','#8FD80A','#79C101','#3FA701','#307F00','#156200','#D4C89F','#DAAD88','#C49578','#C2877E','#AC8295','#C0A5C4','#969AC2','#92B7D7','#80ADAF','#9CA53B'];
var arrFontname=['宋体','黑体','楷体','隶书','幼圆','Arial','Arial Narrow','Arial Black','Comic Sans MS','Courier','System','Times New Roman','Verdana'];
var arrFontsize=[{n:'xx-small',wkn:'x-small',s:'8pt',t:'极小'},{n:'x-small',wkn:'small',s:'10pt',t:'特小'},{n:'small',wkn:'medium',s:'12pt',t:'小'},{n:'medium',wkn:'large',s:'14pt',t:'中'},{n:'large',wkn:'x-large',s:'18pt',t:'大'},{n:'x-large',wkn:'xx-large',s:'24pt',t:'特大'},{n:'xx-large',wkn:'-webkit-xxx-large',s:'36pt',t:'极大'}];
var menuAlign=[{s:'左对齐',v:'justifyleft',t:'左对齐'},{s:'居中',v:'justifycenter',t:'居中'},{s:'右对齐',v:'justifyright',t:'右对齐'},{s:'两端对齐',v:'justifyfull',t:'两端对齐'}],menuList=[{s:'数字列表',v:'insertOrderedList',t:'数字列表'},{s:'符号列表',v:'insertunorderedlist',t:'符号列表'}];
var htmlPastetext='<div>使用键盘快捷键(Ctrl+V)把内容粘贴到方框里，按 确定</div><div><textarea id="xhEdtPastetextValue" wrap="soft" spellcheck="false" style="width:300px;height:100px;" /></div><div style="text-align:right;"><input type="button" id="xhEdtSave" value="确定" /></div>';
var htmlLink='<div>链接地址: <input type="text" id="xhEdtLinkHref" value="http://" /></div><div>打开方式: <select id="xhEdtLinkTarget"><option selected="selected" value="">默认</option><option value="_blank">新窗口</option><option value="_self">当前窗口</option><option value="_parent">父窗口</option></select></div><div style="text-align:right;"><input type="button" id="xhEdtSave" value="确定" /></div>';
var htmlImg='<div>图片地址：<input type="text" id="xhEdtImgSrc" value="http://" /></div><div>替换文本：<input type="text" id="xhEdtImgAlt" /></div><div>对齐方式：<select id="xhEdtImgAlign"><option selected="selected" value="">默认</option><option value="left">左对齐</option><option value="right">右对齐</option><option value="top">顶端</option><option value="middle">居中</option><option value="baseline">基线</option><option value="bottom">底边</option></select></div><div>宽度高度：<input type="text" id="xhEdtImgWidth" style="width:40px;" /> x <input type="text" id="xhEdtImgHeight" style="width:40px;" /></div><div>边框大小：<input type="text" id="xhEdtImgBorder" style="width:40px;" /></div><div>水平间距：<input type="text" id="xhEdtImgVspace" style="width:40px;" /> 垂直间距：<input type="text" id="xhEdtImgHspace" style="width:40px;" /></div><div style="text-align:right;"><input type="button" id="xhEdtSave" value="确定" /></div>';
var htmlFlash='<div>动画地址：<input type="text" id="xhEdtFlashSrc" value="http://" /></div><div>宽度高度：<input type="text" id="xhEdtFlashWidth" style="width:40px;" value="412" /> x <input type="text" id="xhEdtFlashHeight" style="width:40px;" value="300" /></div><div style="text-align:right;"><input type="button" id="xhEdtSave" value="确定" /></div>';
var htmlMedia='<div>视频地址：<input type="text" id="xhEdtMediaSrc" value="http://" /></div><div>宽度高度：<input type="text" id="xhEdtMediaWidth" style="width:40px;" value="412" /> x <input type="text" id="xhEdtMediaHeight" style="width:40px;" value="300" /></div><div style="text-align:right;"><input type="button" id="xhEdtSave" value="确定" /></div>';
var htmlAbout='<div style="width:200px;word-wrap:break-word;word-break:break-all;"><p><span style="font-size:20px;color:#1997DF;">xhEditor</span><br />版本：v0.9.1 build 20090425</p><p>xhEditor是一个基于jQuery开发的跨平台开源XHTML编辑器组件。</p><p><a href="http://xheditor.googlecode.com/" target="_blank">http://xheditor.googlecode.com/</a></p></div><div style="text-align:right;"><input type="button" id="xhEdtSave" value="确定" /></div>';
var itemEmots=[{t:'Big grin',s:'biggrin.gif'},{t:'Smile',s:'smile.gif'},{t:'Titter',s:'titter.gif'},{t:'Lol',s:'lol.gif'},{t:'Call',s:'call.gif'},{t:'Victory',s:'victory.gif'},{t:'Shy',s:'shy.gif'},{t:'Handshake',s:'handshake.gif'},{t:'Kiss',s:'kiss.gif'},{t:'Sad',s:'sad.gif'},{t:'Cry',s:'cry.gif'},{t:'Huffy',s:'huffy.gif'},{t:'Mad',s:'mad.gif'},{t:'Tongue',s:'tongue.gif'},{t:'Sweat',s:'sweat.gif'},{t:'Shocked',s:'shocked.gif'},{t:'Time',s:'time.gif'},{t:'Hug',s:'hug.gif'}];
var arrTools={GStart:{},GEnd:{},Separator:{},Cut:{t:'剪切 (Ctrl+X)'},Copy:{t:'复制 (Ctrl+C)'},Paste:{t:'粘贴 (Ctrl+V)'},Pastetext:{t:'粘贴文本'},Fontface:{t:'字体'},FontSize:{t:'字号'},Bold:{t:'加粗 (Ctrl+B)',s:'Ctrl+B'},Italic:{t:'斜体 (Ctrl+I)',s:'Ctrl+I'},Underline:{t:'下划线 (Ctrl+U)',s:'Ctrl+U'},Strikethrough:{t:'中划线 (Ctrl+S)',s:'Ctrl+S'},FontColor:{t:'字体颜色'},BackColor:{t:'背景颜色'},Removeformat:{t:'删除文字格式'},Align:{t:'对齐'},List:{t:'编号'},Outdent:{t:'减少缩进'},Indent:{t:'增加缩进'},Link:{t:'超链接'},Unlink:{t:'取消超链接'},Img:{t:'图片'},Flash:{t:'Flash动画'},Media:{t:'视频'},Emot:{t:'表情'},Html:{t:'Html源代码 (Ctrl+H)',s:'Ctrl+H'},Preview:{t:'预览'},Fullscreen:{t:'全屏编辑 (Esc)',s:'Esc'},About:{t:'关于 xhEditor'}};
var toolsThemes={
	mini:'GStart,Bold,Italic,Underline,Strikethrough,GEnd,Separator,GStart,Align,List,GEnd,Separator,GStart,Link,Img,About,GEnd',
	simple:'GStart,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,GEnd,Separator,GStart,Align,List,Outdent,Indent,GEnd,Separator,GStart,Link,Img,Emot,About,GEnd',
full:'GStart,Cut,Copy,Paste,Pastetext,GEnd,Separator,GStart,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,Removeformat,GEnd,Separator,GStart,Align,List,Outdent,Indent,GEnd,Separator,GStart,Link,Unlink,Img,Flash,Media,Emot,GEnd,Separator,GStart,Html,Preview,Fullscreen,About,GEnd'};
$.xhEditor=function(textarea,options)
{
	var defaults={skin:'default',tools:'full',clearScript:true,clearStyle:true};
	var _this=this,_text=textarea,_jText=$(_text),_jForm=_jText.closest('form'),_jTools,_win,_jWin,_doc,_jDoc;
	var bookmark;
	var bInit=false,bHtml=false,bPreview=false,bFullscreen=false,sLayoutStyle='',ev;
	var settings=$.extend({},defaults,options );
	if(settings.tools.match(/^\s*(mini|simple|full)\s*$/i))
	{
		settings.tools=$.trim(settings.tools);
		settings.tools=toolsThemes[settings.tools];
	}
	if(!settings.tools.match(/(^|,)\s*About\s*(,|$)/i))settings.tools+=',About';
	settings.tools=settings.tools.split(',');
	
	//基本控件名
	var idCSS='xhEdtCSS_'+settings.skin,idContainer='xhEdt'+xCount+'_container',idTools='xhEdt'+xCount+'_Tool',idIframeArea='xhEdt'+xCount+'_iframearea',idIframe='xhEdt'+xCount+'_iframe';
	
	var arrShortCuts=[];
	
	this.init=function()
	{
		//加载样式表
		if($('#'+idCSS).size()==0)$('head').append('<link id="'+idCSS+'" rel="stylesheet" type="text/css" href="'+jsURL+'xheditor_skin/'+settings.skin+'/ui.css" />');

		//初始化编辑器
		var cw = settings.width || _text.style.width || _text.offsetWidth,ch = settings.height || _text.style.height || _text.offsetHeight;
		var re = /^[0-9\.]+(|px)$/i;
		if(re.test(''+cw))cw+='px';
		var th=24;//tool高度
		_jText.after($('<span id="'+idContainer+'" class="xhEdt_'+settings.skin+'" style="display:none"><table cellspacing="0" cellpadding="0" class="xhEdtLayout" style="width:'+cw+';height:'+ch+'px;"><tbody><tr><td id="'+idTools+'" class="xhEdtTool" style="height:'+th+'px"></td></tr><tr><td id="'+idIframeArea+'"class="xhEdtIframeArea"><iframe frameborder="0" id="'+idIframe+'" src="javascript:;" style="width:100%" /></td></tr></tbody></table></span>'));

		_win=$('#'+idIframe)[0].contentWindow;
		_jWin=$(_win);
		try{
			_doc = _win.document;_jDoc=$(_doc);
			_doc.open();
			_doc.write('<html><head><base href="'+baseURL+'"/><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><link rel="stylesheet" href="'+jsURL+'xheditor_skin/'+settings.skin+'/iframe.css"/>');
			if(settings.loadCSS)_doc.write('<link rel="stylesheet" href="'+settings.loadCSS+'"/>');
			_doc.write('</head><body dir="ltr" spellcheck="false" class="editMode"></body></html>');
			_doc.close();
			if(isIE)_doc.body.contentEditable='true';
			else
			{
				_doc.designMode = 'On';
				setTimeout(_this.setOpts,300);
			}
			_this.setHTML();
		}catch(e){}
		//初始化工具栏
		var sToolHtml='',tool;
		sToolHtml+='<table cellspacing="0" cellpadding="0"><tbody><tr>';
		$.each(settings.tools,function(i,n)
		{
			tool=arrTools[n];
			if(n=='GStart')sToolHtml+='<td><span class="xhEdtGStart"/></td>';
			else if(n=='GEnd')sToolHtml+='<td><span class="xhEdtGEnd"/></td>';
			else if(n=='Separator')sToolHtml+='<td><span class="xhEdtSeparator"/></td>';
			else
			{
				sToolHtml+='<td><a href="javascript:;" title="'+tool.t+'" name="'+n+'" class="xhEdtButton xhEdtEnabled"><span class="xhEdtIcon xhEdtBtn'+n+'"/></a></td>';
				if(tool.s)_this.addShortCut(tool.s,n);
			}
		});
		sToolHtml+='</tr></tbody></table>';
		_jTools=$('#'+idTools).append(sToolHtml).click(function(){_this.focus();});
		_jTools.find('.xhEdtButton').click(function(event)
		{
			_this.hidePanel();
			_this.focus();
			ev=event;
			var aButton=$(this);
			if(aButton.is('.xhEdtEnabled'))_this.exec(aButton.attr('name'));
			ev.stopPropagation();
		}).mousedown(function(){return false;});
		//初始化面板
		_jPanel=$('#xhEdtPanel');
		_jCntLine=$('#xhEdtCntLine');
		if(_jPanel.size()==0)
		{
			_jPanel=$('<div id="xhEdtPanel"></div>').mousedown(function(ev){ev.stopPropagation()});
			_jCntLine=$('<div id="xhEdtCntLine"><img src="'+jsURL+'xheditor_skin/'+settings.skin+'/img/spacer.gif" /></div>');
			$(document.body).append(_jPanel).append(_jCntLine);
		}
		$(document).mousedown(_this.hidePanel);
		_jDoc.mousedown(_this.hidePanel);
		//修正IE光标丢失
		if(isIE)
		{
			_jDoc.bind('beforedeactivate',function(){if(!bHtml)bookmark=_this.getRng();});
			_jWin.focus(function(){if(bookmark&&!bHtml){bookmark.select();bookmark=null;}});
		}
		//切换显示区域
		$('#'+idContainer).show();
		_jText.hide();
		_this.bind();
		xCount++;
		if(settings.fullscreen)_this.toggleFullscreen();
		bInit=true;
		return true;
	}
	this.remove=function()
	{
		_this.unbind();
		$('#'+idContainer).remove();
		_jText.show();
		bInit=false;
	}
	this.bind=function()
	{
		_jWin.blur(_this.getHTML);
		if(isSafari)_jWin.click(_this.fixAppleSel);
		_jForm.submit(_this.getHTML).bind('reset', _this.setHTML);
		var jpWin=$(window);
		jpWin.unload(_this.getHTML).bind('beforeunload', _this.getHTML);
		jpWin.resize(_this.fixFullHeight);
		_jDoc.keydown(_this.checkShortCut);
	}
	this.unbind=function()
	{
		_jWin.unbind('blur',_this.getHTML);
		if(isSafari)_jWin.unbind('click',_this.fixAppleSel);
		_jForm.unbind('submit',_this.getHTML).unbind('reset', _this.setHTML);
		var jpWin=$(window);
		jpWin.unbind('unload',_this.getHTML).unbind('beforeunload', _this.getHTML);
		jpWin.unbind('resize',_this.fixFullHeight);
		_jDoc.unbind('keydown',_this.checkShortCut);
	}
	this.setCSS=function(css)
	{
		try{_this._exec('styleWithCSS',css);}
		catch(e){_this._exec('useCSS',!css);}
	}
	this.setOpts=function()
	{
		if(bInit)
		{
			_this.setCSS(false);
			try{_this._exec('enableObjectResizing',true);}catch(e){}
			try{_this._exec('enableInlineTableEditing',false);}catch(e){}
			if(isIE)try{_this._exec('BackgroundImageCache',true);}catch(e){}
		}
	}
	this.fixFullHeight=function()
	{
		if(!isMozilla&&!isSafari)
		{
			var jArea=$('#idIframeArea');
			jArea.height('100%');
			if(bFullscreen)jArea.height((jArea.height()-30)+'px');
		}
	}
	this.fixAppleSel=function(e)
	{
		e=e.target;
		if(e.tagName.match(/(img|embed)/i))
		{
			var sel=_this.getSel(),rng=_doc.createRange();
			rng.selectNode(e);
			sel.removeAllRanges();
			sel.addRange(rng);
		}
	}
	this.focus=function()
	{
		if(!bHtml)_jWin.focus();
		else $('#htmlSource',_doc).focus();
	}
	this.getSel=function()
	{
		return _win.getSelection ? _win.getSelection() : _doc.selection;
	}
	this.getRng=function()
	{
		var sel=_this.getSel(),rng;
		try{
			rng = sel.rangeCount > 0 ? sel.getRangeAt(0) : (sel.createRange ? sel.createRange() : _doc.createRange());
		}catch (ex){}
		if(!rng)rng = isIE ? _doc.body.createTextRange() : _doc.createRange();	
		return rng;
	}
	this.getParent=function(tag)
	{
		var rng=_this.getRng(),p;
		if(!isIE)
		{
			p = rng.commonAncestorContainer;
			if(!rng.collapsed)if(rng.startContainer == rng.endContainer&&rng.startOffset - rng.endOffset < 2&&rng.startContainer.hasChildNodes())p = rng.startContainer.childNodes[rng.startOffset];
		}
		else p=rng.item?rng.item(0):rng.parentElement();
		tag=tag?tag:'*';p=$(p);
		if(!p.is(tag))p=$(p).closest(tag);
		return p;
	}
	this.pasteHTML=function(html)
	{
		if(bHtml||bPreview)return false;
		_this.focus();
		var rng=_this.getRng();
		if(rng.insertNode)
		{
			rng.deleteContents();
			rng.insertNode(rng.createContextualFragment(html));
		}
		else
		{
			if(rng.item)
			{
				_this._exec('delete');
				rng=_this.getRng();
			}
			rng.pasteHTML(html);
		}
	}
	this.pasteText=function(text)
	{
		if(!text)text='';
		text=_this.domEncode(text);
		text = text.replace(/\r?\n/g, '<br />');
		_this.pasteHTML(text);
	}
	this.domEncode=function(str)
	{
		if(str)
		{
			var filter={'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'};
			str=str.replace(/[&"<>]/g,function(c){return filter[c];});
		}
		return str;
	}
	this.setHTML=function(sHtml)
	{
		setTimeout(function(){
			bookmark=null;
			if(typeof sHtml!='string'&&sHtml!='')sHtml=_jText.val();
			sHtml=_this.formatXHTML(sHtml);
			if(bHtml)$('#htmlSource',_doc).val(sHtml);
			else $(_doc.body)[0].innerHTML=_this.processHTML(sHtml,'write');
			},10);
	}
	this.processHTML=function(sHtml,mode)
	{
		var appleClass=' class="Apple-style-span"';
		if(mode=='write')
		{//write
			if(isMozilla)
			{
				sHtml = sHtml.replace(/<(\/?)strong( [^>]+)?>/ig,'<$1b$2>');
				sHtml = sHtml.replace(/<(\/?)em( [^>]+)?>/ig,'<$1i$2>');	
			}
			else if(isSafari)
			{
				sHtml = sHtml.replace(/("|;)\s*font-size\s*:\s*([a-z-]+);/ig,function(all,pre,sname){
					var t,s;
					for(var i=0;i<arrFontsize.length;i++)
					{
						t=arrFontsize[i];
						if(sname==t.n){s=t.wkn;break;}
					}
					return pre+'font-size:'+s;
				});
				sHtml = sHtml.replace(/<(\/?)strong( [^>]+)?>/ig,'<$1span'+appleClass+' style="font-weight: bold;"$2>');
				sHtml = sHtml.replace(/<(\/?)em( [^>]+)?>/ig,'<$1span'+appleClass+' style="font-style: italic;"$2>');
				sHtml = sHtml.replace(/<(\/?)u( [^>]+)?>/ig,'<$1span'+appleClass+' style="text-decoration: underline;"$2>');
				sHtml = sHtml.replace(/<(\/?)strike( [^>]+)?>/ig,'<$1span'+appleClass+' style="text-decoration: line-through;"$2>');
				sHtml = sHtml.replace(/<span((?:\s+[^>]+)?\s+style="([^"]*;)*\s*(font-family|font-size|color|background-color)\s*:\s*[^;"]+\s*;?"[^>]*)>/ig,'<span'+appleClass+'$1>');
			}
			else if(isIE)
			{
				sHtml = sHtml.replace(/&apos;/ig, '&#39;');
				sHtml = sHtml.replace(/\s+(disabled|checked|readonly|selected)\s*=\s*[\"\']?(false|0)[\"\']?/ig, '');
			}
			sHtml = sHtml.replace(/<a(\s+[^>]+)?\/>/,'<a$1></a>');
			
			if(!isSafari)
			{
				//style转font
				for(var i=0;i<3;i++)sHtml = sHtml.replace(/<(span)(?:\s+[^>]+)? style="((?:[^"]*?;)*\s*(?:font-family|font-size|color)\s*:[^"]*)"(?: [^>]+)?>(((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,function(all,tag,style,content){
					var attrs='',f,s1,s2,c;
					f=style.match(/font-family\s*:\s*([^;"]+)/i);
					if(f)attrs+=' face="'+f[1]+'"';
					s1=style.match(/font-size\s*:\s*([a-z-]+)/i);
					if(s1)
					{
						for(var j=0;j<arrFontsize.length;j++)if(s1[1]==arrFontsize[j].n){s2=j+1;break;}
						style=style.replace(/(^|;)(\s*font-size\s*:\s*[^;"]+;?)+/ig,'$1');
					}
					if(s2)attrs+=' size="'+s2+'"';
					c=style.match(/color\s*:\s*([^;"]+)/i);
					if(c)attrs+=' color="'+c[1]+'"';
					style=style.replace(/(^|;)(\s*(font-family|color)\s*:\s*[^;"]+;?)+/ig,'$1');
					if(attrs!='')
					{
						if(style)attrs+=' style="'+style+'"';
						return '<font'+attrs+'>'+content+"</font>";
					}
					else return all;
				});
			}
		}
		else
		{//read
			if(isSafari)
			{
				sHtml = sHtml.replace(/("|;)\s*font-size\s*:\s*([a-z-]+);/ig,function(all,pre,sname){
					var t,s;
					for(var i=0;i<arrFontsize.length;i++)
					{
						t=arrFontsize[i];
						if(sname==t.wkn){s=t.n;break;}
					}
					return pre+'font-size:'+s;
				});
				var arrAppleSpan=[{r:/font-weight:\sbold/ig,t:'strong'},{r:/font-style:\sitalic/ig,t:'em'},{r:/text-decoration:\sunderline/ig,t:'u'},{r:/text-decoration:\sline-through/ig,t:'strike'}];
				for(var i=0;i<6;i++)sHtml = sHtml.replace(/<(span)(\s+[^>]+|)? class="Apple-style-span"(\s+[^>]+|)?>(((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,function(all,tag,attr1,attr2,content){
					var attr=attr1+attr2,newTag='';
					for(var i=0;i<arrAppleSpan.length;i++)
					{
						if(attr.match(arrAppleSpan[i].r))
						{
							newTag=arrAppleSpan[i].t;
							break;
						}
					}
					if(newTag)return '<'+newTag+'>'+content+'</'+newTag+'>';
					else return all;
				});
			}
			sHtml = sHtml.replace(/\s*(-moz-|-webkit-)[^=]+?=\s*"[^"]*"/ig,'');
			sHtml = sHtml.replace(/<(\w+[^>]*?)\s+class="?(?:apple|webkit)\-[^ >]*([^>]*?)>/ig, "<$1$2>");
		}
		return sHtml;
	}
	this.getHTML=function()
	{
		var sHtml;
		if(bHtml)sHtml=$('#htmlSource',_doc).val();
		else
		{
			sHtml=_this.processHTML($(_doc.body).html(),'read');
			sHtml=_this.cleanWord(sHtml);
		}
		sHtml=_this.cleanHTML(sHtml);
		sHtml=_this.formatXHTML(sHtml);
		_jText.val(sHtml);
		return sHtml;
	}	
	this.cleanWord=function(sHtml)
	{
		if(sHtml.match(/class="?mso/i))
		{
			//区块清理
			sHtml = sHtml.replace(/<!--([\s\S]*?)-->|<style(\s+[^>]+)?>[\s\S]*?<\/style>/ig, "");
			sHtml = sHtml.replace(/<(meta|link)(\s+[^>]+)?>/ig, "");
			sHtml = sHtml.replace(/<\??xml(:\w+)?( [^>]+)?>([\s\S]*?<\/xml>)?/ig, "");
			sHtml = sHtml.replace(/<\/?\w+:[^>]*>/ig, "");
			
			//属性清理
			sHtml = sHtml.replace(/<(\w+[^>]*?)\s+class="?mso[^ >]*([^>]*?)>/ig, "<$1$2>");//删除所有mso开头的样式
			sHtml = sHtml.replace(/<(\w+[^>]*?)\s+lang="?[^ \>]*([^>]*?)>/ig, "<$1$2>");//删除lang属性
			sHtml = sHtml.replace(/<(\w+[^>]*?)\s+align="?left"?([^>]*?)>/ig, "<$1$2>");//取消align=left
			//sHtml = sHtml.replace(/<(\w+[^>]*?) style="?[^">]+"?([^>]*?)>/ig, "<$1$2>");//删除所有style
			
			//样式清理
			sHtml = sHtml.replace(/\s*mso-[^:]+:[^;"]+;?\s*/ig,'');
			sHtml = sHtml.replace(/\s*margin: 0cm 0cm 0pt\s*;\s*/ig,'');
			sHtml = sHtml.replace(/\s*margin: 0cm 0cm 0pt\s*"/ig,'"');
			sHtml = sHtml.replace(/\s*text-align:[^;"]+;?\s*/ig,'');
			sHtml = sHtml.replace(/\s*font-variant:[^;"]+;?\s*/ig,'');
			sHtml = sHtml.replace(/<(\w+[^>]*?) style="?"?( |>)/ig,'<$1$2');
		}
		return sHtml;
	}
	this.cleanHTML=function(sHtml)
	{
		if(settings.clearScript)sHtml = sHtml.replace(/<script(\s+[^>]+)?>[\s\S]*?<\/script>/ig, '');
		if(settings.clearStyle)sHtml = sHtml.replace(/<style(\s+[^>]+)?>[\s\S]*?<\/style>/ig, '');

		for(var i=0;i<3;i++)sHtml=sHtml.replace(/<(span|strong|b|u|strike|em|i)(\s+[^>]+)?>((?!<\1)[ \t\r\n])*?<\/\1>/ig,'');//内部空白的标签：<span|b|u|s|i> </b>
		for(var i=0;i<3;i++)sHtml=sHtml.replace(/<(span)>(((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,'$2');//无意义标签:<span>aaa</span>
		
		sHtml = sHtml.replace(/<(p|div)(?:\s+[^>]+)?>(((?!<\1(?: [^>]+)?>)[\s\S])+?)<\/\1>/ig,function(all,tag,content){//p内空白显示
			var temp=content.replace(/<\/?(span|strong|b|u|strike|em|i)(\s+[^>]+)?>/ig,'');
			temp=temp.replace(/([ \t\r\n]|&nbsp;)+/ig,'');
			if(temp!='')return all;
			else return '<'+tag+'></'+tag+'>';
			});
		
		sHtml=sHtml.replace(/^\s+/g,'');//开头换行
		sHtml=sHtml.replace(/[\r\n]+/g,"\r\n");//多行变一行
		sHtml=sHtml.replace(/\s+$/g,'');//结尾换行
		
		return sHtml;
	}
	this.formatXHTML=function(sHtml)
	{//HTML Parser By John Resig (ejohn.org)
		var emptyTags = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");	
		var blockTags = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");
		var inlineTags = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");
		var closeSelfTags = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
		var fillAttrsTags = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");
		var specialTags = makeMap("script,style");
		var tagReplac={'b':'strong','i':'em','s':'strike'};
		var startTag = /^<(\w+(?:\:\w+)?)((?:\s+[\w-(?:\:\w+)?]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
		var endTag = /^<\/(\w+(?:\:\w+)?)[^>]*>/;
		var attr = /([\w-(?:\:\w+)?]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
		var index,chars,stack=[],last=sHtml,text='',results=[];
		stack.last = function(){return this[ this.length - 1 ];};
		while(sHtml)
		{
			chars = true;
			if(!stack.last()||!specialTags[stack.last()])
			{
				if(sHtml.indexOf("<!") == 0 )
				{//注释标签
					match = sHtml.match(/^<!(?:--)?(.*?)(?:--)?>/);
					if(match)
					{
						sHtml = sHtml.substring( match[0].length );
						results.push('<!--'+match[1]+'-->');
						chars = false;
					}
				}
				else if(sHtml.indexOf("</")== 0)
				{//结束标签
					match = sHtml.match( endTag );
					if(match)
					{
						sHtml = sHtml.substring( match[0].length );
						match[0].replace( endTag, parseEndTag );
						chars = false;
					}
				}
				else if(sHtml.indexOf("<")==0)
				{//开始标签
					match = sHtml.match( startTag );
					if(match)
					{
						sHtml = sHtml.substring( match[0].length );
						match[0].replace( startTag, parseStartTag );
						chars = false;
					}
				}
				if(chars)
				{
					index = sHtml.indexOf("<");
					text = index < 0 ? sHtml : sHtml.substring( 0, index );
					sHtml = index < 0 ? "" : sHtml.substring( index );
					results.push(text);
				}
			}
			else
			{//处理style和script
				sHtml=sHtml.replace(/^([\s\S]*?)<\/(?:style|script)>/i, function(all, text){
					results.push(text);
					return '';
				});
				parseEndTag('',stack.last());
			}
			if(sHtml==last)
			{
				parseEndTag();
				return results.join('')
			}
			last = sHtml;
		}
		parseEndTag();
		function makeMap(str)
		{
			var obj = {}, items = str.split(",");
			for ( var i = 0; i < items.length; i++ )obj[ items[i] ] = true;
			return obj;
		}
		function processTag(tagName)
		{
			if(tagName)
			{
				tagName=tagName.toLowerCase();
				var tag=tagReplac[tagName];
				if(tag)tagName=tag;
			}
			else tagName='';
			return tagName;
		}
		function parseStartTag( tag, tagName, rest, unary )
		{
			tagName=processTag(tagName);
			if (blockTags[tagName])while(stack.last()&&inlineTags[stack.last()])parseEndTag("",stack.last());
			if(closeSelfTags[tagName]&&stack.last()==tagName )parseEndTag("",tagName);
			unary = emptyTags[ tagName ] || !!unary;
			if (!unary)stack.push(tagName);
			results.push("<" + tagName);
			rest.replace(attr, function(match, name)
			{
				name=name.toLowerCase();
				var value = arguments[2] ? arguments[2] :
						arguments[3] ? arguments[3] :
						arguments[4] ? arguments[4] :
						fillAttrsTags[name] ? name : "";
				if(value)results.push(" "+name+'="'+value.replace(/(^|[^\\])"/g, '$1\\\"')+'"');
			});
			results.push((unary ? "/" : "") + ">");
		}
		function parseEndTag(tag, tagName)
		{
			if(!tagName)var pos = 0;
			else
			{
				tagName=processTag(tagName);
				for(var pos=stack.length-1;pos>=0;pos--)if(stack[pos]==tagName)break;
			}
			if(pos>=0)
			{
				for(var i=stack.length-1;i>=pos;i--)results.push("</" + stack[i] + ">");
				stack.length=pos;
			}
		}
		sHtml=results.join('');
		
		//font转style
		for(var i=0;i<3;i++)sHtml = sHtml.replace(/<(font)(\s+[^>]+|)?>(((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S]|<\1>((?!<\1>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,function(all,tag,attrs,content){
			var styles='',f,s,c,style;
			f=attrs.match(/ face\s*=\s*"\s*([^"]+)\s*"/i);
			if(f)styles+='font-family:'+f[1]+';';
			s=attrs.match(/ size\s*=\s*"\s*(\d+)\s*"/i);
			if(s)styles+='font-size:'+arrFontsize[s[1]-1].n+';';
			c=attrs.match(/ color\s*=\s*"\s*([^"]+)\s*"/i);
			if(c)styles+='color:'+c[1]+';';
			style=attrs.match(/ style\s*=\s*"\s*([^"]+)\s*"/i);
			if(style)styles+=style[1];
			if(styles)content='<span style="'+styles+'">'+content+'</span>';
			return content;
		});
			
		return sHtml;
	}
	this.toggleHtml=function(state)
	{
		if(bPreview||bHtml===state)return;
		if(bShowPanel)_this.hidePanel();
		var jBody=$(_doc.body),sHtml=_this.getHTML();
		if(!bHtml)
		{//转为源代码模式	
			if(isIE)_doc.body.contentEditable='false';
			else _doc.designMode = 'Off';
			jBody.attr('scroll','no').attr('class','sourceMode').html('<textarea id="htmlSource" wrap="soft" spellcheck="false" />');
			var jHtmlSource=jBody.find('#htmlSource');
			jHtmlSource.val(sHtml).blur(_this.getHTML);
		}
		else
		{//转为编辑模式
			if(isIE)_doc.body.contentEditable='true';
			else
			{
				_doc.designMode = 'On';
				setTimeout(_this.setOpts,300);
			}
			jBody.removeAttr('scroll').attr('class','editMode');
			jBody[0].innerHTML=_this.processHTML(sHtml,'write');
		}
		bHtml=!bHtml
		_jTools.find('[name=Html]').toggleClass('xhEdtActive');
		_jTools.find('.xhEdtButton').not('[name=Html],[name=Fullscreen]').toggleClass('xhEdtEnabled');
	}
	this.togglePreview=function(state)
	{
		if(bHtml||bPreview===state)return;
		var jBody=$(_doc.body);
		if(!bPreview)
		{//转预览模式
			if(isIE)_doc.body.contentEditable='false';
			else _doc.designMode = 'Off';
			jBody.attr('class','previewMode');		
			jBody[0].innerHTML=jBody.html();
		}
		else
		{//转编辑模式
			if(isIE)_doc.body.contentEditable='true';
			else
			{
				_doc.designMode = 'On';
				setTimeout(_this.setOpts,300);
			}
			jBody.attr('class','editMode');
			jBody[0].innerHTML=jBody.html();
		}
		bPreview=!bPreview;
		_jTools.find('[name=Preview]').toggleClass('xhEdtActive');
		_jTools.find('.xhEdtButton').not('[name=Preview],[name=Fullscreen]').toggleClass('xhEdtEnabled');
	}
	this.toggleFullscreen=function(state)
	{
		if(bFullscreen===state)return;
		if(bShowPanel)_this.hidePanel();
		var jLayout=$('#'+idContainer).find('.xhEdtLayout'),jContainer=$('#'+idContainer);
		if(bFullscreen)
		{//取消全屏
			jLayout.attr('style',sLayoutStyle);
			$('.xhEdtIframeArea').height('100%');
		}
		else
		{//显示全屏
			sLayoutStyle=jLayout.attr('style');
			jLayout.removeAttr('style');
			setTimeout(_this.fixFullHeight,100);
		}
		bFullscreen=!bFullscreen;
		jContainer.toggleClass('xhEdt_Fullscreen');
		$('html').toggleClass('xhEdt_Fullfix');
		_jTools.find('[name=Fullscreen]').toggleClass('xhEdtActive');
	}
	this.addShortCut=function(key,cmd)
	{
		arrShortCuts[key.toLowerCase()]=cmd;
	}
	this.checkShortCut=function(event)
	{
		if(bHtml)return true;
		ev = event;
		var code=ev.which,special=specialKeys[code],sChar=special?special:String.fromCharCode(code).toLowerCase();
		sKey='';
		sKey+=ev.ctrlKey?'ctrl+':'';sKey+=ev.altKey?'alt+':'';sKey+=ev.shiftKey?'shift+':'';sKey+=sChar;
		
		if(arrShortCuts[sKey])
		{
			_this.exec(arrShortCuts[sKey]);
			return false;
		}
	}
	this.showMenu=function(menuitems,callback)
	{
		var jMenu=$('<div class="xhEdtMenu"></div>'),jItem;
		$.each(menuitems,function(n,v){
			jItem=$('<a href="javascript:;" title="'+v.t+'">'+v.s+'</a>').click(function(){_this.focus();callback(v.v);_this.hidePanel();}).mousedown(function(){return false;});
			jMenu.append(jItem);
		});
		_this.showPanel(jMenu);
	}
	this.showColor=function(callback)
	{
		var jColor=$('<div class="xhEdtColor"></div>'),jLine,jItem,c=0;
		jLine=$('<div></div>');
		$.each(itemColors,function(n,v)
		{
			c++;
			jItem=$('<a href="javascript:;" title="'+v+'" style="background:'+v+'"><img src="'+jsURL+'xheditor_skin/'+settings.skin+'/img/spacer.gif" /></a>').click(function(){_this.focus();callback(v);_this.hidePanel();}).mousedown(function(){return false;});
			jLine.append(jItem);
			if(c%10==0)
			{
				jColor.append(jLine);
				jLine=$('<div></div>');
			}	
		});
		jColor.append(jLine);
		_this.showPanel(jColor);
	}
	this.showPastetext=function()
	{
		var jPastetext=$('<div class="xhEdtDialog"></div>');
		jPastetext.append(htmlPastetext);
		var jValue=$('#xhEdtPastetextValue',jPastetext),jSave=$('#xhEdtSave',jPastetext);
		jSave.click(function(){
			_this.focus();
			var sValue=jValue.val();
			if(sValue)_this.pasteText(sValue);
			_this.hidePanel();
			return false;
		});
		_this.showPanel(jPastetext);
	}
	this.showLink=function()
	{
		var jLink=$('<div class="xhEdtDialog"></div>');
		jLink.append(htmlLink);

		var jParent=_this.getParent('a'),jHref=$('#xhEdtLinkHref',jLink),jTarget=$('#xhEdtLinkTarget',jLink),jSave=$('#xhEdtSave',jLink);
		if(jParent.size()==1)
		{
			jHref.val(jParent.attr('href'));
			jTarget.attr('value',jParent.attr('target'));
		}
		jSave.click(function(){
			_this.focus();
			var url=jHref.val();
			if(url==''||jParent.size()==0)_this._exec('unlink');
			if(url!='')
			{
				if(jParent.size()==0)
				{
					_this._exec('createlink','#xhedt_tempurl');
					jParent=$('a[href$="#xhedt_tempurl"]',_doc);
				}
				jParent.attr('href',url);
				if(jTarget.val()!='')jParent.attr('target',jTarget.val());
				else jParent.removeAttr('target');
			}
			_this.hidePanel();
			return false;
		});
		_this.showPanel(jLink);
	}
	this.showImg=function()
	{
		var jImg=$('<div class="xhEdtDialog"></div>');
		jImg.append(htmlImg);
		var jParent=_this.getParent('img'),jSrc=$('#xhEdtImgSrc',jImg),jAlt=$('#xhEdtImgAlt',jImg),jAlign=$('#xhEdtImgAlign',jImg),jWidth=$('#xhEdtImgWidth',jImg),jHeight=$('#xhEdtImgHeight',jImg),jBorder=$('#xhEdtImgBorder',jImg),jVspace=$('#xhEdtImgVspace',jImg),jHspace=$('#xhEdtImgHspace',jImg),jSave=$('#xhEdtSave',jImg);
		if(jParent.size()==1)
		{
			jSrc.val(jParent.attr('src'));
			jAlt.val(jParent.attr('alt'));
			jAlign.val(jParent.attr('align'));
			jWidth.val(jParent.attr('width'));
			jHeight.val(jParent.attr('height'));
			jBorder.val(jParent.attr('border'));
			var vspace=jParent.attr('vspace'),hspace=jParent.attr('hspace');
			jVspace.val(vspace<0?0:vspace);
			jHspace.val(hspace<0?0:hspace);
		}
		jSave.click(function(){
			_this.focus();
			var url=jSrc.val();
			if(url!='')
			{
				if(jParent.size()==0)
				{
					_this._exec('insertimage','#xhedt_tempurl');
					jParent=$('img[src$="#xhedt_tempurl"]',_doc);
				}
				jParent.attr('src',url);
				if(jAlt.val()!='')jParent.attr('alt',jAlt.val());
				else jParent.removeAttr('alt');
				if(jAlign.val()!='')jParent.attr('align',jAlign.val());
				else jParent.removeAttr('align');
				if(jWidth.val()!='')jParent.attr('width',jWidth.val());
				else jParent.removeAttr('width');
				if(jHeight.val()!='')jParent.attr('height',jHeight.val());
				else jParent.removeAttr('height');
				if(jBorder.val()!='')jParent.attr('border',jBorder.val());
				else jParent.removeAttr('border');
				if(jVspace.val()!='')jParent.attr('vspace',jVspace.val());
				else jParent.removeAttr('vspace');
				if(jHspace.val()!='')jParent.attr('hspace',jHspace.val());
				else jParent.removeAttr('hspace');
			}
			else if(jParent.size()==1)jParent.remove();
			_this.hidePanel();
			return false;			
		});
		_this.showPanel(jImg);
	}
	this.showFlash=function()
	{
		var jFlash=$('<div class="xhEdtDialog"></div>');
		jFlash.append(htmlFlash);
		var jParent=_this.getParent('embed[classid="clsid:d27cdb6e-ae6d-11cf-96b8-4445535400000"]'),jSrc=$('#xhEdtFlashSrc',jFlash),jWidth=$('#xhEdtFlashWidth',jFlash),jHeight=$('#xhEdtFlashHeight',jFlash),jSave=$('#xhEdtSave',jFlash);
		if(jParent.size()==1)
		{
			jSrc.val(jParent.attr('src'));
			jWidth.val(jParent.attr('width'));
			jHeight.val(jParent.attr('height'));
		}
		jSave.click(function(){
			_this.focus();
			var sSrc=jSrc.val();
			if(sSrc!='')
			{
				if(jParent.size()==0)
				{
					_this.pasteHTML('<embed tyle="application/x-shockwave-flash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-4445535400000" src="#xhedt_tempurl" wmode="opaque" quality="high" bgcolor="#ffffff" menu="false" play="true" loop="true" />');
					jParent=$('embed[src$="#xhedt_tempurl"]',_doc);
				}
				jParent.attr('src',sSrc);
				var w=jWidth.val(),h=jHeight.val(),reg=/^[0-9]+$/;
				if(!reg.test(w))w=412;if(!reg.test(h))h=300;
				jParent.attr('width',w);
				jParent.attr('height',h);
			}
			else if(jParent.size()==1)jParent.remove();
			_this.hidePanel();
			return false;	
		});
		_this.showPanel(jFlash);
	}
	this.showMeida=function()
	{
		var jMedia=$('<div class="xhEdtDialog"></div>');
		jMedia.append(htmlMedia);
		var jParent=_this.getParent('embed[classid="clsid:6bf52a52-394a-11d3-b153-00c04f79faa6"]'),jSrc=$('#xhEdtMediaSrc',jMedia),jWidth=$('#xhEdtMediaWidth',jMedia),jHeight=$('#xhEdtMediaHeight',jMedia),jSave=$('#xhEdtSave',jMedia);
		if(jParent.size()==1)
		{
			jSrc.val(jParent.attr('src'));
			jWidth.val(jParent.attr('width'));
			jHeight.val(jParent.attr('height'));
		}
		jSave.click(function(){
			_this.focus();
			var sSrc=jSrc.val();
			if(sSrc!='')
			{
				if(jParent.size()==0)
				{
					_this.pasteHTML('<embed type="application/x-mplayer2" classid="clsid:6bf52a52-394a-11d3-b153-00c04f79faa6" src="#xhedt_tempurl" enablecontextmenu="false" autostart="false" />');
					jParent=$('embed[src$="#xhedt_tempurl"]',_doc);
				}
				jParent.attr('src',sSrc);
				var w=jWidth.val(),h=jHeight.val(),reg=/^[0-9]+$/;
				if(!reg.test(w))w=412;if(!reg.test(h))h=300;
				jParent.attr('width',w);
				jParent.attr('height',h);
			}
			else if(jParent.size()==1)jParent.remove();
			_this.hidePanel();
			return false;	
		});
		_this.showPanel(jMedia);
	}
	this.showEmot=function()
	{
		var jEmot=$('<div class="xhEdtEmot"></div>'),jLine,jItem,c=0,sEmotPath=jsURL+'xheditor_emot/';
		jLine=$('<div></div>');
		$.each(itemEmots,function(n,v)
		{
			c++;
			jItem=$('<a href="javascript:;" title="'+v.t+'"><img src="'+sEmotPath+v.s+'" /></a>').click(function(){_this.focus();_this._exec('insertimage',sEmotPath+v.s);_this.hidePanel();}).mousedown(function(){return false;});
			jLine.append(jItem);
			if(c%6==0)
			{
				jEmot.append(jLine);
				jLine=$('<div></div>');
			}			
		});
		jEmot.append(jLine);
		_this.showPanel(jEmot);
	}
	this.showAbout=function()
	{
		var jAbout=$('<div class="xhEdtDialog"></div>');
		jAbout.append(htmlAbout);
		var jSave=$('#xhEdtSave',jAbout);
		jSave.click(function(){
			_this.focus();
			_this.hidePanel();
			return false;	
		});
		_this.showPanel(jAbout);
	}
	this.showPanel=function(content)
	{
		if(bShowPanel)_this.hidePanel();
		_jPanel.empty().append(content);
		_jPanelButton=$(ev.target).closest('a');
		var xy=_jPanelButton.offset();
		var x=xy.left,y=xy.top;y+=_jPanelButton.height();
		_jPanelButton.addClass('xhEdtActive');
		_jCntLine.css('left',x+1).css('top',y).show();
		_jPanel.css('left',x).css('top',y).show();
		bShowPanel=true;
	}
	this.hidePanel=function(){if(bShowPanel){_jPanelButton.removeClass('xhEdtActive');_jCntLine.hide();_jPanel.hide();bShowPanel=false;}}
	this.exec=function(cmd)
	{
		cmd=cmd.toLowerCase();
		switch(cmd)
		{
			case 'cut':
				try{_doc.execCommand(cmd);if(!_doc.queryCommandSupported(cmd))throw 'Error';}
				catch(ex){alert('您的浏览器安全设置不允许使用剪切操作，请使用键盘快捷键(Ctrl + X)来完成');};
				break;
			case 'copy':
				try{_doc.execCommand(cmd);if(!_doc.queryCommandSupported(cmd))throw 'Error';}
				catch(ex){alert('您的浏览器安全设置不允许使用复制操作，请使用键盘快捷键(Ctrl + C)来完成');}
				break;
			case 'paste':
				try{_doc.execCommand(cmd);if(!_doc.queryCommandSupported(cmd))throw 'Error';}
				catch(ex){alert('您的浏览器安全设置不允许使用粘贴操作，请使用键盘快捷键(Ctrl + V)来完成');}
				break;
			case 'pastetext':
				if(window.clipboardData)_this.pasteText(window.clipboardData.getData('Text', true));
				else _this.showPastetext();
				break;
			case 'fontface':
				var menuFontname=[];
				$.each(arrFontname,function(n,v){menuFontname.push({s:'<span style="font-family:'+v+'">'+v+'</span>',v:v,t:v});});
				_this.showMenu(menuFontname,function(v){_this._exec('fontname',v);});
				break;
			case 'fontsize':
				var menuFontsize=[];
				$.each(arrFontsize,function(n,v){menuFontsize.push({s:'<span style="font-size:'+v.s+'">'+v.t+'('+v.s+')</span>',v:n+1,t:v.t});});
				_this.showMenu(menuFontsize,function(v){_this._exec('fontsize',v);});
				break;
			case 'fontcolor':
				_this.showColor(function(v){_this._exec('forecolor',v);});
				break;
			case 'backcolor':
				_this.showColor(function(v){if(isIE)_this._exec('backcolor',v);else{_this.setCSS(true);_this._exec('hilitecolor',v);_this.setCSS(false);}});
				break;
			case 'align':
				_this.showMenu(menuAlign,function(v){_this._exec(v);});
				break;
			case 'list':
				_this.showMenu(menuList,function(v){_this._exec(v);});
				break;
			case 'link':
				_this.showLink();
				break;
			case 'img':
				_this.showImg();		
				break;
			case 'flash':
				_this.showFlash();
				break;
			case 'media':
				_this.showMeida();
				break;
			case 'emot':
				_this.showEmot();
				break;
			case 'html':
				_this.toggleHtml();
				break;
			case 'preview':
				_this.togglePreview();
				break;
			case 'fullscreen':
				_this.toggleFullscreen();
				break;
			case 'about':
				_this.showAbout();
				break;
			default:
				_this._exec(cmd);
				break;
		}
	}
	this._exec=function(cmd,param)
	{
		if(param!=undefined)return _doc.execCommand(cmd,false,param);
		else return _doc.execCommand(cmd,false,null);
	}
}
$(function(){$('textarea.xheditor').xhEditor(true)});

})(jQuery);
/*
jquery v1.3.2特殊处理：
搜索：elem = window;
删除当前程序行

接口：
var editor=$('#elm1').xhEditor(true,{tools:'full',skin:'default',clearScript:true,clearStyle:true,width:300,height:200,loadCSS:'http://pirate9.com/test.css',fullscreen:true})[0].xhEditor,sHtml;
editor.focus();
editor.setHTML('str')
sHtml=editor.getHTML()
editor.pasteHTML('<p>aaa</p>')
editor.pasteText('str')
sHtml=editor.formatXHTML('<b>aaa</b>')
editor.toggleHtml()
editor.togglePreview()
editor.toggleFullscreen()
*/