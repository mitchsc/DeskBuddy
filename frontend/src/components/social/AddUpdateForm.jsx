import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Button, MenuItem, TextField, Typography } from "@material-ui/core";
import Endpoint from "../../config/Constants";
import safeFetch from "../../util/Util"
import { useMsal } from "@azure/msal-react";
import { isMobile } from "react-device-detect";
import { fetchOffices } from "../../actions/reservationActions";
import { useDispatch, useSelector } from "react-redux";
import { setError } from '../../actions/globalActions';


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
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
    },
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
    },
    addAnnouncement: {
        position: 'fixed',
        top: '20%',
        left: isMobile ? '5%' : '25%',
        width: isMobile ? '75%' : '45%',
        height: '400',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto'
    },
    officeSelector: {
        marginLeft: 8,
        width: '80%'
    },
    branchTitle: {
        marginLeft: 8,
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14
    }
}));


function AddUpdateForm(props) {

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedOfficeID, setSelectedOfficeID] = useState(0);
    const [selectedOfficeLocation, setSelectedOfficeLocation] = useState("");

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();

    const dispatch = useDispatch();
    const officeList = useSelector(state => state.reservations.offices);

    useEffect(() => {
        dispatch(fetchOffices());
    }, []);

    const handleTitleInput = (input) => {
        setTitle(input.target.value)
    }

    const handleSubtitleInput = (input) => {
        setSubtitle(input.target.value);
    }

    const handleContentInput = (input) => {
        setContent(input.target.value);
    }

    const handleUpdateFormClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleOfficeChange = (event) => {
        if (event.target.value !== 'All') {
            const params = event.target.value.split(['-']);

            setSelectedOfficeLocation(params[0]);
            setSelectedOfficeID(params[1]);
        }
    }

    const handleSubmit = (event) => {

        let jsonBody;
        let requestOptions;

        if (selectedOfficeLocation === "" || selectedOfficeLocation === "All") {
            jsonBody = {
                user: userOID,
                title: title,
                subtitle: subtitle,
                content: content
            };
            console.log(jsonBody);
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonBody)
            };
            safeFetch(Endpoint + "/announcement/postCompanyAnnouncement", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        dispatch(setError(true));
                    }
                    return response.text();
                })
                .then(result => {
                    props.closeModal();
                })
                .catch(error => {
                    console.log('error', error);
                    dispatch(setError(true));
                });
        } else {
            jsonBody = {
                user: userOID,
                title: title,
                subtitle: subtitle,
                content: content,
                office_id: selectedOfficeID,
                office_location: selectedOfficeLocation
            }
            console.log(jsonBody);
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonBody)
            };
            safeFetch(Endpoint + "/announcement/postBranchAnnouncement", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        dispatch(setError(true));
                    }
                    return response.text();
                })
                .then(result => {
                    props.closeModal();
                })
                .catch(error => {
                    console.log('error', error);
                    dispatch(setError(true));
                });

        }
        handleUpdateFormClose();
    }

    return (
        <div className={classes.addAnnouncement} onClose={handleUpdateFormClose}>
            <Typography className={classes.sectionTextModal}>
                Create New Announcement
            </Typography>
            <form>
                <div><TextField
                    id="title"
                    label="Title"
                    style={{ margin: 8 }}
                    placeholder="Announcement Title (25)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 25 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleTitleInput}
                /></div>
                <div><TextField
                    id="subtitle"
                    label="Subtitle"
                    style={{ margin: 8 }}
                    placeholder="Announcement Subtitle (25)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 25 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleSubtitleInput}
                /></div>
                <div><TextField
                    id="content"
                    label="Content"
                    style={{ margin: 8 }}
                    placeholder="Announcement Details (500)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 500 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleContentInput}
                /></div>
                {!props.global && <h1 className={classes.branchTitle}>Branch</h1>}
                {!props.global && <TextField className={classes.officeSelector} id="outlined-basic" variant="outlined" select onChange={(e) => handleOfficeChange(e)}>
                    {officeList.map((option) => (
                        <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>}
                <div>
                    <Button disabled={selectedOfficeID === 0 && selectedOfficeLocation === "" && !props.global || title === ""} className={classes.actionButtonCenter} onClick={handleSubmit}>
                        Post
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default AddUpdateForm;