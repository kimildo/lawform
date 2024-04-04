import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform';
//import '../../../scss/autoform/autoformmain.scss';
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

class ToolTip extends Component {

    handleClick(e) {
        window.$('.autoform_main_input').removeAttr('style');
        if (this.props.activatedTooltip === this.props.uniqueKey) {
            this.props.setActivatedTooltip(''); // off
        }
        else
        {
            const Tip = async (t) => {
                try {
                    this.props.setActivatedTooltip(this.props.uniqueKey);
                    return t;
                } catch(t) {
                  console.error("Problem", t)
                }
              }
            Tip(e.target).then((t)=>{
                var tooltip = window.$( '.tooltip:visible' )[0];
                var offset = t.offsetTop;
                var height = tooltip.offsetHeight
                var width = window.screen.width;
                if( offset < height  ) {
                    var paddingTop = 38 + 50 + (height - offset) + 30;
                    var boxHeight = 195  + paddingTop - 38;
                    if( width >= 1024 ) {
                        window.$('.autoform_main_input').css({ paddingTop : paddingTop ,  height: 'calc( 100vh - '+boxHeight+'px)'  });
                    } else {
                        window.$('.autoform_main_input').css({ paddingTop : paddingTop  });
                    }

                } 
            });
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