
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from './Styles';


export class LabelsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mainScreen = this.props.navigation.getParam('mainScreen');
    this.state = {
      labels: this.mainScreen.state.labels
    }
  }

  handleDelete(labelToDelete) {
    this.mainScreen.labelsRef.doc(labelToDelete.key).delete().then(()=> {
      let newLabels = [];
      for (lbl of this.state.labels) {
        if (labelToDelete.key !== lbl.key) {
          newLabels.push(lbl);
        }
      }
      this.mainScreen.updateLabels(newLabels);
      this.setState({labels: newLabels});
      this.reconcileOnDeleteLabel(labelToDelete);
    });
  }

  handleEdit(labelToEdit) {
    this.props.navigation.navigate('LabelDetails', {
      labelsScreen: this, 
      label: labelToEdit
    });
  }

  addLabel(labelToAdd) {
    this.mainScreen.labelsRef.add(labelToAdd).then((docRef)=> {
      labelToAdd.key = docRef.id;
      this.setState(prevState=>{
        let newLabels = prevState.labels.slice();
        newLabels.push(labelToAdd);
        this.mainScreen.updateLabels(newLabels);
        return{labels: newLabels};
      });
      this.reconcileOnAddLabel(labelToAdd);
    });
  }
  
  updateLabel(labelToUpdate) {
    this.mainScreen.labelsRef.doc(labelToUpdate.key).set(labelToUpdate).then(()=> {
      this.setState(prevState=>{
        let newLabels = [];
        for (lbl of prevState.labels) {
          if (lbl.key === labelToUpdate.key) {
            newLabels.push(labelToUpdate);
          } else {
            newLabels.push(lbl);
          }
        }
        this.mainScreen.updateLabels(newLabels);
        return{labels: newLabels};
      })
    });
  }


  reconcileOnAddLabel(newLabel) {
    let newEntries = [];
    newLabel.value = false;
    let batch = this.mainScreen.db.batch();
    for (e of this.mainScreen.state.entries) {
      console.log('reconciling', e);
      e.labels.push(newLabel);
      eData = {
        text: e.text,
        timestamp: e.timestamp,
        labels: e.labels
      }
      eRef = this.mainScreen.entriesRef.doc(e.key);
      batch.set(eRef, eData);
      newEntries.push(e);
    }
    batch.commit().then(() => {
      this.mainScreen.setState({entries: newEntries});
    });
  }


  reconcileOnDeleteLabel(deletedLabel) {
    let newEntries = [];
    let batch = this.mainScreen.db.batch();
    for (e of this.mainScreen.state.entries) {
      let newLabels = [];
      for (lbl of e.labels) {
        console.log("comparing", lbl.key, deletedLabel.key, lbl.key !== deletedLabel.key);
        if (lbl.key !== deletedLabel.key) {
          console.log('pushing', lbl);
          newLabels.push(lbl);
        }
      }
      console.log('new labels', newLabels);
      e.labels = newLabels;
      eData = {
        text: e.text,
        timestamp: e.timestamp,
        labels: e.labels
      }
      eRef = this.mainScreen.entriesRef.doc(e.key);
      batch.set(eRef, eData);
      newEntries.push(e);
    }
    console.log(newEntries);
    batch.commit().then(() => {
      this.mainScreen.setState({entries: newEntries});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Edit Labels</Text>
        </View>
        <View style={styles.bodyContainer}>
          <FlatList
            data={this.state.labels}
            renderItem={
              ({item}) => {
                return (
                  <View style={styles.bodyListItem}>
                    <View style={styles.bodyListItemLeft}>
                      <Text style={styles.bodyListItemText}>{item.name}</Text>
                    </View>
                    <View style={styles.bodyListItemRight}>
                      <Button
                        title='Delete'
                        containerStyle={styles.mediumButtonContainer}
                        titleStyle={styles.mediumButtonTitle}
                        onPress={()=>{this.handleDelete(item)}}
                      />
                      <Button
                        title='Edit'
                        containerStyle={styles.mediumButtonContainer}
                        titleStyle={styles.mediumButtonTitle}
                        onPress={()=>{this.handleEdit(item)}}
                      />
                    </View>

                  </View>
                );
              }} 
          />
        </View>
        <View style={styles.footerContainer}>
          <Button
            title='Add Label'
            onPress={() => {
              this.props.navigation.navigate('LabelDetails', {labelsScreen: this});
            }}
          />
        </View>

      </View>
    )

  }

}
