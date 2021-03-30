import React, { useEffect, useState } from 'react';
import { Typography, Grid, ListItem, Divider, Button } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import {Typography, Grid, ListItem, Divider, Modal} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";
import MailNotification from './MailNotification';
import MailRequestForm from "./MailRequestForm";
import safeFetch from "../../util/Util";
import Endpoint from "../../config/Constants";
import {useMsal} from "@azure/msal-react";
import MailResponseForm from "./MailResponseForm";


const useStyles = makeStyles({
    sectionText: {
        color: 'white',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20
    },
    deskSectionText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deskText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        display: 'inline'
    },
    officeText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 16,
        textAlign: 'center'
    },
    reservationCard: {
        backgroundColor: '#E5E5E5',
        height: '110px',
        marginBottom: '10px'
    },
    reservationCardTruncated: {
        backgroundColor: '#E5E5E5',
        height: '110px',
        marginBottom: '10px',
        '&:hover': {
          backgroundColor: '#FFFCF7'
        }
    },
    reservationCardExpanded: {
        backgroundColor: '#E5E5E5',
        height: '180px',
        marginBottom: '10px',
        '&:hover': {
          backgroundColor: '#FFFCF7'
        }
    },
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    },
});


function MailModule(size, text) {
    const [open, setOpen] = useState(false);
    const [mailList, setMailList] = useState([]);
    const [currMail, setCurrMail] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const classes = useStyles();


    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

    console.log(accounts[0]);

    useEffect( () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/mail/" + userOID, requestOptions)
            .then((response) => response.text())
            .then(result => {
                const mail = JSON.parse(result).mails;
                setMailList(mail);
            })
            .catch(error => console.log('error', error));
    });

    const handleMailRequest = (item) => {
        setOpen(true);
        setCurrMail(item);
    }
    const mockData = ["ABC", "DEFG", "HIJ", "KLM", "NOP", "QRS", "TUV"];
    const getNotifClass = () => {
        return isExpanded ? classes.reservationCardExpanded : classes.reservationCardTruncated;
    }

    let expandedNotif;
    if (isExpanded) {
        expandedNotif = <div>
            <Typography>HELLO</Typography>
            <Button className={classes.actionButton}>Button 1</Button>
        </div>
    }

    const closeMailRequest = () => {
        setOpen(false);
        setCurrMail(false);
    }

    const mailRequestPopup = () => {
        return <MailRequestForm closeModal={closeMailRequest} whatToDoWhenClosed={(bool) => {setOpen(bool)}}>{currMail}</MailRequestForm>
    }

    let mail = [];
    mailList.map((update, i) => {
        mail.push(
            <ListItem className={classes.reservationCard} key={mailList[i].mail_id}>
                <div style={{ width: '25%', height: '100px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography className={classes.officeText}>
                        {mailList[i].type}
                    </Typography>
                </div>
                <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '90px', width: '3px' }} />
                <div style={{ width: '80%', height: '90px', alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 30 }}>
                    <div style={{ width: '60%', height: '100px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }} onClick={() => handleMailRequest(update)}>
                        <Typography className={classes.deskSectionText}>
                            MAIL ID: <Typography className={classes.deskText}>
                            {mailList[i].mailID}
                        </Typography>
                        </Typography>
                        <Typography className={classes.deskSectionText}>
                            DATE ARRIVED: <Typography className={classes.deskText}>
                            {mailList[i].approx_date}
                        </Typography>
                        </Typography>
                    </div>
                </div>
            </ListItem>
        );
    });

    return (
        <Grid item xs={size} style={{ height: '500px', borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null, overflowY: 'scroll' }}>
            <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: '20%', height: 30, textAlign: 'center', marginTop: -10, fontSize: 20, position: 'absolute' }}>{text}</h1>
            <InfiniteScroll
                style={{ padding: 30, width: '90%' }}
                useWindow={false}
            >
                {mockData.map((option) => {
                    return (
                        <MailNotification data={option}></MailNotification>
                    )
                })}
            </InfiniteScroll>
        </Grid>

    );
}

export default MailModule;