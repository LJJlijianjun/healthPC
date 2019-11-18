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
        //当然这里最好判断一下result是否安全，不要接收到内容就显示这样会被人利用。
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