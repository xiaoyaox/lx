import $ from 'jquery';
import React from 'react';
import { Button} from 'antd-mobile';
import { Layout, Menu, Icon} from 'antd';
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;

class OaSiderbarComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        current: '待办事项',
      };
  }
  componentWillMount(){
  }
  handleClick = (item) => {
    console.log('OA menu click item:',item);
    switch(item.key){
      case "待办事项":
        this.setState({current:"待办事项"});
      break;
      case "收文管理":
        this.setState({current:"收文管理"});
      break;
      case "发文管理":
        this.setState({current:"发文管理"});
      break;
      case "签报管理":
        this.setState({current:"签报管理"});
      break;
      case "督办管理":
        this.setState({current:"督办管理"});
      break;
      case "最新发文":
        this.setState({current:"最新发文"});
      break;
      case "通知公告":
        this.setState({current:"通知公告"});
      break;
      case "司法行政系统信息查询":
        this.setState({current:"司法行政系统信息查询"});
        // window.open("http://www.rufa.gov.cn");
      break;
      default:
        break;
    }
    this.props.afterChooseMenuItemCall(item.key);
  }
  render() {

    return (
      <Sider className="custom_ant_sidebar oa_siderbar"
        style={{ background: '#2071a7',color:'#fff',overflow: 'hidden' ,
        height:document.documentElement.clientHeight - 60,marginTop:'60px'}}>
        <Menu
          theme="dark"
          mode="inline"
          style={{ width: '100%'}}
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}
        >
          <MenuItemGroup key="个人办公" title="个人办公">
            <Menu.Item key="待办事项"><Icon type="schedule" />待办事项</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="行政办公" title="行政办公">
            <Menu.Item key="收文管理"><Icon type="switcher" />收文管理</Menu.Item>
            <Menu.Item key="发文管理"><Icon type="file-text" />发文管理</Menu.Item>
            <Menu.Item key="签报管理"><Icon type="file" />签报管理</Menu.Item>
            <Menu.Item key="督办管理"><Icon type="eye" />督办管理</Menu.Item>
            <Menu.Item key="最新发文"><Icon type="file-text" />最新发文</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="信息发布" title="信息发布">
            <Menu.Item key="通知公告"><Icon type="notification" />通知公告</Menu.Item>
          </MenuItemGroup>
          <Menu.Item key="司法行政系统信息查询"><Icon type="idcard" />司法行政系统信息查询</Menu.Item>
        </Menu>
      </Sider>
    )
  }
}

OaSiderbarComp.defaultProps = {
};

OaSiderbarComp.propTypes = {
  afterChooseMenuItemCall:React.PropTypes.func,
};

export default OaSiderbarComp;
