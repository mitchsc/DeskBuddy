import DB from '../config/db-handler';
import { IChannel } from '../interfaces/channel.interface';
const con = DB.getCon();


export const Channel = function (this: any, channel: any) {
    this.channel_id = channel.channel_id;
    this.channel_name = channel.name;
    this.channel_icon = channel.icon;
};

Channel.getAllChannelsForUser = (isAdmin: boolean, result: any) => {
    if (isAdmin) {
        con.query("SELECT * FROM channel", (err: any, res: any) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
            } else {
                // console.log(res);
                result(null, res);
            }
        })
    }
    else {
        con.query("SELECT * FROM channel WHERE channel_id != 0", (err: any, res: any) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
            } else {
                // console.log(res);
                result(null, res);
            }
        })
    }
};

Channel.deleteChannel = (req: any, result: any) => {
    con.query("DELETE FROM channel WHERE ? = channel_id",[
        req.channel_id,
    ], (err: any, res: any) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            // console.log(res);
            result(null, res);
        }
    })
}

Channel.addChannel = (channel: IChannel, result: any) => {
    con.query("INSERT INTO channel (channel_name, channel_icon) VALUES (?, ?);" ,
        [
            channel.title,
            Buffer.from(channel.image, 'base64')
        ], (err: any, res: any) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
            } else {
                result(null, res.insertId);
            }
    })
}