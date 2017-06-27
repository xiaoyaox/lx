
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import { createForm } from 'rc-form';
import myWebClient from 'client/my_web_client.jsx';
import Notice_SendShareComp from './noticeSendShare_comp.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,DatePicker,List, Picker,Switch,ImagePicker,TabBar,Toast} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
//import { district, provinceLite as province } from 'antd-mobile-demo-data';
import * as GlobalActions from 'actions/global_actions.jsx';
const data = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: '2121',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: '2122',
}];

const zhNow = moment().locale('zh-cn').utcOffset(8);
class Notice_AddEditContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.onNavBarRightClick = this.onNavBarRightClick.bind(this);
      this.state = {
        date: zhNow,
        subTabsArr:["","content"], // such as :["","content","send","verify"]
        curSubTab:'content',
        isHide:false,
        enteringValue:zhNow,
        publicValue:zhNow,
        validValue:zhNow,
        cols: 1,
        sValue:['未审核'],
        files: data,
      };
  }
  componentWillMount(){
  }
  onClickSubTab = (data)=>{
    // console.log("onClickSubTab-target:",e.target);
    console.log("onClickSubTab-target:");
    let tabNameCn = data.replace(/\s+/g,"");
    let tabNameCn2En = { "发送共享":"upload"}
    this.props.afterChangeTabCall(tabNameCn2En[tabNameCn]);
  }
  onImageChange = (files, type, index) => {
      console.log(files, type, index);
      this.setState({
        files,
      });
    }
  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    this.props.backToTableListCall();
    //setTimeout(()=>this.props.backToTableListCall(),1000);
  }
  onNavBarRightClick = (...args) => {
    GlobalActions.emitUserLoggedOutEvent();
  }
  onenteringValueChange = (enteringValue) => {
    // console.log('onChange', date);
    this.setState({
      enteringValue,
    });
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
  onClickSendShare = ()=>{
    this.setState({showSendShare:true});
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
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { files } = this.state;
    const detailInfo = {};
    const seasons = [
            [
              {
                label: '未审核',
                value: '未审核',
              },
              {
                label: '已通过',
                value: '已通过',
              },
              {
                label: '未通过',
                value: '未通过',
              }
            ],
            // [
            //   {
            //     label: '2013',
            //     value: '2013',
            //   },
            //   {
            //     label: '2014',
            //     value: '2014',
            //   },
            // ],
            // [
            //   {
            //     label: '2013',
            //     value: '2013',
            //   },
            //   {
            //     label: '2014',
            //     value: '2014',
            //   },
            // ]
    ];
    // const datastate = [
    //   { value: '全部',label: '全部'},
    //   {value: '指定', label: '指定'},
    //   { value: '二哈',label: '二哈'},
    //   <Picker
    //     data={datastate}
    //     cols={this.state.cols}
    //     value={this.state.sValue}
    //     onChange={v => this.setState({ sValue: v })}
    //   >
    //   <List.Item arrow="horizontal">审核情况</List.Item>
    //   </Picker>
    //  ];
    //  let clsName = this.props.isShow && !this.state.isHide?
    //  'oa_detail_container ds_detail_container oa_detail_container_show':
    //  'oa_detail_container ds_detail_container oa_detail_container_hide';
    return (
          <div className="oa_detail_cnt">
            <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onenteringValueChange}
                        value={this.state.enteringValue}
                      >
                      <List.Item arrow="horizontal">录入时间</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
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
                  <Flex.Item><InputItem  editable={true} labelNumber={3} placeholder="副标题">副标题</InputItem></Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item><InputItem  editable={true} labelNumber={4} placeholder="文章来源">文章来源</InputItem></Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item><InputItem  editable={true} labelNumber={4} placeholder="所属类别">通知公告</InputItem></Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item><InputItem  editable={true} labelNumber={3} placeholder="录入人">录入人</InputItem></Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <List renderHeader={() => '内容'}>
                         <TextareaItem
                           rows={5}
                         />
                     </List>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <List.Item
                      extra={<Switch
                          {...getFieldProps('Switch1', {
                            initialValue: true,
                            valuePropName: 'checked',
                          })}
                        onClick={(checked) => { console.log(checked); }}
                      />}>
                        全部发布范围
                      </List.Item>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                        <Picker
                              data={seasons}
                              cascade={false}
                              extra="请选择(可选)"
                              value={this.state.sValue}
                              onChange={v => this.setState({ sValue: v })}
                        >
                        <List.Item arrow="horizontal">审核情况</List.Item>
                        </Picker>
                      </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <List.Item
                      extra={<Switch
                          {...getFieldProps('Switch2', {
                            initialValue: true,
                            valuePropName: 'checked',
                          })}
                        onClick={(checked) => { console.log(checked); }}
                      />}>
                        是否启动附件
                      </List.Item>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                        <List renderHeader={() => '相关图片'}>
                              <ImagePicker
                                  files={files}
                                  onChange={this.onImageChange}
                                  onImageClick={(index, fs) => console.log(index, fs)}
                                  selectable={files.length < 5}
                             />
                         </List>

                  </Flex.Item>
              </Flex>
            </div>
                <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={this.state.hidden}
                >
                      <TabBar.Item
                        title="返回"
                        key="返回"
                        icon={
                          <Icon type="left-circle" size="lg" />
                        }
                        selectedIcon={
                          <Icon type="left-circle" size="lg" style={{color:"rgb(51, 163, 244)",fontSize:'0.3rem'}} />
                        }
                        selected={this.state.selectedTab === 'blueTab'}
                        onPress={this.onNavBarLeftClick}
                        data-seed="logId"
                      >
                        {this.renderContent('返回')}
                      </TabBar.Item>
                      <TabBar.Item
                        icon={<Icon type="save" size="lg" />}
                        selectedIcon={<Icon type="save" size="lg" style={{color:"rgb(51, 163, 244)",fontSize:'0.3rem'}} />}
                        title="保存"
                        key="保存"
                        selected={this.state.selectedTab === 'redTab'}
                        onPress={() => this.onClickSave()}
                        data-seed="logId1"
                      >
                        {this.renderContent('保存')}
                      </TabBar.Item>
                      <TabBar.Item
                        icon={<Icon type="upload" size="lg" />}
                        selectedIcon={<Icon type="upload" size="lg" style={{color:"rgb(51, 163, 244)",fontSize:'0.3rem'}} />}
                        title="发送共享"
                        key="发送共享"
                        selected={this.state.selectedTab === 'greenTab'}

                        onPress={()=>this.onClickSubTab("发送共享")}
                      >
                        {this.renderContent('发送共享')}
                      </TabBar.Item>
                </TabBar>
          </div>
    )
  }
}

Notice_AddEditContentComp.defaultProps = {
};

Notice_AddEditContentComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  afterChangeTabCall:React.PropTypes.func,

  // isShow:React.PropTypes.bool,
};

export default createForm()(Notice_AddEditContentComp);
