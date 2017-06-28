//发文详情页-- 发送
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { SearchBar, Tabs, Button, List, Flex, Toast, Switch } from 'antd-mobile';
import { Icon } from 'antd';
import { createForm } from 'rc-form';
import DS_DepartmentComp from './ds_department_comp.jsx';//发文详情页-- 查看流程

const TabPane = Tabs.TabPane;

class DS_SendContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        showDepartment: false,
        flowBranchList:[], //流程分支列表
        flowBranch2PersonMap:{}, //流程分支对应的人员列表
      };
  }
  componentWillMount(){
    if(this.props.docunid){
      this.getServerSendInfo();
    }
  }
  getServerSendInfo = ()=>{
    OAUtils.getFlowSendInfo({
      tokenunid:this.props.tokenunid,
      modulename:this.props.modulename,
      docunid:this.props.docunid,
      otherssign:this.props.otherssign,
      gwlcunid:this.props.gwlcunid,
      successCall: (data)=>{
        console.log("get 发文管理的发送的流程和人员信息数据:",data);
        this.formatServerSendInfo(data.values['lcfzs']); //解析流程分支数据
      }
    });
  }

  formatServerSendInfo = (flowBranchs)=>{
    let flowBranch2PersonMap = {};
    let flowBranchList = flowBranchs.map((item)=>{
      flowBranch2PersonMap[item.value] = item.persons;
      return {
        label:item.name,
        value:item.value
      }
    });
    this.setState({
      flowBranch2PersonMap,
      flowBranchList,
    });
    console.log("flowBranchList--:",flowBranchList);
    console.log("flowBranch2PersonMap--:",flowBranch2PersonMap);
  }

  onChange = (val) => {
    console.log(val);
  }

  onClickSend = () => {
    //保存发送的信息 并且返回到详情页
    let checkedList = $(".checkbox_list :checked");
    let person = {};
    if(checkedList.length){
      person={name: checkedList[0].attributes[2].value, persons:""};
      for(let i=0; i<checkedList.length; i++){
        if(person.persons === ""){
          person.persons = checkedList[i].id;
        }else{
          person.persons += checkedList[i].id;
        }
      }
    }
    this.saveFlowSendInfo(person);
  }
  saveFlowSendInfo = (person)=>{ //保存发送的信息
    OAUtils.saveFlowSendInfo({
      docunid: this.props.docunid,
      gwlcunid:this.props.gwlcunid,
      modulename:this.props.modulename,
      title: this.props.detailInfo.fileTitle,
      message: 1,
      personunids: person,
      successCall: (data)=>{
        console.log("发送保存成功:",data);
        this.props.backDetailCall();
      },
      errorCall:(data)=>{
        Toast.info('发送失败!', 1);
        this.props.backDetailCall();
      }
    });
  }

  onClickShowDepartment = () => {
    this.setState({showDepartment: true});
  }

  onBackSendContentCall = () => {
    this.setState({showDepartment: false});
  }

  render() {
    let {flowBranch2PersonMap, flowBranchList} = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div style={{minHeight:"5rem",padding:"0.2rem"}}>
        {!this.state.showDepartment? (
          <Tabs defaultActiveKey="0">
            {flowBranchList.map((k,index) => (
              <TabPane tab={k.value} key={index}>
                  <div className="flex-container">
                    <div className="sub-title">
                      <h5 className="pull-left">长沙市司法局</h5>
                      {/*
                      <Button className="btn pull-right" inline size="small" type="primary" onClick={this.onClickShowDepartment}>按部门</Button>
                      */}
                    </div>
                    <div className="searchBar_custom">
                      <SearchBar placeholder="搜索" />
                    </div>
                    <div className="checkbox_list">
                      {flowBranch2PersonMap[k.value].map(i => (
                        <div key={i.unid} className="checkbox_custom">
                          <input type="checkbox" id={i.unid} data={k.value} className="checkbox" />
                          <label htmlFor={i.unid}><span className="box"><i></i></span>{i.commonname}</label>
                        </div>
                      ))}
                    </div>
                    <div className="switch_custom">
                      <List.Item
                        extra={<Switch
                          {...getFieldProps('Switch1', {
                            initialValue: true,
                            valuePropName: 'checked',
                          })}
                          onClick={(checked) => { console.log(checked); }}
                        />}
                      >网络消息</List.Item>
                    </div>
                    <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>
                    <div id="errorMsg">选择发送人员失败！</div>
                  </div>
              </TabPane>
            ))}
          </Tabs>
        ):null}
        {this.state.showDepartment? (<DS_DepartmentComp backSendContentCall={()=>this.onBackSendContentCall()} isShow={true}/>):null}
      </div>
    )
  }
}

DS_SendContentComp.defaultProps = {
};

DS_SendContentComp.propTypes = {
  onBackDetailCall:React.PropTypes.func
};


export default createForm()(DS_SendContentComp);
