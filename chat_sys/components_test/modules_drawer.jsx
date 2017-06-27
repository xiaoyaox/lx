// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import ReactDOM from 'react-dom';
import * as Utils from 'utils/utils.jsx';
import client from 'client/web_client.jsx';

import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import React from 'react';
import {Link} from 'react-router/es6';
import { Drawer, List, NavBar,Button } from 'antd-mobile';
// import List  from 'antd-mobile/lib/list';

const Item = List.Item;
const Brief = Item.Brief;

class ModulesDrawer extends React.Component {
    constructor(props) {
        super(props);

        // this.handleSendLink = this.handleSendLink.bind(this);

        this.state = {
          open: true,
          position: 'left',
        };
    }
    onOpenChange = (...args) => {
    console.log(args);
    this.setState({ open: !this.state.open });
  }
  componentDidMount(){
    let _this = this;
    document.addEventListener('keyup',function(e){
      let isopen = !_this.state.open;
      if(e.keyCode == 27){
        _this.setState({open:isopen});
      }
    });
  }
  render() {
    let modulesCfg = [
      { name:"OA_系统",
        icon:"",
        linkUrl:'oa_sys'
      },
      { name:'矫正系统',
        icon:'',
        linkUrl:'notification'
      },
      { name:'档案管理',
        icon:'',
        linkUrl:'document'
      },
      { name:'电子通讯录',
        icon:'',
        linkUrl:'address_book'
      },
      { name:'系统设置',
        icon:'',
        linkUrl:'sys_config'
      },
      { name:'群聊',
        icon:'',
        linkUrl:'documents'
      },
      { name:'登录签到',
        icon:'',
        linkUrl:'login_record'
      }
    ];
    const sidebar = (<List>
      {modulesCfg.map((obj, index) => {
        return (<List.Item key={index}>
          <Link to={obj.linkUrl}>
              {obj.name}
          </Link>
        </List.Item>);
      })}
    </List>);

    const drawerProps = {
      open: this.state.open,
      position: this.state.position
      // onOpenChange: this.onOpenChange,
    };

    //  <Button type="primary" inline onClick={this.onOpenChange} style={{ marginRight: '0.08rem',position:'absolute',top:'0',right:'0',zIndex:'3' }} >选择模块</Button>
    return (<div>
      <Drawer
        className="my_drawer modules_drawer"
        style={{ minHeight: document.documentElement.clientHeight - 200,zIndex:9,width:'240px' }}
        dragHandleStyle={{ display: 'none' }}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
        sidebar={sidebar}
        {...drawerProps} >
        <span style={{display:'none'}}>can't be empty!!</span>
      </Drawer>
    </div>);
  }
}

ModulesDrawer.defaultProps = {
};

ModulesDrawer.propTypes = {
};

export default ModulesDrawer;
