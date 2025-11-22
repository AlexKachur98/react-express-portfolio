/**
 * @file guestbook.controller.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Controller logic for guest book entries so authenticated users can sign and view notes.
 */
import GuestbookEntry from '../models/guestbook.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import config from '../../config/config.js';

const sanitizeEntry = (payload = {}) => ({
    displayName: typeof payload.displayName === 'string' ? payload.displayName.trim() : '',
    message: typeof payload.message === 'string' ? payload.message.trim() : ''
});

const entryByID = async (req, res, next, id) => {
    try {
        const entry = await GuestbookEntry.findById(id);
        if (!entry) {
            return res.status(404).json({ error: 'Guest book entry not found' });
        }
        req.guestbookEntry = entry;
        next();
    } catch (_err) {
        return res.status(400).json({ error: 'Could not retrieve guest book entry' });
    }
};

/**
 * @purpose List all guest book entries for authenticated users.
 * @route GET /api/guestbook
 * @access Protected (any signed-in user)
 */
const list = async (_req, res) => {
    try {
        const entries = await GuestbookEntry.find().sort('-updatedAt');
        return res.json(entries);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Create or update the current user's guest book entry.
 * @route POST /api/guestbook
 * @access Protected (any signed-in user)
 */
const sign = async (req, res) => {
    const payload = sanitizeEntry(req.body);
    if (!payload.message) {
        return res.status(400).json({ error: 'A message is required to sign the guest book.' });
    }

    const entryData = {
        user: req.auth._id,
        displayName: payload.displayName || 'Guest',
        message: payload.message
    };

    try {
        const entry = await GuestbookEntry.findOneAndUpdate(
            { user: req.auth._id },
            entryData,
            {
                upsert: true,
                new: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );
        return res.json(entry);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Remove the current user's guest book entry.
 * @route DELETE /api/guestbook
 * @access Protected (any signed-in user)
 */
const removeMine = async (req, res) => {
    try {
        const deleted = await GuestbookEntry.findOneAndDelete({ user: req.auth._id });
        if (!deleted) {
            return res.status(404).json({ error: 'No guest book entry found for your account.' });
        }
        return res.json(deleted);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Remove a specific guest book entry (admin only).
 * @route DELETE /api/guestbook/:entryId
 * @access Protected (admin)
 */
const remove = async (req, res) => {
    try {
        const entry = req.guestbookEntry;
        await entry.deleteOne();
        return res.json(entry);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Deletes ALL guest book entries (dev-only safety).
 * @route DELETE /api/guestbook/all
 * @access Protected (admin, development)
 */
const removeAll = async (_req, res) => {
    try {
        if (config.env !== 'development') {
            return res.status(403).json({ error: "Deleting all guest book entries is only allowed in development." });
        }
        await GuestbookEntry.deleteMany({});
        return res.status(200).json({ message: "All guest book entries have been deleted." });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

export default { list, sign, removeMine, remove, removeAll, entryByID };
