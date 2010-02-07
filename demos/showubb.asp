<%@ CODEPAGE=65001 %>
<!--#include file="../serverscript/asp/ubb2html.asp"-->
<%
'此程序为UBB模式下的服务端显示测试程序
Response.Charset="UTF-8"
response.write ubb2html(request("elm1"))'Server.HTMLEncode()
%>