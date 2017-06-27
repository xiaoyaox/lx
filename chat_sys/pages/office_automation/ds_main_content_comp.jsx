//发文详情页-- 正文
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { Button, TextareaItem } from 'antd-mobile';

class DS_MainContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {
    return (
      <div style={{minHeight:"5rem",padding:"0.2rem"}}>
        <div className="textarea_custom">
          <TextareaItem
            title=""
            autoHeight
            labelNumber={0}
          />
        </div>
        <Button type="primary" inline style={{float:"right", marginRight: '0.08rem' }}>保存</Button>
      </div>
    )
  }
}

DS_MainContentComp.defaultProps = {
};

DS_MainContentComp.propTypes = {
  detailInfo:React.PropTypes.object,
  afterChangeTabCall:React.PropTypes.func,
};



export default DS_MainContentComp;
