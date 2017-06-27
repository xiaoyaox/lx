
import $ from 'jquery';
import React from 'react';
import {Link} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

import {Icon,message,notification, Button} from 'antd';
import * as commonUtils from '../utils/common_utils.jsx';
import LogOutComp from '../components/log_out_comp.jsx';
import ModulesAddPcComp  from './modulesAdd_pc_comp.jsx';

import logo_icon from 'images/modules_img/logo_icon.png';
import edit_icon from 'images/modules_img/edit_icon.png';
import OA_icon from 'images/modules_img/OA_icon.png';
import chat_icon from 'images/modules_img/chat_icon.png';
import document_icon from 'images/modules_img/document_icon.png';
import mailList_icon from 'images/modules_img/mailList_icon.png';
import modify_icon from 'images/modules_img/modify_icon.png';
import settings_icon from 'images/modules_img/settings_icon.png';
import signin_icon from 'images/modules_img/signin_icon.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';

class ModulesPcComp extends React.Component {
    constructor(props) {
        super(props);
        // this.handleSendLink = this.handleSendLink.bind(this);
        let delModules = (localStorage.getItem(props.localStoreKey4Modules) || '').split(',');
        delModules = commonUtils.removeNullValueOfArr(delModules);
        (delModules.indexOf(props.notShowModuleIdInPC) == -1)?
          localStorage.setItem(props.localStoreKey4Modules,[props.notShowModuleIdInPC].join(',')):null;
        this.state = {
          colNumPerRow:4,
          showAddDialog:false,
          showDelIcon:false,
          curDelModuleIds:[], //当前删除的模块数的id.
          showItemSum:0, //可显示的模块数。
          itemRowSum:1,
          permissionData:UserStore.getPermissionData(),
        };
    }

    componentWillMount(){
      this.refreshModules();
    }

    refreshModules(){
      let delModules = (localStorage.getItem(this.props.localStoreKey4Modules) || '').split(',');
      // console.log("refreshModules--delModules--:",delModules);
      delModules = commonUtils.removeNullValueOfArr(delModules);
      let showItemSum = this.props.allModulesData.length - delModules.length;
      console.log("showItemSum1:",showItemSum);
      this.setState({
        "curDelModuleIds":delModules,
        "showItemSum":showItemSum,
        "itemRowSum":Math.ceil((showItemSum+1)/this.state.colNumPerRow)
      });
    }
    onClickDeleteModule = (e)=>{
      e.stopPropagation();
      let curDelModuleIds = [...this.state.curDelModuleIds];
      curDelModuleIds.push($(e.currentTarget).data("moduleid"));
      localStorage.setItem(this.props.localStoreKey4Modules,curDelModuleIds.join(','));
      this.refreshModules();
    }

    getCurModulesItem = (allModulesData)=>{
      let modulesItem = allModulesData.map((item,index)=>{
        if(this.state.curDelModuleIds.indexOf(item.id) == -1){ //筛选出没被删除的。
          let backColor = item.backColor;
          let canLinkTo = true;
          if(item.canSetPrivilege && !this.state.permissionData[item.linkTo] ){
            canLinkTo = false;
            backColor = '#6f736e'; //如果该模块可设置权限，但是该用户现在没有进入这个模块的权限时，
          }
          if( canLinkTo && item.tagName == "Link" ){
            return (<span key={index}
                      className={`modules_font modules_item ${item.singleclassName}`}
                      data-module={item.name}
                      data-canlinkto={canLinkTo}
                      onClick={this.handleModuleClick}
                      style={{background:backColor}}>
                      <Link to={item.linkTo}>
                        <img className='' src={item.iconName} style={{}}/>
                        <span>{item.name}</span>
                      </Link>
                      {this.state.showDelIcon?(<Button shape="circle"
                        className={'moduleDelIcon'}
                        icon="close"
                        onClick={this.onClickDeleteModule}
                        data-moduleid={item.id} />):null}
                    </span>);
          }else{
            return (<span key={index}
                        className={`modules_font modules_item ${item.singleclassName}`}
                        data-module={item.name}
                        data-canlinkto={canLinkTo}
                        onClick={this.handleModuleClick}
                        style={{background:backColor}}>
                        <a href="javascript:;">
                          <img className='' src={item.iconName} style={{}}/>
                          <span>{item.name}</span>
                          {this.state.showDelIcon?(<Button shape="circle"
                              className={'moduleDelIcon'}
                              icon="close"
                              onClick={this.onClickDeleteModule}
                              data-moduleid={item.id} />):null}
                        </a>
                    </span>);
          }
          return '';
        }
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      // console.log("modulesItem---:",modulesItem);
      // 添加模块按钮
      modulesItem.push(
        (<a href='javascript:;'
            key={321}
            data-module={'添加'}
            data-canlinkto={true}
            onClick={this.handleModuleClick}
            className='modules_font modules_item plusModule'
            style={{border:'1px solid #fff',
            position:'absolute',top:'0px'}}>
          <span style={{ display: 'inline-block',fontSize: '100px',width: '100%',lineHeight:'140px'}}>+</span>
        </a>)
      );
      let itemRowEles = [];
      for(let i=1;i <= this.state.itemRowSum;i++){
        let itemCols = modulesItem.slice((i-1)*this.state.colNumPerRow,i*this.state.colNumPerRow);
        itemRowEles.push(
          (<div className="row" style={{position:'relative',height:'170px'}} key={i}>
            {itemCols}
           </div>)
        );
      }
      return itemRowEles;
    }
    handleModuleClick = (e)=>{  //点击模块的处理
      let curtarget = e.currentTarget;
      let canLinkTo = $(curtarget).data("canlinkto");
      // console.log("click module name:",$(curtarget).data("module"),canLinkTo);
      let moduleName = $(curtarget).data("module");
      if(!canLinkTo){
        e.stopPropagation();
        notification.warning({
          message: '你还没有该模块的权限',
          description: '你当前所在的组织没有进入这个模块功能的权限，如有需要请联系管理员！',
        });
        return false;
      }
      if(moduleName == "群聊"){
        this.props.handleGoMatter();
      }else if(moduleName == "添加"){
        this.setState({showAddDialog:true});
      }
    }

    closeAddDialogCall = ()=>{
      this.setState({ showAddDialog:false });
    }
    afterCloseAddDialog = (hasModify)=>{
      if(hasModify){
        this.refreshModules();
      }
    }
    onClickEditModules = (e)=>{
      this.setState({
        showDelIcon:!this.state.showDelIcon,
      });
    }

    render() {
      let objsArr = [{
        name:"—五一劳动节放假安排",
        time:"2017-4-21"
      },{
        name:"—2017年度职称审核表",
        time:"2017-1-11"
      },{
        name:"—最新文件上传",
        time:"2017-4-22"
      }];
      let noticeListItem =[];
      noticeListItem.push(
        objsArr.map((obj,index)=>{
          return (<div key={index} style={{height:'30px'}}><a className="lf" style={{marginLeft:'20px'}}>{obj.name}</a><a className="rt" style={{marginRight:'20px'}}>{obj.time}</a></div>)
        })
      );
      let modulesItem = this.getCurModulesItem(this.props.allModulesData);
      // console.log("modulesItem---:",modulesItem);
        return (
            <div className='container modules_page_container'>
              <div className="modules_backgroundImg"></div>
              <div className='modules_content modules_content_pc'>
                <div className='row'>
                  <div className='modules-header'>
                    <div className='col-sm-6 col-xs-6'>
                        <div style={{marginTop:'5px'}}>
                          <img className='' src={logo_icon} style={{width: '54px',marginRight: '15px'}}/>
                          <span style={{display:'inline-block',fontWeight:'bold',color:'#fff',lineHeight:'45px',fontSize:'40px',verticalAlign:'middle'}}>司法E通</span>
                        </div>
                    </div>
                    <div className='col-sm-6 col-xs-6'>
                        <div style={{textAlign:'right'}}>
                          <a href='javascript:;' className='modules_font hover_font' style={{marginRight:'1.8em'}} onClick={this.onClickEditModules}>
                            <img className='' src={edit_icon} style={{display:'inline-block',width: '30px',margin: '1.5em 0 2em'}}/>
                            <span>{this.state.showDelIcon?('取消'):('编辑')}</span>
                          </a>
                          <a href='javascript:;' className='modules_font hover_font'>
                            <LogOutComp className="logout_modules_page">
                              <span><img className='' src={logOut_icon} style={{display:'inline-block',width: '30px',margin: '1.5em 0 2em'}}/>退出</span>
                            </LogOutComp>
                          </a>
                        </div>
                    </div>
                  </div>
                </div>
                {modulesItem}

                <div className="row" style={{background:'#fff',height:'153px',width:'98%',marginTop:'20px'}}>
                  <div className="inner">
                    <div className="title" style={{marginLeft:'20px'}}><span className="square" style={{marginRight:'5px'}}></span><span style={{verticalAlign:'text-bottom'}}>内部通知</span></div>
                      <div className="line"></div>
                        <div style={{marginTop:10}}>{noticeListItem}</div>
                  </div>
                </div>
                <div className="modules_footer row">
                  <span>版权所有@长沙市司法局</span>
                  <span>ICP备案10200870号</span>
                  <span>技术支持：湖南必和必拓科技发展公司</span>
                </div>

              </div>
              <ModulesAddPcComp
                visible={this.state.showAddDialog}
                allModulesData={this.props.allModulesData}
                localStoreKey4Modules={this.props.localStoreKey4Modules}
                closeAddDialogCall={this.closeAddDialogCall}
                notShowModuleIdInPC={this.props.notShowModuleIdInPC}
                afterCloseAddDialog={this.afterCloseAddDialog}/>
            </div>
        );
    }
}

ModulesPcComp.defaultProps = {
};
ModulesPcComp.propTypes = {
  allModulesData:React.PropTypes.array,
  handleGoMatter:React.PropTypes.func,
  localStoreKey4Modules:React.PropTypes.string,
  notShowModuleIdInMobile:React.PropTypes.string,
  notShowModuleIdInPC:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default ModulesPcComp;
