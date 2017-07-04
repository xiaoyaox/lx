//通知公告的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,DatePicker,List} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
//import { district, provinceLite as province } from 'antd-mobile-demo-data';
import * as GlobalActions from 'actions/global_actions.jsx';

const zhNow = moment().locale('zh-cn').utcOffset(8);
class Notice_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.onNavBarRightClick = this.onNavBarRightClick.bind(this);
      this.state = {
        date: zhNow,
        subTabsArr:["","content"], // such as :["","content","send","verify"]
        curSubTab:'content',
        isHide:false,
        publicValue:zhNow,
        validValue:zhNow,
        cols: 1,
      };
  }
  componentWillMount(){
  }

  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    this.props.backToTableListCall();
    //setTimeout(()=>this.props.backToTableListCall(),1000);
  }
  onNavBarRightClick = (...args) => {
    GlobalActions.emitUserLoggedOutEvent();
  }

  onpublicValueChange = (publicValue) => {
    // console.log('onChange', date);
    this.setState({
      publicValue,
    });
  }
  onvalidValueChange = (validValue) => {
    // console.log('onChange', date);
    this.setState({
      validValue,
    });
  }


  render() {
    const detailInfo = {};
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
          信息详情
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <div className={'oa_detail_cnt'}>
            <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>

                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onpublicValueChange}
                        value={this.state.publicValue}
                      >
                      <List.Item arrow="horizontal">发布日期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onvalidValueChange}
                        value={this.state.validValue}
                      >
                      <List.Item arrow="horizontal">有效期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item><InputItem  editable={true} labelNumber={2} placeholder="标题">标题</InputItem></Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <List renderHeader={() => '内容'}>
                         <TextareaItem
                           rows={8}
                         />
                     </List>
                  </Flex.Item>
                </Flex>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

Notice_DetailComp.defaultProps = {
};

Notice_DetailComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Notice_DetailComp;
