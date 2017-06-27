import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon,Upload } from 'antd';

class AddContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        tabName:"content",
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
  }
  beforeUploadCall(file) {
    // console.log('file beforeUploadCall :',file);
    let fileNameSplit = file.name.split('.');
    if(fileNameSplit[fileNameSplit.length-1] != "xlsx" && fileNameSplit[fileNameSplit.length-1] != "xls"){
      // this.props.openNotification('info', '只能上传excel文档');
      return false;
    }
    return true;
  }
  fileUploadChange(obj) {
    // console.log('file upload change', obj);
    if(obj.file.status == "done" && obj.file.response == "success"){
      // this.props.openNotification('success', '档案导入成功');
      this.props.handleSearch();
    } else if (obj.file.status == "error") {
      // this.props.openNotification('error', '档案导入失败');
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
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
    const uploadField = {
      name: 'file',
      action: '',
      headers:myWebClient.defaultHeaders,
      showUploadList:false,
      accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      beforeUpload: this.beforeUploadCall,
      onChange: this.fileUploadChange
    }
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局督办处理单</div>
          <WhiteSpace size='md' />
        <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }}>
                <Picker data={superviseTypes} cols={1} {...getFieldProps('superviseType')} onOk={this.onPickerOk}>
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
                placeholder={'请输入...'}
                labelNumber={4}>收文号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('receiveFileTime', {initialValue:''})}
                editable={true}
                placeholder={'请输入...'}
                labelNumber={5}>收文日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>来文单位：</div>
              <TextareaItem
                {...getFieldProps('sendFileUnit')}
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
                placeholder={'请输入...'}
                labelNumber={5}>截止日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('reminders', {initialValue:''})}
                editable={true}
                placeholder={'请输入...'}
                labelNumber={4}>催办：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>文件标题：</div>
              <TextareaItem
                placeholder={'请输入...'}
                {...getFieldProps('subjectTitle')}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <Upload {...uploadField} className={'uploadContainer'} style={{width:'80%',margin:'0 auto'}}>
               <Button>
                 <Icon type="upload" /> 上传正文
               </Button>
              </Upload>
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
              <Upload {...uploadField} className={'uploadContainer'} style={{width:'80%',margin:'0 auto'}}>
               <Button>
                 <Icon type="upload" /> 上传附件
               </Button>
              </Upload>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>附件列表：</div>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={5}>拟办意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value="--" editable={false} labelNumber={5}>领导意见：</InputItem></Flex.Item>
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

AddContentCompRaw.defaultProps = {
};

AddContentCompRaw.propTypes = {
};
const AddContentComp = createForm()(AddContentCompRaw);
export default AddContentComp;
