import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Button, MenuItem, TextField } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroller";
import Endpoint from "../../config/Constants";
import { updatePopup } from "./UpdatePopup";
import { Modal } from '@material-ui/core';
import safeFetch from "../../util/Util";
import { isMobile } from "react-device-detect";
import AddUpdateForm from './AddUpdateForm';

const styles = theme => ({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center',
        marginLeft: isMobile ? 10 : 50,
    },
    titleBox: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    updateBox: {
        // background: '#EEF0F2',
        // borderRadius: 10,
        width: '90%',
        height: 82,
        margin: 'auto',
        marginTop: 2,
        marginBottom: '10px',

        background: '#EEF0F2',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        borderRadius: '5px',
    },
    backgroundBox: {
        background: '#FFFCF7',
        borderRadius: 20,
        width: isMobile ? '95%' : '85%',
        marginLeft: isMobile ? 0 : 40,
        height: 500,
        alignItems: 'center'
    },
    announcementName: {
        // fontSize: isMobile ? 19 : 26,
        paddingLeft: 15,
        paddingTop: 5,

        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: isMobile ? '15px' : '20px',
        lineHeight: '18px',
        display: 'flex',
        alignItems: 'center',
        color: '#000000',
    },
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginBottom: '10px',
        marginRight: isMobile ? 10 : 0,
        marginLeft: isMobile ? 0 : 10,
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18,
    },
    announcementText: {
        // fontSize: isMobile ? 16 : 20,
        paddingLeft: 15,
        paddingBottom: 5,

        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: isMobile ? '12px' : '15px',
        lineHeight: '12px',
        display: 'flex',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.8)',
    },
    officeSelector: {
        marginRight: isMobile ? 15 : 0,
        marginLeft: !isMobile ? 5 : 0,
        width: !isMobile ? '' : '140px',
        marginBottom: isMobile ? 15 : 0,
    }

});

class BranchUpdates extends React.Component {

    state = {
        announcementList: [],
        hasMoreAnnouncements: true,
        totalAnnouncements: 0,
        selectedOfficeID: 0,
        selectedOfficeLocation: "All",
        officeList: [],
        open: false,
        currAnnouncement: null,
        addAnnouncement: false
    };

    handleUpdateOpen = (el) => {
        console.log("update is: " + el);
        this.setState({ open: true, currAnnouncement: el });
    }

    handleClose = () => {
        this.setState({ open: false, currAnnouncement: null });
    }

    handleOfficeChange(event) {

        if (event.target.value !== 'All') {
            const params = event.target.value.split(/-(?=[^-]+$)/);

            this.setState({ selectedOfficeLocation: params[0], selectedOfficeID: params[1], announcementList: []});

            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            this.setState({hasMoreAnnouncements: true});

            setTimeout(() => {
                safeFetch(Endpoint + "/announcement/getBranchAnnouncements/"
                    + this.state.selectedOfficeLocation + "/" + this.state.selectedOfficeID, requestOptions)
                    .then((response) => response.text())
                    .then(result => {
                        const announcements = JSON.parse(result);
                        console.log(announcements);
                        this.setState({
                            announcementList: announcements,
                            hasMoreAnnouncements: false
                        });
                    })
                    .catch(error => console.log('error', error));

            }, 1000);

        } else {
            this.setState({ announcementList: [] });
            this.getAnnouncements();
        }
    };

    handleAddUpdateClose = () => {
        this.setState({addAnnouncement: false, announcementList: []});
        this.getAnnouncements();
    }

    handleAddUpdateOpen = () => {
        this.setState({addAnnouncement: true});
    }

    addUpdateBody = () => {
        return <AddUpdateForm closeModal={this.handleAddUpdateClose} whatToDoWhenClosed={(bool) => {
            this.setState({addAnnouncement: bool, announcementList: []});
            this.getAnnouncements();
        }} global={false} />
    }

    componentDidMount() {
        const officeOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/office/getAllOffices", officeOptions)
            .then((response) => response.text())
            .then(result => {
                this.setState({ officeList: JSON.parse(result) });
            })
            .catch(error => console.log('error', error));

        this.getAnnouncements();
    }

    getAnnouncements() {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        safeFetch(Endpoint + "/announcement/getAllBranchAnnouncements", requestOptions)
            .then(response => response.text())
            .then(result => {
                const announcements = JSON.parse(result);
                console.log(announcements);
                this.setState({
                    announcementList: announcements,
                    hasMoreAnnouncements: false
                });
            })
            .catch(error => console.log('error', error))
    }

    render() {
        const { classes } = this.props;

        let announcements = [];
        this.state.announcementList.map((update, i) => {
            announcements.push(
                <div className={classes.updateBox} key={i} onClick={() => this.handleUpdateOpen(update)}>
                    <h2 className={classes.announcementName}>{this.state.announcementList[i].title}</h2>
                    <h3 className={classes.announcementText}>{this.state.announcementList[i].sub_title}</h3>
                </div>
            );
        });

        const popup = () => {
            if (this.state.open) {
                return (
                    <Modal
                        open={this.state.open}
                        onClose={this.handleClose}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {updatePopup(this.state.currAnnouncement)}
                    </Modal>
                )
            } else
                return null;
        }

        return (
            <div className={classes.backgroundBox} style={{ height: '500px', overflow: 'auto' }} ref={(ref) => this.scrollParentRef = ref}>
                <div className={classes.titleBox}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: isMobile ? 'center' : 'space-between', alignItems: 'center'}}>
                        <h1 className={classes.title}>BRANCH UPDATES</h1>
                        <TextField className={classes.officeSelector} id="outlined-basic" label="" variant="outlined" select onChange={(e) => this.handleOfficeChange(e)} defaultValue={'All'}>
                            <MenuItem key={'All'} value={'All'}>
                                All
                            </MenuItem>
                            {this.state.officeList.map((option) => (
                                <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    {this.props.isAdmin && <Button className={classes.actionButton} onClick={this.handleAddUpdateOpen}>Add</Button>}
                    <Modal
                        open={this.state.addAnnouncement}
                        onClose={this.handleAddUpdateClose}
                    >
                        {this.addUpdateBody()}
                    </Modal>

                </div>
                <InfiniteScroll
                    useWindow={false}
                    getScrollParent={() => this.scrollParentRef}
                >
                    {popup()}
                    {announcements}
                </InfiniteScroll>
            </div>
        );
    }

}
export default withStyles(styles, { withTheme: true })(BranchUpdates);