//通知公告的新增页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import Notice_SendShareComp from './noticeSendShare_comp.jsx';
import Notice_AddEditContentComp from './noticeAddEditContent_comp.jsx';
import { WingBlank, WhiteSpace,NavBar} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
//import { district, provinceLite as province } from 'antd-mobile-demo-data';
import * as GlobalActions from 'actions/global_actions.jsx';
const zhNow = moment().locale('zh-cn').utcOffset(8);
class Notice_AddEditComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.onNavBarRightClick = this.onNavBarRightClick.bind(this);
      this.state = {
        date: zhNow,
        subTabsArr:["","content"], // such as :["","content","send","verify"]
        curSubTab:'content',
        isHide:false,
      };
  }
  componentWillMount(){
  }
  onBackDetailCall = ()=>{
    this.setState({curSubTab:'content'});
  }
  afterChangeTabCall = (tabname)=>{ //切换tab。
    let {subTabsArr} = this.state;
    subTabsArr.push(tabname);
    this.setState({
      curSubTab:tabname,
      subTabsArr,
    });
  }
  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    this.props.backToTableListCall();
    //setTimeout(()=>this.props.backToTableListCall(),1000);
  }
  onNavBarRightClick = (...args) => {
    GlobalActions.emitUserLoggedOutEvent();
  }
  renderContent = (pageText)=> {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>你已点击“{pageText}” tab， 当前展示“{pageText}”信息</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          点击切换 tab-bar 显示/隐藏
        </a>
      </div>
    );
  }
  render() {
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}
          rightContent={[
            <Icon key={1} type="logout" onClick={this.onNavBarRightClick}/>,
            <span key={2} onClick={this.onNavBarRightClick}>退出</span>
          ]}>
          信息录入
        </NavBar>
        <div style={{marginTop:'60px'}}>
            {this.state.curSubTab == "content"? (<Notice_AddEditContentComp
              afterChangeTabCall={this.afterChangeTabCall}
               backToTableListCall={()=>this.props.backToTableListCall()} />):null}
        </div>
        {this.state.curSubTab == "upload"? (<Notice_SendShareComp
          backDetailCall={this.onBackDetailCall}
          isShow={true}/>):null}

      </div>
    )
  }
}

Notice_AddEditComp.defaultProps = {
};

Notice_AddEditComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Notice_AddEditComp;
