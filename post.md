# Rebuilding a PDF Form with React Native

A few weeks ago a friend of mine had to struggle with a PDF form he often uses and it's crappy user experience on his iPhone.
I thought I could do better with React Native and became interested in the idea of rebuilding the functionality and how this may be achieved with the current ecosystem.
The specs were clear:

- text input: easy
- image select: easy
- generating a PDF: not proven impossible
- PDF with locally saved images on it & without submitting something to a backend: we will see
- sharing the PDF at least by mail: not proven impossible

So my first idea was to build a small prototype. It should prove that one can:

1. Write some text in a field
2. Take an image or select one from the gallery
3. Press a button
4. Open a share dialog with a complete PDF attached

Before I started, I did some research and found that there is no React Native solution for filling existing PDF forms.
There is a native solution for both iOS and Android, but one would have to build the integration.
On my search I stumbled upon another solution: Generating the PDF from HTML.
After a bit of research, I found that the library I use, [react-native-html-to-pdf](https://github.com/christopherdro/react-native-html-to-pdf) uses a web view and the print functionality under the hood.
This means images should be available, but to be certain I still needed to write a prototype:



## The Prototype

First of all, we need the form itself, so the render method of our component looks like this:

```
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
```

There is nothing special here; we use `setState` to save the title and in our `ImagePicker` callback to save the image path.
This is wrapped in the `loadImage` function, which is almost the same as the ones [react-native-image-picker](https://github.com/marcshilling/react-native-image-picker) shows in their README.

The next part would be the PDF generation: `RNHTMLtoPDF.convert(options)` returns a promise, which gets the file path as param of the success callback. The options include the HTML to be rendered, the height and width and the document name and they are listed in greater detail on the readme of [react-native-html-to-pdf](https://github.com/christopherdro/react-native-html-to-pdf).
The feature I liked most was that you might set the directory to `'docs'`. Remember the Documents folder of iOS apps you may see when they are connected to your computer and where you can exchange files with them? Exactly that.

Also small hint: If you are using the Simulator (at least the iOS one, I am not sure about Android here) you may open the file path `RNHTMLtoPDF` returns directly on your computer. This is great for debugging and in this scenario, where I don't have to include a PDF viewer into my app.

So in whole the PDF generation and sharing it looks like this:

```
const {
  imagePath,
  title,
} = this.state;

const html = `
<h1>${title}</h1>
<img src="${imagePath}" />
`

console.log(html);
const options = {
  html, // HTML String
  fileName: 'My little PDF',
  directory: 'docs',
  height: 800,
  width: 1056,
  padding: 24,
};

RNHTMLtoPDF.convert(options).then(filePath => {
  console.log('PDF generated', filePath);

  Share.open({
    title: "Share this!",
    message: "I just wanted to show you this:",
    url: filePath,
    subject: "I am only visible for emails :(",
  });
});
```

The `Share` object we use here comes from [react-native-share](https://github.com/EstebanFuentealba/react-native-share) and opens the native share panel.
As I first approached this part of the problem, I thought this could get quite hard, but it was super nicely solved by react-native-share.

The final solution without any styling looks like this:
![Image of the final solution](http://i.imgur.com/8knwbGB.png)

## Conclusion

The awesome open source community around React Native enabled me to rebuild a PDF form as Android and iOS App.
It took a relatively small amount of code to do so, and I could have built the solution in under an hour if I already knew all these libraries.
If I were to scale this solution for a real app, I would think about using something else then regular template strings to build the markup.
It would be super cool to use React here, if you would like to see a demo implementation, please let me know in the comments.
I am only looking for an excuse to do this, give me one!
Also, I was suprised at how easy it was to include images in the PDF; I initially thought this would be more of a hassle.
