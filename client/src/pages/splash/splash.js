import React from "react";
import endaoment from "../../assets/images/endaoment.svg";
import { Link } from "react-router-dom";

class Splash extends React.Component {
  render() {
    return (
      <div>
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexFlow: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: "1000",
            margin: "12rem auto"
          }}
        >
          <img alt="endaoment" style={{ width: "15rem" }} src={endaoment}></img>
          <p
            style={{
              fontFamily: "all-round-gothic",
              fontWeight: "400",
              fontSize: "5rem",
              textAlign: "center",
              marginTop: "3rem"
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
              marginTop: "-3rem"
            }}
          >
            smart contract donor-advised funds
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem"
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
    );
  }
}

export default Splash;
