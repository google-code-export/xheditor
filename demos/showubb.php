<?php
//此程序为UBB模式下的服务端显示测试程序
header('Content-Type: text/html; charset=utf-8');
require_once '../serverscript/php/ubb2html.php';
echo ubb2html($_POST['elm1']);//htmlspecialchars
?>