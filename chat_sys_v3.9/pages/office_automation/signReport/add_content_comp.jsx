import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon } from 'antd';
//签报管理的新增内容
class AddContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        tabName:"content",
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
  }

  render() {
    const { getFieldProps } = this.props.form;
    let owerPleaTypes = [
      {
        label:"其他请示事项（新）",
        value:"其他请示事项（新）"
      },{
        label:"资金类请示事项（新）",
        value:"资金类请示事项（新）"
      },{
        label:"文电分办",
        value:"文电分办"
      },{
        label:"会议、活动（新）",
        value:"会议、活动（新）"
      },{
        label:"需报送上级机关或平级机关的公文（新）",
        value:"需报送上级机关或平级机关的公文（新）"
      }
    ];
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局工作(报告)单</div>
          <Flex>
            <Flex.Item><InputItem value={this.state.loginUserName}
              placeholder={'请输入...'}
              editable={true}
              labelNumber={4}>拟稿人：</InputItem>
          </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="148中心"
              placeholder={'请输入...'}
              editable={true}
              labelNumber={5}>拟稿单位：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={this.state.nowDate}
              placeholder={'请输入...'}
              editable={true}
              labelNumber={5}>拟稿日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>标题：</div>
              <TextareaItem
                {...getFieldProps('subjectTitle')}
                title=""
                placeholder={'请输入...'}
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }} className={'picker_list'}>
                <Picker data={owerPleaTypes} cols={1} {...getFieldProps('pleaType')} onOk={this.onPickerOk}>
                  <List.Item arrow="horizontal">请示类别：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={5}>领导批示：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={7}>主管财务领导：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={7}>分管领导意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={6}>处室负责人：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={3}>核稿：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>事由：</div>
              <TextareaItem
                {...getFieldProps('reason')}
                title=""
                placeholder={'请输入...'}
                rows={5}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{height:'1rem'}}/>
        </div>
      </div>
    )
  }
}

AddContentCompRaw.defaultProps = {
};

AddContentCompRaw.propTypes = {
};
const AddContentComp = createForm()(AddContentCompRaw);
export default AddContentComp;
