
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button,Flex,List,Switch} from 'antd-mobile';
import { createForm } from 'rc-form';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
//import { district, provinceLite as province } from 'antd-mobile-demo-data';
import * as GlobalActions from 'actions/global_actions.jsx';

const zhNow = moment().locale('zh-cn').utcOffset(8);
class Notice_SendShareComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        date: zhNow,
      };
  }
  componentWillMount(){
  }
  render() {
    const { getFieldProps } = this.props.form;
    const sendShareData = [
        { value: 0, label: '局领导' },
        { value: 1, label: '办公室' },
        { value: 2, label: '戒毒工作管理处' },
        { value: 3, label: '监狱工作管理处' },
        { value: 4, label: '法制宣传处' },
        { value: 5, label: '律师工作管理处' },
        { value: 6, label: '公证工作管理处' },
        { value: 7, label: '基层工作处' },
      ];

    const detailInfo = {};
    return (

        <div style={{marginTop:'60px'}}>
          <div className={'oa_detail_cnt'}>
            <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
                <Flex>
                  <Flex.Item>
                      {sendShareData.map(i => (
                        <List.Item key={i.value}
                        extra={<Switch
                            {...getFieldProps(`Switch${i.value}`, {
                              initialValue: false,
                              valuePropName: 'checked',
                            })}
                          onClick={(checked) => { console.log(checked); }}
                        />}>
                          {i.label}
                        </List.Item>
                       ))}
                  </Flex.Item>
                </Flex>
                <Button type="primary" style={{margin:'0 auto',marginTop:'0.1rem',width:'90%'}}
                ><Icon type="save" />保存</Button>
            </div>
          </div>
        </div>
    )
  }
}

Notice_SendShareComp.defaultProps = {
};

Notice_SendShareComp.propTypes = {
  afterChangeTabCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default createForm()(Notice_SendShareComp);
