//添加律师档案的弹窗
import $ from 'jquery';
import React from 'react';
import moment from 'moment';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

import MyWebClient from 'client/my_web_client.jsx';
import EditableFamilyTable from './family_table.jsx';

class DocumentAddLawyerModalPC extends React.Component {
  state = {
    loading: false,
    familyData: [],
    member: {},
    visible: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }
  handleOk = () => {
    this.setState({ loading: true });
    const {memberInfo} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values['lawyerFirstPracticeTime'] =  values['lawyerFirstPracticeTime'] ? values['lawyerFirstPracticeTime'].format('YYYY-MM-DD') : '';
        values['lawyerPracticeTime'] = values['lawyerPracticeTime'] ? values['lawyerPracticeTime'].format('YYYY-MM-DD') : '';
        values['lawyerPunishTime'] = values['lawyerPunishTime'] ? values['lawyerPunishTime'].format('YYYY-MM-DD') : '';
        const info = {
          ...values,
          // id: memberInfo.id,
          familyMember: []
        }
        const {familyData} = this.state;
        const fdata = familyData.map((item) => {
          const obj = {};
          Object.keys(item).forEach((key) => {
            if (key !== 'key') {
              obj[key] = item[key].value;
            }
          });
          return obj;
        });
        info.familyMember = fdata;
        this.handleAddDocument(info);
      }
    });
  }
  getDefaultDepartment = (fileInfoSubType)=>{
    let lawyerDepartment = '';
    for(let i=0;i<this.props.departmentData.length;i++){
      let deparDt = this.props.departmentData[i];
      if(deparDt.resourceName == fileInfoSubType){
        lawyerDepartment = deparDt.sub[0].name;
      }
    }
    return lawyerDepartment;
  }
  handleAddDocument(param) {
    let _this = this;
    param.fileInfoType = this.props.currentFileType;
    param.fileInfoSubType = this.props.currentFileSubType;
    let lawyerDepartment = '';
    if(this.props.currentDepartment){
      lawyerDepartment = this.props.currentDepartment;
    }else{
      lawyerDepartment = this.getDefaultDepartment(this.props.currentFileSubType);
    }
    param.lawyerDepartment = lawyerDepartment;
    // console.log(param);
    MyWebClient.createFileInfo(param,
      (data, res) => {
        if (res && res.ok) {
          console.log(res.text);
          if (res.text === 'true') {
            _this.openNotification('success', '添加档案成功');
            _this.props.handleSearch();
          } else {
            _this.openNotification('error', '添加档案失败');
          }
          _this.setState({ loading: false});
          _this.handleCancel();
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '添加档案失败');
        console.log('get error:', res ? res.text : '');
        _this.setState({ loading: false});
        _this.handleCancel();
      }
    );
  }
  handleGetFamilyMembers(id) {
    let _this = this;
    MyWebClient.getSearchFileFamilyMember(id,
      (data, res) => {
        if (res && res.ok) {
          const data = JSON.parse(res.text);
         //  console.log(data);
          const familyData = []
          for (var i = 0; i < data.length; i++) {
            const member = data[i];
            const memberObj = {};
            memberObj.key = member.id;
            Object.keys(member).forEach((key) => {
              memberObj[key] = {
                editable: false,
                value: member[key],
              }
            });
            familyData.push(memberObj);
          }
          _this.setState({ familyData });
        }
      },
      (e, err, res) => {
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  openNotification(type, message) {
    notification.config({
      top: 68,
      duration: 3
    });
    notification[type]({
      message: message,
      // description: ''
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { memberInfo } = this.props;
    // console.log(memberInfo);
    let defaultGender = null, head_img = head_boy;
    if (memberInfo.gender == '男') {
      head_img = head_boy;
    } else if (memberInfo.gender == '女') {
      head_img = head_girl;
    }
    const { children, departmentTypes } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <span>
        <span onClick={this.showModal}>
          { children }
        </span>
      <Modal className="doc-edit-form"
        visible={this.state.visible}
        title="添加档案"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="880px"
        footer={[
          <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
            添加
          </Button>,
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
        ]}
      >
        <div className="doc-edit">
          <div className="head-img"><img src={head_img} style={{width: "108px", paddingTop: "2px"}} /></div>
          <Form className="edit-form">
            <Row>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>基本资料</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <Row className="info-body">
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="姓名">
                      {getFieldDecorator('userName', {
                        initialValue: memberInfo.userName||'',
                        rules: [{
                          required: true, message: '请输入姓名',
                        }],
                      })(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={24} id="addDepartmentSelect">
                    <FormItem {...formItemLayout} label="部门">
                      {getFieldDecorator('department', {initialValue: ''})(
                          <Select
                            mode="combobox"
                            size="default"
                            onChange={this.handleChangeDepart}
                            getPopupContainer={() => document.getElementById('addDepartmentSelect')}
                          >
                            {departmentTypes.map((item, index) => {
                              return <Option key={item}>{item}</Option>
                            })}
                          </Select>
                      )}
                    </FormItem>
                  </Col>*/}
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所名称">
                      {getFieldDecorator('lawOfficeName', {initialValue: memberInfo.lawOfficeName||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所负责人">
                      {getFieldDecorator('lawOfficePrincipal', {initialValue: memberInfo.lawOfficePrincipal||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所地址">
                      {getFieldDecorator('lawOfficeAddress', {initialValue: memberInfo.lawOfficeAddress||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender||''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="执业证号">
                      {getFieldDecorator('lawyerLicenseNo', {initialValue: memberInfo.lawyerLicenseNo||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="执业状态">
                      {getFieldDecorator('lawyerStatus', {initialValue: memberInfo.lawyerStatus||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="执业证类别">
                      {getFieldDecorator('lawyerPracticeType', {initialValue: memberInfo.lawyerPracticeType||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="资格证号">
                      {getFieldDecorator('lawyerQualificationCode', {initialValue: memberInfo.lawyerQualificationCode||''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addFirstPracticeTime">
                    <FormItem {...formItemLayout} label="首次执业时间">
                      {getFieldDecorator('lawyerFirstPracticeTime', {initialValue: memberInfo.lawyerFirstPracticeTime ? moment(memberInfo.lawyerFirstPracticeTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('addFirstPracticeTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addPracticeTime">
                    <FormItem {...formItemLayout} label="执业时间">
                      {getFieldDecorator('lawyerPracticeTime', {initialValue: memberInfo.lawyerPracticeTime ? moment(memberInfo.lawyerPracticeTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('addPracticeTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="是否受过行政处罚或行业处分">
                      {getFieldDecorator('lawyerIsPunish', {initialValue: memberInfo.lawyerIsPunish||''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addLawyerPunishTime">
                    <FormItem {...formItemLayout} label="惩罚日期">
                      {getFieldDecorator('lawyerPunishTime', {initialValue: memberInfo.lawyerPunishTime ? moment(memberInfo.lawyerPunishTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('addLawyerPunishTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="处理单位">
                      {getFieldDecorator('lawyerPunishUnit', {initialValue: memberInfo.lawyerPunishUnit||''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="惩罚结果">
                      {getFieldDecorator('lawyerPunishResult', {initialValue: memberInfo.lawyerPunishResult||''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </span>
    )
  }
  handleToggleTag(e) {
    var target = e.target;
    var checks = 5;
    var attr = target.className;
    while (checks && attr.indexOf('tag-list') == -1) {
      target = target.parentElement;
      attr = target.className;
      checks--;
    }
    if (checks) {
      $(target).toggleClass('list-closed');
      var arrow = target.querySelector('.anticon');
      if (arrow.className.indexOf('anticon-down') > -1) {
        arrow.className = 'anticon anticon-up';
      } else {
        arrow.className = 'anticon anticon-down';
      }
    }
  }
  handleChangeDepart(value) {
    // console.log(`Selected: ${value}`);
  }
}

export default Form.create()(DocumentAddLawyerModalPC);
