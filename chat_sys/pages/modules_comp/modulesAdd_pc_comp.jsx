
import $ from 'jquery';
import ReactDOM from 'react-dom';
import * as Utils from 'utils/utils.jsx';
import client from 'client/web_client.jsx';

import React from 'react';
import {Link} from 'react-router/es6';
import {Row,Col,Icon,message,Checkbox,Modal,Button} from 'antd';

import * as commonUtils from '../utils/common_utils.jsx';

import logo_icon from 'images/modules_img/logo_icon.png';
import edit_icon from 'images/modules_img/edit_icon.png';
import OA_icon from 'images/modules_img/OA_icon.png';
import chat_icon from 'images/modules_img/chat_icon.png';
import document_icon from 'images/modules_img/document_icon.png';
import mailList_icon from 'images/modules_img/mailList_icon.png';
import modify_icon from 'images/modules_img/modify_icon.png';
import settings_icon from 'images/modules_img/settings_icon.png';
import signin_icon from 'images/modules_img/signin_icon.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';

class ModulesAddPcComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          hasModify:false,
          curDelModuleIds:[], //当前删除的模块数的id.
        };
    }

    componentWillMount(){
      this.refreshModules();
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.visible && !this.props.visible){
        this.refreshModules();
      }
    }
    refreshModules(){
      let delModules = (localStorage.getItem(this.props.localStoreKey4Modules) || '').split(',');
      delModules = commonUtils.removeNullValueOfArr(delModules);
      this.setState({
        curDelModuleIds:delModules
      });
    }

    onCheckboxChange = (e)=>{
      let moduleId = e.target["data-moduleid"];
      let curDelModuleIds = [...this.state.curDelModuleIds];
      if(e.target.checked){
      curDelModuleIds = commonUtils.removeValueFromArr(curDelModuleIds,moduleId);
        this.setState({ curDelModuleIds });
      }else{
        curDelModuleIds.push(moduleId);
        this.setState({ curDelModuleIds });
      }
    }

    getModulesItem(allModulesData,curDelModuleIds){
      let modulesItem = allModulesData.map((item)=>{
        let isChecked = curDelModuleIds.indexOf(item.id) == -1;
        if(item.id == this.props.notShowModuleIdInPC){
          return "";
        }
        return (
            <Row key={item.id} style={{height:'25px',width:'100%'}}>
              <Col span={24}>
                <Checkbox onChange={this.onCheckboxChange} checked={isChecked} data-moduleid={item.id}>{item.name}</Checkbox>
              </Col>
            </Row>
          )
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      return modulesItem;
    }

    handleAddModules = ()=>{
      let curDelModuleIdsStr = this.state.curDelModuleIds.join(',');
      localStorage.setItem(this.props.localStoreKey4Modules,curDelModuleIdsStr);
      this.setState({hasModify:true});
      this.handleDialogClose();
    }
    handleDialogClose = ()=>{
      this.props.closeAddDialogCall();
    }
    afterCloseAddDialog = ()=>{
      this.refreshModules();
      let hasModify = this.state.hasModify;
      this.setState({hasModify:false});
      this.props.afterCloseAddDialog(hasModify);
    }

    render() {
      let modulesItem = this.getModulesItem(this.props.allModulesData,this.state.curDelModuleIds);
      // console.log("Modal modulesItem---:",modulesItem);
        return (
              <Modal className="sys-edit-form"
                visible={this.props.visible}
                title={'添加模块'}
                onOk={this.handleAddModules}
                onCancel={this.handleDialogClose}
                width="500px"
                maskClosable={true}
                afterClose={this.afterCloseAddDialog}
                footer={[
                  <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleAddModules}>
                    保存
                  </Button>,
                  <Button key="back" size="large" onClick={this.handleDialogClose}>取消</Button>,
                ]}>
                <div style={{width:'100%'}}>
                  {modulesItem}
                </div>
              </Modal>
        );
    }
}

ModulesAddPcComp.defaultProps = {
};
ModulesAddPcComp.propTypes = {
  visible:React.PropTypes.bool,
  allModulesData:React.PropTypes.array,
  localStoreKey4Modules:React.PropTypes.string,
  closeAddDialogCall:React.PropTypes.func,
  afterCloseAddDialog:React.PropTypes.func,
  notShowModuleIdInPC:React.PropTypes.string
};

export default ModulesAddPcComp;
