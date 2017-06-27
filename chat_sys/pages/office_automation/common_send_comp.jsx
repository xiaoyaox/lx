import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Button,DatePicker, List, InputItem,TextareaItem,Modal,NavBar} from 'antd-mobile';
import { Icon} from 'antd';

//发送组件，公文报送和工作督促公用。
class CommonSendComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"send",
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
        console.log("get 签报管理的发送的流程和人员信息数据:",data);
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
  onNavBarLeftClick = (e) => {
    this.props.backDetailCall();
  }
  render() {
   let {flowBranch2PersonMap, flowBranchList} = this.state;
   let curPersons = flowBranchList[0]?flowBranch2PersonMap[flowBranchList[0].value]:[];
    return (
      <div>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          流程发送
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <div className="flex-container">
            <div className="sub-title">
              <h5 className="pull-left">长沙市司法局</h5>
              <Button className="btn pull-right" inline size="small" type="primary" >按部门</Button>
            </div>
            <div className="searchBar_custom">

            </div>
            <div className="checkbox_list">
              {curPersons.map(i => (
                <div key={i.unid} className="checkbox_custom">
                  <input type="checkbox" id={i.unid} className="checkbox" />
                  <label htmlFor={i.unid}><span className="box"><i></i></span>{i.commonname}</label>
                </div>
              ))}
            </div>
            <div className="switch_custom">

            </div>
            <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>
          </div>
        </div>
      </div>
    )
  }
}

CommonSendComp.defaultProps = {
};

CommonSendComp.propTypes = {
};

export default CommonSendComp;
