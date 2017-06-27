import $ from 'jquery';
import React from 'react';
import { ListView, List,NavBar} from 'antd-mobile';
import { Icon} from 'antd';
import CommonFlowTraceComp from '../common_flowTrace_comp.jsx';

//签报管理的办文跟踪组件。
class SignReportFlowTraceComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }
  componentWillMount(){
  }
  onNavBarLeftClick = (e) => {
    this.props.backDetailCall();
  }
  render() {

    return (
      <div>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          办文跟踪
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <CommonFlowTraceComp
            tokenunid={this.props.tokenunid}
            docunid={this.props.docunid}
            gwlcunid={this.props.gwlcunid}
            modulename={this.props.modulename}
            />
        </div>
      </div>
    )
  }
}

SignReportFlowTraceComp.defaultProps = {
};

SignReportFlowTraceComp.propTypes = {
  backDetailCall:React.PropTypes.func,
};

export default SignReportFlowTraceComp;
