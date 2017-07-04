import $ from 'jquery';
import React from 'react';
import OrganizationStore from 'pages/stores/organization_store.jsx';
import myWebClient from 'client/my_web_client.jsx';
import * as Utils from 'utils/utils.jsx';
import * as organizationUtils from '../utils/organization_utils.jsx';

import { Row, Col, Form, Icon, Input, Button as ButtonPc ,notification,
  TreeSelect, Modal,message,Switch,Radio } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

message.config({
  top: 75,
  duration: 2,
});
notification.config({
  top: 68,
  duration: 3
});
const initUserInfo = {
  id:"",
  allow_marketing:false,
  auth_service:"",
  create_at:0,
  delete_at:0,
  email:"",
  email_verified:false,
  failed_attempts:0,
  first_name:"",
  last_activity_at:0,
  last_name:"",
  last_password_update:0,
  last_picture_update:0,
  locale:"zh-CN",
  mfa_active:false,
  mfa_secret:"",
  nickname:"",
  notify_props:{channel:"true",desktop:"all",desktop_sound:"true",email:"true",first_name:"false",mention_keys:"","push":"mention"},
  organizations:"",
  password:"",
  phone:"",
  position:"",
  restrictedUsernames:["all", "channel", "matterbot"],
  roles:"system_user",
  update_at:0,
  username:"",
  oaUserName:"",
  oaPassword:"",
  redressUserName:"",
  redressPassword:"",
  validUsernameChars:"^[a-z0-9\.\-_]+$",
  passwordChange:false,
  effective:true
}
const donNeedParams = ['key','confirmPassword'];
class AddEditSysConfigDialog extends React.Component {
  constructor(props) {
      super(props);
      this.showModal = this.showModal.bind(this);
      this.closeDialog = this.closeDialog.bind(this);
      this.handleAddOrEdit = this.handleAddOrEdit.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.onTreeSelectChange = this.onTreeSelectChange.bind(this);
      this.checkPasswordConfirm = this.checkPasswordConfirm.bind(this);
      this.handlePasswordConfirmBlur = this.handlePasswordConfirmBlur.bind(this);
      this.updateOrganizationData = this.updateOrganizationData.bind(this);
      this.state = {
        loading: false,
        treeSelectData:[],
        treeSelectValue:[],
        organizationsData:[],
        organizationsFlatData:[],
        organizationsFlatDataMap:{},
        confirmDirty:false,
        menberInfo:{},
        isAdd:false, //判断是否是新增弹窗
        visible: false,
        organizaionValidate:{}, //组织机构的验证提示对象。
      };
  }
  componentWillMount(){
    this.updateOrganizationData();
    OrganizationStore.addOrgaChangeListener(this.updateOrganizationData);
  }
  componentWillUnmount(){
    OrganizationStore.removeOrgaChangeListener(this.updateOrganizationData);
  }

  updateOrganizationData(){
    let treeSelectData = this.getOrganiTreeSelectData(OrganizationStore.getOrgaData()||[]);
    this.setState({
      "organizationsData":OrganizationStore.getOrgaData()||[],
      "organizationsFlatData":OrganizationStore.getOrgaFlatData()||[],
      "organizationsFlatDataMap":OrganizationStore.getOrgaFlatMap()||{},
      "treeSelectData":treeSelectData,
    });
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

  showModal = () => {
    this.setState({visible: true});
  }
  closeDialog = ()=>{
    this.setState({ loading: false});
    this.props.closeDialogCall();
  }
  handleAddOrEdit = () => {
    this.setState({ loading: true });
    let form = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
        this.setState({ loading: false});
        if (!err) {
          this.realSubmit();
        }
    });
  }
  realSubmit(){
    let submitInfo = this.props.form.getFieldsValue();
    console.log("新增or修改用户信息的submitInfo参数--：",submitInfo);
    submitInfo.organizations = this.getOrganizationsStr();
    let params = Object.assign({},initUserInfo,this.state.menberInfo,submitInfo);
    params = this.parseSendServerParams(params);
    if(!params.organizations){ //验证组织结构是否已经填写。
      this.setState({
        organizaionValidate:{
          label:"Fail",
          validateStatus:"error",
          help:"组织机构是必填项，不能为空！"
        }
      });
      setTimeout(()=>{ this.setState({ organizaionValidate:{} }); }, 2500);
      return;
    }else{
      this.setState({ organizaionValidate:{} });
    }

    let actionName = this.props.menberInfo.id ? "update" : "create"; //获取接口名字
    let desc = this.props.menberInfo.id ? "修改" : "新增"; //
    myWebClient.addOrEditUser(actionName,params,
      (data,res)=>{
        this.handleAfterAddEditSucc();
        // message.success(desc+'用户成功！');
        // this.openNotification('success',desc+'用户成功！');
        notification.success({message: desc+'用户成功！'});
        // console.log("addNewUser success: ",data,res);
      },(e,err,res)=>{
        this.setState({ confirmDirty: false });
        this.closeDialog();
        notification.error({message: desc+'用户失败！'});
        console.log("addNewUser e: ",e);
        console.log("addNewUser res: ",res);
      });
  }

  parseSendServerParams(params){
    let {menberInfo} = this.state;
    if(menberInfo.password && menberInfo.password!=params.password){
      params.passwordChange = true;
    }
    donNeedParams.map((val)=>{
      delete params[val];
      return '';
    });
    let organiSelectValues= this.state.treeSelectValue.map((item) => {
      return item.value;
    });
    params.organizations = organiSelectValues.join(',');
    console.log("新增or修改用户信息的参数--：",params);
    return params;
  }
  handleAfterAddEditSucc = ()=>{
    this.setState({ confirmDirty: false });
    this.props.afterAddEditUserCall();
    this.closeDialog();
  }

  getOrganizationsStr(){ //得到选择的组织机构的id字符串。多个id以逗号隔开。
    let organizationsArr = this.state.treeSelectValue.map((item)=>{
      return item.id;
    });
    return organizationsArr.join(',');
  }

  handleCancel = () => {
    this.setState({ visible: false,loading:false });
    this.props.closeDialogCall();
  }

  onTreeSelectChange(value){
    // console.log("tree select value:",value);
    this.setState({treeSelectValue:value});
  }

  componentWillReceiveProps(nextProps){
    // console.log("componentWillReceiveProps--:",nextProps);

    // && nextProps.menberInfo.organizations && this.props.menberInfo.organizations
    // && (nextProps.menberInfo.organizations.length!=this.props.menberInfo.organizations.length
    if(nextProps.visible && nextProps.visible != this.props.visible){
      let organizations = nextProps.menberInfo.organizations;
      let treeSelectValue = this.getOrgaTreeSelectedValues(organizations.split(','));
      this.setState({treeSelectValue:treeSelectValue});
    }
    if(nextProps.visible && nextProps.menberInfo){
      let isAdd = !!nextProps.menberInfo.id ? false : true;
      this.setState({menberInfo:nextProps.menberInfo,isAdd:isAdd});
    }
    if(!nextProps.visible){
      this.props.form.resetFields();
      this.setState({menberInfo:{},treeSelectValue:[]});
    }
  }

  getOrgaTreeSelectedValues(organizations){
    let arr = [];
    organizations.filter((val)=>{
      if(val && this.state.organizationsFlatDataMap[val]){
        let obj = this.state.organizationsFlatDataMap[val]||{};
        if(!obj.id){ return false; }
        arr.push({
          label:obj.name||'',
          value:obj.id||''
        });
      }
    });
    return arr;
  }
  checkUserNameExist = (rule, value, callback)=>{ //检查用户名是否存在。
    if(!this.state.isAdd && value == this.state.menberInfo.username){
      callback();
      return;
    }
    myWebClient.getSearchUsersData({filter:value},(data,res)=>{
      let objArr = JSON.parse(res.text);
      if(objArr && objArr.length>0){
        let existUser = objArr.filter((userDt)=>{
          if(value == userDt.username){
            return true;
          }
        });
        (existUser && existUser.length>0) ? callback("改用户名已经存在，请换一个试试！") : callback();
      }else{
        callback();
      }
    },(e,err,res)=>{
      callback();
    });
  }

  checkPasswordConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }
  handlePasswordConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPasswordLength = (rule, value, callback)=>{ //检查密码的长度
    const form = this.props.form;
    if (value && form.getFieldValue('password').length<=5) {
      callback('密码长度必须大于5!');
    } else {
      callback();
    }
  }
  checkSysPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('你输入的两个密码不一样!');
    } else {
      callback();
    }
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { menberInfo } = this.state;
    let canEditUserName = (menberInfo.username == 'admin'||menberInfo.username=="administrator")?false:true;
    let disableOrganization = !canEditUserName;
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
      disabled:disableOrganization,
      searchPlaceholder: '请选择...',
      style: {
        width: '100%',
      },
    };
    return (
      <div>
      <Modal className="sys-edit-form"
        visible={this.props.visible}
        title={this.state.isAdd?'新增用户':'编辑用户'}
        onOk={this.handleAddOrEdit}
        onCancel={this.handleCancel}
        width="700px"
        maskClosable={false}
        footer={[
          <ButtonPc key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleAddOrEdit}>
            保存
          </ButtonPc>,
          <ButtonPc key="back" size="large" onClick={this.handleCancel}>取消</ButtonPc>,
        ]}
      >
        <div className="doc-edit">
          <Form  className="edit-form" style={{margin:0}}>
            <Row>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="用户名"
                  colon
                  hasFeedback
                >
                  {getFieldDecorator('username', {
                    initialValue:menberInfo.username,
                    validateTrigger:'onBlur',
                    rules: [{
                      required: true, message: '用户名为必填项！', whitespace: true
                    },{
                      validator: this.checkUserNameExist,
                    }],
                  })(
                    <Input disabled={!canEditUserName}/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('nickname', {
                    initialValue:menberInfo.nickname,
                    rules: [{
                      required: true, message: '姓名为必填项！', whitespace: true
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>

              {this.state.isAdd?(<Col span={24}>
                <FormItem {...formItemLayout} label="密码" hasFeedback>
                  {getFieldDecorator('password', {
                    initialValue:menberInfo.password,
                    rules: [{
                      required: true, message: '密码为必填项！', whitespace: true
                    }, {
                      validator: this.checkPasswordConfirm,
                    }, {
                      validator: this.checkPasswordLength,
                    }],
                  })(
                    <Input type="password"/>
                  )}
                </FormItem>
              </Col>):null}

              {this.state.isAdd?(<Col span={24}>
                <FormItem {...formItemLayout} label="确认密码" hasFeedback>
                  {getFieldDecorator('confirmPassword', {
                    initialValue:menberInfo.password,
                    rules: [{
                      required: true, message: '请填写确认密码!', whitespace: true
                    }, {
                    validator: this.checkSysPassword,
                  }],
                  })(
                    <Input type="password" onBlur={this.handlePasswordConfirmBlur} />
                  )}
                </FormItem>
              </Col>):null}

              <Col span={24}>
                <FormItem {...formItemLayout} label="邮箱">
                  {getFieldDecorator('email', {
                    initialValue:menberInfo.email,
                    rules: [{
                      type: 'email', message: '你填写的不是正确的邮箱格式！!',
                    }, {
                      required: true, message: '请填写邮箱!', whitespace: true
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="OA系统用户名">
                  {getFieldDecorator('oaUserName', {
                    initialValue:menberInfo.oaUserName,
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="OA系统密码">
                  {getFieldDecorator('oaPassword', {
                    initialValue:menberInfo.oaPassword,
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="矫正系统用户名">
                  {getFieldDecorator('redressUserName', {
                    initialValue:menberInfo.redressUserName,
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="矫正系统密码">
                  {getFieldDecorator('redressPassword', {
                    initialValue:menberInfo.redressPassword,
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="组织机构"
                  colon hasFeedback
                  className={'organization_form_item'}
                  {...this.state.organizaionValidate} >
                  <TreeSelect {...treeSelectProps} />
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    initialValue:menberInfo.phone,
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="用户是否有效"
                >
                  {getFieldDecorator('effective', {
                    initialValue:menberInfo.effective,
                    valuePropName: 'checked'
                  })(
                    <Switch />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      </div>
    )
  }
}

AddEditSysConfigDialog.defaultProps = {
};

AddEditSysConfigDialog.propTypes = {
  visible:React.PropTypes.bool,
  menberInfo:React.PropTypes.object,
  closeDialogCall:React.PropTypes.func,
  afterAddEditUserCall:React.PropTypes.func
};

export default Form.create()(AddEditSysConfigDialog);
