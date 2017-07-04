//电子档案手机界面
import $ from 'jquery';
import React from 'react';

import * as Utils from 'utils/utils.jsx';
import { createForm } from 'rc-form';
import { Modal,Flex
   , ListView,List,InputItem} from 'antd-mobile';
import { Icon,Table,Select,Button as ButtonPc} from 'antd';
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
const Option = Select.Option;
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class ERecordisMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.onOrganSelectChange = this.onOrganSelectChange.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        selectOrganId:'',//选中的组织结构的ID数组
        columns:[],
        sel: '',
        visible: false,
        contactInfo:{},

      };
  }


  onClickSearchSubmit = ()=>{
    this.props.form.validateFields((error, value) => {
      let params = value || {};
      params.organId = this.state.selectOrganId;
      !params.name ? delete params.name : null;
      !params.telephone ? delete params.telephone : null;
      console.log("document search form validateFields", error, params);
      this.props.handleSearchDocument(params||{});
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  onClickOnRow = (data)=>{ //显示新增编辑弹窗。
    let info = data || {};
    this.setState({
     contactInfo:info,
     visible: true,
   });
   console.log(data);
   console.log(data.name);
   console.log(this.state.visible);
   }
  componentWillMount(){
    const columns = [{
      title: '联系人',
      dataIndex: 'Contacts',
      render:(text,record,index) => (


            <div key={record.identity+123456}>
              <div className={'list_item_container'}>
                  <div className={'list_item_middle'}>
                    <div style={{color:'black',fontSize:'0.30rem',fontWeight:'bold'}}>{record.name+'('+record.telephone+')'}
                    </div>
                    <div style={{color:'black',fontSize:'0.30rem',marginTop:'0.3rem'}}>{record.organ}
                    </div>
                  </div>
                  <div className={'list_item_left'}>
                    <img width="54" height="54" src={record.uploadUrl}/>
                  </div>
                  <div className={'list_item_right'}>

                    <a href="javascript:;" style={{position:'absolute',top:'0',right:'0'}}>解矫</a>

                    <a href="javascript:;" style={{position:'absolute',bottom:'-1.1rem',right:'0'}} onClick={()=>this.onClickOnRow(record)}>查看</a>

                  </div>
              </div>
            </div>

          )
    }];
    this.setState({columns:columns});

  }
  onOrganSelectChange(val){
    console.log("onOrganSelectChange--:",val);
    this.setState({
      selectOrganId:val
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.redressOrganId && nextProps.redressOrganId!=this.props.redressOrganId){
      this.setState({selectOrganId:nextProps.redressOrganId});
    }
  }
  render() {
    const { contactInfo,visible } = this.state;

    let selectOrganId = this.state.selectOrganId || this.props.redressOrganId;
    console.log("selectOrganId--:",selectOrganId);
    // if(!selectOrganId){
    //   selectOrganId = this.props.organListData[0]['organId'];
    // }
    const { columns } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;

    let organData = [];
    for(let i in this.props.organListData){
      organData.push({label:this.props.organListData[i].organName+'('+this.props.organListData[i].count+')',
         value: this.props.organListData[i].organId});
    }
    // console.log(organData);
    let optionData=[];
    for(let i in this.props.organListData){
      optionData.push(this.props.organListData[i].organName+'('+this.props.organListData[i].count+')');
    }
    let optionDataDisplay=organData.map((tagName,index)=>{
      return (<Option value={tagName.value} key={index}>{tagName.label}</Option>);
    });
    let sponsorDepartmentSource=(
      <div className={'oa_detail_cnt'}>
        <div>
          <Flex>
            <Flex.Item>
              <div>
                  <span style={{color: 'black',fontSize:'0.3rem'}}><Icon type="team"
                  style={{color: '#278197',fontSize:'0.6rem'}}/>组织机构:</span>
                  <Select defaultValue={optionData[0]} style={{ width: 400 }} onSelect={this.onOrganSelectChange}>
                        {optionDataDisplay}
                  </Select>
                  <button type="submit" style={{marginLeft: 30}}
                    className="btn btn-primary" onClick={this.onClickSearchSubmit}
                    ><Icon type="search" /> 查询</button>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div>
                  <InputItem clear {...getFieldProps('name')}
                  editable={true} labelNumber={2} placeholder="请输入姓名"><Icon type="user"
                  style={{color: '#278197',fontSize:'0.6rem'}}/>姓名:</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div>
                  <InputItem clear {...getFieldProps('telephone')}
                  editable={true} labelNumber={2} placeholder="请输入手机号"><Icon type="phone"
                  style={{color: '#EF9F2E',fontSize:'0.6rem'}}/>手机号:</InputItem>
              </div>
            </Flex.Item>
          </Flex>
        </div>

      </div>
    );
    let multiTabPanels =
      (<div>
        {sponsorDepartmentSource}
      </div>)
    ;
    let ModalData =
    (<div><Modal
               title="电子档案详情"
               visible={visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               width="700px"
               height="auto"
               maskClosable={false}
            >
                 <List>
                         <List.Item key='0'><span>姓名</span><span>{contactInfo.name}</span></List.Item>
                         <List.Item key='1'><span>图像</span><img src={contactInfo.uploadUrl}/></List.Item>
                         <List.Item key='2'><span>性别</span><span>{contactInfo.sex}</span></List.Item>
                         <List.Item key='11'><span>出生日期</span><span>{contactInfo.csrq}</span></List.Item>
                         <List.Item key='3'><span>机构名称</span><span>{contactInfo.organ}</span></List.Item>
                         <List.Item key='4'><span>身份证号码</span><span>{contactInfo.identity}</span></List.Item>
                         <List.Item key='5'><span>矫正开始时间</span><span>{contactInfo.startTime}</span></List.Item>
                         <List.Item key='6'><span>矫正结束时间</span><span>{contactInfo.endTime}</span></List.Item>
                         {contactInfo.manageLevel!=='' ? (
                            <List.Item key='7'><span>管理等级</span><span>{contactInfo.manageLevel}</span></List.Item>
                         ):null}
                         <List.Item key='8'><span>人员编号</span><span>{contactInfo.rymcId}</span></List.Item>
                         <List.Item key='9'><span>手机号码</span><span>{contactInfo.telephone}</span></List.Item>
                         {contactInfo.criminal!=='' ? (
                            <List.Item key='10'><span>罪名</span><span>{contactInfo.criminal}</span></List.Item>
                         ):null}
                         {contactInfo.status!=='' ? (
                            <List.Item key='12'><span>状态</span><span>{contactInfo.status}</span></List.Item>
                         ):null}
                         <List.Item key='13'><span>矫正类型</span><span>{contactInfo.type}</span></List.Item>
                         <List.Item key='14'><span>解矫文书</span><img src={'http://211.138.238.83:9000/'+contactInfo.relieveCorrectionUrl}/></List.Item>
                         <List.Item key='15'><span>档案号</span><span>{contactInfo.fileNumber}</span></List.Item>
                 </List>
                 <span style={{position:'absolute',right:0,top:0,cursor:'pointer'}} onClick={this.handleCancel}
                   ><Icon type="close" /></span>
         </Modal></div>)
    ;
    return (
      <div className="newDispatchList eRecordStyle">
          {multiTabPanels}

          <div style={{width:'100%'}}>
            <Table
              columns={columns}
              showHeader={false}
              dataSource={this.props.eRecordData||[]}
              pagination={{ pageSize: 10 }}/>
          </div>
          {ModalData}
      </div>
    )
  }
}

ERecordisMobileComp.defaultProps = {
};
ERecordisMobileComp.propTypes = {
};

export default createForm()(ERecordisMobileComp);
