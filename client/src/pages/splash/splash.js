import React from "react";
import endaoment from "../../assets/images/endaoment.svg";
import { Link } from "react-router-dom";

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
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "1000",
              margin: "0 auto"
            }}
          >
            <img
              alt="endaoment"
              style={{ width: "15rem" }}
              src={endaoment}
            ></img>
            <div
              style={{
                display: "flex-flow",
                alignItems: "center",
                margin: "5rem",
                justifyContent: "center"
              }}
            >
              <p
                style={{
                  fontFamily: "all-round-gothic",
                  fontWeight: "400",
                  fontSize: "5rem",
                  textAlign: "center"
                }}
              >
                A new way to give.
              </p>
              <p
                style={{
                  fontFamily: "all-round-gothic",
                  fontWeight: "400",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  margin: "5rem 0"
                }}
              >
                smart contract donor-advised funds
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "8rem 0"
                }}
              >
                <Link to="/about" className="ui button compact">
                  Learn More
                </Link>
                <Link to="/alpha" className="ui button compact green">
                  Try the Alpha
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Splash;
