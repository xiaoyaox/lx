//签报管理
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Modal, WingBlank, WhiteSpace, SwipeAction,
    Tabs, ListView,SearchBar, Button} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;
import SignReportAdd from './signReportAdd_comp.jsx';
import SignReportDetail from './signReportDetail_comp.jsx';

const alert = Modal.alert;
//签报管理
class SignReportList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["草稿箱", "待办", "办理中", "已定稿", "已发布", "所有", "组合查询"],
        activeTabkey:'待办',
        colsNameCn:["拟稿日期", "文件标题", "主办部门", "当前办理人"],
        colsNameEn:["draftDate", "fileTitle", "department", "curUsers"],
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        detailInfo:null,
        showAdd:false,
        showDetail:false,
      };
  }
  componentWillMount(){
    const data = [{
      key: '1',
      fileTitle:'签报管理111',
      department:'148中心',
      curUsers:'彭秀胜,吴龙',
      draftDate:'2017/06/01'
    }, {
      key: '2',
      fileTitle:'签报管理2222',
      department:'148中心',
      curUsers:'彭秀胜,吴龙',
      draftDate:'2017/05/01'
    }, {
      key: '3',
      fileTitle:'签报管理333',
      department:'148中心',
      curUsers:'总经理,毛锐,彭秀胜,吴龙',
      draftDate:'2017/05/01'
    }];
    //本地假数据
    // setTimeout(() => {
    //   this.setState({
    //     listData:data,
    //     dataSource: this.state.dataSource.cloneWithRows(data),
    //     refreshing: false
    //   });
    // }, 1000);
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,1);
  }
  getServerListData = (keyName,currentpage)=>{
    OAUtils.getSignReportListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get server signReport list data:",data);
        let parseData = this.formatServerListData(data.values);
        this.setState({
          listData:data.values,
          dataSource: this.state.dataSource.cloneWithRows(parseData),
        });
      }
    });
  }
  formatServerListData = (values)=>{ //整理后端发过来的列表数据。
    let listArr = [];
    let {colsNameEn} = this.state;
    values.forEach((value, index)=>{
      let obj = {key:index};
      Object.keys(value).forEach((key) => {
        let num = key.split("column")[1];
        if (!isNaN(num)) {
          obj[colsNameEn[+num]] = value[key];
        }else{
          obj[key] = value[key];
        }
      });
      listArr.push(obj);
    });
    return listArr;
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
  handleTabClick = (key)=>{ //切换tab，重新获取列表数据
    this.setState({
      activeTabkey:key
    });
    this.getServerListData(key,1);
  }
  onClickAddNew = ()=>{
    this.setState({showAdd:true});
  }
  onClickOneRow = (rowData)=>{
    console.log("incomingList click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
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
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.fileTitle}</div>
                <div>主办部门：<span>{rowData.department}</span></div>
                <div>当前办理人：<span>{rowData.curUsers}</span></div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.draftDate}</div>
                {/*<div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.verifState}</div>*/}
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      return (<TabPane tab={tabName} key={tabName} >
        <WhiteSpace />
        <WingBlank>
          <Button className="btn" type="primary" onClick={this.onClickAddNew}><Icon type="plus"/>新建</Button>
        </WingBlank>
        <WhiteSpace />
        <SearchBar placeholder="搜索" />
        {(!this.state.showAdd && !this.state.showDetail)?(<ListView
          dataSource={this.state.dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          delayTime={300}
          initialListSize={5}
          pageSize={50}
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
          pageSize={4}
          swipeable={false}
          onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
        {this.state.showAdd?
          <SignReportAdd
            tokenunid={this.props.tokenunid}
            backToTableListCall={this.backToTableListCall}
          />:null}
        {this.state.showDetail?
          <SignReportDetail
            activeTabkey={this.state.activeTabkey}
            detailInfo={this.state.detailInfo}
            tokenunid={this.props.tokenunid}
            backToTableListCall={this.backToTableListCall}
          />:null}
      </div>
    )
  }
}

SignReportList.defaultProps = {
};
SignReportList.propTypes = {
};

export default SignReportList;
