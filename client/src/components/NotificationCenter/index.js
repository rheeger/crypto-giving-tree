import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";
import { NotificationSpinner } from "../Spinner";
import { PMedium } from "../Typography";
import { Button } from "semantic-ui-react";

const NotificationCenterWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: calc(100% - 100vh + 20px);
  z-index: 100;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NotificationWrapper = styled.div`
  animation: ${fadeIn} 1s linear both;
  width: 560px;
  height: 72px;
  background-color: white;
  border: 1px solid grey;
  border-radius: 5px;
  box-shadow: 0 4px 11px -3px #a59fb7;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const StatusImageWrapper = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationStatus = styled.p`
  font-family: all-round-gothic;
  line-height: 5px;
  letter-spacing: 0.44px;
  margin-top: 0;
`;

const NotificationInfo = styled.p`
  font-family: all-round-gothic;
  font-size: 12px;
  color: blue;
  letter-spacing: 0.15px;
  margin: 0;
`;

const ButtonBlock = styled.div`
  display: flex;
  & > :last-child {
    margin-left: 10px;
  }
`;

const Notification = ({ transaction }) => {
  return (
    <NotificationWrapper>
      <LeftBlock>
        {/* <StatusImage status={status} /> */}
        <InfoBlock>
          <NotificationStatus>STATUS</NotificationStatus>
          <NotificationInfo>INFO</NotificationInfo>
        </InfoBlock>
      </LeftBlock>
      <ButtonBlock>
        <Button target="_blank">BUTTON</Button>
        <Button>CLOSE</Button>
      </ButtonBlock>
    </NotificationWrapper>
  );
};

class NotificationCenter extends React.Component {
  StatusImage = ({ status }) => {
    if (status === "pending") {
      return <NotificationSpinner isSmall={true} />;
    } else return <StatusImageWrapper src={"/images/success.svg"} />;
  };

  // const getStatusSentence = status => {
  //   switch (status) {
  //     case "pending":
  //     default:
  //       return "notification.status.pending";
  //     case "success":
  //       return "notification.status.success";
  //     case "error":
  //       return "notification.status.error";
  //   }
  // };

  render() {
    const { transactions } = this.props.web3;

    if (!transactions.pending[0] || !transactions || !this.props.web3)
      return null;
    return (
      <NotificationCenterWrapper>
        <Notification key={transactions.index} />
      </NotificationCenterWrapper>
    );
  }
}

const mapStateToProps = state => {
  return { web3: state.web3connect };
};

export default connect(mapStateToProps)(NotificationCenter);
