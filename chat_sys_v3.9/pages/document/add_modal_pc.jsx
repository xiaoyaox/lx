//添加其他人事档案的弹窗
import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import superagent from 'superagent';

import { Row, Col, Form, Icon, Input, Button, Radio, Table, Modal, DatePicker, notification, Select } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

import head_boy from 'images/head_boy.png';
import head_girl from 'images/head_girl.png';

import MyWebClient from 'client/my_web_client.jsx';
import EditableFamilyTable from './family_table.jsx';

class DocumentAddModalPC extends React.Component {
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
        // console.log(values);
        Object.keys(values).forEach((key) => {
          if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
            || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
            values[key] = values[key] ? moment(values[key]).format('YYYY-MM-DD') : '';
          }
        });
        const info = {
          ...values,
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
        // console.log(fdata);
        info.familyMember = fdata;
        // console.log(info);
        this.handleAddDocument(info);
      }
    });
  }
  getFamilyMembers() {
    const { familyData } = this.state;
    // console.log(familyData);
    return <EditableFamilyTable operate="add" data={familyData} setFamilyData={this.setFamilyData.bind(this)}></EditableFamilyTable>
  }
  setFamilyData(familyData) {
    this.setState({ familyData });
    // console.log(familyData);
  }
  getDefaultDepartment = (fileInfoSubType)=>{
    let department = '';
    for(let i=0;i<this.props.departmentData.length;i++){
      let deparDt = this.props.departmentData[i];
      if(deparDt.resourceName == fileInfoSubType){
        department = deparDt.sub[0].name;
      }
    }
    return department;
  }
  handleAddDocument(param) {
    let _this = this;
    param.fileInfoType = this.props.currentFileType;
    param.fileInfoSubType = this.props.currentFileSubType;
    let department = '';
    if(this.props.currentDepartment){
      department = this.props.currentDepartment;
    }else{
      department = this.getDefaultDepartment(this.props.currentFileSubType);
    }
    param.department = department;
    // console.log(param);
    MyWebClient.createFileInfo(param,
      (data, res) => {
        if (res && res.ok) {
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
    let familyMembersTable = this.getFamilyMembers();
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
                        initialValue: '',
                        rules: [{
                          required: true, message: '请输入姓名',
                        }],
                      })(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: ''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col span={24}>
                    <FormItem {...formItemLayout} label="身份证号码">
                      <Input type="text" placeholder="" defaultValue={memberInfo.IDCard} />
                    </FormItem>
                  </Col>*/}
                  <Col span={24} id="addBirthDay">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay', {initialValue: memberInfo.birthDay ? moment(memberInfo.birthDay, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('addBirthDay')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="民族">
                      {getFieldDecorator('famousFamily', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="籍贯">
                      {getFieldDecorator('nativePlace', {initialValue: ''})(
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
                    <FormItem {...formItemLayout} label="出生地">
                      {getFieldDecorator('createParty', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="健康状况">
                      {getFieldDecorator('healthStatus', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} id="addJoinPartyTime">
                    <FormItem {...formItemLayout1} label="入党时间">
                      {getFieldDecorator('joinPartyTime', {initialValue: memberInfo.joinPartyTime ? moment(memberInfo.joinPartyTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('addJoinPartyTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} id="addJoinWorkerTime">
                    <FormItem {...formItemLayout1} label="参加工作时间">
                      {getFieldDecorator('joinWorkerTime', {initialValue: memberInfo.joinWorkerTime ? moment(memberInfo.joinWorkerTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('addJoinWorkerTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="专业技术职务">
                      {getFieldDecorator('specializedJob', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="熟悉专业有何专长">
                      {getFieldDecorator('expertise', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="现任职务">
                      {getFieldDecorator('currentPosition', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="拟任职务">
                      {getFieldDecorator('proposedOffice', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="拟免职务">
                      {getFieldDecorator('jobTitle', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>学历学位</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <Row className="info-body">
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="全日制教育">
                      {getFieldDecorator('fullTimeEducation', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="毕业院校系及专业">
                      {getFieldDecorator('graduatesAddress', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="在职教育">
                      {getFieldDecorator('inServiceEducation', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="毕业院校系及专业">
                      {getFieldDecorator('inServiceAddress', {initialValue: ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>简历</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="">
                    {getFieldDecorator('resume', {initialValue: ''})(
                      <Input type="textarea" placeholder="简历" rows={4} />
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>家庭主要成员及重要社会关系</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  {familyMembersTable}
                </div>
              </Col>
              <Col span={24} className="tag-list">
                <p className="info-title">
                  <label>其他信息</label>
                  <a href="javascript:;" className="pull-right p-r-10" onClick={this.handleToggleTag}><Icon type="up" /></a>
                </p>
                <div className="info-body">
                  <FormItem label="奖惩情况">
                    {getFieldDecorator('certificateOfMerit', {initialValue: ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </FormItem>
                  <FormItem label="年度考核结果">
                    {getFieldDecorator('annualAssessment', {initialValue: ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </FormItem>
                  <FormItem label="任免理由">
                    {getFieldDecorator('reasonsForDismissal', {initialValue: ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </FormItem>
                  <div className="form-item" id="addReportingUnit">
                    <div className="item-label"><label>呈报单位:</label></div>
                    {getFieldDecorator('reportingTime', {initialValue: null})(
                      <DatePicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('addReportingUnit')} />
                    )}
                    {getFieldDecorator('reportingUnit', {initialValue: ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </div>
                  <div className="form-item" id="addApprovalOpinion">
                    <div className="item-label"><label>审批机关意见:</label></div>
                    {getFieldDecorator('approvalTime', {initialValue: null})(
                      <DatePicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('addApprovalOpinion')} />
                    )}
                    {getFieldDecorator('approvalOpinion', {initialValue: ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </div>
                  <div className="form-item" id="addApprovalRemovalOpinion">
                    <div className="item-label"><label>行政机关任免意见:</label></div>
                    {getFieldDecorator('appointAndRemoveTime', {initialValue: null})(
                      <DatePicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('addApprovalRemovalOpinion')} />
                    )}
                    {getFieldDecorator('appointAndRemoveOpinion', {initialValue: ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </div>
                </div>
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

export default Form.create()(DocumentAddModalPC);
