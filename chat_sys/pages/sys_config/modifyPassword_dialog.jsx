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

const donNeedParams = ['key','confirmPassword'];
class ModifyUserPasswordDialog extends React.Component {
  constructor(props) {
      super(props);
      this.closeDialog = this.closeDialog.bind(this);
      this.handleModifyPassword = this.handleModifyPassword.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.checkPasswordConfirm = this.checkPasswordConfirm.bind(this);
      this.handlePasswordConfirmBlur = this.handlePasswordConfirmBlur.bind(this);
      this.state = {
        loading: false,
        confirmDirty:false,
        menberInfo:{},
        visible: false
      };
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }

  closeDialog = ()=>{
    this.setState({ loading: false});
    this.props.closeDialogCall();
  }
  handleModifyPassword = () => {
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
    let params = Object.assign({},submitInfo);
    params = this.parseSendServerParams(params);
    myWebClient.modifyUserPassword(params,
      (data,res)=>{
        this.handleAfterModifySucc();
        notification.success({message:'修改密码成功！'});
      },(e,err,res)=>{
        this.setState({ confirmDirty: false });
        this.closeDialog();
        notification.error({message:'修改密码失败！'});
      });
  }
  parseSendServerParams(params){
    let {menberInfo} = this.state;
    params.userid = menberInfo.id;
    donNeedParams.map((val)=>{
      delete params[val];
      return '';
    });
    console.log("新增or修改 密码的参数--：",params);
    return params;
  }

  handleAfterModifySucc = ()=>{
    this.setState({ confirmDirty: false });
    this.props.afterModifyPasswordCall();
    this.closeDialog();
  }

  handleCancel = () => {
    this.setState({ visible: false,loading:false });
    this.props.closeDialogCall();
  }


  componentWillReceiveProps(nextProps){
     console.log("componentWillReceiveProps--:",nextProps);

    if(nextProps.visible && nextProps.menberInfo){
      this.setState({menberInfo:nextProps.menberInfo});
    }
    if(!nextProps.visible){
      this.props.form.resetFields();
      this.setState({ menberInfo:{} });
    }
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
    return (
      <div>
      <Modal className=""
        visible={this.props.visible}
        title='修改密码'
        onOk={this.handleModifyPassword}
        onCancel={this.handleCancel}
        width="700px"
        maskClosable={false}
        footer={[
          <ButtonPc key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleModifyPassword}>
            保存
          </ButtonPc>,
          <ButtonPc key="back" size="large" onClick={this.handleCancel}>取消</ButtonPc>,
        ]}
      >
        <div className="">
          <Form  className="" style={{margin:0}}>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="新密码" hasFeedback>
                  {getFieldDecorator('password', {
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
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="确认密码" hasFeedback>
                  {getFieldDecorator('confirmPassword', {
                    rules: [{
                      required: true, message: '请填写确认密码!', whitespace: true
                    }, {
                    validator: this.checkSysPassword,
                  }],
                  })(
                    <Input type="password" onBlur={this.handlePasswordConfirmBlur} />
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

ModifyUserPasswordDialog.defaultProps = {
};

ModifyUserPasswordDialog.propTypes = {
  visible:React.PropTypes.bool,
  menberInfo:React.PropTypes.object,
  closeDialogCall:React.PropTypes.func,
  afterModifyPasswordCall:React.PropTypes.func
};

export default Form.create()(ModifyUserPasswordDialog);
