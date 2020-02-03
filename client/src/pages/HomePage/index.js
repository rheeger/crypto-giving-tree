import React from "react";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { updateAppTab } from "../../store/actions/appTab";

class HomePage extends React.Component {
  componentDidMount() {
    this.props.updateAppTab("");
  }

  renderButton() {
    if (!this.props.gtFunds) {
      return;
    }
    if (Object.keys(this.props.gtFunds).length === 0) {
      return (
        <Link to="/funds/new" className="ui button compact green">
          <i className="plus circle icon" />
          Create a Fund
        </Link>
      );
    }
    if (Object.keys(this.props.gtFunds).length > 0) {
      return (
        <Link to="/funds" className="ui button compact green">
          See My Funds
        </Link>
      );
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>
          <div style={{}}>
            <div
              style={{
                height: "100vh",
                display: "flex",
                flexFlow: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                maxWidth: "1000",
                margin: "0 auto"
              }}
            >
              <div
                style={{
                  display: "flex-flow",
                  alignItems: "center",
                  margin: "4rem",
                  justifyContent: "center"
                }}
              >
                <p
                  style={{
                    fontFamily: "all-round-gothic",
                    fontWeight: "400",
                    fontSize: "3rem",
                    textAlign: "center"
                  }}
                >
                  Hello, philanthropist.
                </p>
                <div
                  style={{
                    display: "flex-flow",
                    justifyContent: "center",
                    width: "360px",
                    margin: "0 auto"
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <p
                      style={{
                        fontFamily: "all-round-gothic",
                        fontWeight: "600",
                        fontSize: "1.25rem"
                      }}
                    >
                      STEP 1:&nbsp;
                    </p>
                    <p
                      style={{
                        fontFamily: "all-round-gothic",
                        fontWeight: "400",
                        fontSize: "1.25rem"
                      }}
                    >
                      Start your own donor-advised fund
                    </p>
                  </div>
                  <div style={{ display: "flex" }}>
                    <p
                      style={{
                        fontFamily: "all-round-gothic",
                        fontWeight: "600",
                        fontSize: "1.25rem"
                      }}
                    >
                      STEP 2:&nbsp;
                    </p>
                    <p
                      style={{
                        fontFamily: "all-round-gothic",
                        fontWeight: "400",
                        fontSize: "1.25rem"
                      }}
                    >
                      Contribute your cryptocurrency
                    </p>
                  </div>
                  <div style={{ display: "flex" }}>
                    <p
                      style={{
                        fontFamily: "all-round-gothic",
                        fontWeight: "600",
                        fontSize: "1.25rem"
                      }}
                    >
                      STEP 3:&nbsp;
                    </p>
                    <p
                      style={{
                        fontFamily: "all-round-gothic",
                        fontWeight: "400",
                        fontSize: "1.25rem"
                      }}
                    >
                      Extend grants to any organization
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "3rem 0"
                  }}
                >
                  <Link to="/about" className="ui button compact disabled">
                    Learn More
                  </Link>
                  {this.renderButton()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { gtFunds: state.gtFunds, web3: state.web3connect };
};

export default connect(mapStateToProps, { updateAppTab })(HomePage);
