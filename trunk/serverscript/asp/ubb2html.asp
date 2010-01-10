<%
' ubb2html support for asp
' @requires xhEditor
' 
' @author Yanis.Wang<yanis.wang@gmail.com>
' @site http://pirate9.com/
' @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
' 
' @Version: 0.9.6 build 091231
function ubb2html(sUBB)
	dim re,sHtml,i,matchs,match,temp,p1,p2,p3,p4,codeMatchs
	Set re = New RegExp
	re.Global = True
	re.IgnoreCase = True
	sHtml=sUBB
	re.Pattern="&"
	sHtml=re.Replace(sHtml,"&amp;")
	re.Pattern="<"
	sHtml=re.Replace(sHtml,"&lt;")
	re.Pattern=">"
	sHtml=re.Replace(sHtml,"&gt;")
	re.Pattern="\t"
	sHtml=re.Replace(sHtml,"&nbsp; &nbsp; &nbsp; &nbsp; ")
	re.Pattern="   "
	sHtml=re.Replace(sHtml,"&nbsp; &nbsp;")
	re.Pattern="  "
	sHtml=re.Replace(sHtml,"&nbsp;&nbsp;")
	re.Pattern="\r?\n"
	sHtml=re.Replace(sHtml,"<br />")
	
	re.Pattern="\[code\s*(=\s*([^\]]+?))?\]([\s\S]*?)\[\/code\]"
	Set matchs = re.Execute(sHtml)
	set codeMatchs=matchs
	For i= 0 to  codeMatchs.count -1
		sHtml=Replace(sHtml,codeMatchs.item(i),"[ubbcodeplace_"&i&"]")
	Next
	
	re.Pattern="\[(\/?)(b|u|i|s|sup|sub)\]"
	sHtml=re.Replace(sHtml,"<$1$2>")
	re.Pattern="\[color\s*=\s*([^\]""]+?)(?:""[^\]]*?)?\s*\]"
	sHtml=re.Replace(sHtml,"<font color=""$1"">")
	re.Pattern="\[size\s*=\s*(\d+?)\s*\]"
	sHtml=re.Replace(sHtml,"<font size=""$1"">")
	re.Pattern="\[font\s*=\s*([^\]""]+?)(?:""[^\]]*?)?\s*\]"
	sHtml=re.Replace(sHtml,"<font face=""$1"">")
	re.Pattern="\[\/(color|size|font)\]"
	sHtml=re.Replace(sHtml,"</font>")
	re.Pattern="\[back\s*=\s*([^\]""]+?)(?:""[^\]]*?)?\s*\]"
	sHtml=re.Replace(sHtml,"<span style=""background-color:$1;"">")
	re.Pattern="\[\/back\]"
	sHtml=re.Replace(sHtml,"</span>")
	re.Pattern="\[align\s*=\s*([^\]""]+?)(?:""[^\]]*?)?\s*\](((?!\[align(?:\s+[^\]]+)?\])[\s\S])*?)\[\/align\]"
	for i=1 to 3
		sHtml=re.Replace(sHtml,"<p align=""$1"">$2</p>")
	next
	re.Pattern="\[img\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/img\]"
	sHtml=re.Replace(sHtml,"<img src=""$1"" />")
	re.Pattern="\[img\s*=(?:\s*(\d*)\s*,\s*(\d*)\s*)?(?:,?\s*(\w+))?\s*\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/img\]"
	Set matchs = re.Execute(sHtml)
	For Each match in matchs
		p1=match.SubMatches(0)
		p2=match.SubMatches(1)
		p3=match.SubMatches(2)
		p4=match.SubMatches(3)
		if p3="" and not IsNumeric(p1) then p3=p1
		temp="<img src="""+p4+""""
		if p1<>"" and IsNumeric(p1) then temp=temp + " width="""+p1+""""
		if p1<>"" and IsNumeric(p2) then temp=temp + " height="""+p2+""""
		if p3<>"" then temp=temp + " align="""+p3+""""
		temp=temp + " />"
		sHtml=Replace(sHtml,match,temp)
	Next
	re.Pattern="\[url\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/url\]"
	sHtml=re.Replace(sHtml,"<a href=""$1"">$1</a>")
	re.Pattern="\[url\s*=\s*([^\]""]+?)(?:""[^\]]*?)?\s*\]\s*([\s\S]+?)\s*\[\/url\]"
	sHtml=re.Replace(sHtml,"<a href=""$1"">$2</a>")
	re.Pattern="\[email\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/email\]"
	sHtml=re.Replace(sHtml,"<a href=""mailto:$1"">$1</a>")
	re.Pattern="\[email\s*=\s*([^\]""]+?)(?:""[^\]]*?)?\s*\]\s*([\s\S]+?)\s*\[\/email\]"
	sHtml=re.Replace(sHtml,"<a href=""mailto:$1"">$2</a>")
	re.Pattern="\[quote\]([\s\S]*?)\[\/quote\]"
	sHtml=re.Replace(sHtml,"<blockquote>$1</blockquote>")
	re.Pattern="\[flash\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/flash\]"
	sHtml=re.Replace(sHtml,"<embed type=""application/x-shockwave-flash"" src=""$3"" wmode=""opaque"" quality=""high"" bgcolor=""#ffffff"" menu=""false"" play=""true"" loop=""true"" width=""550"" height=""400"" />")
	re.Pattern="\[flash\s*(?:=\s*(\d+)\s*,\s*(\d+))\s*\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/flash\]"
	sHtml=re.Replace(sHtml,"<embed type=""application/x-shockwave-flash"" src=""$3"" wmode=""opaque"" quality=""high"" bgcolor=""#ffffff"" menu=""false"" play=""true"" loop=""true"" width=""$1"" height=""$2"" />")
	re.Pattern="\[media\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/media\]"
	sHtml=re.Replace(sHtml,"<embed type=""application/x-mplayer2"" src=""$1"" enablecontextmenu=""false"" autostart=""1"" width=""550"" height=""400"" />")
	re.Pattern="\[media\s*=\s*(\d+)\s*,\s*(\d+)\s*\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/media\]"
	sHtml=re.Replace(sHtml,"<embed type=""application/x-mplayer2"" src=""$3"" enablecontextmenu=""false"" autostart=""1"" width=""$1"" height=""$2"" />")
	re.Pattern="\[media\s*=\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]\s*(((?!"")[\s\S])+?)(?:""[\s\S]*?)?\s*\[\/media\]"
	sHtml=re.Replace(sHtml,"<embed type=""application/x-mplayer2"" src=""$4"" enablecontextmenu=""false"" autostart=""$3"" width=""$1"" height=""$2"" />")
	re.Pattern="\[table\]"
	sHtml=re.Replace(sHtml,"<table>")
	re.Pattern="\[table\s*=\s*(\d{1,4}%?)\s*\]"
	sHtml=re.Replace(sHtml,"<table width=""$1"">")
	re.Pattern="\[table\s*=\s*(\d{1,4}%?)\s*,\s*([^\]""]+)(?:""[^\]]*?)?\s*]"
	sHtml=re.Replace(sHtml,"<table width=""$1"" bgcolor=""$2"">")
	re.Pattern="\[tr\]"
	sHtml=re.Replace(sHtml,"<tr>")
	re.Pattern="\[tr\s*=(\s*[^\]""]+)(?:""[^\]]*?)?\s*\]"
	sHtml=re.Replace(sHtml,"<tr bgcolor=""$1"">")
	re.Pattern="\[td\]"
	sHtml=re.Replace(sHtml,"<td>")
	re.Pattern="\[td\s*=\s*(\d{1,2})\s*,\s*(\d{1,2})\s*\]"
	sHtml=re.Replace(sHtml,"<td colspan=""$1"" rowspan=""$2"">")
	re.Pattern="\[td\s*=\s*(\d{1,2})\s*,\s*(\d{1,2})\s*,\s*(\d{1,4}%?)\]"
	sHtml=re.Replace(sHtml,"<td colspan=""$1"" rowspan=""$2"" width=""$3"">")
	re.Pattern="\[\/(table|tr|td)\]"
	sHtml=re.Replace(sHtml,"</$1>")
	re.Pattern="\[\*\]([^\[]+)"
	sHtml=re.Replace(sHtml,"<li>$1</li>")
	re.Pattern="\[list\]"
	sHtml=re.Replace(sHtml,"<ul>")
	re.Pattern="\[list\s*=\s*([^\]""]+)(?:""[^\]]*?)?\s*\]"
	sHtml=re.Replace(sHtml,"<ul type=""$1"">")
	re.Pattern="\[\/list\]"
	sHtml=re.Replace(sHtml,"</ul>")
	
	For i=0 to codeMatchs.count -1
		sHtml=replace(sHtml,"[ubbcodeplace_"&i&"]",codeMatchs.item(i))
	Next
	
	ubb2html=sHtml
	
end function
%>