import React from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
} from 'react-native'

import RNHTMLtoPDF from 'react-native-html-to-pdf'
import ImagePicker from 'react-native-image-picker'
import Share from 'react-native-share';


export default class PDFShareExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePath: '',
      title: '',
    };
  }

  loadImage() {
    var that = this;
    // TODO: find ImagePicker option for excluding base64 response
    ImagePicker.showImagePicker({
      allowsEditing: true,
      cameraType: 'back',
      mediaType: 'photo',
      quality: 1,
      title: 'Select Image',
      storageOptions: {
        waitUntilSaved: true
      },
    }, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const imagePath = response.uri.replace('file://', '');
        that.setState({
          imagePath,
        });
      }
    });
  }

  createPDF() {
    const {
      imagePath,
      title,
    } = this.state;

    const html = `
    <h1>${title}</h1>
    <img src="${imagePath}" />
    `

    console.log(html)
    const options = {
      html, // HTML String
      fileName: 'Survey',
      directory: 'docs',
      height: 800,
      width: 1056,
      padding: 24,
    };

    RNHTMLtoPDF.convert(options).then(filePath => {
      console.log('PDF generated', filePath);

      Share.open({
        title: "Survey PDF",
        message: "",
        url: filePath,
        subject: "",
      });

    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <TextInput style={styles.input} onChangeText={newText => this.setState({title: newText})} value={this.state.title} />
          <TouchableHighlight onPress={this.loadImage.bind(this)}>
            <Text>Load Image</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.createPDF.bind(this)}>
            <Text>Generate PDF</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  input: {
    height: 30,
    width: 150,
    backgroundColor: '#FFFFFF'
  }
});
