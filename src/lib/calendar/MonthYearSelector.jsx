import React from 'react';
import '../style/DateTimeRange.css';
import { Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {addFocusStyle, darkTheme, lightTheme} from '../utils/StyleUtils';
import OutsideAlerter from '../utils/OutsideAlerter';
import upArrow from '../svg/upArrow.svg';
import downArrow from '../svg/downArrow.svg';

class MonthYearSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthFocus: false,
      yearFocus: false,
      monthModalVisible: false,
      yearModalVisible: false,
      restrictModalVisible: false
    };

    this.monthFocus = this.monthFocus.bind(this);
    this.yearFocus = this.yearFocus.bind(this);
    this.monthBlur = this.monthBlur.bind(this);
    this.yearBlur = this.yearBlur.bind(this);
    this.selectFromDropdown=this.selectFromDropdown.bind(this);
    this.dropdownList = this.dropdownList.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleMonthYearCloseModal=this.handleMonthYearCloseModal.bind(this);
  }

  createCalendarMonths(months) {
    return this.mapToOption(months);
  }

  createYears(years) {
    return this.mapToOption(years);
  }

  monthFocus() {
    this.setState({ monthFocus: true });
  }

  monthBlur() {
    this.setState({ monthFocus: false });
  }

  yearFocus() {
    this.setState({ yearFocus: true });
  }

  yearBlur() {
    this.setState({ yearFocus: false });
  }

  mapToOption(variableArray) {
    return variableArray.map(function(varInstance, i) {
      return <div key={i} data={i}>{varInstance}</div>;
    });
  }

  createGlyph(icon, onClickHandler, previous, next) {
    return (
      <Glyphicon
        glyph={icon}
        style={{ cursor: 'pointer' }}
        onClick={() => onClickHandler(previous, next)}
      />
    );
  }

  dropdownList(onChangeInput, optionsInput) {
    return (
      <OutsideAlerter handleCloseModalStates={this.handleMonthYearCloseModal}>
        <div className="monthYearDropdownModal">
          <div className="monthYearDropdownOptions">
            {optionsInput.map(option => (
              <div
                key={option.key}
                value={option.props.children}
                data={option.props.data}
                onClick={event => this.handleDropdownClick(onChangeInput,event, true)}
                className="monthYearDropdownOption"
              >
                {option.props.children}
              </div>
            ))}
          </div>
        </div>
      </OutsideAlerter>
    );
  }

  handleMonthYearCloseModal(){
    this.setState({monthModalVisible: false,yearModalVisible: false, restrictModalVisible: false})
  }

  handleDropdownClick(cbFn,event,isDropDown){
    this.setState({monthModalVisible: false,yearModalVisible: false, restrictModalVisible: true})
    cbFn(event,isDropDown)
  }
  
  selectFromDropdown(id){
    if(this.state.restrictModalVisible){
      this.setState({restrictModalVisible: false,monthModalVisible: false,yearModalVisible: false})
    }
    if(id === "Month")
    this.setState({monthModalVisible: true})
    else if(id === "Year")
    this.setState({yearModalVisible: true})
  }

  render() {
    let months = this.createCalendarMonths(this.props.months);
    let years = this.createYears(this.props.years);
    let theme = this.props.darkMode ? darkTheme : lightTheme;
    let leftArrow = this.createGlyph(
      'chevron-left',
      this.props.changeMonthArrowsCallback,
      true,
      false,
    );
    let rightArrow = this.createGlyph(
      'chevron-right',
      this.props.changeMonthArrowsCallback,
      false,
      true,
    );
    let monthFocusStyle = {};
    monthFocusStyle = addFocusStyle(this.state.monthFocus, monthFocusStyle);
    let yearFocusStyle = {};
    yearFocusStyle = addFocusStyle(this.state.yearFocus, yearFocusStyle);

    return (
      <div className="monthYearContainer">
        <div className="multipleContentOnLine leftChevron">{leftArrow}</div>
        <div
          className="multipleContentOnLine month"
          onFocus={this.monthFocus}
          onBlur={this.monthBlur}
          style={monthFocusStyle}
        >
          <div
            id={'MonthSelector_' + this.props.mode}
            value={this.props.months[this.props.month]}
            // onChange={this.props.changeMonthCallback}
            onClick={()=>this.selectFromDropdown("Month")}
            className='monthYearOptionInputList'
            style={theme}
          >
            <div className='monthYearSelectedMonthContainer'>
              <div className='monthYearSelectedMonth'>
                {this.props.months[this.props.month]} 
              </div>
              <div className='monthYearSelectedMonthSvg'>
                <img src={downArrow} alt="dropdown arrow"/>
              </div>
            </div>
              {/* {months} */}
              {!this.state.restrictModalVisible && this.state.monthModalVisible && this.dropdownList(this.props.changeMonthCallback, months)}
          </div>
        </div>
        <div
          className="multipleContentOnLine year"
          onFocus={this.yearFocus}
          onBlur={this.yearBlur}
          style={yearFocusStyle}
        >
          <div
            id={'YearSelector_' + this.props.mode}
            value={this.props.year}
            // onChange={this.props.changeYearCallback}
            onClick={()=>this.selectFromDropdown("Year")}
            style={theme}
          >
            {/* {years} */}
            <div className='monthYearSelectedYearContainer'>
              <div className='monthYearSelectedYear'>
              {this.props.year}  
              </div>
              <div className='monthYearSelectedYearSvg'>
                <img src={upArrow} alt="year dropdown"/>
                <img src={downArrow} alt="year dropdown"/>
              </div>
            </div>
            {!this.state.restrictModalVisible && this.state.yearModalVisible && this.dropdownList(this.props.changeYearCallback, years)}
          </div>
        </div>
        <div className="multipleContentOnLine rightChevron">{rightArrow}</div>
      </div>
    );
  }
}

MonthYearSelector.propTypes = {
  months: PropTypes.array.isRequired,
  years: PropTypes.array.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  changeMonthCallback: PropTypes.func.isRequired,
  changeYearCallback: PropTypes.func.isRequired,
  changeMonthArrowsCallback: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};
export default MonthYearSelector;
