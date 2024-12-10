
import "./App.css";
import Button from "./Alert";


const handleButtonPress= ()=>{
  return console.log("Button Pressed");
}

function App() {
  return (
    <div>
      <Button onButtonClick={handleButtonPress}></Button>
    </div>
  );
}

export default App;
