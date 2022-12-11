import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import { Collapse, Space, Slider, InputNumber, Row, Col, Switch } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import iro from '@jaames/iro';
import Dreamweaver from './Dreamweaver';
import "./Dreamweaver.less";
import { network_SendPromise } from '../../common/network_api'
import { getUEFormatData_Call } from '../../common/ue_api'



const { Panel } = Collapse;

var a = 0;
var messageSingletonPattern = 0;

export default class Review extends Component {
    state = {
        fontSizeValue: 14,
        timelineValue: 0,
        myCanvasDisplay: false, 
    }
    componentDidMount() {
        a++; //首次加载会调用2次此方法，检测累加的变量a来避免这种情况
        if (a >= 2) {
            //订阅属性更新
            this.setTimeline = PubSub.subscribe("setTimeline", (_, timelineValue) => {
                this.setState({ timelineValue: timelineValue });
            })
            this.myDreamweaver = new Dreamweaver(document.getElementById('mycanvas'), document.getElementById('mybrush'));
            if (this.myDreamweaver) {
                this.myDreamweaver.setCanvasSize(this.props.width, this.props.height, this.props.left, this.props.top);
            }
            // 注册消息事件监听，接受子元素给的数据
            window.addEventListener('message', (e) => {
                if (e.data && e.data.name === "sendPicture" && messageSingletonPattern <= 0) {
                    messageSingletonPattern++;//单例
                    var backimage = new Image();
                    backimage.src = e.data.value;
                    backimage.onload = () => {
                        messageSingletonPattern = 0;
                        var canvas = document.createElement('canvas'),
                            ctx = canvas.getContext('2d');
                        canvas.width = document.getElementById('mycanvas').offsetWidth;
                        canvas.height = document.getElementById('mycanvas').offsetHeight;

                        ctx.drawImage(backimage, 0, 0);
                        ctx.drawImage(this.myDreamweaver.sendCanvas(), 0, 0);

                        //单独下载
                        // const el = document.createElement('a');
                        // el.setAttribute('download', "review");
                        // el.href = canvas.toDataURL("image/png");
                        // el.click();

                        network_SendPromise(getUEFormatData_Call(
                            "/Game/Maps/StartMap.StartMap:PersistentLevel.BP_Global_Setting",
                            "GetOutputPath",
                        )).then((res) => {
                            //放到指定目录里
                            network_SendPromise(getUEFormatData_Call(
                                "/Game/Maps/StartMap.StartMap:PersistentLevel.BP_In_Actor",
                                "IsInPathExists",
                                {
                                    "OutputDir": res.OutOutputPath,
                                }
                            )).then(async (result) => {
                                let { notification } = await import('antd');
                                if (false === result.ReturnValue) {
                                    network_SendPromise(getUEFormatData_Call(
                                        "/Game/Maps/StartMap.StartMap:PersistentLevel.BP_In_Actor",
                                        "ExportComment",
                                        {
                                            "OutputDir": res.OutOutputPath,
                                            "Comment": {
                                                [this.state.timelineValue]: canvas.toDataURL("image/png").split(",")[1]
                                            }
                                        }
                                    )).then((result) => {
                                        if (result.ReturnValue) {
                                            notification.open({
                                                placement: "topRight",
                                                message: "Success",
                                                description: "Successfully saved",
                                                duration: 1,
                                                className: "my_notification_success"
                                            });
                                        }
                                    }).catch((err) => {

                                    });
                                } else {
                                    notification.open({
                                        placement: "topRight",
                                        message: "Error",
                                        description: "Writing to " + "D:/OutputDir" + " is not allowed",
                                        duration: 2,
                                        className: "my_notification_error"
                                    });
                                }
                            }).catch((err) => {

                            });
                        })

                    }
                }
            }, false);
        }
    }
    componentDidUpdate() {
        if (this.myDreamweaver) {
            this.myDreamweaver.setCanvasSize(this.props.width, this.props.height, this.props.left);
        }
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.setTimeline);
    }

    /**
     * 改变字体大小
     */
    onChangeFontSize = (value) => {
        this.setState({ fontSizeValue: value }, function () {
            this.myDreamweaver.setSize(this.state.fontSizeValue);
        });
    }
    /**
     * 保存图片
     */
    save = () => {
        // var image = new Image();
        // image.src = this.myDreamweaver.sendCanvas().toDataURL("image/png");
        // var winRecord = window.open('about:blank', '_blank', 'top=500');
        // winRecord.document.open("text/html", "utf-8");
        // winRecord.document.write("<img src='" + image.src + "'></img>");
        // winRecord.document.execCommand("SaveAs", true, "23" + ".png");
        // winRecord.close();

        // const el = document.createElement('a');
        // el.setAttribute('download', "review");
        // el.href = image.src;
        // el.click();
        this.props.saveCanvas().contentWindow.postMessage('giveMePicture', '*');
    }
    render() {
        return (
            <div>
                <Collapse
                    defaultActiveKey={[0]}
                    //展开的时候生成画图工具
                    onChange={(e) => {
                        if (e[1]) { this.componentDidMount(); }
                    }}
                >
                    {/**画图 */}
                    <Panel header="Draw" key="1" forceRender={true} >
                        <canvas id="mycanvas" width={this.props.width - 2} height={this.props.height - 2} style={{display:this.state.myCanvasDisplay, left: this.props.left + "px", top: "64px", "border": "2px solid #94FC13", position: "fixed" }}></canvas>

                        <div id="mybrush" width="100%" style={{ paddingTop: "10px" }}>
                            <Space id="painter">
                                <button id="pen">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z" /></svg>
                                </button>
                                <button id="round">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z" /></svg>
                                </button>
                                <button id="square">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" /></svg>
                                </button>
                                <button id="arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="m18.787 9.473s-4.505-4.502-6.259-6.255c-.147-.146-.339-.22-.53-.22-.192 0-.384.074-.531.22-1.753 1.753-6.256 6.252-6.256 6.252-.147.147-.219.339-.217.532.001.19.075.38.221.525.292.293.766.295 1.056.004l4.977-4.976v14.692c0 .414.336.75.75.75.413 0 .75-.336.75-.75v-14.692l4.978 4.978c.289.29.762.287 1.055-.006.145-.145.219-.335.221-.525.002-.192-.07-.384-.215-.529z" /></svg>
                                </button>
                                <button id="rubber">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm.456-11.429l-4.528 4.528 5.658 5.659 4.527-4.53-5.657-5.657z" /></svg>
                                </button>
                                <button id="text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M22 0h-20v6h1.999c0-1.174.397-3 2.001-3h4v16.874c0 1.174-.825 2.126-2 2.126h-1v2h9.999v-2h-.999c-1.174 0-2-.952-2-2.126v-16.874h4c1.649 0 2.02 1.826 2.02 3h1.98v-6z" /></svg>
                                </button>
                            </Space>
                            <br />
                            <Space id="tool" style={{ paddingTop: "4px" }}>
                                <button id="open" onClick={ () =>{this.setState({myCanvasDisplay:"block"})}}>
                                    <LockOutlined />
                                </button>
                                <button id="close" onClick={ () =>{this.setState({myCanvasDisplay:"none"})}}>
                                    <UnlockOutlined />
                                </button>
                                <button id="undo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19.885 5.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.074.1 2.992 2.993 2.664 7.684-.188 10.319l3.314 3.5c4.716-4.226 5.257-12.223.267-17.213z" /></svg>
                                </button>
                                <button id="redo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M4.115 5.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.819-2.706-7.297-2.676-10.074.1-2.992 2.993-2.664 7.684.188 10.319l-3.314 3.5c-4.716-4.226-5.257-12.223-.267-17.213z" /></svg>
                                </button>
                                <button id="save" onClick={this.save}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z" /></svg>
                                </button>
                                <button id="delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 14.586l3.586-3.586 1.414 1.414-3.586 3.586 3.586 3.586-1.414 1.414-3.586-3.586-3.586 3.586-1.414-1.414 3.586-3.586-3.586-3.586 1.414-1.414 3.586 3.586zm-7 6.414h-12v-2h12v2zm0-4.024h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-4h-24v-2h24v2z" /></svg>
                                </button>
                            </Space>
                            <br />
                            <Row>
                                <Col span={7}><font style={{ verticalAlign: "-20%", fontSize: "14px" }}>brush size</font></Col>
                                <Col span={11}>
                                    <Slider
                                        min={1}
                                        max={99}
                                        onChange={this.onChangeFontSize}
                                        value={typeof this.state.fontSizeValue === 'number' ? this.state.fontSizeValue : 0}
                                    />
                                </Col>
                                <Col span={6}>
                                    <InputNumber
                                        style={{ width: "70%", verticalAlign: "-20%" }}
                                        min={1}
                                        max={99}
                                        value={this.state.fontSizeValue}
                                        onChange={this.onChangeFontSize}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}><font style={{ verticalAlign: "-20%", fontSize: "14px" }}>brush color</font></Col>
                                <Col span={17}>
                                    <canvas id="colorBar" width="180px" height="20px" style={{ paddingTop: "2%" }}></canvas>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}