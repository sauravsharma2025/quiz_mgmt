import ReactLogo from "./React_logo1.png"; // Import the image
function Header(props) {
  return (
    <header className="app-header">
      <img src={ReactLogo} alt="Reactlogo" />
      <h1>The {props.title} Quiz</h1>
    </header>
  );
}

export default Header;
