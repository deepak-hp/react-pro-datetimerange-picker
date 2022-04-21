import React from 'react';
import '../style/DateTimeRange.css';
import { Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { generateHours, generateMinutes } from '../utils/TimeFunctionUtils';
import {addFocusStyle, darkTheme, lightTheme} from '../utils/StyleUtils';
import upArrow from "../svg/upArrow.svg"
import downArrow from "../svg/downArrow.svg"
import OutsideAlerter from "../utils/OutsideAlerter"

class TimeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hourFocus: false,
      minuteFocus: false,
      hourModalVisible: false,
      minuteModalVisible: false,
      meridiemModalVisible: false,
    };
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleMeridiemChange = this.handleMeridiemChange.bind(this);
    this.hourFocus = this.hourFocus.bind(this);
    this.minuteFocus = this.minuteFocus.bind(this);
    this.hourBlur = this.hourBlur.bind(this);
    this.minuteBlur = this.minuteBlur.bind(this);
    this.selectFromDropdown = this.selectFromDropdown.bind(this);
    this.handleCloseModalStates = this.handleCloseModalStates.bind(this);
  }

  generateHourSelectValues() {
    let selectValues = [];
    for (let i = this.props.twelveHoursClock ? 1 : 0; i <= (this.props.twelveHoursClock ? 12 : 23); i++) {
      selectValues.push(
        <div key={i} value={i}>
          {i < 10 ? `0${i}` : i}
        </div>,
      );
    }
    return selectValues;
  }

  generateMinuteSelectValues() {
    let minutes = generateMinutes();
    let selectValues = [];
    for (let i = 0; i < minutes.length; i++) {
      selectValues.push(
        <div key={i} value={i}>
          {minutes[i]}
        </div>,
      );
    }
    return selectValues;
  }

  generateMeridiemSelectValues() {
    let selectValues = [
      <div key={'am'} value={'am'}>
        AM
      </div>,
      <div key={'pm'} value={'pm'}>
        PM
      </div>,
    ];

    return selectValues;
  }

  convertHourUsingMeridiem(hour, meridiem) {
    if (meridiem === 'pm' && hour !== 12) {
      return hour + 12;
    } else if (meridiem === 'am' && hour === 12) return 0;
    else return hour;
  }

  handleHourChange(event, arrow = "", valueInput, isDropDown = false) {
    this.setState({hourModalVisible: false})
      // ,minuteModalVisible:false,meridiemModalVisible: false})
    // console.log("handleHourChange",event.target.getAttribute('value'));
    if(!arrow){
      let value = isDropDown? event.target.getAttribute('value') : event.target.value
      this.props.timeChangeCallback(
        this.props.twelveHoursClock
          ? this.convertHourUsingMeridiem(
            parseInt(value),
            this.props.date.format('a'))
          : parseInt(value),
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

  handleMinuteChange(event, arrow = "", valueInput, isDropDown = false) {
    this.setState({minuteModalVisible:false})
    if(!arrow){
      let value = isDropDown? event.target.getAttribute('value') : event.target.value
      this.props.timeChangeCallback(this.props.date.hour(), parseInt(value), this.props.mode);
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

  handleMeridiemChange(event, arrow = "", valueInput, isDropDown = false) {
    this.setState({meridiemModalVisible: false})
    if(!arrow){
      let value = isDropDown? event.target.getAttribute('value') : event.target.value
      this.props.timeChangeCallback(
        this.convertHourUsingMeridiem(parseInt(this.props.date.format('h')), value),
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

  handleCloseModalStates(){
    this.setState({hourModalVisible: false,minuteModalVisible:false,meridiemModalVisible: false});
  }

  selectFromDropdown(event,id){
    // this.setState({hourModalVisible: false,minuteModalVisible:false,meridiemModalVisible: false});
    console.log("here!",event, id);
    if(id === 'Hour'){
      this.setState({hourModalVisible: true});
      // if(this.state.hourModalVisible){
      //   this.setState({hourModalVisible: false});
      // }else{
      //   this.setState({hourModalVisible: true,minuteModalVisible:false,meridiemModalVisible: false});
      // }
    } 
    else if (id === 'Minutes'){
      this.setState({minuteModalVisible:true});
    }
    else if (id === 'Meridiem'){
      this.setState({meridiemModalVisible:true});
    }
  }

  dropdownList(onChangeInput, optionsInput) {
    return (
      <OutsideAlerter handleCloseModalStates={this.handleCloseModalStates}>
      <div className='dropdownModal'>
        <div className='dropdownOptions'>
        {optionsInput.map(option =>(
        <div key={option.key} value={option.props.value} onClick={event=>onChangeInput(event,null,null,true)} className="dropdownOption">
         {option.props.children}
        </div>
        ))}
        </div>
      </div> 
      </OutsideAlerter>
  )
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
        <div id={id + '_' + this.props.mode} className='timeSelect' style={theme} value={valueInput} onChange={onChangeInput}>
          <div className='optionsInputList' onClick={(event)=>{this.selectFromDropdown(event,id)}}>
            {optionsInput.find((option) => option.props.value === valueInput)}
          </div>
         {/* <div className='optionsInputList'>{optionsInput}</div>  */}
        </div>
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
            {this.state.hourModalVisible && this.dropdownList(this.handleHourChange, hours)}
          </div>
          <div className="multipleContentOnLine delimiter">:</div>
          <div
            className="multipleContentOnLine minute"
            onFocus={this.minuteFocus}
            onBlur={this.minuteBlur}
            style={minuteFocusStyle}
          >
            {this.renderSelectField(minute, this.handleMinuteChange, minutes, 'Minutes')}
            {this.state.minuteModalVisible && this.dropdownList(this.handleMinuteChange, minutes)}
          </div>
          {this.props.twelveHoursClock && (
            <div className="multipleContentOnLine meridiem">
              {this.renderSelectField(meridiem, this.handleMeridiemChange, meridiems, 'Meridiem')}
              {this.state.meridiemModalVisible && this.dropdownList( this.handleMeridiemChange, meridiems)}
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
