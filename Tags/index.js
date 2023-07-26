import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import Tag from "./Tag";
import Input from "./Input";
import styles from "./styles";
import { text } from "@fortawesome/fontawesome-svg-core";

class Tags extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: props.initialTags,
      text: props.initialText
    };
  };

  showLastTag = () => {
    this.setState(state =>
      ({
        tags: state.tags.slice(0, -1),
        text: state.tags.slice(-1)[0] || " "
      }),
      () =>
        this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  };

  addTag = text => {
    this.setState(state =>
      ({
        tags: [...state.tags, text.trim()],
        text: " "
      }),
      () => this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  };

  onChangeText = text => {
    if (text.length === 0) {
      this.showLastTag();
    } else if (
      text.length > 1 &&
      this.props.createTagOnString.includes(text.slice(-1)) &&
      !text.match(new RegExp(`^[${this.props.createTagOnString.join("")}]+$`, 'g')) &&
      !(this.state.tags.indexOf(text.slice(0, -1).trim()) > -1)
    ) {
      this.addTag(text.slice(0, -1));
      console.log('Added on changetext', text.slice(0,-1))
    } else {
      this.setState({ text });
    }
  };
  onSubmitEditing = () => {
    console.log('Submit editing')
    if (!this.props.createTagOnReturn) {
      return;
    }
    if(this.state.text.length>0){
      this.addTag(this.state.text);
      console.log('Added on submit editing', this.state.text);
    }
    
  };
  onBlur = () => {
    var tbval = this.state.text;
    console.log('Firing blur', tbval);
    if (tbval.length === 0) {
      this.showLastTag();
    }
    else if(tbval.trim().length>0)
    {
      console.log('Text length', tbval.length)
      this.addTag(tbval);
      console.log('Added on blur', tbval)
      this.setState({text: ''})
  }
}
  render() {

    const {
      containerStyle,
      style,
      readonly,
      maxNumberOfTags,
      tagContainerStyle,
      tagTextStyle,
      deleteTagOnPress,
      onTagPress,
      renderTag
    } = this.props;

    return (
      <View style={[styles.container, containerStyle, style]}>

        {this.state.tags.map((tag, index) => {

          const tagProps = {
            tag,
            index,
            deleteTagOnPress,
            onPress: event => {
              event?.persist();
              if (deleteTagOnPress && !readonly) {
                this.setState(state =>
                  ({
                    tags: [
                      ...state.tags.slice(0, index),
                      ...state.tags.slice(index + 1)
                    ]
                  }),
                  () => {
                    this.props.onChangeTags &&
                      this.props.onChangeTags(this.state.tags);
                    onTagPress && onTagPress(index, tag, event, true);
                  }
                );
              } else {
                onTagPress && onTagPress(index, tag, event, false);
              }
            },
            tagContainerStyle,
            tagTextStyle
          };

          return renderTag(tagProps);
        })}

        {!readonly
          && maxNumberOfTags > this.state.tags.length
          &&
          <Input
            value={this.state.text}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitEditing}
            onBlur={this.onBlur}
            {...this.props}
          />
        }

      </View>
    );
  };

}

Tags.defaultProps = {
  initialTags: [],
  initialText: " ",
  createTagOnString: [",", " "],
  createTagOnReturn: false,
  readonly: false,
  deleteTagOnPress: true,
  maxNumberOfTags: Number.POSITIVE_INFINITY,
  renderTag: ({ tag, index, ...rest }) => (
    <Tag key={`${tag}-${index}`} label={tag} {...rest} />
  )
};

Tags.propTypes = {
  initialText: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.string),
  createTagOnString: PropTypes.array,
  createTagOnReturn: PropTypes.bool,
  onChangeTags: PropTypes.func,
  readonly: PropTypes.bool,
  maxNumberOfTags: PropTypes.number,
  deleteTagOnPress: PropTypes.bool,
  renderTag: PropTypes.func,
  /* style props */
  containerStyle: PropTypes.any,
  style: PropTypes.any,
  inputContainerStyle: PropTypes.any,
  inputStyle: PropTypes.any,
  tagContainerStyle: PropTypes.any,
  tagTextStyle: PropTypes.any,
  textInputProps: PropTypes.object
};

export { Tags };
export default Tags;
