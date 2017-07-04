import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import UserStore from 'stores/user_store.jsx';
import { WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem, Flex, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
import CommonFlowTraceComp from '../common_flowTrace_comp.jsx';//办文跟踪

class DS_DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        flow: [{label: '发文',value: '发文'},{label: '司法局发文流程',value: '司法局发文流程'}],
        historyNotionType2List:[],
        attachmentList:[],  //附件列表
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
    if(this.props.detailInfo && this.props.detailInfo.unid){
      this.getFormVerifyNotion();
      this.getFormAttachmentList();
    }
  }
  getFormVerifyNotion = ()=>{ //获取历史阅文意见数据。
    OAUtils.getFormVerifyNotion({
      tokenunid:this.props.tokenunid,
      docunid:this.props.detailInfo.unid,
      successCall: (data)=>{
        console.log("get 发文管理的历史阅文意见:",data.values.notions);
        this.setState({
          historyNotionType2List:OAUtils.parseHistoryNotionList(data.values.notions || []),
        });
      },
      errorCall:(res)=>{
        //TODO
      }
    });
  }
  getFormAttachmentList = ()=>{
    OAUtils.getFormAttachmentList({
      tokenunid:this.props.tokenunid,
      docunid:this.props.detailInfo.unid,
      moduleName:this.props.moduleNameCn,
      successCall: (data)=>{
        console.log("get 发文管理的附件列表:",data);
        this.setState({
          attachmentList:data.values.filelist || [],
        });
      }
    });
  }
  getAttachmentListEle = (attachmentList)=>{
    return attachmentList.map((item,index)=>{
      let downloadUrl = OAUtils.getAttachmentUrl({
        fileunid:item.unid,
        moduleName:this.props.moduleNameCn
      });
      return (
        <div key={index} style={{marginLeft:'0.3rem'}}><a href={downloadUrl} data-unid={item.unid}>{item.attachname}</a><br/></div>
      );
    });
  }
  render() {
    const {attachmentList} = this.state;
    const { detailInfo, formData, formDataRaw , tokenunid, modulename } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const secrecy = [{label: '秘密',value: '秘密'},{label: '机密',value: '机密'}];
    const urgency = [{label: '急',value: '急'},{label: '紧急',value: '紧急'},{label: '特急',value: '特急'},{label: '特提',value: '特提'}];
    return (
      <div style={{marginBottom: "100px"}}>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{detailInfo.fileTitle}</div>
          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={2}>文号</InputItem></Flex.Item>
            <Flex.Item><InputItem placeholder="--" labelNumber={2} type="Number">份数</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecy} cols={1}
                  {...getFieldProps('secrecy',{
                    initialValue:detailInfo.secrecy || "",
                  })}>
                  <List.Item arrow="horizontal">密级</List.Item>
                </Picker>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className="select_container">
                <Picker data={urgency} cols={1} {...getFieldProps('urgency')}>
                  <List.Item arrow="horizontal">缓急</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>标题：</div>
              <TextareaItem
                {...getFieldProps('subjectTitle',{
                  initialValue: detailInfo.fileTitle,
                })}
                title=""
                rows={3}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem placeholder="--" labelNumber={2}>主送</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={2}>抄送</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={this.state.flow} cols={1} {...getFieldProps('flow')}>
                  <List.Item arrow="horizontal">公文流程</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>

          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginTop:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <form enctype="multipart/form-data" action="" method="post">
                  <input type="file" name="file" id="choosefile" style={{display:'inline-block'}}/>
                  <input type="submit" value="上传附件" id="submitBtn" style={{color:'black'}}/>
              </form>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.3rem',color:'black'}}>附件列表：{attachmentList.length<=0?(<span>无附件</span>):null}</div>
              { this.state.attachmentList.length>0?
                (this.getAttachmentListEle(this.state.attachmentList)):null
              }
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={4}>领导签发</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>传批意见</div>
              <div className="textarea_container">
                <CommonNotionComp
                  notionList={this.state.historyNotionType2List['传批意见'] || []} />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <div className={'detail_textarea_title'}>局长审核意见</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['局长审核意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <div className={'detail_textarea_title'}>分管领导意见</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['分管领导意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>处室负责人意见</div>
              <CommonNotionComp
                notionList={this.state.historyNotionType2List['部门意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <div className={'detail_textarea_title'}>核稿</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['部门意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={detailInfo.draftUnit} labelNumber={4}>拟稿单位</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={4} value={formData.ngr_show}>拟稿人</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" editable="fasle" value={formData.ngrq_show}>日期</InputItem></Flex.Item>
          </Flex>
          <div style={{height:'0.5rem',width:'100%',margin:'1em 0',background:'#efe9e9'}}></div>
          <div style={{height:'2.5em',lineHeight:'2.5em',marginLeft:'0.2rem',borderBottom:'1px solid #d6d1d1'}}>
            <span style={{width:'0.1rem',height:'1em',lineHeight:'2.5em',verticalAlign: 'middle',background:'red',display:'inline-block'}}></span>
            <span style={{marginLeft:'0.2rem',color:'black',fontWeight:'bold'}}>办公追踪-流转记录</span>
          </div>
          <CommonFlowTraceComp
            tokenunid={tokenunid}
            docunid={detailInfo.unid}
            gwlcunid={formData.gwlc}
            modulename={modulename}
            />
        </div>
      </div>
    )
  }
}

DS_DetailContentComp.defaultProps = {
};

DS_DetailContentComp.propTypes = {
};



export default createForm()(DS_DetailContentComp);
