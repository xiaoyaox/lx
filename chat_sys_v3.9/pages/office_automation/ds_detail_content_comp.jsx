import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem, Flex, Steps, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
const Step = Steps.Step;
import CommonFlowTraceComp from './common_flowTrace_comp.jsx';//办文跟踪
import BottomTabBarComp from './signReport/bottomTabBar_comp.jsx';

class DS_DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"content",
        flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}],
        showMainContent: false,
        showUploadContent: false,
        showSendContent: false,
        showFlowContent: false,
        modulename:'qbgl', //模块名
        curSubTab:'content',
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
    const { detailInfo, formData, formDataRaw , tokenunid, modulename } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const secrecy = [{label: '秘密',value: '秘密'},{label: '机密',value: '机密'}];
    const urgency = [{label: '急',value: '急'},{label: '紧急',value: '紧急'},{label: '特急',value: '特急'},{label: '特提',value: '特提'}];
    return (
      <div style={{marginBottom: "100px"}}>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{detailInfo.fileTitle}</div>
          <Flex>
            <Flex.Item><InputItem placeholder="2017" labelNumber={2}>文号</InputItem></Flex.Item>
            <Flex.Item><InputItem placeholder="2017" labelNumber={2} type="Number">份数</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecy} cols={1}
                  {...getFieldProps('secrecy',{
                    initialValue:detailInfo.secrecy || "",
                  })}>
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
            <Flex.Item><InputItem placeholder="xxxxx" labelNumber={4} value={formData.ngr_show}>拟稿人</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="xxxxx" editable="fasle" value={formData.ngrq_show}>日期</InputItem></Flex.Item>
          </Flex>
          <div style={{height:'0.5rem',width:'100%',margin:'1em 0',background:'#efe9e9'}}></div>
          <div style={{height:'2.5em',lineHeight:'2.5em',marginLeft:'0.2rem',borderBottom:'1px solid #d6d1d1'}}>
            <span style={{width:'0.1rem',height:'1em',lineHeight:'2.5em',verticalAlign: 'middle',background:'red',display:'inline-block'}}></span>
            <span style={{marginLeft:'0.2rem',color:'black',fontWeight:'bold'}}>办公追踪-流转记录</span>
          </div>
          <CommonFlowTraceComp
            tokenunid={tokenunid}
            docunid={detailInfo.unid}
            gwlcunid={formData.gwlc}
            modulename={modulename}
            />
        </div>
        <div className="custom_tabBar">
          <BottomTabBarComp
            hidden={false}
            isAddNew={false}
            formDataRaw={formData}
            selectedTab={this.state.selectedTab}
            onClickAddSave={()=>this.onClickAddSave()}
            onClickVerifyBtn={()=>{
              this.setState({
                curSubTab:'verify',
                selectedTab: 'verifyTab',
              });
            }}
            onClickSendBtn={()=>{
              this.setState({
                curSubTab:'send',
                selectedTab: 'sendTab',
              });
            }}
            onClickTrackBtn={()=>{
              this.setState({
                curSubTab:'track',
                selectedTab: 'trackTab',
              });
            }} />

          {/*<TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          >
            <TabBar.Item
              icon={<Icon type="save" size="lg" />}
              selectedIcon={<Icon type="save" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="保存"
              key="保存"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => this.onClickSave()}
              data-seed="logId1"
            >
              {this.renderContent('保存')}
            </TabBar.Item>
            <TabBar.Item
              title="正文"
              key="正文"
              icon={
                <Icon type="left-circle" size="lg" />
              }
              selectedIcon={
                <Icon type="left-circle" size="lg" style={{color:"rgb(51, 163, 244)"}} />
              }
              selected={this.state.selectedTab === 'blueTab'}
              onPress={() => this.onClickSubTab("正文")}
              data-seed="logId"
            >
              {this.renderContent('正文')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="upload" size="lg" />}
              selectedIcon={<Icon type="upload" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="上传附件"
              key="上传附件"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => this.onClickSubTab("上传附件")}
            >
              {this.renderContent('上传附件')}
            </TabBar.Item>
            <TabBar.Item
              icon={<Icon type="export" size="lg" />}
              selectedIcon={<Icon type="export" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
              title="发送"
              key="发送"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => this.onClickSubTab("发送")}
            >
              {this.renderContent('发送')}
            </TabBar.Item>
          </TabBar>
          */}
        </div>
      </div>
    )
  }
}

DS_DetailContentComp.defaultProps = {
};

DS_DetailContentComp.propTypes = {
};



export default createForm()(DS_DetailContentComp);
