//电子档案手机界面
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import { createForm } from 'rc-form';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

// import myWebClient from 'client/my_web_client.jsx';
import { Modal,WhiteSpace, SwipeAction, Flex,Button,
   RefreshControl, ListView,SearchBar,Picker,List,NavBar,DatePicker,InputItem} from 'antd-mobile';
import { Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);

const alert = Modal.alert;
class ERecordisMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        url:'http://ip:port/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
        moduleUrl:'/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url,当前是通知通告模块
        activeTabkey:'按日期',
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        yValue:['请选择'],
        date: zhNow,
        validValue:zhNow,
        publicValue:zhNow,
        dataDepartmentSource:[],
        sValue:['办公室'],
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
        //console.log("获取OA的组织机构数据：",this.state.dataDepartmentSource);

        }

    });

    const data = [{
      key: '1',
      title:'党委会议纪要',
      verifState: '拟稿单位:办公室',
      type: '办理',
      sendTime:'2017/03/13'
    }, {
      key: '2',
      title:'党委会议纪要',
      verifState: '拟稿单位:办公室',
      type: '办理2',
      sendTime:'2017/06/08'
    }, {
      key: '3',
      title:'党委会议纪要',
      verifState: '拟稿单位:办公室',
      type: '办理2',
      sendTime:'2017/06/15'
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
  onvalidValueChange = (validValue) => {
    // console.log('onChange', date);
    this.setState({
      validValue,
    });
  }
  onpublicValueChange = (publicValue) => {
    // console.log('onChange', date);
    this.setState({
      publicValue,
    });
  }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key
    });
  }
  onClickOneRow = (rowData)=>{
    console.log("incomingList click rowData:",rowData);
  }
  render() {

    const { getFieldProps, getFieldError } = this.props.form;
    const year = [{label: '2014 ',value: '2014 '},{label: '2015 ',value: '2015 '},{label: '2016 ',value: '2016 '},
    {label: '2017 ',value: '2017 '}];
    const month = [{label: '1 ',value: '1 '},{label: '2 ',value: '2 '},{label: '3 ',value: '3 '},
    {label: '4 ',value: '4 '},{label: '5 ',value: '5 '},{label: '6 ',value: '6 '},{label: '7 ',value: '7 '},
    {label: '8 ',value: '8 '},{label: '9 ',value: '9 '},{label: '10 ',value: '10 '},{label: '11 ',value: '11 '},
    {label: '12 ',value: '12 '}];
    // const sponsorDepartment = [{label: '局领导 ',value: '局领导 '},{label: '办公室 ',value: '办公室 '},{label: '戒毒工作管理处 ',value: '戒毒工作管理处 '},
    // {label: '监狱工作管理处 ',value: '监狱工作管理处 '}];
    // let sponsorDepartment1 = this.state.dataDepartmentSource.map((departmentName,index)=>{
    //   [{label: {departmentName},value: {departmentName}}]});
    //console.log(sponsorDepartment[0].label);
    let sponsorDepartment = [];
    for(var i=0;i<=this.state.dataDepartmentSource.length-1;i++){
      sponsorDepartment.push({label:this.state.dataDepartmentSource[i],
         value: this.state.dataDepartmentSource[i]});
      // sponsorDepartment1[i].label=this.state.dataDepartmentSource[i];
      // sponsorDepartment1[i].value=this.state.dataDepartmentSource[i];
    }
    // console.log(this.state.dataDepartmentSource);
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
    let sponsorDepartmentSource=(
      <div className={'oa_detail_cnt'}>
        <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd',borderTop: '1px solid #ddd'}}>
                <Picker data={sponsorDepartment} cols={1} value={this.state.sValue}
                  {...getFieldProps('sponsorDepartment')}>
                  <List.Item arrow="horizontal">{this.state.dataDepartmentSource[0]}</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd'}}>
                  <InputItem
                  editable={true} labelNumber={2} placeholder="请输入姓名"><Icon type="user"
                  style={{color: '#278197',fontSize:'0.6rem'}}/></InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd'}}>
                  <InputItem
                  editable={true} labelNumber={2} placeholder="请输入手机号"><Icon type="phone"
                  style={{color: '#EF9F2E',fontSize:'0.6rem'}}/></InputItem>
              </div>
            </Flex.Item>
          </Flex>
        </div>
        <Button type="primary" style={{margin:'0 auto',marginTop:'0.1rem',width:'90%',marginBottom:'0.1rem'}}
        ><Icon type="search" />查询</Button>
      </div>
    );
    let multiTabPanels =
      (<div>
        <div>{sponsorDepartmentSource}</div>
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
          }}
          scrollerOptions={{ scrollbars: true }}
          refreshControl={<RefreshControl
            loading={(<Icon type="loading" />)}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
        />
        </div>)
    ;

    return (
      <div className="newDispatchList">
          {multiTabPanels}
        <WhiteSpace />
      </div>
    )
  }
}

ERecordisMobileComp.defaultProps = {
};
ERecordisMobileComp.propTypes = {
};

export default createForm()(ERecordisMobileComp);
