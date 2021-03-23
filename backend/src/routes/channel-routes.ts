import { Router, Request, Response } from 'express';

const router = Router();

import ChannelController from '../controllers/channel-controller';
import {requestIsAdmin} from "../util";
const channelServer = new ChannelController();

router.get('/', (req: Request, res: Response) => {
    const isAdmin = requestIsAdmin(req.authInfo);
    channelServer.getChannelForEmployee(isAdmin)
        .then((channels: any) => {
            res.json(channels);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.delete('/', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    channelServer.deleteChannel(req.body)
        .then((response: any) => {
            res.json(response);
        })
        .catch((err: any) => {
            res.json(err);
        })
})

router.post('/postAddChannel', (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    channelServer.postAddChannel(req)
        .then((result: any) => {
            res.status(200);
            res.send();
        })
        .catch((err: any) => {
            res.status(401).send({
                message: err
            });
        });
});

export default router