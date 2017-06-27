
import $ from 'jquery';
import React from 'react';
import {Link} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
import {Popup, Toast, List, NavBar, Button}  from 'antd-mobile';
import {Icon,Row, Col,Button as ButtonPc, Checkbox} from 'antd';

import * as commonUtils from '../utils/common_utils.jsx';
import LogOutComp from '../components/log_out_comp.jsx'

import signup_logo from 'images/signup_logo.png';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class ModulesMobileComp extends React.Component {
    constructor(props) {
        super(props);
        // this.handleSendLink = this.handleSendLink.bind(this);
        let delModules = (localStorage.getItem(props.localStoreKey4Modules) || '').split(',');
        delModules = commonUtils.removeNullValueOfArr(delModules);
        (delModules.indexOf(props.notShowModuleIdInMobile) == -1)?
          localStorage.setItem(props.localStoreKey4Modules,[props.notShowModuleIdInMobile].join(',')):null;
        this.state = {
          colNumPerRow:3,
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
      delModules = commonUtils.removeNullValueOfArr(delModules);
      // console.log("refreshModules--delModules--:",delModules);
      let showItemSum = this.props.allModulesData.length - delModules.length;
      console.log("showItemSum:",showItemSum);
      let itemRowSum = Math.ceil((showItemSum+1)/this.state.colNumPerRow);
      if(showItemSum%this.state.colNumPerRow == 0){
        itemRowSum+=1;
      }
      this.setState({
        "curDelModuleIds":delModules,
        "showItemSum":showItemSum,
        "itemRowSum":itemRowSum
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
          if(canLinkTo && item.tagName == "Link"){
            return (
              <Col span={6} key={index} className='modules_item_mobile'>
                <Link to={item.linkTo}
                      data-module={item.name}
                      data-canlinkto={canLinkTo}
                      className={item.singleclassName}
                      style={{background:backColor}}>
                  <img className='' src={item.iconName} style={{}}/>
                </Link>
                <span>{item.name}</span>
                {this.state.showDelIcon?(<ButtonPc shape="circle"
                  className={'moduleDelIcon'}
                  onClick={this.onClickDeleteModule}
                  type={'default'}
                  icon="close"
                  data-moduleid={item.id} />):null}
              </Col>
            );
          }else{
            return (
              <Col span={6} key={index} className='modules_item_mobile'>
                <a href="javascript:;"
                    key={index}
                    data-module={item.name}
                    data-canlinkto={canLinkTo}
                    onClick={this.handleModuleClick}
                    className={item.singleclassName}
                    style={{background:backColor}}>
                  <img className='' src={item.iconName} style={{}}/>
                </a>
                <span>{item.name}</span>
                {this.state.showDelIcon?(<ButtonPc shape="circle"
                  className={'moduleDelIcon'}
                  type={'default'}
                  onClick={this.onClickDeleteModule}
                  icon="close"
                  data-moduleid={item.id} />):null}
                </Col>
              );
          }
          return '';
        }
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      // console.log("modulesItem---:",modulesItem);
      // 添加模块按钮
      modulesItem.push(
        (<Col span={6} key={666} className='modules_item_mobile'>
          <div onClick={this.handleModuleClick} data-module={'添加'} data-canlinkto={true}>
            <ButtonPc className="add_more_btn"  icon="plus" />
          </div>
          <span>添加更多</span>
        </Col>)
      );
       //表示最后一行的item不是刚好是colNumPerRow这个数,需要补足空的Col列。
      if((this.state.showItemSum+1)/this.state.colNumPerRow > 0){
        let emptyColNum = this.state.colNumPerRow - (this.state.showItemSum+1)%this.state.colNumPerRow;
        for(let i=0;i<emptyColNum;i++){
          modulesItem.push(
            (<Col span={6} key={668+i} className='modules_item_mobile'>
            </Col>)
          );
        }
      }
      let itemRowEles = [];
      for(let i=1;i <= this.state.itemRowSum;i++){
        let itemCols = modulesItem.slice((i-1)*this.state.colNumPerRow,i*this.state.colNumPerRow);
        itemRowEles.push(
          (<Row key={i} type="flex" justify="space-between" align="bottom" className="modules_content_row">
            {itemCols}
           </Row>)
        );
      }
      return itemRowEles;
    }
    handleModuleClick = (e)=>{
      let curtarget = e.currentTarget;
      let canLinkTo = $(curtarget).data("canlinkto");
      // console.log("click module name:",$(curtarget).data("module"),canLinkTo);
      let moduleName = $(curtarget).data("module");
      if(!canLinkTo){
        e.stopPropagation();
        Toast.info('你还没有该模块的权限', 2, null, false);
        return false;
      }
      if(moduleName == "群聊"){
        this.props.handleGoMatter();
      }else if(moduleName == "添加"){
        // message.success("你点击了添加模块按钮了！");
        this.showPopup();
      }
    }
    onNavBarLeftClick = (e)=>{
      console.log("onNavBarLeftClick:",e);
      this.setState({
        showDelIcon:!this.state.showDelIcon,
      });
    }

    onCheckboxChange = (e)=>{
      let moduleId = e.target["data-moduleid"];
      console.log("onCheckboxChange --e:",e);
      let curDelModuleIds = [...this.state.curDelModuleIds];
      if(e.target.checked){
      curDelModuleIds = commonUtils.removeValueFromArr(curDelModuleIds,moduleId);
        this.setState({ curDelModuleIds });
      }else{
        if(curDelModuleIds.indexOf(moduleId) == -1){
          curDelModuleIds.push(moduleId);
          this.setState({ curDelModuleIds });
        }
      }
      localStorage.setItem(this.props.localStoreKey4Modules,curDelModuleIds.join(','));
      this.refreshModules();
      this.onClosePopup();
    }

    getModulesItemList(){
      let modulesItem = this.props.allModulesData.map((item,index)=>{
        let isChecked = this.state.curDelModuleIds.indexOf(item.id) == -1;
        if(item.id == this.props.notShowModuleIdInMobile){
          return "";
        }
        return (
          <Row key={item.id} style={{width:'100%'}}>
            <Col span={24} className={'checkbox_'+item.id}>
              <Checkbox
                onChange={this.onCheckboxChange}
                style={{fontSize:'1em',padding:'0.6rem 1rem 0'}}
                checked={isChecked}
                data-moduleid={item.id}>
                {item.name}
              </Checkbox>
            </Col>
          </Row>
          )
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      return modulesItem;
    }
    showPopup = () => {
      this.setState({showDelIcon:false});
      let moduleItems = this.getModulesItemList();
      Popup.show(<div>
        <List renderHeader={() => (
          <div style={{ position: 'relative',height:'1.5em' }}>
            添加模块
            <span
              style={{position: 'absolute', right: '0.5rem', top: '0.7px'}}
              onClick={() => this.onClosePopup()} >
              <Icon type="close" />
            </span>
          </div>)}
          className="popup-modules_mobile-list"
        >
          {moduleItems}
        </List>
        <ul style={{ padding: '0.18rem 0.3rem', listStyle: 'none' }}>
        </ul>
      </div>, { animationType: 'slide-up', maskClosable: true });
    }
    onClosePopup = (hasModify) => {
      if(hasModify){
        // this.refreshModules();
      }
      Popup.hide();
    }

    render() {
      let objsArr = [{
        name:"五一劳动节放假安排",
        time:"2017-4-21"
      },{
        name:"2017年度职称审核表",
        time:"2017-1-11"
      },{
        name:"最新文件上传",
        time:"2017-4-22"
      },{
        name:"最新活动时间",
        time:"2017-4-28"
      }];
      let listItem =[];
      listItem.push(
          objsArr.map((obj,index)=>{
            return (<div key={index} style={{height:'35px'}}><a className="lf">{obj.name}</a><a className="rt">{obj.time}</a></div>)
          })
        );
        let modulesItem = this.getCurModulesItem(this.props.allModulesData);
        return (
            <div className='modules_page_container'>
              <NavBar
                style={{position:'fixed',height:'60px',zIndex:'99999',width:'100%',top:0}}
                className="mobile_navbar_custom"
                iconName = {false}
                leftContent={[ <Icon type="edit" className="back_arrow_icon" key={19475609}/>,
                               <span style={{fontSize:'1em'}} key={91234353}>{this.state.showDelIcon?('取消'):('编辑')}</span>
                             ]}
                onLeftClick={this.onNavBarLeftClick}
                rightContent={[ <LogOutComp key={'logoutcomp_123456'}><Icon type="logout" className="" key={30909090909}/></LogOutComp>]} >
                <img width="35" height="35" src={signup_logo}/>司法E通
              </NavBar>
              <div className='modules_content modules_content_mobile' style={{}}>
                {modulesItem}

              </div>

                <div style={{background:'#dedbdb',width:'100%',height:'2em'}}></div>
                <div className="row modules_bottom_mobile" style={{background:'#fff',height:'220px',width:'98%',margin:'0 auto'}}>
                  <div className="inner">
                    <div className="title_mobile"><span className="square"></span><span>内部通知</span></div>
                      <div className="line"></div>
                      {listItem}
                  </div>
                </div>
                <div className="modules_footer row">
                  <span>版权所有@长沙市司法局</span>
                  <span>ICP备案10200870号</span>
                  <span>技术支持：湖南必和必拓科技发展公司</span>
                </div>
            </div>
        );
    }
}

ModulesMobileComp.defaultProps = {
};
ModulesMobileComp.propTypes = {
  allModulesData:React.PropTypes.array,
  handleGoMatter:React.PropTypes.func,
  localStoreKey4Modules:React.PropTypes.string,
  notShowModuleIdInMobile:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default ModulesMobileComp;
