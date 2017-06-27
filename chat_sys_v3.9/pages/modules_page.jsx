
import * as Utils from 'utils/utils.jsx';

import React from 'react';
// import {message} from 'antd';
import LogOutComp from './components/log_out_comp.jsx'
// import {browserHistory} from 'react-router/es6';
import * as GlobalActions from 'actions/global_actions.jsx';

import OA_icon from 'images/modules_img/OA_icon.png';
import chat_icon from 'images/modules_img/chat_icon.png';
import document_icon from 'images/modules_img/document_icon.png';
import mailList_icon from 'images/modules_img/mailList_icon.png';
import modify_icon from 'images/modules_img/modify_icon.png';
import settings_icon from 'images/modules_img/settings_icon.png';
import signin_icon from 'images/modules_img/signin_icon.png';

import ModulesMobileComp  from './modules_comp/modules_mobile_comp.jsx';
import ModulesPcComp  from './modules_comp/modules_pc_comp.jsx';

const notShow_moduleId_inMobile = "1006";
const notShow_moduleId_inPC = "";
// const notShow_moduleId_inPC = "1001"; //真正上线时用这个。

class ChooseModulesPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleGoMatter = this.handleGoMatter.bind(this);
        this.state = {
            localStoreKey4Modules:'S_F_E_T_MODULES_KEY',
            allModulesData:[],
            isMobile: Utils.isMobile()
        };
    }
    componentWillMount() {
      this.getAllModulesData();
    }
    getAllModulesData(){
      let modulesData = [
        {
          id:"1001",
          name : "OA系统",
          singleclassName:"OAModule",
          iconName : OA_icon,
          tagName:'Link',
          linkTo : "office_automation"
        },
        {
          id:"1002",
          name : "矫正系统",
          singleclassName:"modifyModule",
          iconName : modify_icon,
          tagName:'Link',
          linkTo : "notification"
        },
        {
          id:"1003",
          name : "档案管理",
          singleclassName:"documentModule",
          iconName : document_icon,
          tagName:'Link',
          linkTo : "document",
          canSetPrivilege:true
        },
        {
          id:"1004",
          name : "通讯录",
          singleclassName:"mailListModule",
          iconName : mailList_icon,
          tagName:'Link',
          linkTo : "address_book",
          canSetPrivilege:true
        },
        {
          id:"1005",
          name : "群聊",
          singleclassName:"chatModule",
          iconName : chat_icon,
          tagName:'a',
          onclick:'this.props.handleGoMatter',
          linkTo : "channels",
          canSetPrivilege:true
        },
        {
          id:"1006",
          name : "系统设置",
          singleclassName:"settingsModule",
          iconName : settings_icon,
          tagName:'Link',
          linkTo : "sys_config",
          canSetPrivilege:true
        },
        {
          id:"1007",
          name : "登录签到",
          singleclassName:"signinModule",
          iconName : signin_icon,
          tagName:'Link',
          linkTo : "login_record"
        },
        // {
        //   id:"1008",
        //   name : "测试",
        //   iconName : signin_icon,
        //   tagName:'a',
        //   backColor : "#F15858",
        //   linkTo : ""
        // }
      ]
      this.setState({"allModulesData":modulesData});
    }
    handleGoMatter() {
      // console.log('redirectUserToDefaultTeam');
      GlobalActions.redirectUserToDefaultTeam();
      // browserHistory.push('/siteview/channels/town-square');
    }
    render() {
        let {localStoreKey4Modules, allModulesData} = this.state;
        let finalEle = this.state.isMobile ?
            (<ModulesMobileComp
              localStoreKey4Modules={localStoreKey4Modules}
              allModulesData={allModulesData}
              notShowModuleIdInMobile={notShow_moduleId_inMobile}
              handleGoMatter={this.handleGoMatter} />) :
            (<ModulesPcComp
              localStoreKey4Modules={localStoreKey4Modules}
              allModulesData={allModulesData}
              notShowModuleIdInMobile={notShow_moduleId_inMobile}
              notShowModuleIdInPC={notShow_moduleId_inPC}
              handleGoMatter={this.handleGoMatter}/>);
        return (
          <div className=''>
            {finalEle}
          </div>
        );
    }
}

ChooseModulesPage.defaultProps = {
};
ChooseModulesPage.propTypes = {
    // params: React.PropTypes.object.isRequired
};

export default ChooseModulesPage;
