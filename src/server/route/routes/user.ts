import { router } from '../router';
import { Request, Response } from 'express';
import { db } from '../../dbConfigs';
import { Login, Registration } from '../../../../types';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

router.route('/user/register').post(async (req: Request, res: Response) => {
    const user: Registration = req.body;

    if (!user || !user.username || !user.password || !user.email) {
        res.status(403).json({ message: 'Missing parameters' });
        return;
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(user.password, saltRounds);
    const q = await db.query('SELECT username FROM users WHERE username=$1', [
        user.username,
    ]);
    if (q.rowCount == 0) {
        await db.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
            [user.username, hash, user.email]
        );
        res.status(200).json();
    } else {
        res.status(403).json({
            message: `The user ${user.username} already exists`,
        });
    }
});

router.route('/user/login').post(async (req: Request, res: Response) => {
    const body: Login = req.body;

    console.log('Login body', body);

    const { rows, rowCount } = await db.query(
        'SELECT * FROM users WHERE email=$1',
        [body.email]
    );

    if (rowCount == 0) {
        console.log('User not found!');
        res.status(401).json({ message: 'Wrong email or password' });
        return;
    } else if (rowCount >= 2) {
        res.status(403).json({
            message: 'More than one user! Please contact support!',
        });
        return;
    }

    const user = rows[0];
    const passCorrect = await bcrypt.compare(body.password, user.password);

    if (!passCorrect) {
        console.log('Password was wrong');
        res.status(401).json({ message: 'Wrong email or password' });
        return;
    }

    // Cannot give a type. Might have to do some validation
    const userForToken = {
        email: user.email,
        id: user.id,
    };

    const token = jwt.sign(
        userForToken,
        process.env.SECRET ? process.env.SECRET : ''
    );

    res.status(200).json({ token, username: user.username, email: user.email });
});

export { router as user };
