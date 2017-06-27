//督办管理的新增页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar} from 'antd-mobile';

import {Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';


import AddContentComp from './add_content_comp.jsx';
import CommonSendComp from '../common_send_comp.jsx';
import CommonVerifyComp from '../common_verify_comp.jsx';

const zhNow = moment().locale('zh-cn').utcOffset(8);

class SuperviseAdd extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        date: zhNow,
        hidden: false,
        selectedTab:'',
        curSubTab:'content',
      };
  }
  componentWillMount(){
  }
  onNavBarLeftClick = (e) => {
    this.props.backToTableListCall();
  }
  onBackContentCall = ()=>{ //返回内容区
    this.setState({curSubTab:'content',selectedTab:''});
  }
  onClickAddSave = ()=>{ //点击了保存
    //TODO
    this.setState({
      selectedTab: 'saveTab',
    });
    this.props.backToTableListCall();
  }

  render() {
     const detailInfo = {};
    //  let clsName = this.props.isShow && !this.state.isHide?
    //  'oa_detail_container ds_detail_container oa_detail_container_show':
    //  'oa_detail_container ds_detail_container oa_detail_container_hide';
    return (
      <div className={"oa_detail_container ds_detail_container"}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          督办处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"? (<AddContentComp />):null}
        </div>
        {this.state.curSubTab == "send"? (<CommonSendComp backDetailCall={this.onBackContentCall} isShow={true}/>):null}
        {this.state.curSubTab == "verify"? (<CommonVerifyComp backDetailCall={this.onBackContentCall} isShow={true}/>):null}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="保存"
            key="保存"
            icon={ <Icon type="save" style={{fontSize:'0.4rem'}}/> }
            selectedIcon={<Icon type="save" style={{color:'blue',fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'saveTab'}
            onPress={() => this.onClickAddSave()}
          >
          <div></div>
          </TabBar.Item>
          <TabBar.Item
            title="阅文意见"
            key="阅文意见"
            icon={ <Icon type="edit" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="edit" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'verifyTab'}
            onPress={() => {
              this.setState({
                curSubTab:'verify',
                selectedTab: 'verifyTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
          <TabBar.Item
            title="发送"
            key="发送"
            icon={ <Icon type="export" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="export" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'sendTab'}
            onPress={() => {
              this.setState({
                curSubTab:'send',
                selectedTab: 'sendTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

SuperviseAdd.defaultProps = {
};

SuperviseAdd.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default SuperviseAdd;
