import { Button, MenuItem, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { isMobile } from "react-device-detect";
import safeFetch, { accountIsAdmin } from "../../util/Util";
import Endpoint from "../../config/Constants";
import { useMsal } from "@azure/msal-react";
import { setError } from "../../actions/globalActions";
import { useDispatch, useSelector } from "react-redux";
import { getNewMailAdmin, getNewMailAll, getNewMailClosed, getNewMailReq } from "../../actions/mailActions";

const useStyles = makeStyles((theme) => ({
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
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
    },
    inputBoxes: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: 10
    },
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center'
    },
    makeRequest: {
        position: 'fixed',
        top: '20%',
        left: isMobile ? '5%' : '25%',
        width: isMobile ? '75%' : '45%',
        height: '400',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto'
    },
    subheading: {
        fontFamily: 'Lato',
        marginRight: 20,
        marginLeft: 8,
        marginBottom: 5
    }

}));

function MailResponseForm(props){

    const data = JSON.parse(props.children.data);
    console.log(data);

    const filter = useSelector(state => state.mail.allReqFilter);

    const [response, setResponse] = useState("");
    const dispatch = useDispatch();

    const classes = useStyles();

    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);
    const userOID = accounts[0].idTokenClaims.oid;

    const handleResponseInput = (event) => {
        setResponse(event.target.value);
    }

    const handleResponseFormClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleAdminResponse = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let adminBody = {
            mail_id: data.mailID,
            admin_eid: userOID,
            response: response
        }
        const adminOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(adminBody),
            redirect: 'follow'
        };
        safeFetch(Endpoint + "/request/admin", adminOptions)
            .then(response => {
                if (!response.ok) {
                    dispatch(setError(true));
                }
                return response.text();
            })
            .then(result => {
                dispatch(getNewMailAll(userOID, filter));
                dispatch(getNewMailReq());
                dispatch(getNewMailAdmin());
                dispatch(getNewMailClosed());
            })
            .catch(error => {
                console.log('error', error);
                dispatch(setError(true));
            });

        handleResponseFormClose();

    }

    const handleUserResponse = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let employeeBody = {
            mail_id: data.mailID,
            employee_id: userOID,
            employee_phone: null,
            request_type: "",
            forward_location: "",
            additional_instruction: response,
            req_completion_date: ""
        }
        const employeeOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(employeeBody)
        };

        safeFetch(Endpoint + "/request/employee", employeeOptions)
            .then(response => {
                if (!response.ok) {
                    dispatch(setError(true));
                }
                return response.text();
            })
            .then(result => {
            })
            .catch(error => {
                console.log('error', error);
                dispatch(setError(true));
            });

        handleResponseFormClose();

    }

    return (
        <div className={classes.makeRequest}>
            <Typography className={classes.sectionTextModal}>
                Request Response Form
            </Typography>
            {isAdmin && <Typography className={classes.subheading}>
                Employee Name: {data.recipient_first + " " + data.recipient_last}
            </Typography>}
            <Typography className={classes.subheading}>
                Request Type: {data.request_type}
            </Typography>
            <Typography className={classes.subheading}>
                Forwarding Location: {data.forward_location || "N/A"}
            </Typography>
            <Typography className={classes.subheading}>
                Additional Instructions: {data.comments}
            </Typography>
            {!isAdmin && <Typography className={classes.subheading}>
                Admin Response:
            </Typography>}
            <form>
                <div><TextField
                    id="location"
                    style={{ marginTop: 20 }}
                    placeholder="Response"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleResponseInput}
                /></div>
                <div>
                    {isAdmin && <Button className={classes.actionButtonCenter} onClick={handleAdminResponse}>
                        Update
                    </Button>}
                </div>
                <div>
                    {!isAdmin && <Button className={classes.actionButtonCenter} onClick={handleUserResponse}>
                        Request More Assistance
                    </Button>}
                </div>
            </form>
        </div>
    )

}

export default MailResponseForm;