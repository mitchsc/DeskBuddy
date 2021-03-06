import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import reservationRoute from './routes/reservation-routes';
import officeRoute from './routes/office-routes';
import floorRoute from './routes/floor-routes';
import deskRoute from './routes/desk-routes';
import announcementRoute from './routes/announcement-routes';
import locationRoute from './routes/location-routes';
import postRoute from './routes/posts-routes';
import channelRoute from './routes/channel-routes';
import authRoute from './routes/auth-routes';
import userRoute from './routes/user-routes';
import mailRoute from './routes/mail-routes';
import requestRoute from './routes/request-routes';
import DB from './config/db-handler';

export class DeskbuddyServer {
  private app: any;
  private port: number;
  private handler: any;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(authRoute);

    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello DeskBuddy!');
    });

    this.app.use('/user', userRoute);
    this.app.use('/reservation', reservationRoute);
    this.app.use('/office', officeRoute);
    this.app.use('/floor', floorRoute)
    this.app.use('/desk', deskRoute);
    this.app.use('/location', locationRoute);
    this.app.use('/post', postRoute);
    this.app.use('/channel', channelRoute);
    this.app.use('/announcement', announcementRoute);
    this.app.use('/mail', mailRoute);
    this.app.use('/request', requestRoute);
  }

  public getApp() {
    return this.app;
  }

  public start(): Promise<boolean> {
    return new Promise((fulfill, reject) => {
      const listenPromise = new Promise((listenFulfill, listenReject) => {
        try {
          this.handler = this.app.listen(this.port, () => {
            console.log(`Server is listening on ${this.port}`);
            listenFulfill(true);
          });
        } catch (err) {
          console.log(err);
          listenReject(err);
        }
      });
      const DBPromise = new Promise((dbFulfill, dbReject) => {
          DB.createCon().then(output => {
            if (output === true) {
              dbFulfill(true);
            } else {
              dbReject(output);
            }
          })
      });
      const promiseArray = [listenPromise, DBPromise];
      return Promise.all(promiseArray).then((allPromises) => {
        fulfill(true);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public stop(): Promise<boolean> {
    return new Promise((fulfill) => {
      const serverClose = new Promise((serverFulfill) => {
        this.handler.close(() => {
          console.log("Server stopped listening at: ", this.port)
          serverFulfill(true);
        });
      });
      const dbClose = new Promise((dbFulfill) => {
        DB.closeDB().then(() => {
          console.log("Database connection successfully terminated");
          dbFulfill(true);
        });
      });
      const promiseArray = [serverClose, dbClose];
      return Promise.all(promiseArray).then((allPromises) => {
        fulfill(true);
      });
    });
  }
}
