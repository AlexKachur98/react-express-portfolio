/**
 * @file contact.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Contact collection.
 */
import mongoose from 'mongoose';

// Note: This model is based on the 'contact' form fields from Assignment 1
const ContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: 'First name is required'
    },
    lastName: {
        type: String,
        trim: true,
        required: 'Last name is required'
    },
    email: {
        type: String,
        trim: true,
        match: [/.+@.+\..+/, 'Valid email required'],
        required: 'Email is required'
    },
    message: {
        type: String,
        trim: true,
        required: 'Message is required'
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('Contact', ContactSchema);
