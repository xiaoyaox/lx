import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';

import {InputItem,List} from 'antd-mobile';
import { Row, Col, Form, Icon, Input, Button as ButtonPc } from 'antd';
const FormItem = Form.Item;

const formItemLayout4Search = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
  },
};
// 用户管理的查询区组件
class UserSearchZoneComp extends React.Component {
  constructor(props) {
      super(props);
      this.handleUsersSearch = this.handleUsersSearch.bind(this);
      this.handleClearSearch = this.handleClearSearch.bind(this);
      this.state = {
        isMobile: Utils.isMobile()
      };
  }
  handleUsersSearch(e){
    e && e.preventDefault();
    console.log("handleSearch,用户管理点击查询--:",this.props.form.getFieldsValue());
    let params;
    if(this.state.isMobile){
      params = {filter:document.querySelector('.mobileSearchContainer input[name=filter]').value}
    }else{
      params = this.props.form.getFieldsValue();
    }
    //getServerData. and update list.
    this.props.updateUserListOnSearch(params);
  }
  handleClearSearch(){ //清空查询区
    this.props.form.resetFields();
    this.handleUsersSearch(null);
  }
  getUserSearchForm() {
    const { getFieldDecorator, getFieldsError, getFieldError } = this.props.form;
     let docp=(
      <div>
        <p className="title" style={{fontSize:'14px'}}>用户管理详细信息</p>
      </div>
    )
    // <FormItem label="姓名" className="sp-r-10">
    //   {getFieldDecorator('nickname', {
    //   })(
    //     <Input placeholder="" />
    //   )}
    // </FormItem>
    // <FormItem label="组织" className="sp-r-10">
    //   {getFieldDecorator('organizationName', {
    //   })(
    //     <Input placeholder="" />
    //   )}
    // </FormItem>

    let searchPCForm = (
      <div>
              {docp}
              <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleUsersSearch}
              >
              <Row type="flex" justify="space-around" align="middle" className=''>
                <Col span={12} className=''>
                  <FormItem label="关键字" {...formItemLayout4Search}>
                    {getFieldDecorator('filter', {
                    })(
                      <Input placeholder="用户名/邮箱/电话" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="">
                    <button type="submit"
                      className="btn btn-primary"
                      ><Icon type="search" /> 搜索</button>
                    <button type="button" style={{marginLeft: "10px"}}
                      onClick={this.handleClearSearch}
                      className="btn"
                      >清空</button>
                  </FormItem>
                </Col>

              </Row>
              </Form>
      </div>
    )
    let searchMobileForm = (
      <div className="am-sys-list">
        <List className="mobileSearchContainer">
          <InputItem clear autoFocus placeholder="用户名/邮箱/电话" name='filter'>关键字</InputItem>
        </List>
        <div style={{ margin: '0.16rem' }}>
          <ButtonPc type="primary"><Icon type="search" onClick={this.handleUsersSearch}/> 搜索</ButtonPc>
        </div>
      </div>
    )

    return this.state.isMobile ? searchMobileForm : searchPCForm;
  }
  render() {
    let searchZoneEles = this.getUserSearchForm();
    return (
      <div className={''}>
        {searchZoneEles}
      </div>
    );
  }
}

UserSearchZoneComp.defaultProps = {
};

UserSearchZoneComp.propTypes = {
  updateUserListOnSearch:React.PropTypes.func,
  className: React.PropTypes.string
};

export default Form.create()(UserSearchZoneComp);
