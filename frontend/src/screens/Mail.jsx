import '../App.css';
import {Button, Grid, Modal} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../components/global/Title';
import Subheader from '../components/global/Subheader';
import MailModule from '../components/mail/MailModule';
import AllRequestsMailModule from '../components/mail/AllRequestsMailModule';
import NewlyCreatedRequestsMailModule from '../components/mail/NewlyCreatedRequestsMailModule';
import AllRequestsAdminMailModule from '../components/mail/AllRequestsAdminMailModule';
import AllClosedRequestsAdminMailModule from '../components/mail/AllClosedRequestsAdminMailModule';
import React, {useState} from "react";
import NewMailForm from "../components/mail/NewMailForm";
import {useMsal} from "@azure/msal-react";
import {accountIsAdmin} from "../util/Util";
import MailRequestForm from "../components/mail/MailRequestForm";
import RequestModule from "../components/mail/RequestModule";

const useStyles = makeStyles((theme) => ({
    background: {
        background: '#1E1E24',
        flexGrow: 1,
    },
    sectionSpacing: {
        marginBottom: '29px',
    },
    actionButtonCenter: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '15px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
    }

}));

function Mail() {
  const [open, setOpen] = useState(false);

  const { accounts } = useMsal();
  const isAdmin = accountIsAdmin(accounts[0]);

  const classes = useStyles();

  const handleNewMail = () => {
        setOpen(true);
  }

  const closeNewMail = () => {
      setOpen(false);
  }

    const newMailPopup = () => {
        return <NewMailForm closeModal={closeNewMail} whatToDoWhenClosed={(bool) => {setOpen(bool)}}/>
    }

  return (
      <div className={classes.background}>
        <Grid container direction='column' justify='center' alignItems='center'>
            {Title('MAIL MANAGER', 1, 8, 1)}
          <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            {MailModule(4, "NEW MAIL")}
            <Grid item xs={2}></Grid>
            {AllRequestsMailModule(4, "ALL REQUESTS")}
          </Grid>

          {window.innerWidth > 1500 && Subheader('MANAGE REQUESTS', 4, 2, 4)}
          {window.innerWidth <= 1500 && Subheader('MANAGE REQUESTS', 0, 12, 0)}


          <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            {NewlyCreatedRequestsMailModule(3, "NEWLY SUBMITTED MAIL")}
            <Grid item xs={'auto'}></Grid>
            {AllRequestsAdminMailModule(3, "ALL ACTIVE REQUESTS")}
            <Grid item xs={'auto'}></Grid>
            {AllClosedRequestsAdminMailModule(3, "ALL CLOSED REQUESTS")}
          </Grid>
            {isAdmin && <Button className={classes.actionButtonCenter} onClick={handleNewMail}>
            Submit New Mail
          </Button>}
            <Modal
                open={open}
                onClose={closeNewMail}
            >
                {newMailPopup()}
            </Modal>
        </Grid>
      </div>
  );
}

export default Mail;