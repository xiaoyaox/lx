import $ from 'jquery';
import React from 'react';
import moment from 'moment';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { Icon,notification,Table, Pagination} from 'antd';
import DocumentAddModalPC from './add_modal_pc.jsx';
import DocumentAddLawyerModalPC from './add_lawyer_modal_pc.jsx';

notification.config({
  top: 68,
  duration: 3
});

class DocumentListPC extends React.Component {
  constructor(props) {
      super(props);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  handleDeleteBatch() {
    const {selectedRowKeys} = this.state;
    const id = selectedRowKeys.join(',').toUpperCase();
    // console.log(id);
    this.props.showDeleteConfirm({key: id}, (res)=>{
      if (res) {
        this.setState({ selectedRowKeys: [] });
      }
    });
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const { data, currentFileType, currentFileSubType, departmentTypes, currentDepartment } = this.props;
    const columns = [{
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: '15%',
      }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: '15%',
      }, {
        title: currentFileSubType=="律师" ? '律所地址' : '地址',
        dataIndex: currentFileSubType=="律师" ? 'lawOfficeAddress' : 'createParty',
        key: currentFileSubType=="律师" ? 'lawOfficeAddress' : 'createParty',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: '20%',
        render: (text, record) => {
          return this.state.hasOperaPermission?(<span>
            <a href="javascript:;" onClick={this.props.handleShowModal.bind(this,record)}><Icon type="edit" /> 编辑</a>
            <span className="ant-divider" />
            <a href="javascript:;" onClick={this.props.showDeleteConfirm.bind(this,record)} className="error"><Icon type="delete" /> 删除</a>
          </span>):(<span>没有权限</span>);
        }
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const addModalField = { //新增档案的弹窗。
      memberInfo: {},
      currentFileType: currentFileType,
      currentFileSubType: currentFileSubType,
      departmentData:this.props.departmentData,
      currentDepartment: currentDepartment,
      // departmentTypes: departmentTypes,
      handleSearch: this.props.handleSearch.bind(this)
    }
    return (
      <div className="doc-search-list">
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
          {this.state.hasOperaPermission?
            (<span>
                <button type="button" className="btn btn-danger pull-right" disabled={!hasSelected} onClick={this.handleDeleteBatch.bind(this)}><Icon type="delete" /> 批量删除</button>
                {currentFileSubType == '律师' ?
                  <DocumentAddLawyerModalPC {...addModalField}>
                    <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                  </DocumentAddLawyerModalPC> :
                  <DocumentAddModalPC {...addModalField}>
                    <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                  </DocumentAddModalPC>
                }
              </span>):null
          }
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 10 }} scroll={{ y: 340 }} />
      </div>
    );
  }
}

DocumentListPC.defaultProps = {
};

DocumentListPC.propTypes = {
  // addressListData:React.PropTypes.array,
  // showAddEditDialog:React.PropTypes.func,
};

export default DocumentListPC;
