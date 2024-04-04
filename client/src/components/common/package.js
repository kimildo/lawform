import React, { Component,Fragment } from 'react';
import ReactGA from 'react-ga';
import {Dialog,DialogTitle,DialogContent,DialogActions,Button } from '@material-ui/core';
import API from '../../utils/apiutil';
import User from '../../utils/user';


class Package extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputPackageCode:false,
            packageCode:""
        }
    }

    handleChange(e) {
        var value = e.target.value;
        var name = e.target.name;
        if( name === 'packagecode' ){
            this.setState({ packageCode: e.target.value.toUpperCase() });
        }
    }

    setPackage() {
        let userInfo = User.getInfo();
        if (!userInfo) {
            alert( "로그인 후 이용해주세요." );
            return false;
        }
        var packageCode = this.state.packageCode;
        var params = {
            code:packageCode
        }
        API.sendPost('/user/package/register',params).then(result=>{
            if( result.status === 'ok' ) {
                alert("코드등록이 완료되었습니다.");
                window.location.href = "/mydocument#package";
            } else {
                if( result.status === 'error' && result.reason==='code_used' )
                    alert("이미 사용된 제휴 코드 입니다. 문의가 있으시면 고객센터로 문의해주세요.")
                else if( result.status === 'error' && result.reason==='code_not_found' )
                    alert("유효하지 않은 제휴 코드 입니다. 문의가 있으시면 고객센터로 문의해주세요.")
                else if( result.status === 'error' && result.reason==='package_expired' )
                    alert("등록기한이 만료됐습니다.")

            }
        })
        this.setState({inputPackageCode:false});
    }

    render() {
        const userInfo = User.getInfo();
        return (
            <Fragment>
                { (!!this.props.children)?
                    <div style={{cursor:'pointer'}} onClick={()=> ( !userInfo )?window.location.href="#signin":this.setState({ inputPackageCode:true })}>{this.props.children}</div>
                    :
                <div id={!!this.props.id?this.props.id:undefined} className={this.props.className}>
                    <div onClick={()=> ( !userInfo )?window.location.href="#signin":this.setState({ inputPackageCode:true })}>#제휴코드입력</div>
                </div>
                }
            <Dialog
                open={this.state.inputPackageCode}
                onClose={(e)=> this.setState({inputPackageCode:false})}
                aria-labelledby="dialog-packagecode-title"
                aria-describedby="dialog-packagecode-description"
                className="dialog-packagecode"
                scroll="body"
                maxWidth="xs"
            >
                <DialogTitle className="title">제휴코드</DialogTitle>
                <DialogContent className="content">
                    <div>가지고 계신 제휴 코드를 입력해주세요.</div>
                    <input name="packagecode" type="text" placeholder="제휴코드를 입력하세요." value={this.state.packageCode} onChange={(e)=>this.handleChange(e)} />
                </DialogContent>
                <DialogActions className="buttons" >
                    <Button 
                        onClick={(e)=> this.setState({inputPackageCode:false})}
                        color="primary"
                        className="cancel">
                        취소
                    </Button>
                    <Button 
                        onClick={(e) => {
                            this.setPackage();
                        }}
                        color="primary"
                        className="ok">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
            </Fragment>
        );
    }
}

export default Package;
