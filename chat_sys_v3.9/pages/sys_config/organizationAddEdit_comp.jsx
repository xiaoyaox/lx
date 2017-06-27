import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import UserStore from 'stores/user_store.jsx';
import * as organizationUtils from 'pages/utils/organization_utils.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { Row, Col, Form, Icon, Input, Button as ButtonPc, notification,TreeSelect,message,Popconfirm,Alert } from 'antd';
const FormItem = Form.Item;
const initOrganizationData = {
  id:"",
  name:"",
  organizationLevel:1,
  parentId:"",
  privilegeLevel:"1"
}

const formItemLayout4Organization = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
notification.config({
  top: 68,
  duration: 3
});
class OrganizationAddEditComp extends React.Component {
  constructor(props) {
      super(props);
      // this.checkOrganizationId = this.checkOrganizationId.bind(this);
      this.onFormSubmit = this.onFormSubmit.bind(this);
      this.handleResetForm = this.handleResetForm.bind(this);
      this.handleDeleteOrganization = this.handleDeleteOrganization.bind(this);
      this.onTreeSelectChange = this.onTreeSelectChange.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        treeSelectValue:'',
        treeSelectData:[],
        treeDefaultExpandedKeys:[],
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
        showWarningStr:'',
      };
  }
  onFormSubmit = (e) => {
    e.preventDefault();
    let curOrganizationId = this.props.curOrganization.id;
    let actionName = curOrganizationId ? "update" : "add";
    let descTxt = curOrganizationId ? "修改" : "新增";
    this.props.form.validateFields((err, values) => {
      if (err) { //
        console.log('validateFields occur errors: ', err);
        return;
      }
      let parentOrgaObj = this.props.organizationsFlatDataMap[this.state.treeSelectValue];
      if(parentOrgaObj){
        values["parentId"] = this.state.treeSelectValue;
        values["organizationLevel"] = parentOrgaObj.organizationLevel + 1;
        values["privilegeLevel"] = parentOrgaObj.organizationLevel + 1+"";
      }
      let params = Object.assign({},initOrganizationData,this.props.curOrganization,values);
      // console.log('addOrEditOrganization params: ', params);
      myWebClient.addOrEditOrganization(actionName,params,
        (data,res)=>{
          notification.success({message: descTxt+'成功！'});
          // console.log("新增编辑组织成功--res:",res);
          this.handleResetForm();
          organizationUtils.getServerOrganizationsData();
        },
        (e,err,res)=>{
          // console.log("新增编辑组织失败--err:",err);
          notification.error({message: descTxt+'失败！'});
      });
    });
  }
  handleDeleteOrganization(){ //删除组织机构
    let curOrganizationId = this.props.curOrganization.id;
    if(!curOrganizationId){
      notification.warning({message: '还没有选择一个组织机构！'});
      return;
    }
    if(this.props.curOrganization && this.props.curOrganization.subOrganizationNum>0){
      this.setState({showWarningStr:'组织机构只能从子节点开始一级一级向上删除！'});
      setTimeout(()=>{
        this.setState({showWarningStr:''});
      },3000);
      return;
    }
    myWebClient.deleteOrganization(curOrganizationId,
      (data,res) => {
        // console.log("删除成功-data:",data);
        // console.log("删除成功--res:",res);
        notification.success({message: '删除成功！'});
        this.handleResetForm();
        organizationUtils.getServerOrganizationsData();
        this.props.afterDeleteOrganiCall();
      },
      (e,err,res) => {
        // console.log("删除失败--err:",err);
        // console.log("删除失败--res:",res);
        if(res.statusCode == 502){ //表示该组织下还有用户，不能删除。
            this.setState({showWarningStr:'改组织机构下还有用户不能直接删除，请先转移用户！'});
            setTimeout(()=>{
              this.setState({showWarningStr:''});
            },3000);
          }else{
            notification.error({message: '删除失败,其他原因！'});
          }
      });
  }

  // checkOrganizationId(rule, value, callback){ //这里的callback是必须调用的。
  //   const form = this.props.form;
  //   let orgaObj = this.props.organizationsFlatDataMap[value];
  //   let curOrganizationId = this.props.curOrganization.id;
  //   if(curOrganizationId){ //是编辑
  //     if(value && orgaObj && curOrganizationId!=value){
  //       callback("该组织机构编码已经存在了，请换一个！");
  //     }else{
  //       callback();
  //     }
  //   }else{ //是新增
  //     if(value && orgaObj){
  //       callback("该组织机构编码已经存在了，请换一个！");
  //     }else{
  //       callback();
  //     }
  //   }
  // }
  handleResetForm(){ //清空输入框
    this.props.form.resetFields();
    this.setState({treeSelectValue:''});
    this.props.handleResetFromCall();
  }

  onTreeSelectChange(value){
    // console.log("treeSelectValue",value);
    this.setState({treeSelectValue:value});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.curOrganization.id != this.props.curOrganization.id){
      this.setState({treeSelectValue:nextProps.curOrganization.parentId});
    }
    if(nextProps.organizationsData){
      let treeSelectData = this.getOrganiTreeSelectData(nextProps.organizationsData);
      let treeDefaultExpandedKeys = this.getTreeDefaultExpandKeys(nextProps.organizationsData);
      this.setState({"treeSelectData":treeSelectData,"treeDefaultExpandedKeys":treeDefaultExpandedKeys});
    }
  }

  getOrgaTreeSelectedValues(parentIds){
    let arr = [];
    parentIds.filter((val)=>{
      if(val && this.props.organizationsFlatDataMap[val]){
        let obj = this.props.organizationsFlatDataMap[val];
        arr.push({
          label:obj.name||'',
          value:obj.id||''
        });
      }
    });
    return arr;
  }

  getOrganiTreeSelectData(objArr){
    let treeArr = [];
    let _this = this;
    $.each(objArr, (index, obj)=>{
      if(!obj.subOrganization || obj.subOrganization.length<=0){ //已经是子节点了。
        treeArr.push({
          key:obj.id,
          value:obj.id,
          label:obj.name
        });
      }else{ //表示还有孩子节点存在。
        treeArr.push({
          key:obj.id,
          value:obj.id,
          label:obj.name,
          children:this.getOrganiTreeSelectData(obj.subOrganization)
        });
      }
    });
    return treeArr;
  }
  getTreeDefaultExpandKeys(organizationsData){ //只展开第一级的组织机构。
    let arr = organizationsData.map((obj) => {
      return obj.id;
    });
    return arr;
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const treeData = this.state.treeSelectData;
    const operaName = this.props.curOrganization.id ? "修改" : "新增";
    const treeSelectProps = {
      treeData,
      value: this.state.treeSelectValue,
      onChange: this.onTreeSelectChange,
      multiple: false,
      allowClear:true,
      treeCheckStrictly:true,
      treeDefaultExpandedKeys:this.state.treeDefaultExpandedKeys,
      showCheckedStrategy: TreeSelect.SHOW_ALL,
      placeholder: '请选择...',
      style: {
        width: '100%',
      },
    };
    // <Col span={8} className='' style={{display:'none'}}>
    //   <FormItem
    //     {...formItemLayout4Organization}
    //     label="机构编码"
    //     colon
    //     hasFeedback
    //   >
    //     {getFieldDecorator('id', {
    //       initialValue:this.props.curOrganization.id||''
    //     })(
    //       <Input/>
    //     )}
    //   </FormItem>
    // </Col>
    let warningEle = this.state.showWarningStr?(
        <Alert
          message="警告"
          closable
          description={this.state.showWarningStr}
          type="warning"
          showIcon
        />
      ):null;
    let disabledDelete = (!this.props.curOrganization.id || this.props.curOrganization.subOrganizationNum)?true:false;
    return (
      <div>
        {warningEle}
        <Form onSubmit={this.onFormSubmit}>
          <Row type="flex" justify="start" align="left" className=''>
            <Col span={8} className=''>
              <FormItem
                {...formItemLayout4Organization}
                label="机构名称"
                colon
                hasFeedback
              >
                {getFieldDecorator('name', {
                  initialValue:this.props.curOrganization.name||'',
                  rules: [{
                    required: true, message: '机构名称为必填项！', whitespace: true
                  }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={8} className=''>
              <FormItem
                {...formItemLayout4Organization}
                label="父机构名称"
                colon
              >
                <TreeSelect {...treeSelectProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                wrapperCol={{ span: 24, offset: 1 }}
                >
                {this.state.hasOperaPermission?
                  (<span>
                    <button className="btn btn-primary" type="submit">{operaName}</button>
                    <button type="button" className="btn" style={{ marginLeft: 8 }} onClick={this.handleResetForm}>清空</button>
                    <Popconfirm placement="bottom" title={'确认删除吗？'}
                      onConfirm={this.handleDeleteOrganization}
                      okText="确认" cancelText="取消">
                      <button type="button" style={{ marginLeft: '8px' }}
                        className="btn btn-danger" disabled={disabledDelete}>删除</button>
                    </Popconfirm>
                  </span>):
                (<button type="button" className="btn" disabled={true}>没有权限</button>)}
            </FormItem>
            </Col>
          </Row>

        </Form>
      </div>
    )
  }
}

OrganizationAddEditComp.defaultProps = {
};

OrganizationAddEditComp.propTypes = {
  curOrganization:React.PropTypes.object,
  afterDeleteOrganiCall:React.PropTypes.func,
  handleResetFromCall:React.PropTypes.func,
  organizationsData:React.PropTypes.array,
  organizationsFlatData:React.PropTypes.array,
  organizationsFlatDataMap:React.PropTypes.object,
};

export default Form.create()(OrganizationAddEditComp);
