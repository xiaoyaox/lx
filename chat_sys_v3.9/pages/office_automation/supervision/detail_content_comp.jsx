import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon,Upload } from 'antd';
//督办管理的编辑详情内容
class DetailContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        historyNotionList:[],
        attachmentList:[],
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
        console.log("get 督办管理的历史阅文意见:",data.values.notions);
        this.setState({
          historyNotionList:data.values.notions,
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
        console.log("get 督办管理的附件列表:",data);
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
        <div key={index}><a href={downloadUrl} data-unid={item.unid}>{item.attachname}</a><br/></div>
      );
    });
  }

  render() {
    const {attachmentList} = this.state;
    const { getFieldProps } = this.props.form;
    const {detailInfo, formData, formDataRaw} = this.props;
    let items = formDataRaw.gwlc?formDataRaw.gwlc.items:[];
    //请示类别当前值就是gwlc字段的值。--公文流程。
    let owerPleaTypes = items.map((item)=>{ //请示类别。
      return {
        label:item.text,
        value:item.value
      }
    });
    let superviseTypes = [
      {
        label:"",
        value:""
      },{
        label:"督办A",
        value:"督办A"
      },{
        label:"督办B",
        value:"督办B"
      }
    ];
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局督办处理单</div>
          <WhiteSpace size='md' />
        <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }}>
                <Picker data={superviseTypes} cols={1}
                  {...getFieldProps('superviseType')}
                  value={formData.superviseType}
                  onOk={this.onPickerOk}>
                  <List.Item arrow="horizontal">督办类型：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('receiveFileNum', {initialValue:''})}
                editable={true}
                labelNumber={4}>收文号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem
                {...getFieldProps('receiveFileTime', {
                    initialValue:detailInfo.acceptDate
                  })
                }
                editable={true}
                labelNumber={5}>收文日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>来文单位：</div>
              <TextareaItem
                {...getFieldProps('sendFileUnit',{initialValue:detailInfo.sendUnit})}
                title=""
                autoHeight
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('deadlineTime', {initialValue:''})}
                editable={true}
                labelNumber={5}>截止日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('reminders', {initialValue:''})}
                editable={true}
                labelNumber={4}>催办：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>文件标题：</div>
              <TextareaItem
                {...getFieldProps('subjectTitle',{initialValue:detailInfo.title})}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
            <Flex>
              <Flex.Item>
                <form enctype="multipart/form-data" action="" method="post">
                    <input type="file" name="file" id="choosefile" style={{display:'inline-block'}}/>
                    <input type="submit" value="上传正文" id="submitBtn" style={{color:'black'}}/>
                </form>
              </Flex.Item>
            </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>正文列表：</div>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>

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
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>附件列表：{attachmentList.length<=0?(<span>无附件</span>):null}</div>
              { this.state.attachmentList.length>0?
                (this.getAttachmentListEle(this.state.attachmentList)):null
              }
            </Flex.Item>
          </Flex>

          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>拟办意见：</div>
              <TextareaItem
                {...getFieldProps('todoAdvice')}
                title=""
                rows={3}
                editable={false}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>领导意见：</div>
              <TextareaItem
                {...getFieldProps('leaderAdvice')}
                title=""
                rows={3}
                editable={false}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>办理情况：<span style={{color:'red'}}>(承办意见请上传在附件中)</span></div>
              <TextareaItem
                {...getFieldProps('reason')}
                title=""
                rows={3}
                editable={false}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{height:'1rem'}}/>
        </div>
      </div>
    )
  }
}

DetailContentCompRaw.defaultProps = {
};

DetailContentCompRaw.propTypes = {
};
const DetailContentComp = createForm()(DetailContentCompRaw);
export default DetailContentComp;
