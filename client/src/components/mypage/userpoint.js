import React, { Component } from 'react';
// import '../../scss/mypage/userpoint.scss';
import Paging from '../../components/common/paging';
import DatetimePicker, { setLocale } from 'react-datetimepicker-syaku';
import locale from 'flatpickr/dist/l10n/ko';
// import 'flatpickr/dist/flatpickr.min.css';
setLocale(locale.ko);

class Userpoint extends Component {
    constructor(props) {
        super(props);

        this.onDatetime = this.onDatetime.bind(this);

        this.state = {
            value: {
                datetime: [],
                value: '',
            }
        };
    }

    onDatetime(datetime, value, name) {
        this.setState({ [name]: { datetime, value } });
    }

    render() {
        const paging_wrap = {
            marginLeft: '40px',
            marginRight: '40px',

        }
        return (
            <div>
                <div className="wrap_userpoint">
                    <div className="mypoint">
                        나의 포인트
                </div>
                    <div className="point_detail">
                        <span className="point_num">16,300P</span>
                        <div className="charge_btn_wrap">
                            <img src="mypage_img/charge_btn.png" width="152" height="42" className="charge_btn" alt="charge_btn" />
                        </div>
                    </div>
                    <div className="section_out ">
                        <div className="section_in search_term"> 조회 기간</div>
                        <div className="section_in img_all_btn">
                            <img src="mypage_img/all_btn.png" className="all_btn" alt="all_btn" />
                        </div>
                        <div className="section_in">
                            <DatetimePicker onChange={(selectedDates) => { this.onDatetime(selectedDates, 'selectedDates'); }}
                                type="date" endDate={this.state.selectedDates2} defaultDate={this.state.selectedDates} className="input-group-sm" />
                        </div>
                        <div className="section_in point_term">
                            <span className="">~</span>
                        </div>
                        <div className="section_in">
                            <DatetimePicker onChange={(selectedDates) => { this.onDatetime(selectedDates, 'selectedDates'); }}
                                type="date" endDate={this.state.selectedDates2} defaultDate={this.state.selectedDates} className="input-group-sm" />
                        </div>
                    </div>
                    <div className="section_out">
                        <div className="section_in search_content"> 조회 내용</div>
                        <div className="section_in search_radio">
                            <input type="radio" id="c1" name="cc" className="cc" />
                            <label htmlFor="c1"><span>전체 포인트 </span></label>
                            <input type="radio" id="c2" name="cc" className="cc" />
                            <label htmlFor="c2"><span>적립 포인트 </span></label>
                            <input type="radio" id="c3" name="cc" className="cc" />
                            <label htmlFor="c3"><span>사용 포인트 </span></label>
                        </div>
                    </div>
                    <div className="section_out">
                        <div className="section_in sc_btn">
                            <img src="mypage_img/search_btn.png" alt="search_btn" />
                        </div>
                    </div>
                </div>

                <div className="wrap_userpoint_detail">
                    <table className="table">
                        <thead>
                            <tr className="point_row point_header">
                                <th className="point_table_cell header_1 middle">
                                    <span>날짜</span>
                                </th>
                                <th colSpan="2" className="point_table_cell header_2 middle colspan">
                                    <span>상세내역</span>
                                </th>
                                <th className="point_table_cell header_3 middle">
                                    <span>변동 포인트</span>
                                </th>
                                <th className="point_table_cell header_4 middle">
                                    <span>남은 포인트</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>
                            <tr className="point_row">
                                <td className="point_table_cell contents_1 point_middle">
                                    18.01.02
                            </td>
                                <td className="point_table_cell contents_2 point_middle">
                                    문서 구입
                            </td>
                                <td className="point_table_cell contents_3 point_middle">
                                    근로계약서 (일반 근로자용)
                            </td>
                                <td className="point_table_cell contents_4 point_middle">
                                    -2,400 P
                            </td>
                                <td className="point_table_cell contents_5 point_middle">
                                    16,300 P
                            </td>
                            </tr>


                        </tbody>
                    </table>
                    <div style={paging_wrap}>
                        <Paging></Paging>
                    </div>
                </div>
            </div>
        );
    }
}

export default Userpoint;
