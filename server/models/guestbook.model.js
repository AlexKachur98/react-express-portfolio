/**
 * @file guestbook.model.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines the Mongoose schema for guest book entries signed by authenticated users.
 */
import mongoose from 'mongoose';

const GuestbookEntrySchema = new mongoose.Schema({
    displayName: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    message: {
        type: String,
        trim: true,
        required: 'Message is required'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('GuestbookEntry', GuestbookEntrySchema);
