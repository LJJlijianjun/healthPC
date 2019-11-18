/*
 * config.js : 用于存储客户端配置信息
 * version : v1.0.0
 * require : jquery
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : LiYang
 * LastModifyBy : Zhaolj
 * LastModifyTime : 2016-12-27 14:00:00
 */

var dataServiceBaseUrl = 'http://localhost:1338/';

var FileRootPath = '//localhost/D$/';

var GWWealthPlatformFrontendWebBaseUrl = '';

var GWWealthDeptOrgID = '352';

var ArrayGWWealthDeptRoleID = ['6', '7', '8', '9'];

var HQBusinessDept = [{ RootID: 1, orgInfo: { Org_ID: 1014, Name: '投资投行事业部', IsView: 1 } },
                         { RootID: 1, orgInfo: { Org_ID: 1144, Name: '资金营运事业部', IsView: 1 } },
                         { RootID: 1, orgInfo: { Org_ID: 259, Name: '资产经营部（中小企业金融服务部）', IsView: 1 } },
                         { RootID: 1, orgInfo: { Org_ID: 1011, Name: '城镇化金融业务部', IsView: 1 } },
                         { RootID: 1, orgInfo: { Org_ID: 352, Name: '资产管理业务部', IsView: 1 } }];

var ArrayPlatformCompanyRoleID = ['8'];

var modifyPasswordFormatURL = 'http://10.168.50.227:9999/?account={0}';