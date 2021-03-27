import { Router, Request, Response, response } from 'express';

const router = Router();

import MailController from '../controllers/mail-controller';
import { IMail } from '../interfaces/mail.interface';
const mailServer = new MailController();

const filterTypes = {
    New: "new",
    AwaitAdmin: "await_admin",
    AwaitEmployee: "await_employee",
    Closed: "closed",
    CannotComplete: "cannot_complete"
}

router.get('/:employeeID', (req: Request, res: Response) => {
    const employeeID = req.params.employeeID;
    const filter = req.query.filter;
    // if it is not a string or undefined, or a string
    if (typeof filter !== "undefined" &&
        (typeof filter !== "string" || !Object.values(filterTypes).includes(filter))) {
        res.status(400).json({
            err: "Bad filter"
        });
    }
    else if (!employeeID) {
        res.status(400).json({
            err: "Malformed request body"
        });
    } else {
        mailServer.getMail(employeeID, filter as string | undefined).then((mailInfo: IMail[]) => {
            res.status(200).json({
                mails: mailInfo
            });
        }).catch((err: any) => {
            res.status(404).json({
                err,
            })
        })
    }
})

router.post('/', (req: Request, res: Response) => {
    const body = req.body;
    if (body === undefined || body === {}) {
        res.status(400).json({
            err: "Malformed request body"
        });
    } else {
        mailServer.createMail(req.body).then((value: number) => {
            res.status(200).json({
                id: value.toString()
            });
        }).catch((err: any) => {
            res.status(404).json({
                err,
            });
        })
    }
});

router.post('/CreateMailRequest', (req: Request, res: Response) => {
    const body = req.body;
    if (body === undefined || body === {}) {
        res.status(400).json({
            err: "Malformed request body"
        })
    } else {
        mailServer.createMailRequest(req.body).then((value: any) => {
            res.status(200).json({
            });
        }).catch((err: any) => {
            res.status(404).json({
                err,
            });
        })
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (!id) {
        res.status(400).json({
            err: "Malformed request body"
        });
    } else {
        mailServer.deleteMail(id).then((affectedRows: number) => {
            res.status(200).json({
                affectedRows,
            });
        })
    }
});

export default router;