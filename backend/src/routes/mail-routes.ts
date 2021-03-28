import { Router, Request, Response, response } from 'express';

const router = Router();

import MailController from '../controllers/mail-controller';
import { IMail, IMailResponse } from '../interfaces/mail.interface';
const mailServer = new MailController();

const filterTypes = {
    New: "new",
    AwaitAdmin: "await_admin",
    AwaitEmployee: "await_employee",
    Closed: "closed",
    CannotComplete: "cannot_complete"
}

const sortTypes = {
}

router.get('/:employeeID', (req: Request, res: Response) => {
    const employeeID = req.params.employeeID;
    const filter = req.query.filter;
    const sort = req.query.sort;
    // if it is not a string or undefined, or a string
    if (typeof filter !== "undefined" &&
        (typeof filter !== "string" || !Object.values(filterTypes).includes(filter))) {
        res.status(400).json({
            err: "Bad filter"
        });
    }
    // same thing for sort
    if (typeof sort !== "undefined" &&
        (typeof sort !== "string" || !Object.values(sortTypes).includes(sort))) {
        res.status(400).json({
            err: "Bad filter"
        });
    }
    else if (!employeeID) {
        res.status(400).json({
            err: "Malformed request body"
        });
    } else {
        mailServer.getMail(employeeID, filter as string | undefined).then((mailInfo: IMailResponse[]) => {
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

router.post('/requests', (req, res) => {
    const body = req.body;
    if (body === undefined || body.employee_name === null || body.request_type === null) {
        res.status(400).json({
            message: "Malformed request body"
        });
    }
    else {
        mailServer.createRequest(req.body)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.json(err);
            });
    }
});
router.get('/requests/:employeeID', (req, res) => {
    if (!req.params.employeeID) {
        res.status(400).json({
            message: "must provide an employee_ID"
        });
    }
    else {
        mailServer.getAllRequests(req.params.employeeID)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.status(404).json(err);
            });
    }
});

router.delete('/requests', (req, res) => {
    if (!req.body.employee_id || !req.body.mail_id) {
        res.status(400).json({
            message: "malformed request body"
        });
    }
    else {
        mailServer.deleteRequest(req.body)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.status(400).json(err);
            });
    }
});

router.put('/requests', (req, res) => {
    if (!req.body.employee_id || !req.body.mail_id) {
        res.status(400).json({
            message: "malformed request body"
        })
    }
    else {
        mailServer.updateRequest(req)
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.status(400).json(err);
            })
    }
})

export default router;