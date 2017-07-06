//个人办公的待办事项
import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WhiteSpace, WingBlank, Button,RefreshControl, ListView} from 'antd-mobile';
import {Icon} from 'antd';

class PersonalTodoList extends React.Component {
  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        colsNameCn:["标题", "模块",  "性质",  "紧急程度","送文人", "发送时间","办理时间"],
        colsNameEn:["fileTitle", "modules", "property","urgency","sendtextPerson", "sendTime","handleTime"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据
        isMoreLoading:false, //是否正在加载更多。
        hasMore:false, //是否还有更多数据。
        listData:[], //原生list数据
        dataSource: dataSource.cloneWithRows([]),  //listView的源数据。
      };
  }

  componentDidMount(){
    //从服务端获取数据。
    this.getServerListData();
  }

  //获取服务器端的待办事项数据。
  getServerListData = (currentpage)=>{
    this.setState({isLoading:true});
    OAUtils.getPersonalTodoListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      urlparam:{
        key:'dbsx',
        type:3
      },
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get 待办事项的list data:",data);
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        let listData = this.state.listData.concat(parseData);
        console.log("待办事项的format list data:",listData);
        this.setState({
          isLoading:false,
          isMoreLoading:false,
          currentpage:currentpage+1,
          totalPageCount:data.totalcount,
          listData:listData,
          hasMore:(currentpage+1)<=data.totalcount,
          dataSource: this.state.dataSource.cloneWithRows(listData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false,isMoreLoading:false});
      }
    });
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
      console.log(rowData.handleTime);
      return (
        <div key={rowID} className={'custom_listView_item'}
          style={{
            padding: '0.08rem 0.16rem',
            backgroundColor: 'white',
          }}
        >
        <div className={'list_item_container'}>
          <div className={'list_item_middle'}>
            <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.fileTitle}</div>
            <div>送文人：<span>{rowData.sendtextPerson}</span></div>
            <div>模块：<span>{rowData.modules}</span></div>
            <div>性质：<span>{rowData.property}</span></div>
            <div>紧急程度：<span>{rowData.urgency}</span></div>
          </div>
          <div className={'list_item_left'}>
            <span className={'list_item_left_icon'} >
              <Icon type="schedule" style={{fontSize:'3em'}} />
            </span>
          </div>
          <div className={'list_item_right'}>
            <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.sendTime}</div>
            <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.handleTime}</div>
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
