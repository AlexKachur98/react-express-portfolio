/**
 * @file contact.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Contact collection.
 */
import mongoose from 'mongoose';

// Note: This model is based on the 'contact' form fields from Assignment 1
const ContactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: 'First name is required',
            maxlength: [100, 'First name cannot exceed 100 characters']
        },
        lastName: {
            type: String,
            trim: true,
            required: 'Last name is required',
            maxlength: [100, 'Last name cannot exceed 100 characters']
        },
        email: {
            type: String,
            trim: true,
            match: [/.+@.+\..+/, 'Valid email required'],
            required: 'Email is required',
            maxlength: [255, 'Email cannot exceed 255 characters']
        },
        message: {
            type: String,
            trim: true,
            required: 'Message is required',
            maxlength: [5000, 'Message cannot exceed 5000 characters']
        }
    },
    { timestamps: true }
); // Automatically adds createdAt and updatedAt

// Indexes for common query patterns
ContactSchema.index({ createdAt: -1 }); // For listing contacts by date
ContactSchema.index({ email: 1 }); // For potential lookup by email

export default mongoose.model('Contact', ContactSchema);
