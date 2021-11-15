import router from '../router';
import {Request, Response} from "express";
import {INode} from '../../domain/INode'

const nodeUrl = 'node'

router.route(`/${nodeUrl}`)