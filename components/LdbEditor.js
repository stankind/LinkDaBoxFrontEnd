import React, { PropTypes } from 'react';
import {Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';

export class LdbEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

    if( this.props.rawContentJson != null && this.props.rawContentJson != '') {
      var rawContent = JSON.parse( this.props.rawContentJson);
      var content = convertFromRaw( rawContent);
      var editorState = EditorState.createWithContent( content);
      this.state = {editorState: editorState};
    }

    this.onChange = (editorState) => {
      this.setState({editorState});

      var rawContent = convertToRaw(editorState.getCurrentContent());
      var rawContentJson = JSON.stringify( rawContent);
      this.props.onEditorChangedHandler(rawContentJson);
    }
  }

  render() {
    const {editorState} = this.state;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
}

LdbEditor.propTypes = {
    rawContentJson:          PropTypes.string.isRequired,
    onEditorChangedHandler:  PropTypes.func.isRequired
}