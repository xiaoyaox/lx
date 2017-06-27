//发送- 按部门
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { SearchBar, Button, Accordion } from 'antd-mobile';
import { Icon } from 'antd';

class DS_DepartmentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  onClickSend = () => {
    this.props.backSendContentCall();
  }

  render() {
    const data = [{
      index:0,
      departmentName: "局领导",
      child:[
       { value: 0, label: '李喆' },
       { value: 1, label: '邓双红' },
       { value: 2, label: '赖涛生' }
     ]},{
       index:1,
       departmentName: "局领导",
       child:[
        { value: 3, label: '李喆' },
        { value: 4, label: '邓双红' },
        { value: 5, label: '赖涛生' }
      ]}
   ];
    return (
      <div style={{minHeight:"5rem"}}>
          <div className="flex-container">
            <div className="sub-title">
              <h5 className="pull-left">长沙市司法局</h5>
            </div>
            <div className="searchBar_custom">
              <SearchBar placeholder="搜索" />
            </div>
            <div className="accordion_custom">
              <Accordion defaultActiveKey="0" className="my-accordion">
                {data.map(i => (
                  <Accordion.Panel header={i.departmentName} key={'accordion_' + i.index}>
                    <div className="checkbox_list">
                      {i.child.map(j => (
                        <div key={j.value} className="checkbox_custom">
                          <input type="checkbox" id={j.value} className="checkbox" />
                          <label htmlFor={j.value}><span className="box"><i></i></span>{j.label}</label>
                        </div>
                      ))}
                    </div>
                  </Accordion.Panel>
                ))}
              </Accordion>
            </div>
            <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>
          </div>
      </div>
    )
  }
}

DS_DepartmentComp.defaultProps = {
};

DS_DepartmentComp.propTypes = {
};

export default DS_DepartmentComp;
