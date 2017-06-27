//督办管理的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar,List} from 'antd-mobile';

import {Icon } from 'antd';
import moment from 'moment';

import 'moment/locale/zh-cn';

import DetailContentComp from './detail_content_comp.jsx';
import CommonSendComp from '../common_send_comp.jsx';
import CommonVerifyComp from '../common_verify_comp.jsx';

const zhNow = moment().locale('zh-cn').utcOffset(8);

class SuperviseDetail extends React.Component {
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
  onBackDetailCall = ()=>{
    this.setState({curSubTab:'content',selectedTab:''});
  }
  onClickAddSave = ()=>{ //点击了保存
    //TODO
    this.setState({
      selectedTab: '',
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
          {this.state.curSubTab == "content"? (<DetailContentComp detailInfo={detailInfo} />):null}
        </div>
        {this.state.curSubTab == "send"? (<CommonSendComp backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
        {this.state.curSubTab == "verify"? (<CommonVerifyComp backDetailCall={this.onBackDetailCall} isShow={true}/>):null}

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
          <TabBar.Item
            title="正文"
            key="正文"
            icon={ <Icon type="menu-unfold" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="menu-fold" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'articleTxtTab'}
            onPress={() => {
              this.setState({
                curSubTab:'content',
                selectedTab: 'articleTxtTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
        </TabBar>
        <div style={{position:'fixed',bottom:'1rem',right:'0',display:'none'}}>
          <List>
            <List.Item onClick={this.onClickMoreOperate}>办文跟踪</List.Item>
          </List>
        </div>
      </div>
    )
  }
}

SuperviseDetail.defaultProps = {
};

SuperviseDetail.propTypes = {
  backToTableListCall:React.PropTypes.func,
};

export default SuperviseDetail;
