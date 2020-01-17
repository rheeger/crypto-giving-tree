import React from "react";
// import './style.css';
import "./heegerreset.css";
import logo from "../../assets/images/CBLogo.png";

class Splash extends React.Component {
  render() {
    return (
      <div>
        <div style={{}}>
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexFlow: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%"
            }}
          >
            <h3
              style={{
                fontWeight: "2rem",
                fontStyle: "italic",
                fontSize: "1.25rem",
                padding: "2rem",
                margin: "2rem 2rem 0rem 2rem",
                textAlign: "center"
              }}
            >
              future home of:
            </h3>
            <h1
              style={{
                fontFamily: "all-round-gothic, sans-serif",
                fontWeight: "600",
                // fontStyle: "italic",
                fontSize: "7rem"
              }}
            >
              endaoment
            </h1>
            <div style={{ display: "flex", margin: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                  textAlign: "center"
                }}
              >
                smart contract charitable funds
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Splash;
