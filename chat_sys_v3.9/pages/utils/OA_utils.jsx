import $ from 'jquery';
import AppDispatcher from 'dispatcher/app_dispatcher.jsx';


export function loginOASystem(loginUser, successCall){ //登录OA系统
  const loginUrl = 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.ValidatePerson';
  var param = encodeURIComponent(JSON.stringify({
    "ver" : "2",
    "params" : {
      "username" : loginUser.username || 'whq',
      "password" : loginUser.password || '123'
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

//获取发文管理的列表数据。
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
//TODO, 其他接口。


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
