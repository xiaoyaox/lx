import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
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

class DocumentEditModalPC extends React.Component {
  state = {
    loading: false,
    familyData: [],
    member: {},
    isMobile: Utils.isMobile()
  }
  componentWillReceiveProps(nextProps) {
    const {memberInfo} = this.props;
    if (nextProps.memberInfo.id !== memberInfo.id) {
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
    // console.log('memberInfo', memberInfo);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = memberInfo.id;
        Object.keys(values).forEach((key) => {
          if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
            || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
            values[key] = values[key] ? moment(values[key]).format('YYYY-MM-DD') : '';
          }
        });
        // console.log(values);
        this.handleEditDocument({
          ...values
        });
      }
    });
  }
  handleCancel = () => {
    // this.setState({ visible: false });
    this.props.form.resetFields();
    this.props.handleCancelModal();
  }
  getFamilyMembers() {
    const { familyData } = this.state;
    const {memberInfo} = this.props;
    // console.log(familyData);
    return <EditableFamilyTable operate="edit" data={familyData} memberInfo={memberInfo} setFamilyData={this.setFamilyData.bind(this)} handleGetFamilyMembers={this.handleGetFamilyMembers.bind(this)}></EditableFamilyTable>
  }
  setFamilyData(familyData) {
    this.setState({ familyData });
  }
  handleEditDocument(param) {
    let _this = this;
    let {memberInfo} = this.props;
    param.fileInfoType = memberInfo.fileInfoType;
    param.fileInfoSubType = memberInfo.fileInfoSubType;
    param.department = memberInfo.department;
    param.department = param.department ? param.department : this.getDefaultDepartment(param.fileInfoSubType);
    // console.log("编辑档案--param:",param);
    delete param['key']; delete param['familyMember'];
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
        // console.log('get error:', res ? res.text : '');
        _this.setState({ loading: false});
        _this.handleCancel();
      }
    );
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
    let familyMembersTable = this.getFamilyMembers();
    const { memberInfo, departmentTypes } = this.props;
    // console.log(memberInfo);
    let defaultGender = null, head_img = null;
    if (memberInfo.gender == '男') {
      head_img = head_boy;
    } else if (memberInfo.gender == '女') {
      head_img = head_girl;
    }
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    let clsname = this.state.isMobile ? "doc-edit-form doc-edit-form-mobile" :"doc-edit-form doc-edit-form-pc";
    return (
      <Modal className={clsname}
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
          {this.state.isMobile?null:(<div className="head-img"><img src={head_img} style={{width: "108px", paddingTop: "2px"}} /></div>)}
          <Form className={this.state.isMobile?"":"edit-form"}>
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
                    <FormItem {...formItemLayout} label="性别">
                      {getFieldDecorator('gender', {initialValue: memberInfo.gender || ''})(
                        <RadioGroup>
                          <RadioButton value="男">男</RadioButton>
                          <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} id="editBirthDay">
                    <FormItem {...formItemLayout} label="出生年月">
                      {getFieldDecorator('birthDay', {initialValue: memberInfo.birthDay ? moment(memberInfo.birthDay, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('editBirthDay')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="民族">
                      {getFieldDecorator('famousFamily', {initialValue: memberInfo.famousFamily || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="籍贯">
                      {getFieldDecorator('nativePlace', {initialValue: memberInfo.nativePlace || ''})(
                        <Input type="text" placeholder="" />
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
                          {departmentTypes.map((item, index) => {
                            return <Option key={item}>{item}</Option>
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>*/}
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="出生地">
                      {getFieldDecorator('createParty', {initialValue: memberInfo.createParty || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="健康状况">
                      {getFieldDecorator('healthStatus', {initialValue: memberInfo.healthStatus || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} id="editJoinPartyTime">
                    <FormItem {...formItemLayout1} label="入党时间">
                      {getFieldDecorator('joinPartyTime', {initialValue: memberInfo.joinPartyTime ? moment(memberInfo.joinPartyTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('editJoinPartyTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}  id="editJoinWorkerTime">
                    <FormItem {...formItemLayout1} label="参加工作时间">
                      {getFieldDecorator('joinWorkerTime', {initialValue: memberInfo.joinWorkerTime ? moment(memberInfo.joinWorkerTime, 'YYYY-MM-DD') : null})(
                        <DatePicker getCalendarContainer={() => document.getElementById('editJoinWorkerTime')} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="专业技术职务">
                      {getFieldDecorator('specializedJob', {initialValue: memberInfo.specializedJob || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="熟悉专业有何专长">
                      {getFieldDecorator('expertise', {initialValue: memberInfo.expertise || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="现任职务">
                      {getFieldDecorator('currentPosition', {initialValue: memberInfo.currentPosition || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="拟任职务">
                      {getFieldDecorator('proposedOffice', {initialValue: memberInfo.proposedOffice || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="拟免职务">
                      {getFieldDecorator('jobTitle', {initialValue: memberInfo.jobTitle || ''})(
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
                      {getFieldDecorator('fullTimeEducation', {initialValue: memberInfo.fullTimeEducation || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="毕业院校系及专业">
                      {getFieldDecorator('graduatesAddress', {initialValue: memberInfo.graduatesAddress || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="在职教育">
                      {getFieldDecorator('inServiceEducation', {initialValue: memberInfo.inServiceEducation || ''})(
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout1} label="毕业院校系及专业">
                      {getFieldDecorator('inServiceAddress', {initialValue: memberInfo.inServiceAddress || ''})(
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
                    {getFieldDecorator('resume', {initialValue: memberInfo.resume || ''})(
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
                    {getFieldDecorator('certificateOfMerit', {initialValue: memberInfo.certificateOfMerit || ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </FormItem>
                  <FormItem label="年度考核结果">
                    {getFieldDecorator('annualAssessment', {initialValue: memberInfo.annualAssessment || ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </FormItem>
                  <FormItem label="任免理由">
                    {getFieldDecorator('reasonsForDismissal', {initialValue: memberInfo.reasonsForDismissal || ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </FormItem>
                  <div className="form-item" id="editReportingUnit">
                    <div className="item-label"><label>呈报单位:</label></div>
                    {getFieldDecorator('reportingTime', {initialValue: memberInfo.reportingTime ? moment(memberInfo.reportingTime, 'YYYY-MM-DD') : null})(
                      <DatePicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('editReportingUnit')} />
                    )}
                    {getFieldDecorator('reportingUnit', {initialValue: memberInfo.reportingUnit || ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </div>
                  <div className="form-item" id="editApprovalOpinion">
                    <div className="item-label"><label>审批机关意见:</label></div>
                    {getFieldDecorator('approvalTime', {initialValue: memberInfo.approvalTime ? moment(memberInfo.approvalTime, 'YYYY-MM-DD') : null})(
                      <DatePicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('editApprovalOpinion')} />
                    )}
                    {getFieldDecorator('approvalOpinion', {initialValue: memberInfo.approvalOpinion || ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </div>
                  <div className="form-item" id="editApprovalRemovalOpinion">
                    <div className="item-label"><label>行政机关任免意见:</label></div>
                    {getFieldDecorator('appointAndRemoveTime', {initialValue: memberInfo.appointAndRemoveTime ? moment(memberInfo.appointAndRemoveTime, 'YYYY-MM-DD') : null})(
                      <DatePicker style={{float: "right"}} getCalendarContainer={() => document.getElementById('editApprovalRemovalOpinion')} />
                    )}
                    {getFieldDecorator('appointAndRemoveOpinion', {initialValue: memberInfo.appointAndRemoveOpinion || ''})(
                      <Input type="textarea" placeholder="" rows={4} />
                    )}
                  </div>
                </div>
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

export default Form.create()(DocumentEditModalPC);
