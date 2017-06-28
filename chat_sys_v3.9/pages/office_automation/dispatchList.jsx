//发文管理
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Modal,WhiteSpace, SwipeAction,Popup, Tabs, RefreshControl, ListView,SearchBar, Button} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;
import DS_DetailComp from './ds_detail_comp.jsx';//公文详情

const alert = Modal.alert;
//发文管理
class DispatchList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["草稿箱", "待办", "办理中", "已发布", "所有"],
        activeTabkey:'待办',
        colsNameCn:["拟稿日期","拟稿单位", "拟稿人", "文件标题", "发文类型", "发文文号", "当前办理人", "办理状态"],
        colsNameEn:["draftDate", "draftUnit", "draftPerson", "fileTitle", "fileType", "fileNum", "curUsers", "status"],
        listData:[],
        isLoading:false,
        detailInfo:null,
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        showDetail:false,
        isEdit:false
      };
  }
  componentWillMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,1);
  }
  getServerListData = (keyName,currentpage,callback)=>{ //从服务端获取列表数据
    this.setState({isLoading:true});
    OAUtils.getDispatchListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get server signReport list data:",data);
        let {colsNameEn} = this.state;
        this.setState({isLoading:false});
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        this.setState({
          listData:data.values,
          dataSource: this.state.dataSource.cloneWithRows(parseData),
        });
        callback && callback();
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
    console.log("发文管理 click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
  }

  backToTableListCall = ()=>{
    this.setState({showDetail:false,isEdit: false});
  }

  onClickAddEdit = ()=>{
    this.setState({showDetail:true, isEdit: true});
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
                <div className="item_title">{rowData.fileTitle}</div>
                <div>当前办理人：<span>{rowData.curUsers}</span></div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.draftDate}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.status}</div>
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      return (<TabPane tab={tabName} key={tabName} >
        <Button className="btn" type="primary" style={{margin:"0.16rem"}} onClick={()=>this.onClickAddEdit()}><Icon type="plus" /> 新建</Button>
        <SearchBar placeholder="搜索" />
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?<div style={{textAlign:'center'}}>暂无数据</div>:null}
        {!this.state.showAddEdit && !this.state.showDetail ? (
          <ListView
            dataSource={this.state.dataSource}
            renderRow={listRow}
            renderSeparator={separator}
            scrollRenderAheadDistance={200}
            scrollEventThrottle={20}
            style={{
              height: document.documentElement.clientHeight,
            }}
            useBodyScroll={true}
            scrollerOptions={{ scrollbars: true }}
          />
        ):null}
      </TabPane>);
    });

    return (
      <div>
        <Tabs
          defaultActiveKey={this.state.activeTabkey}
          pageSize={5}
          swipeable={false}
          onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
        {this.state.showDetail?
          (<DS_DetailComp
            isEdit={this.state.isEdit}
            detailInfo={this.state.detailInfo}
            tokenunid={this.props.tokenunid}
            backToTableListCall={()=>this.backToTableListCall()}
            />):null}
      </div>
    )
  }
}

DispatchList.defaultProps = {
};
DispatchList.propTypes = {
};

export default DispatchList;
