import React from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  Web3Connect,
  startWatching,
  initialize
} from "../../store/reducers/web3connect";
import { setAddresses } from "../../store/reducers/swapAddresses";

class Header extends React.Component {
  componentDidMount() {
    const { initialize, startWatching } = this.props;
    initialize().then(startWatching);
  }

  componentDidUpdate() {
    const { web3, setAddresses } = this.props;

    if (
      this.hasSetNetworkId ||
      !web3 ||
      !web3.eth ||
      !web3.eth.net ||
      !web3.eth.net.getId
    ) {
      return;
    }

    web3.eth.net.getId((err, networkId) => {
      if (!err && !this.hasSetNetworkId) {
        setAddresses(networkId);
        this.hasSetNetworkId = true;
      }
    });
  }

  renderButton() {
    if (!this.props.gtFunds) {
      return;
    }
    if (Object.keys(this.props.gtFunds).length === 0) {
      return (
        <Link
          to="/funds/new"
          className="ui button green"
          style={{ margin: "1rem auto", padding: "10px" }}
        >
          <i className="plus circle icon" />
          Start a Fund
        </Link>
      );
    }
    if (Object.keys(this.props.gtFunds).length > 0) {
      return (
        <Link
          to="/funds"
          className="ui button green"
          style={{ margin: "1rem auto", padding: "10px" }}
        >
          <i className="eye icon" />
          My Funds
        </Link>
      );
    }
  }

  render() {
    return (
      <div>
        <Web3Connect />
        <Menu style={{ margin: "1rem" }}>
          <Link to="/alpha" className="item">
            <h1
              style={{
                fontFamily: "all-round-gothic, sans-serif",
                fontWeight: "500",
                fontStyle: "normal",
                fontmargin: "0 auto",
                fontSize: "2rem"
              }}
            >
              endaoment
            </h1>
          </Link>

          <Menu.Menu position="right">
            <h6 style={{ paddingRight: "2rem", color: "red" }}>
              THIS IS A DEMO, USE AT YOUR OWN RISK!
            </h6>
            {this.renderButton()}
            <Link
              to="/orgs"
              style={{ margin: "1rem", padding: "10px" }}
              className="ui button blue"
            >
              <i className="sistrix medium icon" />
              Organizations
            </Link>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds,
    web3: state.web3connect,
    account: state.web3connect.account,
    initialized: state.web3connect.initialized
  };
};

export default connect(mapStateToProps, dispatch => ({
  setAddresses: networkId => dispatch(setAddresses(networkId)),
  initialize: () => dispatch(initialize()),
  startWatching: () => dispatch(startWatching())
}))(Header);
