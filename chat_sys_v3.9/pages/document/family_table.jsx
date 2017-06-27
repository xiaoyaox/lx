import React from 'react';
import superagent from 'superagent';
import UserStore from 'stores/user_store.jsx';
import { Table, Input, Popconfirm, Button, notification } from 'antd';

import MyWebClient from 'client/my_web_client.jsx';

class EditableCell extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        value: this.props.value,
        editable: this.props.editable || false,

      }
    }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  render() {
    const { value, editable } = this.state;
    // console.log(editable);
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value ? value.toString() : ' '}
            </div>
        }
      </div>
    );
  }
}

class EditableFamilyTable extends React.Component {
  constructor(props) {
    super(props);
    let permissionData = UserStore.getPermissionData();
    let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
    this.state = {
      data: [],
      hasOperaPermission:hasOperaPermission, //是否有操作权限。
      count: 0
    }
    this.columns = [{
        title: '称谓',
        dataIndex: 'callName',
        key: 'callName',
        width: '15%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'callName', text),
      },{
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: '15%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'userName', text),
      }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: '10%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'age', text),
      }, {
        title: '政治面貌',
        dataIndex: 'politicalStatus',
        key: 'politicalStatus',
        width: '20%',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'politicalStatus', text),
      }, {
        title: '工作单位及职位',
        dataIndex: 'departmentAndResponsibility',
        key: 'departmentAndResponsibility',
        render: (text, record, index) => this.renderColumns(this.state.data, index, 'departmentAndResponsibility', text),
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
          const { editable } = this.state.data[index].userName;
          return this.state.hasOperaPermission?
          (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                    <a onClick={() => this.editDone(index, 'save')}>保存</a>
                    <span className="ant-divider" />
                    <Popconfirm title="确定取消吗 ?" onConfirm={() => this.editDone(index, 'cancel')}>
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                  :
                  <span>
                    <a onClick={() => this.edit(index)}>编辑</a>
                    <span className="ant-divider" />
                      <Popconfirm title="确定删除吗 ?" onConfirm={() => this.delete(index)}>
                        <a className="error">删除</a>
                      </Popconfirm>
                  </span>
              }
            </div>
          ):(<span>没有权限</span>);
        },
    }];

  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      count: nextProps.data.length
    })
  }
  renderColumns(data, index, key, text) {
    // console.log("renderColumns------", data);
    const { editable, status } = data[index][key];
    // console.log(editable);
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
    />);
  }
  handleChange(key, index, value) {
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
  }
  edit(index) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({ data });
  }
  editDone(index, type) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false;
        data[index][item].status = type;
      }
    });
    this.setState({ data }, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
        }
      });
      // this.props.setFamilyData(data);
      this.handleOperate(index, type);
    });

  }
  delete(index) {
    // console.log(index);
    const data = [...this.state.data];
    if (this.props.operate == 'edit' && data[index].id) {
      this.handleDeleteFamilyMember(data[index].id.value);
    }
    data.splice(index, 1);
    // console.log(data);
    this.setState({ data: data });
    this.props.setFamilyData(data);
  }
  handleAdd() {
    const { data, count } = this.state;
    console.log(count);
    const newData = {
      key: count,
      callName: {
        editable: true,
        value: '',
      },
      userName: {
        editable: true,
        value: '',
      },
      age: {
        editable: true,
        value: '',
      },
      politicalStatus: {
        editable: true,
        value: '',
      },
      departmentAndResponsibility: {
        editable: true,
        value: '',
      },
    };
    data.push(newData)
    this.setState({
      data: data,
      count: count + 1
    });
  }
  handleOperate(index, type) {
    const { data } = this.state;
    const member = this.getNormalFamily(data[index]);
    // console.log(data[index]);
    if (type == 'save') {
      if (data[index].id) {
        console.log('Save edit -------');
        // member.id , member.fileInfoId
        if (this.props.operate == 'edit') {
          this.handleEditFamilyMember(member);
        }
      } else {
        console.log('Save add -------');
        if (this.props.operate == 'edit') {
          this.handleAddFamilyMember(member);
        }

      }
    } else if (type == 'cancel') {
      if (data[index].id) {
        console.log('Cancel edit -------');
      } else {
        console.log('Cancel add -------');
        this.delete(index);
      }
    }
  }
  handleAddFamilyMember(param) {
    let _this = this;
    const {memberInfo} = this.props;
    param.fileInfoId = memberInfo.id;
    MyWebClient.createFileFamilyMember(param,
      (data, res) => {
        if (res && res.ok) {
          console.log(res.text);
          if (res.text === 'true') {
            _this.openNotification('success', '添加家庭成员成功');
            _this.props.handleGetFamilyMembers(memberInfo.id);
          } else {
            _this.openNotification('error', '添加家庭成员失败');
          }
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '添加家庭成员失败');
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  handleEditFamilyMember(param) {
    let _this = this;
    const {memberInfo} = this.props;
    MyWebClient.updateFileFamilyMember(param,
      (data, res) => {
        if (res && res.ok) {
          console.log(res.text);
          if (res.text === 'true') {
            _this.openNotification('success', '编辑家庭成员成功');
            _this.props.handleGetFamilyMembers(memberInfo.id);
          } else {
            _this.openNotification('error', '编辑家庭成员失败');
          }
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '编辑家庭成员失败');
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  handleDeleteFamilyMember(id) {
    let _this = this;
    const {memberInfo} = this.props;
    MyWebClient.deleteFileFamilyMember(id.toUpperCase(),
      (data, res) => {
        if (res && res.ok) {
          console.log(res.text);
          if (res.text === 'true') {
            _this.openNotification('success', '家庭成员删除成功');
            _this.props.handleGetFamilyMembers(memberInfo.id);
          } else {
            _this.openNotification('error', '家庭成员删除失败');
          }
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '家庭成员删除失败');
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  openNotification(type, message) {
    notification.config({
      top: 68,
      duration: 3
    });
    notification[type]({
      message: message,
      // description: ''
    });
  }
  getNormalFamily(member) {
    const obj = {};
    Object.keys(member).forEach((key) => {
      if (key !== 'key') {
        obj[key] = member[key].value;
      }
    });
    return obj;
  }
  render() {
    const { data } = this.state;
    // console.log(data);
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    // console.log(dataSource);
    const columns = this.columns;
    return (
      <div>
        <Button className="editable-add-btn pull-right" style={{marginBottom: "5px"}} onClick={this.handleAdd.bind(this)}>添加</Button>
        <Table dataSource={dataSource} columns={columns} size="small" style={{float: "left", width: "100%"}} scroll={{ x: 800 }} />
      </div>
    )
  }
}

export default EditableFamilyTable;
