import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { ListView, List, Modal} from 'antd-mobile';
import { Icon} from 'antd';

//办文跟踪通用组件。
class CommonFlowTraceComp extends React.Component {
  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabName:"flowTrace",
        dataSource: dataSource.cloneWithRows([]),
      };
  }
  componentWillMount(){
    if(this.props.docunid){
      this.getServerFlowTraceData();
    }
  }
  componentWillReceiveProps(nextState){
    if(nextState.docunid && nextState.docunid != this.props.docunid){
      this.getServerFlowTraceData();
    }
  }
  /*{"unid":"7505030F23066868F5AC1031B6BC925B",  //每个办文记录的唯一标识
  "nodename":"签报拟稿",   //办文节点名称
  "taskstate":"8",  //办文状态
  "taskstatetitle":"已完成",  //办文状态中文名称
  "sendtime":"2017-06-03 15:35:06",  //接收时间
  "bltime":"2017-06-03 15:35:16",  //办理时间
  "ownercommonname":"admin",  //办理人姓名
  "orgcommonname":"武汉海昌信息技术有限公司"}*/   //办理人机构
  getServerFlowTraceData = ()=>{
    let {docunid, bwgzunid, modulename} = this.props;
    OAUtils.getDoArticleTrack({
      tokenunid: this.props.tokenunid,
      docunid,
      bwgzunid, //该值来源于请求的表单数据：flowsessionid
      modulename,
      successCall: (data)=>{
        console.log("get server FlowTrace,办文跟踪数据:",data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.values.flowtracelist || []),
        });
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
      let taskStateColor = ({'8':'green','':'black'})[rowData.taskstate] || 'black';
      return (
        <div key={rowID} className={'custom_listView_item'}
          style={{
            padding: '0.08rem 0.16rem',
            backgroundColor: 'white',
          }}
        >
          <div className={'list_item_container'}>
            <div className={'list_item_middle'}>
              <div style={{color:taskStateColor,fontSize:'0.33rem',fontWeight:'bold'}}>
                {rowData.taskstatetitle}
              </div>
              <div>接收时间：<span>{rowData.sendtime}</span></div>
              <div>办理时间：<span>{rowData.bltime}</span></div>
              <div>办理机构：<span>{rowData.orgcommonname}</span></div>
            </div>
            <div className={'list_item_left'}>
              <span className={'list_item_left_icon'} >
                <Icon type="schedule" style={{fontSize:'3em'}} />
              </span>
            </div>
            <div className={'list_item_right'}>
              <div>{rowData.ownercommonname}</div>
              <div style={{marginTop:'0.9rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{rowData.nodename}</div>
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
          initialListSize={10}
          pageSize={10}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          useBodyScroll={true}
          scrollerOptions={{ scrollbars: true }}
        />
      </div>
    )
  }
}

CommonFlowTraceComp.defaultProps = {
};

CommonFlowTraceComp.propTypes = {
  tokenunid:React.PropTypes.string,
  docunid:React.PropTypes.string,
  gwlcunid:React.PropTypes.string,
  modulename:React.PropTypes.string,
};

export default CommonFlowTraceComp;
