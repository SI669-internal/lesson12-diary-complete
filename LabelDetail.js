import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { styles } from './Styles';
import { MainScreen } from './Main';

export class LabelDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.labelsScreen = this.props.navigation.getParam('labelsScreen', undefined);
    this.label = this.props.navigation.getParam('label', undefined);
    let initText = '';
    if (typeof this.label === 'undefined') {
      this.isAdd = true;
    } else {
      initText = this.label.name;
    }
    this.state = {
      inputText: initText
    }
  }

  handleSave = () => {
    let newLabel = {
      name: this.state.inputText
    }
    if (this.isAdd) {
      this.labelsScreen.addLabel(newLabel);
    } else {
      newLabel.key = this.label.key;
      this.labelsScreen.updateLabel(newLabel);
    }
    this.props.navigation.goBack();
  }

  render() {
    return (
    <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Edit Label Name</Text>
          </View>
        <View style={styles.detailsBodyContainer}>
          <View style={styles.detailsInputContainer}>
            <Input
              placeholder="What's new?"
              inputContainerStyle={styles.largeInput}
              containerStyle={{justifyContent: 'flex-start'}}
              value={this.state.inputText}
              onChangeText={(value)=>{this.setState({inputText: value})}}
            />
          </View>
          <View style={styles.detailsLabelsContainer}>
            <FlatList
              data={this.state.labels}
              renderItem={({item})=>{
                return(
                  <View style={styles.labelSelectContainer}>
                    <CheckBox
                      containerStyle={styles.labelSelectCheckBoxContainer}
                      checked={item.value}
                      onPress={()=>{this.handleLabelToggle(item)}}
                    />
                    <Text style={styles.labelSelectText}>{item.name}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
          <Button
            title='Cancel'
            containerStyle={styles.mediumButtonContainer}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
          <Button
            title='Save'
            containerStyle={styles.mediumButtonContainer}
            onPress={this.handleSave}
          />
        </View>
      </View>
    );
  }
}