import $ from 'jquery';
import AppDispatcher from 'dispatcher/app_dispatcher.jsx';

export function loginOASystem(loginOAUser, successCall){ //登录OA系统
  const loginUrl = 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.ValidatePerson';
  var param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "username" : loginOAUser.oaUserName || 'whq',
      "password" : loginOAUser.oaPassword || '123'
    }
  }));
  $.ajax({
      url : loginUrl,
      data : {
        "param" : param
      },
      async : false,
      success : (result)=>{
        var data  = decodeURIComponent(result);
        data = data.replace(/%20/g, " ");
        let res = JSON.parse(data);

        if(res.code == "1"){
          successCall && successCall(res);
        }
      }
    });
}
//获取组织机构数据
export function getOrganization(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.SynchronousOrganization', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "username" : options.username || 'whq',
      "password" : options.password || '123'
    }
  }));
  $.ajax({
      url : options.url,
      type: 'POST',
      data : {
        "tokenunid" : options.tokenunid,
        "param" : param,
        "url" : options.moduleUrl
      },
      async : true,
      success : (result)=>{
        let res  = decodeURIComponent(result);
        res = res.replace(/%20/g, " ");
        let data = JSON.parse(res);
        if(data.code == "1"){
          options.successCall && options.successCall(data);
        }
      }
    });
}
//处理组织机构数据
export function formatOrganizationData(dtMap){
  let orgaArr = [];
  Object.keys(dtMap).forEach((key)=>{ //组织机构的key长度是大于20的。
    if(key.length>20 && key != "root" && key != "sortpersonlist" && (typeof dtMap[key] == "object")){
      orgaArr.push(dtMap[key]);
    }
  });
  return orgaArr;
}

//获取shou文管理的列表数据。
export function getIncomingListData(opts){
  opts['viewname'] = 'hcit.module.swgl.ui.VeSwcld';
  getOAServerListData(opts);
}
//获取发文管理的列表数据
export function getDispatchListData(opts){
  opts['viewname'] = 'hcit.module.fwgl.ui.VeFwcld';
  getOAServerListData(opts);
}
//获取签报管理的列表数据
export function getSignReportListData(opts){
  opts['viewname'] = 'hcit.module.qbgl.ui.VeCld';
  getOAServerListData(opts);
}
//获取督办管理的列表数据
export function getSuperviseListData(opts){
  opts['viewname'] = 'hcit.module.duban3.ui.VeDbjgl';
  getOAServerListData(opts);
}
//获取通知公告的列表数据
export function getNoticeListData(opts){
  // opts['viewname'] = 'hcit.module.tzgg.ui.VeTzgg';
  opts['viewname'] = 'hcit.module.xxfb.ui.VeSjsh';
  getOAServerListDataWithUrlParam(opts);
}
//获取最新发文的列表数据
export function getNewDispatchListData(opts){
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url
    urlparam:{}
  },opts);
  var param = {
    "ver" : "2",
    "params" : {
      "key":opts.urlparam.key,
      "currentpage" : options.currentpage || 1,
      "viewname" : 'hcit.module.fwgl.ui.VeFbgw',
      "viewcolumntitles" : options.viewcolumntitles
    }
  };
  options.urlparam = encodeURIComponent(JSON.stringify(options.urlparam));
  finalRequestServerWithUrlParam(options,encodeURIComponent(JSON.stringify(param)));
}
//获取待办事项的列表数据
export function getPersonalTodoListData(opts){
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url
    urlparam:{}
  },opts);
  var param = {
    "ver" : "2",
    "params" : {
      "key":opts.urlparam.key,
      "currentpage" : options.currentpage || 1,
      "viewname" : 'hcit.workflow.backlog.ui.VeBacklog',
      "viewcolumntitles" : options.viewcolumntitles
    }
  };
  options.urlparam = encodeURIComponent(JSON.stringify(options.urlparam));
  finalRequestServerWithUrlParam(options,encodeURIComponent(JSON.stringify(param)));
}

// Key：1表示获取获取草稿箱中的数据，10表示获取待办内容，2，表示办理中，4表示已办结，16777215表示所有。
export function getOAServerListData(params){ //从服务端获取列表数据
  const keyName2keyMap = {"草稿箱":1, "待办":10, "办理中":2, "已办结":4, "所有":16777215}
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url
  },params,{
    key: keyName2keyMap[params.keyName] || 16777215, //暂时没有的筛选条件都查所有的。
  });
  var param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "key" : options.key,
      "currentpage" : options.currentpage || 1,
      "viewname" : options.viewname,
      "viewcolumntitles" : options.viewcolumntitles
    }
  }));
  finalRequestServer(options,param);
}

export function getOAServerListDataWithUrlParam(params){ //从服务端获取列表数据
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url
    urlparam:{"rootlbunid":params.rootlbunid}
  },params);
  if(params.shbz){
    options.urlparam.shbz = params.shbz;
  }
  options.urlparam = encodeURIComponent(JSON.stringify(options.urlparam));
  var param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "rootlbunid" : options.rootlbunid,
      "currentpage" : options.currentpage || 1,
      "viewname" : options.viewname,
      "viewcolumntitles" : options.viewcolumntitles
    }
  }));
  finalRequestServerWithUrlParam(options,param);
}

export function formatServerListData(colsNameEn, values){ //整理后端发过来的列表数据。
  let listArr = [];
  values.forEach((value, index)=>{
    let obj = {key:index};
    Object.keys(value).forEach((key) => {
      let num = key.split("column")[1];
      if (!isNaN(num)) {
        obj[colsNameEn[+num]] = value[key];
      }else{
        obj[key] = value[key];
      }
    });
    listArr.push(obj);
  });
  return listArr;
}

//获取模块编辑的表单数据
export function getModuleFormData(params) {
  const moduleName2FormName = {
    "签报管理":"hcit.module.qbgl.ui.FrmCld",
    "发文管理":"hcit.module.fwgl.ui.FrmFwcld",
    "收文管理":"hcit.module.swgl.ui.FrmSwcld",
    "督办管理":"hcit.module.duban3.ui.FrmDbjgl"
  }
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.MobileToOpenForm',
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "1",
    "params" : {
      "formname" : moduleName2FormName[options.moduleName],
				"formparam" : {
					"unid" : options.unid,
				},
        "formdata" : {
          "unid" : "",
					"flowsessionid" : "",
					"gwlc" : "", //公文流程，即签报的请示类别，是下拉列表。
					"btSave" : "", //保存按钮
					"btYwyj" : "",  //阅文意见按钮
					"btSend" : "",
					"btRead" : "",
					"btHscb" : "",
					"btZj" : "",
					"btFx" : "",
					"btBwgz" : "", //办文跟踪按钮
					"btZw" : "",  //正文按钮
					"ngr_show" : "", //拟稿人。
					"ngrq_show" : "", //拟稿日期
					"bt" : "", //标题。
					"nr" : ""
        }
    }
  }));
  $.ajax({
      url : options.url,
      type: 'POST',
      data : {
        "tokenunid" : options.tokenunid,
        "param" : param,
        "url" : options.moduleUrl
      },
      async : true,
      success : (result)=>{
        let res  = decodeURIComponent(result);
        res = res.replace(/%20/g, " ");
        let data = JSON.parse(res);
        if(data.code == "1"){
          options.successCall && options.successCall(data);
        }
      }
    });
}
export function formatFormData(values){
  let formData = {};
  Object.keys(values).forEach((key)=>{
    if(typeof values[key] == "object"){
      formData[key] = values[key].value;
    }else{
      formData[key] = values[key];
    }
  });
  return formData;
}
//保存模块编辑的表单数据
export function saveModuleFormData(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.MobileToOpenForm&ispost=1',
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "1",
    "params" : {
      "formname" : "hcit.module.qbgl.ui.FrmCld",
      "formdata" : {
        "__EVENTTARGET_S" : "M|btSave|OnClickHandler",
					"unid" : "7503130A0817AE0BEF2AC1031B1AD425",
					"flowsessionid" : "7505030E062E1C529F7AC1031B154725",
					"gwlc" : "73031413313105FB779A00622EA63DF1",
					"_otherssign" : "7505030E0A1523A73EFAC1031B3CD525",
          "btSave" : "",
					"btYwyj" : "",
					"btSend" : "",
					"btRead" : "",
					"btHscb" : "",
					"btZj" : "",
					"btFx" : "",
					"btBwgz" : "",
					"btZw" : "",
					"ngr_show" : "admin",
					"ngrq_show" : "2017-04-19",
					"bt" : "88888888888888",
					"nr" : "测试内容"

      }
    }
  }));
  finalRequestServer(options,param);
}

//获取阅文意见的意见类型
export function getVerifyNotionTypes(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.GetCurrentNotion', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "gwlcunid" : options.gwlcunid,
      "modulename" : options.modulename
    }
  }));
  finalRequestServer(options,param);
}
//获取表单历史阅文意见
export function getFormVerifyNotion(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.GetHistoryNotionList',
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid
    }
  }));
  finalRequestServer(options,param);
}

export function parseHistoryNotionList(list){
  let notionMap = {};
  for(let i=0;i<list.length;i++){
    let obj = list[i];
    if(notionMap[obj['type']]){
      notionMap[obj['type']].push(obj);
    }else{
      notionMap[obj['type']] = [obj];
    }
  }
  return notionMap;
}

//保存阅文意见
export function saveVerifyNotion(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.DoSaveNotion', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "gwlcunid" : options.gwlcunid,
      "modulename" : options.modulename,
      "notionkind" : options.notionkind, //意见分类（文字的还是手写的）
			"notiontype" : options.notiontype, //意见类型
			"content" : options.content
    }
  }));
  finalRequestServer(options,param);
}

//获取表单公文附件列表。
export function getFormAttachmentList(params){
  const moduleName2filetablename = {
    "签报管理":"qbgl_gwfj",
    "发文管理":"fwgl_gwfj",
    "收文管理":"swgl_gwfj",
    "督办管理":"duban3_gwfj"
  }
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl:'/openagent?agent=hcit.project.moa.transform.agent.GetGwFjList',
    // moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.GetFlowSendDoc', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "filetablename" : moduleName2filetablename[options.moduleName] //该值来源于请求的表单数据：flowsessionid
    }
  }));
  finalRequestServer(options,param);
}
//获取表单公文附件的下载地址。
export function getAttachmentUrl(params){
  let url='';
  var strUrl = "http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.GetGwfjData";
  const moduleName2filetablename = {
    "签报管理":"qbgl_gwfj",
    "发文管理":"fwgl_gwfj",
    "收文管理":"swgl_gwfj",
    "督办管理":"duban3_gwfj"
  };
  var paramJson ={
      ver : "2",
      params :{
          "fileunid" : params.fileunid,
          "filetablename" : moduleName2filetablename[params.moduleName]
      }
  };
  url = strUrl + "&param=" + encodeURIComponent(JSON.stringify(paramJson));
  return url;
}


//获取表单自定义附件列表。
export function getFormCustomAttachmentList(params){
  const moduleName2filetablename = {
    "通知公告":"tzgg_fj",
    "信息发布":"xxfb_fj"
  }
  const moduleName2moduleUrl = {
    "通知公告":'/openagent?agent=hcit.module.tzgg.agent.TzggAttachmentOperation&opcode=2',
    "信息发布":'/openagent?agent=hcit.module.xxfb.agent.XxfbAttachmentOperation&opcode=2'
  }
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl:moduleName2moduleUrl[params.moduleName]
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "filetablename" : moduleName2filetablename[options.moduleName]
    }
  }));
  finalRequestServer(options,param);
}
//获取下载自定义附件的url连接。
export function getCustomAttachmentUrl(params){
  const moduleName2filetablename = {
    "通知公告":"tzgg_fj",
    "信息发布":"xxfb_fj"
  }
  const moduleName2moduleUrl = {
    "通知公告":'/openagent?agent=hcit.module.tzgg.agent.TzggAttachmentOperation&opcode=3',
    "信息发布":'/openagent?agent=hcit.module.xxfb.agent.XxfbAttachmentOperation&opcode=3'
  }
  let url='';
  var paramJson ={
      ver : "2",
      params :{
          "fileunid" : params.fileunid,
          "filetablename":moduleName2filetablename[params.moduleName]
      }
  };
  url = "http://10.192.0.241/"+moduleName2moduleUrl[params.moduleName] + "&param=" + encodeURIComponent(JSON.stringify(paramJson));
  return url;
}

//获取办文跟踪信息
export function getDoArticleTrack(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl:'/openagent?agent=hcit.project.moa.transform.agent.FlowTrace',
    // moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.GetFlowSendDoc', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "bwgzunid" : options.bwgzunid, //该值来源于请求的表单数据：flowsessionid
      "modulename" : options.modulename
    }
  }));
  finalRequestServer(options,param);
}

//获取发送的信息--（可发送的流程和人员列表）
export function getFlowSendInfo(params) {
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.GetFlowSendDoc', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "gwlcunid" : options.gwlcunid,
      "otherssign" : options.otherssign, //该值来源于请求的表单数据：_otherssign
      "modulename" : options.modulename
    }
  }));
  finalRequestServer(options,param);
}
//保存发送的信息
export function saveFlowSendInfo(params) {
  const modulename2backlogurl = {
    "qbgl":"/qbgl/frmcld.jsp",   //签报管理
    "fwgl":"/fwgl/frmfwcld.jsp", //发文管理
    "swgl":"/swgl/frmswcld.jsp",  //收文管理
    "duban":"/duban3/frmdbjgl.jsp"   //督办管理
  }
  let options = Object.assign({},{
    url: 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
    moduleUrl: '/openagent?agent=hcit.project.moa.transform.agent.DoFlowSendV2', //模块url
  },params);
  let param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "docunid" : options.docunid,
      "gwlcunid" : options.gwlcunid,
      "modulename" : options.modulename,
      "backlogurl" : modulename2backlogurl[options.modulename], //这个是跟模块有关的一个参数。
      "title" : options.title,  //表单标题
      "message" : options.message, //提示方式，1为网络消息，2为手机短信
      "personunids" : options.personunids   //值为{name:"流程分支名", persons:"逗号隔开的personUnid."}
    }
  }));
  finalRequestServer(options,param);
}

//最后向服务端发送ajax请求的地方。
export function finalRequestServer(options,param){
  $.ajax({
      url : options.url,
      type: 'POST',
      data : {
        "tokenunid" : options.tokenunid,
        "param" : param,
        "url" : options.moduleUrl
      },
      async : true,
      success : (result)=>{
        let res  = decodeURIComponent(result);
        res = res.replace(/%20/g, " ");
        if(!res){
          options.errorCall && options.errorCall({});
          return;
        }
        let data = JSON.parse(res);
        if(data.code == "1"){
          options.successCall && options.successCall(data);
        }else{
          options.errorCall && options.errorCall(data);
        }
      }
    });
}
//带有urlparam的最后向服务端发送ajax请求。
export function finalRequestServerWithUrlParam(options,param){
  $.ajax({
      url : options.url,
      type: 'POST',
      data : {
        "tokenunid" : options.tokenunid,
        "param" : param,
        "url" : options.moduleUrl,
        "urlparam":options.urlparam
      },
      async : true,
      success : (result)=>{
        let res  = decodeURIComponent(result);
        res = res.replace(/%20/g, " ");
        if(!res){
          options.errorCall && options.errorCall({});
          return;
        }
        if(res.indexOf('/script>') != -1){ 
          res = res.substring(res.indexOf('/script>')+9);
        }
        // console.log("server request 返回--：", res);
        let data = JSON.parse(res);
        if(data.code == "1"){
          options.successCall && options.successCall(data);
        }else{
          options.errorCall && options.errorCall(data);
        }
      }
    });
}
