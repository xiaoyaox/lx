import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import superagent from 'superagent';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select, Checkbox } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

import MyWebClient from 'client/my_web_client.jsx';
import EditableFamilyTable from './family_table.jsx';

class DocumentEditLawyerModalPC extends React.Component {
  state = {
    loading: false,
    familyData: [],
    member: {}
  }
  componentWillReceiveProps(nextProps) {
    const {memberInfo} = this.props;
    if (nextProps.memberInfo.id !== memberInfo.id) {
      console.log(nextProps.memberInfo.id, nextProps.memberInfo.userName);
      this.handleGetFamilyMembers(nextProps.memberInfo.id);
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ loading: true });
    const {memberInfo} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['lawyerFirstPracticeTime'] =  values['lawyerFirstPracticeTime'] ? values['lawyerFirstPracticeTime'].format('YYYY-MM-DD') : '';
        values['lawyerPracticeTime'] = values['lawyerPracticeTime'] ? values['lawyerPracticeTime'].format('YYYY-MM-DD') : '';
        values['lawyerPunishTime'] = values['lawyerPunishTime'] ? values['lawyerPunishTime'].format('YYYY-MM-DD') : '';
        console.log('Received values of form: ', values);
        values.id = memberInfo.id;
        // console.log(values);
        const info = Object.assign({}, memberInfo, values);
        delete info['key'];
        info['familyMember']=[];
        // console.log(info);
        this.handleEditDocument(info);
      }
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.handleCancelModal();
  }
  // getFamilyMembers() {
  //   const { familyData } = this.state;
  //   const {memberInfo} = this.props;
  //   // console.log(familyData);
  //   return <EditableFamilyTable operate="edit" data={familyData} memberInfo={memberInfo} setFamilyData={this.setFamilyData.bind(this)} handleGetFamilyMembers={this.handleGetFamilyMembers.bind(this)}></EditableFamilyTable>
  // }
  // setFamilyData(familyData) {
  //   this.setState({ familyData });
  // }
  handleEditDocument(param) {
    let _this = this;
    param.fileInfoType = this.props.currentFileType;
    // param.fileInfoSubType = this.props.currentFileSubType;
    // param.department = this.props.currentDepartment;
    param.lawyerDepartment = param.lawyerDepartment ? param.lawyerDepartment : this.getDefaultDepartment(param.fileInfoSubType);
    // console.log(param);
    MyWebClient.updateFileInfo(param,
      (data, res) => {
        if (res && res.ok) {
          if (res.text === 'true') {
            _this.openNotification('success', '编辑档案成功');
            _this.props.handleSearch();
          } else {
            _this.openNotification('error', '编辑档案失败');
          }
          _this.setState({ loading: false});
          _this.handleCancel();
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '编辑档案失败');
        console.log('get error:', res ? res.text : '');
        _this.setState({ loading: false});
        _this.handleCancel();
      }
    );
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
  handleGetFamilyMembers(id) {
    let _this = this;
    MyWebClient.getSearchFileFamilyMember(id.toUpperCase(),
      (data, res) => {
        if (res && res.ok) {
          const data = JSON.parse(res.text);
         //  console.log(data);
          const familyData = data.map((item) => {
            const obj = {};
            obj.key = item.id;
            Object.keys(item).forEach((key) => {
              obj[key] = {
                editable: false,
                value: item[key]
              }
            });
            return obj;
          });
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
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 4 },
    };
    // let familyMembersTable = this.getFamilyMembers();
    const { memberInfo, departmentTypes } = this.props;
    // console.log(memberInfo);
    let defaultGender = null, head_img = null;
    if (memberInfo.gender == '男') {
      head_img = head_boy;
    } else if (memberInfo.gender == '女') {
      head_img = head_girl;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal className="doc-edit-form"
        visible={this.props.visible}
        title="编辑档案"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="880px"
        footer={[
          <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
            修改
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
                  <FormItem label="id" style={{display: "none"}}>
                    {getFieldDecorator('id', {initialValue: memberInfo.id || ''})(
                      <Input type="text" placeholder="" />
                    )}
                  </FormItem>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="姓名">
                      {getFieldDecorator('userName', {
                        initialValue: memberInfo.userName || '',
                        rules: [{
                          required: true, message: '请输入姓名',
                        }],
                      })(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所名称">
                      {getFieldDecorator('lawOfficeName', {initialValue: memberInfo.lawOfficeName || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所负责人">
                      {getFieldDecorator('lawOfficePrincipal', {initialValue: memberInfo.lawOfficePrincipal || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="律所地址">
                      {getFieldDecorator('lawOfficeAddress', {initialValue: memberInfo.lawOfficeAddress || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender || ''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={24} id="editDepartmentSelect">
                    <FormItem {...formItemLayout} label="部门">
                      {getFieldDecorator('department', {initialValue: memberInfo.department || ''})(
                        <Select
                          mode="combobox"
                          size="default"
                          onChange={this.handleChangeDepart}
                          getPopupContainer={() => document.getElementById('editDepartmentSelect')}
                        >
                          {departmentTypes ? departmentTypes.map((item, index) => {
                            return <Option key={item}>{item}</Option>
                          }) : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>*/}
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
                      {getFieldDecorator('lawyerFirstPracticeTime',
                        {
                          initialValue: (memberInfo.lawyerFirstPracticeTime && memberInfo.lawyerFirstPracticeTime!='null') ? moment(memberInfo.lawyerFirstPracticeTime, 'YYYY-MM-DD') : null
                        })(
                        <DatePicker getCalendarContainer={() => document.getElementById('addFirstPracticeTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addLawyerPracticeTime">
                    <FormItem {...formItemLayout} label="执业时间">
                      {getFieldDecorator('lawyerPracticeTime',
                        {
                          initialValue: (memberInfo.lawyerPracticeTime && memberInfo.lawyerPracticeTime!='null') ? moment(memberInfo.lawyerPracticeTime, 'YYYY-MM-DD') : null
                        })(
                        <DatePicker getCalendarContainer={() => document.getElementById('addLawyerPracticeTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="是否受过行政处罚或行业处分">
                      {getFieldDecorator('lawyerIsPunish', {initialValue: memberInfo.lawyerIsPunish || ''})(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="addLawyerPunishTime">
                    <FormItem {...formItemLayout} label="惩罚日期">
                      {getFieldDecorator('lawyerPunishTime',
                        {
                          initialValue: (memberInfo.lawyerPunishTime && memberInfo.lawyerPunishTime!='null')  ? moment(memberInfo.lawyerPunishTime, 'YYYY-MM-DD') : null
                        })(
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

export default Form.create()(DocumentEditLawyerModalPC);
