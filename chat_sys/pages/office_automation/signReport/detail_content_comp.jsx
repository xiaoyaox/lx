import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon } from 'antd';

class DetailContentCompRaw extends React.Component {
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
    const {detailInfo, formData, formDataRaw} = this.props;
    let items = formDataRaw.gwlc?formDataRaw.gwlc.items:[];
    //请示类别当前值就是gwlc字段的值。--公文流程。
    let owerPleaTypes = items.map((item)=>{ //请示类别。
      return {
        label:item.text,
        value:item.value
      }
    });
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局工作(报告)单</div>
          <Flex>
            <Flex.Item><InputItem value={formData.ngr_show} editable={false} labelNumber={4}>拟稿人：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={detailInfo.department||""} editable={false} labelNumber={5}>拟稿单位：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={detailInfo.draftDate} editable={false} labelNumber={5}>拟稿日期：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>标题：</div>
              <TextareaItem
                {...getFieldProps('subjectTitle',{
                  initialValue: detailInfo.fileTitle,
                })}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }} className={'picker_list'}>
                <Picker data={owerPleaTypes} cols={1} {...getFieldProps('pleaType',{})}
                  disabled={true}
                  value={[formData.gwlc]}
                  onOk={this.onPickerOk}>
                  <List.Item arrow="horizontal">请示类别：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>领导批示：</div>
              <TextareaItem
              title=''
              value={detailInfo.leaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>主管财务领导：</div>
              <TextareaItem
              title=''
              value={detailInfo.fanancialLeaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>分管领导意见：</div>
              <TextareaItem
              title=''
              value={detailInfo.divideLeaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>处室负责人：</div>
              <TextareaItem
              title=''
              value={detailInfo.roomLeaderAdvice}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>核稿：</div>
              <TextareaItem
              title=''
              value={detailInfo.verifyText}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>事由：</div>
              <TextareaItem
                {...getFieldProps('reason',{ initialValue:formData.nr || '' })}
                title=""
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

DetailContentCompRaw.defaultProps = {
};

DetailContentCompRaw.propTypes = {
  activeTabkey:React.PropTypes.string,
};
const DetailContentComp = createForm()(DetailContentCompRaw);
export default DetailContentComp;
