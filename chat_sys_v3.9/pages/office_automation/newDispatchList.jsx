//最新发文
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import { createForm } from 'rc-form';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

// import myWebClient from 'client/my_web_client.jsx';
import { Modal,WhiteSpace, SwipeAction, Flex,Button,
  Tabs, RefreshControl, ListView,SearchBar,Picker,List,NavBar,DatePicker,InputItem} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;
import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);

const alert = Modal.alert;
//最新发文
class NewDispatchList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["按日期", "按年度", "按主办部门", "组合查询"],
        activeTabkey:'按日期',
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据
        isMoreLoading:false, //是否正在加载更多。
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        yValue:['请选择'],
        date: zhNow,
        validValue:zhNow,
        publicValue:zhNow,
        dataDepartmentSource:[],
        showDetail:false,
        detailInfo:null,
      };
  }
  componentWillMount(){
    OAUtils.getOrganization({
      tokenunid:this.props.tokenunid,
      successCall: (data)=>{
        //console.log("获取OA的组织机构数据：",data);
        let organizationList = OAUtils.formatOrganizationData(data.values);
        //console.log("获取OA的组织机构数据：",organizationList);
        //console.log("获取OA的组织机构数据：",organizationList.length);
        let dataDepartment=[];
        for(var i=0;i<=organizationList.length-1;i++){
          dataDepartment[i]=organizationList[i].commonname;
        }
        dataDepartment.splice(dataDepartment.indexOf('暂定'),1);
        dataDepartment.splice(dataDepartment.indexOf('打印室'),1);
        dataDepartment.splice(dataDepartment.indexOf(undefined),1);
        this.setState({
          dataDepartmentSource:dataDepartment,
        });
      }
    });
    //本地假数据
    this.setState({
      listData:[],
      dataSource: this.state.dataSource.cloneWithRows([])
    });
    //从服务端获取数据。
    // this.getServerListData(this.state.activeTabkey,this.state.currentpage);
  }
  getServerListData = (keyName,currentpage)=>{
    this.setState({isLoading:true});
    OAUtils.getSuperviseListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get 最新发文的list data:",data);
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
  onvalidValueChange = (validValue) => {
    this.setState({
      validValue,
    });
  }
  onpublicValueChange = (publicValue) => {
    this.setState({
      publicValue,
    });
  }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key,
      listData:[],
      currentpage:1
    });
    // this.getServerListData(key,1);
  }
  onEndReached = (evt)=>{
    let {currentpage,totalPageCount} = this.state;
    if (this.state.isMoreLoading && (currentpage==totalPageCount)) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(this.state.activeTabkey,currentpage++);
  }
  onClickOneRow = (rowData)=>{
    console.log("incomingList click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true});
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const year = [{label: '2014 ',value: '2014 '},{label: '2015 ',value: '2015 '},{label: '2016 ',value: '2016 '},
    {label: '2017 ',value: '2017 '},{label: '2018 ',value: '2018 '},{label: '2019 ',value: '2019 '}];
    const month = [{label: '1 ',value: '1 '},{label: '2 ',value: '2 '},{label: '3 ',value: '3 '},
    {label: '4 ',value: '4 '},{label: '5 ',value: '5 '},{label: '6 ',value: '6 '},{label: '7 ',value: '7 '},
    {label: '8 ',value: '8 '},{label: '9 ',value: '9 '},{label: '10 ',value: '10 '},{label: '11 ',value: '11 '},
    {label: '12 ',value: '12 '}];

    let sponsorDepartment = [];
    for(var i=0;i<=this.state.dataDepartmentSource.length-1;i++){
      sponsorDepartment.push({label:this.state.dataDepartmentSource[i],
         value: this.state.dataDepartmentSource[i]});
      // sponsorDepartment1[i].label=this.state.dataDepartmentSource[i];
      // sponsorDepartment1[i].value=this.state.dataDepartmentSource[i];
    }
    // console.log(sponsorDepartment1);
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
      let yearSource=(
        <div className={'oa_detail_cnt'}>
          <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
            <Flex>
              <Flex.Item>
                <div style={{borderBottom: '1px solid #ddd'}}>
                  <Picker data={year} cols={1}
                    {...getFieldProps('year')}>
                    <List.Item arrow="horizontal">年份</List.Item>
                  </Picker>
                </div>
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                <div className="select_container">
                  <Picker data={month} cols={1}
                    {...getFieldProps('month')}>
                    <List.Item arrow="horizontal">月份</List.Item>
                  </Picker>
                </div>
              </Flex.Item>
            </Flex>
          </div>
        </div>
      );
      let sponsorDepartmentSource=(
        <div className={'oa_detail_cnt'}>
          <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
            <Flex>
              <Flex.Item>
                <div className="select_container">
                  <Picker data={sponsorDepartment} cols={1}
                    {...getFieldProps('sponsorDepartment')}>
                    <List.Item arrow="horizontal">按主办部门</List.Item>
                  </Picker>
                </div>
              </Flex.Item>
            </Flex>
          </div>
        </div>
      );
      let combinationSearch=(
                <div className={'oa_detail_cnt'}>
                  <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
                      <Flex>
                        <Flex.Item>
                          <div style={{borderBottom: '1px solid #ddd'}}>
                              <InputItem
                              editable={true} labelNumber={2} placeholder="标题">标题</InputItem>
                          </div>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <div style={{borderBottom: '1px solid #ddd'}}>
                              <InputItem
                              editable={true} labelNumber={4} placeholder="拟稿单位">拟稿单位</InputItem>
                          </div>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <div style={{borderBottom: '1px solid #ddd'}}>
                              <InputItem
                              editable={true} labelNumber={4} placeholder="发文文号">发文文号
                              </InputItem>
                          </div>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <div style={{borderBottom: '1px solid #ddd'}}>
                            <DatePicker className="forss"
                              mode="date"
                              onChange={this.onvalidValueChange}
                              value={this.state.validValue}
                            >
                            <List.Item arrow="horizontal">成文起始日期</List.Item>
                            </DatePicker>
                          </div>
                        </Flex.Item>
                      </Flex>
                      <Flex>
                        <Flex.Item>
                          <div style={{borderBottom: '1px solid #ddd'}}>
                            <DatePicker className="forss"
                              mode="date"
                              onChange={this.onpublicValueChange}
                              value={this.state.publicValue}
                            >
                            <List.Item arrow="horizontal">成文结束日期</List.Item>
                            </DatePicker>
                          </div>
                        </Flex.Item>
                      </Flex>
                    </div>
                      <Button type="primary" style={{margin:'0 auto',marginTop:'0.1rem',width:'90%',marginBottom:'0.1rem'}}
                      ><Icon type="search" />查询</Button>
                  </div>
      );
      let pagesContent=index=="1"?yearSource:(index=="2")?sponsorDepartmentSource:
      (index=="3")?combinationSearch:null;
      return (<TabPane tab={tabName} key={tabName} >
        <div>{pagesContent}</div>

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
          }}
          useBodyScroll={true}
          scrollerOptions={{ scrollbars: false }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </TabPane>);
    });
    return (
      <div className="newDispatchList">
        <Tabs swipeable={false} defaultActiveKey={this.state.activeTabkey} pageSize={4} onTabClick={this.handleTabClick}>

          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
      </div>
    )
  }
}

NewDispatchList.defaultProps = {
};
NewDispatchList.propTypes = {
};

export default createForm()(NewDispatchList);
