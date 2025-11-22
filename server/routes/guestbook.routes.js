/**
 * @file guestbook.routes.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines API endpoints for guest book actions, accessible to signed-in users.
 */
import express from 'express';
import guestbookCtrl from '../controllers/guestbook.controller.js';
import { requireSignin, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/guestbook')
    .get(requireSignin, guestbookCtrl.list)
    .post(requireSignin, guestbookCtrl.sign)
    .delete(requireSignin, guestbookCtrl.removeMine);

router.route('/guestbook/all')
    .delete(requireSignin, requireAdmin, guestbookCtrl.removeAll);

router.route('/guestbook/:entryId')
    .delete(requireSignin, requireAdmin, guestbookCtrl.remove);

router.param('entryId', guestbookCtrl.entryByID);

export default router;
