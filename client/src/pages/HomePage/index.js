import React from "react";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Grid } from "semantic-ui-react";

class HomePage extends React.Component {
  renderButton() {
    if (!this.props.gtFunds) {
      return;
    }
    if (Object.keys(this.props.gtFunds).length === 0) {
      return (
        <Link to="/funds/new" className="ui button basic green">
          <i className="plus circle icon" />
          Start a Fund
        </Link>
      );
    }
    if (Object.keys(this.props.gtFunds).length > 0) {
      return (
        <Link to="/funds" className="ui button basic green">
          <i className="eye icon" />
          My Funds
        </Link>
      );
    }
  }

  render() {
    // if (
    //   this.props.web3.account &&
    //   this.props.web3.account !==
    //     (process.env.REACT_APP_MEW_MAIN ||
    //       process.env.REACT_APP_PEEP_ETH ||
    //       process.env.REACT_APP_BRAVE_WALLET ||
    //       process.env.REACT_APP_GT_ADMIN ||
    //       process.env.REACT_APP_JCF_ADMIN)
    // ) {
    //   history.push("/");
    // }
    return (
      <div>
        <Header />
        <div>
          <Grid className="Container">
            <Grid.Row>
              <Grid.Column
                style={{
                  margin: "5rem auto",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                width={16}
              >
                <div>
                  <h1>A new way to give crypto.</h1>
                  <h3>
                    Create your own charitable fund today. Extend grants to any
                    non-profit organization.
                  </h3>
                  <br />
                  {this.renderButton()}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { gtFunds: state.gtFunds, web3: state.web3connect };
};

export default connect(mapStateToProps)(HomePage);
