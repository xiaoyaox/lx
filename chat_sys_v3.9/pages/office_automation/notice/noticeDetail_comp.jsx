//通知公告的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,DatePicker,List} from 'antd-mobile';

import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';


const zhNow = moment().locale('zh-cn').utcOffset(8);
class Notice_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        validValue:zhNow,
        customAttachmentList:[], //自定义附件列表
      };
  }
  componentWillMount(){
    this.getFormCustomAttachmentList();
  }
  getFormCustomAttachmentList = ()=>{
    OAUtils.getFormCustomAttachmentList({
      tokenunid: this.props.tokenunid,
      moduleName:"信息发布",
      docunid:this.props.detailInfo.unid,
      successCall: (data)=>{
        console.log("get 通知公告的自定义附件列表 data:",data);
        this.setState({
          customAttachmentList:data.values.filelist,
        });
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.props.backToTableListCall();
    //setTimeout(()=>this.props.backToTableListCall(),1000);
  }

  onpublicValueChange = (publicValue) => {
    this.setState({
      publicValue,
    });
  }
  onvalidValueChange = (validValue) => {
    this.setState({
      validValue,
    });
  }


  render() {
    let {detailInfo} = this.props;
    let customAttachment = this.state.customAttachmentList.map((item,index)=>{
      let downloadUrl = OAUtils.getCustomAttachmentUrl({
        moduleName:"信息发布",
        fileunid:item.unid
      });
      return (
        <div key={index} style={{margin:'0.1rem auto', width:'90%'}}>
          <a type="button" className="btn btn-info"
          style={{ marginLeft: '20px',width:'100%' }}
          href={downloadUrl}>{item.attachname}</a>
        </div>
      );
    });

    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          信息详情
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <div className={'oa_detail_cnt'}>
            <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>

                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onpublicValueChange}
                        value={moment(detailInfo.publishTime)}
                      >
                      <List.Item arrow="horizontal">发布日期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div className="select_container">
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onvalidValueChange}
                        value={this.state.validValue}
                      >
                      <List.Item arrow="horizontal">有效期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item><InputItem
                    editable={false}
                    labelNumber={2}
                    value={detailInfo.fileTitle}
                    placeholder="标题">标题</InputItem></Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    {customAttachment}
                    <List renderHeader={() => '内容'}>
                         <TextareaItem
                           editable={false}
                           rows={8}
                         />
                     </List>
                  </Flex.Item>
                </Flex>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

Notice_DetailComp.defaultProps = {
};

Notice_DetailComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Notice_DetailComp;
