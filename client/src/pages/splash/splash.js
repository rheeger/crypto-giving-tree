import React from "react";
// import './style.css';
import "./heegerreset.css";
import endaoment from "../../assets/images/endaoment.svg";

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
              maxWidth: "750px",
              margin: "0 auto"
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
            <img
              alt="endaoment"
              style={{ margin: "2rem 2rem 4rem 2rem" }}
              src={endaoment}
            ></img>
            <div style={{ display: "flex", margin: "2rem" }}>
              <h3
                style={{
                  fontSize: "2rem",
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
