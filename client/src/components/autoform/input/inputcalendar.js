import React, { Component } from 'react';
import { withAutoformContext } from '../../../contexts/autoform'
//import '../../../scss/autoform/autoformmain.scss';
// import 'flatpickr/dist/flatpickr.min.css';
import DatetimePicker, { setLocale, parseDate } from '../../../utils/datetimepicker/DatetimePicker';
import CommonUtil from '../../../utils/commonutil';
import locale from 'flatpickr/dist/l10n/ko';

setLocale(locale.ko);

class InputCalendar extends Component {

    onDatetime = (datetime, name) => {
        let modifiedData = {};
        let orgin = name+"_origin";
        let calendar = datetime[0].getFullYear() + ("00" + (datetime[0].getMonth() + 1)).slice(-2) + ("00" + datetime[0].getDate()).slice(-2);        
        modifiedData[name] = CommonUtil.dateTimeToYYMMDD(datetime[0], 'dot');
        modifiedData[orgin] = calendar;
        this.props.setBindData(modifiedData);
    }

    componentWillUnmount() {
        let modifiedData = {};
        modifiedData[this.props.bindingId] = '';
        this.props.setBindData(modifiedData);
    }

    render() {    
        let styleLeftText = { display: 'none' };
        let styleRightText = { display: 'none' };
        let bindCalendar = this.props.bindData[this.props.bindingId+"_origin"]+'';
        if(bindCalendar !== "undefined"){
        }
        if (!!this.props.immovableLeftText) {
            styleLeftText = { borderRadius: "4px 0 0 4px" }
        }
        if (!!this.props.immovableRightText) {
            styleRightText = { borderRadius: "0 4px 4px 0" }
        }
        return (
            <div className="autoform_inputsection_calendar">
                <div style={styleLeftText} className="calendar_immovableLeftText">{this.props.immovableLeftText}</div>
                {bindCalendar !== "undefined" &&
                <DatetimePicker className="wrap_calender" 
                                name={this.props.bindingId} 
                                onChange={(selectedDates) => { this.onDatetime(selectedDates, this.props.bindingId); }}
                                type="date"
                                readOnly={true} 
                                defaultDate = {[parseDate(bindCalendar, 'Ymd')]}
                                placeholder={this.props.placeholder}
                />
                }
               {bindCalendar === "undefined" &&
                <DatetimePicker className="wrap_calender" 
                                name={this.props.bindingId} 
                                onChange={(selectedDates) => { this.onDatetime(selectedDates, this.props.bindingId); }}
                                type="date"
                                readOnly={true}
                                placeholder={this.props.placeholder}
                />
                }
                
                <div style={styleRightText} className="calendar_immovableRightText">{this.props.immovableRightText}</div>
            </div>
        )
    }
}

export default withAutoformContext(InputCalendar);