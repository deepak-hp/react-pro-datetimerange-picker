import React from 'react';
import '../style/DateTimeRange.css';
import { Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { generateHours, generateMinutes } from '../utils/TimeFunctionUtils';
import {addFocusStyle, darkTheme, lightTheme} from '../utils/StyleUtils';
import upArrow from "../svg/upArrow.svg"
import downArrow from "../svg/downArrow.svg"

class TimeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hourFocus: false,
      minuteFocus: false,
    };
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleMeridiemChange = this.handleMeridiemChange.bind(this);
    this.hourFocus = this.hourFocus.bind(this);
    this.minuteFocus = this.minuteFocus.bind(this);
    this.hourBlur = this.hourBlur.bind(this);
    this.minuteBlur = this.minuteBlur.bind(this);
  }

  generateHourSelectValues() {
    let selectValues = [];
    for (let i = this.props.twelveHoursClock ? 1 : 0; i <= (this.props.twelveHoursClock ? 12 : 23); i++) {
      selectValues.push(
        <option key={i} value={i}>
          {i}
        </option>,
      );
    }
    return selectValues;
  }

  generateMinuteSelectValues() {
    let minutes = generateMinutes();
    let selectValues = [];
    for (let i = 0; i < minutes.length; i++) {
      selectValues.push(
        <option key={i} value={i}>
          {minutes[i]}
        </option>,
      );
    }
    return selectValues;
  }

  generateMeridiemSelectValues() {
    let selectValues = [
      <option key={'am'} value={'am'}>
        AM
      </option>,
      <option key={'pm'} value={'pm'}>
        PM
      </option>,
    ];

    return selectValues;
  }

  convertHourUsingMeridiem(hour, meridiem) {
    if (meridiem === 'pm' && hour !== 12) {
      return hour + 12;
    } else if (meridiem === 'am' && hour === 12) return 0;
    else return hour;
  }

  handleHourChange(event, arrow = "", valueInput) {
    if(!arrow){
      this.props.timeChangeCallback(
        this.props.twelveHoursClock
          ? this.convertHourUsingMeridiem(parseInt(event.target.value), this.props.date.format('a'))
          : parseInt(event.target.value),
        this.props.date.minute(),
        this.props.mode,
      );
    } else{
      let value;
      const incomingValue = parseInt(valueInput)
      if(this.props.twelveHoursClock){
        if(arrow === "down"){
          if(incomingValue <= 12 && incomingValue > 1){
            value = incomingValue - 1;
          }else if(incomingValue === 1){
            value = 12;
          }
        } else{
          if(incomingValue >= 1 && incomingValue < 12){
            value = incomingValue + 1;
          }else if(incomingValue === 12){
            value = 1;
          }
        }
      }else{
        if(arrow === "down"){
          if(incomingValue <= 23 && incomingValue > 0){
            value = incomingValue - 1;
          }else if(incomingValue === 0){
            value = 23;
          }
        } else{
          if(incomingValue >= 0 && incomingValue < 23){
            value = incomingValue + 1;
          }else if(incomingValue === 23){
            value = 0;
          }
        }
      }
      this.props.timeChangeCallback(
        this.props.twelveHoursClock
          ? this.convertHourUsingMeridiem(value, this.props.date.format('a'))
          : parseInt(value),
        this.props.date.minute(),
        this.props.mode,
      );
    }
   
  }

  handleMinuteChange(event, arrow = "",valueInput) {
    if(!arrow){
      this.props.timeChangeCallback(this.props.date.hour(), parseInt(event.target.value), this.props.mode);
    } else{
      const hour = this.props.date.hour()
      const incomingValue = parseInt(valueInput)
      let value;
      if(arrow === "down"){
        if(incomingValue <= 59 && incomingValue >0)
        value = incomingValue - 1
        else if(incomingValue === 0){
          value = 59
        }
      }else{
        if(incomingValue >= 0 && incomingValue < 59)
        value = incomingValue + 1
        else if(incomingValue === 59){
          value = 0
        }
      }
      this.props.timeChangeCallback(hour, value, this.props.mode);
    }
    
  }

  handleMeridiemChange(event, arrow = "",valueInput) {
    if(!arrow){
      this.props.timeChangeCallback(
        this.convertHourUsingMeridiem(parseInt(this.props.date.format('h')), event.target.value),
        this.props.date.minute(),
        this.props.mode,
      );
    } else{
      let value = valueInput === "am" ? "pm" : "am"
      this.props.timeChangeCallback(
        this.convertHourUsingMeridiem(parseInt(this.props.date.format('h')), value),
        this.props.date.minute(),
        this.props.mode,
      );
    }
    
  }

  hourFocus() {
    this.setState({ hourFocus: true });
  }

  hourBlur() {
    this.setState({ hourFocus: false });
  }

  minuteFocus() {
    this.setState({ minuteFocus: true });
  }

  minuteBlur() {
    this.setState({ minuteFocus: false });
  }

  renderSelectField(valueInput, onChangeInput, optionsInput, id) {
    let theme = this.props.darkMode ? darkTheme : lightTheme;

    return (
      // <select id={id + '_' + this.props.mode} style={theme} value={valueInput} onChange={onChangeInput}>
      //   {optionsInput}
      // </select>
      // <div>
      //   <div onClick={(event)=>{onChangeInput(event, "up",valueInput)}}>up</div>
      //   <input id={id + '_' + this.props.mode} style={theme} value={valueInput} onChange={(event)=>{onChangeInput(event)}}/>
      //   <div onClick={(event)=>{onChangeInput(event, "down",valueInput)}}>down</div>
      // </div>
      <div>
        <div className='upArrow' onClick={(event)=>{onChangeInput(event,"up",valueInput)}}>
        <img className='arrowSvg' src={upArrow} alt="down" />  
        </div>
        <select id={id + '_' + this.props.mode} className='timeSelect' style={theme} value={valueInput} onChange={onChangeInput}>
          {optionsInput}
        </select>
        <div className='downArrow' onClick={(event)=>{onChangeInput(event,"down",valueInput)}}>
        <img className='arrowSvg' src={downArrow} alt="down" />
        </div>
      </div>
      
    );
  }

  render() {
    let glyphColor = this.props.darkMode ? '#FFFFFF' : '#555';
    let hours = this.generateHourSelectValues();
    let minutes = this.generateMinuteSelectValues();
    let meridiems = this.generateMeridiemSelectValues();
    let hour = this.props.twelveHoursClock ? parseInt(this.props.date.format('h')) : this.props.date.hour();
    let minute = this.props.date.minute();
    let meridiem = this.props.date.format('a');

    let hourFocusStyle = {};
    hourFocusStyle = addFocusStyle(this.state.hourFocus, hourFocusStyle);
    let minuteFocusStyle = {};
    minuteFocusStyle = addFocusStyle(this.state.minuteFocus, minuteFocusStyle);

    return (
      <div className="timeContainer">
        <div className="timeSelectContainer">
          <div className="multipleContentOnLine hour" onFocus={this.hourFocus} onBlur={this.hourBlur} style={hourFocusStyle}>
            {this.renderSelectField(hour, this.handleHourChange, hours, 'Hour')}
          </div>
          <div className="multipleContentOnLine delimiter">:</div>
          <div
            className="multipleContentOnLine minute"
            onFocus={this.minuteFocus}
            onBlur={this.minuteBlur}
            style={minuteFocusStyle}
          >
            {this.renderSelectField(minute, this.handleMinuteChange, minutes, 'Minutes')}
          </div>
          {this.props.twelveHoursClock && (
            <div className="multipleContentOnLine meridiem">
              {this.renderSelectField(meridiem, this.handleMeridiemChange, meridiems, 'Meridiem')}
            </div>
          )}
        </div>
        <Glyphicon style={{ color: glyphColor }} className="timeIconStyle" glyph="time" />
      </div>
    );
  }
}

TimeField.propTypes = {
  timeChangeCallback: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  date: momentPropTypes.momentObj,
  darkMode: PropTypes.bool,
  twelveHoursClock: PropTypes.bool,
};
export default TimeField;
