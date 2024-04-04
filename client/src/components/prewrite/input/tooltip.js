import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform';
//import '../../../scss/autoform/autoformmain.scss';
import User from '../../../utils/user';

class ToolTip extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }

    }

    handleClick(e) {
        let userInfo = User.getInfo();
        if (!userInfo) {
            // e.preventDefault();
            // return false;
        } else {

            window.$('.autoform_main_input').css({ paddingTop : 15, height: 'unset'  });
            if (this.props.activatedTooltip === this.props.uniqueKey) {
                this.props.setActivatedTooltip(''); // off
            }
            else
            {
                const Tip = async (t) => {
                    try {
                        // this.props.setActivatedTooltip(this.props.uniqueKey);
                        let target = window.$('#layer-payment-animation');
                        target.css({display:'block'}).addClass("animation").addClass("pay-bounce")
                        return target;
                    } catch(t) {
                      console.error("Problem", t)
                    }
                  }
                Tip(e.target).then((t)=>{
                    setTimeout(  function() {alert( "변호사의 작성 가이드와 함께 제공되는 법률 정보는 결제 후에 확인하실 수 있습니다." ) }, 100 );
                    setTimeout(  function() { t.removeClass("animation").removeClass("pay-bounce") }, 3000 );
                    // var tooltip = window.$( '.tooltip:visible' )[0];
                    // var offset = t.offsetTop;
                    // var height = tooltip.offsetHeight
                    // if( offset < height  ) {
                    //     var paddingTop = 38 + (height - offset) + 30;
                    //     var boxHeight = 195 + paddingTop - 38;
                    //     window.$('.autoform_main_input').css({ paddingTop : paddingTop ,  height: 'calc( 100vh - '+boxHeight+'px)'  });
                    // }
                });
            }
        }

    }

    render() {
        let uniqueKey = this.props.uniqueKey;
        let isActivated = this.props.activatedTooltip === uniqueKey;
        let tooltip_context_style = { display: isActivated ? "block" : "none" }
        let tooltip_icon_style = {};
        let tooltip_icon_class = {};
        let guidetooltip ;
        if (this.props.type === 'section') {
            tooltip_icon_style = isActivated ? section_tooltip_icon_style_activated : section_tooltip_icon_style_deactivated;
            tooltip_icon_class = 'section_tooltip';
            guidetooltip = undefined;
        }
        else { //field
            tooltip_icon_style = isActivated ? tooltip_icon_style_activated : tooltip_icon_style_deactivated;
            tooltip_icon_class = 'field_tooltip';
            guidetooltip = this.props.guidetooltip;
        }

        return (
            <div className="autoform_input_section_tooltip">
                {(!!this.props.exampletooltip || !!this.props.explaintooltip || !!guidetooltip) &&
                    <div>
                        <div className="wrap_tooltip" id={"tooltip_"+uniqueKey.replace("|","_")} >
                            <div style={tooltip_context_style} className="tooltip">
                                <div className="tooltip_x"  onClick={(e) => { this.handleClick(e) }}><img src="/autoform_img/x_btn_white.png" width="20" height="20" alt="x_btn" /></div>
                                <div dangerouslySetInnerHTML={{ __html: guidetooltip }}></div>
                                <div dangerouslySetInnerHTML={{ __html: this.props.exampletooltip }}></div>
                                <div dangerouslySetInnerHTML={{ __html: this.props.explaintooltip }}></div>
                            </div>
                        </div>
                        <div style={tooltip_icon_style} className={tooltip_icon_class} onClick={(e) => { this.handleClick(e) }} />
                    </div>
                }
            </div>
        )
    }
}

const tooltip_icon_style_activated = {
    background: " url(/autoform_img/field_tootip_hover.png) no-repeat"
}

const tooltip_icon_style_deactivated = {
    background: " url(/autoform_img/field_tooltip.png) no-repeat"
}

const section_tooltip_icon_style_activated = {
    background: " url(/autoform_img/normal.png) no-repeat cover",
    backgroundSize: "cover",
    width: "30px",
    height: "30px",
    cursor: "point"
}
const section_tooltip_icon_style_deactivated = {
    background: " url(/autoform_img/normal.png) no-repeat cover",
    backgroundSize: "cover",
    width: "30px",
    height: "30px",
    cursor: "point"
}

export default withAutoformContext(ToolTip);