import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,Steps} from 'antd-mobile';

import {Icon } from 'antd';
const Step = Steps.Step;
import moment from 'moment';
import 'moment/locale/zh-cn';

import * as GlobalActions from 'actions/global_actions.jsx';
import WS_DetailContentComp from './ws_detail_content_comp.jsx';
import CommonSendComp from './common_send_comp.jsx';
import CommonVerifyComp from './common_verify_comp.jsx';

const zhNow = moment().locale('zh-cn').utcOffset(8);

class WS_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.onNavBarRightClick = this.onNavBarRightClick.bind(this);
      this.state = {
        date: zhNow,
        subTabsArr:["","content"], // such as :["","content","send","verify"]
        curSubTab:'content',
      };
  }
  componentWillMount(){

  }
  onNavBarLeftClick = (e) => {
    this.onClickCancelBack();
  }
  onNavBarRightClick = (...args) => {
    GlobalActions.emitUserLoggedOutEvent();
  }
  onClickCancelBack = ()=>{
    let {subTabsArr} = this.state;
    subTabsArr.pop();
    let curSubTab = subTabsArr[subTabsArr.length-1];
    this.setState({curSubTab:curSubTab});
    if(!curSubTab){
      this.props.backToTableListCall();
      this.setState({
        subTabsArr:["","content"],
        curSubTab:"content",
      });
    }
  }
  afterChangeTabCall = (tabname)=>{ //切换tab。
    let {subTabsArr} = this.state;
    subTabsArr.push(tabname);
    this.setState({
      curSubTab:tabname,
      subTabsArr,
    });
  }

  render() {
    const detailInfo = {};
    let tabComp;
    if(this.state.curSubTab == "content"){
      tabComp = (<WS_DetailContentComp detailInfo={detailInfo} afterChangeTabCall={this.afterChangeTabCall} />);
    }else if(this.state.curSubTab == "send"){
      tabComp = (<CommonSendComp onClickCancelBack={this.onClickCancelBack}/>);
    }else if(this.state.curSubTab == "verify"){
      tabComp = (<CommonVerifyComp onClickCancelBack={this.onClickCancelBack}/>);
    }
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'99999',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}
          rightContent={[
            <Icon key={1} type="logout" onClick={this.onNavBarRightClick}/>,
            <span key={2} onClick={this.onNavBarRightClick}>退出</span>
          ]}>
          工作督查
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {tabComp}
        </div>


      </div>
    )
  }
}

WS_DetailComp.defaultProps = {
};

WS_DetailComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
};

export default WS_DetailComp;
