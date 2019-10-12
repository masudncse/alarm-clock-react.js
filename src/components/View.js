import React, {Component, Fragment} from "react";
import './View.css';
import _ from "lodash";
import moment from "moment";

export default class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: {
                title: "",
                time: moment().format('HH:mm'),
                status: false
            },
            times: [
                {
                    title: "Wake Up",
                    time: "05:30",
                    status: true
                },
                {
                    title: "Morning Walk",
                    time: "06:00",
                    status: true
                }
            ],
            alarmItemIndex: null
        };

        this.title = React.createRef();
        this.time = React.createRef();
    }

    handleSubmit(e) {
        e.preventDefault();
        if (_.isEmpty(this.state.time.title) || _.isEmpty(this.state.time.time)) {
            return window.alert("Field doesn't empty!!");
        }

        let times = this.state.times;
        times.push({...this.state.time});

        this.setState({times}, () => {
            this.clearForm();
            this.compareSort();
            window.$('#exampleModal').modal('toggle');
        });
    }

    handleChange(e) {
        let time = this.state.time;
        time.title = this.title.current.value;
        time.time = this.time.current.value;
        this.setState({time});
    };

    handleChangeRadio(e) {
        let time = this.state.time;
        time.status = JSON.parse(e.target.value);
        this.setState({time});
    }

    handleUpdateTimeStatus(key, e) {
        let times = this.state.times;
        times.map((time, index) => {
            if (index === key) {
                time.status = e.target.checked;
            }
        });
        this.setState({times});
    }

    clearForm() {
        let time = this.state.time;
        time.title = "";
        time.time = moment().format("HH:mm");
        time.status = false;
        this.setState({time});
    }

    compareSort() {
        let times = this.state.times.sort((a, b) => {
            if (a.time < b.time) {
                return -1;
            }
            if (a.time > b.time) {
                return 1;
            }
            return 0
        });
        this.setState({times});
    }

    timeConvert24TO12 = (time) => {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[5] = +time[0] < 12 ? ' AM' : ' PM';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    };

    playSound = () => {
        const alarmSound = document.getElementById("alarmSound");
        alarmSound.play();
    };

    pauseSound = () => {
        const alarmSound = document.getElementById("alarmSound");
        alarmSound.pause();
    };

    componentDidMount() {
        this.compareSort();

        setInterval(() => {
            let newTime = moment().format("HH") + ":" + moment().format("mm");

            this.state.times.map((time, key) => {
                let oldTime = time.time;
                if (newTime === oldTime && time.status === true) {
                    this.playSound();
                    this.setState({
                        alarmItemIndex: key
                    });
                } else {
                    this.setState({
                        alarmItemIndex: null
                    });
                }
            })
        }, 1000);
    }

    render() {
        return (
            <Fragment>
                <audio id="alarmSound">
                    <source src="/alarm-sound.wav" type="audio/ogg"/>
                    <source src="/alarm-sound.wav" type="audio/mpeg"/>
                </audio>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4 mt-5">
                            <h2 id="title" className="text-left">ALARM CLOCK <button
                                className="btn btn-success float-right" data-toggle="modal" data-target="#exampleModal">
                                <i className="fa fa-plus-square"/></button></h2>
                            <ul id="list">
                                {this.state.times.map((time, key) => <li key={key}
                                                                         className={(this.state.alarmItemIndex === key) ? "animated flash infinite" : ''}>
                                    <strong>{time.title}</strong>
                                    <h2>{this.timeConvert24TO12(time.time)}</h2>
                                    <div className="slideTwo">
                                        <input type="checkbox"
                                               id="slideTwo"
                                               className="float-right"
                                               value={time.status}
                                               checked={time.status === true}
                                               onChange={this.handleUpdateTimeStatus.bind(this, key)}/>
                                        <label htmlFor="slideTwo"/>
                                    </div>
                                </li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="exampleModal" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Schedule</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <input type="text" className="form-control" autoFocus={true}
                                               placeholder="Enter something..." ref={this.title}
                                               onChange={this.handleChange.bind(this)}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="time" className="form-control" ref={this.time}
                                               value={this.state.time.time}
                                               onChange={this.handleChange.bind(this)}/>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status"
                                                   value={true} checked={this.state.time.status === true}
                                                   onChange={this.handleChangeRadio.bind(this)}/>
                                            <label className="form-check-label">ON</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status"
                                                   value={false} checked={this.state.time.status === false}
                                                   onChange={this.handleChangeRadio.bind(this)}/>
                                            <label className="form-check-label">OFF</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}