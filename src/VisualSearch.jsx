import React,{ Component } from 'react';
import theme               from './VisualSearch.scss';
var FontAwesome = require('react-fontawesome');

class VisualSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
        searchFilters:[{key: 'name',value:'Nirbhay'}],
        activeFilter: {},
        focusOnKeyInput: false,
        mouseOverList: false
    }
    this.selectSearchKey = this.selectSearchKey.bind(this);
    this.selectSearchValue = this.selectSearchValue.bind(this);
    this.handleFocusOnKeyInput = this.handleFocusOnKeyInput.bind(this);
    this.handleListDisplay = this.handleListDisplay.bind(this);
    this.closeToken = this.closeToken.bind(this);
  }
  selectSearchKey (selectedKey) {
    let searchFilters = this.state.searchFilters; 
    searchFilters.push({ key: selectedKey , value: ''});
    this.setState({
        searchFilters: searchFilters,
        mouseOverList: false,
        focusOnKeyInput: false
    });
  }
  selectSearchValue (filter) {
    let { searchFilters } = this.state;
    searchFilters = searchFilters.map(obj => {
        if(obj.key == filter.key){
            obj = Object.assign({},filter);
        }
        return obj
    }).then(function(response){
        console.log(response)
    });
  }
  handleFocusOnKeyInput(event) {
    if(event.type =='focus') {
        this.setState({focusOnKeyInput : true})
    } else if(event.type == 'blur') {
        this.setState({focusOnKeyInput : false})
    }
  }
  handleListDisplay(event){
      let state = { }
      switch(event.type) {
          case 'mouseover': state.mouseOverList = true
          break;
          case 'mouseleave': state.mouseOverList = false
          break;
      }
    this.setState(state);
  }
  closeToken (tokenIndex) {
    let searchFilters = Object.assign([], this.state.searchFilters);
    searchFilters = searchFilters.slice(0,tokenIndex).concat(searchFilters.slice(tokenIndex +1))
    this.setState({searchFilters: searchFilters});
  }
  render() {
    const placeHolder = (this.state.searchFilters.length == 0 && !this.state.activeFilter.hasOwnProperty('key')) ? 'Search' : '';
    return(
      <div className={ theme.searchAndSortContainer }>  
        <div id="searchFilterSelectedContainer" className={ theme.selectedFilterContainer }>
          <FontAwesome name="search" className={ theme.searchIcon }/>
          <TokenIterator tokenList={ this.state.searchFilters } onSelect={ this.selectSearchValue } show={ this.state.searchFilters.length > 0 } closeOnClick={ this.closeToken } />
        </div>
        <div id="activeFilterContainer" className={ theme.activeFilterContainer }>
          <input className={ theme.activeInput } onFocus={ this.handleFocusOnKeyInput } onBlur={ this.handleFocusOnKeyInput } type="text" placeholder={ placeHolder }/>
          <ListDisplay list={['id','name']} onSelect={ this.selectSearchKey } show={ this.state.focusOnKeyInput || this.state.mouseOverList } onList={ this.handleListDisplay } />
        </div>
      </div>
    )
  }
}

const ListDisplay = (props) => {
  const selectMethod = props.onSelect;
  return (<ul className={ theme.autoCompleteList } onMouseOver={ (event)=> props.onList(event) } onMouseLeave={ (event)=> props.onList(event) } style={ props.show ? { display: 'block' } : { display : 'none' } }>
            { props.list.map(listItem => (<li key={ listItem } className={ theme.autoCompleteListItem } ><a onClick={ ()=>  selectMethod(listItem)  }>{ listItem }</a></li> ))}
          </ul>)
}

const TokeDisplay = (props)=> {
  return (<div className={ theme.tokenDisplayUnit } >
            <FontAwesome name="times-circle" className={ theme.closeIcon } onClick={ ()=> props.close() }/>
            <label htmlFor={ props.name }> { props.filter + ' : ' } </label>
            <span id={ props.name } name={ props.name } contentEditable={ true }  > { props.value } </span>
          </div>)
}

class TokenDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      editing: false,
      showList: false,
      onList: false,
      value: props.value
    };
    this.handleActiveValueField = this.handleActiveValueField.bind(this);
    this.handleValueSelect = this.handleValueSelect.bind(this);
  }

  handleActiveValueField(event) {

    switch(event.type){
        case 'focus'      : this.setState({ showList: true });
        break;
        case 'blur'       : this.state.onList ? false : this.setState({ showList: false });
        break;
        case 'mouseover'  : this.setState({ onList: true });
        break;
        case 'mouseleave' : this.setState({ onList: false });
        break;
        case 'change'     : {
          const editedText = event.nativeEvent.target.value;
          this.setState({ value: editedText });
          break;
        }
        default: false;
    }

  }

  handleValueSelect(listItem) {
    let filter = {};
    filter = { key: this.props.name, value: listItem};
    this.props.onSelect(filter);
  }

  render() { 
    const inputSize = this.state.value.length == '' ? 1 : this.state.value.length ;
    return(<div className={ theme.tokenDisplayUnit } >
     <FontAwesome name="times-circle" className={ theme.closeIcon } onClick={ ()=> this.props.close() }/>
     <label htmlFor={ this.props.name }> { this.props.filter + ' : ' } </label>    
     <input type="text" size={ inputSize } id={ this.props.name } name={ this.props.name } defaultValue={ this.props.value } onFocus={ (event)=> this.handleActiveValueField(event) } onBlur={ (event)=> this.handleActiveValueField(event) } onChange={ (event)=>this.handleActiveValueField(event) } />
     <ListDisplay list={ DUMMY_LIST_OF_ELEMENTS } onSelect={ this.handleValueSelect } show={ this.state.showList } onList={ this.handleActiveValueField }/>
    </div>)
  }
}

const TokenIterator = (props)=> { 
  if(props.show == false){
    return null
  } else {
    return(<div className={ theme.tokenList }>
            { props.tokenList.map((token,index) => (<TokenDisplay key={ index } name={ token.key } filter={ token.key } value={ token.value } onSelect={ props.onSelect } close={()=> props.closeOnClick(index) }/>)) }
           </div>)
  }
}

const DUMMY_LIST_OF_ELEMENTS = ['id','name','description','created'];



export default VisualSearch;