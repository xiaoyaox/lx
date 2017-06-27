import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import UserStore from 'stores/user_store.jsx';
import * as organizationUtils from '../utils/organization_utils.jsx';
import superagent from 'superagent';
import myWebClient from 'client/my_web_client.jsx';
import OrganizationAddEditComp from './organizationAddEdit_comp.jsx';
import OrganizationTreeComp from './organizationTree_comp.jsx';
import PermissionEditComp from './permissionEdit_comp.jsx';

import { Row, Col, Form, Icon, Input, Button as ButtonPc , Table, Modal,Card,notification } from 'antd';
const FormItem = Form.Item;
notification.config({
  top: 68,
  duration: 3
});

class UserManagePage extends React.Component {
  constructor(props) {
      super(props);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.afterAddNewOrganiCall = this.afterAddNewOrganiCall.bind(this);
      this.afterDeleteOrganiCall = this.afterDeleteOrganiCall.bind(this);
      this.getSelectCurOrganization = this.getSelectCurOrganization.bind(this);
      this.state = {
        loading: false,
        hasOperaPermission:hasOperaPermission,
        curSelectOrganization:{},
        organizationsData:[], //分层结构的组织机构数据。
        organizationsFlatData:[], //扁平的组织机构数据。
        organizationsFlatDataMap:{}   //扁平的键值对map结构的数据。
      };
  }
  componentWillMount(){
    // this.getServerOrganizationsData();
  }
  getServerOrganizationsData(){
    myWebClient.getOrganizationsData((data,res)=>{
      let objArr = JSON.parse(res.text);
      // console.log("request server orgnizasitions:",objArr);
        this.updateOrganizationFlatData(objArr);
        this.setState({"organizationsData":objArr});
    }, (e,err,res)=>{
      notification.error({message:"获取组织结构数据失败了！"});
        // console.log("request server orgnizasitions response error info:", err);
    });
  }

  updateOrganizationFlatData(objArr){
    let flatDataArr = organizationUtils.getOrganizationsFlatDataArr(objArr); //平行的object数组结构。
    let flatDataMap = organizationUtils.getOrganizationsFlatMap(flatDataArr);
    // console.log("request server orgnizasitions flat data:",flatDataArr);
    // console.log("request server orgnizasitions flat map:",flatDataMap);
    this.setState({"organizationsFlatData":flatDataArr,"organizationsFlatDataMap":flatDataMap});
  }

  afterAddNewOrganiCall(){ //新增成功后调用，重新去服务器获取一遍组织结构数据。
    this.getServerOrganizationsData();
  }
  afterDeleteOrganiCall(){
    this.setState({curSelectOrganization:{}});
    this.getServerOrganizationsData();
  }
  getSelectCurOrganization(curSelectOrganization){
    this.setState({curSelectOrganization:curSelectOrganization});
  }
  handleResetFromCall = ()=>{
    this.setState({curSelectOrganization:{}});
  }

  render() {
    const { menberInfo } = this.props;
    return (
      <div>
        <OrganizationAddEditComp
          curOrganization={this.state.curSelectOrganization}

          organizationsData={this.state.organizationsData}
          organizationsFlatData={this.state.organizationsFlatData}
          organizationsFlatDataMap={this.state.organizationsFlatDataMap}
          afterAddNewOrganiCall={()=>this.afterAddNewOrganiCall()}
          afterDeleteOrganiCall={()=>this.afterDeleteOrganiCall()}
          handleResetFromCall={this.handleResetFromCall}
        />
        <div></div>
          <Row gutter={16}>
            <Col span={12} >
              <Card title="组织结构树：" style={{ minHeight:'600px',width:'100%' }}>
                <OrganizationTreeComp
                  organizationsData={this.state.organizationsData}
                  organizationsFlatDataMap={this.state.organizationsFlatDataMap}
                  getSelectCurOrganization={(organization) => this.getSelectCurOrganization(organization)}
                  />
              </Card>
            </Col>
            <Col span={12} >
              <Card title={this.state.hasOperaPermission?
                (<span>
                  {this.props.organizationId?null:(<div><span>权限树:</span>
                    <span style={{color:'red',marginLeft:'10px'}}>要编辑权限请先从左边选择一个组织！</span></div>)}
                </span>):
              (<div><span>权限树:</span><span style={{color:'red'}}>没有编辑权限！</span></div>)} style={{ minHeight:'600px',width:'100%' }}>

                <PermissionEditComp
                  organizationId={this.state.curSelectOrganization.id}
                  ></PermissionEditComp>
              </Card>
            </Col>
          </Row>
      </div>
    )
  }
}

UserManagePage.defaultProps = {
};

UserManagePage.propTypes = {
};

export default Form.create()(UserManagePage);
