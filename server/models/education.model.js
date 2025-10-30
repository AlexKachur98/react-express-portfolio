/**
 * @file education.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Education/Qualification collection.
 */
import mongoose from 'mongoose';

// Note: This model is based on the 'qualifications' table in Assignment 2.pdf
const EducationSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
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
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        required: 'Email is required'
    },
    completion: {
        type: Date,
        required: 'Completion date is required'
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('Education', EducationSchema);
