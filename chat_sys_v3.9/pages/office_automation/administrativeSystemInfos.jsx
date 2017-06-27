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

  render() {
    return (
      <div>
        <iframe 
          src="backtop.html"
          frameborder="0"
          scrolling="no"
          id="external-frame"
          onload="setIframeHeight(this)"></iframe>
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
