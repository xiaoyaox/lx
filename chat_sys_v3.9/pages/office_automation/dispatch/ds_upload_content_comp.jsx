//发文详情页-- 上传附件
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import { Upload, message, Button, Icon } from 'antd';

class DS_UploadContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    }
    return (
      <div style={{minHeight:"5rem",padding:"0.2rem"}}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传附件
          </Button>
        </Upload>
      </div>
    )
  }
}

DS_UploadContentComp.defaultProps = {
};

DS_UploadContentComp.propTypes = {
  detailInfo:React.PropTypes.object,
  afterChangeTabCall:React.PropTypes.func,
};



export default DS_UploadContentComp;
