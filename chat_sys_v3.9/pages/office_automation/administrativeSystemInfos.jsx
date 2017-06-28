//司法行政系统信息查询
import $ from 'jquery';
import React from 'react';

class AdministrativeSystemInfos extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  componentDidMount(){
  }

  setIframeHeight = ()=>{
    var ifm= document.getElementById("AdministrativeSystemInfos_frame");
    ifm.width =  document.documentElement.clientWidth;
    if(ifm.width<1000){
      ifm.width = 1000;
    }
    ifm.height =  document.documentElement.clientHeight;
  }

  render() {
    return (
      <div>
        <iframe
          src="http://www.rufa.gov.cn"
          frameBorder="0"
          scrolling="auto"
          id="AdministrativeSystemInfos_frame"
          onLoad={()=>this.setIframeHeight()}></iframe>
      </div>
    )
  }
}

AdministrativeSystemInfos.defaultProps = {
};

AdministrativeSystemInfos.propTypes = {
  title:React.PropTypes.string,
};

export default AdministrativeSystemInfos;
