<%@ WebHandler Language="C#" Class="UEditorHandler" %>

using System;
using System.Web;
using System.IO;
using System.Collections;

public class UEditorHandler : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        var result=context.Request["result"];
        //��Ȼ��������ж�һ��result�Ƿ�ȫ����Ҫ���յ����ݾ���ʾ�����ᱻ�����á�
        if(result!=null)
            context.Response.Write(result.ToString());
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}