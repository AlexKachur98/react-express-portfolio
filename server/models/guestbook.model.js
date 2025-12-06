/**
 * @file guestbook.model.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines the Mongoose schema for guest book entries signed by authenticated users.
 */
import mongoose from 'mongoose';

const GuestbookEntrySchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            trim: true,
            required: 'Name is required',
            maxlength: [100, 'Display name cannot exceed 100 characters']
        },
        message: {
            type: String,
            trim: true,
            required: 'Message is required',
            maxlength: [2000, 'Message cannot exceed 2000 characters']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
            required: true
        }
    },
    { timestamps: true }
);

// Index for sorting by update time (most common query pattern)
GuestbookEntrySchema.index({ updatedAt: -1 });

export default mongoose.model('GuestbookEntry', GuestbookEntrySchema);
