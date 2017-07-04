//个人办公的待办事项
import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import {Link} from 'react-router/es6';
import { WhiteSpace, WingBlank, Button,RefreshControl, ListView} from 'antd-mobile';
import {Icon} from 'antd';

import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);

class PersonalTodoList extends React.Component {
  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        url:'http://ip:port/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
        moduleUrl:'/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //待办事项模块的url.
        listData:[], //原生list数据
        dataSource: dataSource.cloneWithRows([]),  //listView的源数据。
        refreshing: false,
      };
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        listData:[],
        dataSource: this.state.dataSource.cloneWithRows([]),
        refreshing: false
      });
    }, 1000);
    //从服务端获取数据。
    // this.getServerListData();
  }

  onRefresh = () => {
    if(this.state.refreshing){ //如果正在刷新就不用重复刷了。
      return;
    }
    console.log('onRefresh');
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.listData),
        refreshing: false
      });
    }, 2000);
    //从服务端获取数据。
    // this.getServerListData();
  }
  getServerListData = ()=>{  //获取服务器端的待办事项数据。
    //TODO
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const listRow = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID} className={'custom_listView_item'}
          style={{
            padding: '0.08rem 0.16rem',
            backgroundColor: 'white',
          }}
        >
          <div className={'list_item_container'}>
            <div className={'list_item_middle'}>
              <div className={'item_title'}>
                {rowData.title}
              </div>
              <div style={{position:'absolute',bottom:'0'}}>{rowData.modules}</div>
            </div>
            <div className={'list_item_left'}>
              <span className={'list_item_left_icon'} >
                <Icon type="schedule" style={{fontSize:'3em'}} />
              </span>
            </div>
            <div className={'list_item_right'}>
              <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.sendTime}</div>
              <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.sender}</div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          initialListSize={5}
          pageSize={5}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{
            height: document.documentElement.clientHeight,
            border: '1px solid #ddd',
            margin: '0.1rem 0',
          }}
          scrollerOptions={{ scrollbars: true }}
          refreshControl={<RefreshControl
            loading={(<Icon type="loading" />)}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
        />
      </div>
    )
  }
}

PersonalTodoList.defaultProps = {
};

PersonalTodoList.propTypes = {
  title:React.PropTypes.string,
};

export default PersonalTodoList;
