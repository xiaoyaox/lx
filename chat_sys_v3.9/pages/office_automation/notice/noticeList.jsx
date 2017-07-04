//信息发布的通知公告
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import { Modal,WhiteSpace, SwipeAction, InputItem,TextareaItem,
  RefreshControl, Button,Tabs,List,ListView,SearchBar,Checkbox} from 'antd-mobile';
import Notice_DetailComp from './noticeDetail_comp.jsx';
import Notice_AddEditComp from './noticeAddEdit_comp.jsx';
const CheckboxItem = Checkbox.CheckboxItem;
import { Icon} from 'antd';
const alert = Modal.alert;
const TabPane = Tabs.TabPane;
//通知公告
class NoticeList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["所有", "待审核", "已通过", "未通过"],
        activeTabkey:'所有',
        colsNameCn:["拟稿日期", "文件标题", "主办部门", "当前办理人"],
        colsNameEn:["draftDate", "fileTitle", "department", "curUsers"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据。
        isMoreLoading:false, //是否正在加载更多。
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        showDetail:false,
        showAddEdit:false,
      };
  }
  componentWillMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,this.state.currentpage);
  }
  getServerListData = (keyName,currentpage)=>{ //从服务端获取列表数据
    this.setState({isLoading:true});
    OAUtils.getNoticeListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get 通知公告的list data:",data);
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        parseData = { ...this.state.listData, ...parseData };
        this.setState({
          isLoading:false,isMoreLoading:false,
          currentpage:this.state.currentpage+1,
          totalPageCount:data.totalcount,
          listData:parseData,
          dataSource: this.state.dataSource.cloneWithRows(parseData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false,isMoreLoading:false});
      }
    });
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedId = record.id ? record.id : '';
    alert('删除', '确定删除么??', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDelete(selectedId) },
    ]);
  }
  confirmDelete = (selectedId)=>{ //确认删除
    //TODO.
  }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key,
      listData:[],
      currentpage:1
    });
    this.getServerListData(key,1);
  }
  onClickOneRow = (rowData)=>{
    console.log("通知公告 click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
  }
  onClickAddEdit = ()=>{
    this.setState({showAddEdit:true});
  }
  backToTableListCall = ()=>{
    this.setState({showDetail:false,showAddEdit:false});
  }
  onEndReached = (evt)=>{
    let {currentpage,totalPageCount} = this.state;
    if (this.state.isMoreLoading && (currentpage==totalPageCount)) {
      return;
    }
    this.setState({ isMoreLoading: true });
    // this.getServerListData(this.state.activeTabkey,currentpage++);
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
      let disExamine=[
        {
          text: '审核不通过',
          onPress: () => console.log('cancel'),
          style: { backgroundColor: '#ddd', color: 'white' },
        },
        {
          text: '删除',
          onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
          style: { backgroundColor: '#F4333C', color: 'white' },
        },
      ];
      let disPass=[
        {
          text: '审核通过',
          onPress: () => console.log('cancel'),
          style: { backgroundColor: '#108ee9', color: 'white' },
        },
        {
          text: '删除',
          onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
          style: { backgroundColor: '#F4333C', color: 'white' },
        },
      ];
      let waitExamine=[
        {
          text: '审核通过',
          onPress: () => console.log('cancel'),
          style: { backgroundColor: '#108ee9', color: 'white' },
        },
        {
          text: '审核不通过',
          onPress: () => console.log('cancel'),
          style: { backgroundColor: '#ddd', color: 'white' },
        },
        {
          text: '删除',
          onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
          style: { backgroundColor: '#F4333C', color: 'white' },
        },
      ];
      let otherOption=[
        {
          text: '取消',
          onPress: () => console.log('cancel'),
          style: { backgroundColor: '#ddd', color: 'white' },
        },
        {
          text: '删除',
          onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
          style: { backgroundColor: '#F4333C', color: 'white' },
        },
      ];
      return (
        <SwipeAction style={{ backgroundColor: 'gray' }}
          autoClose
          disabled={false}
          right={(rowData.verifState.indexOf('已通过')!=-1)?disExamine:
          (rowData.verifState.indexOf('未通过')!=-1)?disPass:(rowData.verifState.indexOf('待审核')!=-1)?
          waitExamine:otherOption}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
          >
          <div key={rowID} className={'custom_listView_item'}
            style={{
              padding: '0.08rem 0.16rem',
              backgroundColor: 'white',
            }} onClick={()=>this.onClickOneRow(rowData)}
          >
            <div className={'list_item_container'}>
              <div className={'list_item_middle'}>
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.title}</div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.sendTime}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.verifState}</div>
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      return (<TabPane tab={tabName} key={tabName} >
        <Button type="primary" style={{margin:'0 auto',marginTop:'0.1rem',width:'98%'}}
        onClick={()=>this.onClickAddEdit()}><Icon type="plus" />新建</Button>
        <SearchBar placeholder="搜索" />
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?<div style={{textAlign:'center'}}>暂无数据</div>:null}

        <ListView
          dataSource={this.state.dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
              {this.state.isMoreLoading ? '加载中...' : '没有更多了！'}
            </div>)}
          initialListSize={4}
          pageSize={4}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{
            height: document.documentElement.clientHeight,
            border: '1px solid #ddd',
            margin: '0.1rem 0',
          }}
          useBodyScroll={true}
          scrollerOptions={{ scrollbars: false }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </TabPane>);
    });
    return (
      <div className="noticeList">
          <Tabs defaultActiveKey={this.state.activeTabkey}
          pageSize={4}
          swipeable={false}
          onTabClick={this.handleTabClick}>
            {multiTabPanels}
          </Tabs>
          <WhiteSpace />
          {this.state.showAddEdit?(<Notice_AddEditComp backToTableListCall={()=>this.backToTableListCall()} isShow={this.state.showDetail}/>):null}
          {this.state.showDetail?(<Notice_DetailComp backToTableListCall={()=>this.backToTableListCall()} isShow={this.state.showDetail}/>):null}
      </div>
    )
  }
}

NoticeList.defaultProps = {
};
NoticeList.propTypes = {
};

export default NoticeList;
