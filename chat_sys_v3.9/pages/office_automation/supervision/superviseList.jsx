//督办管理
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Modal,WingBlank, WhiteSpace,Popup, SwipeAction,Button, Tabs, ListView,SearchBar} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;

import SuperviseAdd from './superviseAdd_comp.jsx';
import SuperviseDetail from './superviseDetail_comp.jsx';

const alert = Modal.alert;
//督办管理
class SuperviseList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["待办", "办理中", "已办结", "所有"],
        activeTabkey:'待办',
        colsNameCn:["收文日期", "标题", "来文单位", "督办类别", "当前办理人"],
        colsNameEn:["acceptDate", "title", "sendUnit", "superviseType", "curUsers"],
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        detailInfo:null,
        isLoading:false, //是否在加载列表数据
        showAdd:false,
        showDetail:false,
      };
  }
  componentWillMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,1);
  }
  getServerListData = (keyName,currentpage)=>{
    this.setState({isLoading:true});
    OAUtils.getSuperviseListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get 督办管理的list data:",data);
        this.setState({isLoading:false});
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        this.setState({
          listData:data.values,
          dataSource: this.state.dataSource.cloneWithRows(parseData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false});
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
      activeTabkey:key
    });
    this.getServerListData(key,1);
  }
  onClickOneRow = (rowData)=>{
    console.log("督办管理某行的点击--rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
  }
  onClickAddNew = ()=>{
    this.setState({showAdd:true});
  }
  backToTableListCall = ()=>{   //返回到列表页。
    this.setState({showAdd:false,showDetail:false});
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
        <SwipeAction style={{ backgroundColor: 'gray' }}
          autoClose
          disabled={false}
          right={[
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
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
          >
          <div key={rowID} className={'custom_listView_item'}
            style={{
              padding: '0.08rem 0.16rem',
              backgroundColor: 'white',
            }}
            onClick={()=>this.onClickOneRow(rowData)}
          >
            <div className={'list_item_container'}>
              <div className={'list_item_middle'}>
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.title}</div>
                <div>当前办理人：<span>{rowData.curUsers}</span></div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.acceptDate}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.superviseType}</div>
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      let {dataSource} = this.state;
      if(this.state.activeTabkey != tabName){
        dataSource = this.state.dataSource.cloneWithRows([]);
      }
      return (<TabPane tab={tabName} key={tabName} >
        <WhiteSpace />
        <WingBlank>
          <Button className="btn" type="primary" onClick={this.onClickAddNew}><Icon type="plus"/>新建</Button>
        </WingBlank>
        <WhiteSpace />
        <SearchBar placeholder="搜索" />
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?<div style={{textAlign:'center'}}>暂无数据</div>:null}
        {(!this.state.showAdd && !this.state.showDetail)?(<ListView
          dataSource={dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          initialListSize={5}
          pageSize={5}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{
            height: document.documentElement.clientHeight,
          }}
          useBodyScroll={true}
          scrollerOptions={{ scrollbars: true }}
        />):null}
      </TabPane>);
    });

    return (
      <div>
        <Tabs defaultActiveKey={this.state.activeTabkey}
          pageSize={5}
          swipeable={false}
          swipeable={false}
          onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
        {this.state.showAdd?
          <SuperviseAdd
            tokenunid={this.props.tokenunid}
            backToTableListCall={this.backToTableListCall}
          />:null}
        {this.state.showDetail?
          <SuperviseDetail
            tokenunid={this.props.tokenunid}
            activeTabkey={this.state.activeTabkey}
            detailInfo={this.state.detailInfo}
            backToTableListCall={this.backToTableListCall
          }/>:null}
      </div>
    )
  }
}

SuperviseList.defaultProps = {
};
SuperviseList.propTypes = {
};

export default SuperviseList;
