
function Browseris () {
	var agt=navigator.userAgent.toLowerCase();
	this.osver=1.0;
	if (agt)
	{
		var stOSVer=agt.substring(agt.indexOf("windows ")+11);
		this.osver=parseFloat(stOSVer);
	}
	this.major=parseInt(navigator.appVersion);
	this.nav=((agt.indexOf('mozilla')!=-1)&&((agt.indexOf('spoofer')==-1) && (agt.indexOf('compatible')==-1)));
	this.nav6=this.nav && (this.major==5);
	this.nav6up=this.nav && (this.major >=5);
	this.nav7up=false;
	if (this.nav6up)
	{
		var navIdx=agt.indexOf("netscape/");
		if (navIdx >=0 )
			this.nav7up=parseInt(agt.substring(navIdx+9)) >=7;
	}
	this.ie=(agt.indexOf("msie")!=-1);
	this.aol=this.ie && agt.indexOf(" aol ")!=-1;
	if (this.ie)
		{
		var stIEVer=agt.substring(agt.indexOf("msie ")+5);
		this.iever=parseInt(stIEVer);
		this.verIEFull=parseFloat(stIEVer);
		}
	else
		this.iever=0;
	this.ie4up=this.ie && (this.major >=4);
	this.ie5up=this.ie && (this.iever >=5);
	this.ie55up=this.ie && (this.verIEFull >=5.5);
	this.ie6up=this.ie && (this.iever >=6);
	this.winnt=((agt.indexOf("winnt")!=-1)||(agt.indexOf("windows nt")!=-1));
	this.win32=((this.major >=4) && (navigator.platform=="Win32")) ||
		(agt.indexOf("win32")!=-1) || (agt.indexOf("32bit")!=-1);
	this.mac=(agt.indexOf("mac")!=-1);
	this.w3c=this.nav6up;
	this.safari=(agt.indexOf("safari")!=-1);
	this.safari125up=false;
	if (this.safari && this.major >=5)
	{
		var navIdx=agt.indexOf("safari/");
		if (navIdx >=0)
			this.safari125up=parseInt(agt.substring(navIdx+7)) >=125;
	}
}

//var browseris=new Browseris();

var IMNControlObj=null;
var bIMNControlInited=false;
var IMNDictionaryObj=null;
var bIMNSorted=false;
var bIMNOnloadAttached=false;
var IMNOrigScrollFunc=null;
var bIMNInScrollFunc=false;
var IMNSortableObj=null;
var IMNHeaderObj=null;
var IMNNameDictionaryObj=null;
var IMNShowOfflineObj=null;
function EnsureIMNControl()
{
	if (!bIMNControlInited)
	{
	    try{
	        IMNControlObj=new ActiveXObject("Name.NameCtrl.1");
	    } catch(e){	    
	    };

		//if (browseris.ie5up && browseris.win32)
		//{
//@cc_on
//@if (@_jscript_version >=5)

//@else
//@end
		//}
		bIMNControlInited=true;
		if (IMNControlObj)
		{
			IMNControlObj.OnStatusChange=IMNOnStatusChange;
		}
	}
	return IMNControlObj;
}
function IMNImageInfo()
{
	this.img=null;
	this.alt='';
}

function IMNGetStatusImage(state, showoffline)
{
	var img="blank.gif";
	var alt="";
	switch (state)
	{
		case 0:
			img="imnon.png";
		break;
		case 11:
			img="imnonoof.png";
		break;
		case 1:
			if (showoffline)
			{
				img="imnoff.png";
			}
			else
			{
				img="blank.gif";
			}
		break;
		case 12:
			if (showoffline)
			{
				img="imnoffoof.png";
			}
			else
			{
				img="blank.gif";
			}
		break;
		case 2:
			img="imnaway.png";
		break;
		case 13:
			img="imnawayoof.png";
		break;
		case 3:
			img="imnbusy.png";
		break;
		case 14:
			img="imnbusyoof.png";
		break;
		case 4:
			img="imnaway.png";
		break;
		case 5:
			img="imnbusy.png";
		break;
		case 6:
			img="imnaway.png";
		break;
		case 7:
			img="imnbusy.png";
		break;
		case 8:
			img="imnaway.png";
		break;
		case 9:
			img="imndnd.png";
		break;
		case 15:
			img="imndndoof.png";
		break;
		case 10:
			img="imnbusy.png";
		break;
		case 16:
			img="imnidle.png";
		break;
		case 17:
			img="imnidleoof.png";
		break;
		case 18:
			img="imnblocked.png";
		break;
		case 19:
			img="imnidlebusy.png";
		break;
		case 20:
			img="imnidlebusyoof.png";
		break;
	}
	var imnInfo=new IMNImageInfo();
	imnInfo.img=img;
    imnInfo.alt="";
	return imnInfo;
}
function IMNGetHeaderImage()
{
	var imnInfo=new IMNImageInfo();
	imnInfo.img="imnhdr.gif";;
	imnInfo.alt="";
	return imnInfo;
}
function IMNIsOnlineState(state)
{
	if (state==1)
	{
		return false;
	}
	return true;
}
function IMNSortList(j, oldState, state)
{
	var objTable=null;
	var objRow=null;
	if (IMNSortableObj && IMNSortableObj[j])
	{
		objRow=document.getElementById(j);
		while (objRow && !(objRow.tagName=="TR" &&
			   typeof(objRow.Sortable) !="undefined"))
		{
			objRow=objRow.parentNode;
		}
		objTable=objRow;
		while (objTable && objTable.tagName !="TABLE")
		{
			objTable=objTable.parentNode;
		}
		if (objTable !=null && objRow !=null)
		{
			if (objTable.rows[1].style.display=="none")
			{
				for (i=1; i<4; i++)
				{
					objTable.rows[i].style.display="block";
				}
			}
			if (!IMNIsOnlineState(oldState) && IMNIsOnlineState(state))
			{
				objTable.rows[2].style.display="none";
				i=3;
				while (objTable.rows[i].id !="Offline" && objTable.rows[i].innerText < objRow.innerText)
					i++;
				objTable.moveRow(objRow.rowIndex, i);
				if (    objTable.rows[objTable.rows.length - 3].id=="Offline")
				{
					objTable.rows[objTable.rows.length - 2].style.display="block";
				}
			}
			else if (IMNIsOnlineState(oldState) && !IMNIsOnlineState(state))
			{
				if (objRow.rowIndex==3 &&
					objTable.rows[objRow.rowIndex+1].id=="Offline")
				{
					objTable.rows[2].style.display="block";
				}
				if (objTable.rows[objTable.rows.length - 3].id=="Offline")
				{
					objTable.rows[objTable.rows.length - 2].style.display="none";
				}
				i=objTable.rows.length - 2;
				while (objTable.rows[i - 1].id !="Offline" && objTable.rows[i].innerText > objRow.innerText)
					i--;
				objTable.moveRow(objRow.rowIndex, i);
			}
		}
	}
}
function IMNOnStatusChange(name, state, id)
{
	if (IMNDictionaryObj)
	{
		var img=IMNGetStatusImage(state, IMNSortableObj[id] ||
									IMNShowOfflineObj[id]);
		if (IMNDictionaryObj[id] !=state)
		{
			if (bIMNSorted)
				IMNSortList(id, IMNDictionaryObj[id], state);
			IMNUpdateImage(id, img);
			IMNDictionaryObj[id]=state;
		}
	}
}
function IMNUpdateImage(id, imgInfo)
{
	var obj=document.images(id);
	if (obj)
	{
		var img = imgInfo.img;
        var alt = imgInfo.alt;
		var oldImg=obj.src;
		var index=oldImg.lastIndexOf("/");
		var newImg=oldImg.slice(0, index+1);
		newImg+=img;
		if (oldImg==newImg && img !='blank.gif')
			return;
		if (obj.altbase)
		{
			obj.alt=obj.altbase;
		}
		else
		{
			obj.alt=alt;
		}
		//var useFilter=browseris.ie &&
		//			browseris.ie55up &&
		//			browseris.verIEFull < 7.0;
		var isPng=(newImg.toLowerCase().indexOf(".png") > 0);
	    //if (useFilter)
		if ($.browser.realVersion < 7)
		{
			if (isPng)
			{
				obj.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+newImg+"),sizingMethod=scale,enabled=true);";
				//obj.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+newImg+"),sizingMethod=image,enabled=true);";

				obj.src="blank.gif";
			}
			else
			{
				obj.style.filter="";
				obj.src=newImg;
			}
		}
		else
		{
			obj.src=newImg;
		}
	}
}
function IMNHandleAccelerator()
{
	if (IMNControlObj)
	{
	   if (event.altKey && event.shiftKey &&
			event.keyCode==121)
		{
		   IMNControlObj.DoAccelerator();
		}
	}
}
function IMNImageOnClick()
{
	if (IMNControlObj)
	{
		IMNShowOOUIKyb();
		IMNControlObj.DoAccelerator();
	}
}
function IMNGetOOUILocation(obj)
{
	var objRet=new Object;
	var objSpan=obj;
	var objOOUI=obj;
	var oouiX=0, oouiY=0, objDX=0;
	var fRtl=document.dir=="rtl";
	while (objSpan && objSpan.tagName !="SPAN" && objSpan.tagName !="TABLE")
	{
		objSpan=objSpan.parentNode;
	}
	if (objSpan)
	{
		var collNodes=objSpan.tagName=="TABLE" ?
			objSpan.rows(0).cells(0).childNodes :
			objSpan.childNodes;
		var i;
		for (i=0; i < collNodes.length;++i)
		{
			if (collNodes.item(i).tagName=="IMG" && collNodes.item(i).id)
			{
				objOOUI=collNodes.item(i);
				break;
			}
			if (collNodes.item(i).tagName=="A" &&
				collNodes.item(i).childNodes.length > 0 &&
				collNodes.item(i).childNodes.item(0).tagName=="IMG" &&
				collNodes.item(i).childNodes.item(0).id)
			{
				objOOUI=collNodes.item(i).childNodes.item(0);
				break;
			}
		}
	}
	obj=objOOUI;
	while (obj)
	{
		if (fRtl)
		{
			if (obj.scrollWidth >=obj.clientWidth+obj.scrollLeft)
            {
				objDX = obj.scrollWidth - obj.clientWidth - obj.scrollLeft;
            }
			else
            {
				objDX = obj.clientWidth + obj.scrollLeft - obj.scrollWidth;
            }

			oouiX += obj.offsetLeft + objDX;	
		}
		else
        {
			oouiX+=obj.offsetLeft - obj.scrollLeft;
        }

		oouiY+=obj.offsetTop - obj.scrollTop;
		obj=obj.offsetParent;
	}
	try
	{
		obj=window.frameElement;
		while (obj)
		{
			if (fRtl)
			{
				if (obj.scrollWidth >=obj.clientWidth+obj.scrollLeft)
					objDX=obj.scrollWidth - obj.clientWidth - obj.scrollLeft;
				else
					objDX=obj.clientWidth+obj.scrollLeft - obj.scrollWidth;
				oouiX+=obj.offsetLeft+objDX;
			}
			else
				oouiX+=obj.offsetLeft - obj.scrollLeft;
			oouiY+=obj.offsetTop - obj.scrollTop;
			obj=obj.offsetParent;
		}
	} catch(e)
	{
	};
	objRet.objSpan=objSpan;
	objRet.objOOUI=objOOUI;
	objRet.oouiX=oouiX;
	objRet.oouiY=oouiY;
	if (fRtl)
		objRet.oouiX+=objOOUI.offsetWidth;
	
	objRet.oouiY -= getScrollTopOfBody();
	return objRet;
}

// 取得body元素的scrollTop 
function getScrollTopOfBody(){
    var scrollTop; 
    if(typeof window.pageYOffset != 'undefined'){ 
        scrollTop = window.pageYOffset; 
    }
    else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat'){ 
        scrollTop = document.documentElement.scrollTop; 
    } 
    else if(typeof document.body != 'undefined'){ 
        scrollTop = document.body.scrollTop; 
    }
    return scrollTop; 
}

function IMNShowOOUIMouse()
{
	IMNShowOOUI(0);
}
function IMNShowOOUIKyb()
{
	IMNShowOOUI(1);
}
function IMNShowOOUI(inputType)
{
	//if (browseris.ie5up && browseris.win32)
	//{
		var obj=window.event.srcElement;
		var objSpan=obj;
		var objOOUI=obj;
		var oouiX=0, oouiY=0;
		if (EnsureIMNControl() && IMNNameDictionaryObj)
		{
			var objRet=IMNGetOOUILocation(obj);
			objSpan=objRet.objSpan;
			objOOUI=objRet.objOOUI;
			oouiX=objRet.oouiX;
			oouiY=objRet.oouiY;
			var name=IMNNameDictionaryObj[objOOUI.id];
			
			if (objSpan)
				objSpan.onkeydown=IMNHandleAccelerator;
				
			//IMNControlObj.ShowOOUI(name, this);
			IMNControlObj.ShowOOUI(name, inputType, oouiX, oouiY);
		}
	//}
}
function IMNHideOOUI()
{
	if (IMNControlObj)
	{
		IMNControlObj.HideOOUI();
		return false;
	}
	return true;
}
function IMNScroll()
{
	if (!bIMNInScrollFunc)
	{
		//bIMNInScrollFunc=false;
		bIMNInScrollFunc=true;
		IMNHideOOUI();
	}
	bIMNInScrollFunc=false;
	if(IMNOrigScrollFunc==IMNScroll)
		return true;
	return IMNOrigScrollFunc ? IMNOrigScrollFunc() : true;
}
var imnCount=0;
var imnElems;
var imnElemsCount=0;
var imnMarkerBatchSize=4;
var imnMarkerBatchDelay=40;
function ProcessImn()
{
	if (EnsureIMNControl() && IMNControlObj.PresenceEnabled)
	{
		imnElems=document.getElementsByName("imnmark");
		imnElemsCount=imnElems.length;
		ProcessImnMarkers();
	}
}
function ProcessImnMarkers()
{
	for (i=0;i<imnMarkerBatchSize;++i)
	{
		if (imnCount==imnElemsCount)
			return;
		IMNRC(imnElems[imnCount].sip,imnElems[imnCount]);
		imnCount++;
	}
	setTimeout("ProcessImnMarkers()",imnMarkerBatchDelay);
}
function IMNRC(name, elem) {
    try {
        if (name == null || name == '')
            return;

        //if (browseris.ie5up && browseris.win32)
        //{
        var obj = (elem) ? elem : window.event.srcElement;
        var objSpan = obj;
        var id = obj.id;
        var fFirst = false;
        IMNDictionaryObj = null;
        if (!IMNDictionaryObj) {
            IMNDictionaryObj = new Object();
            IMNNameDictionaryObj = new Object();
            IMNSortableObj = new Object();
            IMNShowOfflineObj = new Object();
            if (!IMNOrigScrollFunc) {
                IMNOrigScrollFunc = window.onscroll;
                window.onscroll = IMNScroll;
            }
        }
        if (IMNDictionaryObj) {
            if (!IMNNameDictionaryObj[id]) {
                IMNNameDictionaryObj[id] = name;
                fFirst = true;
            }
            if (typeof (IMNDictionaryObj[id]) == "undefined") {
                IMNDictionaryObj[id] = 1;
            }
            if (!IMNSortableObj[id] &&
				(typeof (obj.Sortable) != "undefined")) {
                IMNSortableObj[id] = obj.Sortable;
                if (!bIMNOnloadAttached) {
                    if (EnsureIMNControl() && IMNControlObj.PresenceEnabled)
                        window.attachEvent("onload", IMNSortTable);
                    bIMNOnloadAttached = true;
                }
            }
            if (!IMNShowOfflineObj[id] &&
				(typeof (obj.ShowOfflinePawn) != "undefined")) {
                IMNShowOfflineObj[id] = obj.ShowOfflinePawn;
            }
            if (fFirst && EnsureIMNControl() && IMNControlObj.PresenceEnabled) {
                var state1 = 1, img;
                state1 = IMNControlObj.GetStatus(name, id);
                state1 = 1;
                state1 = IMNControlObj.GetStatus(name, id);
                if (IMNIsOnlineState(state1) || IMNSortableObj[id] ||
					IMNShowOfflineObj[id]) {
                    img = IMNGetStatusImage(state1, IMNSortableObj[id] ||
											IMNShowOfflineObj[id]);
                    IMNUpdateImage(id, img);
                    IMNDictionaryObj[id] = state1;
                }
            }
        }
        if (fFirst) {
            var objRet = IMNGetOOUILocation(obj);
            objSpan = objRet.objSpan;
            if (objSpan) {
                objSpan.onmouseover = IMNShowOOUIMouse;
                objSpan.onfocusin = IMNShowOOUIKyb;
                objSpan.onmouseout = IMNHideOOUI;
                objSpan.onfocusout = IMNHideOOUI;
            }
        }
        //}
    } catch (e) {

    }
}
function IMNSortTable()
{
	var id;
	for (id in IMNDictionaryObj)
	{
		IMNSortList(id, 1, IMNDictionaryObj[id]);
	}
	bIMNSorted=true;
}
function IMNRegisterHeader()
{
	//if (browseris.ie5up && browseris.win32)
	//{
		var obj=window.event.srcElement;
		if (!IMNHeaderObj)
		{
			IMNHeaderObj=new Object();
		}
		if (IMNHeaderObj)
		{
			var id=obj.id;
			if (!IMNHeaderObj[id])
			{
				IMNHeaderObj[id]=id;
				var img;
				img=IMNGetHeaderImage();
				IMNUpdateImage(id, img);
			}
		}
	//}
}
