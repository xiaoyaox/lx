import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import {Link} from 'react-router/es6';
import {  Icon, Table,notification } from 'antd';
import {Toast} from 'antd-mobile';
const urlPrefix = 'http://211.138.238.83:9000/CS_JrlService/';

notification.config({
  top: 68,
  duration: 3
});

class NoticeComp extends React.Component {
  constructor(props) {
      super(props);
      this.getBodyPages = this.getBodyPages.bind(this);
      this.state = {
        isMobile: Utils.isMobile(),
        currentIndex:1, //当前页的页码。
        listData:[]
      };
  }
  componentWillMount(){
      const data = [{
        key: '1',
        STitle:'年度报表上报',
        pubUnit: '长沙市司法局',
        pubTime:'2017-05-03 15:44:33'
      },
      {
        key: '2',
        STitle:'年度报表上报',
        pubUnit: '长沙市司法局',
        pubTime:'2017-05-03 15:44:33'
      },
      {
        key: '3',
        STitle:'年度报表上报',
        pubUnit: '长沙市司法局',
        pubTime:'2017-05-03 15:44:33'
      },
      {
        key: '4',
        STitle:'年度报表上报',
        pubUnit: '长沙市司法局',
        pubTime:'2017-05-03 15:44:33'
      }
    ];
  }
  componentWillReceiveProps(nextProps){
  }
  getBodyPages(){
    const columns = [
      {
        title: '标题',
        dataIndex: 'STitle',
        key: 'STitle',
        render: (text,record,index) => (<a href={record.contentUrl} target='_blank'>{text}</a>)
      },
      {
        title: '发布单位',
        dataIndex: 'pubUnit',
        key: 'pubUnit',
      },
      {
        title: '时间',
        dataIndex: 'pubTime',
        key: 'pubTime',
      },
      {
        title: '是否重要',
        key: 'isMajor',
        render: (text,record) => (
          <span style={{color:text?'green':'gray'}}>{text?"重要":"不重要"}</span>
        )
      }];
      let bodyMobilePages=(
        <div style={{width:'100%'}} className='noticeMobile'>
          <Table columns={columns} dataSource={this.props.noticeListData||[]} pagination={{ pageSize: 14 }}/>
        </div>
      );
      let bodyPCPages=(
        <div className='noticePC'>
          <Table columns={columns} dataSource={this.props.noticeListData||[]} pagination={{ pageSize: 14 }}/>
        </div>
      );
      return this.state.isMobile ? bodyMobilePages : bodyPCPages;
  }
  render() {
    let bodyPages=this.getBodyPages();
    return (
      <div>
        {bodyPages}
      </div>
    )
  }
}

NoticeComp.defaultProps = {
};

NoticeComp.propTypes = {
  // organId:React.PropTypes.number,
};

export default NoticeComp;
