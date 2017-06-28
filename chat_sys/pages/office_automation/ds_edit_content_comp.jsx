//发文管理--新建
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,Steps, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
const Step = Steps.Step;

class DS_EditContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"content",
        flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}],
        showMainContent: false,
        showUploadContent: false,
        showSendContent: false,
        showFlowContent: false,
        dzTitle: "长沙市司法局文件"
      };
  }

  shouldComponentUpdate(nextProps){
    if(this.props.formData !== nextProps.formData){

    }
    return true;
  }

  onClickSubTab = (data)=>{
    // console.log("onClickSubTab-target:",e.target);
    let tabNameCn = data.replace(/\s+/g,"");
    let tabNameCn2En = {"发送":"send", "上传附件":"upload", "正文":"article", "查阅附件":"referto"}
    this.props.afterChangeTabCall(tabNameCn2En[tabNameCn]);
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

  renderContent = (pageText)=> {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>你已点击“{pageText}” tab， 当前展示“{pageText}”信息</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          点击切换 tab-bar 显示/隐藏
        </a>
      </div>
    );
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
            <Flex.Item><InputItem placeholder="2017" labelNumber={2}>文号</InputItem></Flex.Item>
            <Flex.Item><InputItem placeholder="2017" labelNumber={2} type="Number">份数</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecy} cols={1} {...getFieldProps('secrecy')}>
                  <List.Item arrow="horizontal">密级</List.Item>
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
            <Flex.Item><InputItem placeholder="局长办公室纪要" labelNumber={2}>标题</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder="张三，李四" labelNumber={2}>主送</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="张五，李六" labelNumber={2}>抄送</InputItem></Flex.Item>
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
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>领导签发</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>传批意见</div>
              <div className="textarea_container">
                <TextareaItem
                  title=""
                  autoHeight
                  labelNumber={0}
                  />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <div className={'detail_textarea_title'}>局长审核意见</div>
                <div className="textarea_container">
                  <TextareaItem
                    title=""
                    autoHeight
                    labelNumber={0}
                  />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <div className={'detail_textarea_title'}>分管领导意见</div>
                <div className="textarea_container">
                  <TextareaItem title="" autoHeight labelNumber={0} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>处室负责人意见</div>
                <div className="textarea_container">
                  <TextareaItem
                    title=""
                    autoHeight
                    labelNumber={0}
                  />
                </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <div className={'detail_textarea_title'}>核稿</div>
                <div className="textarea_container">
                  <TextareaItem
                    title=""
                    autoHeight
                    labelNumber={0}
                  />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>拟稿单位</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4}>拟稿人</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" editable="fasle" labelNumber={4}>日期</InputItem></Flex.Item>
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
