interface buttonProps{
    onButtonClick:()=>void
}


const Button = ({onButtonClick}: buttonProps) => {
  return (
    <button type="button" 
    className="btn btn-outline-primary"
    onClick= {()=>
    onButtonClick()}>
    Button
    </button>
  );
};

export default Button;
