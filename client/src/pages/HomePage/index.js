import React from "react";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import history from "../../history";

class HomePage extends React.Component {
  renderManager() {
    if (!this.props.gtTrees.Object) {
      return "Plant a Tree";
    }
    if (Object.keys(this.props.gtTrees).length > 0) {
      return "View My Trees";
    }
  }

  render() {
    if (
      this.props.web3.account &&
      this.props.web3.account !==
        (process.env.REACT_APP_MEW_MAIN ||
          process.env.REACT_APP_PEEP_ETH ||
          process.env.REACT_APP_BRAVE_WALLET ||
          process.env.REACT_APP_GT_ADMIN ||
          process.env.REACT_APP_JCF_ADMIN)
    ) {
      history.push("/");
    }
    return (
      <div>
        <Header />
        <div>
          <Grid className="Container">
            <Grid.Row>
              <Grid.Column
                style={{
                  margin: "0px auto",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh"
                }}
                width={16}
              >
                <div>
                  <h1>Plant a Giving Tree today.</h1>
                  <h3>
                    Create your own charitable fund. Extend grants to qualifying
                    non-profit organizations.
                  </h3>
                  <br />
                  <Link to="/trees/new" className="ui button green">
                    <i className="plus circle icon" />
                    {this.renderManager()}
                  </Link>
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
  return { gtTrees: state.gtTrees, web3: state.web3connect };
};

export default connect(mapStateToProps)(HomePage);
