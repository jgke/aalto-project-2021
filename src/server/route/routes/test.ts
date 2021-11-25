import {userInfo} from 'os';
import router from '../router';
import {Request, Response} from "express";
import {IError} from '../../domain/IError';
//import {db} from '../../dbConfigs'; //to be used

router.route('/test')
    .get((req: Request, res: Response) => {
        const {username}: {username: string} = userInfo();
        if (!username) {
            const error : IError = {
                status: 500,
                message: "Something bad happend!"
            }
            res.status(error.status).json(error);
        }
        res.json({username});
    })
    .post(async (req: Request, res: Response) => {
        const { text } = req.body;
        console.log(text)
        res.status(200).json({text});
    })
    .put((req: Request, res: Response) => {
        res.status(500).json({message: "Not implemented"});
    })
    .delete((req: Request, res: Response) => {
        res.status(500).json({message: "Not implemented"});
    });

export default router;
