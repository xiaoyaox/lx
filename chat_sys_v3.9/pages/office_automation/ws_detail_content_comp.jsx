import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex} from 'antd-mobile';

import {Icon } from 'antd';

class WS_DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"content",
      };
  }
  componentWillMount(){

  }
  onClickSubTab = (e)=>{
    // console.log("onClickSubTab-target:",e.target);
    let tabNameCn = e.target.innerText.replace(/\s+/g,"");
    let tabNameCn2En = {"发送":"send", "阅文意见":"verify", "正文":"article", "查阅附件":"referto"}
    this.props.afterChangeTabCall(tabNameCn2En[tabNameCn]);
  }
  render() {
    return (
      <div>
        <div className={'oa_detail_top_btn'} onClick={this.onClickSubTab}>
          <Button type="ghost" inline size="small" style={{ marginRight: '0.08rem' }}>发送</Button>
          <Button type="ghost" inline size="small" style={{ marginRight: '0.08rem' }}>阅文意见</Button>
          <Button type="ghost" inline size="small" style={{ marginRight: '0.08rem' }}>正文</Button>
          <Button type="primary" inline size="small">查阅附件</Button>
        </div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙市司法督办处理单</div>
          <Flex>
            <Flex.Item><InputItem value="严重" editable={false} labelNumber={2}>督办类型</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="201706021545" editable={false} labelNumber={2}>文件号</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="2017-12-12" editable={false} labelNumber={2}>办理时限</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="2017-02-02" editable={false} labelNumber={2}>收文日期</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="xxxx" editable={false} labelNumber={2}>催办</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="xxxxx" editable={false} labelNumber={4}>原号</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="xxxxx" editable={false} labelNumber={4}>附件名</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>拟办意见</div>
              <TextareaItem
                title=""
                value={'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈'}
                autoHeight
                editable={false}
                labelNumber={0}
                />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>领导意见</div>
              <TextareaItem
                title=""
                value={'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈'}
                autoHeight
                editable={false}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>办理情况</div>
              <TextareaItem
                title=""
                value={'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈'}
                autoHeight
                editable={false}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace />
          <WhiteSpace />
        </div>
      </div>
    )
  }
}

WS_DetailContentComp.defaultProps = {
};

WS_DetailContentComp.propTypes = {
  detailInfo:React.PropTypes.object,
  afterChangeTabCall:React.PropTypes.func,
};

export default WS_DetailContentComp;
