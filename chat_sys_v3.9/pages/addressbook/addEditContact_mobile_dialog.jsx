import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import * as Utils from 'utils/utils.jsx';

import { Row, Col, Form, Icon, Input,notification, TreeSelect, message } from 'antd';
import {Modal,Button,Popup} from 'antd-mobile';
const FormItem = Form.Item;

message.config({
  top: 75,
  duration: 2,
});
notification.config({
  top: 68,
  duration: 3
});
const initContactInfo = {
  id:"",
  userName:'',
  groupShortCode:'',
  email:'',
  organization:'',
  telephoneNumber:''
}
const donNeedParams = ['key'];

class AddEditContactMobileDialog extends React.Component {
  constructor(props) {
      super(props);
      this.showModal = this.showModal.bind(this);
      this.closeDialog = this.closeDialog.bind(this);
      this.handleAddOrEdit = this.handleAddOrEdit.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.onTreeSelectChange = this.onTreeSelectChange.bind(this);
      this.state = {
        loading: false,
        treeSelectData:[],
        treeSelectValue:[],
        confirmDirty:false,
        contactInfo:{},
        isAdd:false, //判断是否是新增弹窗
        visible: false
      };
  }

  componentWillMount(){
    // let treeSelectData = this.getOrganiTreeSelectData(this.props.organizationsData);
    // this.setState({"treeSelectData":treeSelectData});
  }
  getOrganiTreeSelectData(objArr){
    let treeArr = [];
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
  showModal = () => {
    this.setState({visible: true});
  }
  closeDialog = ()=>{
    this.setState({ loading: false});
    this.props.closeAddEditDialog();
  }
  handleAddOrEdit = (data) => {
    console.log("handleAddOrEdit:",data);
    this.setState({ loading: true });
    let form = this.props.form;
    this.props.form.validateFields((err, values) => {
        this.setState({ loading: false});
        if (!err) {
          this.realSubmit();
        }
    });
  }
  realSubmit(){
    let submitInfo = this.props.form.getFieldsValue();
    console.log("新增or修改联系人信息的submitInfo参数--：",submitInfo);
    let params = Object.assign({},initContactInfo,this.state.contactInfo,submitInfo);
    params = this.parseSendServerParams(params);

    let actionName = this.state.isAdd ? "add" : "update"; //获取接口名字
    let desc = this.props.contactInfo.id ? "修改" : "新增"; //
    myWebClient.addOrEditContacts(actionName,params,
      (data,res)=>{
        this.props.afterAddEditContactsCall();
        this.closeDialog();
        notification.success({message: desc+'联系人成功！'});
        console.log("addNewContacts success: ",data,res);
      },(e,err,res)=>{
        this.closeDialog();
        notification.error({message: desc+'联系人失败！'});
        console.log("addNewContacts error: ",err);
      });
  }

  parseSendServerParams(params){
    let {contactInfo} = this.state;
    donNeedParams.map((val)=>{
      delete params[val];
      return '';
    });
    let organiSelectValues= this.state.treeSelectValue.map((item) => {
      return item.value;
    });
    params['organization'] = organiSelectValues.join(',');
    console.log("新增or修改用户信息的参数--：",params);
    return params;
  }

  handleCancel = () => {
    this.setState({ visible: false,loading:false });
    this.props.closeAddEditDialog();
  }

  onTreeSelectChange(value){
    // console.log("tree select value:",value);
    this.setState({treeSelectValue:value});
  }

  componentWillReceiveProps(nextProps){
    // console.log("componentWillReceiveProps--:",nextProps);

    if(nextProps.visible && nextProps.contactInfo.id != this.props.contactInfo.id){
      let organization = nextProps.contactInfo.organization || '';
      let treeSelectValue = this.getOrgaTreeSelectedValues(organization.split(','));
      this.setState({treeSelectValue:treeSelectValue});
    }
    if(nextProps.visible && nextProps.contactInfo){
      let isAdd = !!nextProps.contactInfo.id ? false : true;
      this.setState({contactInfo:nextProps.contactInfo,isAdd:isAdd});
    }
    if(this.props.organizationsFlatData.length != nextProps.organizationsFlatData.length){
      let treeSelectData = this.getOrganiTreeSelectData(nextProps.organizationsData);
      this.setState({"treeSelectData":treeSelectData});
    }

    if(!nextProps.visible){
      this.props.form.resetFields();
      this.setState({contactInfo:{},treeSelectValue:[]});
    }
  }

  getOrgaTreeSelectedValues(organizations){
    let arr = [];
    organizations.filter((val)=>{
      if(val){
        let obj = this.props.organizationsFlatDataMap[val];
        arr.push({
          label:obj.name||'',
          value:obj.id||''
        });
      }
    });
    return arr;
  }
  handleConfirmAction = (data)=>{
    console.log("handleConfirmAction",data);
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 7 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 17 },
        sm: { span: 17 },
      },
    };
    const { contactInfo } = this.state;
    const treeData = this.state.treeSelectData;
    const treeSelectProps = {
      treeData,
      value: this.state.treeSelectValue,
      onChange: this.onTreeSelectChange,
      multiple: true,
      allowClear:true,
      treeCheckable: true,
      treeCheckStrictly:true,
      showCheckedStrategy: TreeSelect.SHOW_ALL,
      searchPlaceholder: '请选择...',
      style: {
        width: '100%',
      },
    };
    return (<div>
      <Modal className={this.props.visible?"contact-edit-mobile":""}
        visible={this.props.visible}
        title={this.state.isAdd?'新增联系人':'编辑联系人'}
        onClose={this.handleCancel}
        width="96%"
        height="auto"
        maskClosable={true}
        footer={[
          { text: '取消', onPress: () => { this.handleCancel(); } },
          { text: '保存', onPress: () => { this.handleAddOrEdit(); } }
        ]}
      >
        <div className="" style={{padding:'1em 0'}}>
          <Form  className="" style={{margin:0}}>
              <FormItem
                {...formItemLayout}
                label="用户名:"
                colon
                hasFeedback
              >
                {getFieldDecorator('userName', {
                  initialValue:contactInfo.userName,
                  rules: [{
                    required: true, message: '用户名为必填项！', whitespace: true
                  }],
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="公司电话短号:">
                {getFieldDecorator('groupShortCode', {
                  initialValue:contactInfo.groupShortCode,
                  rules: [{
                    required: true, message: '公司电话短号为必填项！', whitespace: true
                  }],
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="邮箱:">
                {getFieldDecorator('email', {
                  initialValue:contactInfo.email,
                  rules: [{
                    type: 'email', message: '你填写的不是正确的邮箱格式！!',
                  }, {
                    required: true, message: '请填写邮箱!', whitespace: true
                  }],
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="组织机构:">
                <TreeSelect {...treeSelectProps} />
              </FormItem>
              <FormItem {...formItemLayout} label="电话:">
                {getFieldDecorator('telephoneNumber', {
                  initialValue:contactInfo.telephoneNumber,
                })(
                  <Input/>
                )}
              </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
    )
  }
}

AddEditContactMobileDialog.defaultProps = {
};

AddEditContactMobileDialog.propTypes = {
  visible:React.PropTypes.bool,
  contactInfo:React.PropTypes.object,
  organizationsData:React.PropTypes.array,
  organizationsFlatData:React.PropTypes.array,
  organizationsFlatDataMap:React.PropTypes.object,
  closeAddEditDialog:React.PropTypes.func,
  afterAddEditContactsCall:React.PropTypes.func
};

export default Form.create()(AddEditContactMobileDialog);
