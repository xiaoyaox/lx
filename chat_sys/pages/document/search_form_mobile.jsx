import React from 'react';
import UserStore from 'stores/user_store.jsx';

import { Icon } from 'antd';
import {Popup, List, InputItem, Button} from 'antd-mobile';
import { createForm } from 'rc-form';
import * as Utils from 'utils/utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';


class SearchFormMobile extends React.Component {
  constructor(props) {
      super(props);
      // this.beforeUploadCall = this.beforeUploadCall.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        isMobile: Utils.isMobile(),
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }
  componentDidMount() {
    this.props.form.resetFields();
  }
  onClickSubmit = ()=>{
    this.props.form.validateFields((error, value) => {
      let params = value || {};
      !params.userName ? delete params.userName : null;
      !params.gender ? delete params.gender : null;
      // console.log("document search form validateFields", error, params);
      this.props.handleSearch(params||{});
    });
  }

  showSelectGender = (e)=> {
    e.preventDefault();
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    let maskProps;
    if (isIPhone) {
      // Note: the popup content will not scroll.
      maskProps = {
        onTouchStart: e => e.preventDefault(),
      };
    }
    const onMaskClose = () => {
      // console.log('onMaskClose');
    }
    Popup.show( <GenderSelectPopup onClose={this.onPoClose} gender="男"></GenderSelectPopup>, { animationType: 'slide-up', onMaskClose });
  }
  onPoClose = (sel) => {
    this.props.form.setFieldsValue({
      gender:sel
    });
    Popup.hide();
  }
  render() {
    const { getFieldProps } = this.props.form;
    // <InputItem clear autoFocus value="123" placeholder="请输入部门" {...getFieldProps('department')}>部门</InputItem>
    return (
      <div className="am-doc-list">
        <List>
          <InputItem clear autoFocus placeholder="请输入姓名" {...getFieldProps('userName')}>姓名</InputItem>
          <InputItem clear onClick={this.showSelectGender} placeholder="请选择" {...getFieldProps('gender')}>
            性别 <Icon type="down" />
          </InputItem>
        </List>
        <div style={{ margin: '0.16rem' }}>
          {
            this.state.hasOperaPermission ?
            (<Button type="primary" onClick={this.onClickSubmit}><Icon type="search" /> 搜索</Button>):
            (<span style={{textAlign:'center'}}>没有权限</span>)
          }
        </div>
      </div>
    );
  }
}

class GenderSelectPopup extends React.Component {
  onSel(sel) {
    this.props.onClose(sel);
  }
  render() {
    const genders = ['男', '女'];
    return (
      <div>
        <List className="popup-list" renderHeader={() => (
         <div style={{ position: 'relative' }}>
           选择性别
           <span style={{ position: 'absolute', right: 3, top: -5 }} onClick={() => this.onSel()}>
             <Icon type="cross" />
           </span>
         </div>)}
        >
        {genders.map((i, index) => (
          <List.Item key={index} onClick={() => { this.onSel(i) }}>
            <span>{i} {this.props.gender === i ?
                  <Icon type="check" className="pull-right" style={{ color: "#108ee9", paddingTop: "5px"}} /> :
                  null
                }</span>
          </List.Item>
        ))}
        </List>
      </div>
    )
  }
}

const WrappedSearchFormMobile = createForm()(SearchFormMobile);

export default WrappedSearchFormMobile;
