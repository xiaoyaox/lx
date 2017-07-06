//发文管理--新建
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
import moment from 'moment';

class DS_EditContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}],
        dzTitle: "长沙市司法局文件"
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
  }


  shouldComponentUpdate(nextProps){
    if(this.props.formData !== nextProps.formData){

    }
    return true;
  }

  handleChange = (value)=> {
    if(value === "1"){
      //发文
      this.setState({dzTitle: "长沙市司法局文件", flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}]});
      $("#FGYJ").show();
      $("#HG").show();
      $("#JZYJ").show();
      $("#FW").show();
      $("#LDFW").hide();
    }else if(value === "2"){
      //领导小组发文
      this.setState({dzTitle: "领导小组文件(稿纸)", flow: [{label: '领导小组发文',value: '领导小组发文'},{label: '司法局发文流程',value: '司法局发文流程'}]});
      $("#FGYJ").hide();
      $("#HG").hide();
      $("#JZYJ").show();
      $("#FW").hide();
      $("#LDFW").show();
    }else if(value === "3"){
      //领导小组办公室发文
      this.setState({dzTitle: "领导小组办公室文件(稿纸)", flow: [{label: '领导小组办公室发文',value: '领导小组办公室发文'},{label: '司法局发文流程',value: '司法局发文流程'}]});
      $("#FGYJ").hide();
      $("#HG").hide();
      $("#JZYJ").hide();
      $("#FW").hide();
      $("#LDFW").show();
    }
  }

  onClickSave = ()=> {
    Toast.info('保存成功!', 1);
    this.props.backToTableListCall();
    let form = this.props.form;
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const secrecy = [{label: '秘密',value: '秘密'},{label: '机密',value: '机密'}];
    const urgency = [{label: '急',value: '急'},{label: '紧急',value: '紧急'},{label: '特急',value: '特急'},{label: '特提',value: '特提'}];
    return (
      <div style={{marginBottom: "100px"}}>
        <Select defaultValue="请选择您要起草的发文类型" onChange={this.handleChange} style={{margin:"0.16rem"}} id="dsType">
          <Select.Option value="1">发文</Select.Option>
          <Select.Option value="2">领导小组发文</Select.Option>
          <Select.Option value="3">领导小组办公室发文</Select.Option>
        </Select>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{this.state.dzTitle}</div>
          <Flex>
            <Flex.Item><InputItem editable={false} labelNumber={3}>文号：</InputItem></Flex.Item>
            <Flex.Item><InputItem placeholder="请输入..." labelNumber={3} type="Number">份数：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecy} cols={1} {...getFieldProps('secrecy')}>
                  <List.Item arrow="horizontal">密级：</List.Item>
                </Picker>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className="select_container">
                <Picker data={urgency} cols={1} {...getFieldProps('urgency')}>
                  <List.Item arrow="horizontal">缓急</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>标题：</div>
              <div className="textarea_container">
                <TextareaItem
                  title=""
                  rows={3}
                  placeholder="请输入..."
                  labelNumber={0}
                  />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>主送：</div>
              <div className="textarea_container">
                <TextareaItem
                  title=""
                  rows={3}
                  placeholder="请输入..."
                  labelNumber={0}
                  />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>抄送：</div>
              <div className="textarea_container">
                <TextareaItem
                  title=""
                  rows={3}
                  placeholder="请输入..."
                  labelNumber={0}
                  />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={this.state.flow} cols={1} {...getFieldProps('flow')}>
                  <List.Item arrow="horizontal">公文流程</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem editable={false} value="--" labelNumber={5}>领导签发：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem editable={false} value="--" labelNumber={5}>传批意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <InputItem editable={false} value="--" labelNumber={7}>局长审核意见：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <InputItem editable={false} value="--" labelNumber={7}>分管领导意见：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem editable={false} value="--" labelNumber={8}>处室负责人意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <InputItem editable={false} value="--" labelNumber={3}>核稿：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="148中心"
              editable={true}
              labelNumber={5}>拟稿单位：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={this.state.loginUserName}
              editable={true}
              labelNumber={4}>拟稿人：</InputItem>
          </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={this.state.nowDate}
              editable={true}
              labelNumber={5}>拟稿日期：</InputItem>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}

DS_EditContentComp.defaultProps = {
};

DS_EditContentComp.propTypes = {
};



export default createForm()(DS_EditContentComp);
