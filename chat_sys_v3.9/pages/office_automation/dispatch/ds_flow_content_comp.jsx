//发文详情页-- 查看流程
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,Steps, TabBar, Picker, List } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';

class DS_FlowContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

DS_FlowContentComp.defaultProps = {
};

DS_FlowContentComp.propTypes = {
  detailInfo:React.PropTypes.object,
  afterChangeTabCall:React.PropTypes.func,
};



export default createForm()(DS_FlowContentComp);
