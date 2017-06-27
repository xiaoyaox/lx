//信息发布的通知公告
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
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
      //this.showDeleteConfirm =this.showDeleteConfirm.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        url:'http://ip:port/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
        moduleUrl:'/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url,当前是通知通告模块
        tabsArr:["所有", "待审核", "已通过", "未通过"],
        activeTabkey:'所有',
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        showDetail:false,
        showAddEdit:false,
      };
  }
  backToTableListCall = ()=>{
    this.setState({showDetail:false});
    this.setState({showAddEdit:false});
  }
  componentWillMount(){
    const data = [{
      key: '1',
      title:'周计划1',
      verifState: '已通过',
      type: '办理',
      sendTime:'2017/06/01'
    }, {
      key: '2',
      title:'周计划2',
      verifState: '未通过',
      type: '办理2',
      sendTime:'2017/05/01'
    }, {
      key: '3',
      title:'周计划3',
      verifState: '待审核',
      type: '办理2',
      sendTime:'2017/05/01'
    }];
    //本地假数据

    setTimeout(() => {
      this.setState({
        listData:data,
        dataSource: this.state.dataSource.cloneWithRows(data),
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
    //本地假数据
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.listData),
        refreshing: false
      });
    }, 2000);
    //从服务端获取数据。
    // this.getServerListData();
  };
  getServerListData = ()=>{ //从服务端获取列表数据
    var param = encodeURIComponent(JSON.stringify({
			"ver" : "2",
			"params" : {
				"key" : 10,
				"currentpage" : 1,
				"viewname" : "hcit.module.qbgl.ui.VeCld",
				"viewcolumntitles" : "文件标题,主办部门,拟稿日期,当前办理人,办理状态"
			}
		}));
    $.ajax({
				url : this.state.url,
				data : {
					"tokenunid" : "7503071114382B3716EAC10A53773B25",
					"param" : param,
          "url" : this.state.moduleUrl
				},
				async : true,
				success : (result)=>{
					var data  = decodeURIComponent(result);
          data = data.replace(/%20/g, " ");
					console.log("get server notice list data:",data);
          if(data.code == "1"){
            this.setState({
              listData:data,
              dataSource: this.state.dataSource.cloneWithRows(data.values),
              refreshing: false
            });
          }
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
  onClickOneRow = (rowData)=>{
    console.log("incomingList click rowData:",rowData);
    this.setState({showDetail:true});
  }
  onClickAddEdit = ()=>{
    this.setState({showAddEdit:true});
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          initialListSize={4}
          pageSize={4}
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
