import React from "react";
import { connect } from "react-redux";
import { Menu, Button, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { startWatching, initialize } from "../../store/reducers/web3connect";
import { setAddresses } from "../../store/reducers/swapAddresses";
import NotificationCenter from "../NotificationCenter";
import endaoment from "../../assets/images/endaoment.svg";
import history from "../../history";

import "./main.css";

class Header extends React.Component {
  componentDidMount() {
    const { initialize, startWatching, setAddresses } = this.props;
    try {
      initialize()
        .then(startWatching)
        .then(setAddresses(process.env.REACT_APP_NETWORK_ID));
    } catch (err) {
      console.log(err);
    }
    this.hasSetNetworkId = true;
  }

  truncateAccount() {
    const { account } = this.props;
    return account.slice(0, 4) + "..." + account.slice(-4);
  }

  renderAccount() {
    const { account, initialized } = this.props;

    if (!account && !initialized) {
      return (
        <Button
          style={{
            margin: "1rem 0rem 1rem 0",
            padding: "10px 0px 10px 15px",
            borderRadius: "5px 0px 0 5px",
            borderLeftWidth: "0px"
          }}
          floated="left"
          className="ui button basic grey"
          loading
        >
          Connecting
        </Button>
      );
    }

    return (
      <Link to={`/funds`}>
        <Button
          animated
          style={{
            margin: "1rem 0rem 1rem 0",
            padding: "10px 20px 10px 20px",
            borderRadius: "5px 0px 0 5px",
            borderLeftWidth: "0px"
          }}
          floated="left"
          color="green"
          // basic={this.props.appTab === "funds" ? false : true}
        >
          <Button.Content visible>
            <i className="user circle icon" />
            {this.truncateAccount()}
          </Button.Content>
          <Button.Content hidden>
            <i className="arrow right icon" />
            View Account
          </Button.Content>
        </Button>
      </Link>
    );
  }

  render() {
    const whitelist = [
      process.env.REACT_APP_MEW_MAIN,
      process.env.REACT_APP_PEEP_ETH,
      process.env.REACT_APP_BRAVE_WALLET,
      process.env.REACT_APP_GT_ADMIN
    ];
    if (
      this.props.web3.account &&
      !whitelist.includes(this.props.web3.account)
    ) {
      history.push("/");
    }
    return (
      <div className="ui container">
        <Menu style={{ margin: "1rem" }}>
          <Link to="/alpha" className="item">
            <img
              alt="endaoment"
              style={{ width: "10rem", height: "2rem" }}
              src={endaoment}
            ></img>
          </Link>

          <Menu.Menu></Menu.Menu>
          <Menu.Menu position="right">
            <Message
              negative
              floating
              size="mini"
              style={{ padding: "10px", margin: "1rem 6.5rem 1rem 1rem" }}
            >
              <i className="exclamation triangle icon red" />
              THIS IS A {process.env.REACT_APP_NETWORK_NAME} DEMO — USE AT YOUR
              OWN RISK
            </Message>
            <Button.Group>
              {this.renderAccount()}
              <Link to={`/orgs`}>
                <Button
                  animated
                  style={{
                    margin: "1rem 1rem 1rem 0",
                    padding: "10px 20px 10px 17px",
                    borderRadius: "0px 5px 5px 0px",
                    borderRightWidth: "0"
                  }}
                  floated="right"
                  color="blue"
                  // basic={this.props.appTab === "orgs" ? false : true}
                >
                  <Button.Content visible>
                    <i className="sistrix medium icon" />
                    Organizations
                  </Button.Content>
                  <Button.Content hidden color="blue">
                    <i className="arrow right icon" />
                    Search Orgs
                  </Button.Content>
                </Button>
              </Link>
            </Button.Group>
          </Menu.Menu>
        </Menu>

        <NotificationCenter></NotificationCenter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    appTab: state.appTab,
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
