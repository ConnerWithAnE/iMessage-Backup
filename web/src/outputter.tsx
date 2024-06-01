
import './App.css'
import Chat from "./components/Chat";
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';


function App() {

  return (
    <div>
    <Chat id={265}/>
    </div>
  )
}

const htmlString = ReactDOMServer.renderToString(<App />);

// Write the HTML string to a file
fs.writeFile('output.html', htmlString, function (err: any) {
  if (err) throw err;
  console.log('HTML file has been saved!');
});


export default App