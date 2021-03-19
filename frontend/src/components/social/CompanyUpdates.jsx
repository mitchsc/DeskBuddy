import React from 'react';
import InfiniteScroll from "react-infinite-scroller";
import {withStyles} from "@material-ui/core/styles";
import Endpoint from "../../config/Constants";
import {updatePopup} from "./Popup";
import { Modal } from '@material-ui/core';
import safeFetch from "../../util/Util";

const styles = theme => ({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center'
    },
    titleBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    updateBox: {
        background: '#EEF0F2',
        borderRadius: 10,
        width: '90%',
        height: 82,
        margin: 'auto',
        marginTop: 2,
        marginBottom: 2
    },
    backgroundBox: {
        background: '#FFFCF7',
        borderRadius: 20,
        width: '45%',
        height: 500,
        alignItems: 'center'
    },
    announcementName: {
        paddingLeft: 15,
        paddingTop: 5
    },
    announcementText: {
        paddingLeft: 15
    },
    inputBoxes: {
        marginLeft: 20
    }

});

class CompanyUpdates extends React.Component {

    state = {
        announcementList: [],
        hasMoreAnnouncements: true,
        totalAnnouncements: 0,
        open: false,
        currAnnouncement: null
    };

    componentDidMount() {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/announcement/getTotalAnnouncements", requestOptions)
            .then(response => response.text())
            .then(result => {
                const total = JSON.parse(result);
                this.setState({totalAnnouncements: Number(total)});
            })
            .catch(error => console.log('error', error))
    }

    handleUpdateOpen = (el) => {
        console.log("update is: " + el);
        this.setState({ open: true, currAnnouncement: el});
    }

    handleClose = () => {
        this.setState({ open: false, currAnnouncement: null});
    }

    getAnnouncements(page){
        console.log("called");
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

       safeFetch(Endpoint + "/announcement/getCompanyAnnouncements/" + this.state.announcementList.length, requestOptions)
            .then(response => response.text())
            .then(result => {
                const announcements = JSON.parse(result);
                console.log(announcements);
                this.setState({announcementList: this.state.announcementList.concat(announcements),
                    hasMoreAnnouncements: !(this.state.announcementList.length === this.state.totalAnnouncements)});
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
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {updatePopup(this.state.currAnnouncement)}
                    </Modal>
                )
            } else
                return null;
        }

        return (
            <div className={classes.backgroundBox} style= {{height: '500px', overflow: 'auto'}} ref={(ref) => this.scrollParentRef = ref}>
                <h1 className={classes.title}>COMPANY UPDATES</h1>
                <InfiniteScroll
                    loadMore={this.getAnnouncements.bind(this)}
                    hasMore={this.state.hasMoreAnnouncements}
                    loader={<div className="loader" key={0}>Loading ...</div>}
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
export default withStyles(styles, { withTheme: true })(CompanyUpdates);