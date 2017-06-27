import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, Flex} from 'antd-mobile';

import {Icon } from 'antd';
//已废弃不用。
class CommonViewAttachmentPanel extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }
  componentWillMount(){

  }
  render() {
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙市司法督办处理单</div>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>拟办意见</div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>领导意见</div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>办理情况</div>
            </Flex.Item>
          </Flex>
          <WhiteSpace />
          <WhiteSpace />
        </div>
      </div>
    )
  }
}

CommonViewAttachmentPanel.defaultProps = {
};

CommonViewAttachmentPanel.propTypes = {
  dataInfo:React.PropTypes.object,
};

export default CommonViewAttachmentPanel;
