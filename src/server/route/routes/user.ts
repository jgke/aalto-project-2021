import { router } from '../router';
import { Request, Response } from 'express';
import { db } from '../../dbConfigs';
import { Registration, Login } from '../../../../types'
import bcrypt from 'bcrypt'

router
    .route('/user/register')
    .post(async (req: Request, res: Response) => {
        try {
            const user: Registration = req.body

            if (!user || !user.username || !user.password) {
                res.status(403).json({ message: 'Missing parameters' })
                return;
            }


            const saltRounds = 10
            const hash = await bcrypt.hash(user.password, saltRounds)
            const q = await db.query('SELECT username FROM users WHERE username=$1', [user.username])
            if (q.rowCount == 0) {
                await db.query(
                    'INSERT INTO users (username, password) VALUES ($1, $2)', [user.username, hash]
                )
                res.status(200).json();
            } else {
                res.status(403).json({ message: `The user ${user.username} already exists` })
            }


        } catch (e) {
            console.log(e)
            res.status(404).json();
        }
    });
router
     .route('/user/login')
     .post(async (req: Request, res: Response) => {
        try {
            const user: Login = req.body

            if (!user || !user.email || !user.password) {
                res.status(403).json({ message: 'Missing parameters' })
                return;
            }
        
            const q = await db.query('SELECT password FROM users WHERE username=$1', [user.email])
            if (q.rowCount == 0) {
                res.status(403).json({ message: `The user ${user.email} does not exist` })
            } else {
                if (true) {
                    //authentication stuff above^?
                    res.status(200).json({message: `Logged in as ${user.email}`});
                    console.log('ok')
                } else {
                    res.status(403).json({ message: `Incorrect password`})
                }
            }
        
        

         
            
        } catch (e) {
            console.log(e)
            res.status(404).json();
        }
     })

export { router as user }