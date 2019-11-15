import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from './Styles';
import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASbJPUAfjRZRtc5qpvsRhs609f8o-B9jc",
  authDomain: "lesson10-diary.firebaseapp.com",
  databaseURL: "https://lesson10-diary.firebaseio.com",
  projectId: "lesson10-diary",
  storageBucket: "lesson10-diary.appspot.com",
  messagingSenderId: "719297828921",
  appId: "1:719297828921:web:42fad3b9dd1de0f67255e8"
};

export class MainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      labels: []
    }
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    this.entriesRef = this.db.collection('entries'); 
    this.entriesRef.get().then(queryRef=>{
      let newEntries = [];
      queryRef.forEach(docRef=>{
        let docData = docRef.data();
        let newEntry = {
          text: docData.text,
          timestamp: docData.timestamp.toDate(),
          key: docRef.id, 
          labels: docData.labels
        }
        newEntries.push(newEntry);
      });
      this.setState({entries: newEntries});
    });

    this.labelsRef = this.db.collection('labels');
    this.labelsRef.get().then((querySnap)=>{
      let newLabels = [];
      querySnap.forEach(docSnap=>{
        let newLabel = {
          name: docSnap.data().name,
          key: docSnap.id
        }
        newLabels.push(newLabel);
      });
      this.setState({labels: newLabels});
    });
  }

  addEntry(newEntry) {
    this.entriesRef.add(newEntry).then(docRef=> {
      newEntry.key = docRef.id;
      let newEntries = this.state.entries.slice(); // clone the list
      newEntries.push(newEntry);
      this.setState({entries: newEntries});
    })
  }

  deleteEntry(entryToDelete) {
    let entryKey = entryToDelete.key;
    this.entriesRef.doc(entryKey).delete().then(()=> {
      let newEntries = [];
      for (entry of this.state.entries) {
        if (entry.key !== entryKey) {
          newEntries.push(entry);
        }
      }
      this.setState({entries: newEntries});
    });
  }

  updateEntry(entryToUpdate) {
    //let entryKey = entryToUpdate.key;
    this.entriesRef.doc(entryToUpdate.key).set({
      text: entryToUpdate.text,
      timestamp: entryToUpdate.timestamp,
      labels: entryToUpdate.labels
    }).then(() => {
      let newEntries = [];
      for (entry of this.state.entries) {
        if (entry.key === entryToUpdate.key) {
          newEntries.push(entryToUpdate);
        } else {
          newEntries.push(entry);
        }
      }
      this.setState({entries: newEntries});
    });
  }

  updateLabels(newLabels) {
    this.setState({labels: newLabels});
  }
  
  getLabelName(labelKey) {
    for (lbl of this.state.labels) {
      if (lbl.key === labelKey) {
        return lbl.name;
      }
    }
    return undefined;
  }
  
  handleDelete(entryToDelete) {
    this.deleteEntry(entryToDelete);
  }

  handleEdit(entryToEdit) {
    this.props.navigation.navigate('Details', {
      entry: entryToEdit,
      mainScreen: this
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>My Diary</Text>
          <Button
            title="Config"
            titleStyle={{fontSize: 11}}
            containerStyle={{width: '30%'}}
            onPress={()=>{
              this.props.navigation.navigate('Labels', {mainScreen: this});
            }}
          />
        </View>
        <View style={styles.bodyContainer}>
          <FlatList
            data={this.state.entries}
            renderItem={
              ({item}) => {
                return (
                  <View style={styles.bodyListItem}>
                    <View style={styles.bodyListItemLeft}>
                      <Text style={styles.bodyListItemDate}>{item.timestamp.toLocaleString()}</Text>
                      <Text style={styles.bodyListItemText}>{item.text}</Text>
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
            title='Add Entry'
            onPress={() => {
              this.props.navigation.navigate('Details', {mainScreen: this});
            }}
          />
        </View>
      </View>
    );
  }

}